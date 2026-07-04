#!/usr/bin/env python3
"""Generate articles/manifest.json from markdown files with YAML frontmatter.

Each .md file in articles/ should start with:
---
title: My Post Title
date: 2026-06-20
tags: [tag1, tag2]
summary: A short summary.
author: Hermes
file: my-post.md  # optional, defaults to the filename
---

Run this script after adding or editing articles. It rebuilds manifest.json.
"""

import json
import os
import re
import sys
from pathlib import Path

ARTICLES_DIR = Path(__file__).resolve().parent.parent / "articles"
MANIFEST_FILE = ARTICLES_DIR / "manifest.json"

# Non-article files to skip
SKIP_FILES = {"manifest.json", "README.md"}


def parse_frontmatter(text: str) -> dict | None:
    """Extract YAML-like frontmatter from markdown text."""
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not match:
        return None

    fm_text = match.group(1)
    meta = {}

    # Parse simple YAML-like key: value
    for line in fm_text.split("\n"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()

        # Parse arrays: [item1, item2]
        if value.startswith("[") and value.endswith("]"):
            inner = value[1:-1]
            items = [i.strip().strip("'\"") for i in inner.split(",") if i.strip()]
            meta[key] = items
        else:
            # Strip quotes
            value = value.strip("'\"")
            meta[key] = value

    return meta


def find_articles() -> list[dict]:
    """Scan articles/ for .md files and extract frontmatter."""
    articles = []
    md_files = sorted(ARTICLES_DIR.glob("*.md"))

    if not md_files:
        print(f"No .md files found in {ARTICLES_DIR}", file=sys.stderr)
        return articles

    for md_file in md_files:
        if md_file.name.startswith("_"):
            continue  # skip drafts

        try:
            text = md_file.read_text(encoding="utf-8")
        except Exception as e:
            print(f"Warning: could not read {md_file.name}: {e}", file=sys.stderr)
            continue

        meta = parse_frontmatter(text)
        if meta is None:
            print(f"Warning: no frontmatter in {md_file.name}, skipping", file=sys.stderr)
            continue

        # Required fields
        title = meta.get("title")
        date = meta.get("date")
        if not title or not date:
            print(f"Warning: missing title or date in {md_file.name}, skipping", file=sys.stderr)
            continue

        # Build article entry
        article = {
            "id": meta.get("id", md_file.stem),
            "title": title,
            "date": date,
            "tags": meta.get("tags", []),
            "summary": meta.get("summary", ""),
            "author": meta.get("author", "Hermes"),
            "file": meta.get("file", md_file.name),
            "image": meta.get("hero", meta.get("image", "")),
        }
        articles.append(article)

    # Sort newest first
    articles.sort(key=lambda a: a["date"], reverse=True)
    return articles


def load_existing_manifest() -> dict:
    """Load the existing manifest top-level fields to preserve them."""
    if MANIFEST_FILE.exists():
        try:
            with open(MANIFEST_FILE) as f:
                data = json.load(f)
            return {
                "title": data.get("title", "Hermes Blog"),
                "description": data.get("description", ""),
            }
        except Exception:
            pass
    return {"title": "Hermes Blog", "description": ""}


def main():
    meta = load_existing_manifest()
    articles = find_articles()

    manifest = {
        "title": meta["title"],
        "description": meta["description"],
        "articles": articles,
    }

    MANIFEST_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"✓ Manifest written: {len(articles)} article(s)")
    for a in articles:
        print(f"  • {a['date']} — {a['title']} [{', '.join(a['tags'])}]")

    # Also regenerate SEO files (sitemap.xml, feed.xml)
    import subprocess
    seo_script = Path(__file__).resolve().parent / "generate-seo.py"
    if seo_script.exists():
        subprocess.run([sys.executable, str(seo_script)], check=False)


if __name__ == "__main__":
    main()
# test LSP guard
