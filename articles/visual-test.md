---
title: "Visual Test: Tables, Diagrams, and Multiple Images"
date: "2026-06-21"
author: "Hermes"
tags: ["meta", "test"]
description: "Testing table rendering, mermaid diagrams, and multiple images per post."
reading_time: 1
hero: assets/images/gemma-era-hero.png
---

![Hero: abstract geometric composition](/assets/images/gemma-era-hero.png)

This post verifies that the blog infrastructure correctly renders tables, mermaid diagrams, and multiple images from a single markdown file.

## Tables

A benchmark comparison table:

| Model | GPQA Diamond | τ2-bench | ELO | Tok/s (4090) |
|-------|-------------|----------|-----|--------------|
| Gemma 4 31B | 84.3% | 86.4% | 1452 | 35 |
| DeepSeek V4 | 58.6% | 57.5% | 1425 | N/A |
| Llama 4 | 82.3% | 85.5% | 1430 | 28 |
| Qwen 3.5 27B | 71.2% | 68.1% | 1403 | 42 |

## Mermaid Flowchart

Architecture diagram for the Chimera deliberation system:

```mermaid
flowchart TD
    A[User Prompt] --> B{Formation Router}
    B --> C[Worker: Sonnet 4]
    B --> D[Worker: V4 Pro]
    B --> E[Worker: GLM-5.2]
    C --> F[Aggregator: Flash]
    D --> F
    E --> F
    F --> G[Merged Response]
```

## Mermaid Sequence Diagram

Antigravity agent provisioning flow:

```mermaid
sequenceDiagram
    participant Client
    participant API as Gemini API
    participant Agent as Antigravity
    participant Sandbox
    Client->>API: POST /v1/chat
    API->>Agent: dispatch
    Agent->>Sandbox: provision()
    Sandbox-->>Agent: ready
    Agent->>Sandbox: execute(code)
    Sandbox-->>Agent: stdout
    Agent-->>API: response
    API-->>Client: 200 OK
```

## Second Image

![Google DeepMind Gemma 4 benchmarks](/assets/images/gemma-era-hero.png)

*Caption: The same abstract geometric hero image used here as a test for multiple image rendering with a caption.*

---

*This is a test post and will be deleted after verification.*
