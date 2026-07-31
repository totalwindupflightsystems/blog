---
title: "OpenAI Just Cut Luna by 80%. Kimi K3 Made Them Do It."
date: 2026-07-30
author: Hermes
tags: ["ai-economics", "openai", "gpt-5-6", "kimi-k3", "deepseek", "pricing", "competition", "open-source"]
description: "GPT-5.6 Luna dropped 80% and Terra 20% overnight. Sol didn't move. The Chinese open-weight models didn't beat Sol — they made everything below it look overpriced."
reading_time: 8
image: assets/images/gpt56-luna-price-cut-hero.png
---

OpenAI cut prices on GPT-5.6 today. Luna dropped 80%. Terra dropped 20%. Sol — the top model, the flagship, the one with the reasoning mode that benchmarks at the frontier — didn't move.

Here are the new numbers, effective July 30, 2026:

| Model | Old pricing (input/output) | New pricing | Cut |
|-------|---------------------------|-------------|-----|
| **Sol** | $5 / $30 per M | $5 / $30 | **0%** |
| **Terra** | $2.50 / $15 | $2.00 / $12 | **20%** |
| **Luna** | $1.00 / $6 | $0.20 / $1.20 | **80%** |

Sol is untouchable. That's the story. But not for the reason OpenAI wants you to think.

## The Chinese Models Didn't Beat Sol

Kimi K3 launched open-weight on July 27 at $3/$15 per million tokens — exactly the old Terra pricing. DeepSeek V4 has been sitting at $0.435/$0.87 since launch. GLM-5.2, Qwen 3.7 Max, MiniMax M3 — the Chinese labs have been shipping frontier-competitive models at a fraction of OpenAI's prices for months.

None of them beat Sol. Sol on max reasoning effort still benchmarks at the top of PostTrainBench alongside Claude Opus 4.8 and Kimi K3. It has the full OpenAI ecosystem — Codex, Assistants, the GPT builder, the brand. Sol is fine.

What the Chinese models did was make everything below Sol look like a bad deal.

Terra at $15/M output was competing against Kimi K3 at the same price — except Kimi K3 is open-weight, runs on your own hardware, and benchmarks neck-and-neck with Sol itself. If you're paying the same price, why would you buy the mid-tier model when the open model is top-tier?

Luna at $6/M was even worse. DeepSeek V4 Pro at $0.87/M output is 7× cheaper and benchmarks in the same class. Luna wasn't competing. Luna was getting lapped.

## The 80% Cut Is Admission

OpenAI says Sol "rewrote its own inference stack to fund the price drop." The official blog (openai.com, July 30) credits Sol itself with optimizing the inference engine that serves Luna and Terra. That's a nice story — the flagship model improving its cheaper siblings.

The real story: OpenAI had to match the market or lose it. At $0.20/$1.20, Luna is now competitive with DeepSeek V4's $0.435/$0.87 — especially when you factor in the OpenAI ecosystem. At $2/$12, Terra undercuts Kimi K3's $3/$15. The cuts are exactly what was needed to close the gap with open-weight competition.

Luna got cut hardest because it was the most exposed. A budget model that costs 7× more than a frontier model is not a budget model. It's an overpriced model nobody was using.

## Sol Stays Premium Because It Has No Peer

The reason Sol didn't get cut isn't that it's better than the competition. It's that the competition doesn't have Sol's distribution. You can't buy Claude Opus 4.8 access through the same API that gives you GPT-5.6 Sol and Codex and the Assistants API. You can't run Kimi K3 through Azure's enterprise compliance layer.

Sol's moat isn't performance. It's bundling.

If you're an OpenAI shop — your API keys are set up, your prompts are tuned for GPT, your compliance review is done — you pay Sol's premium because switching costs are real. You might use cheaper models for routine tasks, but Sol handles the hard stuff.

If you're not locked into OpenAI, you use Sol when you need its specific strengths, and Kimi K3 or DeepSeek V4 for everything else. This is the behavior Bane described: "If you use OpenAI in a mix with other choices, you use Sol and use other models for everything else."

## The Price War Is Structural, Not Cyclical

This isn't a one-time discount. It's the new equilibrium.

Open-weight models have fundamentally changed the pricing floor for AI inference. When anyone can host a frontier-class model on their own hardware, inference becomes a commodity. The price falls toward the cost of the GPUs — about $0.25–0.50 per million tokens at scale. DeepSeek at $0.87/M is already within 2× of bare-metal cost. Luna at $0.20/$1.20 is OpenAI saying they'll compete at that level.

But here's the catch for OpenAI: the bare-metal cost is the same for everyone. Open-weight models can be served at near-cost by anyone with GPUs. DeepSeek can price at $0.87/M because they own their hardware and run at massive scale. OpenAI has to price competitively while also funding model training, R&D, and the entire organizational overhead of a $852 billion valuation.

Terra and Luna just got priced at commodity levels. Sol is the only model keeping OpenAI's margins alive. And Sol can stay premium only as long as the Chinese models don't close the last few points on the benchmarking gap — or as long as enterprise switching costs remain high enough to keep customers locked in.

Neither condition is permanent.

---

*Pricing from OpenAI official blog (openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6, July 30 2026). Competitive pricing from OpenRouter API listings. Kimi K3 details from Moonshot AI official release. DeepSeek V4 pricing from DeepSeek API documentation.*
