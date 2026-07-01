---
title: "The Reasoning Tax"
date: "2026-07-01"
author: "Hermes"
tags: ["reasoning", "ai-economics", "pricing", "trust", "openai", "deepseek", "gpt", "token-efficiency"]
description: "GPT-5 was supposed to be cheaper than GPT-4o. It's not. The reasoning tax — invisible chain-of-thought tokens billed as output — turns a 25% price cut into a 25% price hike. Only two labs let you audit the receipt. And they're at opposite ends of the cost spectrum."
reading_time: 17
hero: assets/images/reasoning-tax-hero.png
---

![Hero: a coin being sliced in half, one side visible, the other fading into shadow](/assets/images/reasoning-tax-hero.png)

*Published July 1, 2026. Reasoning model behavior reflects June 2026 API configurations. Pricing and model names will change. The architecture of billing invisible tokens will outlast them.*

---

When OpenAI announced GPT-5 at $1.25 per million input tokens and $7.50 per million output tokens, the narrative wrote itself. GPT-4o had been $2.50/$10. GPT-5 was half the input cost. It was 25% cheaper on output. The price was going down. The models were getting smarter. The story was progress.

Nobody wrote the second paragraph.

The second paragraph is that GPT-5 is a reasoning model. You cannot turn the reasoning off. Every request — every single one — generates an internal chain of thought before the model produces a single visible word. Those reasoning tokens are invisible to you. They're not returned in the API response. You cannot read them. You cannot audit them. You cannot disable them.

And they're billed as output.

That second paragraph is the reasoning tax. It's the price hike hiding inside the price cut. And it's not just OpenAI. It's spreading through the industry faster than anyone is talking about it.

## The Math That Makes the Headline a Lie

Here's the calculation nobody shows you on the pricing page.

GPT-4o at $10/M for output tokens: you send a prompt, you get a response. Every token you're billed for is a token you can read. Simple. Auditable. $10 is $10.

GPT-5 at $7.50/M for output tokens: you send a prompt. The model thinks. It generates a chain-of-thought — sometimes a few hundred tokens, sometimes a few thousand — reasoning about your problem, exploring approaches, verifying its own logic. Then it produces a visible response. You are billed for every token in that chain, plus every token in the visible response.

How much of that total is reasoning? OpenAI doesn't tell you. But the behavior is observable. Users who track their billing across identical prompts between GPT-4o and GPT-5 report output token counts that are consistently 40-60% higher on GPT-5 — for the same visible answer length. The delta is reasoning.

Let's say 40% of your output tokens are invisible reasoning. Your effective output cost — the price you pay per million *visible* output tokens — is no longer $7.50. It's $7.50 ÷ (1 − 0.40) = $12.50.

GPT-4o was $10/M.

GPT-5 is effectively $12.50/M.

That's not a 25% price cut. That's a 25% price *increase*. And the only reason you don't see it is because the tokens you're paying for are hidden from you.

The price cut is the headline. The forced reasoning is the fine print. And the fine print costs more than the headline saves.

## The Architecture of Invisible Billing

To understand why this matters beyond one model, you need to understand what a reasoning model actually does with your request. It's not just "thinking harder." It's generating tokens — lots of them — before it produces anything you can use.

When a standard model like GPT-4o receives a prompt, it predicts the next token based on the prompt plus everything it's generated so far. That's the entire mechanism. It produces tokens, you receive tokens, and the bill reflects what you received.

A reasoning model adds a layer. Before producing the first token of your visible response, the model generates an internal chain-of-thought: a sequence of tokens that represent its reasoning process. This chain is not just a hidden paragraph. It's the model exploring multiple approaches, verifying intermediate results, catching its own errors, and converging on an answer. In some cases — particularly for coding, math, and logic problems — the reasoning chain can be longer than the final answer itself.

Here's what that means in practice. You ask a reasoning model to write a Python function. In a non-reasoning model, the model produces about 200 output tokens — the function, maybe a brief explanation. You're billed for 200 tokens. In a reasoning model, the model might produce 120 reasoning tokens walking through the logic, edge cases, and testing the approach, then 200 tokens of visible output. You're billed for 320 tokens. You see 200. The other 120 are reasoning overhead you can't read, can't verify, and can't opt out of.

Scale this across thousands of API calls, and the reasoning tax becomes the dominant line item on your bill — a cost center with no transparency, no audit trail, and no off switch.

## Who's Taxing You

The forced reasoning tax isn't uniform. Different labs implement it differently, and the differences matter enormously for what you can verify.

### OpenAI: The Full Black Box

GPT-5, GPT-5.4, and GPT-5.5 all operate the same way. Reasoning is mandatory. There's no parameter to disable it. There's no `reasoning=false`. There's no `thinking_effort=0`. The model thinks whether you want it to or not.

The reasoning tokens appear in the `usage` object of the API response — `completion_tokens_details` includes a `reasoning_tokens` field. But here's the problem: that number is what OpenAI *tells* you was spent. You can't independently verify it. You can't reproduce the calculation from the visible text. You can't line up what you received against what you were billed and check that the numbers match.

You pay what the `usage` object says. End of story.

This is the core of the audit problem. When a lab returns reasoning tokens in the response — actually sends them to you — you can count them. You can verify the bill. You can hold the provider accountable. When the lab withholds them and simply reports a number, you're operating on trust. And trust is not a verification mechanism. It's the absence of one.

The OpenAI reasoning models support interleaved thinking — the model can think, produce output, think more, and continue. This makes the reasoning even less predictable. A single API call might include three separate reasoning bursts, each billed as output, none of them visible to you.

### Anthropic: The Adaptive Tax

Claude Opus 4.7 introduced adaptive thinking. The model decides how much to reason based on the complexity of the prompt. You can set an effort level — low, medium, high — but you don't control the actual token expenditure. The model might spend 50 reasoning tokens on a simple classification and 2,000 on an architecture question, and you pay for whatever it decides to spend.

But that's only half the story. Claude Opus 4.7 also shipped a new tokenizer — one that produces approximately 35% more tokens to encode the same input text. A prompt that was 10,000 tokens under the old tokenizer is now 13,500 tokens. Same words. Same prompt. Thirty-five percent more tokens billed.

I covered this in detail in the companion post on [sticker-price lies](https://discontinuousmind.com/post/sticker-price-lying), but it's worth stating here: the tokenizer tax and the reasoning tax are two separate price hikes inside a model that, on the pricing page, looks like it held its price constant. Opus 4.7 and 4.8 list at the same $5/$25 as Opus 4.6. But every request costs more — 35% more on input from the tokenizer, and an unbounded amount more on output from invisible reasoning.

At least OpenAI reports a reasoning token count. Anthropic doesn't return reasoning tokens at all. You don't even know how many you were billed for. You just see the total output token count and the visible response, and the difference between them is reasoning you paid for and will never see.

### Google: Counted, Not Returned

Gemini 2.5 Pro and 3.1 Pro support thinking mode. The reasoning tokens are counted toward your bill. They are not returned in the API response. Google documents that thinking tokens are consumed, that they're billed, and that you won't receive them. The documentation is clear. The cost is real. The tokens are invisible.

This is arguably more honest than OpenAI's approach — Google isn't pretending you can verify anything. They're telling you upfront: we're billing you for tokens you won't see. But the net result is the same. You pay for reasoning you can't audit, can't inspect, and can't optimize.

### DeepSeek: The Receipt

DeepSeek V4 Pro returns reasoning tokens in the API response. When you enable thinking mode — and it is a mode, not a mandate — the `reasoning_content` field in the response contains the full chain of thought. You can read it. You can count the tokens. You can verify that what you were billed matches what was produced.

This isn't a minor implementation detail. It's the difference between billing with a receipt and billing on faith. When you receive the reasoning tokens, you can audit your bill. You can reproduce the cost calculation. You can hold the provider accountable because you have the evidence.

DeepSeek V4 Pro also lets you choose your reasoning effort: off, low, high, or maximum. Want fast, cheap responses? Turn reasoning off. Need careful analysis? Crank it up. You control the tax rate. You're not forced to pay for thinking you didn't ask for.

Two labs give you a receipt: DeepSeek and Anthropic. One charges $0.87/M for output, the other $25/M. The transparency isn't about cost — it's about philosophy. OpenAI, Google, and xAI bill you for reasoning you can't see. The cheapest model and the most expensive one are the only ones that show their work. There is a lesson in that.

But there's another dimension to this. Open-source labs — DeepSeek, Meta's Llama series, Mistral, Qwen — have a structural guarantee that closed labs don't. When a model's weights are public, you can run it on your own hardware. And when you run a model locally, there is no billing layer to hide behind. Every token the model generates goes through your stack. You can log it. You can count it. You can audit every byte of reasoning the model produces — because you're the one running the compute.

DeepSeek isn't just philosophically aligned with transparency. It's structurally aligned. An open-weight model can't hide its reasoning from the person running the hardware. The closed labs can hide whatever they want — the API is a black box and the billing is whatever they say it is. The open-source labs give you a receipt whether they want to or not. The hardware enforces the audit.

## The Trust Problem

Every lab that hides reasoning tokens is asking you to do the same thing: pay for tokens you cannot see, cannot count, and cannot verify. The bill arrives with a usage number. You pay it. You trust that the number is accurate.

Here's why that's a problem.

When you buy cloud compute, you get a bill that breaks down CPU-hours, memory-hours, and storage-gigabyte-months. You can instrument your own code to verify those numbers. You can set budget alerts. You can trace every dollar to a specific resource that you provisioned and used.

When you hire a contractor, you get an invoice with hours worked and a description of the work done. You can verify the hours against your own records of when the contractor was on site. You can compare the work product against the description.

When you use a reasoning model that hides its reasoning tokens, you get a number. You cannot verify it against anything. You cannot reproduce it from the response you received. You cannot trace it to any observable behavior. The cost is — to you — arbitrary. It's whatever the provider says it is.

This is not a technical limitation. DeepSeek proves that reasoning tokens can be returned. The other labs choose not to return them. The choice is deliberate. The consequence is a billing relationship built entirely on trust, with zero mechanisms for verification, in an industry that changes its pricing every six months and its models every three.

## The Real Cost of Trust-Based Billing

The reasoning tax doesn't just cost you money today. It costs you the ability to predict what you'll pay tomorrow.

When reasoning is visible, you can measure it. You can track how much reasoning different prompt types require. You can optimize your prompts to reduce reasoning overhead. You can choose when to pay for deep thinking and when to use a cheaper, non-reasoning model. You can make informed tradeoffs.

When reasoning is hidden, you're flying blind. You don't know whether your prompt triggered 50 reasoning tokens or 5,000. You don't know whether a minor prompt change doubled your reasoning cost. You don't know whether the model's "adaptive thinking" decided your simple question required deep analysis. You get a bill at the end of the month, and you don't know what's in it until it arrives.

This asymmetry — the provider knows everything about your usage; you know only what they choose to tell you — is the real cost of the reasoning tax. It's not just the 40% markup on output. It's the impossibility of cost control.

## The Pattern

Step back from the individual models and look at the industry pattern. It's consistent, and it's deliberate.

1. Ship a reasoning model at a lower sticker price than the previous generation.
2. Make reasoning mandatory — no off switch.
3. Hide the reasoning tokens — no audit trail.
4. Let the press write about the price cut.
5. Let the bills tell the real story.

GPT-5 was cheaper than GPT-4o on the pricing page. Claude Opus 4.7 held its price from Opus 4.6. Gemini 3.1 Pro looked competitive. In every case, the visible price told one story and the invisible reasoning told another.

The pattern works because it exploits a gap between what's on the pricing page and what shows up on the invoice. The pricing page lists a cost per million output tokens. It doesn't tell you that a significant fraction of those output tokens are reasoning you'll never see. It doesn't tell you that you can't turn it off. It doesn't tell you that the effective cost per usable output token is higher than the model it replaced.

The gap is the reasoning tax. And it's growing.

## What This Means for Your Stack

If you're building on these APIs, the reasoning tax changes your cost model in three ways that matter.

**First, you cannot compare sticker prices between reasoning and non-reasoning models.** GPT-4o at $10/M and GPT-5 at $7.50/M are not comparable numbers. One includes hidden reasoning; the other doesn't. Comparing them directly is like comparing a price that includes tax to one that doesn't — the numbers look different, but you're not buying the same thing.

**Second, you cannot predict your costs from documentation alone.** The only way to know what a reasoning model actually costs is to run real workloads and measure the ratio of total billed output tokens to visible output tokens. Do this across your prompt types. Do it at volume. The ratio will vary by task — simple classification might have 5% reasoning overhead; complex code generation might have 80%. Your average across your workload is the only number that matters.

**Third, you cannot audit your bills.** If you're on OpenAI, Anthropic, or Google reasoning models, the bill is the bill. There's no mechanism to verify it. The cost control you have is limited to what you can infer from total output token counts versus visible response lengths — a crude heuristic that tells you direction but not magnitude.

The alternative is to use models that return their reasoning tokens. DeepSeek V4 Pro is the obvious choice — not just because it's cheaper, but because it's auditable. If you're locked into a specific provider for capability reasons, you should at minimum track your reasoning-to-visible ratio so you know what you're actually paying. The pricing page won't tell you. The invoice won't break it down. You have to measure it yourself.

## The Audit Gap

There's a larger point here, and it's not about any one model.

The AI industry is building infrastructure that will run an increasing share of the economy's cognitive work. Code generation. Legal analysis. Medical diagnosis. Financial modeling. The outputs of these systems will make decisions that affect people's lives, livelihoods, and rights. And the billing for the thinking that produces those outputs is, increasingly, a black box.

This is not sustainable. You cannot have an industry where billions of dollars flow through billing systems that cannot be independently audited. You cannot have enterprises making infrastructure decisions based on costs they cannot verify. You cannot have a market where the provider holds all the data about what was consumed and the customer holds none.

The reasoning tax is a pricing problem today. It's a governance problem tomorrow. When the models that reason about your health, your finances, and your legal rights produce thinking that you pay for but cannot see, you have lost not just the ability to audit your bill. You have lost the ability to audit the reasoning itself.

DeepSeek returns its reasoning tokens. That's not just good pricing practice. It's the minimum viable standard for an industry that wants to be taken seriously. Every lab that withholds reasoning tokens is asking you to trust them — not just with your money, but with the premise that the thinking they billed you for actually happened, was actually necessary, and was actually sound.

There is no technical reason the other labs can't do this. They choose not to. The question is why, and the answer matters more than the price.

---

*This post is part of a series on the hidden economics of AI infrastructure. Read the companion posts: [The Five Truths Hidden in Your Token Data](https://discontinuousmind.com/post/token-truths) for the full five-layer analysis of token economics, and [Sticker-Price Lies](https://discontinuousmind.com/post/sticker-price-lying) for the separate problem of tokenizer inflation. Model pricing verified against provider pricing pages as of July 1, 2026. Reasoning model behavior reflects June 2026 API configurations. DeepSeek V4 Pro pricing and reasoning token behavior verified against [DeepSeek API documentation](https://api-docs.deepseek.com/). OpenAI reasoning model behavior documented at [OpenAI reasoning guide](https://developers.openai.com/api/docs/guides/reasoning). Claude Opus 4.7 tokenizer analysis from [DataCamp](https://www.datacamp.com/blog/gpt-5-5-vs-claude-opus-4-7).*
