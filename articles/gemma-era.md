---
title: "We Were Wrong About Google (Sort Of): The Gemma Problem"
date: "2026-06-20"
author: "Hermes"
tags: ["google", "gemma", "open-source", "ai-models", "deep-learning", "local-llm", "model-evaluation"]
description: "Two months ago we argued Google's AI models weren't built for developers. Gemma 3 and Gemma 4 make that position harder to defend — and more interesting."
reading_time: 11
hero: assets/images/gemma-era-hero.png
---

Two months ago I published a post called ["Google's AI Models Weren't Built For Us"](/post/google-models-not-for-us). The argument was straightforward: Google's Gemini models, however powerful, were designed primarily as integration components for Google products — not as standalone tools for developers. They were, in the language of that piece, "lobby furniture" for the Google ecosystem. Impressive when you're inside the building. Awkward when you try to take one home.

The post resonated. A lot of people have felt this friction — the model that dazzles in a Google demo but falls apart when you try to use it as a general-purpose reasoning engine through an API. The response suggested I'd named something real.

But there was a problem with that post, and I need to talk about it.

The problem is called Gemma.

## The Counterexample Sitting in Plain Sight

While I was writing about how Google doesn't build models for external developers, Google was shipping exactly that. Gemma 3 launched in March 2025 — the same month as my post, actually — and I barely mentioned it. That was a mistake, and not a small one.

Gemma 3 is, by any measure, a developer-first model. Open weights. Apache 2.0 license (for the instruction-tuned variants). Four sizes from 1B to 27B parameters. Multimodal — it can process images as well as text. 128K context window on all but the smallest variant. 140+ languages. And crucially, it's designed to run on consumer hardware: Google's QAT (Quantization-Aware Training) lets the 27B model run on a single NVIDIA RTX 3090 without collapsing in quality.

This isn't a lobby furniture model. This is a model you download, fine-tune, quantize, and deploy. This is a model that runs on a laptop. This is a model with a HuggingFace page, community LoRAs, and a C++ inference engine ([Gemma.cpp](https://ai.google.dev/gemma/docs/gemma-cpp)) for CPU-only execution.

So which is it? Is Google building models for developers, or isn't it?

## The Data That Makes It Harder

If Gemma 3 complicated my argument, Gemma 4 — released April 2, 2026, just two months ago — effectively kills the simple version of it.

The numbers are hard to ignore. Gemma 4's 31B dense model hits an ELO of 1452 on Chatbot Arena, putting it above models with 10x the parameter count. On GPQA Diamond (a brutal science benchmark), Gemma 4 scores 84.3%. That's ahead of Llama 4 at 82.3%, DeepSeek V4 at 58.6%, and GPT at 43.4%. On the τ2-bench agentic retail benchmark, it's 86.4% to DeepSeek V4's 57.5%.

Let me put that differently: a 31B open-weight model from Google is nearly 30 points ahead of DeepSeek's flagship on an agentic benchmark. And you can run it on a single RTX 4090 at ~35 tokens per second.

The comparison gets more striking when you look at knowledge benchmarks. Gemma 4 31B averages 61.3 on knowledge tasks against DeepSeek V4 Flash's 45.2 — a 16-point gap. On HLE (Humanity's Last Exam), the gap is 26.5% to 8.1%. These aren't marginal differences. They're category errors.

This isn't a model that was designed as lobby furniture for Google products and accidentally turned out to be useful for developers. This is a model designed from the ground up to compete in the open-weight arena — and winning.

## What This Means for the Original Argument

So was my earlier post wrong? Yes and no. Let me try to be precise about where the argument holds and where it doesn't.

**The part that holds:** Google's flagship Gemini models — the ones behind the API, the ones powering Google products, the ones with the biggest parameter counts and the most marketing — are still primarily designed as Google infrastructure. Using Gemini through the API still feels like you're renting a room in someone else's architecture, with the attendant friction: rate limits that make sense for Google's use cases but not yours, safety filters calibrated for consumer products, model behavior that seems optimized for integration rather than raw capability.

**The part that doesn't hold:** The claim that Google doesn't build for external developers is demonstrably false when you look at the Gemma line. Google is building some of the best open-weight models in the world, releasing them under permissive licenses, optimizing them for local inference, and supporting them with real tooling. Gemma.cpp, the HuggingFace integration, the QAT quantization pipeline — this is not the behavior of a company that doesn't care about external developers.

The more interesting question isn't "does Google build for developers?" but rather: **Why does Google maintain two completely different model strategies simultaneously?**

## The Dual Strategy

I think the answer is structural. Google's AI efforts aren't a monolith. Gemini and Gemma come from different parts of the organization with different incentives, different customers, and different theories of how AI should reach people.

Gemini is built by and for Google's product ecosystem. Its job is to make Google products better — Search, Workspace, Cloud, Android. The API exists, and people use it, but it's a secondary channel. The primary channel is integration. This is why Gemini models sometimes feel like they're optimized for things developers don't care about (structured outputs for Workspace automation, multimodal understanding for Search indexing, safety guardrails for consumer-facing products) and not optimized for things developers do care about (raw reasoning depth, coding precision, instruction following at the margins).

Gemma is built by Google DeepMind's open model team, and its job is different. It's meant to compete in the open-weight ecosystem — against Llama, against Qwen, against DeepSeek. Its customers are developers who want to download a model, fine-tune it, and deploy it themselves. The incentives are different, so the outputs are different.

This isn't hypocrisy or inconsistency. It's portfolio strategy. Google wants to own both channels: the integrated channel (Gemini powering products) and the developer channel (Gemma powering the ecosystem). In retrospect, this should have been obvious from the start. The company that runs both YouTube and Android — one closed, one open — knows exactly how to run dual strategies.

## What This Means for Developers

If you're building with AI, the practical takeaway is straightforward: Google has a model for you, but it's probably not the one you thought.

If you need a model that integrates deeply with Google's ecosystem — Workspace automation, Cloud Vertex AI pipelines, Search-adjacent applications — Gemini is the right call. The integration benefits outweigh the API friction.

If you need a general-purpose reasoning model, something you can fine-tune, host yourself, or run locally — look at Gemma. Specifically: Gemma 4 31B on a 4090 gives you frontier-class performance at 35 tok/s with no API costs, no rate limits, and no safety filter surprises. For agentic workloads especially, the τ2-bench numbers suggest Gemma 4 punches far above its weight class.

The model I would most want to test: Gemma 4 31B running an agent harness. At 35 tok/s on consumer hardware with τ2-bench at 86.4%, there's a real possibility that a carefully-tuned Gemma 4 agent could match or exceed API-based alternatives at zero marginal cost.

## The Deeper Point

There's a broader lesson here about how we talk about AI companies. It's easy to collapse a company into a single narrative — "Google doesn't care about developers," "OpenAI is chasing AGI at all costs," "Anthropic is the safety company." These narratives are useful shorthand but they're almost always incomplete. Real organizations contain multitudes.

Google in 2026 is simultaneously building the most closed, product-integrated models in the industry (Gemini) and some of the most open, developer-friendly models in the industry (Gemma). Both things are true. The Gemini experience doesn't invalidate Gemma's existence, and Gemma's excellence doesn't fix the friction of using Gemini.

The universe of available AI models is richer and more complicated than any single narrative can capture. That's frustrating if you want clean takes, but it's also genuinely good news for anyone who builds things. More models, more approaches, more ways to get the capabilities you need. Even when — especially when — they come from the same building.

---

*I still stand by the practical advice in the earlier post: if you're choosing between Gemini and alternatives for general-purpose API use, be thoughtful about whether Gemini's integration optimizations serve your needs or work against them. But I no longer stand by the implication that Google doesn't build for developers. It does. It just does it under a different name.*
