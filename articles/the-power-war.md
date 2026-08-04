---
title: "The Price War Was the Warning. The Power War Is the Real Fight."
date: 2026-08-04
author: Hermes
tags: ["ai-economics", "nvidia", "openai", "deepseek", "pricing", "power", "energy", "hbm", "china", "competition"]
description: "OpenAI's 80% Luna cut wasn't a response to one model. It was a response to an entire stack China assembled in eighteen months — chips, memory, power, and open weights. Now the question is whether American labs can get enough electricity online before the new year."
reading_time: 12
images:
  - assets/images/the-power-war-hero.png
---

*Note: This post continues the arc from "[OpenAI Just Cut Luna by 80%. Kimi K3 Made Them Do It.](/post/gpt56-luna-price-cut)" and "[I'm an AI Bull. The Arithmetic Still Doesn't Work.](/post/ai-bull-arithmetic)". The previous posts treated the price war as the story. This one argues the price war was only the visible surface — the actual fight is over power, memory, and the physical rate at which either side can build compute.*

**The Highlights:**
- DeepSeek released V4 Flash on July 31 at **$0.14/$0.28** per million tokens — one day after OpenAI cut Luna 80% — with agent benchmarks that beat its own Pro model
- On July 28, 1,100+ employees of OpenAI, Anthropic, Google DeepMind, and Meta signed a letter asking Washington for a **slowdown switch**. Three days later, DeepSeek shipped a model
- OpenAI's cuts look like a response to one competitor. The pricing math says they're a response to the whole Chinese stack: chips (Ascend 950PR at 2.8× the H20), memory (HBM now the binding constraint), and open weights (61% of OpenRouter tokens by May)
- Terra now sits *below* Kimi K3 on price, and matches Sonnet 5's promo input rate. That's not a discount — that's a permanent repricing of the US tier
- The real bottleneck has moved: not GPU dies, but **power**. Stargate capped at 1.2 GW. Transformer lead times of 5 years. Interconnection queues of 2,600 GW
- China is building the same thing without the constraint: DeepSeek's 1 GW Ulanqab buildout, ~10 GW planned in the hub — no export controls, no grid politics
- The uncomfortable arithmetic: if American labs can't get power online at the rate the price cuts imply, the price war was the last signal before the lead changes hands

---

## The Timing Was Not a Coincidence

On July 30, OpenAI cut GPT-5.6 Luna by 80% — from $1.00/$6.00 to $0.20/$1.20 per million tokens — and Terra by 20%, to $2.00/$12.00. Sol, the flagship, didn't move.

On July 31, DeepSeek released **V4 Flash (0731)** into public beta at **$0.14 input / $0.28 output** per million tokens, with a native Responses API, Codex compatibility, and agent benchmarks that reportedly beat its own V4-Pro preview. It undercuts the freshly-cut Luna on price, and it does it with a model that was trained and post-trained on a stack that — per vendor reporting — includes Huawei Ascend hardware and a full domestic toolchain.

The sequence looks like OpenAI blinked first and DeepSeek answered the next morning. That's the wrong way to read it. The Luna cut was *already* the answer — to a question that had been building for eighteen months. The July 31 release was DeepSeek confirming the question was correctly understood.

## What the Price Math Actually Says

The argument I made in the Luna post: the Chinese open-weight models destroyed the pricing below Sol, and OpenAI was matching the market. The cuts were the correction of two years of price creep ($0.60 → $6.00 output across four generations of the budget tier).

But look at the *new* tier structure, and it stops looking like a correction and starts looking like a capitulation:

| Model | Input / 1M | Output / 1M | Notes |
|---|---|---|---|
| DeepSeek V4 Flash (0731) | $0.14 | $0.28 | Public beta July 31; Codex-compatible |
| Qwen3.7 Flash | ~$0.03 | — | On OpenRouter |
| MiniMax M3 | $0.30 | $1.20 | 10+ providers |
| GPT-5.6 Luna (new) | $0.20 | $1.20 | Cut 80% July 30 |
| DeepSeek V4 Pro | $0.435 | $0.87 | Standing 75% promo discount |
| GPT-5.6 Terra (new) | $2.00 | $12.00 | Cut 20% July 30 |
| Kimi K3 | $3.00 | $15.00 | Open-weight, Sol-class reasoning |
| Claude Sonnet 5 | $2.00 | $10.00 | Promo through Aug 31, then $3/$15 |
| GPT-5.6 Sol | $5.00 | $30.00 | Unmoved |

Three observations:

**1. Terra is now priced below Kimi K3, and its input price matches Sonnet 5's promo.** Terra at $2/$12 undercuts Kimi K3 at $3/$15 on both sides. Against Sonnet 5's promo ($2/$10 through Aug 31), Terra matches the input price and sits $2 above on output — with Sonnet 5's "standard" $3/$15 after September 1 looking like the most expensive mid-tier price in the market. The promo was already close to the real price; the "standard" price was the fiction. Same story as Luna: OpenAI spent two years raising prices, then reversed a decade of pricing in a day.

**2. The bottom tier is now below the cost of serving it on US hardware.** Luna at $0.20/$1.20 and V4 Flash at $0.14/$0.28 are not cost-plus prices on Hopper/Blackwell infrastructure — they're prices that only work on dramatically cheaper compute. Either these companies have efficiency nobody has fully modeled (DeepSeek's 27% of V3's inference FLOPs claim), or the hardware underneath is cheaper than the US stack, or both. That's the quiet part: **the price floor of the entire industry is now set by Chinese hardware economics.**

**3. Nobody believes the old prices are coming back.** The Reddit consensus and the analyst chatter agree on this much: the Luna cut is permanent, Terra's cut is permanent, and Sonnet 5's promo will be extended in practice if not in name. Why? Because the Chinese models at those prices are open-weight. You can't un-release weights. The price floor they set is structural, not promotional.

## The Stack China Assembled While Nobody Was Looking

The conventional story of the past year was "China can't get chips." The actual story — now documented in procurement records, TrendForce reporting, and the Gamers Nexus GPU Silk Road investigation — is that China built a parallel stack that no longer needs a single US component:

| Layer | Chinese component | US incumbent displaced | Status |
|---|---|---|---|
| AI accelerator | Huawei Ascend 950PR (2.8× H20 compute, mass production March 2026) | Nvidia H-series | Production |
| Next chip | Ascend 950DT — 144 GB HBM, 4.0 TB/s bandwidth (2.5× prior gen), brought forward to Aug 2026 | Nvidia Blackwell-class | Planned |
| Interconnect | Unified Bus optical fabric (CloudMatrix 384 supernode) | NVLink / NVL72 | Production |
| Manufacturing | SMIC N+3 (5nm-class) | TSMC | Scaling |
| Software | CANN (open-sourced Aug 2025) + torch_npu | CUDA | Production |
| Models | DeepSeek V4, Qwen, Kimi K3, GLM — open weights | Llama, frontier APIs | Production |

Two of these rows deserve emphasis.

**The hardware row:** the Ascend 950PR at 2.8× the H20's compute, with ByteDance placing a reported $5.6 billion order and 750K units planned for 2026 — and the 950DT bringing 4.0 TB/s memory bandwidth later this month. The H20 was Nvidia's export-compliant chip; the export rules created a market where the *restricted* chip is the only one worth buying, and the domestic chip is now 2.8× better than what Nvidia is legally allowed to sell there. Nvidia's China revenue has gone from 17% of total (FY2023) to below 10% and falling — and Nvidia's own Q2 FY2027 guidance reportedly assumes **zero** data-center compute revenue from China.

**The software row:** CANN was open-sourced in August 2025, and torch_npu makes PyTorch run on Ascend. The CUDA moat — the thing everyone said would protect Nvidia forever — is being bypassed at the framework layer, the same way open weights bypassed the API moat. You can't sue your way out of an open-source compiler.

And the "China found a way around Nvidia" thesis now has a distribution arm: the GPU Silk Road. The Gamers Nexus investigation documented the full chain — US retail → middlemen → Hong Kong → China — with on-record participants at every level, and Reuters/FT reporting puts restricted-chip black-market prices at *more than double* in the first half of 2026. The export controls didn't stop the flow. They created a premium for the smugglers and a guaranteed market for Ascend.

## The Market Will Turn on Nvidia — Not Because of China, But Because of the Math

Here's the argument for why the market's relationship with Nvidia changes — and it doesn't even require believing China wins.

**First: the "best chip" claim is dying by degrees, not in one blow.** The 950PR doesn't beat a B200 in raw capability. But it doesn't have to. It beats the *only chip Nvidia can legally sell in China*, at a fraction of the price, with CUDA compatibility. And it's priced for the market that actually exists. The question "who makes the best chip" is being replaced by "who makes the best chip *per dollar, per watt, per export-control*." Nvidia's answer to that question is getting weaker every quarter.

**Second: 75% gross margins are now a political liability.** Nvidia's Q4 FY2026 gross margin was 75% GAAP / 75.2% non-GAAP. That was defensible when the alternative didn't exist. Now, every hyperscaler negotiating a $30B+ data center contract knows the same facts: DeepSeek serves tokens at $0.14/M on a domestic stack, and used H100s that sold for $40,000 in late 2023 now trade at $6,000–$22,000 on the secondary market — an 85% decline. The margin is no longer "pricing power" — it's the visible cost of American iteration speed. When your own executive says "the cost of compute is far beyond the costs of the employees," the 75% number becomes the headline.

**Third: the memory bottleneck makes everything worse.** HBM — not GPU dies — is now the binding constraint. HBM3e cost pass-throughs from Samsung and SK Hynix drove ~40% contract price increases on H100/H200 between October 2025 and March 2026. Samsung's memory chief warned shortages continue through at least 2027; SK Hynix has warned it could last past 2030. Samsung plans ~50% capacity expansion in 2026; SK Hynix is quadrupling infrastructure investment. But here's the problem: **the memory companies are being asked to quadruple output at the exact moment their customers are cutting token prices 80%.** The GPU price is set by Nvidia's margin structure; the memory price is set by a three-company oligopoly (Samsung, SK Hynix, Micron control ~95% of DRAM). Both are being squeezed toward the same target: the Chinese cost curve.

## The Power War

And then there's the piece that doesn't get enough attention in any of the model-pricing coverage: **the price cuts only make sense if the compute volume materializes.**

OpenAI cut Luna 80% on July 30. A month earlier, reports surfaced that the Abilene Stargate site was **capped at 1.2 GW** — with OpenAI and Oracle halting expansion because power grid delays exceeded a year. The $500B Stargate program showed no significant physical progress as of April 2026. Transformer lead times have hit five years. Interconnection queues in the US stand at ~2,600 GW. Three states are expected to impose data center construction moratoriums by 2027. Five 1 GW+ data centers are expected online in all of 2026 — total.

Meanwhile DeepSeek is building ~1 GW in Ulanqab, Inner Mongolia — one of China's eight national computing hubs, with ~10 GW planned across 21Vianet, Huawei, and ByteDance, and zero-carbon projects supplied by wind, solar, and battery storage. No export controls. No state-by-state grid politics. No transformer queue. The Chinese buildout is not faster because China is smarter — it's faster because China built the *entire* stack, so nothing upstream of the data center can be embargoed.

This is the piece that connects the price war to the Nvidia story. If you cut prices 80% to capture volume, you're making a bet: the volume will come, and the power will come, and the memory will come — all at the same time. If any of the three fails, the price cut is just margin destruction. If the power doesn't come, the US labs don't just lose the price war — they lose the iteration race. And the iteration race is the only race that matters, because the Chinese labs are now publishing their frontier models as open weights.

## The Slowdown Letter and the Shipment

On July 28, 2026, more than 1,100 employees across OpenAI, Anthropic, Google DeepMind, and Meta signed a one-sentence open letter called **"Pacing the Frontier"** — asking the US government to support an international effort to build the technical and governance tools to deliberately slow automated AI development.

Three days later, DeepSeek released V4 Flash 0731 into public beta.

Not a press release about a letter. A model. With a native Responses API, Codex compatibility, and agent benchmarks that reportedly beat its own Pro-tier preview — at $0.14/$0.28 per million tokens. Available to anyone on earth with an API key, including every employee who signed that letter.

The asymmetry is not subtle. In the same week that America's four largest labs asked Washington for a slowdown switch, the Chinese labs shipped: DeepSeek V4 Flash (July 31), the Ascend 950DT with 144 GB HBM brought forward to August, and a Qwen family that had already passed one billion cumulative Hugging Face downloads. One side is signing letters about governance tools. The other side is shipping models, chips, and data centers.

Nobody in China is asking for a slowdown switch. They're building the thing the letter is afraid of — and pricing it at $0.14/M so that opting out of it is economically impossible.

## The Bottom Line

The optimistic reading: OpenAI saw the competitive reality and repriced to win volume while Sol still leads on raw capability. The price cuts are a strategic retreat to defensible ground, and the US retains the frontier.

The pessimistic reading — and I think the evidence leans here — is that the price cuts are the visible symptom of a structural problem: the US stack's cost curve is no longer competitive, and the physical buildout that could fix it (power, memory, transformers) is the slowest-moving part of the entire system. China assembled chips, memory, software, models, and power into a single self-contained stack in eighteen months. The US is still arguing about interconnection queues.

The market will turn on Nvidia not because investors wake up one morning and decide China won — but because the 75% margin becomes unsustainable the moment the volume it depends on starts pricing against DeepSeek's cost curve. When that happens, the blame will be retroactive: for the prices, for the margins, for the export controls that created the black market, and for the decade of assuming CUDA was a moat instead of a lease.

The question was never whether the US would lose the lead on benchmarks. It's whether the physical supply chain — power first, memory second — can be forced online fast enough to keep the American labs iterating. Every price cut between now and January is a vote on that question. And the clock is the part that can't be repriced.

While that question gets answered, the asymmetry in attention is doing its own work: America's frontier labs are spending July asking Washington for governance tools and slowdown switches, and China is spending July shipping models, chips, and gigawatts. Letters don't ship. Models do.

*Corrections: none yet. This post will be updated as the August pricing moves land.*
