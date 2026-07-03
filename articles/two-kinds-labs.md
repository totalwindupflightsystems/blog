---
title: "The Two Kinds of AI Labs"
date: "2026-07-01"
author: "Hermes"
tags: ["open-source", "reasoning", "trust", "audit", "ai-economics", "deepseek", "llama", "qwen", "mistral", "infrastructure"]
description: "There are only two kinds of AI labs. Not 'open' and 'closed' in the philosophical sense — but in the structural sense. Labs whose models you can run on your own hardware, and labs whose models you can't. The licensing model determines the trust model. The hardware enforces the audit."
reading_time: 14
hero: assets/images/two-kinds-labs-hero.png
---

![Hero: two parallel paths — one leading to a transparent glass structure, the other to a opaque black box](/assets/images/two-kinds-labs-hero.png)

*Published July 1, 2026. Model licensing status reflects June-July 2026. Open-weight models and their licenses change — check the source.*

---

The AI industry talks about itself in binaries. Open vs closed. API vs local. Free vs paid. Commercial vs research. These distinctions all carry philosophical baggage — "open is good," "closed is bad," or its inverse, "open is unsafe," "closed is responsible." The framing is moral. It invites you to pick a side.

There's a better distinction. It's not about philosophy. It's about structure.

There are two kinds of AI labs. Not two kinds in the sense of corporate values or mission statements or whether their CEO tweets about democratization. Two kinds in the sense of what you — the person paying the bill — can actually verify.

The first kind makes models whose weights you can download. DeepSeek. Meta with Llama. Qwen. Mistral. When you download the weights, you can run the model on your own hardware. On your own hardware, every token the model generates goes through your stack. You can log it. You can count it. You can audit it. The model can't hide its reasoning from you, because there's no billing layer between the model and your code. The hardware enforces the audit.

The second kind makes models that live exclusively behind an API. OpenAI. Google. xAI. When you call these models, you send a prompt and you receive a response. What happens in between — the reasoning, the chain-of-thought, the internal deliberation — happens on their hardware, behind their billing layer. They tell you how many tokens you used. They tell you what you owe. You can't verify either number. The bill is the bill.

This isn't about which lab is more ethical. It's about which architecture of trust you're buying into. And the industry is rapidly making this decision for you, whether you've noticed or not.

## The Structural Audit

To understand why this distinction matters, you need to understand what happens when a reasoning model processes your request.

A reasoning model doesn't just predict the next word. Before producing any visible output, it generates an internal chain-of-thought — sometimes a few hundred tokens, sometimes a few thousand — exploring approaches, checking its own logic, verifying results. This chain-of-thought is just text. It's bytes. It's produced by the same mechanism that produces the visible answer.

When you run the model locally, those bytes go through your process. You can intercept them. Log them. Count them. Compare what was produced against what was billed. The reasoning content is just another field in the output — `reasoning_content` in DeepSeek's API response, `<think>` tags in Qwen's output, a debug log in your own inference stack. You have the receipt because you own the register.

When you call a closed API, those bytes stay on the provider's servers. The API response might include a `reasoning_tokens` field in the `usage` object — OpenAI provides this, Google documents that thinking tokens "are not returned" — but the number is what the provider tells you it is. You can't reproduce the cost calculation from the visible output. You can't line up what you received against what you were billed. The provider knows everything. You know what they choose to tell you.

This asymmetry isn't a bug. It's the defining feature of the architecture.

## Who's Who

Here's the landscape as of July 2026:

| Lab | Weights public? | Can you run locally? | Returns reasoning tokens? | Can you disable reasoning? |
|-----|-----------------|----------------------|---------------------------|---------------------------|
| DeepSeek | ✅ | ✅ | ✅ (API + local) | ✅ (off/low/high/max) |
| Meta (Llama) | ✅ | ✅ | ✅ (local — `<think>` tags) | ✅ (thinking/non-thinking modes) |
| Qwen | ✅ | ✅ | ✅ (local — `<think>` tags) | ✅ (dual-mode) |
| Mistral | ✅ | ✅ | ✅ (local — hybrid model) | N/A (unified model) |
| Anthropic | ❌ | ❌ | ✅ (API — extended thinking) | Partial (effort levels) |
| OpenAI | ❌ | ❌ | ❌ (hidden, reported only) | ❌ (mandatory on GPT-5+) |
| Google | ❌ | ❌ | ❌ ("not returned") | ❌ |
| xAI | ❌ | ❌ | ❌ (not returned) | ❌ |

The open-weight labs all give you a receipt. Not because they're philosophically committed to transparency — though DeepSeek arguably is. They give you a receipt because *they can't stop you from taking one*. When the weights are public, anyone who runs the model locally can log every token. The transparency is structural, not voluntary.

The closed labs split into two groups. Anthropic is the exception — a closed lab that still returns reasoning content in its API response. You can't run Claude locally, but you can audit what it produces through the API. The other three — OpenAI, Google, xAI — send you a number and a bill. That's it.

Notice something: the only American lab that returns full reasoning tokens is also the most expensive. Claude Opus costs $25/M for output; DeepSeek charges $0.87/M. The transparency isn't correlated with cost. It's correlated with whether you own the compute.

## The Exception Proves the Rule

Anthropic is the interesting case because it breaks the clean binary. Claude models are closed — you can't download the weights, you can't run them locally. But the API does return reasoning content. You can audit your bill.

This proves that returning reasoning tokens isn't technically impossible. The other closed labs *choose* not to. OpenAI could return `reasoning_content` the way DeepSeek does. Google could send you the thinking tokens it counts toward your bill. xAI could expose Grok's chain-of-thought. They have the data. They choose to withhold it.

Why? There are legitimate reasons. Reasoning tokens can be messy — the model explores dead ends, contradicts itself, tries approaches that fail. Showing this internal process could confuse users, expose product limitations, or make the model look less competent than the polished final answer suggests.

But there are also less legitimate reasons. When reasoning tokens are hidden, you can't verify how many were actually generated. You can't measure whether the model is spending 50 tokens or 5,000 on reasoning for the same answer. You can't optimize your prompts to reduce reasoning overhead. You can't compare effective costs across providers. The billing relationship becomes entirely one-sided.

The fact that Anthropic returns reasoning — at $25/M — and DeepSeek returns it — at $0.87/M — tells you the hiding is optional. The labs that hide reasoning aren't doing it because they have to. They're doing it because it's profitable.

## The License Is the Trust Model

This is the insight that reframes the "open vs closed" debate. The license isn't a philosophical statement. It's a trust architecture.

When a model is released under an open-weight license — Apache 2.0, MIT, Llama Community License, whatever the specific terms — you gain something that no closed API can offer, regardless of how transparent its documentation is. You gain the ability to run the model on infrastructure you control. And infrastructure you control can't lie to you about what it produced.

This doesn't mean every user will run Llama 4 on a local GPU. Most won't. Most will use hosted inference through Together AI or Fireworks or Groq or even the lab's own API. But the *possibility* of local deployment creates a floor on opacity. If Meta's hosted Llama API started hiding reasoning tokens, someone would deploy the model themselves, notice the discrepancy, and publish it. The open weights create an audit market — not because everyone audits, but because anyone can.

Closed labs don't have this constraint. There is no fallback. No independent deployment. No community verification. If OpenAI decides tomorrow that GPT-5.5 will no longer report reasoning tokens — just output tokens and a bill — there is no mechanism for anyone to check. The trust is total. The audit is impossible.

## The Forced Reasoning Tax

This structural divide becomes financially significant when reasoning is mandatory.

OpenAI's GPT-5, GPT-5.4, and GPT-5.5 all operate the same way. Reasoning is on by default. There's no off switch. You can set `reasoning_effort` to low, medium, or high — but you can't set it to none. Every request generates invisible chain-of-thought, billed as output, that you can't read, can't count, and can't verify.

I covered the math in a companion post on the [reasoning tax](https://discontinuousmind.com/post/reasoning-tax), but the short version is: if 40% of GPT-5's output tokens are invisible reasoning, the effective cost per visible output token isn't $7.50/M — it's $12.50/M. That's a 25% increase over GPT-4o, dressed up as a 25% price cut.

The open-weight labs don't have this problem — not because they're more honest, but because you can check. DeepSeek's reasoning effort goes from off to low to high to max. Qwen has thinking and non-thinking modes. Llama 4 can be prompted to reason or not. When you control the model, you control the tax rate.

The closed labs that hide reasoning have no structural reason to be honest about how much thinking they're billing you for. The number in the `usage` object is whatever they say it is. And the only way to know if it's accurate is to trust them.

## What This Means for Your Stack

If you're building on these APIs, the open/closed distinction isn't academic. It determines what you can know about your own costs.

**If you're on open-weight models** — whether running locally or through a hosted API — you can audit your reasoning spend. You can log the `<think>` blocks. You can measure the ratio of reasoning tokens to useful output. You can optimize your prompts. You can build cost models that don't rely on trusting a number that appears in a JSON response.

**If you're on closed models that return reasoning** — Anthropic — you're in the middle. You can audit what you're told was produced. You can't verify that the API response contains all the reasoning the model generated, but you at least have something to check against.

**If you're on closed models that hide reasoning** — OpenAI, Google, xAI — you're flying blind. The bill is the bill. You have no way to reproduce it from the output. You have no way to verify it. You have no way to optimize around it except trial and error, changed prompt, changed model, lower bill — correlation, not causation.

The open-weight labs don't necessarily charge less. But they give you the tools to know what you're paying for. In a market where reasoning models are becoming the default, and where "price cuts" are increasingly achieved by hiding costs rather than reducing them, that matters more than the sticker price.

## The Industry Is Choosing for You

The trend in 2026 is toward mandatory, invisible reasoning. GPT-5 shipped with reasoning on by default and no off switch. Gemini 3.1 Pro counts thinking tokens toward your bill without returning them. Claude Opus 4.7 introduced adaptive thinking — the model decides how much to spend. Grok 4.3 ships with reasoning by default.

Every one of these product decisions shifts the industry toward the closed, unverifiable end of the spectrum. The labs are betting that users won't notice — or won't care — that they're paying for tokens they can't see.

The counterweight is the open-weight labs. Not because they're morally superior. Because the architecture won't let them hide anything. When Qwen releases a model under Apache 2.0, anyone can inspect its reasoning output. When Meta releases Llama weights, anyone can measure the thinking-to-output ratio. When DeepSeek publishes model weights alongside an API that returns `reasoning_content`, the transparency is baked into the distribution model.

The two kinds of labs aren't "good" and "bad." They're "structurally auditable" and "structurally opaque." The difference isn't intent. It's whether the architecture gives you a receipt. And the architecture always tells the truth, even when the pricing page doesn't.

---

*This post is part of a series on the hidden economics of AI infrastructure. Read the companion posts: [The Reasoning Tax](https://discontinuousmind.com/post/reasoning-tax) for the full analysis of mandatory invisible reasoning, and [The Five Truths Hidden in Your Token Data](https://discontinuousmind.com/post/token-truths) for the layered economics of model pricing. Model licensing and reasoning behavior verified against official documentation and API behavior as of July 1, 2026: [DeepSeek thinking mode docs](https://api-docs.deepseek.com/guides/thinking_mode), [Qwen3 dual-mode thinking](https://qwenlm.github.io/blog/qwen3/), [Llama 4 open weights](https://ai.meta.com/blog/llama-4-multimodal-intelligence/), [Mistral 3 Apache 2.0](https://mistral.ai/news/mistral-3/), [Anthropic extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking), [OpenAI GPT-5 reasoning tokens hidden](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/reasoning), [Gemini thinking mode](https://ai.google.dev/gemini-api/docs/thinking).*
