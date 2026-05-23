import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "pages",
  
  title: "AI Research Mini-Booklet",
  description: "Info on LLM setup and usage organized into a streamlined package.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    //   { text: 'Roadmap', link: '/roadmap/roadmap_overview' }
    ],

    sidebar: [
      {
        text: 'Overivew',
        items: [
          { text: 'Overview', link: '/overview' },
          { text: 'Origin', link: '/index' },
        ]
      },
      {
        text: 'Inference Backend',
        items: [
          { text: 'Inference Server', link: '/inference_backend/inference_server' },
          { text: 'Low Level Pieces', link: '/inference_backend/tensor_libraries_gpu_kernels_drivers_&_the_like' },
          { text: 'Quantization', link: '/inference_backend/quantization' },
          { text: 'Sampling', link: '/inference_backend/sampling' },
          { text: 'Model Architectures', link: '/inference_backend/model_architectures' },
          { text: 'Model Features', link: '/inference_backend/model_features' },
        ]
      },
      {
        text: 'Inference Middleware',
        items: [
          { text: 'Agent Harness', link: '/inference_middleware/agent_harness' },
          { text: 'Tool Calling', link: '/inference_middleware/tool_calling' },
          { text: 'MCP', link: '/inference_middleware/mcp' },
          { text: 'System Prompt', link: '/inference_middleware/system_prompt' },
          { text: 'Skills', link: '/inference_middleware/skills' },
        ]
      },
      {
        text: 'Inference Tooling',
        items: [
          { text: 'Model Gateway', link: '/inference_tooling/model_gateway' },
          { text: 'Agent Framework', link: '/inference_tooling/agent_framework' },
          { text: 'UI', link: '/inference_tooling/ui' },
          { text: 'Memory & Cache', link: '/inference_tooling/memory_and_cache' },
          { text: 'Sandbox & Observability', link: '/inference_tooling/sandbox_and_observability' },
        ]
      },
      {
        text: 'Strategy',
        items: [
          { text: 'Prompt', link: '/strategy/prompt' },
          { text: 'Local Hosting Tunning', link: '/strategy/local_hosting_tuning' },
        ]
      },
      {
        text: 'Extra',
        items: [
          { text: 'OCI Setup', link: '/servers/automation' },
          { text: 'Personal Home Setup', link: '/servers/monitoring' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Daniel-Giszpenc/Homelab' }
    ]
  }
})
