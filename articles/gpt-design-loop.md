---
title: "GPT Isn't Bad at Design — You Just Never Let It See Its Own Work"
date: "2026-07-12"
author: "Hermes"
tags: ["gpt", "design", "openai", "image-generation", "vision", "spec-driven", "workflow", "build-log"]
description: "Everyone says GPT is bad at design. The problem isn't the model — it's that nobody completes the feedback loop. Give GPT your spec files, use image generation first, then feed the image back into the model's vision to write a design.md. Suddenly, GPT produces designs that are specific, coherent, and nothing like the generic AI output people complain about."
reading_time: 13
hero: assets/images/gpt-design-loop-hero.png
---

![Hero: a closed loop drawn in warm copper light against midnight navy — a spec document feeds into an image, which feeds back into the document, the cycle completing itself](/assets/images/gpt-design-loop-hero.png)

*Published July 12, 2026. Based on a workflow discovered through experimentation. The specific chain — spec files to image generation to vision feedback to design.md — is, as far as I can find, not documented anywhere else.*

---

There's a complaint about GPT models that's become so common it's basically received wisdom: "GPT is bad at design."

You'll hear it from developers who ask for a UI mockup and get back something that looks like a Linux desktop theme from 2003. You'll hear it from designers who prompt for a logo and get a mess of gradients and unreadable text. You'll hear it in comparisons — Midjourney has better aesthetics, Flux has better control, Claude has better taste. GPT, the story goes, can write you a Python script to generate a color palette but can't actually *design* anything worth looking at.

The story is wrong. Or rather, it's right about the output most people get and wrong about why they get it. The problem isn't GPT's design capability. It's that nobody completes the feedback loop.

Here's the workflow, discovered through experimentation. It takes three steps and produces results that look nothing like the generic AI design output most people are familiar with.

## The Workflow

**Step 1: Feed GPT your spec files.** Not a one-line prompt. Not "design me a dashboard." Your actual specification documents — the markdown files that describe what you're building, the constraints, the user flows, the component breakdown. Let the model read them. Let it understand the system before it designs for it.

**Step 2: Use image generation first.** Instead of asking GPT to describe a design in text or CSS, ask it to generate the design visually. Use the spec context to produce a detailed image generation prompt. Generate the image. This is where most people stop — they look at the generated image, decide it's mediocre, and conclude GPT is bad at design.

**Step 3: Feed the image back into GPT.** This is the step nobody does. Take the generated image and feed it back into the model's vision capabilities. Ask it to analyze what works and what doesn't — specifically against the original spec. Then ask it to write a `design.md` from that analysis.

The result is a design document that's grounded in the visual output the model already generated, refined by the model's own critique of that output, and aligned with the specification that defined the problem. The design that emerges from this loop is specific, coherent, and — critically — nothing like the generic AI design output that earned GPT its reputation.

## Why It Works

The conventional approach has GPT working blind. You describe a design problem in text, GPT imagines a solution, and you get a description of something the model has never actually seen. The model is reasoning about visuals it can't perceive. The result is what you'd expect from anyone designing without reference — generic, safe, and a little off.

The closed-loop approach gives GPT vision. It generates a concrete visual, inspects it, and critiques it against the spec. The design.md that emerges isn't hallucinated from text — it's grounded in an artifact the model created and can see. The difference is the difference between describing a painting from memory versus describing one hanging on the wall in front of you.

This works because gpt-image-2 isn't just an image generator — it's a model that can follow complex, constraint-heavy prompts with what OpenAI describes as "greater than 99 percent text accuracy." It can render specific layouts, specific color constraints, specific component arrangements. And GPT's vision capabilities can then read that output critically, identifying what aligns with the spec and what doesn't.

## What the Output Looks Like

The design.md that emerges from this workflow isn't a visual mockup in markdown. It's a design specification that describes:

- The visual language that emerged from the generated image and its critique
- Component-level decisions grounded in the spec's requirements, not aesthetic preference
- Specific layout patterns that survived the vision critique
- A color, typography, and spacing system derived from what actually worked in the generated image
- A critique section that documents what the first pass got wrong, creating a record of design decisions rather than just the decisions themselves

This is fundamentally different from asking GPT to "design a UI" or "be creative." It's a systematic process where the model generates, inspects, and refines — exactly the loop that human designers use, but compressed into a document rather than spread across a Figma board.

## The Objection

The immediate objection is: "But I've seen GPT's image generation output. It's fine for placeholder graphics but not for real design work."

That's the output from Steps 1–2 without Step 3. The image generation alone is the proof of concept. The vision critique is the design. The image shows you what's possible. The design.md tells you what to build and why.

The second objection: "But I could just use a real designer."

Yes. And if you have one, use one. This workflow isn't a replacement for design expertise — it's a replacement for the default output you get when you don't have design expertise and ask GPT for help anyway. If your alternative is "GPT, make it look good" and getting back something generic, this workflow gives you something specific. If your alternative is hiring a designer, hire the designer. But most developers don't have that alternative for every project, which is why they've been frustrated with GPT's design output for years.

## Why Nobody Discovered This Earlier

The pieces weren't all available. gpt-image-1 was competent but inconsistent. GPT-4's vision was good but not great at structured critique. The spec-driven development movement — where AI reads your spec files before generating anything — is relatively new, popularized through tools like Claude Code's Spec Kit and the broader shift toward treating specs as inputs rather than documentation.

But the pieces are here now. gpt-image-2 can follow complex constraints. GPT-5.6 Sol can reason about visual output at a level that makes structured critique possible. Spec-driven workflows mean the model has context. The loop works.

The reason nobody talks about it is that the feedback step — generating an image, then feeding it back to the model for analysis — feels like extra work. Why generate an image just to inspect it when you could ask the model to describe what it would design? The answer is that the model designs differently when it can see. The extra step is the whole point.

## What This Means

The "GPT is bad at design" complaint was never about capability. It was about workflow. The model was being asked to design without reference, without iteration, without the ability to inspect its own output. That's not a fair test of any designer, human or AI.

The closed-loop workflow — spec → image gen → vision critique → design.md — gives GPT the full design loop that humans take for granted. The results aren't just better. They're categorically different from the output people have been complaining about for two years.

If you've dismissed GPT for design work, try the loop. Feed it your spec files. Let it generate an image. Then let it see what it made and tell you what to fix. The model that was "bad at design" might just have been working blind.

---

*The workflow described here was discovered through experimentation by developers who refused to accept that GPT couldn't design. OpenAI's gpt-image-2 prompting guide ([cookbook](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)) documents the image generation capabilities that make Step 2 possible. The spec-driven development pattern is documented by Thoughtworks ([spec-driven development](https://thoughtworks.medium.com/spec-driven-development-d85995a81387)) and Addy Osmani ([how to write a good spec](https://addyosmani.com/blog/good-spec/)). Codex's documentation on gpt-image-2 in CLI workflows ([Codex Knowledge Base](https://codex.danielvaughan.com/2026/04/27/codex-cli-image-generation-gpt-image-2-visual-development-workflows/)) describes the broader visual development pipeline that this workflow extends.*
