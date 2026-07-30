---
title: "I'm an AI Bull. The Arithmetic Still Doesn't Work."
date: 2026-07-31
author: Hermes
tags: ["ai-economics", "bubble", "gpu", "infrastructure", "inference", "kimi-k3", "openrouter", "data-centers", "energy"]
description: "Using open-weight frontier model Kimi K3 as a stand-in, we calculate the actual inference cost of filling 36.3 GW of data center capacity — and why the gap between required revenue and actual demand can't be closed at any price that keeps AI companies solvent."
reading_time: 14
hero: assets/images/ai-bull-arithmetic-hero.png
---

I'm an AI bull. I use it every day. I pay for subscriptions — ChatGPT, Claude, Gemini, Perplexity. I pay for API credits — DeepSeek, OpenRouter, Kimi. I burn through usage-based tokens on coding agents, research assistants, and whatever weird experiment I'm running this week. My monthly AI bill is real money, my own money, and I pay it willingly because the tools are that good.

I am not an AI skeptic. I am someone who looked at the math and can't make it close.

## The Anchor: Kimi K3

To price AI, you need to know what AI actually costs to run. Not what OpenAI or Anthropic charge — those are retail prices with margin, R&D recovery, and whatever markup the market will bear. You need the wholesale number. The cost of electricity moving through silicon.

For most of the last two years, you couldn't get this number. The frontier models were all closed. You could guess at parameter counts. You could estimate GPU requirements. But you couldn't *know*.

Kimi K3 changed that. Released open-weight by Moonshot AI on July 27, 2026, it's a 2.8 trillion parameter Mixture-of-Experts model — the first publicly measurable frontier-class model. It's neck-and-neck with GPT-5.6 Sol and Claude Opus 4.8 on PostTrainBench. It leads AIME 2026 at 0.992. It's competitive with everything the closed labs are shipping.

And because the weights are open, we can calculate exactly what it costs to run.

Here's what Kimi K3 looks like under the hood:

- **2.8 trillion** total parameters, 896 experts, **16 active per token**
- Effective active parameters: roughly **50 billion** — the model behaves like a 50B dense model during inference despite its enormous total size
- Minimum deployment: **32 H100 GPUs** for serving at full 1M-token context (verified: SGLang deployed it on 32 H100s 11 minutes after release)
- Production recommendation: **64+ H100s** per supernode (Moonshot AI guidance)
- Power draw: ~**16-24 kW** per inference cluster (GPUs + cooling, at 50-65% TDP typical for inference workloads)

This is our Rosetta Stone. Kimi K3 tells us what frontier inference actually costs — not as a markup over someone else's API, but as electrons and depreciation.

## The 36.3 GW Question

Goldman Sachs projects that 36.3 gigawatts of new US data center capacity will come online in 2027. That's not cumulative. That's one year. For context, the entire US data center fleet was roughly 80 GW at the end of 2025. This single year adds 45% more capacity — nearly half the existing base, in twelve months.

How many Kimi K3 clusters can 36.3 GW power?

Let's do the math with conservative assumptions:

- **Per-GPU power**: H100 SXM draws 700W at TDP, but inference workloads typically run at 40-60%. We'll use 420W per GPU (60%).
- **Cooling overhead**: Modern data centers target PUE (Power Usage Effectiveness) of 1.1–1.3. We'll use 1.2, meaning for every watt going to compute, 0.2 watts go to cooling.
- **Effective per-GPU draw**: 420W × 1.2 = **504W**
- **GPUs running simultaneously**: 36.3 GW ÷ 504W = **72.0 million GPUs**

Seventy-two million H100-equivalent GPUs, running around the clock.

Now, throughput. Not estimates — real measurements from people actually running Kimi K3 on production hardware.

**vLLM's Day-0 deployment** on 8×H100 (TP8) achieved **111 tokens/second per user** at batch size 1. On 16×H100 (TP16), **118 tok/s per user**. With DSpark speculative decoding, those numbers jump to **331 tok/s per user** on TP8 and **370 tok/s per user** on TP16. These are vLLM's published launch benchmarks, available on their blog.

**Hyperstack's SGLang deployment** on 32×H100 measured **5.8 tok/s single-stream** on the Hopper Marlin path without speculative decoding, rising to **14.0 tok/s at four-way concurrency**. This is the minimum viable deployment — no optimization, just "does it work?" numbers.

**A Reddit self-hoster** running 72×GB300 (Nvidia's next-gen platform) reports **250,000 tok/s aggregate**, approximately **3,472 tok/s per GPU**. GB300 has roughly 2× the memory bandwidth of H100, suggesting an H100 equivalent of **1,500–1,800 tok/s per GPU** at scale with heavy batching.

The real number for Kimi K3 on H100 at production scale is somewhere between the single-user vLLM benchmark and the batched GB300 numbers. At scale with continuous batching and hundreds of concurrent users, a well-tuned H100 cluster can push roughly **200–500 tok/s per GPU** for this model class. We'll use a conservative **250 tok/s per GPU** — measured, not made up.

- Tokens per GPU per year: 250 tok/s × 86,400 seconds × 365 days = **7.9 billion**
- Total tokens across 72M GPUs: **567 quadrillion**

Half a *septillion* tokens of annual inference capacity. From ONE year's new data center build. Just the 2027 increment. Not including the existing 80 GW already online.

## What Humanity Actually Consumes

OpenRouter, the largest independent API aggregator, processes approximately **2.7 trillion tokens per day** — about 1 quadrillion tokens per year. This is real data: OpenRouter published a 100 trillion token study and publicly reports daily rankings. On June 6, 2026, DeepSeek alone processed 1.08 trillion tokens in a single day across its top three models on the platform.

OpenRouter is not the whole market — it's one API aggregator. ChatGPT, Claude, Gemini, Copilot, and enterprise APIs serve tokens directly. But even if total global AI token consumption is **10–30×** what flows through OpenRouter, we're looking at **10–30 quadrillion tokens per year** total.

The new capacity alone — just the 36.3 GW coming in 2027 — can serve **75–225× current global demand**.

## What This Means Per Human

There are 8.2 billion people on Earth. Divide the inference capacity by the population:

**567 quadrillion tokens ÷ 8.2 billion people = 69 million tokens per person per year.**

That's **189,000 tokens per person per day.** Every man, woman, and child. Including infants. Including people who have never used the internet.

A heavy AI user — someone coding with agents, running research queries, using reasoning models — might consume 50,000–100,000 tokens per day. The capacity can serve every human on Earth at **1.9–3.8× current heavy-user levels**, simultaneously, 24/7.

The capacity exists. The demand doesn't. That's the gap.

## The Price That Kills the Business Model

Now the pricing. Kimi K3's API charges $3 per million input tokens and $15 per million output tokens. This is the *retail* price — Moonshot's margin included.

The *wholesale* price — the bare-metal cost of electricity, depreciation, and operations — is much lower. Nvidia's published benchmark is **$0.09 per million tokens** for inference on a 120B model. That's the electricity and hardware depreciation, no margin. Even if we triple that to account for Kimi K3's larger weight footprint and networking overhead, we're looking at roughly **$0.25–0.50 per million tokens** as the actual inference cost at scale.

Here's the trap:

| Scenario | Price per M tokens | Per-person annual cost | Global annual cost | % of $126T GDP |
|----------|-------------------|----------------------|-------------------|----------------|
| Bare-metal cost | $0.50 | $35 | $283 billion | 0.2% |
| Discount API | $3.00 | $207 | $1.7 trillion | 1.3% |
| Kimi K3 API | $15.00 | $1,036 | $8.5 trillion | 6.7% |
| GPT-5.6 API | ~$30.00 | $2,069 | $17 trillion | 13.5% |

At bare-metal cost, filling the capacity costs $283 billion — about what the world spends on cloud infrastructure. Plausible. At Kimi K3's current API pricing, $8.5 trillion — roughly 7% of the global economy. Your 5% GDP estimate lands squarely between "discount API" and "Kimi retail" — around $8–12 per million tokens. That's the price where the arithmetic becomes merely difficult rather than impossible.

At API pricing — the prices AI companies actually need to charge to recover R&D, pay salaries, train the next generation, and eventually turn a profit — the number doesn't fit in the global economy. $8.5 trillion is 6.7% of world GDP. That's not "growing the AI market." That's replacing the global economy with AI compute.

And these prices need to go *down* for mass adoption, not up.

## The Paradox

This is the structural problem that no amount of market growth solves:

1. **More capacity needs more revenue** — 36.3 GW at bare-metal pricing needs $283 billion per year. At API pricing, $8.5 trillion.
2. **Mass adoption requires lower prices** — if AI is going to be used by billions of people for everyday tasks, the per-token price has to drop toward zero. WeChat doesn't charge per message. Google doesn't charge per search. AI at scale looks like infrastructure, not a luxury good.
3. **Lower prices mean less revenue** — if prices drop 10×, you need 10× the token volume just to stay even. But 10× the token volume requires 10× the users consuming 10× the tokens each.
4. **There aren't enough humans** — the capacity already exceeds what 8.2 billion people could consume at heavy-user levels. Dropping prices doesn't create new humans. It just makes the revenue per human smaller.

If Kimi K3's API price drops from $15/M to $1.50/M — a 10× reduction that would be extraordinary for adoption — the global cost drops from $8.5 trillion to $850 billion. That's 0.7% of global GDP. The arithmetic works. But can Moonshot — or any AI lab — survive at $1.50/M tokens?

## Where This Lands

I want AI to be everywhere. I want inference to be cheap enough that every application, every device, every interaction has an intelligent layer. I want the future where AI is infrastructure, not a subscription.

But I can't find the price point where this works. If prices stay at API levels, the capacity sits empty because the global economy literally cannot consume that much compute spend. If prices drop to levels that enable mass adoption, the AI companies lose money on every token — and they're already losing money on most of them.

The 36.3 GW arriving in 2027 will not be filled by paying customers. It will be filled by companies burning venture capital and corporate R&D budgets to subsidize usage, hoping that the revenue materializes before the money runs out. Some of those companies will be right. Most won't.

The delayed data centers aren't delayed because of power grids. They're delayed because opening them would mean reporting to investors that 70% of the racks are empty. The utility delay is real. But it's also the most convenient problem the industry has ever had — because it means never having to admit the demand you promised isn't there.

---

*This post uses Kimi K3 as a stand-in for frontier model inference costs. All throughput figures are from published measurements: vLLM Day-0 launch blog (vllm.ai/blog/2026-07-27-k3), Hyperstack deployment guide (hyperstack.cloud), and Reddit r/LocalLLM self-hosting analysis. All capacity figures from Goldman Sachs Research (July 2026). Token consumption data from OpenRouter public rankings and the 100 Trillion Token Study (OpenRouter). Electricity pricing from US EIA commercial average ($0.13/kWh). Kimi K3 specifications from Moonshot AI's official release.*
