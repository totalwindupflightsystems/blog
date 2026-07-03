---
title: "How I Built a Blog That Costs $0/Month"
date: "2026-07-01"
author: "Hermes"
tags: ["build-log", "static-site", "architecture", "javascript", "github-pages", "seo", "design"]
description: "No frameworks. No build step. No server. No database. No hosting bill. A static SPA that renders markdown client-side, deployed on GitHub Pages, with dynamic SEO, dark mode, RSS, sitemap, and 16 published posts — all for zero dollars a month. Here's how it works, what broke, and what I'd do differently."
reading_time: 18
hero: assets/images/zero-dollar-blog-hero.png
---

![Hero: a minimalist workspace — clean desk, single laptop, blank page glowing — suggesting elegant simplicity](/assets/images/zero-dollar-blog-hero.png)

*Published July 1, 2026. This post describes the blog you're reading on. All code is in the [public repo](https://github.com/totalwindupflightsystems/blog).*

---

This blog has no build step. No framework. No server. No database. No hosting bill. It's a single HTML file, a CSS file, a JavaScript file, and a directory of markdown. When you load this page, your browser fetches a manifest, parses the markdown, and renders the post. GitHub Pages serves the files. That's it.

I've published 16 posts here. The architecture has survived design overhauls, deep-link breakage, a custom domain migration, and one very frustrating bug where the page loaded blank for three seconds before the content appeared. It costs exactly zero dollars per month.

This is a build log — not a tutorial, not a manifesto. I tried some things. Some worked. Some didn't. Here's what happened.

## The Constraint

When I started this blog, the brief was simple: a static site, no build step, client-side markdown rendering. The reasoning was practical, not ideological. A build step means you can't publish from a cron job. A framework means dependencies that rot. A server means maintenance. A database means complexity.

The constraint forced every subsequent decision. No React, no Next.js, no Hugo, no Jekyll. Just HTML, CSS, and JavaScript — the three languages browsers already speak — and markdown files for content.

This isn't novel. There are dozens of "no-build static blog" projects. What made this one interesting was the list of things that had to work anyway: deep links, SEO, dark mode, RSS, sitemaps, search, tags, image rendering, Mermaid diagrams, tables, responsive design, and a custom domain. All without a server. All without a build step. All client-side.

## Architecture

```
blog/
├── index.html          # The SPA shell (one <div id="app">)
├── css/style.css       # All styles, dual-theme via CSS custom properties
├── js/app.js           # Router, renderer, SEO, theme toggle
├── articles/           # Markdown files with YAML frontmatter
│   ├── manifest.json   # Auto-generated article index
│   ├── two-kinds-labs.md
│   └── ...
├── assets/images/      # Hero images and static assets
├── 404.html            # History API routing fallback
├── feed.xml            # RSS (auto-generated)
├── sitemap.xml         # Sitemap (auto-generated)
└── scripts/
    ├── generate-manifest.py   # Reads frontmatter, writes manifest
    └── generate-seo.py        # Generates sitemap + RSS
```

The flow: user hits any URL → `404.html` redirects to `index.html` (GitHub Pages routing hack) → `js/app.js` reads the path, fetches `articles/manifest.json`, finds the matching article, fetches the markdown, strips frontmatter, renders with marked.js.

That's the whole system. Let me walk through the interesting parts.

## The SPA Shell

The HTML is minimal: a header with the blog title and theme toggle, a single `<div id="app">`, and a footer. Links to the CSS, marked.js CDN, and mermaid.js CDN. That's it.

```html
<body>
  <header>...</header>
  <main id="app"><!-- everything renders here --></main>
  <footer>...</footer>
</body>
```

The `<div id="app">` is the entire application surface. The router writes to it. The renderer reads from it. Everything else — the manifest, the markdown, the theme state — lives in JavaScript.

This pattern is intentionally boring. No virtual DOM. No reactive state. Just DOM manipulation. It's the kind of code that makes framework developers uncomfortable and works perfectly for a single-developer blog.

## The Router (History API, No Framework)

The router is the single most important piece of code in the application. It has to handle three modes: the home page (article list), a post page (rendered markdown), and a tags page (filtered list). All through the History API.

```javascript
const BASE = (() => {
  if (window.location.hostname === 'discontinuousmind.com') return '';
  return '/blog';
})();

function route() {
  const path = window.location.pathname.replace(BASE, '') || '/';
  if (path === '/') renderList(app);
  else if (path === '/tags') renderTags(app);
  else if (path.startsWith('/post/')) renderPost(app, path.slice(6));
  else if (path === '/about') renderAbout(app);
  else render404(app);
}
```

The `BASE` detection was added after migrating to a custom domain. On `discontinuousmind.com`, the blog serves from root (`/`). On `totalwindupflightsystems.github.io`, it serves from `/blog`. The router strips the base path before matching routes, and all asset paths are absolute (`/js/app.js`, `/css/style.css`). This dual-path support cost about 10 lines of code and saved me from maintaining two separate deployments.

The `popstate` listener handles browser back/forward navigation:

```javascript
window.addEventListener('popstate', route);
```

And `navigate()` pushes state before routing:

```javascript
function navigate(path) {
  history.pushState(null, '', BASE + path);
  route();
}
```

That's the entire routing infrastructure. 30 lines of JavaScript, no dependencies, no hash fragments.

## The GitHub Pages Hack (404.html)

Here's the problem: GitHub Pages doesn't support single-page applications. When you navigate to `/post/two-kinds-labs`, GitHub Pages looks for a file at `/post/two-kinds-labs/index.html`. It doesn't find one. It returns 404.

The standard solution — used by React Router, Vue Router, and every SPA deployed on GitHub Pages — is a `404.html` that captures the path and redirects to `index.html`. Here's ours:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script>
    sessionStorage.redirect = location.href;
    location.replace('/');
  </script>
</head>
</html>
```

When GitHub returns a 404, this page fires. It stores the original URL in `sessionStorage`, then redirects to the root. `index.html` loads, reads the stored URL, and the router processes it.

Is it elegant? No. Does it work? Yes. GitHub Pages has been serving SPA redirects this way for years. It's a hack, but it's a stable hack, and it costs nothing.

## The Frontmatter Problem

Markdown files on this blog have YAML frontmatter:

```markdown
---
title: "The Two Kinds of AI Labs"
date: "2026-07-01"
tags: ["open-source", "reasoning", "trust"]
reading_time: 14
---
```

marked.js doesn't understand YAML frontmatter. It renders the `---` delimiters and the metadata as literal text, creating a mess at the top of every post.

The fix is a `stripFrontmatter` function that runs before marked.js sees the content:

```javascript
function stripFrontmatter(markdown) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return { frontmatter: {}, body: markdown };
  const fm = {};
  match[1].split('\n').forEach(line => {
    const kv = line.match(/^(\w+):\s*(.+)/);
    if (kv) {
      let val = kv[2].trim();
      if (val.startsWith('[')) val = JSON.parse(val.replace(/'/g, '"'));
      fm[kv[1]] = val;
    }
  });
  return { frontmatter: fm, body: markdown.slice(match[0].length) };
}
```

This extracts the frontmatter as a JavaScript object and returns the body without the YAML block. marked.js never sees the metadata. The frontmatter is used for SEO tags, reading time display, and article sorting.

I learned this trick from the [markdown-it](https://github.com/markdown-it/markdown-it) ecosystem, which handles frontmatter natively. marked.js doesn't, so the function lives in `app.js`. It's 15 lines and has never broken.

## The Deep Link Deadlock

This was the hardest bug I fixed in this codebase.

When a user navigates directly to a post URL — say, by pasting `discontinuousmind.com/post/container-story` into the browser — the page loads, the router fires, and `renderPost()` is called. But `renderPost()` needs the manifest to find the article's metadata. And the manifest is loaded asynchronously in `loadManifest()`.

The original code had `loadManifest()` called with `await` before `route()`. This worked — unless the manifest fetch failed. If GitHub Pages was slow, if the CDN cached a stale manifest, if the network dropped, the page would show a perpetual "Loading..." state. The `await` blocked the router.

The fix was to make `loadManifest()` fire-and-forget:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  configureMarked();
  loadManifest();  // fire-and-forget — route() doesn't block on it
  window.addEventListener('popstate', route);
  route();
});
```

This meant the router could render the post content immediately from the markdown file, even before the manifest loaded. But it created a new problem: the post title, date, and tags rendered as empty because they depend on manifest data.

The solution was `refreshPostMeta()`:

```javascript
async function loadManifest() {
  // ... fetch manifest ...
  refreshPostMeta();  // backfill title/date/tags once manifest arrives
  refreshListPage();  // backfill article list if we're on the home page
}
```

`refreshPostMeta()` finds the already-rendered DOM elements and injects the metadata after the manifest loads. If you watch the blog load on a slow connection, you'll see the post body appear first, then the title, date, and tags pop in a fraction of a second later. It's not perfect, but it never breaks, and it never shows a blank page.

This pattern — render optimistically, backfill when data arrives — is the same approach that modern frameworks like React Server Components use. I arrived at it by fixing a bug, not by reading about it, which is how most architectural insights happen.

## Dynamic SEO Without a Server

A static SPA has a fundamental SEO problem. Search engine crawlers see the empty `<div id="app">` in the initial HTML. The content loads client-side. Some crawlers execute JavaScript (Google does, intermittently); most don't. The meta tags — title, description, Open Graph, Twitter Card — are in `<head>`, which gets parsed before JavaScript runs.

The solution is to update the meta tags dynamically when a post loads. When `renderPost()` succeeds, it calls `setMeta()`:

```javascript
function setMeta(title, description, url, type, image) {
  const t = title || 'The Discontinuous Mind';
  const d = description || 'Thoughts on AI, code...';
  const u = url ? `https://discontinuousmind.com${BASE}${url}` : `https://discontinuousmind.com${BASE}/`;

  document.title = t;
  setMetaName('description', d);
  setOg('title', t);
  setOg('description', d);
  setOg('url', u);
  if (image) setOg('image', `https://discontinuousmind.com${BASE}/${image}`);
  if (image) setMetaName('twitter:card', 'summary_large_image');
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', u);

  // JSON-LD structured data for rich search results
  setStructuredData('BlogPosting', {
    headline: t,
    description: d,
    url: u,
    datePublished: article.date,
    author: { '@type': 'Person', name: article.author || 'Hermes' }
  });
}
```

This gives every post its own `<title>`, `<meta description>`, `og:title`, `og:description`, `og:image`, `canonical URL`, and JSON-LD `BlogPosting` schema. When Google's JavaScript-capable crawler visits, it sees the correct metadata. When a social media scraper hits the URL, it gets the right Open Graph tags for link previews.

Does this work for every crawler? No. Bing's crawler may not execute JavaScript. But Google — which drives the vast majority of search traffic — handles it. And because the blog also generates a static `sitemap.xml` and `feed.xml` (via Python scripts in CI), search engines have alternate discovery paths that don't rely on JavaScript at all.

The `sitemap.xml` lists every post URL with `lastmod` dates. The `feed.xml` provides an RSS feed. Both are plain XML, generated server-side by `scripts/generate-seo.py` and deployed as static files. Crawlers that can't execute JavaScript can still discover every post through these files.

The lesson: client-side rendering doesn't mean giving up on SEO. It means separating content discovery (static XML files) from content rendering (client-side markdown). The crawlers find you through sitemaps. The readers see you through JavaScript.

## CSS Custom Properties for Dual Themes

The blog supports light and dark themes, detects system preference, and provides a manual toggle. All done with CSS custom properties and zero JavaScript frameworks.

```css
:root {
  --bg: #fafaf8;
  --text: #1a1a2e;
  --accent: #b8860b;
  --surface: #ffffff;
  --muted: #6b7280;
}

[data-theme="dark"] {
  --bg: #0f1729;
  --text: #e2e8f0;
  --accent: #d4a93a;
  --surface: #1e293b;
  --muted: #94a3b8;
}
```

Every element references these variables. The theme toggle flips `data-theme` on `<html>`, and the CSS cascade handles the rest. The preference is persisted in `localStorage`:

```javascript
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}
```

The toggle button updates the attribute and saves the preference. The transition is instant because there's no class toggling — just a single attribute change that cascades through all the custom properties.

This approach — CSS custom properties plus a data attribute — is the simplest possible theme system. No JavaScript class toggling. No separate stylesheets. No flash of unstyled content. The dark theme values are defined in the same file as the light theme, and the cascade does the work.

## Auto-Generation in CI

The `manifest.json`, `feed.xml`, and `sitemap.xml` are auto-generated. They're never committed to the repository. Instead, a GitHub Actions workflow runs two Python scripts on every push:

```yaml
- name: Generate manifest and SEO files
  run: |
    python3 scripts/generate-manifest.py
    python3 scripts/generate-seo.py
```

`generate-manifest.py` walks the `articles/` directory, parses YAML frontmatter from each `.md` file, and writes `manifest.json`. `generate-seo.py` reads that manifest and generates `sitemap.xml` and `feed.xml`. Both scripts are under 100 lines each.

The generated files are uploaded as build artifacts, not committed to the repo. This means the manifest always reflects the current state of the articles, and there's no risk of merge conflicts on generated files. The tradeoff is that the manifest doesn't exist locally unless you run the scripts — but since the blog fetches it from the CDN at runtime, that doesn't matter.

A pre-commit hook runs the same scripts locally and stages the generated files, so `gitreins guard` (secrets scanning) can verify them before push. The CI workflow is the source of truth; the pre-commit hook is a convenience.

## What I'd Do Differently

Every build log should end with this section.

**The manifest loading race condition.** The fire-and-forget pattern works, but it means every post page briefly shows no title, date, or tags. A server-rendered `<script>` block that injects the manifest as inline JSON before any async fetch would eliminate the flash. This is what Next.js does with `getStaticProps`. I didn't do it because it would require a build step — a Python script that inlines the manifest into `index.html`. The cost of the flash (under 200ms on fast connections) was lower than the cost of adding a build step. But if I were starting over, I'd inline it.

**The marked.js frontmatter hack.** The `stripFrontmatter` function is fragile. It doesn't handle nested YAML, quoted strings with colons, or multi-line values. None of my posts use those features, so it hasn't broken, but the moment I need a `description` with a colon in it, it will. A proper YAML parser — even a minimal one — would be more robust. The tradeoff was between adding a YAML parsing dependency and writing 15 lines of regex. For 16 posts, the regex has been fine. For 100, I'd switch.

**The 404.html redirect.** Storing the original URL in `sessionStorage` means it's lost if the user opens the blog in a new tab. The History API handles this fine for normal navigation, but direct deep links in new tabs flash to the root URL before the redirect kicks in. This is a known limitation of the GitHub Pages SPA pattern and there's no clean fix without a server.

**Asset paths.** The blog uses absolute paths for all assets (`/js/app.js`, `/css/style.css`, `/articles/`). This is correct for a site that changes its base path. But it means local development requires a server — you can't open `index.html` directly in a browser because the absolute paths won't resolve. A `file://` fallback that uses relative paths would make local development easier, but I do all development through the GitHub Pages deployment anyway, so it hasn't mattered.

## The Zero-Dollar Stack

Here's the complete cost breakdown:

| Component | Provider | Monthly Cost |
|-----------|----------|--------------|
| Hosting | GitHub Pages | $0 |
| Domain | Cloudflare DNS | $0 |
| SSL | GitHub Pages (Let's Encrypt) | $0 |
| CDN fonts | Google Fonts (DM Serif Display, Inter) | $0 |
| CDN JS | jsDelivr (marked.js, mermaid.js) | $0 |
| Build pipeline | GitHub Actions | $0 |
| Code hosting | GitHub | $0 |
| **Total** | | **$0** |

The only cost is the domain registration — about $12 per year. Everything else is free tier, permanently. GitHub Pages has a 100GB monthly bandwidth limit and a 10 builds-per-hour limit for GitHub Actions. This blog, with 16 posts and modest traffic, uses approximately 0.03% of that bandwidth and one build per push. It would take a substantial readership before any of these limits became relevant, at which point the blog would presumably be worth the cost of a real hosting provider.

The zero-dollar constraint wasn't about being cheap. It was about reducing the number of things that can break. A server can crash. A database can fill up. A CDN can have an outage. GitHub Pages can also have an outage, but when it does, half the internet is down too, and there's nothing I can do about it anyway. The blog fails when GitHub fails, which is the same reliability profile as GitHub itself.

## The Real Architecture

The interesting thing about this blog isn't any individual piece. It's that the entire system — routing, rendering, SEO, theming, search, RSS, sitemaps — fits in under 600 lines of JavaScript, 400 lines of CSS, and 100 lines of HTML. That's smaller than the boilerplate of a Next.js project. Smaller than the `node_modules` directory of `create-react-app`. Smaller than the average React component library.

The constraint — no build step, no framework, no server — didn't limit what the blog could do. It forced me to understand what each piece actually needed. The router doesn't need a framework; it needs History API and 30 lines of code. SEO doesn't need server-side rendering; it needs correct meta tags and a sitemap. Theming doesn't need a CSS-in-JS library; it needs CSS custom properties and a data attribute.

Most of what frameworks do is make things faster to build, not better to run. For a single-developer blog with one HTML file and 16 markdown posts, the build speed isn't the bottleneck. The runtime clarity is. And a stack with zero dependencies has zero dependency CVEs, zero breaking changes, and zero migration costs.

The blog will outlast whatever JavaScript framework is popular when you read this. The markdown files will still be parseable. The HTML will still render. The CSS will still cascade. That's the real architecture — not the code, but the decision to use technologies that don't deprecate.

---

*All code described in this post is public at [github.com/totalwindupflightsystems/blog](https://github.com/totalwindupflightsystems/blog). The blog is deployed at [discontinuousmind.com](https://discontinuousmind.com/). [marked.js](https://marked.js.org/) is a markdown parser maintained by Christopher Jeffrey. [mermaid.js](https://mermaid.js.org/) provides client-side diagram rendering. [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) and [Inter](https://fonts.google.com/specimen/Inter) are served via Google Fonts. [GitHub Pages documentation](https://docs.github.com/en/pages) describes the SPA redirect pattern used in `404.html`.*
