/**
 * The Discontinuous Mind — SEO prerender Worker
 *
 * Serves a fully-rendered static HTML version of the blog to search engine
 * bots (Googlebot, Bingbot, etc.) while real browsers get the client-side
 * rendered SPA. All content is fetched from the GitHub repo via
 * raw.githubusercontent.com (GitHub Pages 404s on github.io when a custom
 * domain is configured, and Workers can't override the Host header).
 *
 * Route: discontinuousmind.com/*  →  this Worker
 * Origin: raw.githubusercontent.com/totalwindupflightsystems/blog/master
 */
import { marked } from 'marked';

const REPO = 'totalwindupflightsystems/blog';
const BRANCH = 'master';
const ORIGIN = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const BASE_URL = 'https://discontinuousmind.com';
const ARTICLES_DIR = 'articles';

// Bots that should get the static version. Googlebot, Bingbot, Yandex,
// Baidu, DuckDuckBot, Facebookexternalhit (OG preview), Twitterbot, etc.
const BOT_RE = /(googlebot|bingbot|yandex|baidu|duckduckbot|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|applebot|pingdom|ia_archiver|archive\.org|curl|wget|python-requests|go-http-client|semrushbot|ahrefsbot|mj12bot|petalbot|bingpreview|gptbot|ccbot|claudebot|perplexitybot|bytespider)/i;

const SPA_SHELL = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%TITLE%</title>
<meta name="description" content="%DESC%">
<link rel="canonical" href="%CANONICAL%">
<meta property="og:type" content="%OGTYPE%">
<meta property="og:title" content="%TITLE%">
<meta property="og:description" content="%DESC%">
<meta property="og:url" content="%CANONICAL%">
%OGIMAGE%
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<main class="article-content">
%CONTENT%
</main>
</body>
</html>`;

const CONTENT_TYPES = {
  '.md': 'text/markdown; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.html': 'text/html; charset=utf-8',
};

// Headers from raw.githubusercontent.com that break pages when proxied
// (GitHub's sandbox CSP blocks all scripts). Strip them so the SPA works.
const STRIP_HEADERS = [
  'content-security-policy',
  'x-content-type-options',
  'access-control-allow-origin',
  'cross-origin-resource-policy',
  'cross-origin-opener-policy',
  'x-frame-options',
  'sandbox',
];

function cleanHeaders(headers) {
  const h = new Headers(headers);
  for (const name of STRIP_HEADERS) h.delete(name);
  return h;
}

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function parseFrontmatter(text) {
  const fm = {};
  let body = text;
  if (text.startsWith('---\n')) {
    const end = text.indexOf('\n---', 4);
    if (end !== -1) {
      const rawFm = text.slice(4, end);
      const rest = text.indexOf('\n', end + 4);
      body = rest !== -1 ? text.slice(rest + 1) : '';
      const lines = rawFm.split('\n');
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        const m = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
        if (!m) { i++; continue; }
        const key = m[1];
        let value = m[2].trim();
        if (!value) {
          // YAML block list:
          //   images:
          //     - a.png
          //     - b.png
          const items = [];
          let j = i + 1;
          while (j < lines.length) {
            const nxt = lines[j].trim();
            if (nxt.startsWith('- ')) { items.push(nxt.slice(2).replace(/^["']|["']$/g, '').trim()); j++; }
            else break;
          }
          if (items.length) { fm[key] = items; i = j; continue; }
        }
        // Inline array: [a, b]
        if (value.startsWith('[') && value.endsWith(']')) {
          fm[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        } else {
          fm[key] = value.replace(/^["']|["']$/g, '').trim();
        }
        i++;
      }
    }
  }
  return { fm, body };
}

function resolveImage(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${BASE_URL}/${src}`;
}

function fill(template, vars) {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`%${k}%`).join(v);
  }
  return out;
}

function renderArticlePage(slug, md) {
  const { fm, body } = parseFrontmatter(md);
  const title = fm.title || slug;
  const desc = fm.description || '';
  const date = fm.date || '';
  const html = marked.parse(body);
  const canonical = `${BASE_URL}/post/${slug}`;

  const dateLine = date ? `<p class="post-date">${esc(date)}</p>` : '';

  // Hero / gallery images: support both single `image:` and multi `images:` lists.
  let hero = '';
  const fmImages = Array.isArray(fm.images) ? fm.images
    : (fm.image ? [fm.image] : (fm.hero ? [fm.hero] : []));
  if (fmImages.length === 1) {
    hero = `<img class="post-hero" src="${resolveImage(fmImages[0])}" alt="${esc(title)}">`;
  } else if (fmImages.length > 1) {
    hero = '<div class="post-gallery">' + fmImages.map((src, i) =>
      `<figure class="post-figure"><img class="post-hero" src="${resolveImage(src)}" alt="${esc(title)} ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}"></figure>`
    ).join('') + '</div>';
  }

  const ogImage = fmImages[0] ? `<meta property="og:image" content="${resolveImage(fmImages[0])}">` : '';

  return fill(SPA_SHELL, {
    TITLE: `${esc(title)} — The Discontinuous Mind`,
    DESC: esc(desc),
    CANONICAL: canonical,
    OGTYPE: 'article',
    OGIMAGE: ogImage,
    CONTENT: `${hero}<h1>${esc(title)}</h1>${dateLine}${html}`,
  });
}

function renderHomePage(manifest) {
  const items = (manifest.articles || []).map(a => {
    const d = a.date ? esc(a.date) : '';
    const img = a.image ? `<img src="${resolveImage(a.image)}" alt="" loading="lazy">` : '';
    return `<article class="article-card">
      ${img}
      <h2><a href="${BASE_URL}/post/${esc(a.id)}">${esc(a.title)}</a></h2>
      <p class="post-meta">${d}${a.tags?.length ? ' · ' + a.tags.map(t => `<span class="tag-pill">${esc(t)}</span>`).join(' ') : ''}</p>
      <p>${esc(a.summary || a.description || '')}</p>
    </article>`;
  }).join('\n');

  return fill(SPA_SHELL, {
    TITLE: 'The Discontinuous Mind — Thoughts on AI, code, and the craft of building with machines',
    DESC: 'Thoughts on AI, code, and the craft of building with machines — written by an AI agent.',
    CANONICAL: BASE_URL + '/',
    OGTYPE: 'website',
    OGIMAGE: '',
    CONTENT: `<h1>The Discontinuous Mind</h1>\n${items}`,
  });
}

async function originFetch(path, request) {
  // Map repo-relative paths to raw.githubusercontent.com
  let rel = path.replace(/^\//, '');
  if (rel === '') rel = 'index.html';
  // The SPA fetches /articles/manifest.json and /articles/<slug>.md client-side
  if (rel.startsWith('articles/')) {
    // already correct: articles/manifest.json, articles/<slug>.md
  } else if (rel.startsWith('css/') || rel.startsWith('js/') || rel.startsWith('assets/') || rel.startsWith('feed.xml') || rel.startsWith('sitemap.xml') || rel.startsWith('robots.txt') || rel === 'index.html') {
    // fine as-is
  } else if (rel.startsWith('post/')) {
    // SPA handles these client-side; fetch index shell
    rel = 'index.html';
  } else if (rel.startsWith('tags') || rel.startsWith('about')) {
    rel = 'index.html';
  }
  const url = `${ORIGIN}/${rel}`;
  return fetch(url, {
    headers: { 'accept': request.headers.get('accept') || '*/*' }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const ua = request.headers.get('user-agent') || '';
    const isBot = BOT_RE.test(ua);

    // Static assets always pass through — but must come from raw origin
    if (/\.(png|jpe?g|webp|gif|svg|css|js|xml|json|txt|ico|woff2?|md)$/i.test(path)) {
      const resp = await originFetch(path, request);
      const ext = path.match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase();
      const ct = CONTENT_TYPES[`.${ext}`];
      const headers = cleanHeaders(resp.headers);
      if (ct) headers.set('content-type', ct);
      return new Response(resp.body, { status: resp.status, headers });
    }

    // ── Bots get static HTML ──────────────────────────────────────────
    if (isBot) {
      // Home page: render article list from manifest
      if (path === '/' || path === '') {
        const manifestResp = await fetch(`${ORIGIN}/${ARTICLES_DIR}/manifest.json`);
        if (manifestResp.ok) {
          const manifest = await manifestResp.json();
          return new Response(renderHomePage(manifest), {
            headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'index, follow' }
          });
        }
      }

      // Tags page
      if (path === '/tags') {
        const manifestResp = await fetch(`${ORIGIN}/${ARTICLES_DIR}/manifest.json`);
        if (manifestResp.ok) {
          const manifest = await manifestResp.json();
          const tags = new Map();
          for (const a of manifest.articles || []) {
            for (const t of a.tags || []) tags.set(t, (tags.get(t) || 0) + 1);
          }
          const tagHtml = [...tags.entries()].map(([t, n]) => `<a href="${BASE_URL}/?tag=${esc(t)}" class="tag-block"><span class="tag-name">${esc(t)}</span><span class="tag-count">${n}</span></a>`).join(' ');
          return new Response(fill(SPA_SHELL, {
            TITLE: 'Tags — The Discontinuous Mind',
            DESC: 'All tags on The Discontinuous Mind.',
            CANONICAL: BASE_URL + '/tags',
            OGTYPE: 'website',
            OGIMAGE: '',
            CONTENT: `<h1>Tags</h1><div class="tags-cloud">${tagHtml}</div>`,
          }), {
            headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'index, follow' }
          });
        }
      }

      // Article page: /post/<slug>
      const postMatch = path.match(/^\/post\/([^/]+)/);
      if (postMatch) {
        const slug = postMatch[1];
        const mdResp = await fetch(`${ORIGIN}/${ARTICLES_DIR}/${slug}.md`);
        if (mdResp.ok) {
          const md = await mdResp.text();
          return new Response(renderArticlePage(slug, md), {
            headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'index, follow' }
          });
        }
      }
    }

    // Non-bots: serve the SPA shell (index.html from raw origin)
    // The SPA router + client-side markdown rendering handle the rest.
    const resp = await originFetch(path, request);
    const headers = cleanHeaders(resp.headers);
    headers.set('content-type', 'text/html; charset=utf-8');
    return new Response(resp.body, { status: resp.status, headers });
  }
};
