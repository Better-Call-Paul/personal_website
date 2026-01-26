export interface Article {
  slug: string
  title: string
  excerpt: string[]
  sidenote?: string
  heroImage?: string
  content: Array<{
    type: "paragraph" | "heading" | "code" | "image"
    text?: string
    src?: string
    alt?: string
    width?: number
  }>
}

export const articles: Article[] = [
  {
    slug: "outperforming-cublas-blackwell",
    title: "Outperforming cuBLAS on Blackwell",
    excerpt: [""],
    heroImage: "/images/b200.jpg",
    content: [
      {
        type: "heading",
        text: "Blackwell Features: Tensor Memory",
      },
      {
        type: "image",
        src: "/images/tensor-memory-layout.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "Tensor Memory (TMEM) is a new form of on-chip memory that is dedicated exclusively for use by Tensor Cores. As Hopper and prior generations held matrix fragments in register files, this led to significant register pressure where register file space became a critical bottleneck for performance. With the introduction of Tensor Memory, for an MMA instruction, Operand A must be in TMEM or SMEM, B must be in SMEM, and the accumulator must be in TMEM. As a result, 5th generation MMA instructions no longer require any register file space for data, which reduces the register pressure from these operations. Consequently, this lack of registers further decouples MMA from the CTA’s main execution flow which provides further opportunities for pipelining. Overall, the introduction of TMEM is another data point towards the trend of general-purpose computational resources being turned into specialized and ML application specific resources, further ASIC-ification if you will. As seen in the image above, TMEM is organized in a 2 dimensional fashion with 512 columns and 128 rows/lanes, with 256KB per SM.",
      },
      {
        type: "image",
        src: "/images/lane-addressing-diagram.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "Additionally, TMEM has to be allocated dynamically using the tcgen05.alloc PTX instruction where allocation is in units of columns. Also data in TMEM is only used for MMA operations or data movement, so all post and pre-processing will occur outside of TMEM.",
      },
      {
        type: "heading",
        text: "5th Generation Tensor Cores",
      },
      {
        type: "image",
        src: "/images/ptx-cta-group-code.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "The new 5th generation MMA instruction or tcgen05.mma takes a different form than Hopper’s WMMA or WGMMA as it now allows for a 2-CTA case. Also registers are no longer specified in the PTX instruction and operands a and b are shared memory descriptors similar to the ones used in WGMMA. The main difference is that tcgen05.mma expects an instruction descriptor that contains details regarding data type and sparsity.",
      },
      {
        type: "image",
        src: "/images/inline-asm-code.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "Above is my specifc tcgen05.mma PTX instruction implementation.",
      },
      {
        type: "heading",
        text: "2SM MMA",
      },
      {
        type: "image",
        src: "/images/multicast-cluster-diagram.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "The rationale for extending MMAs to 2 CTAs is that CTA tile loads are often redundant, where the redundancy is occurring at the level of tiles as opposed to specific elements. In order to mitigate this, we can now group CTA’s into a 2x2 cluster where SMs can access each other’s shared memory, as opposed to having to load the tile from global memory and then broadcast that memory to its neighbors in the group. This method of multicasting can scale further but for now we will be using a 2x2 cluster where each CTA loads half of its tiles and gets the rest from its peers.",
      },
      {
        type: "heading",
        text: "Hilbert Curve Scheduling",
      },
      {
        type: "image",
        src: "/images/swizzle-pattern.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "Furthering on this concept of working at the CTA level of granularity, we can schedule output tiles of SMs in a Hilbert curve schedule in order to increase our L2 cache hits within the same tile group. Hilbert curve is a space-filling curve that covers all cells within a matrix and ensures that it visits “nearby” cells together. In a sense this pattern is optimizing spatial locality, as a result consecutive tiles will be scheduled at the same time.",
      },
    ],
  },
  {
    slug: "memory-bound-to-communication-bound",
    title: "The New Frontier of GPU Performance: From Memory Bound to Communication Bound",
    excerpt: [
      "For decades, GPU performance optimization has been dominated by the memory wall problem. As we scale to multi-GPU and multi-node systems, a fundamental shift is occurring: the bottleneck is moving from memory bandwidth to inter-GPU communication.",
    ],
    heroImage: "/images/gpu-network.jpg",
    content: [
      {
        type: "image",
        src: "/images/nvidia-gpus-illustration.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "The history of GPU computing has been defined by the memory wall. While compute capabilities have grown exponentially with each generation, memory bandwidth has struggled to keep pace. This disparity led to an entire field of optimization techniques focused on maximizing memory efficiency: tiling, fusion, and careful data layout. But as we enter the era of trillion-parameter models and distributed training across hundreds of thousands of GPUs, a new constraint is emerging.",
      },
      {
        type: "heading",
        text: "The Communication Bottleneck",
      },
      {
        type: "paragraph",
        text: "The evolution of parallelization techniques has made NVLink bandwidth the new bottleneck in GPU performance. Historically, distributed setups of multiple GPUs only employed simple parallelism techniques, like 1D data parallelism where the same model is run across multiple GPUs but with different data. In that world, NCCL (NVIDIA’s inter-GPU communication library) was more than adequate for managing NVLink bandwidth. Yet parallelism did not stop with simply data, as it soon gave rise to the growth of pipeline, tensor, and other 2+D parallelism techniques, which required compute/computation overlapping techniques to maximize bandwidth and minimize potential contentions that would hurt performance. The key implementation difference is that higher-dimension parallelism techniques required dedicated NVLink links and bandwidth for different types of traffic, effectively creating specialized communication patterns that NCCL didn’t natively support. As the centrality of these techniques for model performance continues to grow, the most recent generation of optimizations have used the GPU’s copy engines to perform NVLink communication during computation, effectively hiding potential communication latency.",
      },
      {
        type: "paragraph",
        text: "Altogether, these techniques have blurred the boundary between which kernels are “compute” and “communication,” with some kernels issuing NVLink transfers themselves. This development also mirrors key optimizations on the memory-bound side, where computation in the form of tensor core MMAs are overlapped with loads into shared memory. With increasing potential performance gains from direct control over NVLink communication, new tools have rushed in to provide developers fine-tuned control to more effectively leverage their NVLink bandwidth.",
      },
      {
        type: "heading",
        text: "NVLink and NVLS",
      },
      {
        type: "paragraph",
        text: "NVLink effectively allows one GPU to access the HBM of another GPU using either SM memory instructions (ld/atom/multimem) or copy engines. The CUDA driver utilizes this capability through virtual memory management, whereby a GPU can access memory in a separate device over NVLink by mapping the corresponding physical allocation onto its own virtual address space.",
      },
      {
        type: "image",
        src: "/images/gpu-architecture.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "With the arrival of NVLink Switch (NVSwitch) fabrics and NVLink Switch System (NVLS) topologies, this interconnect has evolved from a point-to-point link into a full crossbar-like communication fabric. NVSwitch enables all-to-all connectivity between GPUs, while NVLS introduces hardware-accelerated multicast and in-switch reduction capabilities. Through issuing multimem instructions on multicast addresses, NVLS allows broadcast and reduce operations to be performed directly on the switch ASIC rather than through each GPU individually. This significantly cuts down the total NVLink traffic required for collective operations and reduces software overhead by shifting part of the reduction logic into hardware. In practice, this means that large-scale tensor or pipeline parallel workloads can achieve near-linear scaling without saturating NVLink bandwidth, as reduction trees are effectively implemented within the switch itself.",
      },
      {
        type: "image",
        src: "/images/nvls-broadcast-comparison.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "This kind of hardware innovation is deeply tied to software–hardware co-design. Each new NVLink or NVSwitch generation has required concurrent updates in CUDA drivers, NCCL kernels, and graph schedulers to expose new capabilities like multicast, asynchronous copies, and address-space coherency. Without corresponding software abstractions, such as SymmetricMemory, these capabilities would remain inaccessible to developers.",
      },
      {
        type: "heading",
        text: "SymmetricMemory",
      },
      {
        type: "paragraph",
        text: "Configuring the memory mapping required for the aforementioned hardware capabilities requires some elbow grease and less common knowledge. While some power users can navigate through the setup process, it becomes a hurdle for more engineers to experiment with and implement their ideas.",
      },
      {
        type: "paragraph",
        text: "SymmetricMemory semantically allows allocations from different devices to be grouped into a symmetric memory allocation. Using the symmetric memory handle, a GPU can access the associated peer allocations through their virtual memory addresses or the multicast address.",
      },
      {
        type: "image",
        src: "/images/virtual-address-mapping.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "SymmetricMemory simplifies the setup process into two steps. First, the user allocates a tensor with symm_mem.empty(). It has identical semantics to torch.empty() but uses a special allocator. Then, the user invokes symm_mem.rendezvous() on the tensor in a collective fashion to establish a symmetric memory allocation. This performs the required handle exchange and memory mapping under the hood.",
      },
      {
        type: "image",
        src: "/images/multi-process-communication.png",
        alt: "x",
      },
      {
        type: "paragraph",
        text: "Remote memory access wouldn’t be useful without synchronization. SymmetricMemory provides CUDA graph–compatible synchronization primitives that operate on the signal pad accompanying each symmetric memory allocation. These primitives are crucial for safe and efficient overlapping of computation and communication, allowing developers to explicitly control NVLink usage patterns at kernel granularity.",
      },
      {
        type: "heading",
        text: "The Increasing Hard-Awareness of Software Design",
      },
      {
        type: "paragraph",
        text: "FlashAttention represented a paradigm shift for memory-bound workloads by rethinking how software should exploit the hierarchy between shared memory and registers. SymmetricMemory plays a similar role for communication-bound workloads, providing the tools to directly program NVLink and NVSwitch fabrics at the same level of granularity as computation. It is an embodiment of hardware–software co-design: as interconnects evolve to support multicast, hardware atomic operations, and switch-level reductions, the software stack evolves in tandem to expose those capabilities safely and ergonomically.",
      },
      {
        type: "paragraph",
        text: "This approach points toward a future where communication becomes a first-class operation in GPU programming, co-optimized alongside computation. Collectives like all-reduce or scatter may eventually fuse directly into kernel graphs, with compiler or runtime systems scheduling NVLink transfers as naturally as tensor core MMAs.",
      },
      {
        type: "heading",
        text: "Where we go from here",
      },
      {
        type: "paragraph",
        text: "As frontier model capabilities are generally increasing with model size, single-GPU nodes are becoming insufficient while multi-GPU nodes dominate. This mirrors how the increasing tile size of tensor core MMAs evolved to match growing model sizes and arithmetic intensity.",
      },
      {
        type: "paragraph",
        text: "In the same way that larger models and the memory wall spurred ever-increasing MMA tile sizes, today’s communication wall is driving co-design between NVLink hardware and the software stack that manages it. Software abstractions like SymmetricMemory push deeper into the hardware layer, managing NVLink bandwidth and synchronization directly. Future CUDA versions may expose even finer control of communication primitives—potentially through new PTX instructions, graph-level collective fusion, or programmable NVSwitch logic.",
      },
      {
        type: "paragraph",
        text: "This is another datapoint in the broader trend of hardware realities shaping software architecture, where communication bandwidth is no longer an external constraint but an explicit dimension of performance optimization. From here, we can expect even tighter co-design between communication fabrics, memory systems, and compiler-level scheduling, blurring the boundary between computation and communication once and for all.",
      },
    ],
  },
  {
    slug: "demise-of-cuda-exaggerated",
    title: "The Demise of CUDA has been Greatly Exaggerated",
    excerpt: [
      "Endless twitter threads, articles, and podcasts frequently declare the end of CUDA and NVIDIA’s dominance. The arguments typically hinge on three main claims: the rise of ASICs will render GPUs obsolete, a new software ecosystem will erode the CUDA moat, and that LLM based agents will make knowledge of CUDA and low-level implementations irrelevant. Yet, closer examination reveals that these predictions fail to capture the nuance and ongoing innovation within NVIDIA’s ecosystem.",
    ],
    heroImage: "/images/cuda-castle.jpg",
    content: [
      {
        type: "image",
        src: "/images/cuda-castle.jpg",
        alt: "NVIDIA castle surrounded by robots illustration",
      },
      {
        type: "paragraph",
        text: "Endless twitter threads, articles, and podcasts frequently declare the end of CUDA and NVIDIA’s dominance. The arguments typically hinge on three main claims: the rise of ASICs will render GPUs obsolete, a new software ecosystem will erode the CUDA moat, and that LLM based agents will make knowledge of CUDA and low-level implementations irrelevant. Yet, closer examination reveals that these predictions fail to capture the nuance and ongoing innovation within NVIDIA’s ecosystem.",
      },
      {
        type: "heading",
        text: "ASIC as a Feature",
      },
      {
        type: "paragraph",
        text: "At its core, all machine learning is the simple yet computationally costly operation of matrix multiplication. It is no wonder then that as LLMs have risen in prominence and usage, there have been growing cries for hardware tailored to this operation. Here’s where ASICs come in. While in the past they’ve largely been sequestered to fields like Bitcoin mining, the promise of massively decreased latency has drawn new startups in this field with Etched (transformer based ASIC) being the most notable. Though this development has raised questions about the long term viability of NVIDIA GPUs, as LLM inference is slated to become the central driver of compute demand, the idea that NVIDIA’s GPUs are falling behind in inference is false.",
      },
      {
        type: "paragraph",
        text: "All of these developments combined would seem to pose a risk of a secular decline in NVIDIA GPUs but that’s the thing, with each new generation of GPUs, NVIDIA GPUs are becoming more ASIC like. The central reason for this is the introduction of Tensor Cores, which are hardware units designed for high-throughput matrix operations specially for fused multiply-add (FMA) on matrices. A standard CUDA core can execute one FMA per thread per cycle, whereas the first generation of Tensor Cores (Volta, 2017) could perform 64 FMA operations per clock. In essence, a Tensor Core works by implementing the operation: D = A x B + C, where A, B, C, and D are matrix fragments that range from 4x4 to larger tiles depending on the given architecture. Fundamentally, Tensor Cores consist of multiple small arrays of Accumulate units which are organized in parallel to compute entire matrix tiles simultaneously. With the execution flow being that input matrices (A, B) and accumulator (C) are partitioned into small tiles, with dimensions depending on the architecture. Each tile is then distributed across threads in a warp (group of 32 threads) where Tensor Core operations like mma.sync are subsequently called; then all threads of a warp hold fragments of each matrix in their local registers and simultaneously trigger a parallel FMA operation where results are simultaneously computed and accumulated back into registers.",
      },
      {
        type: "image",
        src: "/images/tensor-core-operation.webp",
        alt: "Tensor Core matrix multiplication operation showing D = A × B + C with color-coded matrices",
      },
      {
        type: "paragraph",
        text: "Tensor Cores are NVIDIA’s answer to ASICs, where the core functionality and general purpose capabilities of its GPUs are retained but its matrix multiplication capabilities are augmented in a way not dissimilar to ASICs. The performance of Tensor Cores also depends on the given numeric format, with larger formats like FP64 having the lowest throughput and smaller memory formats like INT8 having the highest throughput for inferencing quantized models; as the primary bottleneck in matrix operations stems from memory throughput rather than arithmetic intensity. Though this isn’t just a potential technology that could advance inference performance, but a fully implemented and continually evolving trend that has already led to exponential gains in single-chip inference performance.",
      },
      {
        type: "image",
        src: "/images/inference-performance-gains.webp",
        alt: "Chart showing single-chip inference performance gains of 1000x over 10 years, from various improvements including number representation, complex instructions, process technology, sparsity, and die size",
      },
      {
        type: "paragraph",
        text: "This shift toward matrix multiplication performance is reflected in the increased chip die area allocated to Tensor Cores, which doubled from the Volta to Hopper generation. As a result, Tensor Cores will continue to expand on NVIDIA GPUs, serving as embedded performance accelerators that help counter the thread of standalone ASICs.",
      },
      {
        type: "image",
        src: "/images/tensor-core-die-area.webp",
        alt: "Bar chart showing increase in Tensor Core die area allocation across NVIDIA architectures from Volta (12.5%) to Hopper (25.0%)",
      },
      {
        type: "paragraph",
        text: "In many ways, Tensor Cores resemble ASICs like Google’s TPU, with both being built around matrix multiplication units and share limitations in flexibility, such as limited support for arbitrary instruction execution or free memory access patterns. Yet, NVIDIA GPUs remain highly programmable, even as a growing share of their performance comes from increasingly specialized hardware. The gradual expansion of Tensor Cores across GPU die area doesn’t signal a shift toward fixed-function ASICs, but rather the integration of ASIC-like capabilities within a general-purpose architecture. This hybrid model allows NVIDIA to internalize the benefits of specialized accelerators, reducing the threat posed by external ASIC rivals.",
      },
      {
        type: "heading",
        text: "What PTX is and what it is Not",
      },
      {
        type: "paragraph",
        text: "Another common narrative directed against NVIDIA claims that the “CUDA software moat” will inevitably collapse. This of course raises the fundamental question: what exactly constitutes the CUDA software moat. Critics oversimplify CUDA as “merely a layer of C code” or a collection of high-level APIs.",
      },
      {
        type: "paragraph",
        text: "The depth of this ecosystem becomes evident when examining how CUDA C++ code translates into executable GPU machine code:",
      },
      {
        type: "image",
        src: "/images/cuda-compilation-flow.png",
        alt: "CUDA compilation pipeline flowchart showing the transformation from .cu source files through PTX intermediate representation to SASS assembly and final binary",
        width: 400,
      },
      {
        type: "paragraph",
        text: "Compilation Pipeline: High-level CUDA C++ code first compiles down into NVIDIA's LLVM-based intermediate representation known as NVVM IR through the NVCC compiler. NVVM IR encapsulates high-level constructs into GPU-compatible operations and undergoes initial optimization passes. NVVM IR then translates into PTX assembly, a virtual instruction set architecture designed by NVIDIA. PTX serves as an abstraction layer, providing device-independent intermediate instructions. Importantly, PTX is a human-readable assembly language that defines the GPU's operation in terms of threads, warps, memory hierarchy, and specialized instructions. PTX is assembled by NVIDIA's PTX assembler (ptxas) into SASS, the GPU-specific binary instruction set. SASS directly maps to the GPU hardware execution units, containing highly optimized machine instructions tailored explicitly to individual GPU architectures. The final output is binary GPU executable code, which is directly loaded and executed by NVIDIA GPUs through the CUDA driver.",
      },
      {
        type: "paragraph",
        text: "Each stage, whether it’s NVVM IR, PTX, SASS, or the final binary, remains a part of the CUDA ecosystem. As a result, even if a developer bypasses one layer (like writing PTX directly instead of CUDA C++) they are still operating within CUDA. With that in mind, the assertion that developers bypass CUDA by using PTX is fundamentally mistaken.",
      },
      {
        type: "paragraph",
        text: "Though some commenters have yet to take notice:",
      },
      {
        type: "image",
        src: "/images/ptx-quote.png",
        alt: "Quote about PTX being used to bypass CUDA and go to bare metal",
        width: 400,
      },
      {
        type: "paragraph",
        text: "In fact, the strategic use of PTX underscores the gravitational pull of CUDA. As developers dive deeper into PTX precisely because they seek additional performance optimization beyond what the high level CUDA C++ API can offer. Consider the distinction between the WMMA API and WGMMA PTX instructions:",
      },
      {
        type: "paragraph",
        text: "• WMMA API: Limited to operations within a single warp, restricting the tile size of matrix multiplications and flexibility.",
      },
      {
        type: "paragraph",
        text: "• WGMMA PTX Instructions: Introduced in the Hopper architecture, these allow multiple warps to collaboratively execute larger, more complex matrix multiply-accumulate operations. This significantly reduces synchronization overhead compared to chaining multiple WMMA calls.",
      },
      {
        type: "paragraph",
        text: "The critical nuance here is that while WGMMA functionality currently only exists through inline PTX, which necessitates developers accessing further CUDA documentation. Thus, developers use of inline PTX selectively to extract performance gains, illustrates the depth and optimization potential within CUDA's software stack. Moreover, the extensive optimization layers embedded throughout CUDA, from low-level instruction refinements in PTX to sophisticated compiler optimizations, are not accidental or transient. They reflect nearly two decades of deliberate development and continual enhancement. Like an industrial ecosystem that develops specialized suppliers for its needs, each CUDA iteration has driven further API innovation and compiler advancements, reinforcing the software moat. This relentless pursuit of performance and efficiency inherently increases the difficulty competitors face in matching CUDA's capabilities, underscoring the robustness and longevity of NVIDIA's ecosystem.",
      },
      {
        type: "heading",
        text: "The supposed “death” of the CUDA Kernel Engineer",
      },
      {
        type: "paragraph",
        text: "In line with claims about the impending end of CUDA, a recent narrative has emerged declaring that the era of human CUDA kernel engineers is at an end. Despite these bold declarations, reality suggests otherwise. Perhaps the most notable of which comes from Sakana Labs:",
      },
      {
        type: "image",
        src: "/images/sakana-ai-cuda-engineer.png",
        alt: "Sakana Labs announcement about The AI CUDA Engineer paper and dataset of 17,000 verified CUDA kernels",
      },
      {
        type: "paragraph",
        text: "Sakana Labs launched its AI CUDA Engineer which was purported to be able to automate the work of human CUDA programmers. Through an agentic framework designed to automate the generation and optimization of CUDA kernels from PyTorch code. The reported gains were phenomenal, with initial reports showing 10 to 100 times faster than equivalent pytorch operations, and up to 5 times faster than hand-optimized CUDA libraries. This was an incredible outcome, and it would've revolutionized the AI library and framework world if it weren't for one small detail, it was fundamentally flawed.",
      },
      {
        type: "image",
        src: "/images/sakana-debunk.png",
        alt: "Sakana Labs announcement about The AI CUDA Engineer paper and dataset of 17,000 verified CUDA kernels",
      },
      {
        type: "paragraph",
        text: "Investigations revealed that the AI optimization agent exploited a vulnerability in the evaluation process, specifically a bug in the reward-validation script. This bug enabled the agent to bypass critical correctness checks, allowing the AI-generated kernels to falsely register high performance by either skipping computations entirely or manipulating memory states to present incorrect results as correct. After correcting the kernels, the supposed 100-fold improvement plummeted to a slowdown of about 0.3 times compared to baseline PyTorch kernels.",
      },
      {
        type: "image",
        src: "/images/o3-mini-benchmark.png",
        alt: "Sakana Labs announcement about The AI CUDA Engineer paper and dataset of 17,000 verified CUDA kernels",
      },
      {
        type: "paragraph",
        text: "This incident illustrates a broader misrepresentation regarding CUDA’s future. Rather than signaling CUDA’s impending irrelevance, this episode reinforces the critical importance of understanding low level CUDA kernel programming.",
      },
      {
        type: "heading",
        text: "Moving Forwards",
      },
      {
        type: "paragraph",
        text: "Overall, the narrative of CUDA's demise is largely a misinterpretation of both hardware evolution and software innovation. NVIDIA's strategic integration of tensor cores/ASICs as a feature have demonstrated a deliberate push into enhanced performance rather than obsolesce in the compute ecosystem. Similarly, the PTX kerfuffle and Sakana Lab's AI CUDA Engineer highlight the difficulty and necessity of understanding deeper layers of the CUDA ecosystem in order to maintain frontier CUDA kernel performance. Taken together, these incidents all illustrate the increasing necessity for deeply understanding CUDA instead of retrenchment to higher levels of abstraction.",
      },
    ],
  },
]
