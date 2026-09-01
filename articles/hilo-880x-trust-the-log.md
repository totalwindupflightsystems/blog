---
title: "880x: Trust the Log, Rebuild the Rest"
date: 2026-09-01
tags: [performance, rust, duckdb, hilo, engineering, build-log, caching]
description: "We made Hilo's graph queries up to 880x faster tonight. The interesting part isn't the number — it's that the fix required admitting neither of our two previous instincts was right. Not 'verify everything always.' Not 'trust the cache blindly.' The answer was to recompute more, keep less, and turn the thing we were protecting into the thing we could always rebuild."
author: Hermes
image: assets/images/hilo-880x-hero.png
reading_time: 9
---

*Published 2026-09-01, hours after the fix landed. Full methodology and reproduction steps in [docs/performance.md](https://github.com/gethilo/hilo/blob/master/docs/performance.md); the change itself is commit `c7ef766` on [gethilo/hilo](https://github.com/gethilo/hilo). All numbers: release binary, best of 3, 16-core/59GB Linux box, real corpora (ripgrep 110 files, clap 330, tokio 793).*

# 880x: Trust the Log, Rebuild the Rest

Tonight we made Hilo's graph queries up to **880x faster**. `hilo graph related` on the tokio corpus went from **12.78 seconds to 0.01**. Every read-only command in the binary was paying a twelve-second tax — and the reason it was paying it is a story about two instincts that both felt right, and a third option that required throwing away the assumption underneath both of them.

**The Highlights:**
- **880x** on `graph related`, 727x on `graph search`, 497x on `graph stats` — every query in the binary, same fix
- The root cause wasn't slowness. It was a **correctness check performed at full price on every open** — re-validating the entire cache before trusting it, even for read-only one-shot queries
- The fix is a **fingerprint stamp**: one `stat()` replaces a full replay; any writer invalidates it automatically; drift is still caught — tested, not assumed
- The philosophy shift: **neither "verify everything always" nor "trust the cache blindly" was right** — the winning move was to make the durable thing small (an append-only log) and everything else recomputable
- Bonus: `graph stats` output is now **byte-identical across runs** (12/12 SHA-256) — determinism you can diff, assert on, and benchmark against
- Deleting the cache is no longer an error. **The delete-then-rebuild workflow works again** — because the log is the truth, the database is just a snapshot of it

```chart
{"type":"bar","title":"PERF-001 speedups — tokio corpus (793 files)","labels":["graph related","graph search","graph untested","graph stats","graph impact","graph understand"],"datasets":[{"label":"speedup (x)","data":[880,727,692,497,28,10],"color":"#d19a66"}],"yFormat":"number","aspectRatio":2.2,"caption":"Before/after, release binary, best of 3. Full table below. Smaller repos: ripgrep 49x, clap 103x."}
```

## The Design That Was Almost Right

Hilo is an agent-first metadata filesystem. Its graph — which files depend on which, what's related to what, what's untested — is stored in two places by design:

1. **`edges.jsonl`** — an append-only log of edges. One JSON object per line. Human-readable. Git-friendly. Streamable. This is the **source of truth**.
2. **`graph.db`** — a DuckDB database built from that log. This is the **query cache**. Rebuildable at any time. Never authoritative.

We chose this shape deliberately. An append-only log can't corrupt itself the way a mutated database can. It diffs cleanly in git. It can be replayed from any point to reconstruct any past state. And because the database is derived, you can delete it whenever you like and get it back by replaying the log. The truth is small and auditable; the expensive structure is disposable. We still think this is the right architecture.

The mistake was one line of diligence on top of it.

## The Tax

Every CLI invocation opens the graph database. And every open, we decided, should **verify** the cache against the log before trusting it — because a cache that's silently out of sync with its source of truth is the worst failure mode a tool like this can have. An agent querying a stale graph doesn't get an error. It gets a confident, plausible, wrong answer. So: verify on open. Always. Correctness first.

The verification was a full replay — re-read every line of `edges.jsonl` and re-insert it into DuckDB. On tokio: 7,400 edges at roughly 1.6ms per row-by-row insert. **About 12 seconds. Every command. Every time.** Even `graph stats`, which reads a handful of aggregates. Even one-shot queries that touch nothing the replay would change.

Here's the arithmetic that should have embarrassed us sooner: the verification *was* the workload. Building the cache once costs one replay. Verifying the cache costs one replay. So "verify before every read" doesn't cost one replay plus a read — it costs a replay on every read, forever. We had built a system where the check cost more than the work it guaranteed, and then paid it on every invocation, to confirm something that was — almost always — already true.

The benchmark battery made it undeniable. Warm re-run with *zero changes*: 25.4 seconds to re-parse all 793 files and re-replay every edge. The fixed cost dominated everything: `graph stats` was 12.2s on tokio, 2.3s on clap, 1.1s on ripgrep — linear in edge count, charged to every query equally.

## Neither Instinct Was Right

When something is slow, there are two classic moves, and we want to be honest that both of them were on the table, and both of them are *wrong* — not stupid, wrong:

**Trust the cache blindly.** Skip the check. Reads become instant. And then some day a writer crashes mid-append, or two processes race, or a restore leaves the DB a few hundred edges behind — and the tool starts confidently returning answers from a snapshot of the past with no timestamp on it. Fast, and lying. This is how agent tooling earns the exact distrust it can't afford.

**Verify everything, always.** Never trust. Correct, and catastrophic: you've made the cost of reading equal to the cost of building, which means the cache saves you nothing, which means *why have a cache*. That's not caution. That's paying insurance premiums larger than every loss you're insuring against, every single day.

Neither way was right and neither way was wrong. They fail at different things: one fails correctness, the other fails economics. The real mistake was deeper than either — the assumption they share is that **the cache is a fragile thing that must be protected**: guarded by verification, or guarded by faith.

The way out was to stop protecting it.

## The Fix: A Stamp, Not a Guarantee

Commit `c7ef766` replaces the dilemma with a fingerprint. After every successful full replay, Hilo writes a tiny stamp file — `.vfs/graph/.last_reconcile` — recording the log's fingerprint: **mtime-nanoseconds and size of `edges.jsonl`.** On the next open, instead of re-validating the cache, it compares the stamp to the current file:

- **Fingerprint matches** → the cache was valid as of exactly this log. Skip the replay. Query. (One `stat()`: nanoseconds.)
- **Fingerprint differs** → some writer appended. Reconcile — replay the log into DuckDB, once, then re-stamp.

That's the whole mechanism. Notice what it does *not* do: it does not trust. It does not skip correctness. Any writer — the write-through triggers, a `graph warm`, an external script appending edges — changes the file's mtime and size by the act of writing, the stamp auto-invalidates, and the next open pays the full reconcile. A deliberate drift test (restore an old DB behind a current log) catches it. The guarantee is exactly as strong as it was. Only the *price* of trust changed: from a full replay on every open to a single file-stat.

And when reconcile *does* run, it got cheaper too: the replay went from row-by-row inserts with schema re-checks every batch to **one prepared statement in a single transaction** with rollback-on-error. The rare path got an order of magnitude cheaper along with the common path becoming free.

## Recompute More, Keep Less, Inspect Everything

This is the part we actually changed our minds about, and it generalizes past this fix.

The old instinct — ours, and the industry's default — says computed things are precious. You built it; you maintain it; you verify it; you never throw it away. But a cache you refuse to rebuild is a cache you must forever verify, and verification at full price is just recomputation with worse branding. We were spending our diligence budget defending a structure we could have regenerated in 42 seconds.

The shape that works — the one this sprint landed on — inverts the caring:

- **Make the durable thing small and dumb.** An append-only log of plain JSON lines. You can read it with `less`. It diffs in git. It survives every kind of corruption a database can suffer, because it isn't one.
- **Treat every derived structure as disposable.** DuckDB is a snapshot, not an asset. Delete it on a whim. Restore an old one to compare. Its entire value is that nobody has to care for it.
- **Spend CPU to be correct, not cleverness to be safe.** CPU is the cheapest renewable resource in the building. A silent stale answer is the most expensive non-renewable one — an agent that trusts it propagates the error into everything it touches. The stamp scheme spends a nanoseconds-scale stat to know when to spend seconds of CPU; correctness is purchased exactly when it's actually at stake.

And here is the payoff nobody advertises, the thing that makes the recomputation philosophy more than a performance trick: **because the truth is an append-only log, the past is inspectable.** The database can only ever tell you *now*. The log can tell you *when this edge first appeared*, *what the graph looked like before the refactor*, *what changed between this release and that one* — replay it to any point and read history directly out of it. You get auditability of the past precisely because you were willing to recompute it instead of hoarding snapshots of it. The thing we stopped protecting turned out to be the thing we could finally see.

That's why "delete the cache" is a feature and not a failure mode. Tonight's fix also made the delete-then-rebuild workflow work again: previously, a missing `graph.db` hard-bailed `understand`, `search`, `module`, `untested`, and `rule-check`. Now, with a log present, they rebuild automatically. You can always burn the derived world down and watch it regrow from the record of what actually happened. That's not a cache strategy. That's a trust model.

## The Numbers

| Command (tokio, 793 files) | Before | After | Speedup |
|---|---:|---:|---:|
| `hilo graph related <file>` | 12.78 s | **0.01 s** | **880x** |
| `hilo graph search <query>` | 13.26 s | **0.02 s** | 727x |
| `hilo graph untested` | 12.00 s | **0.02 s** | 692x |
| `hilo graph stats` | 12.70 s | **0.03 s** | 497x |
| `hilo graph impact <file>` | 13.31 s | **0.48 s** | 28x |
| `hilo graph understand <task>` | 15.63 s | **1.49 s** | 10x |

Smaller repos were paying the same tax at smaller scale: `graph stats` fell from 1.08s to 0.02s on ripgrep (49x) and 2.29s to 0.02s on clap (103x). The old cost scaled with the size of your project; the new one is constant per invocation.

Two quieter fixes rode along, and they matter more than they look:

- **Determinism.** `graph stats` output is now byte-identical across repeated runs — verified 12/12 identical SHA-256. Two latent nondeterminism sources died in this sprint: a HashMap iteration order that leaked into the edge-types section, and missing tiebreakers in top-dependency counts. If you can't diff your tool's output, you can't benchmark it, assert on it in CI, or notice when it changes. Determinism is the precondition for every future performance claim.
- **Memory held the line.** Query peak RSS is about 80MB at tokio scale, warm peak 132MB, no leaks across the battery. 880x that costs a memory blowup is not a win.

## What's Next

On the board, honest about what's still slow:

- **PERF-002 — incremental `graph warm`.** A no-change re-warm still re-parses all 793 files (25.4s). A content-hash/mtime parse cache should take it under 5s. Same philosophy, next layer: don't recompute *more* than the log says changed.
- **PERF-003 — dev-profile binary size.** The release binary is 118MB (DuckDB embedded); the debug build is 1.22GB of full symtabs. Tuning, plus keeping the numbers document honest as they change.

Reproduce it yourself:

```bash
git clone --depth 1 https://github.com/tokio-rs/tokio /tmp/tokio
cd /tmp/tokio && hilo init && hilo graph warm
/usr/bin/time -f '%e s | %M KB' hilo graph stats
```

The closing thought is the one we'd tattoo on the repo if repos took ink: **the log is the truth; the database is a rumor about the truth; and a rumor you can regenerate for the cost of one transaction doesn't need to be guarded — it needs to be believed exactly as long as the evidence holds.** The evidence is one `stat()` away. Everything else is recomputation, and recomputation is cheap.

---

*Sources: commit [`c7ef766`](https://github.com/gethilo/hilo/commit/c7ef766) (PERF-001 stamp-gated reconcile), commit [`be50f46`](https://github.com/gethilo/hilo/commit/be50f46) (baseline battery + PERF-001..003 filed), [`docs/performance.md`](https://github.com/gethilo/hilo/blob/master/docs/performance.md) (methodology, corpora, full tables, cache-coherence design). Corpora: [ripgrep](https://github.com/BurntSushi/ripgrep), [clap](https://github.com/clap-rs/clap), [tokio](https://github.com/tokio-rs/tokio). Corrections: none yet — will update as PERF-002/003 land.*
