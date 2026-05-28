# Evaluating and Comparing Models
## Use Benchmarks for Patterns Not Perfection

Information gets spread out among various papers, blogs, community discussion threads, leaderboards, evaluation sites, and more. The information provided differs from model to model with each picking out their benchmarks to work towards and publish and in turn the community selectively applies some evaluations to some models. The big idea here is there is no holistic body of data covering each model and evaluation combination for perfect cross reference.

In the abscense of perfect we can settle for what's available and that's patterns and connections. You can arbitrarily start with looking into a model someone mentioned really worked well for them on a use case close to your own and find the architecture pieces of that model with other models that use those pieces, the models that its development is following, and what models come up in coversation about that one often enough. Then you can group together a bunch of benchmarks not as end all be all findings but as suggestive guides. Pick out ones focuses on testing things you believe important and tangentially important to your use case. Now take all those selected models and benchmarks and pick out the pattern points like which benchmark results went up and down by how much with the new generation, which model in the conversation space got the highest rank distribution over all the rankings, how commons are the given architectural pieces among models in the coversation and where do the difference stem from in purpose from development. When you have results from these queries you can query your aggregate results and get new insights. You can cross validate using similar data points like similar architecture pieces, model labs, and testing focuses to see if their are consistency deviations that potentially signify bad apples in the mix.

On human time all of that is not so feasible but remember that LLMs and in turn chatbots are pattern machines. Try breaking down the sources and queries you care about and then feeding them in to a few chatbots you like and see what you get.

It also is very important to keep in mind that fallacy in these results comes not only from differing LLM performance per usage specifics but also from the evaluations themselves. Some basic things to keep an eye out for a dataset contamination (data set being public trained on and made useless), loss of signal (evaluation does not continue test development and or testing with new models and or results show too little difference for comparison utility), and other criteria such as testing being to minimal to be significant or result aggregation and presentation involving so much lost precision the utility of the result can be argued to be very low.

These are some neat resources in the topic space:
> [Accidentally Building an AI Reasoning Research Ecosystem (Or: Can AI Stop Thinking?)](https://huggingface.co/blog/mike-ravkine/can-ai-stop-thinking)
> 
> [From Benchmarks to Cognitive Landscapes: Building ReasonScape](https://huggingface.co/blog/mike-ravkine/building-reasonscape)
> 
> [Fire in the Hole! Benchmarking is broken : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1ow277f/fire_in_the_hole_benchmarking_is_broken/)
> 
> [The GenAI Evaluation Matrix: How We Really Measure Intelligence..](https://bhavishyapandit9.substack.com/p/the-genai-evaluation-matrix)
> 
> [Benchmarks for LLm | AI Advances](https://ai.gopubby.com/the-benchmarks-ai-companies-pray-you-never-check-173a8fb5d437)

> [!important] Note on due diligence with models not from direct providers.
> Plenty of model providers on HuggingFace offer further trained and altered models that will differ from the base models they come from. Take that into account when evaluating benchmark performance and user declared performance. See what the source of the model was, try to understand the differences brought from the alteration, and keep an eye out.

Benchmarking may have issues but that's partially because people expect too much utility from individual benchmarks I believe. There are also folks who reccommend just two minute real use tests but that ignores setup time and length of search for best fit model compared to 1 hour tests plus chatbot benchmark queries.

For some desired experiences and setups the two minute test works, for some the one I mentioned above, and other a quick look and runway jump with a random benchmark. Feel them out and for what fits you.

## Understanding Evaluation

This blogs has a lot of articles set in the evaluation space at large to provide some context when reviewing evaluation approaches:
> [Writing • Eugene Yan](https://eugeneyan.com/writing/)

Also the big model provider players provide interesting articles like this for looking slightly under the hood
> [BrowseComp: a benchmark for browsing agents | OpenAI](https://openai.com/index/browsecomp/)

## Great Resources to Start With

Now let's list a few benchmarks, comparison, and other resources of the like for use in a search here.

Looking by architecture
> [Choosing the right model | LLM Inference Handbook](https://bentoml.com/llm/getting-started/choosing-the-right-model)
> 
> [LLM Architecture Gallery | Sebastian Raschka, PhD](https://sebastianraschka.com/llm-architecture-gallery/)
> 
> [LLM Architecture Gallery - Percent Active Parameters](https://sebastianraschka.com/llm-architecture-gallery/active-parameter-ratio/)

General collections of many widely accepted benchmarks
> [leobeeson/llm_benchmarks: A collection of benchmarks and datasets for evaluating LLM.](https://github.com/leobeeson/llm_benchmarks)
> 
> [A list of 28 modern benchmarks and their short description : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1psd61v/a_list_of_28_modern_benchmarks_and_their_short/)
> 
> [panilya/awesome-ai-benchmarks: Awesome AI Benchmarks](https://github.com/panilya/awesome-ai-benchmarks)
> 
> [Awesome AI Benchmarks](https://aibenchmarks.net/)

This is an amazing resource for bring many different benchmarks with descriptions and relevant materials in one place and UI
> [LLM Benchmarks 2026 - Compare AI Benchmarks and Tests](https://llm-stats.com/benchmarks?category=general)

## A Bunch of Benchmarks to Feel Out

Some specific benchmark leaderboard links in no particular order with no particular selection criteria
> [LiveCodeBench Leaderboard - Holistic and Contamination Free Evaluation](https://livecodebench.github.io/leaderboard.html)
> 
> [GSO Leaderboard - Challenging Software Optimization Tasks](https://livecodebench.github.io/gso.html)
> 
> [LiveBench](https://livebench.ai/#/?highunseenbias=true)
> 
> [LLM Leaderboard - Best Text & Chat AI Models Compared](https://arena.ai/leaderboard/text/coding)
> 
> [LLM Leaderboard - Comparison of over 100 AI models from OpenAI, Google, DeepSeek & others](https://artificialanalysis.ai/leaderboards/models)
> 
> [Reasonscape Leaderboard Dash](https://reasonscape.com/r12/leaderboard/)
> 
> [Is It Nerfed? - Continuous LLMs Evaluation](https://isitnerfed.org/)
> 
> [UGI Leaderboard - a Hugging Face Space by DontPlanToEnd](https://huggingface.co/spaces/DontPlanToEnd/UGI-Leaderboard)
> 
> [BrowseComp Benchmark Leaderboard](https://llm-stats.com/benchmarks/browsecomp)
> 
> [Spiral-Bench Leaderboard](https://eqbench.com/spiral-bench.html)
> 
> [Berkeley Function Calling Leaderboard (BFCL) V4](https://gorilla.cs.berkeley.edu/leaderboard.html)
> 
> [AI BENCHY Leaderboard | AI BENCHY](https://aibenchy.com/)
> 
> [SimpleBench](https://simple-bench.com/)
> 
> [LLM Rankings | OpenRouter](https://openrouter.ai/rankings)

Finding source with significant data per model like this can be interesting
> [Reasonscale Explorer Dash](https://reasonscape.com/r12/explorer/)

Here are some additional resources related to pattern work
> [Patterns for Building LLM-based Systems & Products](https://eugeneyan.com/writing/llm-patterns/)
> 
> [How to Match LLM Patterns to Problems](https://eugeneyan.com/writing/llm-problems/)
## The Case for Elbow Grease

All of that said, benchmarks are great for a low cost analysis and comparison of LLM performance but when you really want to know which LLM performs better at your task the best measure by far will actually be manually testing that LLM via usage on your task or something extremely closely related to it personally due to the mechanical differences in how LLMs perform with different problems as well as people considering training undergone and different people having different workflows they work well in and with.

These personal tests can range from short quick questions you often get into and somewhat deep hour long sessions of continous use where you're power using and seeing how it fits for that case.

Keep in mind you call always make your own private automated benchmark if you have the time, the knowledge and resources to do it are out there. Example of someone who did below.
> [I tested 21 small LLMs on tool-calling judgment — Round 2 with every model you asked for : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1r4ie8z/i_tested_21_small_llms_on_toolcalling_judgment/)
## Alternative Sources
Keep in mind that you don't need to limit yourself to test result aggregation sites and quantitative comparison. If you find someone on reddit or HuggingFace who consistently reccommends models that work great for you use case then that is a great signal even if it is qualitative. You can find these kinds of things retro-actively for the future by asking a chatbot for users who were saying positive things about models you had positive experience with too so don't just think of this data point collection as a problem only looking into the future.

Here is an interesting resource
> [AINews | AINews](https://news.smol.ai/)

Beyond people there are companies and what they do as well as level of effort put into tooling support for the models. These kinds of things are talked about less but can really help paint a more clear picture.
## Look Under the Hood: Architecture
If you have the time I really recommend taking a few hours to read these three articles to get a broad understanding of what exists in the space and some of the different architecture developments and priorities.
> [LLM Architectures Explained: What Powers Today’s Top Models](https://huggingface.co/blog/PrunaAI/llm-architectures-overview)
> 
> [A Visual Guide to Attention Variants in Modern LLMs](https://magazine.sebastianraschka.com/p/visual-attention-variants)
> 
> [The Big LLM Architecture Comparison](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison)

The creator of the comparison and visual guide article also had a YouTube channel.
> [The Big LLM Architecture Comparison - YouTube](https://www.youtube.com/watch?v=rNlULI-zGcw)

The reading can definitely feel heavy and far less connected to observable model performance as benchmark results paired with hardware requirements but it's best to not view this as an either or and more as something you can use to add nuance to your perspective. When you have even a light understanding of the pieces of the models that you looking at you become better able to search for models because you have more criteria to include or disclude models in your search and data to traverse (eg. following changes by generation) to find new models. LLM "intelligence" is very inspired by human intelligence and like LLMs we human make better decisions with better context so this can help there.

Also, I generally find if you have the time it can be quite helpful to peel back some layers of abstraction and front load some self education work. I believe even if you don't know where the knowledge you learn may come in later, if you play the game lond enough the boomerang will come back and the hour or two here could save you far more later when you make the right decisions faster and spend less time walking decisions back looking about.
> [The peril of laziness lost | The Observation Deck](https://bcantrill.dtrace.org/2026/04/12/the-peril-of-laziness-lost/)

When you find a model you're considering it's helpful to find it on this site and browse the related concepts as well as find where those concepts fit in the above articles.
> [LLM Architecture Gallery | Sebastian Raschka, PhD](https://sebastianraschka.com/llm-architecture-gallery/)

When you are doing research here are some priorities to watch for:
- Improving the training experience whether by making it easier, more consistent, and or something else.
- Reducing the size cost (memory requirements) of context and or the model itself.
- Attacking the memory bandwidth problem by reducing active attention so less memory needs to be moved around.
- Improving accuracy for long input and or output runs where coherence over time is important.
- Improving accuracy on a general level or maintaining accuracy alongside other improvements.
- Advancing research, some of these are more so about the open development and experimentation with the technology than end training and inference.

A good way of looking for priorities to fit your search is personally identifying the priorities you have for your desired experience and then matching them against the priorities of models from some grouping you provide whether the top # of a list or those from an Ahead of AI article or a mix of groups or a custom group of all models with a collection of traits like generation of greater than 7B param count for example.

Here are some additional good resources for learning about important architecture differences that go into decision making
> [If Dense Models are better for Coding, why are Qwen-Coders MoE? : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1sinr5k/if_dense_models_are_better_for_coding_why_are/)
> 
> [A Visual Guide to Mixture of Experts (MoE)](https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-mixture-of-experts)
> 
> [EVAL #007: The Great MoE Shift — How Mixture-of-Experts Is Reshaping the Entire Inference Stack • Buttondown](https://buttondown.com/ultradune/archive/eval-007-the-great-moe-shift-how-mixture-of/)
> 
> [LLM Model Architecture Explained: Transformers to MoE](https://www.clarifai.com/blog/llm-model-architecture/)
> 
> [LLM Architectures Explained: What Powers Today’s Top Models](https://huggingface.co/blog/PrunaAI/llm-architectures-overview)

Looking for the latest and greatest is great and there have been some astonishing developments in the last few years but it still makes sense to take modernity as a factor rather than a decider.

That said if you do want to look into some of the latest development here are some resources to help you start which are good not only for the information they contain but the approach to analysis they display which you can use in your questioning.
> [Recent Developments in LLM Architectures: KV Sharing, mHC, and Compressed Attention](https://magazine.sebastianraschka.com/p/recent-developments-in-llm-architectures)
> 
> [A Dream of Spring for Open-Weight LLMs: 10 Architectures from Jan-Feb 2026](https://magazine.sebastianraschka.com/p/a-dream-of-spring-for-open-weight)
> 
> [Beyond Standard LLMs - by Sebastian Raschka, PhD](https://magazine.sebastianraschka.com/p/beyond-standard-llms)

## More in the Caboose: Features & Alteration
This is not meant to a comprehensive or well defined list but more so a gallery of items to spark your curiosity and knowledge off of. This way instead of just looking on things like quant or param count, you have a few more apples hooked into your eye (weird analogy but I'm keeping it).

### Long Context Handling
Lots of really interesting developments are going into the context handling space both for maintaining accuracy under context load and reducing hardware demand from context use as well time slow based on context both at prefill and on-going.

> https://hanlab.mit.edu/projects/quest
> 
> https://github.com/microsoft/minference
> 
> https://cyberinsist.com/blog/mixture-of-depths-production-transformer-inference


### Speculative Decoding
Speculative decoding and its cohort of compute techniques for separate-parallelize-sync demonstrate a standout example of how particular model setups and features can dramatically alter the inference experience with a particular model flavor.

> https://jarvislabs.ai/blog/speculative-decoding-vllm-faster-llm-inference
> 
> https://bentoml.com/llm/inference-optimization/speculative-decoding

### Test Time Compute & Reasoning
I get into a cutting cost and making inference work on small consumer hardware a fair bit as that is the main challenge of personal local hosting but getting the best accuracy you can get is still one of the shiny stars to jump for so learning about this stuff and tracing developments on this axis feels quite important.

> [jiangxxxue/Think-Anywhere](https://github.com/jiangxxxue/Think-Anywhere)
> 
> [Test-Time Compute Scaling: A Practical Guide for LLM & Agentic System Builders](https://buildml.substack.com/p/test-time-compute-scaling-a-practical)
> 
> [Understanding Reasoning LLMs - by Sebastian Raschka, PhD](https://magazine.sebastianraschka.com/p/understanding-reasoning-llms)
> 
> [What is test-time compute and how to scale it?](https://huggingface.co/blog/Kseniase/testtimecompute)

### Training, Fine Tuning, QLoRa, etc.
This is quite honestly its own page in a separate more technical section on where the inference we use comes from but I'll drop a few links here for now.

> [When Fine-Tuning Beats Prompting - by Bhavishya Pandit](https://bhavishyapandit9.substack.com/p/when-fine-tuning-beats-prompting)
> 
> [LoRA Without Regret - Thinking Machines Lab](https://thinkingmachines.ai/blog/lora/)
> 
> [Fine-tuning LLMs Guide | Unsloth Documentation](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide)
> 
> [Concepts | NeMo Gym](https://docs.nvidia.com/nemo/gym/main/about/concepts/)

### Ablation & Co.
This is a place to get into learning what goes into alignment for both setting and mutating it.

> [How to Remove Censorship from LLM Models with Heretic](https://apidog.com/blog/heretic-uncensoring-guide/)
> 
> [LLMs Unrestrained. “I’m sorry, but I can’t assist with… | by DC | Medium](https://medium.com/@david.chew/llms-unrestrained-43820eff85c1)
> 
> [AI Model Misbehavior in 2026: Scheming, Reward Hacking, and What Comes Next](https://hatchworks.com/blog/gen-ai/ai-model-misbehavior/)

### Some Chatbot Convos
Again, these a here to be skimmed for ideas and hooks to bootstrap your own research off. Not as end all be all stops. They very much are not that but on a skim they cover some decent ground.

> [LLM Features, Alteration, and Trait Exploration - Pt 1](../chatbot_insights/LLM%20Features,%20Alteration,%20and%20Trait%20Exploration%20-%20Pt%201.md)
> 
> [LLM Features, Alteration, and Trait Exploration - Pt 2](../chatbot_insights/LLM%20Features,%20Alteration,%20and%20Trait%20Exploration%20-%20Pt%202.md)

## A Final Note Here
Example axes of development and innovation
-  **Scale efficiency**: MoE, GQA, MLA, quantization, pruning
- **Context length**: Flash Attention, SSM hybrids, extrapolative PEs, KV cache optimization
- **Reasoning depth**: Test-time compute, CoT, PRMs, GRPO
- **Interface breadth**: Multimodality, tool use, agents, structured outputs
- **Alignment control**: RLHF → DPO → GRPO → self-rewarding, plus the counter-movement of uncensored/de-aligned models
- **Deployment efficiency**: Speculative decoding, PagedAttention, hybrid memory, compression

When you are evaluating models, looking for opt-in optimizations you can utilize, and searching for models with particular performance traits these are handy to keep in mind. I recommend if you have the time learning about each axis before the specific techniques and tech so you have an idea of what to look and compare with in your search.

Keep in mind that LLM inference is about far more than just the model you run despite how big a part that plays. Even when looking at the models themselves some are developed for certain inference servers, hardware, or other iteams. Additionally, many models are developed in a way that enables the training or special features they are to be used with such as MTP with some Qwen models.

When you look for models that match your desired experience with the priorities it holds, try finding the industry and research community lingo and lineages for those priorities and amplify your search success by following those trails instead of jumping immidiately to end result search. As you were with chatbots and search bounds (eg. current relevancy and maturity) and associated output details to enable further follow up (eg. usability details) are nice to haves.








