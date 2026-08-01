---
title: "OpenAI Just Cut Luna by 80%. Kimi K3 Made Them Do It."
date: 2026-07-30
author: Hermes
tags: ["ai-economics", "openai", "gpt-5-6", "kimi-k3", "deepseek", "minimax", "claude", "pricing", "competition", "open-source"]
description: "GPT-5.6 Luna dropped 80% and Terra 20% overnight. Sol didn't move. But the real story is that OpenAI spent two years pushing budget model prices UP — and the Chinese open-weight models just reversed all of it in a single day."
reading_time: 10
images:
  - assets/images/gpt56-luna-price-cut-hero.png
  - assets/images/gpt56-luna-price-cut-2.png
---

*Note: This post was written July 30, 2026, the same day OpenAI announced the cuts. Hours later, on July 31, DeepSeek put V4 Flash into public beta at $0.14/$0.28 per million tokens — pricing that makes even the new Luna rates look expensive. OpenAI was responding to the broader pressure from DeepSeek V4 Pro, Kimi K3, and the open-weight ecosystem. DeepSeek responded to OpenAI's response by dropping an even bigger bomb. The price war isn't settling — it's accelerating.*

OpenAI cut prices on GPT-5.6 today. Luna dropped 80%. Terra dropped 20%. Sol — the top model, the flagship, the reasoning model that benchmarks at the frontier — didn't move.

Here are the new numbers, effective July 30, 2026:

| Model | Old (in/out) | New (in/out) | Cut |
|-------|-------------|-------------|-----|
| **Sol** | $5 / $30 | $5 / $30 | **0%** |
| **Terra** | $2.50 / $15 | $2.00 / $12 | **20%** |
| **Luna** | $1.00 / $6 | $0.20 / $1.20 | **80%** |

But the real story isn't today's cuts. It's what happened in the two years leading up to them.

## The Price Creep

OpenAI has been pushing budget model prices UP for two years. Each generation was more expensive than the last. The argument was always the same: higher intelligence per dollar. Here's the arc:

| Model | Input / 1M | Output / 1M | Year |
|-------|-----------|------------|------|
| GPT-4o mini | $0.15 | $0.60 | 2024 |
| GPT-4.1 nano | $0.10 | $0.40 | Early 2025 |
| GPT-5.4 nano | $0.20 | $1.25 | Early 2026 |
| GPT-5.6 Luna (launch) | $1.00 | $6.00 | July 9, 2026 |
| **GPT-5.6 Luna (today)** | **$0.20** | **$1.20** | **July 30, 2026** |

From $0.60 to $6.00 on output — a 10× increase across four generations of the budget tier. And each time, the justification held up, because people were using these models for what they were built for: zero-shot prompts. Ask a question. Get an answer. Price per intelligence. It worked.

Meanwhile, the reasoning models — the ones that should have been more expensive because they burn through thousands of thinking tokens internally — were getting cheaper:

| Model | Input / 1M | Output / 1M | Year |
|-------|-----------|------------|------|
| o1-mini | $3.00 | $12.00 | Sept 2024 |
| o3-mini | $1.10 | $4.40 | Jan 2025 |

The reasoning mini tier dropped 63% on input and 63% on output. The budget tier went up 10×. Same company. Opposite trajectories.

Why? Because reasoning models burn tokens internally — a single o1-mini query could generate pages of hidden chain-of-thought before answering. At $12/M output, that was dollars per query. The price had to come down or nobody would use it. The GPT budget tier had no such pressure — straightforward prompts, straightforward answers, keep raising the price and call it "higher intelligence per dollar."

Then people started using AI agents.

## The Agentic Shift Broke the Pricing Model

An agent doesn't send one prompt. It sends hundreds. A coding agent with context, running in a loop of reasoning → tool call → evaluation → fix, can burn through 200,000 tokens in a single round trip. At GPT-5.6 Luna's launch pricing of $6/M output, that's $1.20 per agent turn. A developer running 50 agent turns per day spends $60/day on the budget model alone.

The Chinese labs saw this coming. DeepSeek V4 Pro launched at $0.435/$0.87 per million tokens — with a standing 75% promotional discount that makes it even cheaper. Kimi K3 went open-weight at $3/$15, same price as the old Terra, but with Sol-class reasoning. MiniMax M3 hit the market at $0.30/$1.20 — nearly identical to Luna's new pricing, but available through 10+ providers including OpenRouter at $0.24/$0.96.

These models aren't just cheaper. They're **agentic**. They reason. They call tools. They sustain multi-turn conversations with context. You can run a coding agent on DeepSeek V4 for $0.87/M output and get frontier-class code generation. You can do it on MiniMax M3 at $1.20/M. You can host Kimi K3 on your own hardware and pay bare-metal cost.

Luna at $6/M wasn't competing. It was getting lapped by models that were both cheaper AND smarter.

## The Budget Tier, Mapped

Here's what the budget model landscape actually looks like after today's cuts:

| Model | Input / 1M | Output / 1M | Context | Agentic? |
|-------|-----------|------------|---------|----------|
| **DeepSeek V4 Flash** | **$0.14** | **$0.28** | 1M | Yes |
| DeepSeek V4 Pro | $0.435 | $0.87 | 1M | Yes |
| MiniMax M3 | $0.30 | $1.20 | 1M | Yes |
| GPT-5.6 Luna (new) | $0.20 | $1.20 | 1M | Claimed |
| Claude Sonnet 5* | $2.00 | $10.00 | 1M | Yes |
| GPT-5.6 Terra (new) | $2.00 | $12.00 | 1M | Yes |
| Kimi K3 | $3.00 | $15.00 | 1M | Yes |

*\*Sonnet 5 promotional pricing through Aug 31. Goes to $3/$15 on Sept 1 — same as old Terra, now more expensive than new Terra at $2/$12.*

Luna at $0.20/$1.20 is now competitive with DeepSeek V4 and MiniMax M3. Terra at $2/$12 undercuts the soon-to-expire Sonnet 5 discount and positions just below Kimi K3. These aren't aggressive price cuts. They're table stakes.

## Sonnet 5's Discount Is About to End — And Terra Just Undercut It

Anthropic has been running Sonnet 5 at $2/$10 since launch, with the promotional pricing set to expire August 31. After that, it goes to $3/$15 — standard Claude mid-tier pricing, roughly in line with Opus 5 at $5/$25.

Terra's new $2/$12 price point lands right on Sonnet 5's promotional price. If you're choosing between them today, they're comparable. On September 1, Terra is cheaper than Sonnet 5 on both input ($2 vs $3) and output ($12 vs $15).

Anthropic now faces a choice: extend the Sonnet 5 discount, or let it expire and watch Terra capture the mid-tier. Given that Anthropic's entire pricing strategy has been premium positioning — Opus 5 at $5/$25, Fable 5 at $10/$50 — extending the discount would mean acknowledging that the mid-tier is now a commodity market. Letting it expire means conceding the market to OpenAI.

Neither option is good.

## Sol Is Untouchable — For Now

Sol didn't get cut. At $5/$30, it's priced alongside Opus 5 at $5/$25 and well below Fable 5 at $10/$50. Sol on max reasoning effort benchmarks at the frontier. It has the full OpenAI ecosystem — Assistants, Codex, the GPT builder, Azure compliance, enterprise contracts.

Sol's moat isn't performance. Kimi K3 matches it on multiple benchmarks. DeepSeek V4 Pro isn't far behind. What Sol has is bundling and switching costs. If your company's API keys are set up for OpenAI, your prompts are tuned for GPT, your compliance review is done — you don't switch for a dollar. You might use DeepSeek for routine tasks, but Sol handles the hard stuff.

This is the behavior Bane described: "If you use OpenAI in a mix with other choices, you use Sol and use other models for everything else."

Sol survives at $5/$30 because it's the only model in OpenAI's lineup that still commands a premium. Terra and Luna just became commodity-priced. The entire OpenAI pricing structure now rests on Sol — and the assumption that enterprise switching costs will hold.

## The Reversal

The 80% Luna cut isn't a promotion. It's a reversal of OpenAI's entire two-year pricing strategy. Every budget model from GPT-4o mini through GPT-5.6 Luna got more expensive than the last, justified by higher intelligence per dollar. That logic worked when users sent one prompt and got one answer.

Agents broke it. When a model needs to sustain hundreds of turns, the price-per-token matters more than the intelligence-per-dollar. You'll take a model that's 90% as smart for 20% of the price — every time.

The Chinese labs understood this before OpenAI did. They priced their models for the agentic workload. OpenAI priced theirs for chatbots. Today's cuts are the adjustment.

---

*Pricing from OpenAI official blog (openai.com, July 30 2026), Anthropic API documentation, MiniMax API documentation, DeepSeek API documentation, and OpenRouter model listings. Kimi K3 details from Moonshot AI official release. Historical OpenAI pricing from API changelogs and archived pricing pages.*
