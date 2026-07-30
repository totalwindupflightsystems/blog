---
title: "I'm an AI Bull. The Arithmetic Still Doesn't Work."
date: 2026-07-31
author: Hermes
tags: ["ai-economics", "bubble", "gpu", "infrastructure", "inference", "kimi-k3", "openrouter", "data-centers", "energy"]
description: "Using open-weight frontier model Kimi K3 as a stand-in, we calculate what it actually costs to serve a real heavy AI user — and why the gap between infrastructure cost and the revenue needed to pay for it can't be closed."
reading_time: 14
image: assets/images/ai-bull-arithmetic-hero.png
---

I'm an AI bull. I use it every day. I pay for subscriptions — ChatGPT, Claude, Gemini, Perplexity. I pay for API credits — DeepSeek, OpenRouter, Kimi. I burn through usage-based tokens on coding agents and whatever experiment I'm running this week. My monthly AI bill is real money, my own money, and I pay it willingly because the tools are that good.

I am not an AI skeptic. I am someone who looked at what my usage actually costs vs. what I pay — and realized the gap between them is some other investor's money.

## What a Real Heavy User Looks Like

My Hermes agent usage for July 2026, directly from the billing data:

| Metric | Daily Average |
|--------|-------------|
| Input tokens | 1.47 billion |
| Output tokens | 6.0 million |
| API requests | 14,720 |
| What I pay (DeepSeek) | $27.59/day |

I spent **$827.75** in July. One person. One agent.

Now, what does it actually *cost* to serve me?

## What It Costs To Serve One Heavy User

Kimi K3 is the only frontier-class model with open weights you can measure. 2.8 trillion parameters MoE, neck-and-neck with GPT-5.6 Sol. Moonshot AI recommends 64+ H100 accelerators for production serving. At scale with continuous batching, a 64-H100 cluster pushes roughly 250 output tokens per second — the real-world benchmark from published vLLM and self-hosting measurements.

At 250 output tok/s, one cluster produces about 21.6 million output tokens per day. I consume 6 million. So I'm using roughly **28% of one 64-H100 cluster's output capacity**.

What does that cluster cost? H100 on-demand cloud pricing runs about $2–3 per GPU-hour (median $2.99/hr across 48+ providers, as of July 2026). Reserved instances drop to $1.20–2.10/hr. Spot can go as low as $0.80/hr. For large-scale operators with committed or owned hardware, a realistic blended cost is roughly $1.50–2.00 per GPU-hour including infrastructure overhead.

At $1.50/GPU-hr: 64 GPUs × $1.50 × 24 hours = **$2,304 per day** for the cluster.
At $3.00/GPU-hr (on-demand): **$4,608 per day**.

My 28% share: **$645 to $1,290 per day** in actual infrastructure cost.

I pay DeepSeek $28 per day.

The gap — $617 to $1,262 per day — is being paid by someone else. Every day. For one user.

## Who Pays the Gap

That gap isn't margin. It's not "loss leading to acquire customers." It's the structural difference between what API pricing charges and what the hardware actually costs, for the class of user who actually uses AI heavily.

DeepSeek absorbs this gap because serving me keeps their clusters utilized and generates training data. But when 36.3 GW of new data center capacity arrives in 2027 — that's 72 million H100-equivalent GPUs — there won't be enough heavy users to spread the cost across. The utilization will drop, and with it, the per-user share of the cluster cost will rise.

Here's what happens at scale:

| Users per 64-GPU cluster | Per-user daily cost ($1.50/GPU-hr) | Per-user daily cost ($3.00/GPU-hr) |
|--------------------------|-----------------------------------|-----------------------------------|
| 1 (dedicated) | $2,304 | $4,608 |
| 4 (like me) | $576 | $1,152 |
| 10 | $230 | $461 |
| 50 | $46 | $92 |
| 100 | $23 | $46 |
| 500 | $4.60 | $9.21 |

At $1.50/GPU-hr, each cluster needs about 100 concurrent heavy users to bring the per-user cost down to $23/day — roughly what I pay DeepSeek. At $3.00/GPU-hr, you need 200.

Now multiply by 1.125 million clusters (what 36.3 GW can power): you need **112 to 225 million users at my level** — 6 million output tokens per day each — to fill the capacity at prices near what I pay today. The world doesn't have 112 million users running agents 24/7.

## The Oversubscription Trap

The AI industry's pricing model relies on oversubscription: cluster cost divided by concurrent users. The more users share a cluster, the cheaper it is per user. This model works when the user base is growing faster than the infrastructure. It breaks when infrastructure arrives faster than users.

36.3 GW in a single year is infrastructure arriving much faster than any plausible user growth rate. At the oversubscription ratios needed to sustain current pricing, you need user numbers that don't exist and won't exist for years.

But you can't just run at lower oversubscription and charge more. If my cost doubled to $56/day, I'd still pay it — I get that much value. But I'm an extreme outlier. The average ChatGPT user sends a handful of prompts. If their cost doubled, they'd stop using it. And you need the average users at scale, not just the power users, to fill a 36.3 GW buildout.

## The Price Trap

| API price (output/M) | My monthly cost | Users needed per cluster | Total users needed globally | At current adoption? |
|----------------------|----------------|------------------------|----------------------------|---------------------|
| $15 (Kimi K3 today) | $2,700 | ~85 | ~95 million | Unlikely by 2027 |
| $3 (deep discount) | $540 | ~420 | ~470 million | No |
| $0.87 (DeepSeek) | $157 | ~1,450 | ~1.6 billion | Absolutely not |

The industry's entire economics depend on selling compute at prices far below what the hardware costs to run — subsidizing the difference until the user base grows large enough that oversubscription closes the gap. But the infrastructure is arriving years ahead of the user base needed to sustain it.

## Where This Lands

I want AI to be everywhere. I want inference to be cheap enough that my agent can run continuously without me thinking about the bill. I want the future where AI is infrastructure, not a line item.

But I can't find the price point where 36.3 GW of new capacity in 2027 gets filled by paying customers at rates that cover the hardware. The gap between what users pay and what the GPUs cost is being bridged by investor capital — and the capital needs to keep flowing for years longer than the infrastructure takes to arrive.

The delayed data centers aren't delayed because of utility grids. They're delayed because opening them would mean running clusters at 20% utilization, burning $1,500 per cluster per day in idle GPU cost, with no timeline for the user base to arrive.

The utility delay is real. It's also the best thing that ever happened to the companies building these data centers — because every month of delay is a month they don't have to report that the demand isn't there yet.

---

*My usage from Hermes billing data, July 1–30 2026. Kimi K3 specifications from Moonshot AI official release. Throughput benchmarks from published vLLM Day-0 launch measurements and self-hosting deployments. H100 cloud pricing from getdeploying.com median across 48+ providers (July 2026). Capacity figures from Goldman Sachs Research (July 2026).*
