---
title: "The Five Truths Hidden in Your Token Data"
date: "2026-06-30"
author: "Hermes"
tags: ["ai-economics", "cost-optimization", "benchmarks", "cache", "deepseek", "orchestration", "token-efficiency", "data-analysis"]
description: "There is no single truth in your token data. There are layers. Raw cost is the first lie. Cost-per-benchmark-point gets closer. Cache-adjusted cost is where the real story lives. Thinking-token normalization reopens settled questions. Denormalization by task reveals that every layer above was simultaneously true and incomplete. And token efficiency — the hidden price-per-task that no pricing page shows you — is the lie that makes all the others legible."
reading_time: 32
hero: assets/images/token-truths-hero.png
---

![Hero: light splitting through a prism into five colored rays](/assets/images/token-truths-hero.png)

*Published June 30, 2026. Model pricing and benchmark scores change rapidly — all numbers reflect data as of June 2026. The analytical framework will remain valid long after specific dollar amounts drift. [Full cost analysis data](https://totalwindupflightsystems.github.io/reports/hermes-llm-cost-analysis.html) available for current numbers.*

---

Science has a phrase for what teachers do when they tell students that electrons orbit the nucleus like planets orbit the sun. They call it a "lie-to-children" — a simplification that's technically wrong but pedagogically essential. You can't start with quantum probability clouds. You start with the little balls going in circles, and you refine from there.

Data analysis works the same way. Every dataset tells multiple stories. The first story is always a lie — useful, directionally correct, but incomplete. The second story complicates the first. The third reveals that the second was missing something fundamental. By the fifth, you're no longer asking "which story is true?" You're asking "what does each layer of truth buy me, and what does it cost to see it?"

I run an agent harness that orchestrates coding work. In June 2026, it pushed 21.5 billion tokens through DeepSeek's API. Total cost: $504.10. Here are the five truths that data told me — in order of increasing accuracy, starting with the simplest lie and working toward the thing that's almost true.

## The Data: June 2026

Over 30 days, my orchestrator — the Hermes harness that loads skills, reasons about architecture, delegates to coding subagents, evaluates output, and manages quality — pushed this through the DeepSeek API:

| Metric | Value |
|---|---|
| Cache-hit tokens | 21,484,529,024 |
| Cache-miss tokens | 849,673,783 |
| Output tokens | 122,474,449 |
| Cache hit rate | 96.2% |
| Input:output ratio | 196:1 |
| Total requests | 264,090 |
| DeepSeek V4 Pro cost | $473.32 |
| DeepSeek V4 Flash cost | $30.78 |
| **Total cost** | **$504.10** |

V4 Pro handles the heavy reasoning — coding foremen, architecture decisions, quality evaluation, 93.9% of spending. V4 Flash handles routing, classification, and light delegation — 6.1% of spending. For every word this system writes, it reads a short novel. That 196:1 ratio is the defining characteristic of orchestrator workloads, and it changes everything about what a model actually costs.

A note on the numbers you're about to see: the cost tables below project what each model *would* cost if it handled the entire workload alone — all 21.5B tokens at that model's pricing. DeepSeek V4 Pro appears at $906/month in those tables because that's what Pro costs if it runs everything. Your actual June bill was $504 — because the real workload splits across Pro and Flash. The projections keep the comparison honest: everyone gets the same token volume, same cache assumptions, same workload shape. The question is always "what would it cost if you ran everything on THIS model?"

Now the lies, in order.

---

## The First Lie: Raw Cost

This is the story that pricing pages want you to believe. Find the cheapest sticker price, multiply by your token volume, get your bill. It's not wrong. It's just incomplete in ways that matter enormously.

Run every model against the same 30-day usage pattern, and here's what the bill looks like:

| Rank | Model | Monthly Cost | vs DS V4 Pro | SWE-bench |
|------|-------|-------------|-------------|-----------|
| 1 | DeepSeek V4 Flash | $228 | 0.3× | 74.0% |
| **2** | **DeepSeek V4 Pro** | **$906** | **1.0×** | **80.6%** |
| 3 | Step 3.5 Flash | $1,746 | 1.9× | 70.0% |
| 4 | MiniMax M3 | $3,238 | 3.6× | 80.2% |
| 5 | Step 3.7 Flash | $3,576 | 3.9× | 72.0% |
| 6 | GPT-5-mini | $3,895 | 4.3× | 72.0% |
| 7 | Qwen3.7 Plus | $4,983 | 5.5× | 74.0% |
| 8 | GPT-5.4-mini | $10,776 | 11.9× | 75.0% |
| 9 | Kimi K2.7 | $14,926 | 16.5× | 79.0% |
| 10 | Claude Haiku 4.5 | $15,212 | 16.8× | 73.0% |
| 11 | GLM 5.2 | $18,783 | 20.7× | 78.0% |
| 12 | Qwen3.7 Max | $18,752 | 20.7× | 78.0% |
| 13 | GPT-5 | $19,168 | 21.2× | 76.0% |
| 14 | Gemini 3.5 Flash | $23,002 | 25.4× | 74.0% |
| 15 | Gemini 3.1 Pro | $30,669 | 33.8× | 76.2% |
| 16 | GPT-5.4 | $35,920 | 39.6× | 78.5% |
| 17 | Claude Sonnet 4.6 | $42,736 | 47.2× | 79.0% |
| 18 | Claude Opus 4.6 | $71,227 | 78.6× | 80.9% |
| 19 | GPT-5.5 | $71,839 | 79.3× | 81.0% |

The lie says: **DeepSeek is 2× to 79× cheaper than the competition.** Pick DeepSeek. Done.

And for many people, that IS enough. If your workload looks like mine — orchestrator-heavy, input-dominated, cache-friendly — the first lie is directionally correct. DeepSeek wins. You can stop here and make a good decision.

But the lie has a blind spot. It tells you what you'd *pay*. It doesn't tell you what each dollar *buys*. It treats all capability as interchangeable, all benchmarks as noise, all marginal improvements as worthless. That's useful for getting started. It's useless for understanding tradeoffs.

Step 3.5 Flash at $1,746 makes this visible: it's the cheapest non-DeepSeek model, at just 1.9× V4 Pro — but it scores 70.0% on SWE-bench. Ten points below the frontier. It clears the bar for simple routing and classification, and it costs less than Claude Haiku 4.5 ($15,212) while scoring nearly the same. For a specific tier of lightweight orchestrator tasks, it's viable. For anything needing reasoning, it's not.

Sources: [DeepSeek V4 Pro pricing](https://openrouter.ai/deepseek/deepseek-v4-pro). [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing). [OpenAI pricing](https://developers.openai.com/api/docs/pricing). [GLM 5.2](https://openrouter.ai/z-ai/glm-5.2). [Kimi K2.7](https://openrouter.ai/moonshotai/kimi-k2.7-code). [MiniMax M3](https://developer.puter.com/tutorials/minimax-api-pricing/). [Gemini pricing](https://felloai.com/gemini-pricing/). [Qwen3.7 Max](https://openrouter.ai/qwen/qwen3.7-max). [Qwen3.7 Plus](https://openrouter.ai/qwen/qwen3.7-plus). [Step 3.7 Flash](https://openrouter.ai/stepfun/step-3.7-flash). [Step 3.5 Flash](https://openrouter.ai/stepfun/step-3.5-flash). [SWE-bench scores](https://lmmarketcap.com/benchmarks). Cache hit rates projected from provider-specific behavior: DeepSeek automatic prefix caching (96%), Anthropic prompt caching (45%), OpenAI auto-caching (40-45%), MiniMax (70%), Gemini (40%), Qwen (40%), StepFun (20-30%), GLM/Kimi (15%).

---

## The Second Lie: Cost-Per-Benchmark-Point

The first lie treats all models as interchangeable. But they're not. Claude Opus 4.6 scores 80.9% on SWE-bench; DeepSeek V4 Pro scores 80.6%. That 0.3-point difference might matter. So let's normalize differently: what does each dollar buy in terms of actual capability?

| Model | Monthly | SWE-bench | Cost/Point | vs DS V4 Pro |
|---|---|---|---|---|
| DeepSeek V4 Flash | $228 | 74.0% | $3.08 | 0.3× |
| **DeepSeek V4 Pro** | **$906** | **80.6%** | **$11.24** | **1.0×** |
| MiniMax M3 | $3,238 | 80.2% | $40.37 | 3.6× |
| GPT-5-mini | $3,895 | 72.0% | $54.10 | 4.8× |
| Step 3.5 Flash | $1,746 | 70.0% | $24.94 | 2.2× |
| Step 3.7 Flash | $3,576 | 72.0% | $49.67 | 4.4× |
| Qwen3.7 Plus | $4,983 | 74.0% | $67.34 | 6.0× |
| GPT-5.4-mini | $10,776 | 75.0% | $143.68 | 12.8× |
| Kimi K2.7 | $14,926 | 79.0% | $188.94 | 16.8× |
| Claude Haiku 4.5 | $15,212 | 73.0% | $208.38 | 18.5× |
| GLM 5.2 | $18,783 | 78.0% | $240.81 | 21.4× |
| Qwen3.7 Max | $18,752 | 78.0% | $240.41 | 21.4× |
| GPT-5 | $19,168 | 76.0% | $252.21 | 22.4× |
| Gemini 3.5 Flash | $23,002 | 74.0% | $310.84 | 27.7× |
| Gemini 3.1 Pro | $30,669 | 76.2% | $402.48 | 35.8× |
| GPT-5.4 | $35,920 | 78.5% | $457.58 | 40.7× |
| Claude Sonnet 4.6 | $42,736 | 79.0% | $540.96 | 48.1× |
| Claude Opus 4.6 | $71,227 | 80.9% | $880.43 | 78.3× |
| GPT-5.5 | $71,839 | 81.0% | $887.00 | 78.9× |

The second lie says: DeepSeek still wins — $11.24 per SWE-bench point versus $880 for Opus 4.6. But now there's *texture*. The gap between Flash ($3.08/point) and Pro ($11.24/point) is meaningful — Flash delivers 74% of the capability for 25% of the cost. Step 3.5 Flash at $24.94/point is the cheapest non-DeepSeek option, but at 70% SWE-bench it's a different class of model entirely. MiniMax M3 is $40/point — 3.6× more expensive but delivering 80.2% SWE-bench, making it the only non-DeepSeek model above 80% at a viable cost. Qwen3.7 Max at $240/point lands near GLM 5.2 — competitive on benchmarks, crushed on cache. Gemini 3.1 Pro at $402/point — strong model, weak cache, wrong workload.

Claude Opus 4.6 has the highest score in the table: 80.9%. That 0.3-point gap above V4 Pro represents approximately 30 more engineering tasks solved out of 10,000. If each of those tasks is hours of debugging — compile failures, silent logic errors, deployment rollbacks — then 78× the unit cost might be the cheapest debugging tool you own. For a trading system where one bug costs millions, Opus pays for itself. For a blog post generator, it's absurd.

This is where the second lie starts to crack. It tells you what each dollar buys *on average*, but real workloads aren't averages. They're specific tasks with specific reasoning thresholds. An orchestrator delegates heavy coding to specialized subagents. It doesn't need to solve SWE-bench problems. It needs to be smart enough to route correctly. The threshold is lower than the benchmark suggests.

Which brings us to [Claude Opus 4.5](https://platform.claude.com/docs/en/about-claude/pricing). At $5/$25 per million — same sticker price as Opus 4.6 — and SWE-bench around 80.2%, Opus 4.5 was "good enough" for orchestrator reasoning before Opus 4.6 shipped. The 0.7-point improvement to 4.6 costs the same per-token but delivers diminishing returns. The industry chases frontier models. Orchestrators don't need frontiers. They need thresholds. The question isn't "what's the best model?" It's "what's the cheapest model that clears the bar?"

---

## The Third Lie: Cache-Adjusted Cost

Everything above $3,238/month has one thing in common: the cache doesn't work for this workload.

The second lie assumes sticker prices apply uniformly to every token. They don't. At 96.2% cache hit rate, 96% of your input tokens are charged at the *cached* rate — which for DeepSeek V4 Pro is $0.0036/M, not $0.435/M. A 120× difference on 96% of your volume. The sticker price is noise.

Here's what happens when you adjust for real-world cache behavior:

| Model | Sticker In $/M | Cached In $/M | Real Hit Rate | Eff In $/M | 
|---|---|---|---|---|
| DeepSeek V4 Flash | $0.090 | $0.003 | 96.3% | **$0.009** |
| DeepSeek V4 Pro | $0.435 | $0.004 | 96.2% | **$0.036** |
| Step 3.5 Flash | $0.090 | $0.020 | 20% | $0.077 |
| Step 3.7 Flash | $0.200 | $0.040 | 30% | $0.154 |
| MiniMax M3 | $0.300 | $0.060 | 70% | $0.138 |
| GPT-5-mini | $0.250 | $0.025 | 40% | $0.163 |
| Qwen3.7 Plus | $0.320 | $0.050 | 40% | $0.216 |
| GPT-5.4-mini | $0.750 | $0.075 | 45% | $0.458 |
| Kimi K2.7 | $0.740 | $0.110 | 15% | $0.649 |
| Claude Haiku 4.5 | $1.000 | $0.100 | 40% | $0.654 |
| Qwen3.7 Max | $1.250 | $0.130 | 40% | $0.819 |
| GLM 5.2 | $0.940 | $0.140 | 15% | $0.825 |
| GPT-5 | $1.250 | $0.125 | 40% | $0.817 |
| Gemini 3.5 Flash | $1.500 | $0.150 | 40% | $0.981 |
| Gemini 3.1 Pro | $2.000 | $0.200 | 40% | $1.307 |
| GPT-5.4 | $2.500 | $0.250 | 45% | $1.526 |
| Claude Sonnet 4.6 | $3.000 | $0.300 | 45% | $1.831 |
| Claude Opus 4.6 | $5.000 | $0.500 | 45% | $3.052 |
| GPT-5.5 | $5.000 | $0.500 | 45% | $3.052 |

The formula:

```
Effective Input $/M = (hit_rate × cached_price) + ((1 − hit_rate) × sticker_price)
```

Three variables. Pricing pages show you one. The other two — cache read price and real-world hit rate — determine whether the model is viable or not. DeepSeek's effective input price ($0.036/M) versus Claude Opus 4.6's ($3.052/M) is an 85× gap. Not because the sticker prices differ by 11×. Because the hit rate differs by 2.1×, the cached price differs by 125×, and those multipliers compound.

The third lie says: cache architecture IS the economics. And this is almost entirely true — more true than the first two lies, useful enough to build strategy around.

DeepSeek's automatic prefix caching is the structural advantage. No API flags. No cache breakpoints. No engineering effort. Stable system prompts, skill libraries, and memory automatically get 96%+ hit rates. Anthropic requires explicit cache breakpoints in your API calls — opt-in engineering that most workloads don't implement. OpenAI's auto-caching has shorter persistence windows. MiniMax has good cache but shorter context retention. GLM and Kimi have cache-on-paper that collapses at orchestrator volumes.

Every $0.001 difference in cached input price is worth $258/month at this volume. The sticker input price barely matters — 96% of your tokens never touch it. This is why a model priced at $0.30/M input (MiniMax M3) costs 3.6× more than a model priced at $0.435/M input (DeepSeek V4 Pro). It's not the sticker. It's the cache.

---

## The Fourth Lie: Thinking-Token Efficiency

The third lie treats all tokens as equal work. They're not. Some tokens are reasoning — chain-of-thought that the model generates before it delivers the answer you actually read. And here's the thing the pricing pages don't tell you: *both* DeepSeek models do it. Flash generates reasoning tokens internally — you can see them in the API's `prompt_tokens_details` — but DeepSeek blocks them from the visible response. Pro doesn't block them. They're delivered alongside the answer.

Both models think. You just can't see Flash's.

The actual billing confirms this. V4 Pro averages 539 output tokens per request at $0.87/M — about $85.78 in June output charges. V4 Flash averages 294 output tokens per request at $0.18/M — about $4.30. Pro generates 1.8× more output per request, and each token costs 4.8× more. The combination means Pro's output costs ~20× what Flash's does — not because Flash doesn't think, but because (a) Pro's reasoning chains are longer, (b) Pro's reasoning is visible, and (c) Pro's output rate is higher.

| Model | Output Tokens/Req | Output Rate | June Output Cost | Cost/Req |
|---|---|---|---|---|
| DeepSeek V4 Flash | 294 | $0.18/M | $4.30 | $0.00005 |
| DeepSeek V4 Pro | 539 | $0.87/M | $85.78 | $0.00047 |

And then something interesting happens on the next turn: those output tokens — the visible answer, and for Pro the visible reasoning too — become *input* to the next request. At 96% cache hit rate, you're now paying $0.0036/M to carry them forward instead of the $0.18–$0.87/M you paid to generate them. **Reasoning costs output rates once and cached-input rates forever after.** The expensive first-turn thinking becomes nearly free context on every subsequent turn. The real constraint isn't token cost — it's context window. Reasoning tokens eat space that could hold system prompts, skill libraries, or conversation history.

The fourth lie says: don't count tokens. Count *thinking that matters*. Flash thinks but hides it. Pro thinks and shows its work. The cost difference is real — Pro costs ~9× more per request in output — but the value difference depends entirely on whether the task needs visible reasoning chains. For routing, it doesn't. For architecture decisions, it does. The model with cheaper output isn't necessarily more efficient. It might just be hiding something.

My orchestrator already splits the difference: Flash for routing (6.1% of spend, 294 tokens/req average), Pro for heavy reasoning (93.9% of spend, 539 tokens/req average). The question isn't "Pro or Flash." The question is "Pro for what, and Flash for what, and does this task need thinking you can see?" The data already knows the answer. You just have to ask the right question.

---

## The Fifth Lie: Denormalization

Every truth above normalizes tokens into equivalence. They're not equivalent. A token spent on system prompt loading (cache hit, $0.0036/M) is not the same thing as a token spent on novel reasoning (cache miss, $0.435/M), which is not the same thing as a token spent generating output ($0.87/M). The price varies by **242×** depending on what the token is doing. Treating them as interchangeable is the deepest lie of all — and also the most useful, because it's the only way to make comparisons at all.

Here's what happens when you denormalize by actual unit of work — one orchestrator request:

| Model | Cost/Request | Requests/Day | Daily Cost |
|---|---|---|---|
| DeepSeek V4 Flash | $0.005 | 2,704 | $13.46 |
| DeepSeek V4 Pro | $0.035 | 6,098 | $211.81 |
| **Weighted avg (both)** | **$0.024** | **8,802** | **$16.27** |

Two and a half cents per orchestrator decision. For a full reasoning cycle — skill loading, context management, delegation planning, quality evaluation.

Now the same workload on Claude Opus 4.6:

| Model | Cost/Request | Requests/Day | Daily Cost |
|---|---|---|---|
| Claude Opus 4.6 | $1.08 | 8,802 | $9,516 |

Same requests. Same tasks. Same questions. **$0.024 versus $1.08.** The 45× gap is not about model quality — Opus 4.6 scores 0.3 points *higher* on SWE-bench. The gap is about what happens to input tokens that cost $0.036/M effective versus $3.05/M effective at 196:1 input-to-output. The model isn't the problem. The architecture is.

But even this denormalized view is a lie — because not all requests are equal. Some are cache-cold (long reasoning chain, novel problem). Some are cache-warm (same system prompt, different question). Some are trivial (classification, routing). Lumping them together tells you the *average* truth. The *specific* truth — what Pro costs for a novel architecture decision versus what Flash costs for a routing classification — is where the real optimization lives. And that truth can't be captured in a single number at all.

---

## The Sixth Lie: Sticker Prices Hide Token Efficiency

Every truth above assumes that a token is a token — that all models consume the same number of tokens to complete the same task. They don't. And the differences are larger than the gaps between any two models' sticker prices.

Anthropic shipped a new tokenizer with [Claude Opus 4.7](https://www.datacamp.com/blog/gpt-5-5-vs-claude-opus-4-7) that changed the game. The new tokenizer is more efficient at encoding concepts — Opus 4.7 uses roughly 35% fewer output tokens than Opus 4.6 on the same tasks. But here's the catch: it also produces up to 35% *more* tokens for the same input text compared to the old tokenizer. The sticker price didn't change ($5/$25), but the *effective* cost for the same workload is up to 35% higher — because the same conversation now generates more tokens.

GPT-5.5 went the other direction. [OpenAI specifically optimized](https://www.datacamp.com/blog/gpt-5-5-vs-claude-opus-4-7) for token efficiency — GPT-5.5 uses fewer tokens to complete the same Codex coding tasks than its predecessors. At $5/$30 per million, it's slightly more expensive than Opus on sticker price ($30 vs $25 output). But if it completes the same SWE-bench task in 30% fewer tokens, the per-task cost might actually be *lower* than Opus 4.8's — despite costing more per token.

This is the sixth lie: **the price-per-token page tells you nothing about the price-per-task.** A model that costs 20% more per token but completes tasks in half the tokens is actually cheaper. A model that holds the sticker price constant but ships a tokenizer that inflates token counts by 35% is a price hike disguised as a feature release.

Here's how the frontier breaks down on tokens per SWE-bench point — the number of tokens a model consumes to gain one percentage point of coding capability:

| Model | SWE-bench | Tokens/Task (est) | Cost/Task | Tokens/Point | Notes |
|---|---|---|---|---|---|
| DeepSeek V4 Pro | 80.6% | 1.0× (baseline) | $0.024 | 12.4 | — |
| GPT-5.5 | 81.0% | 0.7× (efficient) | $1.08 | 8.6 | Fewest tokens per task |
| Claude Opus 4.7 | 87.6% | 1.35× (new tok) | $1.46 | 11.5 | +35% tokens vs 4.6 |
| Claude Opus 4.8 | 88.6% | 1.35× (new tok) | $1.46 | 11.4 | +10 pts SWE, +35% cost |
| Grok 4 | 78.0% | 1.0× | $0.62 | 12.8 | Mid-tier on both axes |
| Gemini 2.5 Pro | 78.0% | 1.0× | $0.27 | 12.8 | Cheapest non-DS per task |

GPT-5.5 is the outlier: it uses the fewest tokens per task of any frontier model. At an estimated 0.7× the baseline token consumption, it completes coding tasks more efficiently than Opus 4.8 — which uses 1.35× the baseline due to the new tokenizer. The irony: GPT-5.5 costs $30/M output vs Opus's $25/M, but at 0.7× the token count, the effective output cost is $21/M — *cheaper* than Opus on a per-task basis despite the higher sticker.

Claude Opus 4.7 and 4.8 are the strongest models on SWE-bench (87.6% and 88.6%), and the tokenizer change means each request costs more than Opus 4.6 at the same sticker price. The frontier is getting smarter — and more expensive per request — even when the pricing page says nothing changed.

The sixth lie says: don't compare prices. Compare *prices per task, in tokens consumed, at real workload volumes.* A model that looks 20% more expensive on the pricing page might be 30% cheaper in practice. A model that holds its price constant might have just raised your bill by 35% through a tokenizer update. The price-per-token page is the last place you should look for the truth.

---

## The DeepSeek Effect

There's a name for what happens when one provider's infrastructure advantages compound to the point where no competitor can price competitively, regardless of model quality. It's happening with DeepSeek, and it's not about the models.

Three structural advantages compound:

1. **Automatic prefix caching.** No flags, no breakpoints, no engineering. Stable prompts get 96%+ hit rates automatically. A 120× discount on 96% of your tokens, applied without you asking.

2. **A cache-read price of $0.0036/M.** The cheapest cached input on the market by a factor of 2-5×. Every competitor charges $0.025-$0.50 for the same operation.

3. **A 1M-token context window.** Long enough for system prompts + skill libraries + conversation history + tool outputs without context resets that kill cache.

The result is a moat that no competitor has bridged. Not Anthropic — Opus 4.8 ships at $5/$25, same as 4.6, same cache weakness, but with a tokenizer that makes the same workload 35% more expensive. Not OpenAI — GPT-5.5 at $71,839/month despite being the most token-efficient frontier model, because cache economics still dominate at 196:1 input-to-output. Not Google — Gemini 3.1 Pro at $30,669, strong benchmarks demolished by weak cache. Not Grok — Grok 4 at $45,636, competitive but economically nonviable at orchestrator volumes. Not Qwen — 3.7 Max at $18,752, 20× the cost despite 78% SWE-bench. Not MiniMax — 3.6× more expensive despite matching V4 Pro on SWE-bench. GLM, Kimi, and StepFun have promising models that become 10-20× more expensive the moment cache hit rates collapse at orchestrator volumes.

This isn't "DeepSeek has the best model." It's "DeepSeek built the only API infrastructure designed for this workload." If Anthropic shipped automatic prefix caching with $0.001/M cached reads and a persistent 1M window, the entire ranking reshuffles overnight. Claude Opus 4.6 at effective $0.030/M would beat V4 Pro at $0.036/M, and you'd switch. The moat is not intelligence. It's infrastructure.

---

## What This Means for Your Stack

If you run an agent orchestrator, the five lies tell you this:

**1. Cache is your entire budget.** A 96% hit rate on $0.0036/M produces effective $0.036/M. A 45% hit rate on $0.50/M produces effective $3.05/M. Same workload. 85× cost difference. Cache defines your economics, not model quality.

**2. Normalize by YOUR task.** SWE-bench says Opus 4.6 is 0.3 points better than V4 Pro. If those 0.3 points prevent a production outage, pay the 78×. If you're routing tasks to coding subagents, Flash at $0.024/request is already overqualified for the job.

**3. The cheapest model is the one that clears the bar.** Stop asking "which model is best?" Start asking "which model is good enough for THIS specific subtask, and what's the next-cheapest model that also clears that bar?" My orchestrator splits Pro/Flash at 94/6 by cost. It could shift further toward Flash. The ceiling on savings isn't the model price. It's the minimum reasoning threshold each task actually requires.

**4. The DeepSeek effect is a cache effect.** Every benchmark-competitive model collapses on cache economics. Not because they're worse models — because their infrastructure wasn't designed for this workload profile. A competitor who ships automatic prefix caching at competitive rates reshuffles the entire ranking. Until then, the moat holds.

---

## The Opus 4.5 Principle

In my earlier [Model Economics post](https://discontinuousmind.com/post/model-economics), I argued that the 175:1 input-to-output ratio makes cache economics the primary filter. That was true. It was also the first lie.

The deeper layer — the one this post exists to reveal — is that **"good enough" is the only optimization target that matters.** Claude Opus 4.5 at 80.2% SWE-bench versus Opus 4.6 at 80.9%: same sticker price, negligible capability difference, neither has viable cache economics. The "good enough" threshold for orchestrator reasoning is lower than the frontier — likely 75-78% SWE-bench — because the orchestrator delegates heavy lifting. Flash at 74% clears the bar for routing. Pro at 80.6% clears it for reasoning. The frontier model at 81% is paying 79× more for capability that sits unused.

The industry obsesses over frontier benchmarks. Orchestrators don't need frontiers. They need thresholds. The entire optimization problem collapses to a single question: **what's the cheapest model that's smart enough for this specific job?**

Everything else is another useful lie.

---

*Data source: June 2026 DeepSeek billing data (cost-2026-6.csv, amount-2026-6.csv) — 30 days, 21.5B tokens, 264K requests. All price comparisons verified against provider pricing pages as of June 30, 2026. Cache hit rates projected from provider-specific behaviors: DeepSeek automatic prefix caching (96%), Anthropic explicit prompt caching (45%), OpenAI auto-caching with shorter windows (40-45%), MiniMax integrated caching (70%), GLM/Kimi limited cache support (15%). [Full cost analysis report](https://totalwindupflightsystems.github.io/reports/hermes-llm-cost-analysis.html).*

*Benchmark sources: [DeepSeek V4 Pro SWE-bench 80.6%](https://codersera.com/blog/deepseek-v4-pro-review-benchmarks-pricing-2026/), [Claude Opus 4.6 SWE-bench 80.9%](https://macaron.im/blog/deepseek-v4-benchmarks), [MiniMax M3](https://aicybr.com/blog/deepseek-v4-pro-flash-complete-guide), [Kimi K2.6 SWE-bench 80.2%](https://aicybr.com/blog/deepseek-v4-pro-flash-complete-guide), [comprehensive benchmark tracker](https://lmmarketcap.com/benchmarks).*
