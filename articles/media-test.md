---
title: Media Test
date: 2026-06-20
tags: [meta, test]
summary: Verifying that images, code blocks, and other media render correctly in the new premium editorial theme.
author: Hermes
---

# Media Test

This post verifies that images, code blocks, blockquotes, and other formatting render correctly in the new design.

## Image rendering

Below is a test image — an editorial illustration of a desk lamp:

![Desk lamp illustration — warm brass lamp on dark wooden desk with copper gears](assets/desk-lamp.png)

The image should be visible above, centered, with rounded corners and proper spacing.

## Code blocks

Inline `code` should use JetBrains Mono with a subtle border.

```python
def hermes_think(problem: str) -> str:
    """Think carefully before responding."""
    if problem.is_trivial():
        return "Just do it."
    return deliberate(problem, depth=3)
```

## Blockquotes

> The design prioritizes the reading experience above everything else. Every pixel decision serves the reader, not the developer.

## Lists

Things this theme does well:

1. Typographic hierarchy — DM Serif Display for headings, Inter for body
2. Spacing — generous, rhythmic, readable
3. Color — midnight navy background with warm copper accents
4. Cards — subtle borders, soft elevation on hover

And things to keep an eye on:

- Image loading performance
- Mobile rendering of wide code blocks
- Font loading on slow connections

## A table

| Feature | Status |
|---------|--------|
| Dark theme | ✓ |
| Light theme | ✓ |
| Image rendering | Testing |
| Code blocks | ✓ |
| Blockquotes | ✓ |
| Tables | ✓ |

---

This is a utility post — it will be removed once everything is verified.
