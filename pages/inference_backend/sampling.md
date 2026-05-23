# Sampling
## What is Sampling
If you spend any time in the LLM space you will quickly hear about LLMs being probability machines where they calculate the probality of all the tokens in their vocabulary to be next and then select based on those results the next token. Sampling is the math used in that selection process.

Different use cases can benefit from selecting from the token group differently because of the nature by which LLMs assign probability scores and things like demand for creativity/randomness or factual desire or coherence over long output.

> It might not seem obvious, or it might seem like the default for whatever backend is already the 'best you can get', but let's fix this assumption. There are more to language model settings than just 'prompt engineering', and depending on your sampler settings, it can have a dramatic impact.
> > [Your settings are (probably) hurting your model - Why sampler settings matter : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/17vonjo/your_settings_are_probably_hurting_your_model_why/)

There are multiple samplers you can use and you can and likely should use multiple in unison. The order and choice of these samplers has a significant impact on your output.
## Existing Samplers Explained
I think the existing the resources here are pretty comprehensive so I'll just provide a little map of them here.

Go here for a very short primer on some basics
> [LLM Samplers Explained](https://gist.github.com/kalomaze/4473f3f975ff5e5fade06e632498f73e)

Go here for a great explanation of the underlying premise here of why it's important and stuff to look for
> [Generation configurations: temperature, top-k, top-p, and test time compute](https://huyenchip.com/2024/01/16/sampling.html)

Go here for a nice inference use focused overview of a lot of different samplers with explanations and advice for usage and trouble shooting
> [LLM Sampling Parameters Guide | smcleod.net](https://smcleod.net/2025/04/llm-sampling-parameters-guide/)
> [LLM Sampling Parameters: Temperature, top-p, DRY, XTC (2026) | Local AI Master](https://localaimaster.com/blog/llm-sampling-parameters-explained)

Go here for a deeper understanding of how this is all works in an easy to digest package
> [Your settings are (probably) hurting your model - Why sampler settings matter : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/17vonjo/your_settings_are_probably_hurting_your_model_why/)

Go here for a much deeper understanding of how this all works and some easier to read but substantially backed takeaways
> [Aman's AI Journal • Token Sampling Methods](https://aman.ai/primers/ai/token-sampling/)

## Making Decisions
It comes down to three things. Figure out your use case, evaluate the different options for how they fit your use case with the above resources, and factor in common sampler setups like those provided as inference server defaults and with quants as recommendations because they are popular for a reason.

For a nice short overview focused on use case there is this article
> [LLM Inference Sampling Methods](https://blog.frohrer.com/llm-inference-sampling-methods/)
