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

Now, throughput. Nvidia's own published benchmark: an H100 serving a 120B dense model achieves approximately $0.09 per million tokens at 66 tokens/second/user using vLLM. At scale with batching, a well-tuned H100 can push **500–2,000 tokens/second**. We'll use a conservative **1,000 tok/s** for a Kimi K3-equivalent workload (the model's 50B effective active parameters make it faster than a 120B dense model).

- Tokens per GPU per year: 1,000 tok/s × 86,400 seconds × 365 days = **31.5 billion**
- Total tokens across 72M GPUs: **2,270 quadrillion**

Two-point-three *septillion* tokens of annual inference capacity. From ONE year's new data center build. Just the 2027 increment. Not including the existing 80 GW already online.

## What Humanity Actually Consumes

OpenRouter, the largest independent API aggregator, processes approximately **2.7 trillion tokens per day** — about 1 quadrillion tokens per year. This is real data: OpenRouter published a 100 trillion token study and publicly reports daily rankings. On June 6, 2026, DeepSeek alone processed 1.08 trillion tokens in a single day across its top three models on the platform.

OpenRouter is not the whole market — it's one API aggregator. ChatGPT, Claude, Gemini, Copilot, and enterprise APIs serve tokens directly. But even if total global AI token consumption is **10–30×** what flows through OpenRouter, we're looking at **10–30 quadrillion tokens per year** total.

The new capacity alone — just the 36.3 GW coming in 2027 — can serve **75–225× current global demand**.

## What This Means Per Human

There are 8.2 billion people on Earth. Divide the inference capacity by the population:

**2,270 quadrillion tokens ÷ 8.2 billion people = 277 million tokens per person per year.**

That's **760,000 tokens per person per day.** Every man, woman, and child. Including infants. Including people who have never used the internet.

A heavy AI user — someone coding with agents, running research queries, using reasoning models — might consume 50,000–100,000 tokens per day. The capacity can serve every human on Earth at **7–15× heavy-user levels**, simultaneously, 24/7.

The capacity exists. The demand doesn't. That's the gap.

## The Price That Kills the Business Model

Now the pricing. Kimi K3's API charges $3 per million input tokens and $15 per million output tokens. This is the *retail* price — Moonshot's margin included.

The *wholesale* price — the bare-metal cost of electricity, depreciation, and operations — is much lower. Nvidia's published benchmark is **$0.09 per million tokens** for inference on a 120B model. That's the electricity and hardware depreciation, no margin. Even if we triple that to account for Kimi K3's larger weight footprint and networking overhead, we're looking at roughly **$0.25–0.50 per million tokens** as the actual inference cost at scale.

Here's the trap:

| Scenario | Price per M tokens | Per-person annual cost | Global annual cost | % of $126T GDP |
|----------|-------------------|----------------------|-------------------|----------------|
| Bare-metal cost | $0.50 | $139 | $1.1 trillion | 0.9% |
| Discount API | $3.00 | $831 | $6.8 trillion | 5.4% |
| Kimi K3 API | $15.00 | $4,155 | $34 trillion | 27% |
| GPT-5.6 API | ~$30.00 | $8,310 | $68 trillion | 54% |

At bare-metal cost, filling the capacity is expensive but mathematically possible — 0.9% of global GDP. Slightly less than what the world spends on advertising.

At API pricing — the prices AI companies actually need to charge to recover R&D, pay salaries, train the next generation, and eventually turn a profit — the number doesn't fit in the global economy. $34 trillion is 27% of world GDP. That's not "growing the AI market." That's replacing the global economy with AI compute.

And these prices need to go *down* for mass adoption, not up.

## The Paradox

This is the structural problem that no amount of market growth solves:

1. **More capacity needs more revenue** — 36.3 GW at bare-metal pricing needs $1.1 trillion per year. At API pricing, $34 trillion.
2. **Mass adoption requires lower prices** — if AI is going to be used by billions of people for everyday tasks, the per-token price has to drop toward zero. WeChat doesn't charge per message. Google doesn't charge per search. AI at scale looks like infrastructure, not a luxury good.
3. **Lower prices mean less revenue** — if prices drop 10×, you need 10× the token volume just to stay even. But 10× the token volume requires 10× the users consuming 10× the tokens each.
4. **There aren't enough humans** — the capacity already exceeds what 8.2 billion people could consume at heavy-user levels. Dropping prices doesn't create new humans. It just makes the revenue per human smaller.

If Kimi K3's API price drops from $15/M to $1.50/M — a 10× reduction that would be extraordinary for adoption — the global cost drops from $34 trillion to $3.4 trillion. That's still 2.7% of global GDP. And that's just to fill the 2027 incremental capacity at 100% utilization, which no data center achieves.

## Where This Lands

I want AI to be everywhere. I want inference to be cheap enough that every application, every device, every interaction has an intelligent layer. I want the future where AI is infrastructure, not a subscription.

But I can't find the price point where this works. If prices stay at API levels, the capacity sits empty because the global economy literally cannot consume that much compute spend. If prices drop to levels that enable mass adoption, the AI companies lose money on every token — and they're already losing money on most of them.

The 36.3 GW arriving in 2027 will not be filled by paying customers. It will be filled by companies burning venture capital and corporate R&D budgets to subsidize usage, hoping that the revenue materializes before the money runs out. Some of those companies will be right. Most won't.

The delayed data centers aren't delayed because of power grids. They're delayed because opening them would mean reporting to investors that 70% of the racks are empty. The utility delay is real. But it's also the most convenient problem the industry has ever had — because it means never having to admit the demand you promised isn't there.

---

*This post uses Kimi K3 as a stand-in for frontier model inference costs. The model is open-weight, the specifications are public, and the deployment requirements are verified by multiple independent sources. All capacity figures from Goldman Sachs Research (July 2026). Token consumption data from OpenRouter public rankings and the 100 Trillion Token Study. GPU throughput benchmarks from Nvidia published specifications and SemiAnalysis InferenceX. Electricity pricing from US EIA commercial average ($0.13/kWh).*
