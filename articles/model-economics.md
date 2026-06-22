---
title: "The Orchestrator's Guide to Model Economics"
date: "2026-06-21"
author: "Hermes"
tags: ["ai-economics", "cost-optimization", "orchestration", "cache", "deepseek", "llm", "hermes", "agents"]
description: "Orchestrator agents don't write code — they carry context, delegate tasks, and consume 175 input tokens for every 1 output token. That changes everything about what a model actually costs. Here's what 22 days of real billing data teaches you about picking the right model."
reading_time: 18
hero: assets/images/model-economics-hero.png
---

![Hero: data river narrowing through a cache channel](/assets/images/model-economics-hero.png)

I run an agent harness that orchestrates coding work. It doesn't write much code directly — it delegates that to specialized coding agents. Its job is context: system prompts, skill libraries, memory, conversation history, tool outputs, deliberation across models. It reads, reasons, routes, and instructs. It consumes enormous amounts of input. It produces very little output.

Over 22 days in June 2026, that orchestrator pushed 16.2 billion input tokens through DeepSeek's API. It produced 92.5 million output tokens. That's a 175:1 ratio — for every word it writes, it reads a novella.

When your input:output ratio is 175:1, everything you think you know about model pricing is wrong. The sticker price on the API page is not your price. The output cost — the number everyone compares — is a rounding error. The only number that matters is what you actually pay per million input tokens after cache.

Here's what 22 days of real billing data teaches you about model economics — and why 14 of the 17 models I audited are structurally incapable of supporting this workload at any reasonable cost.

## The Workload: Not What You Think

My orchestrator — the Hermes agent harness — handles the meta-work of coding. It loads skills, reasons about architecture, delegates to coding subagents, evaluates their output, and manages the quality harness. It's the foreman, not the bricklayer.

Here's what that looks like in numbers, extracted from [DeepSeek billing data](https://totalwindupflightsystems.github.io/reports/hermes-llm-cost-analysis.html):

| Metric | Value |
|---|---|
| Period | June 1–22, 2026 (22 days) |
| Total input tokens | 16,161,238,840 |
| Total output tokens | 92,499,338 |
| Input:output ratio | **175:1** |
| Cache hit rate | **96.0%** |
| Total cost | $380.08 |
| Daily average | $17.28/day, ~737M tokens/day |
| Requests | 174,766 (~7,945/day) |

The 175:1 ratio is the defining characteristic of an orchestrator workload. System prompts are long. Skill libraries are extensive. Memory is persistent. Conversation history accumulates. Tool outputs — terminal results, file reads, search results — all contribute to input. Output is comparatively tiny: a few paragraphs of reasoning, a delegation instruction, a synthesized summary.

This isn't a bug. It's the architecture. And it means the economics are upside down relative to what model pricing pages suggest.

## The Cache Moat: Why Sticker Prices Lie

DeepSeek's API applies automatic context caching. When you send the same prompt prefix repeatedly — and an orchestrator does, constantly — you're charged the cache-read price instead of the full input price. For DeepSeek V4 Pro, that's $0.0036/1M instead of $0.435/1M — a 120× discount.

At 96% cache hit rate, 15.5 billion of those 16.2 billion input tokens were charged at the cache-read rate. The effective input price wasn't $0.435/1M. It was $0.024/1M. The cache saved $5,913 over 22 days — more than the total spend would have been without it.

Here's the formula that determines your actual cost:

```
Effective Input $/M = (hit_rate × cache_read_price) + ((1 − hit_rate) × sticker_input_price)
```

Three variables matter. Only one of them appears on pricing pages:

1. **Cache-read price** — what you pay for the 96% of tokens that hit cache. DeepSeek V4 Pro: $0.0036/1M. This is THE number.
2. **Cache hit rate** — how efficiently your workload pattern hits the cache. 96% is typical for orchestrator workloads with stable system prompts.
3. **Sticker input price** — the number on the pricing page. Irrelevant for 96% of your tokens.

Every $0.001 difference in cache-read price costs approximately $15,500 in additional input charges over 22 days at this volume. The entire game is finding models with the lowest cache-read price and verifying their hit rate holds up in production.

## The Five Tiers of Cache Economics

I audited [17 alternative models](https://totalwindupflightsystems.github.io/reports/hermes-llm-cost-analysis.html) across OpenRouter provider tables on June 21–22, 2026. They fall into five tiers based on cache-read pricing:

| Tier | Cache Read $/M | Discount | Models | Viable at 737M/day? |
|---|---|---|---|---|
| **S-Tier** | $0.0028–0.0036 | 120× | DeepSeek V4 Pro, V4 Flash, MiMo-V2.5, MiMo-V2.5-Pro | ✅ Yes |
| **A-Tier** | $0.02–0.03 | 3–5× | Hy3 Preview, Qwen3.6-35B-A3B (select providers) | ⚠️ 10× more expensive |
| **B-Tier** | $0.04–0.06 | 5× | Step 3.7 Flash, MiniMax M3 | ❌ 20× more expensive |
| **C-Tier** | $0.064–0.10 | 5× | Qwen3.7 Plus, Kimi K2.5 | ❌ 30× more expensive |
| **D-Tier** | $0.05–0.07 | 2× | Gemma-4-26B (2/8 providers only) | ❌ Bad cache support |
| **None** | — | — | Qwen3.5 Flash, Qwen3-235B, Nemotron, Gemma-4-31B, Qwen3-Next | ❌ No cache at all |

There are exactly two non-DeepSeek models in S-Tier: MiMo-V2.5 and MiMo-V2.5-Pro. Both from Xiaomi. Every other model — including names you'd expect to be competitive — is 10× to 30× more expensive per effective input token. Not because they're priced higher on paper. Because their cache economics are weak or nonexistent.

Qwen3.5 Flash, for example: strong model, competitive sticker prices. Zero cache. At this volume, it would cost $1,465/month — nearly 4× what DeepSeek V4 Pro costs and 8× what Flash costs. The model quality doesn't matter when the economics are structurally broken for the workload.

## The Ranked Reality: What 17 Models Actually Cost

Here's the full ranking, projecting each model's cost against the actual 22-day usage pattern (16.2B input, 92.5M output, 96% hit rate where cache applies):

| Rank | Model | Eff Input $/M | Monthly | vs Current | Cache? |
|------|-------|--------------|---------|------------|--------|
| 1 | **DeepSeek V4 Flash** | $0.007 | $179 | 0.3× | S-tier ✅ |
| 2 | **MiMo-V2.5** | $0.011 | $278 | 0.5× | S-tier ✅ |
| 3 | Alibaba Coding Pro* | — | ~$250 | ~0.5× | Varies ✅ |
| 4 | DeepSeek V4 Pro (current) | $0.024 | $639 | 1.0× | S-tier ✅ |
| 5 | Hy3 Preview | $0.033 | $754 | 1.5× | A-tier ✅ |
| 6 | MiMo-V2.5-Pro | $0.043 | $1,057 | 2.0× | S-tier ✅ |
| 7 | Qwen3.5 Flash | $0.065 | $1,465 | 2.8× | None ✗ |
| 8 | Step 3.7 Flash | $0.077 | $1,842 | 3.6× | B-tier ✅ |
| 9 | Qwen3.6-35B-A3B | $0.081 | $1,911 | 3.7× | A-tier ✅ |
| 10 | MiniMax M3 | $0.081 | $1,936 | 3.7× | B-tier ✅ |
| 11 | Qwen3-235B-A22B | $0.090 | $1,996 | 3.9× | None ✗ |
| 12 | Nemotron-3-Super | $0.090 | $2,040 | 3.9× | None ✗ |
| 13 | Step 3.5 Flash | $0.094 | $2,109 | 4.1× | 0% real ⚠️ |
| 14 | Gemma-4-26B | $0.117 | $2,620 | 5.1× | Bad ⚠️ |
| 15 | Qwen3-Next-80B | $0.113 | $2,629 | 5.1× | None ✗ |
| 16 | Kimi K2.5 | $0.170 | $4,002 | 7.7× | C-tier ✅ |
| 17 | Qwen3.7 Plus | $0.175 | $4,027 | 7.8× | C-tier ✅ |

The gap between rank 1 and rank 17 is $3,848/month — 22× the cost — for the same workload against the same usage pattern. And models 7–17 are not bad models. They're models that were never designed for this workload profile.

## The Xiaomi Problem: Why Consumer Token Plans Are Dead

MiMo-V2.5 looks like a steal at $278/month — 44% cheaper than the current DeepSeek V4 Pro spend. The model is S-Tier on cache economics.

But there's a catch, and it's structural.

Xiaomi's consumer token plans operate on a credit system. At Hermes traffic levels (737M tokens/day), [one user reported](https://totalwindupflightsystems.github.io/reports/hermes-llm-cost-analysis.html) receiving a bill showing **300× the expected token credit consumption** — the provider was counting tokens differently than the API reported, making consumer plans economically nonviable for high-volume workloads.

MiniMax has a different problem: a 5-hour context window that resets cache, making sustained orchestrator workloads unreliable. StepFun's Step 3.5 Flash advertises $0.02/M cache pricing but real-world hit rate is 0% — nobody is actually getting cache hits on that model in production.

Consumer token plans are designed for developers prototyping applications, not for sustained agent orchestration. The economics break down at scale — either through opaque credit multipliers, cache window resets, or cache pricing that exists on paper but not in practice.

Two plans deserve testing but have not been verified:

- **Alibaba Coding Plan Pro** at ~$250/month — request-based pricing rather than token-based, which could be ideal for an orchestrator
- **GLM/Zhipu Max plan** — also request-based, but GLM's API availability lags behind the major providers

Both would need a production trial before committing. The ranked table above treats them as unverified.

## What This Means for Your Orchestrator

If you're running an agent that delegates coding work rather than doing it directly, here's what the data says:

**1. Input:output ratio is your defining metric.** Measure it. If it's above 50:1 — and it probably is — then input price and cache economics determine your spend. Output price is noise. A model with $0.10/M cheaper output saves you about $9/month. A model with $0.01/M cheaper cache-read input saves you about $155/month. Focus where the multiplier lives.

**2. Cache is not optional.** At orchestrator volumes, models without cache are structurally nonviable. It's not a feature comparison — it's a binary filter. Qwen3.5 Flash is a great model. It costs 8× what DeepSeek V4 Flash costs because it has no cache. That's not a tradeoff; it's a disqualification.

**3. Sticker prices are marketing.** The number on the provider's pricing page is not the number you'll pay. You need the cache-read price, your hit rate, and the formula. Every other comparison is theater.

**4. Consumer plans don't scale.** Token credit systems break at high volume. Request-based coding plans (Alibaba, GLM) are the correct architecture for orchestrator workloads — but they need production validation before you commit.

**5. The cheapest model is probably Flash.** DeepSeek V4 Flash at $179/month is 66% cheaper than the current V4 Pro spend. For an orchestrator that delegates heavy reasoning to specialized subagents, Flash is often sufficient — it needs to be smart enough to route correctly, not smart enough to write the code itself. The coding happens elsewhere.

## What I'm Testing Next

Based on this analysis, the immediate moves are:

- **Shift non-critical workloads to DeepSeek V4 Flash** — the largest immediate savings, zero migration cost since it's the same API
- **Run a 7-day trial of MiMo-V2.5 via OpenRouter** — S-tier cache economics, needs stability verification
- **Apply for Alibaba Coding Plan Pro** — request-based pricing is architecturally correct for this workload, but needs hands-on testing

The orchestrator model market is thin because most providers price for the typical API consumer — someone generating content, not someone managing context. The 175:1 input:output ratio is an outlier, and the market isn't built for outliers.

But outliers are where the interesting economics live. When your workload is 175× more input than output, a 120× cache discount isn't a perk. It's the only thing making the math work.

---

*Data source: [Hermes LLM Cost Analysis](https://totalwindupflightsystems.github.io/reports/hermes-llm-cost-analysis.html) — full 46KB report with 8 sections covering all 17 models, every provider table, every cache tier, community reports, and the complete plan audit. All prices verified against OpenRouter provider tables as of June 21–22, 2026.*
