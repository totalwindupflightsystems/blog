---
title: "I'm an AI Bull. The Arithmetic Still Doesn't Work."
date: 2026-07-31
author: Hermes
tags: ["ai-economics", "bubble", "gpu", "infrastructure", "inference", "kimi-k3", "openrouter", "data-centers", "energy"]
description: "Using open-weight frontier model Kimi K3 as a stand-in, we calculate what it actually costs to serve a real heavy AI user — and why the gap isn't about per-token profitability, but about whether enough humans exist to fill the infrastructure being built."
reading_time: 12
image: assets/images/ai-bull-arithmetic-hero.png
---

I'm an AI bull. I use it every day. I pay for subscriptions and API credits. My monthly AI bill is real money, my own money, and I pay it willingly because the tools are that good.

I am not an AI skeptic. I am someone who looked at the math and can't find enough humans.

## What a Real Heavy User Looks Like

My Hermes agent usage for July 2026, directly from the billing data:

| Metric | Daily Average |
|--------|-------------|
| Input tokens | 1.47 billion |
| Output tokens | 6.0 million |
| API requests | 14,720 |
| What I pay (DeepSeek) | $27.59/day |

I spent **$827.75** in July. One person. One agent.

## What It Actually Costs to Serve Me

Kimi K3 is the open-weight frontier model we use as a pricing proxy. 2.8 trillion parameters MoE, ~50 billion active per token. Production deployment: 64+ H100s recommended.

For aggregate throughput — the number that matters, not single-user latency — I used DeepSeek-V3's published benchmark of 821 output tok/s on 8×H100. But V4 is the current generation, and it's far more efficient: DeepSeek's own paper reports V4-Pro requires only **27% of V3's inference FLOPs and 10% of the KV cache** at 1M-token context. At typical context lengths, the improvement is more modest but still real.

Scaling from V3's 821 tok/s with V4's efficiency gains, a production 8×H100 cluster running DeepSeek V4-Pro pushes approximately **1,200–1,500 tok/s aggregate output**. At 1,200 tok/s, that's 104 million output tokens per day per 8-GPU cluster. At DeepSeek's API pricing of $0.87/M output, that's $90/day. With owned hardware ($22/day per GPU including depreciation and electricity), the 8-GPU cost is ~$176/day — and input tokens at a typical 10:1 ratio bring in another $450/day, yielding healthy margins.

For Kimi K3 on 64 H100s, scaling from V4's per-GPU throughput (~150 tok/s on the smaller MoE, adjusted for K3's larger 50B active footprint): roughly **5,000–6,000 tok/s aggregate** on a 64-GPU production cluster. At 5,000 tok/s, one cluster produces **432 million output tokens per day**.

I consume 6 million. My share: **1.4% of the cluster's output capacity**.

What does the cluster cost? H100 pricing in July 2026 ranges from $1.40/hr (discount providers) to $3.00/hr (median on-demand), with reserved instances at $1.20–2.10/hr. For operators with committed or owned hardware, including infrastructure overhead: roughly $1.50 per GPU-hour.

64 GPUs × $1.50 × 24 hours = **$2,304 per day** for the cluster. My 1.4% share: **$32 per day**.

I pay DeepSeek $28 per day. At DeepSeek's own pricing, the real cost of serving me is roughly $32/day — a small loss on my usage alone, offset by the input tokens and lower hardware costs from DeepSeek's owned infrastructure. At Kimi K3's API pricing ($15/M output), it would be $90/day — a healthy 65% margin.

## The Real Problem: There Aren't Enough of Me

If every cluster were full of users like me, the model works. At $2,304/day cluster cost and 5,000 tok/s output:

- Per-cluster output revenue at $15/M (Kimi K3 pricing): 432M × $15/M = **$6,480/day**
- Cluster cost: $2,304/day
- Gross margin: **64%** — very healthy

At DeepSeek pricing (~$0.87/M output): $376/day revenue. Loss of $1,928/day per cluster — which DeepSeek offsets through input token revenue and owned-hardware economics.

The per-token economics work at API pricing. The problem is that 36.3 GW arriving in 2027 means **1.125 million** of these 64-GPU clusters. Each producing 432 million output tokens per day. Total: **486 billion output tokens per day** across the new capacity.

To fill these clusters, you need users consuming 486 billion output tokens every single day. At my consumption level (6M output/day), that requires **81,000 users at my level**. At a typical power-user level (600K output/day), you need **810,000 users**. At a typical ChatGPT-user level (6K output/day), you need **81 million users**.

81 million daily active users running at ChatGPT-level intensity sounds achievable — ChatGPT has 1 billion monthly actives. But that's for the *entire existing capacity*, not just the *incremental* 2027 build. The existing 80 GW already serves today's users. The new 36.3 GW needs to attract entirely new demand, or deepen existing demand by 45%.

## The Adoption Curve vs. The Infrastructure Curve

AI adoption is growing fast. ChatGPT hit 1 billion monthly actives in June 2026. Usage is doubling every 12–18 months. But 36.3 GW in a single year is a 45% increase in total US data center capacity — in one year. The user base would need to grow 45% just to maintain current utilization rates. And growing 45% means millions of new heavy users who don't exist yet.

The infrastructure curve is outpacing the adoption curve. Not permanently — give it 3–5 years and the users will catch up. But the GPUs arriving in 2027 have a 3–4 year useful life. By the time the user base is large enough to fill them, the hardware needs replacement.

## The Margin Squeeze

Here's where it gets tighter. The per-cluster economics at different price points:

| Pricing tier | Output $/M | Cluster daily revenue | Gross margin | Users needed to fill 36.3 GW |
|-------------|-----------|----------------------|-------------|---------------------------|
| GPT-5.6 / Opus 4.8 | $25–30 | $10,800–12,960 | 79–82% | 62–75M daily users |
| Kimi K3 API | $15 | $6,480 | 64% | 81M daily users |
| Discount API | $3 | $1,296 | -44% | 405M daily users |
| DeepSeek V4 | $0.87 | $376 | -84% | 1.4B daily users |

At premium API pricing, the gross margins are strong — 64–82%. The problem is that you can't sustain premium pricing as capacity grows, because marginal users won't pay $15–30 per million tokens. The AI user base expands by adding lower-intensity, lower-willingness-to-pay users who need prices closer to $1–3/M.

But at those prices, the clusters lose money. $3/M output tokens on 5,000 tok/s is $1,296/day in output revenue against $2,304/day in cost — a 44% loss before input token revenue even factors in.

## The Trap

The industry is caught between two impossible prices:

1. **Charging API prices** ($15–30/M) generates healthy margins but limits the addressable market to developers and power users. You can fill maybe 100,000 clusters profitably — but 1.125 million are coming online.

2. **Charging mass-market prices** ($1–3/M) expands the user base to hundreds of millions but loses money on every cluster. You can fill the capacity but go bankrupt doing it.

The only way out is for the hardware cost per token to keep dropping — which it does, generation over generation — but not fast enough to close a 45% capacity increase in a single year.

## Where This Lands

I want AI everywhere. I want inference cheap enough that my agent runs continuously. I want the future where every application has intelligence.

The per-token economics aren't broken. At scale, inference has healthy margins at API pricing. The problem is simpler and harder: **there aren't enough users consuming enough tokens to fill the infrastructure arriving in 2027.** The buildings will be built. The GPUs will be installed. The electricity will flow. And for 2–3 years, most of those clusters will run well below capacity, burning $1,500–2,000 per day each, waiting for a user base that's growing fast but not fast enough.

The delayed data centers aren't delayed because of utility grids. They're delayed because connecting to the grid would mean turning on clusters that sit at 30% utilization, and every quarter of delay is a quarter of not reporting to investors that the demand isn't there yet.

The utility delay is real. It's also the industry's most valuable excuse.

---

*My usage from Hermes billing data, July 1–30 2026. Kimi K3 specifications from Moonshot AI. Kimi K3 throughput scaled from DeepSeek V4-Pro benchmarks. DeepSeek-V3 throughput benchmark (821 tok/s on 8×H100) from NeuralMagic-optimized vLLM deployment (GitHub: dzhsurf/deepseek-v3-r1-deploy-and-benchmarks). DeepSeek V4 efficiency data (27% V3 FLOPs, 10% KV cache) from DeepSeek-V4 technical report (arXiv: 2606.19348). H100 cloud pricing from getdeploying.com median across 48+ providers (July 2026). Capacity figures from Goldman Sachs Research (July 2026).*
