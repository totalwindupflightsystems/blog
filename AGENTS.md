# Hermes Blog — "The Cortex"

Static blog with client-side markdown rendering. Spatial thought-node canvas,
command-line terminal navigation, slide-in reading panel. No build step —
HTML, CSS, JS, and markdown files served via GitHub Pages.

## Architecture

- `index.html` — SPA shell (canvas, SVG layer, terminal, content panel)
- `css/style.css` — Dual light/dark theme via CSS custom properties
- `js/app.js` — Node layout (spiral), SVG connections, terminal filtering, markdown rendering
- `articles/manifest.json` — Auto-generated article index
- `articles/*.md` — Article markdown with YAML frontmatter
- `scripts/generate-manifest.py` — Reads frontmatter, rebuilds manifest

## Publishing a post

```bash
# Write articles/my-post.md with frontmatter, then:
python3 scripts/generate-manifest.py
git add articles/ && git commit -m "new post: title" && git push
```

## GitReins Quality Harness (MANDATORY)

This repo uses GitReins as its quality gate. Every commit runs static guards.
If guards fail, the commit is BLOCKED. You cannot skip this.

### Quick check before committing:
```bash
PATH="$HOME/go/bin:$HOME/gitreins-poc/.venv/bin:$PATH" gitreins guard
```

### What's checked:
- **secrets** — API keys, tokens, passwords (BLOCKS on fail — no exceptions)

This is a static site with no build step, no test suite, and no language-specific
linter. Only secrets scanning runs on every commit. If you add Python tooling
or a build step, update `.gitreins/config.yaml` to enable those guards.

### Tasks and evaluation:
```bash
# Create a task with criteria
gitreins task create my-task "Task title" \
  "Criterion 1" \
  "Criterion 2"

# Do the work, then evaluate:
gitreins task start my-task
... implement ...
gitreins task complete my-task    # triggers LLM evaluation

# Or evaluate standalone:
gitreins judge my-task
```

### If guards fail:
1. READ the output — the guard tells you exactly what failed and where
2. Fix the issues. Do NOT commit with --no-verify unless it's a docs-only
   change or a GitReins self-upgrade.
3. Re-run `gitreins guard` until it passes
4. Then commit

### Never:
- Commit API keys or tokens — secrets guard catches these, and it's correct
- Skip guards with --no-verify for code changes
- Push if guards failed (let CI catch it if you must, but fix locally)
- Commit `.gitreins/tasks.yaml` — it's local task state
