
## Links

### to use for reference but not include in writing


### to include in page
casey and ai expert: https://www.youtube.com/watch?v=Sp1EmFRDquA

llm wiki idea: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f

what to do with all this
https://www.dbreunig.com/2026/05/04/10-lessons-for-agentic-coding.html
https://www.dbreunig.com/2024/02/01/pursuing-quiet-ai.html
https://steipete.me/posts/2025/shipping-at-inference-speed

prediction/observation
https://www.dbreunig.com/2026/03/26/winchester-mystery-house.html

approach
https://mariozechner.at/posts/2026-03-25-thoughts-on-slowing-the-fuck-down/

tooling
https://eugeneyan.com/writing/working-with-ai/
https://www.dbreunig.com/2024/10/18/the-3-ai-use-cases-gods-interns-and-cogs.html#cogs

https://buttondown.com/ultradune/archive/eval-008-nvidia-just-open-sourced-an-inference/
> The inference stack is being decomposed. A year ago, you picked one engine and it handled everything. Now we have specialized layers — execution engines (vLLM, SGLang, TGI), orchestration frameworks (Dynamo), structured generation engines (XGrammar), and quantization toolchains (TorchAO). Each layer is independently optimizable.

I need to look into: XGrammar + jump-forward decoding


https://read.theaimerge.com/p/the-smartest-ai-engineers-will-bet
> Across the industry, only a small number of teams have managed to move beyond pilots and demos. And when systems fail, it’s rarely because of the model itself. It’s the engineering around the model: how systems are designed, monitored, tested, and improved over time. These are the same problems software teams have always faced, but made harder this time, due to the non-deterministic behavior of AI Systems.




https://jarvislabs.ai/blog/expert-parallelism-mixed-strategies-vllm

https://read.theaimerge.com/p/understanding-llm-inference

https://www.vectara.com/glossary-of-llm-terms

https://huggingface.co/collections/nityan/mustread-papers

https://blog.ngxson.com/easier-to-understand-what-is-transformer

https://www.mercity.ai/blog-post/guide-to-fine-tuning-llms-with-lora-and-qlora/

https://rajatpandit.com/ai-infrastructure/the-integer-moment/

https://rajatpandit.com/insights/

https://huggingface.co/docs/transformers/en/kv_cache

tools and projects
https://github.com/Tiiny-AI/PowerInfer
https://github.com/microsoft/LLMLingua

neat summary on mini max model insights
https://www.linkedin.com/posts/sebastianraschka_the-minimax-m2-series-was-one-of-the-most-share-7465419259985174529-p3ub/

[ArXiv In-depth Analysis – Medium](https://medium.com/@jenray1986?source=post_page---post_author_info--0f01b3a2d544---------------------------------------)

[xlite-dev/Awesome-LLM-Inference: 📚A curated list of Awesome LLM/VLM Inference Papers with Codes: Flash-Attention, Paged-Attention, WINT8/4, Parallelism, etc.🎉](https://github.com/xlite-dev/Awesome-LLM-Inference)

[chenhongyu2048/LLM-inference-optimization-paper: Summary of some awesome work for optimizing LLM inference](https://github.com/chenhongyu2048/LLM-inference-optimization-paper)

## need to try bringing these in
[Compare `ik_llama.cpp`, `vLLM`, `llama.cpp`, and `ktransformers` engines · Issue #11 · ubergarm/r1-ktransformers-guide](https://github.com/ubergarm/r1-ktransformers-guide/issues/11)

https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices
https://newsletter.pragmaticengineer.com/p/what-is-inference-engineering
https://github.com/ikawrakow/ik_llama.cpp/blob/main/docs/parameters.md

nice overview, not sure where to put
https://www.weka.io/learn/guide/ai-ml/what-is-llm/
https://www.clarifai.com/blog/llm-model-architecture/
https://huggingface.co/blog/dvilasuero/choosing-best-open-source-ai-models
https://medium.com/@sahin.samia/llm-inference-optimization-techniques-a-comprehensive-analysis-1c434e85ba7c

THIS
https://read.theaimerge.com/p/understanding-llm-optimization-techniques

should see if I want to add these in
https://read.theaimerge.com/p/the-ai-engineers-guide-to-inference
https://read.theaimerge.com/p/understanding-llm-inference
https://jarvislabs.ai/blog/vllm-sglang-trtllm-comparison
https://buttondown.com/ultradune/archive/eval-007-the-great-moe-shift-how-mixture-of/
https://bhavishyapandit9.substack.com/p/deep-dive-into-quantization-of-llms
https://www.clarifai.com/blog/llm-inference-optimization/

https://medium.com/@jsshankar/demystifying-production-inference-serving-for-large-language-models-in-2026-7cfeea701b53

#### I want to make a section on link dump for tech depths at some point
[What I Wish Someone Had Told Me About Tensor Computation Libraries | George Ho](https://www.georgeho.org/tensor-computation-libraries/)
[What's a Tensor? - YouTube](https://www.youtube.com/watch?v=f5liqUk0ZTw)
[Understanding ATen: PyTorch's tensor library | Red Hat Developer](https://developers.redhat.com/articles/2026/02/19/understanding-aten-pytorchs-tensor-library#core_architecture_components)
[ggml/docs/gguf.md at master · ggml-org/ggml](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md)

[GGML Deep Dive I: Environment Setup | xsxszab.github.io](https://xsxszab.github.io/posts/ggml-deep-dive-i/) - [GGML Deep Dive VII: Tensor Representaion and Memory Layout | xsxszab.github.io](https://xsxszab.github.io/posts/ggml-deep-dive-vii/)

[vLLM Deep Dive I: Intro and Environment Setup | xsxszab.github.io](https://xsxszab.github.io/posts/vllm-deep-dive-i/)

[Local LLM Inference : llama.cpp, GGUF, Quantizations and GGML Explained](https://read.theaimerge.com/p/an-ai-engineers-guide-to-running)

[The AI/ML Engineer's starter guide to GPU Programming](https://read.theaimerge.com/p/the-mlai-engineers-starter-guide)

[Very simple to understand: RoPE, 2D-RoPE, M-RoPE | ngxson's blog](https://blog.ngxson.com/very-simple-to-understand-rope-2drope-mrope)

[Introduction to ggml | ngxson's blog](https://blog.ngxson.com/introduction-to-ggml)

https://youtu.be/vW30o4U9BFE

https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/

https://thinkingmachines.ai/blog/lora/

https://aman.ai/primers/ai/token-sampling/

https://aman.ai/

https://builtin.com/artificial-intelligence/transformer-neural-network

https://hamzaelshafie.bearblog.dev/blog/

https://themlsurgeon.substack.com/p/transformer-attention-backwards

https://blog.ml.cmu.edu/

https://huggingface.co/blog/Kseniase/testtimecompute

### would be neat to train one day
https://github.com/karpathy/nanochat
[BEST-Route: Adaptive LLM Routing with Test-Time Optimal Compute](https://www.emergentmind.com/papers/2506.22716)  
[Adaptive LLM Routing Under Budget Constraints](https://www.emergentmind.com/papers/2508.21141)  
[Think Anywhere in Code Generation](https://www.emergentmind.com/papers/2603.29957)  
[SkillOpt: Self-Evolving Agent Skills](https://api.emergentmind.com/papers/2605.23904)