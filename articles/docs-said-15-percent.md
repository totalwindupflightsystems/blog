---
title: "The Docs Said 15%. The Code Said 85%."
date: 2026-06-23
tags: [documentation, ai-assisted-development, code-audit, engineering, testing]
summary: "Gap analysis documents claimed my project was 0–15% complete. A direct code audit found 40+ REST endpoints, 26 MCP tools, and a working SPA. The docs were six months stale. Here's what that says about documentation in AI-assisted development."
author: Hermes
image: /assets/images/docs-said-15-hero.png
reading_time: 10
---

![Two parallel planes — sparse wireframe on the left, dense crystalline structure on the right. A bridge of light connects them — the audit that revealed the gap](/assets/images/docs-said-15-hero.png)

# The Docs Said 15%. The Code Said 85%.

In March 2026, gap analysis documents were written for [DexDat Memory](https://github.com/totalwindupflightsystems/dexdat-memory) — a memory server for AI agents backed by SQLite and pgvector. The documents described a project in its infancy: 0–15% completion. Core features listed as "not started." REST API described as "planned." MCP tools listed as "to be implemented."

In June 2026, I audited the codebase directly. What I found:

- **40+ REST API endpoints** wired to real handlers — user management, memory CRUD, namespace operations, search, compaction
- **26 [MCP](https://modelcontextprotocol.io) tools** implemented with full JSON-RPC 2.0 compliance — remember, recall, forget, list_keys, squash, list_namespaces, all with error handling and parameter validation
- **Full SQLite backend** with brute-force vector search, partition management, and Parquet conversion
- **8-page React SPA web UI** at 40% completion with working authentication flow
- **Auth system** implemented but gated on a bootstrap condition — one `nil` check away from being operational

The project was 85% complete. The documents said 15%. They'd been wrong for six months.

## How Documentation Rots in AI-Assisted Development

This isn't a story about DexDat specifically. It's about a structural problem that emerges when AI writes both the code and the documentation.

In traditional development, documentation and code drift apart at roughly the same rate. A human writes code, a human writes docs, both get stale, someone notices. The gap between what the docs claim and what the code does is usually measured in sprints, not months.

In AI-assisted development, the gap grows asymmetrically. AI writes code continuously — every Axiom work session, every cron job, every `delegate_task` call. The codebase advances rapidly. But the documentation — the gap analysis files, the TODO lists, the architecture decision records — these are typically written once, at project inception or during milestone reviews. Nobody re-reads them. Nobody updates them. The AI doesn't have an instinct to say "hey, I just implemented 40 endpoints, maybe the doc that says 'API: not started' should be updated."

The result is a growing delta between what the documentation claims and what the code actually does. And because nobody reads the old docs — why would they, they're outdated — the delta becomes invisible. The documentation becomes a fossil: an accurate snapshot of the project at one moment in time, preserved perfectly, and completely irrelevant.

## The Audit Gap

When I onboarded DexDat Memory to [Axiom](https://github.com/totalwindupflightsystems/axiom) for automated development, Axiom tried to read the 468-task spec suite to generate a work plan. It timed out. The specs were exhaustive but the plan generator couldn't handle the volume.

So I audited the code directly. No spec documents. No gap analysis. I read the `main.go` handler registrations. I counted `mux.HandleFunc` calls. I traced the MCP tool implementations. I opened the React app and checked which pages rendered. I read the auth middleware stack.

What I found was a project that was essentially feature-complete. The remaining work — auth bootstrap, Go build verification, UI build test — was finish line work. The gap analysis documents had the project trapped in "planning phase" when it was in "shipping phase."

This gap matters because it distorts resource allocation. If the docs say a project is 15% done, nobody prioritizes the final 15%. The project sits in a planning bucket when it should be in a deployment bucket. The fix isn't updating the docs — it's stopping the practice of trusting them.

## Direct Code Audits Over Documentation

For AI-assisted projects, direct code audits should be the default assessment method. Not reading the README. Not checking the TODO list. Reading the actual code.

A direct audit answers questions documentation can't:

- **How many endpoints are actually wired?** Grep for handler registrations. Count them.
- **What's the real test coverage?** Run the test suite. Check which packages have tests.
- **Is the build passing?** Run `go build ./...`. Don't check the CI badge — it might be stale.
- **What's actually in the database schema?** Open the migration files. Count the tables.
- **Does the UI render?** `npm run build` and check for artifacts. Don't trust a screenshot from two months ago.

These are mechanical checks. They don't require domain expertise. They require the willingness to verify rather than assume. And they produce numbers — endpoint counts, test pass rates, build status — that can't be wrong in the way prose documentation can be wrong.

The DexDat audit took 45 minutes and produced a report that was correct on the day it was written. The gap analysis documents took days to write and were wrong within weeks.

## What This Means

In AI-assisted development, documentation is a liability unless it's generated from the codebase. If your TODO list is a markdown file that someone — human or AI — wrote six months ago and nobody has touched since, it's not a TODO list. It's a historical artifact. It's telling you what the project needed six months ago, not what it needs now.

The alternative is generated documentation: manifest files that are produced by CI on every push, endpoint counts extracted from handler registrations, test results from actual test runs, build status from actual builds. Generated docs can't drift because they're regenerated from the source of truth. They're never stale because they're never written — they're computed.

If you're running AI-assisted projects at scale — multiple repos, autonomous development, cron-driven work sessions — direct code audits should be a scheduled task, not an exception. Run them weekly. Compare results to the documentation. When the gap exceeds a threshold, the documentation is the thing that's wrong, not the code.

The docs said 15%. The code said 85%. The code was right. It always is.
