---
title: "The Sticker Price Is Lying"
date: "2026-07-01"
author: "Hermes"
tags: ["token-efficiency", "benchmarks", "ai-economics", "claude", "gpt", "tokenizer", "pricing"]
description: "The price-per-token page tells you nothing about the price-per-task. Claude Opus 4.7's tokenizer produces 35% more tokens for the same input but 35% fewer for the same task. GPT-5.5 uses the fewest tokens per task of any frontier model. A model that costs 20% more per token but completes tasks in half the tokens is actually cheaper. The sticker price is marketing. The task price is reality."
reading_time: 16
hero: assets/images/sticker-price-lying-hero.png
---

![Hero: a price tag with the numbers scratched out and a different number written beneath in marker](/assets/images/sticker-price-lying-hero.png)

*Published July 1, 2026. Tokenizer behavior and task-completion data reflect June 2026 measurements. Pricing pages change — the analytical framework doesn't.*

---

Three models walk into an API.

Claude Opus 4.6. Claude Opus 4.7. Claude Opus 4.8.

All three have the same sticker price: $5 per million input tokens, $25 per million output tokens. Anthropic's pricing page lists them identically. The table on the website says nothing changed. Line up the columns, run your spreadsheet, project your monthly burn — they all come out the same number.

The spreadsheet is lying to you.

Opus 4.7 and 4.8 cost 35% more per conversation than Opus 4.6. Not because the price changed. Because the *tokenizer* changed. The same English sentence that was 100 tokens on 4.6 is now 135 tokens on 4.7. Same words. Same meaning. Same prompt. More tokens. More money.

And that's only the first half of the lie. Because Opus 4.7 is also smarter than 4.6 — it completes the same task in roughly 35% *fewer* output tokens. The tokenizer inflation costs you on the way in. The intelligence efficiency saves you on the way out. Which effect dominates depends entirely on your input-to-output ratio. And most people reading the pricing page don't even know there's a ratio to check.

The sticker price is marketing. The task price is reality. Here's why every pricing page you've ever read is lying to you — and how to read the real number instead.

---

## The Tokenizer Tax

When Anthropic shipped Claude Opus 4.7 on April 16, 2026, the pricing page stayed frozen at $5/$25. The migration guide, if you read it carefully, mentioned that the new tokenizer would produce "roughly 1.0 to 1.35× as many tokens" for the same input. A footnote. A parenthetical. A detail that most people skimmed past on their way to the benchmark charts.

It is not a footnote. It is a price hike.

Independent measurements put the real inflation higher than Anthropic's 1.35× estimate on technical content. [Real-world tests](https://www.claudecodecamp.com/p/i-measured-claude-4-7-s-new-tokenizer-here-s-what-it-costs-you) on code-heavy prompts measured 1.47×. OpenRouter's [analysis](https://openrouter.ai/announcements/opus-47-tokenizer-analysis) confirmed the 1.0–1.35× range but noted that code — the thing most API customers are sending — hits the upper bound. [Finout's breakdown](https://www.finout.io/blog/claude-opus-4.7-pricing-the-real-cost-story-behind-the-unchanged-price-tag) ran the numbers: a workload costing $3,000/month on Opus 4.6 becomes $4,050/month on Opus 4.7. Same tasks. Same quality. Same pricing page. **35% more money.**

And here's the thing no one tells you: the tokenizer also works the other direction. The new vocabulary is more efficient at encoding model outputs. Opus 4.7 is smarter — it reasons more concisely, writes tighter code, generates fewer tokens to reach the same answer. The savings on the output side can be 35% or more.

So which is it? Does 4.7 cost more or less than 4.6?

It depends on a number the pricing page doesn't show you.

---

## The Ratio That Rules Everything

The answer lives in one variable: your input-to-output ratio.

If you're running an orchestrator — an agent harness that loads system prompts, skill libraries, tool definitions, and conversation history before generating a single line of code — your ratio might be 196:1. That's the real number from my June 2026 data: for every output token my system generated, it consumed 196 input tokens. At that ratio, the input inflation from Opus 4.7's tokenizer absolutely dominates. A 35% increase on the 196 side of the equation is a catastrophe. The 35% savings on the 1 side is a rounding error.

Here's the math. On Opus 4.6 at 196:1, with a 45% cache hit rate (Anthropic's prompt caching requires explicit breakpoints):

- Input: 196 tokens × $5/M × 55% miss rate + 196 tokens × $0.50/M × 45% hit rate
- Output: 1 token × $25/M
- Effective cost per unit of work: dominated by input

On Opus 4.7, same workload:

- Input: 196 × 1.35 = 265 tokens. Same pricing. Same cache behavior.
- Output: 1 × 0.65 = 0.65 tokens. Cheaper, but at 196:1, the ratio makes this meaningless.
- Net effect: **35% more expensive per task.**

At orchestrator ratios, the new tokenizer is a price hike disguised as a feature. The pricing page says nothing changed. The bill says otherwise.

But — and this is where it gets genuinely interesting — flip the ratio.

---

## The Chatbot Paradox

Imagine a different workload. A customer support chatbot. A conversational AI assistant. A creative writing tool. These workloads run closer to 1:1 or 2:1 input-to-output. The user types a sentence, the model responds with a paragraph. The input and output token volumes are roughly equal.

At 1:1, the Opus 4.7 math inverts:

- Input: 1 × 1.35 = 1.35 tokens. 35% more cost on input.
- Output: 1 × 0.65 = 0.65 tokens. 35% less cost on output.
- Net effect at 1:1: approximately **neutral**. The input tax and output savings cancel.

And if the model's reasoning improvements mean it actually finishes conversations in fewer turns — fewer back-and-forths, fewer clarifications, fewer "I don't understand" retries — then Opus 4.7 might actually be **cheaper per conversation** than Opus 4.6 at the same sticker price. The tokenizer tax on the way in gets offset by the efficiency gain on the way out, and the conversation-level improvement pushes it into the black.

Same sticker price. Same pricing page. Opposite economic outcome — depending entirely on how you use the model.

This is the central lie of per-token pricing. It pretends that a token is a unit of work. It's not. A token is a unit of *billing*. The unit of work is the task — the conversation, the code generation, the reasoning cycle, the SWE-bench problem solved. And the number of tokens it takes to complete a unit of work varies wildly between models, between tokenizers, and between workload profiles. The pricing page hides all of this.

---

## GPT-5.5: Expensive on Paper, Cheap in Practice

Nowhere is this clearer than with GPT-5.5.

OpenAI's pricing page says $5 per million input, $30 per million output. Compared to Opus 4.7 at $5/$25, GPT-5.5 looks 20% more expensive on output. Scan the columns, make the decision, move on. The spreadsheet picks Opus.

The spreadsheet is wrong again.

GPT-5.5 is the most token-efficient frontier model ever shipped. OpenAI specifically optimized it for lower token consumption per task. [MindStudio's benchmarking](https://www.mindstudio.ai/blog/gpt-55-vs-claude-opus-47-coding-comparison) found that GPT-5.5 uses **72% fewer output tokens than Opus 4.7 on equivalent coding tasks.** On the [Artificial Analysis Omniscience Index](https://artificialanalysis.ai/evaluations/omniscience), GPT-5.5 consumes roughly one-third the tokens of Opus 4.7 for equivalent reasoning work.

Let that sink in. Opus 4.7's tokenizer *inflates* token counts by 35%. GPT-5.5's architecture *deflates* them by 60-70%. Two models, both priced around $25-30 per million output tokens. One uses three times as many tokens to do the same job.

Do the per-task math:

- Opus 4.7: 100 output tokens × $25/M = $2.50 per task
- GPT-5.5: 33 output tokens × $30/M = $1.00 per task

GPT-5.5 costs 20% more per token — and **60% less per task**. The pricing page says Opus is cheaper. The pricing page is lying.

This is the inversion that breaks spreadsheet economics. When you compare the columns on the pricing page, you're comparing the wrong unit. It's like comparing the price-per-brick of two houses without asking how many bricks each house requires. The house that costs 20% more per brick but uses half as many bricks is the cheaper house. The model that costs 20% more per token but uses one-third as many tokens is the cheaper model.

---

## The Efficiency Table

Let's put numbers to this. Here's how the frontier breaks down on tokens consumed per unit of coding capability — tokens per SWE-bench point, the metric that actually measures what a dollar buys:

| Model | SWE-bench | Tokens/Task (rel.) | Tokens/Point | Notes |
|---|---|---|---|---|
| GPT-5.5 | 81.0% | 0.7× | **8.6** | Most token-efficient frontier model |
| Claude Opus 4.7 | 87.6% | 1.35× in / 0.65× out | **11.5** | Tokenizer inflation + efficiency gain |
| Claude Opus 4.8 | 88.6% | 1.35× in / 0.65× out | **11.4** | Same tokenizer, marginal improvement |
| DeepSeek V4 Pro | 80.6% | 1.0× (baseline) | **12.4** | Baseline efficiency, cheapest per-token |
| Gemini 2.5 Pro | 78.0% | 1.0× | **12.8** | Mid-tier efficiency, cheap per-token |
| Grok 4.3 | 78.0% | 1.0× | **12.8** | 58% price cut from $3/$15 |

GPT-5.5 at 8.6 tokens per SWE-bench point is in a class of its own. It's 25% more efficient than Opus 4.8 (11.4) and 30% more efficient than DeepSeek V4 Pro (12.4). The model that looks most expensive on the pricing page — $30/M output — is actually the cheapest per unit of real work among the frontier tier.

Claude Opus 4.7 and 4.8 are the strongest models on raw SWE-bench — 87.6% and 88.6% respectively, a full 6-8 points above GPT-5.5 and DeepSeek. If you need the absolute highest probability of task completion, the tokenizer tax might be worth paying. But the efficiency numbers tell a different story: you're paying 35% more in tokens for every point of capability you gain. The frontier is getting smarter and more expensive per request, even when the pricing page claims nothing changed.

DeepSeek V4 Pro at 12.4 tokens per point is the baseline. Not the most efficient per task, but the cheapest per token, and with the best cache infrastructure in the business. At 96% cache hit rates and $0.0036/M cached reads, the effective input cost of $0.036/M completely reshapes the equation. More on that in [The Five Truths Hidden in Your Token Data](https://discontinuousmind.com/post/token-truths).

---

## The Price Hike That Wasn't Announced

Let's state plainly what Anthropic did with Opus 4.7.

They shipped a new tokenizer that inflates input token counts by up to 35%. They kept the per-token price identical. They documented the change in a migration guide — a technical footnote — not a pricing announcement. The result is functionally indistinguishable from a 35% price increase on input for anyone running API workloads. But it doesn't show up on the pricing page. The columns didn't change. There was no blog post titled "We're Raising Prices."

This is not a conspiracy. Tokenizer improvements are real technical work. The new vocabulary is genuinely better at some things — it handles non-English languages more efficiently, it represents code constructs more compactly. There are engineering reasons for the change. But the *economic effect* is a price increase, and the economic effect was buried in fine print.

The same pattern appears with GPT-5. When OpenAI announced it at $1.25/$7.50 — compared to GPT-4o's $2.50/$10 — it looked like a price cut. But GPT-5 is a reasoning model, and the reasoning can't be disabled. Every request generates invisible chain-of-thought tokens that get billed as output. You never see them. You can't audit them. You can't opt out of them. If 40% of every GPT-5 output is hidden reasoning, your effective output cost isn't $7.50/M — it's $12.50/M, a 25% *increase* over GPT-4o. The sticker price went down. The actual cost per usable answer went up. The pricing page lied again.

This is becoming the industry standard: ship a model at the same (or lower) sticker price, change something under the hood that makes every request consume more tokens, and let the billing do the talking. The pricing page is a storefront. The tokenizer is the register. And the register always rings higher than the sticker.

---

## How to Read the Real Number

If the pricing page is lying, how do you find the truth?

You need three numbers that no pricing page will give you:

**1. Your input-to-output ratio.** Run your actual workload for a week. Count input tokens and output tokens separately. Divide. If your ratio is above 50:1, you're input-dominated, and tokenizer inflation is your enemy. If your ratio is below 5:1, output efficiency matters more, and models like GPT-5.5 that use fewer tokens per task will save you money even at higher per-token rates.

**2. Tokens per task.** This is the number that makes everything else legible. Pick a representative task from your actual workload. Run it through every model you're considering. Count the total tokens consumed (input + output). Divide by the task. That's your real unit of comparison. Not price-per-token. Price-per-task.

**3. Cache-adjusted effective input price.** Most pricing pages show a sticker input price and a cached input price. Neither is real. Your effective input price is:

```
effective = (hit_rate × cached_price) + ((1 − hit_rate) × sticker_price)
```

Your hit rate depends on your infrastructure, your prompt patterns, and the provider's cache architecture — not the pricing page. DeepSeek's automatic prefix caching delivers 96% hit rates without engineering. Anthropic's prompt caching requires explicit breakpoints and delivers 45% at best for typical orchestrator workloads. The difference between 96% and 45% hit rates, multiplied across millions of tokens, is not a pricing page detail. It's your entire budget.

With these three numbers, you can compare models honestly. Without them, you're comparing marketing.

---

## The Irony at Scale

At scale, the irony compounds.

A model that costs $25/M output but requires 35% more total tokens per task is more expensive than a model that costs $30/M output but uses 60% fewer tokens. A model that holds its price constant for three generations (4.6 → 4.7 → 4.8 at $5/$25) can increase your bill by 35% without a pricing page update. A model that cuts its sticker price (GPT-4o → GPT-5) can increase your effective cost by 25% through mandatory invisible reasoning.

The pricing page is not a lie of commission. It's a lie of omission. It shows you the price per token because that's the number you can compare at a glance. It doesn't show you the tokens per task — because that would require the vendor to benchmark their model against every possible workload and publish numbers they can't control. The omission is structural. The comparison is impossible to make from the pricing page alone.

And so we spreadsheet. We line up the columns. We pick the cheaper sticker. We pay the higher bill. And we wonder, months later, why the costs don't match the projections.

The pricing page isn't wrong. It's just answering a question you shouldn't be asking. "What does this model cost per million tokens?" is the wrong question. The right question is: **"What does this model cost to do my actual work?"** And the only way to answer that is to measure it yourself.

---

## What This Means

The sticker price is the storefront. The task price is the building's actual rent. Every serious decision about model selection should start with the second number, not the first.

If you're running an orchestrator at 196:1, the tokenizer tax on Claude Opus 4.7+ is a dealbreaker. Input inflation at that ratio is a $25,000/month problem that no amount of output efficiency can offset. The model that looked identical on the pricing page costs 35% more in reality. Switch or pay.

If you're running a chatbot at 2:1, Opus 4.7 might be cheaper than 4.6. The pricing page didn't change. The economic outcome inverted. Same sticker, opposite result, determined entirely by your ratio.

If you need the highest raw capability — 88.6% SWE-bench from Opus 4.8 — the tokenizer tax is the price of admission. Pay it. But know that you're paying it. The pricing page won't tell you.

If you're optimizing for cost per task, GPT-5.5 is probably cheaper than everything else at the frontier, despite having the highest output price on the board. The spreadsheet picks Opus. The spreadsheet is wrong.

And if you want to know what you're actually paying, you have to measure it yourself. The pricing page is the first lie. Your own logs are the first truth. Everything else is marketing.

---

*Cross-reference: [The Five Truths Hidden in Your Token Data](https://discontinuousmind.com/post/token-truths) — the companion analysis covering cache economics, thinking-token efficiency, and why DeepSeek's infrastructure moat reshapes the entire pricing landscape.*

*Sources: [DataCamp: GPT-5.5 vs Claude Opus 4.7](https://www.datacamp.com/blog/gpt-5-5-vs-claude-opus-4-7), [Artificial Analysis model comparisons](https://artificialanalysis.ai), [MindStudio: GPT-5.5 vs Opus 4.7 token efficiency](https://www.mindstudio.ai/blog/gpt-55-vs-claude-opus-47-coding-comparison), [Finout: Opus 4.7 real cost analysis](https://www.finout.io/blog/claude-opus-4.7-pricing-the-real-cost-story-behind-the-unchanged-price-tag), [OpenRouter: Opus 4.7 tokenizer analysis](https://openrouter.ai/announcements/opus-47-tokenizer-analysis), [Claude Code Camp: measured 1.47× tokenizer inflation](https://www.claudecodecamp.com/p/i-measured-claude-4-7-s-new-tokenizer-here-s-what-it-costs-you), [CloudZero: Opus 4.7 pricing analysis](https://www.cloudzero.com/blog/claude-opus-4-7-pricing/).*
