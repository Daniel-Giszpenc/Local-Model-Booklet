# Quantization
## Quantization Fundamentals

> [!note]  HuggingFace Quote
> Quantization is a technique to reduce the computational and memory costs of running inference by representing the weights and activations with low-precision data types like 8-bit integer (`int8`) instead of the usual 32-bit floating point (`float32`).
> 
> Reducing the number of bits means the resulting model requires less memory storage, consumes less energy (in theory), and operations like matrix multiplication can be performed much faster with integer arithmetic. It also allows to run models on embedded devices, which sometimes only support integer data types.
> > https://huggingface.co/docs/optimum/en/concept_guides/quantization

At a fundamental level quantization is a technique used to trade off accuracy / quality of output for reduced compute resource requirements.

To understand how this works remember that an LLM effectively stores a distributed encyclopedia of words and natural language pieces that is connected together using weights and attention for actual "knowledge" and fill in the blank capability. The bigger and more precise those connections are, the more accurate an LLM can be in answering a question. The smaller and less precise those connections are, the less needs to be stored and computed on the hardware.

> Credit to Carlos Iván Lozano for the inspiration for this explanation.
> 
> [Understanding What an LLM is and How it Works 3/4: Attention at its Core](https://lecharles.medium.com/understanding-what-an-llm-is-and-how-it-works-3-4-attention-at-its-core-ec5eff7ec9d5)
> 
> [Understanding What an LLM is and How it Works 4/4: How Do LLMs Know Stuff?](https://lecharles.medium.com/understanding-what-an-llm-is-and-how-it-works-4-4-how-do-llms-know-stuff-b3b40b40e017)


The optimization quantization makes is doing less work as talked about in the [low level pieces](./tensor_libraries_gpu_kernels_drivers_&_the_like) page where the same operations can be done with less expensive numbers as opposed to leveraging the hardware more adeptly.

That said, keep in mind some quantizations are specifically supported by certain inference servers and some are specifically tuned to fits specific hardware and specific models very well to creating a mix of less work and closer glove fit to the hardware.

I recommend reading these articles to gleam a bit more of the underlying mechanics here in a very friendly delivery:
> [The Complete Guide to LLM Quantization | LocalLLM.in](https://localllm.in/blog/quantization-explained)
> [LLM Quantization Methods: GPTQ, AWQ, GGUF - Cast AI](https://cast.ai/blog/demystifying-quantizations-llms/)
> [A Visual Guide to Quantization - Maarten Grootendorst](https://www.maartengrootendorst.com/blog/quantization/)
## Some Pieces in Play
When we consider the quantization of a language model often we are considering all of these things together
- the package format for the trained and compressed model
- the quantization method / technique for compressing a model
- the quantization method / technique for compressing context / KV cache

## Package Format
A format is a container that defines how model data (weights, metadata, tokenizer config, architecture info) is serialized to disk and loaded by tools (eg. llama.cpp inference server).

#### GGUF is not a quantization method.
Most formats will say nothing of about how the weights were compressed and instead store tensors as generic multi-dimensional arrays (FP16, FP32, INT8) with a .zip general bucket like approach and treat quantization as an external preprocessing step. GGUF is an exception to this where the quantization method is embedded into the format specification itself at the tensor type level in a binary file custom designed for storing all the model related information.

> [!important] As opposed to a quantization method GGUF is:
> A package format (binary specification) for storing model data (weights, metadata, tokenizer config, architecture info) along with information on the quantization method(s) used on that stored model data.

> [!important] GGUF "related" quantization methods come from ggml.
> The GGUF specification comes from the ggml project. The ggml project **also** contains many quantization methods which can be specified in the binary file where the quantized model is stored.
> 
> The relation is coming from the same project and the methods used being described in the GGUF specifiction.
> 
> It is accurate to say GGUF is well integrated with the ggml quants and that it supports them but we should really start calling them ggml quantization methods.

I mention this to clarify the line between package format and quantization method which I find especially blurred in discourse around GGUF.

If you want to learn about some of the benefits and purpose of the GGUF format here is the specification
> https://github.com/ggml-org/ggml/blob/master/docs/gguf.md

#### Existing and Choosing Formats
Formats Include
- GGUF
- Safetensors
- PyTorch Pickle (.pt / .bin)
- ONNX
- MLX

The main decision branching points used for choosing a format will
- are you doing inference or training
- are you running on constrained consumer hardware
- are you working with a specific inference server and need to meet their specific format requirement
- is there a more secure, safer, or mature option

Some useful resources here are
> [Common AI Model Formats | ngxson's blog](https://blog.ngxson.com/common-ai-model-formats)
> 
> [GGUF Format: Efficient Storage & Inference for Quantized LLMs - Interactive | Michael Brenndoerfer | Michael Brenndoerfer](https://mbrenndoerfer.com/writing/gguf-format-quantized-llm-storage-inference)

There are some basic comparison on this site
> https://www.ertas.ai/compare/gguf-vs-safetensors

## Model Quantization Methods

This is the main decision area here as the method and inference server you choose will almost certainly decide the package format you use.

#### GGML Methods
There are three main groups of ggml methods.

> Quote from Kaitchup on Legacy Methods
> 
> "A concise way to think about the legacy set is that Q8_0 is a safe INT8 baseline, Q5_0/1 are decent mid-range choices if you must stick to legacy, and Q4_0/1 are largely superseded by K- and I-quants for quality per bit."
> 
> https://kaitchup.substack.com/i/175695561/legacy-formats-q0-and-q1

> [!important] Important - Look for both higher number and better algorithm.
> Keep in mind that the other method groups (K and I quants) can outperform in accuracy and compute resource usage higher legacy quants.

These are great resources for quickly understanding the naming format of it all and what is in ggml
> [Choosing a GGUF Model: K-Quants, I-Quants, and Legacy Formats](https://kaitchup.substack.com/p/choosing-a-gguf-model-k-quants-i)
> 
> [gguf-docs/naming.md at main · iuliaturc/gguf-docs](https://github.com/iuliaturc/gguf-docs/blob/main/naming.md)

Here is a discussion with some nice tables and graphs comparing different quants and the llama-quantize doc with some nice table
> [Perplexity (Quality of Generation) Scores · ggml-org/llama.cpp · Discussion #406](https://github.com/ggml-org/llama.cpp/discussions/406)
> 
> [llama.cpp/tools/quantize/README.md at master · ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md)

Be careful when you get an I-quant that the dataset used for calibration was good and even more preferably was closely fit to your use case.
> https://github.com/iuliaturc/gguf-docs/blob/main/importance-matrix.md#calibration-dataset-selection
> 
> [About imatrix overfitting, and importance of input text · ggml-org/llama.cpp · Discussion #5263](https://github.com/ggml-org/llama.cpp/discussions/5263)
#### Quantization Providers
This is a good post for learning about the competing quant providers here and it comes with some nice benchmark comparisons
> [The Great Quant Wars of 2025 : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1khwxal/the_great_quant_wars_of_2025/)
> 
> [Qwen3 235B and 30B MoE Quant Benchmarking Roundup](https://gist.github.com/ubergarm/0f9663fd56fc181a00ec9f634635eb38)

There is ggml proper with `llama-quantize`, UnSloth dynamic quants, and ik_llama's IQ*\_K quants as well as various community quants in the wild on HuggingSpace using the technique and technology these three main providers put forward.

UnSloth has a neat blog article on their method here
> [Unsloth Dynamic v.20 GGUFs](https://unsloth.ai/blog/dynamic-v2)

They are also covered nicely in a small section here:
> [Quantization for Local LLMs: How It Works and Which Formats Fit Your Setup](https://www.hardware-corner.net/quantization-local-llms-formats/)

ik_llama.cpp is a fork of llama.cpp by the creator of many of the quants in ggml. They have some new quants that perform very well in their fork.

To learn more about these quants and their origin I recommend reading this discussion
> [New quantization types IQ2_K, IQ3_K, IQ4_K, IQ5_K · ikawrakow/ik_llama.cpp · Discussion #8](https://github.com/ikawrakow/ik_llama.cpp/discussions/8)

These have not and will not be going into ggml because of this
> https://github.com/ggml-org/llama.cpp/pull/19726#issuecomment-3946355613

#### EXL3 (Successor of EXL2 & GTIP)
This quantization method is specifically for the ExLlamaV3 inference library.
> https://github.com/turboderp-org/exllamav3

There are perplexity test comparison graphs here with links to relevant material on the mechanisms used in the method
> [exllamav3/doc/exl3.md at master · turboderp-org/exllamav3](https://github.com/turboderp-org/exllamav3/blob/master/doc/exl3.md)

Characteristics are:
- requires ExLlama library and comes with smaller eco-system
- fastest project V3 is still experimental while V2 is stable
- requires everything in vram on nvidia only
- better average inference (accuracy and speed) than ggml methods
- offers 2-8bit quantization used with safetensors packaging

#### AWQ
This is an option provided by vLLM.

Some resources here are
> [Quantization Explained: Q4_K_M vs AWQ vs FP16 for Local LLMs | SitePoint](https://www.sitepoint.com/quantization-q4km-vs-awq-fp16-local-llms/)
> 
> [LLM Quantization Explained: INT4, INT8, FP8, AWQ, and GPTQ in 2026 - VRLA Tech](https://vrlatech.com/llm-quantization-explained-int4-int8-fp8-awq-and-gptq-in-2026/)
> 
> [casper-hansen/AutoAWQ: AutoAWQ implements the AWQ algorithm for 4-bit quantization with a 2x speedup during inference. Documentation:](https://github.com/casper-hansen/AutoAWQ)

Characteristics are:
- mature option used in production inference servers for gpu quantized workloads
- better average inference (accuracy and speed) than ggml methods in optimized inference servers
- requires everything in vram on nvidia only
- offers int4 size only used with safetensors packaging

#### General Great Resources
Some great resources that cover the different quantizations all grouped up are
> [Model Formats Explained: GGUF vs GPTQ vs AWQ vs EXL2 | InsiderLLM](https://insiderllm.com/guides/model-formats-explained-gguf-gptq-awq-exl2/)
> 
> [Quantization for Local LLMs: How It Works and Which Formats Fit Your Setup](https://www.hardware-corner.net/quantization-local-llms-formats/)

These contain some options I haven't listed here.

## Context Quantization
There are multiple different methods out there but you will probably be fine just knowing about Turbo Quant from Google which blew everything else out of the water.

For the inference only user side there are 3 big things to know about it
1. It is data oblivious (there is no calibration step) so no worrying about a calibration set for your use case here.
2. It is not only a massive RAM usage reduction but also a throughput boost because of how forward passes and the memory bandwidth bottleneck works.
3. It has better precision (think accuracy) and compression simultaneously compared to the other existing options.

For a nice comparison and overview of the main points
> https://turbo-quant.com/
> 
> [TurboQuant Explained: 3-Bit KV Cache at 6× Compression](https://decodethefuture.org/en/turboquant-vector-quantization-kv-cache/)

To learn about how Turbo Quant works I recommend these resources
> [A simple explanation of the key idea behind TurboQuant : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1s62g5v/a_simple_explanation_of_the_key_idea_behind/)
> 
> [TurboQuant: What 3-Bit KV Caches Actually Mean for Your Inference Stack](https://themlsurgeon.substack.com/p/turboquant-what-3-bit-kv-caches-actually)

> [!warning] Quick Word of Caution
> More context does not equate to better result, sometimes it can even confuse the model more so be careful.
> > [How Long Contexts Fail](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html)

Also, the big draw of KV cache quantization is reining in the quadratically rising size of resource demand but some model architectures will need this less like those with Gated Delta Network which provides linearly scaling context resource demand.
> [LLMs-from-scratch/ch04/08_deltanet/README.md at main · rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch04/08_deltanet/README.md)
## Bringing It All Together
It's very easy to get overwhelmed by all the options here but there are a few axes we can bring to shrink the problem down.

The goal here is personal local infererence. Full precision and even half isn't really needed for this category of use case.

Take inventory of the model(s) and context you want to fit and the hardware you have to fit them on. Then ask a chatbot to look at existing benchmarks for what quants fit your hardware. Ask the bot to link to the benchmarks it uses so you can cross check they're up to date and sound.

Also check what quants don't support your hardware well outside whether the model and context fits on the space. For example, IQ*\_K quants with ik_llama.cpp won't play well with amd and exl3 fit nvidia all in vram very well. Knock out all the quants that don't fit from consideration.

Look at the other pieces of the stack here that you want to run and your desired experience. If you have a specific inference server in mind narrow the options down to those supported by that inference server. If you want something more stable knock out options like exl3. If you want something with a thriving community rank higher for consideration options like Q4_K_M and AWQ.

Look at the algorithm used and knock out weaker ones like the legacy group of methods in ggml. Make sure if you are using methods like importance matrix calibration that the dataset fits your use case.

Consider your priority spread across accuracy, speed, and size compression and look at the benchmark results of the quants left at this point for these things.

And of course you can only work with the quants available and may not the machine to quantize nicely down from full precision so seeing what is actually available on HuggingFace can limit the options.

There also are special features which I haven't really gone into here like fine tuning with its different approaches like LoRA and QLoRA as well as abliteration and others. I may expand this page in the future or add another for these things but for now when you browse the available quants the way to naturally adjust for what's out there that fits you is to look not just at output benchmarks but also use case specific benchmarks for available quants being distributed which will surface some more details.
