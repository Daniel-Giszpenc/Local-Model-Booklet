These are the primary tools most users interact with. They sit above the GPU compute kernels and below the OS.

### llama.cpp

The main goal of llama.cpp is to enable LLM inference with minimal setup and state-of-the-art performance on a wide range of hardware — locally and in the cloud. It supports 1.5-bit through 8-bit integer quantization for faster inference and reduced memory use, with custom CUDA kernels for NVIDIA GPUs and support for AMD GPUs via HIP.

llama.cpp is capable of automatically detecting your hardware including CPU features and available GPU(s), and configures optimal execution paths using SIMD instructions and GPU kernels. The engine automatically selects the best quantization kernels for your processor, determines how many layers to offload to GPU if available, and configures memory mapping.

The project uses the GGUF model format, which stores weights, tokenizer, and metadata in a single portable file. The built-in `llama-server` exposes an OpenAI-compatible HTTP API. It supports ARM NEON, AVX/AVX2/AVX512 for CPUs, and CUDA, ROCm/HIP, Metal (Apple Silicon), Vulkan, and SYCL (Intel) for GPUs.

Before llama.cpp, running models like LLaMA locally required bespoke GPU kernels or memory-hungry Python environments. llama.cpp's C++ design eliminates Python overhead and simplifies cross-platform builds.

Where it underperforms: high-concurrency multi-user serving. llama.cpp's HTTP server (llama-server) handles concurrent requests, but it processes them serially through a single model instance by default. It does not implement continuous batching with PagedAttention-style memory management. Under concurrent load, requests queue rather than being interleaved at the token level. For a single user or a small team this is invisible; for a service with 50+ concurrent users it becomes a throughput ceiling.

Hardware note: CPU speed matters little in GPU-bound workloads: differences between modern CPUs yield less than 5% performance variance during GPU inference. Memory bandwidth is the dominant variable.

References: [llama.cpp GitHub](https://github.com/ggml-org/llama.cpp) | [GGUF format spec](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md)

### vLLM (PagedAttention)

vLLM was introduced in a 2023 paper centered on the PagedAttention algorithm, which applies the concept of virtual memory paging from operating systems to manage GPU memory for LLM inference.

Instead of allocating one large contiguous block of GPU memory per request (which wastes 60–80% of capacity), PagedAttention breaks the KV cache into small, fixed-size blocks that can be stored anywhere in GPU memory. Each sequence grows its cache block by block, on demand. When a request finishes, its blocks are immediately freed for reuse. The result: GPU memory waste drops from 60–80% to under 4%, and vLLM can serve significantly more concurrent requests on the same hardware.

vLLM introduces continuous batching for the dynamic distribution of tasks, improving resource management and efficiency in environments with variable workloads. It also uses speculative decoding to predict and validate future tokens in parallel.

What it does best: multi-user production serving with diverse model types across diverse hardware. The broadest model support matrix of any open-source inference server — encoder-decoder models, vision-language models, embedding models, TPUs, Trainium, Gaudi, and AMD ROCm in addition to NVIDIA. vLLM has a larger community, more tutorials, deeper Stack Overflow coverage, and more battle-tested Kubernetes operators. When something breaks at 3 AM, the odds of finding a solution are higher.

Where it underperforms: workloads dominated by prefix reuse (long system prompts, RAG, multi-turn). PagedAttention manages memory in fixed-size blocks, eliminating internal fragmentation. But PagedAttention lacks SGLang's automatic radix-tree-based prefix reuse. On prefix-heavy traffic, vLLM recomputes KV cache for shared prefixes on every request, while SGLang would reuse it.

Hardware note: vLLM's architecture handles heterogeneous GPU clusters better than SGLang because it maintains a broad compatibility layer rather than co-designing kernels for specific hardware assumptions.

References: [vLLM GitHub](https://github.com/vllm-project/vllm) |  [vLLM documentation](https://docs.vllm.ai) |  [PagedAttention paper (arxiv)](https://arxiv.org/abs/2309.06180)

### SGLang (RadixAttention)

SGLang followed with RadixAttention, a mechanism that maintains an LRU cache of KV computations in a radix tree that automatically discovers and reuses shared prefixes across requests. Where PagedAttention manages memory in fixed blocks, RadixAttention manages content in a tree — reusing computation across requests that share long common prefixes, which is the dominant pattern in multi-turn chat, RAG, and agentic workloads.

SGLang delivers 29% higher throughput than vLLM on H100s and up to 6.4x gains on prefix-heavy workloads like RAG and multi-turn chat.

What it does best: multi-turn conversation, agent loops with tool calling, RAG with long repeated system prompts, and structured output generation (JSON schemas, regex-constrained decoding). RadixAttention maintains an LRU cache of KV computations in a radix tree that automatically discovers and reuses shared prefixes across requests. SGLang delivers 29% higher throughput than vLLM on H100s and up to 6.4x gains on prefix-heavy workloads like RAG and multi-turn chat.

Where it underperforms: batch inference of completely unique prompts (no shared prefixes means RadixAttention provides no advantage), hardware environments outside of well-supported NVIDIA configurations, and encoder-decoder architectures.

Hardware note: SGLang and LMDeploy co-design their attention mechanisms with kernel assumptions, which means they can reach higher peak throughput on specifically supported hardware but degrade more on unsupported configurations.

References: [SGLang GitHub](https://github.com/sgl-project/sglang) | [SGLang paper (arxiv)](https://arxiv.org/abs/2312.07104)

### LMDeploy

LMDeploy achieves high throughput via TurboMind, a custom C++ backend that eliminates Python overhead entirely. It is strongest for batch offline inference and production deployments where maximum tokens-per-second per dollar is the metric, latency variability is acceptable, and the model family is within its compatibility matrix (primarily Llama, Qwen, and InternLM families). It has first-class quantization support for AWQ and GPTQ and tends to be the choice for teams running these models on Chinese-ecosystem hardware (including Ascend NPUs).

Where it underperforms: model diversity (narrower support than vLLM), community support and documentation, and structured generation workflows.

References: [LMDeploy GitHub](https://github.com/InternLM/lmdeploy)

### Comparison table

| Server | Peak tokens/sec (H100) | Best use case | Worst use case |
|---|---|---|---|
| llama.cpp | varies (CPU-first) | Single user, consumer GPU, Apple Silicon | High concurrency multi-user |
| vLLM | ~12,500 | Diverse hardware, diverse models, production ops | Prefix-heavy multi-turn |
| SGLang | ~16,200 | RAG, agents, multi-turn, structured output | Unique-prompt batch jobs |
| LMDeploy | ~16,200 | Offline batch throughput, Qwen/Llama families | Model diversity, structured gen |


## Extra Inference Servers
---
### TensorRT-LLM
**What:** NVIDIA's optimized inference SDK. Compiles models into static execution engines.
**Why:** Fastest absolute throughput and lowest latency for single-model, high-concurrency serving. H200 shows +90% throughput gains over H100 for certain models.
**How:** Requires engine compilation per model (28 minutes). Deploy via Triton Inference Server backend.
**Best for:** Sustained high-traffic serving of a fixed model on H100/B200/H200 where compilation cost amortizes over millions of requests.
**Weaknesses:** Compilation time; poor flexibility for multi-model or dynamic batching; vendor lock-in to NVIDIA. citeweb_search:1#0web_search:1#2

### HuggingFace TGI
**What:** The server that popularized OpenAI-compatible APIs for HuggingFace models.
**Why:** Historically excellent HuggingFace integration and ease of use.
**How:** Simple container launch.
**Best for:** Existing deployments only.
**Weaknesses:** **Maintenance mode since December 11, 2025.** No new features. Achieved 68-74% GPU utilization vs vLLM's 85-92%. Migrate to vLLM or SGLang. citeweb_search:1#2

### Aphrodite Engine
**What:** Community inference server with extremely broad quantization support (FP2 through FP12, AWQ, GPTQ, GGUF, and 10+ more formats).
**Why:** Unique format support; KoboldAI compatibility.
**How:** AGPL-3.0 license (copyleft concern for some organizations).
**Best for:** Niche quantization requirements or KoboldAI integration. citeweb_search:1#2

### MLC-LLM
**What:** Apache 2.0 server with tensor parallelism and broad quantization.
**Why:** Good cross-platform support including mobile/edge.
**How:** OpenAI-compatible API.
**Best for:** Edge and mobile deployment where TVM compilation is acceptable.
**Weaknesses:** No prefix caching as of early 2026. citeweb_search:1#2

## Hardware Variable Summary
---
- **NVIDIA H100/H200/B200:** TensorRT-LLM > SGLang > vLLM > LMDeploy. llama.cpp works but wastes the hardware.
- **Consumer RTX (24-48GB):** vLLM or SGLang for multi-user; llama.cpp/Ollama for single-user or quantized 70B+.
- **AMD ROCm:** All options lag CUDA by 6-12 months. llama.cpp with ROCm is the most stable. vLLM has experimental ROCm support.
- **Apple Silicon:** MLX is the native optimized choice (not listed in server comparisons but dominant on Mac).
- **CPU-only:** llama.cpp with OpenVINO (Intel) or pure GGML. Expect 10-30 tok/s for small models, <1 req/s concurrent. citeweb_search:1#2web_search:1#9

