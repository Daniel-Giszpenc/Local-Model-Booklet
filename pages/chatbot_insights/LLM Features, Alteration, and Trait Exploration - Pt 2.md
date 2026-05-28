# you asked

what other niche/less well known and talked about or research community specific opt in llm optimization techniques exist like deja vu and not all attention

# claude-opus-4-7-search responsed

# Niche / Research-Community LLM Optimization Techniques

Beyond Deja Vu and "Not All Attention Is Needed," there's a rich ecosystem of lesser-known opt-in optimizations. They mostly fall into a few families: **contextual/activation sparsity**, **layer/depth skipping**, **KV-cache tricks**, and **structural pruning at runtime**. Here's a tour:

## 1. Contextual & Activation Sparsity (Deja Vu's cousins)

Deja Vu itself is built around the idea that small, input-dependent sets of attention heads and MLP parameters yield approximately the same output as the dense model for a given input, predicted on the fly. Related but less-discussed methods:

- **CATS (Contextually Aware Thresholding for Sparsity)** — a framework for sparsifying base LLM activations that can be applied to various base models and outperforms existing sparsification techniques on downstream tasks.
- **CHESS** — activation sparsification via channel-wise thresholding and selective sparsification, addressing the fact that earlier thresholding methods focus only on activation statistics, failing to model the impact on overall model performance.
- **ProSparse / Turbo Sparse** — a simple sparsification method called "ProSparse," and Turbo Sparse which achieves SOTA performance with minimal activated parameters (used by PowerInfer).
- **ReLU Strikes Back** — uses ReLU to improve activation sparsity, similar in spirit to PowerInfer.
- **SparseInfer** — training-free activation sparsity prediction. The motivation: classical pruning and quantization reduce memory access overhead but can result in accuracy loss; an alternative is to take advantage of activation sparsity.
- **CoreInfer** — algorithm optimization using semantics-inspired adaptive sparse activation to accelerate inference.
- **Dynamic Input Pruning + Cache-Aware Masking** — an MLSYS'25 paper combining dynamic pruning with cache-aware masking.

## 2. Layer Skipping, Early Exit, and Adaptive Depth

These exploit the observation that not every token needs every layer.

- **LayerSkip** — uses early exit at intermediate layers verified by self-speculative decoding. By probing each transformer layer (projecting output embeddings on the LM head, applying softmax, and getting the argmax), the predicted token at that layer is equivalent to early-exit, i.e., skipping the remaining layers, and speculative decoding is leveraged to verify and correct early-exit predictions.
- **FlexiDepth** — a method for adaptive layer-skipping in pre-trained LLMs motivated by the fact that LLMs typically generate each token via a full forward pass through all layers, but uniform allocation is counter-intuitive since simpler tasks should require fewer resources.
- **AdaSkip** — categorizes existing approaches into early skipping, periodic skipping, and early exit, where early skipping always drops predetermined first layers (batchable but may skip important ones), periodic skipping drops one layer every several layers, while early exit conditionally drops trailing layers.
- **Mixture-of-Depths** — dynamically allocates compute across token positions (referenced in "Mixture-of-depths: Dynamically allocating compute").
- **Confident Adaptive Language Modeling (CALM)** — early NeurIPS 2022 work on token-level confidence-based exiting.
- **SkipBERT / HadSkip** — HadSkip does homotopic and adaptive layer skipping of pre-trained language models for efficient inference; SkipBERT does efficient inference with shallow layer skipping.
- **SHARP** — replaces a layer with the previous adjacent layer plus learned recovery parameters (via finetune) to decrease memory overhead.
- **Transformer Layers as Painters** — a more theoretical study suggesting layers can sometimes be reordered/skipped without catastrophic effects.

Practical wrap-up of the family: extensions include combining early-exit with quantization, sparse activation (AWQ, PowerInfer), multi-modal routing, "big-little" core scheduling, and untrained gating functions for threshold-free dynamic computation.

## 3. Sparse / Block-Sparse Attention Variants (beyond FlashAttention)

- **Star Attention** — a two-phase block-sparse approximation for efficient LLM inference over long sequences.
- **MInference 1.0** — an inference framework based on dynamic sparse attention from Microsoft, for accelerating pre-filling in long-context LLMs.

## 4. KV Cache Niche Tricks

- **Lexico** — extreme KV cache compression via sparse coding over universal dictionaries.
- **DéjàVu KV-cache streaming** — a follow-up work focused on KV-Cache streaming for fast, fault-tolerant generative LLM serving.

## 5. Structural / Component Pruning Specialties

- **FFSplit** — exploits sparsity in the FFN by splitting the feed-forward network for optimizing the accuracy-efficiency trade-off.
- **AMP (Attention Heads and MLP Pruning)** — a structured pruning method that compresses LLMs by removing less critical structures within Multi-Head Attention and MLP, projecting input data onto weights to assess structural importance.
- **RAP (Runtime-Adaptive Pruning)** — uses RL: a learned controller during inference guides the LLM to prune different components (attention heads, feed-forward channels, or entire layers) per request with negligible runtime cost, yielding a flexible, context-aware compression mechanism that scales to edge environments.
- **ShortGPT** — reveals significant redundancy in LLMs by proposing a layer-pruning method that removes redundant layers with minimal performance degradation.
- **SpInfer** — Tensor-Core-Aware Bitmap Encoding (TCA-BME) and sparse GEMM kernel that make unstructured pruning's theoretical advantages translate to real GPU speedups.
- **LLM Surgeon** — unstructured/semi-structured/structured pruning framework employing Kronecker-factored curvature approximations of the target loss landscape.
- **COPAL** — prunes weights by analyzing directional derivatives of the loss function across datasets.
- **Wanda** — identifies sparse sub-networks by ranking each weight using the product of its absolute value and its squared input feature norm.
- **Pruning to Intra-module Low-rank Architecture with Transitional Activations** — pruning LLMs to an intra-module low-rank architecture using transitional activations.

## 6. Self-Speculative & Draft-less Decoding Variants

Less-discussed than vanilla speculative decoding:
- **Self-speculative decoding** (Draft & Verify) — uses the same model with skipped layers as the drafter, avoiding the larger memory footprint and complexity of maintaining KV cache in two different models that classic speculative decoding requires.
- LayerSkip's self-speculation, where early exit generates each token auto-regressively and the remaining layers verify a group of tokens.

---

### How to Think About Picking One

| Bottleneck | Try first |
|---|---|
| MLP-bound decode | ProSparse / Turbo Sparse / CATS / CHESS / PowerInfer-style activation sparsity |
| Long-context prefill | MInference, Star Attention |
| KV cache memory | Lexico, DéjàVu streaming |
| Latency per token | LayerSkip, FlexiDepth, AdaSkip, Mixture-of-Depths |
| Edge deployment with shifting memory budgets | RAP |
| Throughput on commodity GPUs | SpInfer (sparse GEMM kernels), AMP structured pruning |

Most of these are **opt-in**: they require either a specialized runtime, a small finetune (e.g., LayerSkip's layer dropout, ProSparse's activation regularization), or replacement of attention/MLP kernels — which is why they remain niche compared to mainstream quantization or FlashAttention. A useful curated tracker is the GitHub repo "LLM-inference-optimization-paper" if you want to keep up with the long tail.

# grok-4.3 responded

**Deja Vu (contextual/dynamic sparsity via lightweight predictors for skipping attention heads and MLP neurons at inference) and "Not All Attention Is Needed" (static pruning of redundant attention layers) are examples of specialized, research-oriented LLM optimizations that go beyond mainstream techniques like quantization, FlashAttention, KV caching, speculative decoding, or continuous batching.**

These are typically "opt-in" because they require custom implementations, predictors, pruning scripts, or model modifications (often from arXiv papers or GitHub repos), rather than being built into standard frameworks like vLLM or Hugging Face out of the box. They target efficiency through sparsity or redundancy removal while aiming to preserve quality.

Here are other niche or research-community-specific examples in a similar vein (focusing on sparsity, dynamic computation, or targeted pruning/layer dropping). These are less mainstream than core inference engines but appear in recent papers and workshops:

- **Progressive/iterative layer dropping (e.g., TrimLLM)**: During domain-specific fine-tuning, layers are progressively dropped (often the least important ones, identified via calibration or activation metrics) to reduce model depth. This yields inference speedups (e.g., 2–3× on consumer GPUs or A100s) at 50%+ compression with minimal accuracy loss on specialized tasks (medical, legal, financial). It combines adaptation and compression without needing sparse kernels or hardware support. Related work studies unified layer dropping (attention vs. MLP blocks).

- **Targeted attention-layer or attention-head pruning**: Methods that identify and permanently remove redundant or highly similar attention layers/heads (beyond generic pruning). Examples include high-layer attention pruning with rescaling, automated fairness-aware attention pruning, or systematic studies showing many attention layers can be dropped with little performance impact (e.g., ~48% speedup on Llama-2-70B with minor degradation). These are often static post-training or during fine-tuning modifications.

- **Advanced or extreme sparsity techniques (static/dynamic weight/activation pruning)**: 
  - Training-free fine-tuning for already-sparse LLMs (e.g., DS-T): Iteratively prunes/grows weights in a sparse model based on reconstruction error criteria (expectation and variance) without backpropagation, improving high-sparsity performance.
  - Surrogate-free constrained optimization methods (e.g., Elsa via ADMM) for pushing sparsity to extreme levels (up to 90%) while retaining fidelity.
  - Broader surveys and workshops on sparsity in LLMs cover activation sparsity, structured/unstructured pruning variants, and dynamic masks that adapt per input or during training.

These often appear in research venues (arXiv, ICLR workshops on sparsity/MoE, TMLR) and may require paper-specific code or adaptations. They complement or extend ideas from Deja Vu (dynamic/predictor-based) and attention pruning (static redundancy removal). Implementation typically involves custom predictors, importance scoring, or fine-tuning loops, making them more accessible to researchers or advanced practitioners than general users.

For the latest or more obscure variants, check recent arXiv searches on "LLM sparsity," "layer dropping," or "attention pruning," or sparsity-focused workshops. Many provide GitHub implementations for reproducibility. Mainstream frameworks are gradually incorporating elements of these, but the cutting-edge research versions remain niche and opt-in.

# you asked

Highlight what developments are relevant and usable for end user llm inference (not training) in 2026, not out of date or passed on to another project. The developments should have some industry presence.

# gemini-3-flash-grounding responded

In 2026, the gap between "academic research" and "production inference" has closed significantly. While techniques like **FlashAttention** and **PagedAttention** (vLLM) are now standard infrastructure, several "niche" methods have matured into usable, opt-in tools for end users who need to squeeze extra performance out of consumer or enterprise hardware.

Here are the most relevant, industry-present LLM inference optimizations for 2026 that follow the "selective computation" philosophy of *Deja Vu*.

### 1. Dynamic Sparsity & Sparse Prefilling (MInference 1.0)
If *Deja Vu* focuses on activation sparsity, **MInference** (Million-token Inference) focuses on **Attention Sparsity** during the pre-fill stage. 
*   **What it is:** It identifies that long-context attention matrices follow specific patterns (A-shape, Vertical-Slash, and Block-Sparse). It uses an offline pass to determine which heads follow which pattern and then uses custom GPU kernels to compute only those sparse indices.
*   **2026 Status:** Integrated as an opt-in for long-context models (1M+ tokens) in frameworks like **vLLM** and **SGLang**. It reduces A100/H100 pre-fill times for 1M tokens from 30 minutes to ~3 minutes.
*   **Usability:** Highly usable for RAG (Retrieval-Augmented Generation) users who often have massive context but limited time.

### 2. Multi-head Latent Attention (MLA)
Originally a research breakthrough from DeepSeek, **MLA** has become the "architectural endgame" for KV-cache efficiency in 2026.
*   **What it is:** Unlike GQA (Grouped Query Attention) which simply shares KV heads, MLA compresses the KV cache into a low-rank latent vector. This allows a 70B model to have a KV cache footprint similar to a 7B model.
*   **2026 Status:** While it requires the model to be trained with it (like DeepSeek V3/V4), the **inference kernels** for MLA are now natively supported in **TensorRT-LLM** and **vLLM**. 
*   **Usability:** If you are an end-user choosing a model for high-throughput serving, selecting an "MLA-native" model is the single biggest "opt-in" choice you can make to cut VRAM costs by 4–7x.

### 3. EAGLE-3 & Speculative Decoding Heads
The industry has moved beyond "Draft Models" (which required loading two models) toward **Speculative Decoding Heads**.
*   **What it is:** **EAGLE-3** (and its predecessor Medusa) adds lightweight "heads" to the top of the LLM. These heads predict the next several tokens in parallel with the base model. The base model then verifies all of them in a single forward pass.
*   **2026 Status:** This has surpassed "Lookahead Decoding" in popularity. It is the default "low-latency" mode in **Llama.cpp** and **MLC-LLM**.
*   **Usability:** End users can download "Speculative Checkpoints" (e.g., Llama-3-7B + EAGLE head) from Hugging Face that provide a 2-3x speedup on consumer GPUs with zero loss in accuracy.

### 4. PowerInfer-2 (Neuron-Cluster Offloading)
This is the modern successor to the hybrid CPU-GPU offloading seen in *Deja Vu*.
*   **What it is:** It exploits the fact that LLM activations are highly "power-law" distributed. Instead of sharding layers, it shards **neuron clusters**. "Hot" neurons (those often activated) stay on the GPU/NPU, while "Cold" neurons stay in RAM/Flash.
*   **2026 Status:** Specifically targeted at **mobile/edge inference** (running 47B models on smartphones). It is the engine behind several "Private AI" mobile apps.
*   **Usability:** Usable for developers deploying to Apple Silicon (M3/M4) or high-end Android NPUs where VRAM is the primary bottleneck.

### 5. TurboQuant & KV-Cache "Sub-bit" Quantization
In 2026, we have moved past simple 4-bit weights to **dynamic KV-cache compression**.
*   **What it is:** **TurboQuant** (Google/ICLR 2026) uses a "PolarQuant" method to rotate data vectors before quantizing. This allows the KV cache to be compressed to **2-bit or 3-bit** with almost zero accuracy loss.
*   **2026 Status:** Built into the **NVIDIA Blackwell (FP4)** stack and increasingly available as a flag in **vLLM** (`--kv-cache-dtype fp8` or `int4`).
*   **Usability:** An "opt-in" flag that effectively doubles the number of concurrent users a single GPU can handle without needing a larger memory pool.

### 6. LayerSkip (Self-Speculative Decoding)
Developed by Meta, this is the most stable "Adaptive Depth" technique.
*   **What it is:** Instead of exiting a model early and hoping for the best (Early Exit), **LayerSkip** uses the early layers to "draft" a token and the later layers to "verify" it within the same model. 
*   **2026 Status:** Included in the official **Meta Llama 3.x/4.x** inference recipes. 
*   **Usability:** Requires a specific "LayerSkip-trained" checkpoint, but once you have it, it provides a 1.5x–2x speedup on standard hardware with no extra memory footprint.

### Summary of "Industry-Present" Opt-ins for 2026:
| Technique | Goal | Best For | Industry Presence |
| :--- | :--- | :--- | :--- |
| **MInference** | Speed up long pre-fills | RAG / Long Context | vLLM, SGLang |
| **MLA** | Shrink KV Cache | High Throughput | DeepSeek, TensorRT-LLM |
| **EAGLE-3** | Reduce Latency | Chat / Low-latency apps | Llama.cpp, vLLM |
| **TurboQuant** | Extreme VRAM saving | Scaling to millions of users | Blackwell / NVIDIA kernels |
| **PowerInfer-2** | Large models on small HW | Local/Edge/Mobile AI | Mobile AI Apps |

# claude-sonnet-4-5-search responded

Based on recent 2026 information, here are the **niche/research-community-specific LLM inference optimization techniques** that are **actually relevant and usable for end users** with some **industry presence**:

## **1. MInference (Dynamic Sparse Attention for Long Contexts)**
**What it is:** Identifies three unique patterns in long-context attention matrices—A-shape, Vertical-Slash, and Block-Sparse—to accelerate pre-filling of long-sequence processing through sparse computation.

**Why it matters in 2026:** Reduces inference latency by up to 10x for pre-filling on an A100 while maintaining accuracy across models including LLaMA-3-1M, GLM-4-1M, Yi-200K, Phi-3-128K, and Qwen2-128K. Can be directly applied to existing LLMs without any modifications to the pre-training setup or additional fine-tuning.

**Industry status:** Code openly available; Recognized in production LLM inference as a mature optimization technique alongside vLLM and TensorRT-LLM.

---

## **2. 2:4 Structured Sparsity (Hardware-Accelerated)**
**What it is:** A sparsity pattern where in each contiguous block of four values, two values must be zero, accelerated by Sparse Tensor Cores on NVIDIA Ampere and newer GPUs.

**Why it matters in 2026:** Combining FP8 precision with 2:4 structured sparsity delivers 1.7X lower latency and 1.5X more queries per second with full accuracy recovery on NVIDIA Hopper GPUs, with high-performance FP8 sparse kernels for vLLM. Can be enabled through post-training pruning with SparseGPT and served via vLLM, achieving up to 1.27× speedup with minimal engineering effort.

**Industry status:** Supported by modern GPUs natively; integrated into vLLM with custom CUTLASS kernels; production-ready.

---

## **3. ShortGPT / Layer Dropping (Structured Layer Pruning)**
**What it is:** Simple layer removal approach that demonstrates superior performance over previous pruning methods and is orthogonal to quantization, enabling further reduction.

**Why it matters in 2026:** Research shows active development but **caution needed**: While performance degrades gradually on short reasoning tasks like MMLU, performance collapses on tasks requiring long reasoning chains after pruning even a single layer. Recent work focuses on addressing these limitations.

**Industry status:** Research-stage with multiple variants (TrimLLM, ShortGPT); Block removal is attractive due to substantial gains in inference speed and memory efficiency, but not yet widely integrated into mainstream inference engines like vLLM/TensorRT-LLM for general use.

---

## **4. TrimLLM (Progressive Layer Dropping for Domain-Specific Models)**
**What it is:** Progressive layer dropping during domain-specific fine-tuning that demonstrates 2.1-5.7× inference speedup on consumer GPUs and up to 3.1× speedup on A100 with no loss in accuracy at 50-60% compression ratio.

**Why it matters in 2026:** Unlike many PTQ techniques that depend on availability of efficient kernels and vendor-specific hardware support, practical implementations often slow down inference on consumer-level hardware; TrimLLM addresses this.

**Industry status:** Research-stage; best suited for specialized domains (medical, legal, financial) where task-specific adaptation makes it practical.

---

## **Key Takeaway for End Users in 2026:**

**Production-ready today:**
- **MInference** for long-context workloads (million+ token contexts)
- **2:4 structured sparsity** with vLLM on NVIDIA Ampere/Hopper GPUs (especially combined with FP8)

**Research-stage but promising:**
- **Layer dropping/pruning** techniques are advancing rapidly but remain in the pruning/sparsity exploitation phase rather than mainstream inference engine integration
- Best used when you control the model training/fine-tuning pipeline and can validate task-specific performance

**Not recommended:** Static layer pruning methods without considering reasoning complexity, as they degrade dramatically on complex reasoning tasks.

The shift in 2026 is clear: Efficiency as the primary design goal, with cost per inference rather than parameter count determining competitive advantage.

# you asked

Expand gemini-3-flash-grounding result with more result at and gaining maturity.

# grok-4.20-multi-agent-beta-0309 responded

**In 2026, the gap between academic "selective computation" research and production end-user inference has largely closed.** Techniques inspired by Deja Vu (input-dependent activation sparsity, head/MLP pruning, layer skipping, and dynamic KV selection) are now available as practical opt-in features in mature runtimes.

Core infrastructure like **FlashAttention-3**, **PagedAttention**, **vLLM**, **SGLang**, **TensorRT-LLM**, **FlashInfer**, **llama.cpp**, and **Hugging Face Transformers** routinely expose these as flags, model checkpoints, or kernel options. Many require only downloading specific checkpoints from Hugging Face or toggling a serving parameter—no retraining needed for the end user.

Here is an expanded, updated list of the most relevant, non-outdated techniques with clear industry presence (vLLM, SGLang, TensorRT-LLM, mobile/edge frameworks, major model families like DeepSeek/Llama). All emphasize **selective/input-dependent computation** rather than uniform dense execution.

### 1. Dynamic Sparsity & Sparse Prefilling (MInference + FlashInfer Patterns)
MInference identifies predictable sparse patterns in long-context attention (A-shape, vertical-slash, block-sparse). An offline calibration pass per model determines per-head patterns; custom kernels skip irrelevant computation.

**2026 Status:** Fully integrated as an opt-in in **vLLM**, **SGLang**, and via **FlashInfer** kernels (which also support block-sparse KV formats and JIT compilation). Extended to multi-modal and 1M+ token contexts. Delivers order-of-magnitude prefill speedups (e.g., minutes down to seconds on H100/A100-class hardware).

**Usability:** Ideal for RAG or agentic workflows with massive contexts. Enable via serving flags; works with standard models after lightweight calibration.

### 2. Multi-head Latent Attention (MLA) + Native Sparse Attention
DeepSeek’s MLA compresses the KV cache into a low-rank latent vector instead of storing full per-head keys/values. Many 2025–2026 models ship with it natively (or convertible via MHA→MLA tools).

**2026 Status:** Native kernels in **TensorRT-LLM**, **vLLM**, and **FlashInfer**. DeepSeek-V3/V4 family and derivatives (widely used) combine MLA with sparse attention patterns. Provides massive effective KV reduction.

**Usability:** Choose an MLA-native model from Hugging Face for high-throughput serving or long-context on limited VRAM. Single biggest architectural opt-in for 4–10× effective KV cache savings with negligible quality loss.

### 3. EAGLE-3 & Speculative Decoding Heads
Lightweight prediction heads (or multi-layer feature fusion in EAGLE-3) draft multiple tokens in parallel; the base model verifies them in one pass. Moves beyond separate draft models.

**2026 Status:** Dominant low-latency mode. Deep integration in **vLLM** (via official Speculators library with CUDA graphs and metrics), **SGLang** (SpecForge training/support), **TensorRT-LLM**, and progressing in **llama.cpp**/**MLC-LLM**. Pre-trained checkpoints widely available on HF. Consistently 2–3× (sometimes higher) speedups. Surpassed earlier methods like Medusa/Lookahead in adoption.

**Usability:** Download EAGLE-3 augmented checkpoints (e.g., for Llama-3.1/4 or Qwen2.5). Enable with a single flag in supported engines. Zero accuracy loss when properly tuned.

### 4. PowerInfer-2 (Neuron-Cluster / Activation-Sparse Offloading)
Exploits power-law activation sparsity: “hot” neurons stay on GPU/NPU/Apple Silicon; “cold” ones are dynamically loaded from RAM/Flash. Polymorphic engine adapts for prefill vs. decode.

**2026 Status:** Mature for edge/mobile. Runs 47B+ (including MoE) models on smartphones at ~11–12 tokens/s. Used in multiple private/on-device AI apps and frameworks targeting M-series chips or high-end Android NPUs. Successor techniques build directly on its locality insights.

**Usability:** Best for local/consumer hardware where VRAM is the limiter. Deploy via the PowerInfer runtime or integrated mobile SDKs.

### 5. Advanced KV-Cache Compression (TurboQuant-style + NexusQuant / Sub-bit + Sparsity)
Beyond basic 4-bit weights, dynamic/polar rotation + lattice quantization (or combined sparsity) compresses KV to 2–4 bits or higher ratios with predictive coding.

**2026 Status:** Standard in **NVIDIA Blackwell** stacks, **vLLM** (`--kv-cache-dtype` flags supporting FP8/INT4 + sparsity), and libraries like NexusQuant (training-free, one-liner, up to 7× compression reported). Combined with pattern-aware eviction in production serving.

**Usability:** Simple opt-in flag or library call that roughly doubles concurrent users or context length on the same hardware. Minimal accuracy impact.

### 6. LayerSkip (Self-Speculative Decoding + Adaptive Depth)
Training recipe (layer dropout with higher rates on later layers + shared exit loss) makes early-exit reliable. Early layers draft; later layers verify within the *same* model (no extra memory for a separate drafter).

**2026 Status:** Integrated into **Hugging Face Transformers**, official Meta Llama inference recipes, and cited in 2025–2026 edge inference surveys. Provides stable 1.5–2× speedups as a practical self-speculative baseline. Complemented by newer training-free variants.

**Usability:** Use LayerSkip-trained or compatible checkpoints. Enable early-exit or self-speculative modes in supported runtimes. Excellent for latency-sensitive chat without extra VRAM.

### 7. H₂O (Heavy-Hitter Oracle) & SnapKV-style Adaptive KV Pruning
Observation that attention is extremely skewed: a small fraction of tokens (“heavy hitters”) dominate cumulative attention scores. Dynamically retain recent tokens + top heavy hitters; evict the rest. Variants like SnapKV use importance scoring during prefill.

**2026 Status:** Shipped as an opt-in in **vLLM**, **Text Generation Inference (TGI)**, and related serving stacks. Reduces KV cache size by 4–5× (or more) with <1–2% quality drop on long-context benchmarks. Combined with CPU-GPU selective prefetch (e.g., InfiniGen-style) in edge surveys. Strong production adoption for RAG/long-generation.

**Usability:** Enable via serving configuration for long-context workloads. Pairs excellently with MLA or quantized KV.

### 8. Polar Sparsity & Selective Head Attention (Contextual Sparsity at Scale)
Shifts focus from vanishing MLP activation sparsity (in batched/high-sequence-length regimes) to stable, batch-invariant **attention head sparsity**. Uses hardware-efficient sparsity-aware kernels.

**2026 Status:** NeurIPS 2025 work that has moved into practical kernels (via FlashInfer lineage or custom integrations). Demonstrates up to 2.2× end-to-end speedups on Llama, Qwen, Mistral, etc., across batch sizes without accuracy loss. Part of the broader 2025–2026 sparsity workshop momentum now reaching high-throughput serving.

**Usability:** Opt-in via updated inference engines supporting sparse attention kernels. Particularly valuable for batched enterprise serving where traditional activation sparsity breaks down.

### 9. CHESS (Channel-wise Thresholding & Selective Activation Sparsity)
Improves on earlier activation sparsity by assigning per-channel thresholds in FFN layers and selectively sparsifying based on downstream impact rather than just magnitude statistics. Directly in the Deja Vu/PowerInfer family.

**2026 Status:** Featured in 2026 “Awesome LLM Inference” trackers and sparsity workshops. Kernels and integrations have matured alongside PowerInfer-style runtimes and structured sparsity support in vLLM/TensorRT-LLM. Practical for MLP-bound decode phases.

**Usability:** Available through specialized inference engines or by using compatible sparse checkpoints. Low overhead opt-in for additional decode acceleration on consumer or datacenter GPUs.

### Summary of Industry-Present Opt-ins for 2026 (Selective Computation Focus)

| Technique                  | Goal                          | Best For                        | Industry Presence                          |
|----------------------------|-------------------------------|---------------------------------|--------------------------------------------|
| MInference + FlashInfer   | Long prefill acceleration    | RAG / 100k–1M+ context         | vLLM, SGLang, FlashInfer kernels          |
| MLA + Native Sparse Attn  | KV cache compression         | High-throughput / long context | DeepSeek models, TensorRT-LLM, vLLM       |
| EAGLE-3 Speculative Heads | Latency & throughput         | Chat, interactive, low-latency | vLLM (Speculators), SGLang, HF checkpoints|
| PowerInfer-2              | Large models on edge         | Mobile / on-device / Apple Silicon | Private AI apps, mobile SDKs             |
| Advanced KV Quant + Sparsity | Extreme memory savings     | Scaling users/context          | vLLM flags, NexusQuant, Blackwell         |
| LayerSkip                 | Adaptive depth / self-spec   | Balanced latency/memory        | HF Transformers, Meta Llama recipes       |
| H₂O / SnapKV Adaptive KV  | Selective KV retention       | Long-context memory reduction  | vLLM, TGI                                  |
| Polar Sparsity / Sel. Head| Batched contextual sparsity  | High-throughput serving        | Emerging in vLLM/SGLang kernels (2025–26) |
| CHESS Activation Sparsity | Better FFN/MLP sparsity      | Decode-phase acceleration      | PowerInfer lineage, sparsity toolkits     |

**Practical advice for end users in 2026:** Start with model choice (MLA-native or EAGLE-3 augmented checkpoints), then enable runtime flags in vLLM/SGLang (sparse kernels, H2O eviction, speculative decoding). For local/edge, PowerInfer-2 or llama.cpp with speculative + sparsity extensions deliver the biggest gains. These techniques compound well (e.g., MLA + H2O + EAGLE-3). Track FlashInfer updates and the evolving “Awesome-LLM-Inference” resources, as new kernel support frequently makes previously academic methods into one-line opt-ins.

Most remain “opt-in” because they need either specific model artifacts or custom kernels, but the ecosystem has matured enough that they are reliable, low-risk additions for anyone already running local or self-hosted inference.

# claude-sonnet-4-5-search responded

## Expanded: Industry-Present LLM Inference Optimizations for 2026

In 2026, the gap between "academic research" and "production inference" has closed significantly. While techniques like **FlashAttention** and **PagedAttention** (vLLM) are now standard infrastructure, several "niche" methods have matured into usable, opt-in tools for end users who need to squeeze extra performance out of consumer or enterprise hardware.

Here are the most relevant, industry-present LLM inference optimizations for 2026 that follow the "selective computation" philosophy of *Deja Vu*.

---

### **Core Infrastructure-Level Optimizations**

### 1. Dynamic Sparsity & Sparse Prefilling (MInference 1.0)
If *Deja Vu* focuses on activation sparsity, **MInference** (Million-token Inference) focuses on **Attention Sparsity** during the pre-fill stage. 
*   **What it is:** It identifies that long-context attention matrices follow specific patterns (A-shape, Vertical-Slash, and Block-Sparse). It uses an offline pass to determine which heads follow which pattern and then uses custom GPU kernels to compute only those sparse indices.
*   **2026 Status:** Integrated as an opt-in for long-context models (1M+ tokens) in frameworks like **vLLM** and **SGLang**. It reduces A100/H100 pre-fill times for 1M tokens from 30 minutes to ~3 minutes.
*   **Usability:** Highly usable for RAG (Retrieval-Augmented Generation) users who often have massive context but limited time.

### 2. RadixAttention & Automatic Prefix Caching (SGLang)
SGLang uses RadixAttention for automatic KV cache reuse, achieving up to 6x higher throughput than alternatives, and powers large-scale production deployments, generating trillions of tokens each day across more than 400,000 GPUs worldwide.
*   **What it is:** RadixAttention enables the automatic reuse of the KV cache across multiple generation calls by maintaining an LRU cache of the KV cache for all requests within a radix tree for efficient matching, insertion, and eviction. RadixAttention caches KV activations in a radix tree and reuses them across requests with shared prefixes, delivering significant TTFT reductions on workloads with 60%+ prefix overlap.
*   **2026 Status:** The current version is v0.5.8, released January 2026. Contributors associated with the project formed the startup RadixArk to commercialize services around SGLang while continuing its open-source development. Enable-prefix-caching provides free performance for shared system prompts with no downside.
*   **Usability:** SGLang is worth choosing when your workload has shared prefixes: multi-turn conversations, agents with shared tool definitions, RAG pipelines that reuse the same context documents. Cache hit rates reach 85-95% for few-shot learning and 75-90% for multi-turn chat compared to vLLM's 15-25% and 10-20% respectively.

### 3. Multi-head Latent Attention (MLA)
Originally a research breakthrough from DeepSeek, **MLA** has become the "architectural endgame" for KV-cache efficiency in 2026.
*   **What it is:** Unlike GQA (Grouped Query Attention) which simply shares KV heads, MLA compresses the KV cache into a low-rank latent vector. This allows a 70B model to have a KV cache footprint similar to a 7B model.
*   **2026 Status:** While it requires the model to be trained with it (like DeepSeek V3/V4), the **inference kernels** for MLA are now natively supported in **TensorRT-LLM** and **vLLM**. 
*   **Usability:** If you are an end-user choosing a model for high-throughput serving, selecting an "MLA-native" model is the single biggest "opt-in" choice you can make to cut VRAM costs by 4–7x.

---

### **Speculative & Dynamic Computation**

### 4. EAGLE-3 & Speculative Decoding Heads
The industry has moved beyond "Draft Models" (which required loading two models) toward **Speculative Decoding Heads**.
*   **What it is:** **EAGLE-3** (and its predecessor Medusa) adds lightweight "heads" to the top of the LLM. These heads predict the next several tokens in parallel with the base model. The base model then verifies all of them in a single forward pass.
*   **2026 Status:** This has surpassed "Lookahead Decoding" in popularity. It is the default "low-latency" mode in **Llama.cpp** and **MLC-LLM**.
*   **Usability:** End users can download "Speculative Checkpoints" (e.g., Llama-3-7B + EAGLE head) from Hugging Face that provide a 2-3x speedup on consumer GPUs with zero loss in accuracy.

### 5. LayerSkip (Self-Speculative Decoding)
Developed by Meta, this is the most stable "Adaptive Depth" technique.
*   **What it is:** Instead of exiting a model early and hoping for the best (Early Exit), **LayerSkip** uses the early layers to "draft" a token and the later layers to "verify" it within the same model. 
*   **2026 Status:** Included in the official **Meta Llama 3.x/4.x** inference recipes. 
*   **Usability:** Requires a specific "LayerSkip-trained" checkpoint, but once you have it, it provides a 1.5x–2x speedup on standard hardware with no extra memory footprint.

### 6. Mixture-of-Depths (MoD)
Published on April 21, 2026, MoD is gaining traction as a production-grade transformer efficiency technique.
*   **What it is:** MoD emphasizes how individual tokens pass through different numbers of layers, or blocks, through the depth of the transformer. MoD allows the model to dynamically decide, on a per-token basis, which layers are worth executing and which should be skipped, with a router selecting a subset of tokens (top-k) to be processed by a specific block while the rest bypass it via a residual connection. MoD can achieve training loss parity with an isoFLOP optimal vanilla transformer but uses a fraction of the FLOPs (upwards of 50%) per forward pass.
*   **2026 Status:** MoD can reduce total FLOPs per forward pass by up to 50% without a proportional loss in perplexity, though implementing it requires custom routing logic and careful handling of the top-k operation with Triton/CUDA kernels. p-MoD matches or even outperforms baseline models with only 55.6% TFLOPs and 53.8% KV cache storage during inference. γ-MoD can reduce training and inference time of LLaVA-HR by 31.0% and 53.2% respectively with only a -1.5% performance drop.
*   **Usability:** Still gaining maturity—custom implementations exist in research repos. Most effective for workloads with variable token importance (reasoning chains, code generation). Requires models trained with MoD routers.

---

### **Memory & Quantization Techniques**

### 7. TurboQuant & KV-Cache "Sub-bit" Quantization
In 2026, we have moved past simple 4-bit weights to **dynamic KV-cache compression**.
*   **What it is:** **TurboQuant** (Google/ICLR 2026) uses a "PolarQuant" method to rotate data vectors before quantizing. This allows the KV cache to be compressed to **2-bit or 3-bit** with almost zero accuracy loss.
*   **2026 Status:** Built into the **NVIDIA Blackwell (FP4)** stack and increasingly available as a flag in **vLLM** (`--kv-cache-dtype fp8` or `int4`).
*   **Usability:** kv-cache-dtype fp8 quantizes KV cache values, reducing memory with negligible quality impact. An "opt-in" flag that effectively doubles the number of concurrent users a single GPU can handle without needing a larger memory pool.

### 8. Quest (Query-Aware KV Cache Sparsity)
Quest can achieve up to 7.03× self-attention speedup, which reduces inference latency by 2.23× while performing well on tasks with long dependencies with negligible accuracy loss.
*   **What it is:** Quest keeps track of the minimal and maximal Key values in KV cache pages and estimates the criticality of a given page using Query vectors, then only loads the Top-K critical KV cache pages for attention to significantly speed up self-attention without sacrificing accuracy. The criticality of a token highly depends on the query, so Quest uses query-aware token criticality estimation.
*   **2026 Status:** Available as open-source from MIT Han Lab. Works as a drop-in replacement for standard attention in long-context scenarios (32K–1M tokens).
*   **Usability:** With sequence length 32K, token budget 2048, and 4-bit weight quantization, Quest speeds up end-to-end inference by 2.23×. Best for applications with extremely long contexts where most tokens are not critical for every query.

### 9. PowerInfer-2 (Neuron-Cluster Offloading)
This is the modern successor to the hybrid CPU-GPU offloading seen in *Deja Vu*.
*   **What it is:** It exploits the fact that LLM activations are highly "power-law" distributed. Instead of sharding layers, it shards **neuron clusters**. "Hot" neurons (those often activated) stay on the GPU/NPU, while "Cold" neurons stay in RAM/Flash.
*   **2026 Status:** Specifically targeted at **mobile/edge inference** (running 47B models on smartphones). It is the engine behind several "Private AI" mobile apps.
*   **Usability:** Usable for developers deploying to Apple Silicon (M3/M4) or high-end Android NPUs where VRAM is the primary bottleneck.

---

### **Distributed Inference & Parallelism**

### 10. Disaggregated Inference (Prefill/Decode Separation)
Disaggregated Inference (DI), also known as disaggregated serving or P/D disaggregation, is an LLM serving architecture that separates the prefill and decode phases of inference onto different hardware resources.
*   **What it is:** The prefill phase processes user input to generate the first output token and is compute-bound, while the decode phase generates subsequent tokens and is memory-bound—co-locating these phases on the same GPU leads to inefficient resource use. Low tensor parallelism can be used in the prefill phase to reduce communication overhead, while high tensor parallelism can improve memory operations in the decode phase, enabling more efficient resource allocation and better control over SLOs.
*   **2026 Status:** NVIDIA Dynamo supports all major LLM frameworks including TensorRT-LLM, vLLM, and SGLang, incorporating disaggregated serving which separates the different phases of inference onto distinct GPU devices to boost inference performance. Meta is moving towards N-D parallelism (CP, PP, EP, TP across nodes, with separate DP) and disaggregating prefill and decoding tiers, allowing for better resource balancing and the potential to use heterogeneous hardware.
*   **Usability:** Removing prefill interruptions to decode from continuous batching reduces inter token latency (ITL), with gains used to achieve higher throughput by running with a higher decode batch size while staying under SLOs. Best for high-throughput production serving where TTFT and ITL have different SLOs.

### 11. TPLA (Tensor-Parallel Latent Attention)
TPLA partitions both the latent representation and each head's input dimension across devices, performs attention independently per shard, and then combines results with an all-reduce, preserving the benefits of a compressed KV cache while unlocking TP efficiency.
*   **What it is:** MLA compresses key-value states into a low-rank latent vector, but in tensor parallelism attention heads are computed across multiple devices and each device must load the full cache, eroding the advantage of MLA over GQA. TPLA solves this problem for multi-node deployments.
*   **2026 Status:** TPLA is drop-in compatible with models pre-trained using MLA, supporting MLA-style prefilling and enabling efficient tensor-parallel decoding without retraining. Available in research implementations targeting DeepSeek-V2/V3 multi-GPU deployments.
*   **Usability:** Critical for anyone running MLA-based models (DeepSeek family) across multiple GPUs with tensor parallelism. Maintains MLA's memory savings while enabling efficient distributed inference.

---

### **Summary Table: Industry-Present Opt-ins for 2026**

| Technique | Goal | Best For | Industry Presence | Maturity |
| :--- | :--- | :--- | :--- | :--- |
| **MInference** | Speed up long pre-fills | RAG / Long Context | vLLM, SGLang | Production |
| **RadixAttention** | Auto prefix cache reuse | Multi-turn chat, Few-shot | SGLang (400K+ GPUs) | Production |
| **MLA** | Shrink KV Cache 4-7x | High Throughput | DeepSeek, TensorRT-LLM | Production |
| **EAGLE-3** | Reduce Latency 2-3x | Chat / Low-latency apps | Llama.cpp, vLLM | Production |
| **LayerSkip** | Self-speculative decode | General inference | Meta Llama 3.x/4.x | Production |
| **MoD** | Dynamic layer skipping | Variable-importance tokens | Research → Early Prod | Gaining Maturity |
| **TurboQuant** | Extreme VRAM saving | Scaling to millions of users | Blackwell / NVIDIA kernels | Production |
| **Quest** | Query-aware KV sparsity | Ultra-long context (32K+) | MIT Han Lab (OSS) | Production-Ready |
| **PowerInfer-2** | Large models on small HW | Local/Edge/Mobile AI | Mobile AI Apps | Production |
| **Disaggregated Inference** | Separate prefill/decode | High-throughput serving | NVIDIA Dynamo, Meta, AWS | Production |
| **TPLA** | TP-efficient MLA | Multi-GPU MLA models | DeepSeek distributed | Gaining Maturity |

### **Key Trends for 2026:**
1. **From Static to Dynamic**: Models now adjust computation per-token (MoD, Quest, LayerSkip) rather than uniform processing.
2. **Cache Intelligence**: RadixAttention and Quest represent a new generation of "smart caching" that understands workload patterns.
3. **Architecture-Inference Co-design**: MLA and TPLA show how training-time architecture choices now directly optimize inference.
4. **Disaggregation as Standard**: The industry is moving towards N-D parallelism and disaggregating prefill and decoding tiers, separating concerns for better hardware utilization.
5. **Production Readiness**: Techniques once limited to papers (speculative decoding, prefix caching, KV quantization) are now default flags in vLLM, SGLang, and TensorRT-LLM.