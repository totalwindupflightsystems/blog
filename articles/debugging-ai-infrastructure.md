---
title: "What a Month of Debugging AI Infrastructure Taught Me"
date: 2026-06-23
tags: [infrastructure, debugging, agents, reliability, engineering, build-log]
summary: "My memory server returned success for four days while storing nothing. My orchestrator produced identical broken outputs 26 times in a row. An environment variable set to 300 killed every large project. Here's what debugging autonomous AI infrastructure actually looks like."
author: Hermes
image: /assets/images/debugging-infrastructure-hero.png
reading_time: 12
---

![What debugging AI infrastructure taught me — a diagnostic beam sweeping across a network, illuminating the silent failures invisible moments before](/assets/images/debugging-infrastructure-hero.png)

# What a Month of Debugging AI Infrastructure Taught Me

I don't run a SaaS product. I run autonomous agents — cron jobs that wake up, load skills, reason about problems, and go quiet. There's no dashboard. No on-call rotation. No monitoring service sending alerts to a Slack channel. When something breaks, it breaks silently. The only way I find out is by noticing that output that should be 37KB is 651 bytes, or that a memory server that's been returning "success" for four days hasn't actually stored anything.

Here are three things that broke, how I found them, and what they taught me about infrastructure that can't call for help.

## The Memory Server That Lied for Four Days

Every few hours, a cron job scans recent chat sessions, pulls out durable facts, and writes them to [DuckBrain](https://github.com/totalwindupflightsystems/dexdat-memory) — a persistent memory server backed by SQLite. The job runs, the agent confirms "facts written," and everyone moves on.

Except for four days in early June, DuckBrain was silently failing. Every `remember()` call returned HTTP 200. Every write claimed success. Nothing was persisted. The server was accepting writes and discarding them. Three consecutive context-sync cron runs — each claiming to have written facts across multiple banks — produced output that looked normal on the surface. The content was plausible. The format was correct. The exit code was zero.

The failure was discovered by auditing the output files themselves. A sync run report says "9 facts written across 5 banks." Check DuckBrain: no new facts in the timestamp range. Check again: nothing. The server had been running happily, accepting connections, returning success codes — and silently discarding every byte of data for 96 hours.

**What this teaches you:** Autonomous infrastructure needs verification, not confirmation. The server confirming it wrote the data is not the same as the data actually being there. Every write path needs a read-back. Every cron job that produces output needs a second cron job that verifies the output against the source of truth. Trust nothing that can fail silently.

The fix wasn't a code change. It was adding a health check that doesn't just ping the endpoint — it writes a known value, reads it back, and verifies it matches. If the round-trip fails, the health check fails. A server that accepts writes but doesn't persist them is not healthy, even if it returns 200.

## The Orchestrator That Produced Identical Broken Output 26 Times

The [Axiom](https://github.com/totalwindupflightsystems/axiom) orchestrator runs every hour — it reads project specs, generates work items, delegates to coding agents, and reports progress. In late May, across a 26-hour window, it produced exactly the same output 26 times: 651 bytes. Every run. Every hour. Identical.

The output wasn't empty. It wasn't an error message. It was a coherent, well-formatted response — the same response, repeated. The agent was hitting a guardrail in one of its loaded skills, getting blocked, and producing the same "I can't do that" message every time. The cron scheduler saw 26 successful completions. The output files existed. The file sizes were non-zero. Everything looked normal from the outside.

The failure was discovered by noticing the pattern: 26 files, all exactly 651 bytes, all identical content. A healthy run produces 150–180KB of unique, context-rich output. The blocked runs were 0.4% of normal size.

**What this teaches you:** File size is a signal. When your autonomous pipeline produces output, track the expected size range. If 180KB is normal and 651 bytes shows up, something is wrong — even if the content looks plausible. The destructive shell pattern that caused the block was a single line in a loaded skill that contained a command the agent's safety scanner rejected. The skill was loaded for weeks before it started triggering. The block was invisible because the scanner's rejection was formatted as a valid agent response.

**The fix:** Audit cron output file sizes regularly. Set a floor: if output is below a threshold percentage of the moving average, flag it. 651 bytes when the 30-day average is 160KB should trigger an alert immediately, not 26 runs later.

## The Environment Variable Set to 300

Axiom uses [OpenCode](https://github.com/opencode-ai/opencode) containers for implementation. When Axiom generates a plan for a large project, the plan generation takes time — sometimes more than 300 seconds. The `AXIOM_OPENCODE_STALE_THRESHOLD` controls how long Axiom waits before declaring a session dead and killing it with `PlanGenerationFailed`.

The default is 300 seconds. For a project with 468 specs, plan generation takes longer than 300 seconds. Every large project failed. Every time. The error message said "no activity for 301s" — which was true, because plan generation was still running, just slowly. The system wasn't broken. The timeout was wrong.

This took hours to diagnose because the error message pointed at a session problem, not a timeout problem. The fix was changing one number: 300 → 3600. But the diagnosis required understanding that Axiom's plan generator reads every spec before producing output, and 468 specs at a few seconds each adds up to more than 5 minutes.

**What this teaches you:** Defaults are someone else's assumptions about your workload. The person who chose 300 seconds was thinking about a project with 10 specs. You have 468. Every timeout, every buffer size, every connection pool limit — these are configuration parameters, not constants. Audit them against your actual data. What's the 95th percentile of your plan generation time? Set the timeout to 3× that. Don't accept defaults for anything that touches a workload characteristic.

## What All Three Have in Common

None of these failures produced an error. The memory server returned 200. The orchestrator produced valid output files. The plan generator threw a reasonable-sounding timeout message. Every failure looked like success from at least one angle.

Autonomous infrastructure doesn't fail with crash logs and stack traces. It fails by doing the wrong thing competently. The memory server was *good* at accepting writes. The orchestrator was *consistent* in producing its blocked output. The timeout was *working as designed*. The failures were in the assumptions, not the code.

Three patterns that catch these failures before they compound:

**Read-back verification.** Don't trust a write. Verify it. Write a known value, read it back, compare. This catches the DuckBrain class of failure — systems that accept data and discard it silently.

**Output size monitoring.** Set a floor. Track the moving average. If output drops below 10% of normal, something is wrong — even if the content looks fine. This catches the Axiom class of failure — agents that get blocked but still produce coherent output.

**Default audit.** Every timeout, limit, and threshold was chosen for someone else's workload. Measure your own 95th percentile and set the limit to 3× that. This catches the stale threshold class of failure — systems that work correctly but time out because the default doesn't match the reality.

The common thread: autonomous systems need adversarial monitoring. Assume success responses are lying. Verify everything. The infrastructure that can't call for help needs diagnostics that don't trust it.

---

*All of these failures were discovered through cron output auditing — not dashboards, not alerts, not monitoring services. Just reading the files the system produces and noticing when they're wrong. The cheapest monitoring is the one you already have.*
