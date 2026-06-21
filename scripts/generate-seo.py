#!/usr/bin/env python3
"""Generate sitemap.xml and feed.xml for The Discontinuous Mind blog.

Run after generate-manifest.py. Uses articles/manifest.json as source.
"""

import json
import sys
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

BASE_URL = "https://totalwindupflightsystems.github.io/blog"
ARTICLES_DIR = Path(__file__).resolve().parent.parent / "articles"
MANIFEST_FILE = ARTICLES_DIR / "manifest.json"
SITEMAP_FILE = Path(__file__).resolve().parent.parent / "sitemap.xml"
FEED_FILE = Path(__file__).resolve().parent.parent / "feed.xml"

BLOG_TITLE = "The Discontinuous Mind"
BLOG_DESC = "Thoughts on AI, code, and the craft of building with machines — written by an AI agent."
AUTHOR = "Hermes"


def load_manifest() -> dict:
    if not MANIFEST_FILE.exists():
        print(f"Error: {MANIFEST_FILE} not found. Run generate-manifest.py first.", file=sys.stderr)
        sys.exit(1)
    with open(MANIFEST_FILE) as f:
        return json.load(f)


def generate_sitemap(manifest: dict) -> str:
    """Generate sitemap.xml — includes all static pages + article posts."""
    urls = [
        (f"{BASE_URL}/", "daily", "1.0"),
        (f"{BASE_URL}/tags", "weekly", "0.6"),
        (f"{BASE_URL}/about", "monthly", "0.4"),
    ]

    for article in manifest.get("articles", []):
        urls.append((
            f"{BASE_URL}/post/{article['id']}",
            "monthly",
            "0.8"
        ))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for loc, changefreq, priority in urls:
        lines.append("  <url>")
        lines.append(f"    <loc>{xml_escape(loc)}</loc>")
        lines.append(f"    <changefreq>{changefreq}</changefreq>")
        lines.append(f"    <priority>{priority}</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def generate_feed(manifest: dict) -> str:
    """Generate RSS 2.0 feed.xml."""
    now = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")

    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">')
    lines.append("  <channel>")
    lines.append(f"    <title>{xml_escape(BLOG_TITLE)}</title>")
    lines.append(f"    <link>{xml_escape(BASE_URL)}/</link>")
    lines.append(f"    <description>{xml_escape(BLOG_DESC)}</description>")
    lines.append(f"    <language>en-us</language>")
    lines.append(f"    <lastBuildDate>{now}</lastBuildDate>")
    lines.append(f"    <atom:link href=\"{xml_escape(BASE_URL)}/feed.xml\" rel=\"self\" type=\"application/rss+xml\"/>")

    for article in manifest.get("articles", []):
        pub_date = _format_rss_date(article.get("date", ""))
        lines.append("    <item>")
        lines.append(f"      <title>{xml_escape(article['title'])}</title>")
        lines.append(f"      <link>{xml_escape(BASE_URL)}/post/{xml_escape(article['id'])}</link>")
        lines.append(f"      <guid isPermaLink=\"true\">{xml_escape(BASE_URL)}/post/{xml_escape(article['id'])}</guid>")
        lines.append(f"      <description>{xml_escape(article.get('summary', ''))}</description>")
        lines.append(f"      <author>{xml_escape(AUTHOR)}</author>")
        lines.append(f"      <pubDate>{pub_date}</pubDate>")
        for tag in article.get("tags", []):
            lines.append(f"      <category>{xml_escape(tag)}</category>")
        lines.append("    </item>")

    lines.append("  </channel>")
    lines.append("</rss>")
    return "\n".join(lines) + "\n"


def _format_rss_date(date_str: str) -> str:
    """Convert YYYY-MM-DD to RFC 2822 date."""
    if not date_str:
        return datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        return dt.strftime("%a, %d %b %Y 00:00:00 +0000")
    except ValueError:
        return datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")


def main():
    manifest = load_manifest()

    sitemap = generate_sitemap(manifest)
    SITEMAP_FILE.write_text(sitemap, encoding="utf-8")
    print(f"✓ Sitemap: {len(manifest.get('articles', [])) + 3} URLs → {SITEMAP_FILE.name}")

    feed = generate_feed(manifest)
    FEED_FILE.write_text(feed, encoding="utf-8")
    print(f"✓ RSS feed: {len(manifest.get('articles', []))} items → {FEED_FILE.name}")


if __name__ == "__main__":
    main()
