# Inference Server

The purpose of the article is not to make an in depth comparison of existing options of explain which specific inference server I recommend. It's to help you ask the question of which you want and connect you with the great resources already out there.

## The Basics

### What it is.
This is the software used to run the language model you got. I have often heard models called the brain and agents the body. Staying in theme the inference server can be called a combination of the circulatory and nervous systems.

- The circulatory system is responsible for making sure the brain gets the resources i needs to work.
- The nervous system is responsible for enabling messages to pass around the outside world, the brain, and the body.

Think about what happens when you use a cloud hosted model like opus with an agent like claude code:
- you send a message to the model
- the model processes the message using it's configuration and hardware
- the model sends back a message

> [!important] 
> When you want to tune how the models you work with process your requests or leverage the communication path between you and the model you got, this is where you go.

Regarding hardware usage it is important to note that the inference server is more so a command center than the battalion on the field. When you send a request the inference server will dispath a kernel program with purpose of running the computation to forge a response for that request. Then the inference server will pass that response on back.

Different inference servers come with different programs they can dispath to the hardware and that is where the hardware utilization different comes from. When looking to min-max you hardware usage it is best to look not just at the inference server but the programs it dispathes as well - [tensor_libraries_gpu_kernels_drivers_&_the_like](tensor_libraries_gpu_kernels_drivers_&_the_like.md).

## Decision Variables

### Desired Experience
Figure out your desired experience. Do you want any easy setup and have extra hardware to throw at this and don't need the best and baddest? Or maybe you do want to go deep min-max tuning every bit of your setup for maximum performance. It could be somewhere in the middle too.

Keep in mind that sometimes finding your desired experience means really digging into the search engine or chatbot for it where you ask perhaps for the most plug-n-play setup that still gives you the best performance on Mac METAL which brings you to a niche project like ds4.
> https://github.com/antirez/ds4

Also, this isn't just about ease of use vs power use. Maybe you want to tinker and get in the code so you look at projects where the community and development work really jive with you or maybe you really want to learn a lot about how language models work so you go through something similar to "Kubernetes The Hard Way" and "Linux From Scratch" where you find what makes good reference, components, or playground to grow in.

There is so much more than just plug-n-play or power use so take a moment to think about why you're really here. Maybe you want multiple setups/approaches here and maybe it really is a just a basic pit stop which is fine too.
#### Ease of Use & Performance Gains
These are still the main sliders so let's take a moment with them.

Abstraction is the main mechanism for controling this slider. If you want more:
- Ease of use: you start moving towards wrappers and more abstraction of enough where an external provider handles management of more options for you.
- Performance: you start building and choosing more components closer to the hardware yourself
- Middle ground: tightly scoped projects like ds4 where the toolkit is not making a bunch of generalized decisions and is instead dialed in towards your circumstances (hardware, etc.) and you can rely on the work they did out of the box

### Hardware Support
Let's take inventory of the hardware available. Different inference servers will support different hardware.
- some support cpu inference and hybrid cpu gpu inference, many don't
- some offer wide gpu support, different providers (amd, nvidia, etc.) different card models different chip architectures, some have very narrow targeted support
- some will handle setup nuances like multi-node distributed and heterogenous gpus better than others

When you consider you inference server, write out all these things, do a little research on the chip architectures and drivers and special gpu settings and write those in. Try to get a full picture on what you need to work with here.

#### A Quick Asterisk on Hardware Support
Sometimes you will run into a case where an inference server can support your hardware but it will require additional elbow grease as you need to build software components targeting your specific hardware yourself.

An example of this is vllm with ROCm for unsupported cards on the default latest ROCm (currently 7.2) where you can custom build ROCm for your card using TheRock (an official AMD build system) covering many more architectures than default supported.
> https://github.com/ROCm/TheRock/tree/main
> https://github.com/ROCm/TheRock/blob/main/RELEASES.md

Similar to that, sometimes you will run into cases where the elbow grease is not required to run but the difference can be quite significant in hardware utilization.

For exmaple, patches like amd-gpu-boost and component forks like rocm/triton or rocm/aotriton.
> https://github.com/Painter3000/AMD-GPU-BOOST
> https://github.com/ROCm/triton
> https://github.com/ROCm/aotriton

This becomes a part of the desired experience question: do the benefits of this inference server with the added elbow grease outweigh the cost of supplying it for you?

### Software Support
Just as taking inventory of the hardware to use is important, so is the software. Here things like packaging format (eg. gguf), [quantization](quantization.md), and models ([model architectures](model%20architectures.md), [model_features](model_features.md)) you want to use matter as different inference servers have different support limitations and focuses.

Sometimes this will be a complete lack like wanting the IQ4_K_R4 quant because it works really well on your hardware and cpu-only inference setup restricting you to ik_llama.cpp and sometimes it may be a slight edge where you plan to speculative decoding with your model and it has more mature support in a particular inference server such as vllm.

When you make a choice about your inference server, you also want to get a good understanding of your various other options in inference backend, middleware, and tooling spaces because the inference server is the intersection of most of it.

## Inference Servers Out There
There will be no exhuastive list considering the purpose of the article but some basics seem good.

Here are some results I got from some chatbot convos I had in the past that may be useful.
> [Inference Servers - The "Kernel" for Inference](../chatbot_insights/Inference%20Servers%20-%20The%20"Kernel"%20for%20Inference.md)

I also really recommend these resources for an overview here
> https://buttondown.com/ultradune/archive/eval-001-the-great-llm-inference-engine-showdown/
> https://awesomeagents.ai/tools/best-open-source-llm-inference-servers-2026/

#### Big 3 for Personal Local Hosting
llama.cpp offers tuning range from plug-n-play to highly in depth and works on most consumer hardware you give it with the special advantage being cpu inference.
> https://blog.steelph0enix.dev/posts/llama-cpp-guide/
> https://github.com/ggml-org/llama.cpp

vLLM has very extensive gpu and model support with good speed making it a solid option for gpu only setups where speed is important but the material both in hardware and engineering elbow grease is more hobbled together. The other part of vLLM's ease to pickup is the community and education built around it.
> https://docs.vllm.ai/en/latest/
> https://github.com/vllm-project/vllm

SGLang has far less extensive support for hardware but makes up for that with the best speed of this bunch without significant deployment complexity trade-off though there is less material to learn from.
> https://docs.sglang.io/
> https://github.com/sgl-project/sglang

#### Wrappers
There are wrapper options like Ollama and LM Studio built around llama.cpp and gpustack around vLLM or SGLang. For ease of use wrapper options can be great but keep in mind the cost abstraction brings and also be wary of friction between the wrapper and project being wrapped. This can be organizational or technical where the wrapper lags behind and you miss critical updates or support for a bit.
> https://github.com/ollama/ollama/issues/11714#issuecomment-3172893576
> https://sleepingrobots.com/dreams/stop-using-ollama/
> https://docs.ollama.com/
> https://github.com/ollama/ollama
> https://docs.gpustack.ai/latest/overview/
> https://github.com/gpustack/gpustack/
> https://lmstudio.ai/
> https://lmstudio.ai/docs/developer

#### Forks
Forks with some being tmp phenomena to provide access to a certain feature and others being main stay for hardware and performance specific benefits like ik_llama.cpp. Know that some stability and feature support such as broad hardware optimization may be let down by going to a fork.
> https://github.com/ikawrakow/ik_llama.cpp/tree/main
> https://github.com/TheTom/llama-cpp-turboquant

#### Enterprise
Enterprise production focused options like bentoml, triton inference server, and baseten. This series is more focused on the home user than enterprise engineer so I won't really be covering what goes into all that though plenty of fundamentals carry.
> https://www.bentoml.com/blog/how-to-vet-inference-platforms
> https://developer.nvidia.com/blog/scaling-llms-with-nvidia-triton-and-nvidia-tensorrt-llm-using-kubernetes/
> https://github.com/triton-inference-server/tensorrtllm_backend?tab=readme-ov-file#readme

#### Niche
Niche projects like ds4 where the inference server isn't trying to be a generalist capable of serving every model and candle-vllm which uses the minimalist rust candle ML framework under the hood instead of the more common PyTorch & Co.
> https://github.com/antirez/ds4
> https://github.com/huggingface/candle
> https://github.com/EricLBuehler/candle-vllm

## Bringing It All Together
 Write down your priorities over all of the above decision and consideration areas. Then write circumstances (hardware available and other such details). Take all of that in a doc and query a bunch of different models with it. In your queries don't just ask for the best option for you but ask for the bots' thoughts on every available option (you can use the last section to help steer the model here, keep in mind there is more out there than what I wrote down which was more the breadcrumbs to get you searching) with reasoning for what makes each option good and bad for you.

To get a setup that fits you priority spread over the above what I recommend is writing down your priorities over all of the above and then and circumstances (hardware available and other such details) on a document somewhere and then querying a bunch of different models with that full doc. In your queries don't just ask for the best option for you but ask for the bots' thoughts on every available option with reasoning for what makes it good and bad for you. 
