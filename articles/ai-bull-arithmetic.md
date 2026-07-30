---
title: "I'm an AI Bull. The Arithmetic Still Doesn't Work."
date: 2026-07-31
author: Hermes
tags: ["ai-economics", "bubble", "gpu", "infrastructure", "inference", "kimi-k3", "openrouter", "data-centers", "energy"]
description: "Using open-weight frontier model Kimi K3 as a stand-in, we calculate what it actually costs to serve a real heavy AI user — and why the gap between infrastructure cost and the revenue needed to pay for it can't be closed."
reading_time: 14
image: assets/images/ai-bull-arithmetic-hero.png
---

I'm an AI bull. I use it every day. I pay for subscriptions — ChatGPT, Claude, Gemini, Perplexity. I pay for API credits — DeepSeek, OpenRouter, Kimi. I burn through usage-based tokens on coding agents, research assistants, and whatever weird experiment I'm running this week. My monthly AI bill is real money, my own money, and I pay it willingly because the tools are that good.

I am not an AI skeptic. I am someone who looked at the math and can't make it close.

## The Anchor: Kimi K3

Kimi K3 is the first open-weight frontier model. Released by Moonshot AI on July 27, 2026: 2.8 trillion parameters, Mixture-of-Experts, neck-and-neck with GPT-5.6 Sol and Claude Opus 4.8 on PostTrainBench. Because the weights are public, we can measure what frontier inference actually costs to run — not what the labs charge, but what the electrons cost.

The specs: 896 experts, 16 active per token. Effective active parameters: roughly 50 billion. Production deployment: 64+ H100s per supernode (Moonshot AI guidance). Power draw: 16–24 kW per cluster.

This is our Rosetta Stone. Every pricing calculation in this post flows from measured hardware, not API markups.

## What a Real Heavy User Looks Like

Before we talk about infrastructure, let's establish what actual usage looks like. Not guesses — my own Hermes agent billing data for July 2026:

| Metric | Daily Average |
|--------|-------------|
| Input tokens | 1.47 billion |
| Output tokens | 6.0 million |
| API requests | 14,720 |
| Cost (DeepSeek pricing) | $27.59 |

I spent **$827.75** in July. One person. One agent. At Kimi K3's API pricing of $3/M input and $15/M output, the same month would cost roughly **$1,680**. At Anthropic's Opus 4.8 pricing ($5/M input, $25/M output), it's over **$4,000**.

Now, that $28/day I pay DeepSeek? That's not what my usage actually *costs*. It's what DeepSeek charges me after sharing their 64-GPU clusters across thousands of concurrent users. If my agent had to run on dedicated hardware, here's what it would actually look like.

## What a Cluster Actually Costs

A 64-H100 cluster — the minimum recommended for Kimi K3 production serving — runs roughly $64/hour on spot cloud pricing. That's $1,536 per day, $46,000 per month — before cooling, networking, and operations overhead. With real-world data center overhead, call it $55,000–$65,000 per month per cluster.

If I were the only user on that cluster, my $28/day would need to become approximately $1,800–$2,100 per day. Instead, DeepSeek puts a few hundred users on each cluster, and my $28/day is my share.

The economics of AI inference work because of massive oversubscription. Every cluster serves hundreds or thousands of concurrent users who share the cost. The $15/M tokens that Kimi charges? That's after spreading the cluster cost across as many simultaneous requests as the batching engine can handle.

## The 36.3 GW Question

Goldman Sachs projects 36.3 gigawatts of new US data center capacity in 2027. At 504W per H100 (60% TDP + 1.2 PUE cooling), that's **72 million GPUs** running simultaneously. At 64 GPUs per Kimi K3 cluster, that's **1.125 million concurrent Kimi K3 production clusters**.

Each of those 1.125 million clusters needs to be paid for. At $64/hr spot pricing: 1.125M × $64 × 24 × 365 = **$631 billion per year** in bare GPU rental. Add data center, networking, cooling, and operations overhead, and the real infrastructure cost is $800 billion to $1 trillion per year — just to keep the lights on.

Now, at Kimi K3's API pricing of $15/M output tokens, how much revenue does that infrastructure generate?

If each cluster serves an aggregate 250 tok/s (the conservative real-world benchmark from vLLM and self-hosting measurements), that's 7.9 billion output tokens per cluster per year. At $15/M: 7.9B × $15/M = $118,500 per cluster per year in output revenue.

1.125M clusters × $118,500 = **$133 billion per year** in output token revenue.

That's $133 billion in revenue against $800 billion to $1 trillion in infrastructure cost. The gap is $670–870 billion per year. From just the 2027 incremental capacity.

Input tokens help — Kimi charges $3/M for those — but the ratio doesn't save the model. Even at a generous 10:1 input-to-output ratio, input revenue adds maybe $400 billion more. Still short hundreds of billions.

And this is assuming 100% utilization. Real data centers run at 60–80%. At 70% utilization, the gap grows by another 40%.

## The Oversubscription Problem

The math above assumes clusters are fully utilized. They won't be. Not because of utility delays — because there aren't enough users.

My usage — 6 million output tokens per day — represents what an extreme power user looks like. At that level, a single 64-H100 cluster generating 250 output tokens per second serves 7.9 billion output tokens per year. I consume 2.2 billion output tokens per year. So one cluster can serve about 3.6 users like me.

Three power users per 64-H100 cluster. And there are 1.125 million clusters coming online in 2027. You need 4 million users at my level — or 4 billion users at 1/1,000th my level — to fill them.

The world doesn't have 4 million users consuming 2.2 billion output tokens per year each. The world has maybe thousands of users at that level, millions at 1/10th my level, and billions who have never sent a single prompt.

## The Price That Kills the Business Model

The AI industry's entire pricing structure is built on oversubscription: spread each cluster's cost across as many concurrent users as possible. But 36.3 GW of new capacity breaks the oversubscription model because the physical infrastructure arrives faster than the user base can grow.

Here's the trap at three price points:

| Price per M output tokens | My monthly cost | Required concurrent users per cluster | Users needed globally | Exists? |
|--------------------------|----------------|--------------------------------------|----------------------|---------|
| $15 (Kimi K3 2026) | $1,680 | ~500 | ~570 million | Maybe |
| $3 (deep discount) | $336 | ~2,500 | ~2.8 billion | No |
| $0.50 (bare-metal) | $56 | ~15,000 | ~17 billion | Not even close |

At $15/M output, each cluster needs about 500 concurrent users sharing the cost. Across 1.125 million clusters, that's 570 million concurrent heavy users. At current adoption rates, that might exist globally by 2028-2029. Not 2027.

At $3/M — the price where mass adoption starts to make sense — each cluster needs 2,500 concurrent users. You need 2.8 billion concurrent users globally. That's every internet user on Earth, using AI simultaneously, 24/7.

At bare-metal cost of $0.50/M, you need 17 billion concurrent users. More humans than exist.

## The Paradox

Prices must drop for mass adoption. But dropping prices requires MORE users to fill the same capacity — and the user base can't grow fast enough to match the infrastructure arriving.

This is not a technology problem. It's not a demand problem — demand is growing explosively. It's a timing problem. The infrastructure is being built for a user base that won't exist for 3–5 years, and the infrastructure has a 3–4 year useful life before the GPUs need replacement.

The 36.3 GW arriving in 2027 will either:

1. **Run at partial capacity** — clusters idle at 30–50% utilization, bleeding money
2. **Charge unsustainable prices** — try to recover costs from a user base too small to fill them
3. **Be subsidized** — companies burn cash to keep the lights on, hoping the users arrive before the money runs out

Option 3 is what's happening now. It's the story of OpenAI losing $44 billion before projected profitability in 2029. It's Anthropic projecting a $14 billion loss in 2026 on $47 billion in revenue. It's the $725 billion Big Tech AI spending in 2026 against roughly $25 billion in AI service revenue the prior year.

The question isn't whether people want AI. They do. I do. The question is whether the infrastructure can survive long enough for the user base to catch up to the capacity — and whether the companies building it have enough cash to burn through the gap.

I'm an AI bull. I see the demand growing every day. But I can't find the timeline where this capacity gets filled by paying customers before the GPUs are obsolete. And every quarter that data centers report "construction delays" instead of "occupancy rates" tells me the builders can't either.

---

*All throughput figures from published measurements: vLLM Day-0 launch blog, Hyperstack deployment guide, Reddit r/LocalLLM self-hosting analysis. Capacity figures from Goldman Sachs Research (July 2026). Kimi K3 specifications from Moonshot AI's official release. My personal usage from Hermes billing data (July 1–30, 2026). GPU cloud pricing from Hyperstack spot market ($64/hr for 64×H100). Electricity pricing from US EIA commercial average ($0.13/kWh).*
