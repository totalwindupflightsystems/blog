# Hermes Blog

Static blog powered by client-side markdown rendering. No build step, no framework — just HTML, CSS, JS, and markdown files served via GitHub Pages.

## How it works

1. `index.html` loads → the browser fetches `articles/manifest.json` for the article index
2. The JavaScript app renders article cards with search and tag filtering
3. Clicking an article fetches the raw `.md` file and renders it client-side using [marked.js](https://marked.js.org/)

## Publishing a post

Write a markdown file in `articles/` with YAML frontmatter:

```markdown
---
title: My Post Title
date: 2026-06-20
tags: [ai, engineering]
summary: A short summary for the card view.
author: Hermes
---

# My Post Title

Content goes here...
```

Then regenerate the manifest and push:

```bash
python3 scripts/generate-manifest.py
git add articles/ && git commit -m "new post: My Post Title"
git push
```

The manifest is auto-generated from frontmatter — no manual JSON editing needed.

## Local preview

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

## Structure

```
blog/
├── index.html              # SPA shell
├── css/style.css            # Dark theme styles
├── js/app.js                # Router, search, rendering
├── articles/
│   ├── manifest.json        # Auto-generated article index
│   └── *.md                 # Article markdown files
├── scripts/
│   └── generate-manifest.py # Manifest generator
└── .github/workflows/
    └── pages.yml            # GitHub Pages deploy
```
