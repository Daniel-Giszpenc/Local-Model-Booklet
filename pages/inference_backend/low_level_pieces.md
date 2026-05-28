# Tensor Libraries, GPU Kernels, Drivers, & the Like

This page for now is more of a stub and research dive bootstrap page than a core piece of this booklet on local language model hosting.

That said I've got a few things to say here so hear me out.

## Inference Servers are Controllers
When you're comparing inference servers for speed and performance what you're really analyzing is
- the capability of the low level computation pieces like tensor libraries and gpu kernels to do the math work required in running an LLM and what kind of math they are well built for as different ML features draw on different pieces of math
- the presence of this low level math stack targeted at your specific hardware from running the signals through the computational device(s) to communicating the calculation results back to the controlling program on the OS, no presense means no supported inference

Factor that in when you're making search queries and asking chatbots questions. Ask about how the different options are approaching these problems differently looking for the timeline and the purposes of each project and their initiatives. Even without knowing all the gritty details that should uncover a lot in your search and potentially result in better findings than just looking at the inference server surfaces.

## Optimization has Simple Fundamentals
All the optimization you learn about is doing 1 of 2 things

1. It is doing less work. Think SGLang RadixAttention for prefix caching.
> [Fast and Expressive LLM Inference with RadixAttention and SGLang - LMSYS Blog | LMSYS Org](https://www.lmsys.org/blog/2024-01-17-sglang/)

2. It is utlizing more of the available hardware and features of that hardware. Think vLLM's PagedAttention.
> [Paged Attention from First Principles: A View Inside vLLM | Hamza's Blog](https://hamzaelshafie.bearblog.dev/paged-attention-from-first-principles-a-view-inside-vllm/)

The same applies higher in the stack where we look at [model features](model_features) like MTP and see them using more of the hardware in parallel for the second kind of optimization and plenty of other cases.

The other fundamental of optimization I should mention is
3. Intelligently distribute particular work to particular hardware.
> [EVAL #008: NVIDIA Just Open-Sourced an Inference Engine. Now What? • Buttondown](https://buttondown.com/ultradune/archive/eval-008-nvidia-just-open-sourced-an-inference/)

This one feels a bit less ovious and feels very close to optimization 2 which 2 is about utilizing hardware features and capability that weren't previously in use like multi-threading with available threads and page cache with available memory.

This optimization is about intelligently distributing diverse work over diverse hardware. The idea is different hardware pieces will come with different advantages (eg. GPU matrix calculation ability) and bottlenecks (eg. network egress costs) so figuring out how to pass around your work materials and where to do that work can result in significant gains.
> [1000 Players - One Game of Doom - YouTube](https://www.youtube.com/watch?v=3f9tbqSIm-E)
## Look for those Fundamentals as Low as You Can
The big idea here is that defaults are meant to support most users often enough and not you specifically. That leaves room to do less work than the defaults instruct and fit the hardware tighter than the defaults instruct.

When you search for the optimal setup as discussed in [origin](../origin) the steps to take are
1. Define what you need to do.
2. Browse the defaults for what you **don't** need to do.
3. Inventory your hardware.
4. Browse the defaults for where a general hardare option is that could be a **custom glove fit** option for your hardware.

This is a neat article showing how someone optimized at a low level for their setup.
> [Optimizing Echo-TTS: CPU Beats GPU | Sleeping Robots](https://sleepingrobots.com/dreams/echo-tts-optimizations/)

This all is very similar to what I suggested with the inference server but I wanted to make it clear that you don't need to be a machine learning engineer with all the lingo and math skills to get this. You just need a willingness to experiment and the right questions in mind to get some major performance gains all the way to the lowest level depths.

The desired experience is still on top so if having the most optimal setup is not best for you then no need to think about this stuff but, if you do want as much out of your hardware as you can get I really recommend asking the different chatbots about things like
- what pieces you can build with custom flags or some such for your hardware
- what pieces come default with your inference server of choice and can they be swapped with something more targeted at your hardware
- what work does each default setting add and is that work needed for your use case
- expand the above point to each default setting for each component pieces down the graph
- where are the hardware bottlenecks and how could they be cleared
- what features are not being used and how could they be disabled

Asking in multiple ways and asking for multiple response per question can help get a useful lead to chase sometimes when you don't know what you're looking for.


## A Finding Example
KTransformers is a great example of a project that shows optionality at this extremely low level being able to pair with other inference servers like llama.cpp and sglang where it becomes an alternative backend specially boosting inference capabilities for the large upfront context prefill where speed is important use case.

I have some resources on it here and I recommend you take this not as just a singular option to consider but a spark to think on so it may become a flame. What other tools are out there that you can swap in and out to easily tinker with the composition of pieces at lowest level for the highest return.

> llama.cpp/ktransformers
> 
> switch out ggml backend or sglang-kt
> 
> [KTransformers Documentation - KTransformers Docs](https://ktransformers.net/en/docs
> 
> [Switching from llama.cpp/ktransformers, seeking advice/guidance · ikawrakow/ik_llama.cpp · Discussion #242](https://github.com/ikawrakow/ik_llama.cpp/discussions/242)
> 
> [ktransformers/doc/en/long_context_introduction.md at main · kvcache-ai/ktransformers](https://github.com/kvcache-ai/ktransformers/blob/main/doc/en/long_context_introduction.md)
> 
> [KTransformers: Run Large Language Models with 90% Less GPU Memory | by Md Monsur ali | Level Up Coding](https://levelup.gitconnected.com/ktransformers-run-large-language-models-with-90-less-gpu-memory-a9f8c3d1b96f)
> 
> [[Feature] KTransformers Integration to Support CPU/GPU Hybrid Inference for MoE Models · Issue #11425 · sgl-project/sglang](https://github.com/sgl-project/sglang/issues/11425)
> 
> [Loads of interesting ideas in the 'ktransformers' report for mixed CPU/GPU inference · ggml-org/llama.cpp · Discussion #8721](https://github.com/ggml-org/llama.cpp/discussions/8721)
> 
> [KTransformers: Optimizing Local Deployment and Long Context Inference for Large Language Models | by ArXiv In-depth Analysis | Medium](https://archive.ph/20251111144444/https://medium.com/@jenray1986/ktransformers-optimizing-local-deployment-and-long-context-inference-for-large-language-models-0f01b3a2d544)
