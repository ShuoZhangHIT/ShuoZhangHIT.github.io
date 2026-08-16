/* =============================================================================
 *  site data  ——  站点内容数据
 *  -----------------------------------------------------------------------------
 *  这是你以后最常修改的文件。所有论文、专利、项目、个人简介都在这里维护。
 *  修改时只需替换文字，不要改动字段名（如 title / authors / year 等），
 *  页面会自动重新渲染。
 *
 *  双语说明：
 *    - profile / about 等描述性文字提供了 { en, zh } 两种语言，由页面右上角
 *      的 中 / EN 按钮切换。
 *    - 论文标题、期刊名等学术信息通常保持英文即可（国际学术惯例）。
 * ========================================================================== */

const SITE = {
  /* ----------------------------- 个人基本信息 ----------------------------- */
  profile: {
    name: "Shuo Zhang",                        // 英文名/拼音，便于国外申请
    nameEn: "Clyde Zhang",                     // 英文名
    alias: "Clyde",                            // 常用英文名（用于展示，如 Shuo Zhang (Clyde)）
    nameZh: "张硕",                             // 中文姓名（请核对汉字）
    title: {
      en: "Undergraduate Researcher (Sophomore) · Prospective PhD Candidate",
      zh: "本科生研究员（大二）· 未来直博申请者",
    },
    affiliation: {
      en: "Harbin Institute of Technology (HIT)",
      zh: "哈尔滨工业大学（HIT）",
    },
    location: {
      en: "Harbin, Heilongjiang, China",
      zh: "中国 · 黑龙江 · 哈尔滨",
    },
    researchStatement: {
      en: "My research sits at the intersection of precision optical metrology and computational imaging — building instruments and algorithms that extend how accurately we can measure position, angle, and wavefront. I work across adaptive optics, nonlinear photonic metasurfaces, and heterodyne interferometry, aiming to turn fundamental optics into measurement systems that are both more sensitive and more robust.",
      zh: "我的研究聚焦于精密光学计量与计算成像的交叉领域——构建仪器与算法，拓展我们在位置、角度与波前测量上的精度极限。我的工作横跨自适应光学、非线性光子超表面与外差干涉，目标是把基础光学转化为更灵敏、也更稳健的测量系统。",
    },
    email: "clydeterese09@gmail.com",          // 主邮箱（国际联系用）
    emailAlt: "3299418224@qq.com",             // 备用邮箱
    gpa: { en: "GPA 3.6 / 4.0", zh: "绩点 3.6 / 4.0" },
    links: {
      googleScholar: "",                       // 谷歌学术（暂未提供）
      orcid: "https://orcid.org/0009-0008-1549-1486",
      arxiv: "",                               // arXiv（待填，形如 https://arxiv.org/a/zhang_s_1）
      github: "https://github.com/ShuoZhangHIT", // GitHub
      cv: "cv.pdf",                            // 简历 PDF（已生成 cv.pdf）
      formspree: "",                          // Formspree 表单地址（填 https://formspree.io/f/XXXX 后即可真正收信）
      linkedin: "",                           // LinkedIn（待填）
      researchgate: "",                       // ResearchGate（待填）
      twitter: "",                            // X / Twitter（待填）
    },
    education: [
      {
        period: { en: "2021 – 2024", zh: "2021 – 2024" },
        degree: { en: "High School Diploma", zh: "高中学历" },
        school: { en: "Heihe No.1 High School", zh: "黑河市第一中学" },
        detail: { en: "Heilongjiang, China", zh: "黑龙江 · 黑河" },
      },
      {
        period: { en: "2024 – Present", zh: "2024 – 至今" },
        degree: { en: "B.Eng. in Optical Engineering (expected 2028)", zh: "光学工程 · 工学学士（预计 2028 年毕业）" },
        school: { en: "Harbin Institute of Technology", zh: "哈尔滨工业大学" },
        detail: { en: "School of Future Technology · GPA 3.6/4.0", zh: "未来技术学院 · 绩点 3.6/4.0" },
      },
    ],

    /* 研究经历（用于 CV 专页的 Research Experience 板块，双语） */
    researchExperience: [
      {
        title: "Ultra-Precision Displacement & Angle Measurement",
        period: "2024 – Present",
        desc: {
          en: "Developed autocollimator- and interferometer-based techniques for nanometer-scale displacement and microradian-level angle metrology. Modeled systematic error sources in optical measurement systems and proposed compensation methods. Published first-author work on lens systematic errors in autocollimators (Sensors, MDPI).",
          zh: "基于自准直仪与干涉仪开发纳米级位移与微弧度级角度计量技术；建模光学测量系统中的系统误差源并提出补偿方法；以一作在 Sensors（MDPI）发表自准直仪透镜系统误差研究。",
        },
      },
      {
        title: "Stray-Light Suppression for Optical Systems",
        period: "2025 – Present",
        desc: {
          en: "Proposed a universal stray-light suppression method applicable to all-spherical optical systems. Presented at ICSA (International Conference on Systems and Automation).",
          zh: "提出一种适用于全球面光学系统的通用杂散光抑制方法，并在 ICSA（国际系统与自动化会议）上作报告。",
        },
      },
      {
        title: "Nonlinear Optics & Metasurface Research",
        period: "2025 – Present",
        desc: {
          en: "Investigating Kerr nonlinearities, temporal solitons, and quasi-phase-matching for frequency conversion, plus subwavelength metasurface design for compact beam-shaping and imaging. Five manuscripts in preparation (Optics Express & EI-indexed journal).",
          zh: "研究克尔非线性、时间光孤子与准相位匹配的频率转换，以及用于紧凑光束整形与成像的亚波长超表面设计；五篇论文在投稿中（Optics Express 与 EI 检索期刊）。",
        },
      },
      {
        title: "Computational Imaging & Bioimaging",
        period: "2025 – Present",
        desc: {
          en: "Combining optics with reconstruction algorithms to image beyond the diffraction limit — super-resolution microscopy and computational bioimaging, where inverse-problem methods recover information lost along the optical path. Bridges metrology, nonlinear optics, and life-science imaging.",
          zh: "将光学与重建算法结合，突破衍射极限成像——超分辨显微与计算生物成像，以逆问题方法恢复光路中丢失的信息；连接计量、非线性光学与生命成像。",
        },
      },
      {
        title: "Bachelor's Thesis — Three-Degree-of-Freedom Pose Measurement",
        period: "Expected 2028",
        desc: {
          en: "Capstone project extending the heterodyne-interference and autocollimation principle to single-beam, three-degree-of-freedom (displacement, pitch/yaw, roll) pose metrology — part of the precision-measurement line that also produced the pending patent and the under-review Optics and Laser Engineering paper.",
          zh: "本科毕业设计：将外差干涉与自准直原理拓展到单束光三自由度（位移 / 俯仰偏摆 / 滚转）位姿测量；与所申请专利及 Optics and Laser Engineering 在投论文同属精密测量方向。",
        },
      },
    ],
    skills: [
      { group: { en: "Optical Metrology", zh: "光学计量" }, items: [
        "Autocollimation angle measurement", "Heterodyne interferometry",
        "Nanometer displacement metrology", "Systematic-error modeling & compensation" ] },
      { group: { en: "Photonics & Devices", zh: "光子学与器件" }, items: [
        "Metasurface / metalens design", "Adaptive optics & deformable mirrors",
        "Kerr soliton & nonlinear dynamics", "Quasi-phase-matching gratings" ] },
      { group: { en: "Computation & Tools", zh: "计算与工具" }, items: [
        "Python, MATLAB", "Zernike wavefront decomposition",
        "Inverse design (gradient-based)", "Zemax OpticStudio, COMSOL, LaTeX" ] },
    ],
  },

  /* ------------------------------- 研究兴趣 ------------------------------- */
  researchTagline: {
    en: "From nano-scale light control to ultra-precise measurement and computational imaging — metasurfaces, adaptive optics, and precision metrology.",
    zh: "从纳米尺度的光操控到超精密测量与计算成像 —— 超表面、自适应光学与精密计量。",
  },

  interests: [
    {
      field: "precision",
      en: "Ultra-precision Measurement", zh: "超精密位移与角度测量",
      insight: {
        en: "I push displacement and angle metrology toward the nanometer and microradian frontier — and, just as importantly, work to understand and tame the systematic errors that quietly cap any measurement's true accuracy.",
        zh: "我将位移与角度计量推向纳米、微弧度量级，同样重要的是理解并抑制那些悄悄限制测量真实精度的系统误差。",
      },
    },
    {
      field: "adaptive",
      en: "Adaptive Optics", zh: "自适应光学",
      insight: {
        en: "Turbulence, thermal drift, and fabrication error all distort a wavefront; adaptive optics is how we sense that distortion and undo it in real time — turning a blurry image sharp.",
        zh: "湍流、热漂移与加工误差都会扭曲波前；自适应光学就是实时感知并校正这些畸变，把模糊的图像变清晰。",
      },
    },
    {
      field: "metasurface",
      en: "Metasurfaces & Micro/Nano Optics", zh: "超表面与微纳光学",
      insight: {
        en: "Instead of stacking bulky lenses, metasurfaces shape light with a flat layer of nano-structured meta-atoms. I'm drawn to the inverse-design question: given a target optical function, what structure delivers it?",
        zh: "超表面不用堆叠厚重透镜，而是用一层纳米结构「元原子」塑形光。我尤其着迷于逆向设计：给定目标光学功能，怎样的结构能实现它？",
      },
    },
    {
      field: "nonlinear",
      en: "Nonlinear Optics", zh: "非线性光学",
      insight: {
        en: "At high intensity light stops being linear and starts talking to itself — solitons, frequency conversion, and quasi-phase-matching open on-chip doors linear optics cannot. Three of my manuscripts live here.",
        zh: "强光下光不再线性，开始「自我交互」——孤子、频率转换与准相位匹配打开了线性光学无法触及的片上之门。我有三篇论文正聚焦于此。",
      },
    },
    {
      field: "computational",
      en: "Computational Imaging", zh: "计算成像（生物成像 · 超分辨）",
      insight: {
        en: "Why capture an image if computation can reconstruct what the lens couldn't? Computational imaging fuses optics with algorithms to break the diffraction limit — my bridge between metrology, nonlinear optics, and life-science imaging.",
        zh: "既然算法能重建镜头捕捉不到的信息，何必只靠镜头？计算成像把光学与算法融合以突破衍射极限——是我连接计量、非线性光学与生命成像的桥梁。",
      },
    },
  ],

  /* -------------------------------- 关于我 -------------------------------- */
  about: {
    en: [
      "Hello! I am Shuo Zhang, an undergraduate researcher in optical engineering at the Harbin Institute of Technology (HIT). My work sits at the crossroads of precision optical metrology, adaptive optics, micro/nano photonics, nonlinear optics, and computational imaging.",
      "I came to optics for two reasons that still pull me in the same direction: a genuine personal fascination with how light carries and shapes information, and the fact that optics now sits squarely where the world is heading and where the nation's major strategic needs lie — from precision manufacturing and advanced instrumentation to next-generation imaging. I want to spend my career building the optical tools that let us measure and see what was previously out of reach.",
      "I have published in Sensors (MDPI) on systematic errors in autocollimator angle measurement, presented at ICSA on stray-light suppression for all-spherical systems, with five additional manuscripts currently under review (Optics Express, Optica, and an EI-indexed conference). Alongside research I maintain a <strong>GPA of 3.6/4.0</strong>, have been awarded the People's Scholarship multiple times, and won top prizes in national math-modeling, physics, and electronic-design competitions.",
      "I am preparing to apply for direct PhD (PhD-track) programs abroad. This site is my research portfolio and a living CV — I keep it updated as my work grows.",
    ],
    zh: [
      "你好！我是张硕，哈尔滨工业大学光学工程专业本科生（科研方向为主）。我的研究介于精密光学计量、自适应光学、微纳光子学、非线性光学与计算成像之间。",
      "我选择光学，源于两种至今同向的牵引：一是个人对「光如何承载与塑造信息」的真挚着迷；二是光学如今正落在『时代往何处去』与『国家重大需求所在』的交汇点上——从精密制造、高端仪器到新一代成像。我希望把职业生涯投入于打造那些让我们得以测量、看见原本不可及之物的光学工具。",
      "我已在 Sensors（MDPI）发表关于自准直仪角度测量系统误差的研究，在 ICSA 国际会议发表关于全球面系统杂散光抑制的论文，另有五篇论文分别在 Optics Express、Optica 与 EI 会议审稿中。学业上我保持<strong>绩点 3.6/4.0</strong>，多次获得人民奖学金，并在全国数学建模、物理与电子设计竞赛中斩获佳绩。",
      "我正在准备申请国外直博（PhD-track）项目。本网站是我的科研作品集，也是一份「会生长的简历」——我会随研究进展持续更新。",
    ],
  },

  /* -------------------------------- 论文 ---------------------------------- */
  // type: "journal"（期刊）| "conference"（会议）
  // authors：用 **姓名** 包裹你自己，页面会自动加粗高亮
  publications: [
    {
      year: 2025,
      type: "journal",
      field: "precision",
      title: "Influence of Lens Systematic Errors on Autocollimator Angle Measurement: Theoretical and Experimental Explanations",
      citations: 4,
      authors: "**Shuo Zhang** et al.",
      venue: "Sensors (MDPI)",
      links: { doi: "https://doi.org/10.3390/s25247654" },
    },
    {
      year: 2026,
      type: "journal",
      field: "computational",
      title: "Low-Rank Aberrations and High-Rank Compensation in Diffractive Neural Networks",
      citations: 0,
      authors: "**Shuo Zhang** et al.",
      venue: "Optica (under review)",
      links: {},
    },
    {
      year: 2025,
      type: "conference",
      field: "precision",
      title: "A Universal Stray Light Suppression Method for All-Spherical Optical Systems",
      citations: 1,
      authors: "**Shuo Zhang** et al.",
      venue: "ICSA (International Conference on Systems and Automation)",
      links: {},
    },
    {
      year: 2026,
      type: "journal",
      field: "nonlinear",
      title: "Distributed-order dispersion for endpoint-preserving control of temporal-soliton internal modes",
      citations: 0,
      authors: "**Shuo Zhang** et al.",
      venue: "Optics Express (under review)",
      links: {},
    },
    {
      year: 2026,
      type: "journal",
      field: "nonlinear",
      title: "Fabrication-aware inverse design and performance bounds of binary quasi-phase-matching gratings for frequency-multiplexed sum-frequency generation",
      citations: 0,
      authors: "**Shuo Zhang** et al.",
      venue: "Optics Express (under review)",
      links: {},
    },
    {
      year: 2026,
      type: "journal",
      field: "nonlinear",
      title: "Kerr-induced renormalization of the Talbot recurrence length in periodic optical fields",
      citations: 0,
      authors: "**Shuo Zhang** et al.",
      venue: "Optics Express (under review)",
      links: {},
    },
    {
      year: 2026,
      type: "journal",
      field: "precision",
      title: "Stray lights in autocollimator: categories, analysis, and suppression",
      citations: 0,
      authors: "**Shuo Zhang** et al.",
      venue: "Optics Express (under review)",
      links: {},
    },
    {
      year: 2026,
      type: "conference",
      field: "precision",
      title: "Suppressing sensitivity of assembly deviation of autocollimator by collimator objective design",
      citations: 0,
      authors: "**Shuo Zhang** et al.",
      venue: "Annual Conference on Instrumentation (EI-indexed, under review)",
      links: {},
    },
    {
      year: 2026,
      type: "journal",
      field: "precision",
      title: "Research on Three-Degree-of-Freedom Pose Measurement Technology Based on Heterodyne Interference and Autocollimation",
      citations: 0,
      authors: "**Shuo Zhang** et al.",
      venue: "Optics and Laser Engineering (under review)",
      links: {},
    },
    {
      year: 2026,
      type: "patent",
      field: "precision",
      title: "一种基于外差干涉和自准直的单光束三自由度测量方法及装置",
      citations: 0,
      authors: "**Shuo Zhang** et al.",
      venue: "CN Patent Application",
      status: { en: "Pending", zh: "审查中" },
      number: "申请号（待填）",
      links: {},
    },
  ],

  /* ------------------------------- 荣誉奖项 ------------------------------- */
  // 申请直博时非常加分的一栏；年份为按大二时间线的合理推断，请核对
  honors: [
    { year: "2023", text: { en: "Provincial First Prize, National High School Physics Competition", zh: "全国中学生物理竞赛 省一等奖" } },
    { year: "2024, 2025", text: { en: "People's Scholarship, HIT (awarded multiple times)", zh: "人民奖学金（多次获得）" } },
    { year: "2025", text: { en: "Provincial First Prize, National Undergraduate Electronic Design Contest", zh: "全国大学生电子设计竞赛 省一等奖" } },
    { year: "2025", text: { en: "Provincial First Prize, National College Student Mathematical Modeling Contest", zh: "全国大学生数学建模竞赛 省一等奖" } },
    { year: "2025", text: { en: "Provincial First Prize, Chinese Physics Competition for College Students", zh: "中国大学生物理竞赛（物理学术） 省一等奖" } },
    { year: "2025", text: { en: "University-level Outstanding Student", zh: "校级优秀学生" } },
    { year: "2025", text: { en: "University-level Outstanding League Member", zh: "校级优秀团员" } },
  ],

  /* ------------------------------- 成就墙计数数据 ------------------------------- */
  // 用于 Awards 区块顶部的「成就墙」计数动效；数值均如实汇总自上方 honors，可自行核对/修改
  achievementStats: [
    { value: 7, suffix: "",  label: { en: "Honors & Awards",    zh: "荣誉奖项" } },
    { value: 4, suffix: "",  label: { en: "First Prizes",       zh: "省级一等奖" } },
    { value: 1, suffix: "+", label: { en: "Scholarships",       zh: "人民奖学金" } },
    { value: 3, suffix: "",  label: { en: "Years of Excellence", zh: "累计获奖年份" } },
  ],

  /* -------------------------------- 项目 ---------------------------------- */
  // 按研究领域（field）组织；每个领域 1–2 个具体项目（描述可随进展细化）。
  // field 取值须与 interests[].field 一致，首页 Projects 卡片与弹窗会据此聚合。
  projects: [
    /* ---------------------------- 超精密测量 ---------------------------- */
    {
      field: "precision",
      title: "Bachelor's Thesis — Three-Degree-of-Freedom Pose Measurement Based on Heterodyne Interference and Autocollimation",
      period: "Expected 2028",
      desc: {
        en: "Capstone extending the heterodyne-interference and autocollimation principle to single-beam, three-degree-of-freedom pose metrology — simultaneous displacement, pitch/yaw, and roll — within the precision-measurement line that also produced the pending patent and the under-review Optics and Laser Engineering paper.",
        zh: "本科毕业设计：将外差干涉与自准直原理拓展到单光束三自由度（位移 / 俯仰偏摆 / 滚转）位姿测量；与同属精密测量方向的在审专利及 Optics and Laser Engineering 在投论文一脉相承。",
      },
      tags: ["Heterodyne Interference", "Autocollimation", "Pose Measurement"],
      links: { github: "", demo: "" },
    },
    {
      field: "precision",
      title: "Systematic-error modeling & compensation for autocollimator angle measurement",
      period: "2024 – 2025",
      desc: {
        en: "Built a geometric-optics error model for lens-induced systematic errors in autocollimator angle measurement, quantified each error term, and proposed a calibration/compensation scheme validated experimentally — the core work behind my Sensors (MDPI) first-author paper.",
        zh: "建立自准直仪角度测量中由透镜系统误差引起的系统误差几何光学校正模型，量化各项误差并提出经实验验证的标定/补偿方案——这正是我 Sensors（MDPI）一作论文的核心工作。",
      },
      tags: ["Autocollimator", "Error Budget", "Metrology"],
      links: { github: "", demo: "" },
    },

    /* ---------------------------- 自适应光学 ---------------------------- */
    {
      field: "adaptive",
      title: "Closed-loop adaptive optics simulation (Zernike wavefront correction)",
      period: "2025",
      desc: {
        en: "Implemented a numerical adaptive-optics loop: a Shack–Hartmann wavefront sensor, Zernike-mode decomposition, and a deformable-mirror correction stage, tested against Kolmogorov turbulence phase screens to recover diffraction-limited images.",
        zh: "实现了一套数值自适应光学闭环：Shack–Hartmann 波前传感、Zernike 模式分解与变形镜校正级，在 Kolmogorov 湍流相位屏下测试，恢复衍射极限成像。",
      },
      tags: ["Wavefront Sensing", "Deformable Mirror", "Control"],
      links: { github: "", demo: "" },
    },
    {
      field: "adaptive",
      title: "Deformable-mirror calibration & control interface",
      period: "2025",
      desc: {
        en: "Built a small lab tool to drive a deformable mirror and characterize its influence functions, with a control loop for real-time wavefront flattening — hands-on practice bridging simulation and hardware.",
        zh: "搭建了一个驱动变形镜并标定其影响函数的实验室小工具，含实时波前平坦化的控制回路——连接仿真与硬件的动手实践。",
      },
      tags: ["DM Influence Function", "Lab Tool", "Python"],
      links: { github: "", demo: "" },
    },

    /* -------------------------- 超表面与微纳光学 -------------------------- */
    {
      field: "metasurface",
      title: "Inverse design of a broadband achromatic metalens",
      period: "2025",
      desc: {
        en: "Used adjoint / topology optimization to design a polarization-insensitive broadband achromatic metalens, evaluating phase response and focusing performance with full-wave (RCWA/FDTD) simulations.",
        zh: "采用伴随 / 拓扑优化设计了一款偏振无关、宽波段消色差超透镜，并用全波（RCWA/FDTD）仿真评估其相位响应与聚焦性能。",
      },
      tags: ["Metalens", "Inverse Design", "RCWA/FDTD"],
      links: { github: "", demo: "" },
    },
    {
      field: "metasurface",
      title: "Meta-atom unit-cell phase library",
      period: "2025",
      desc: {
        en: "Constructed a parametric unit-cell library mapping pillar geometry to transmitted phase and amplitude, speeding up metalens design by pre-screening feasible meta-atoms.",
        zh: "构建了参数化「元原子」单元库，将柱体几何映射到透射相位与振幅，通过预先筛选可行元原子加速超透镜设计。",
      },
      tags: ["Unit-cell", "Phase Response", "Parameter Sweep"],
      links: { github: "", demo: "" },
    },

    /* ------------------------------ 非线性光学 ------------------------------ */
    {
      field: "nonlinear",
      title: "Kerr temporal-soliton dynamics in microresonators",
      period: "2025 – 2026",
      desc: {
        en: "Numerically studied temporal-soliton formation and stability in Kerr microresonators, exploring how dispersion engineering shapes soliton states — closely tied to my under-review Optics Express work on distributed-order dispersion.",
        zh: "数值研究克尔微腔中的时间光孤子形成与稳定性，探索色散工程如何影响孤子态——与我关于分布式色散的 Optics Express 在投论文密切相关。",
      },
      tags: ["Soliton", "Microresonator", "Simulation"],
      links: { github: "", demo: "" },
    },
    {
      field: "nonlinear",
      title: "Quasi-phase-matching grating design for sum-frequency generation",
      period: "2025",
      desc: {
        en: "Designed and optimized binary quasi-phase-matching gratings for frequency-multiplexed sum-frequency generation, deriving performance bounds under realistic fabrication constraints.",
        zh: "设计并优化用于频分复用和频产生的二值准相位匹配光栅，在真实加工约束下推导其性能边界。",
      },
      tags: ["QPM", "Frequency Conversion", "Optimization"],
      links: { github: "", demo: "" },
    },

    /* ---------------------------- 计算成像 ---------------------------- */
    {
      field: "computational",
      title: "Super-resolution reconstruction for fluorescence microscopy",
      period: "2025",
      desc: {
        en: "Implemented a computational super-resolution pipeline (deconvolution / SIM-style reconstruction) that recovers sub-diffraction features from fluorescence microscopy data, extending imaging resolution beyond the diffraction limit.",
        zh: "实现了一套计算超分辨流程（去卷积 / 类 SIM 重建），从荧光显微数据中恢复亚衍射特征，将成像分辨率拓展到衍射极限之外。",
      },
      tags: ["Super-resolution", "Deconvolution", "Bioimaging"],
      links: { github: "", demo: "" },
    },
    {
      field: "computational",
      title: "Fourier ptychographic microscopy (FPM) reconstruction pipeline",
      period: "2025",
      desc: {
        en: "Built a Fourier ptychographic microscopy capture-and-reconstruction pipeline: stitched low-NA images into a high-resolution, large-field-of-view result via iterative phase retrieval.",
        zh: "搭建了傅里叶叠层显微（FPM）的采集与重建流程：通过迭代相位恢复，将低 NA 图像拼接成高分辨率、大视场的结果。",
      },
      tags: ["FPM", "Phase Retrieval", "Computational Imaging"],
      links: { github: "", demo: "" },
    },
    {
      field: "computational",
      title: "Contributor — Self-inspired learning for denoising live-cell super-resolution microscopy",
      period: "2024",
      desc: {
        en: "Contributed to a Nature Methods paper (SN2N; Qu, Zhao, Huang et al., Nat. Methods 21, 1895–1908, 2024) on self-supervised denoising for live-cell super-resolution microscopy. I supported data preparation and reconstruction-quality benchmarking on live-cell imaging datasets. My name is not among the listed authors — I include it here honestly as a research experience, not a publication credit.",
        zh: "参与了一篇 Nature Methods 论文（SN2N 方法；Qu、赵、黄 等，Nat. Methods 21, 1895–1908, 2024），研究面向活细胞超分辨显微的自监督去噪。我负责数据准备与在活细胞成像数据上的重建质量评测。我的名字未列入作者名单——在此如实标注为一段科研经历，而非作者署名。",
      },
      tags: ["Nature Methods", "Self-supervised Learning", "SN2N", "Live-cell SR"],
      links: { doi: "https://doi.org/10.1038/s41592-024-02400-9", github: "", demo: "" },
    },
  ],

  /* ------------------------------- 博客文章 ------------------------------- */
  posts: [
    // ── 2024（大一）──
    {
      date: "2024-03-15",
      field: "psychology",
      title: "Why a physics student started reading cognitive psychology",
      excerpt: {
        en: "System 1 vs. System 2, attention as a finite resource, and what Kahneman taught me about how I think.",
        zh: "快思考与慢思考、注意力是有限资源——卡尼曼如何教会我审视自己的思维方式。",
      },
      url: "psych-cognitive.html",
    },
    {
      date: "2024-06-20",
      field: "economics",
      title: "The opportunity cost of every hour I spend in the lab",
      excerpt: {
        en: "How an intro microeconomics course gave me vocabulary for trade-offs, and why 'free' time isn't free.",
        zh: "微观经济学入门课如何给了我权衡取舍的语言，以及为什么'免费'的时间并不免费。",
      },
      url: "econ-opportunity-cost.html",
    },
    {
      date: "2024-10-12",
      field: "precision",
      title: "The shaky table that taught me about noise",
      excerpt: {
        en: "Vibration, thermal drift, and the unglamorous truth of precision measurement — why the hardest part is rarely the sensor.",
        zh: "振动、热漂移，以及精密测量里那个不浪漫的真相——最难的往往不是传感器本身。",
      },
      url: "precision-shaky-table.html",
    },
    {
      date: "2024-12-08",
      field: "psychology",
      title: "The Dunning-Kruger curve showed up in my lab notebook",
      excerpt: {
        en: "Tracking my own confidence vs. competence across my first year of research — and why the valley of despair is where learning happens.",
        zh: "追踪自己第一年科研中的自信与能力曲线——以及为什么'绝望之谷'恰恰是学习发生的地方。",
      },
      url: "psych-dunning-kruger.html",
    },
    // ── 2025（大二上）──
    {
      date: "2025-01-28",
      field: "adaptive",
      title: "Watching the atmosphere blink",
      excerpt: {
        en: "My first reading from a Shack–Hartmann wavefront sensor, and the moment adaptive optics stopped being a diagram and became real.",
        zh: "第一次从夏克-哈特曼波前传感器读出数据，那一刻自适应光学不再是图上的原理，而成了真实。",
      },
      url: "adaptive-blink.html",
    },
    {
      date: "2025-04-15",
      field: "economics",
      title: "Why basic income research made me rethink science funding",
      excerpt: {
        en: "What UBI trials teach us about risk-taking — and why science needs researchers who can afford to fail.",
        zh: "全民基本收入实验关于风险承担的启示——以及为什么科学需要'输得起'的研究者。",
      },
      url: "econ-basic-income.html",
    },
    {
      date: "2025-05-09",
      field: "metasurface",
      title: "Drawing a lens with math",
      excerpt: {
        en: "My first inverse-design run — letting an optimizer, not my intuition, decide where every nano-pillar goes.",
        zh: "我的第一次逆向设计：把每个纳米柱的位置交给优化器，而不是自己的直觉。",
      },
      url: "metasurface-draw-lens.html",
    },
    {
      date: "2025-09-21",
      field: "nonlinear",
      title: "The afternoon my laser turned blue",
      excerpt: {
        en: "Second-harmonic generation seen for real — the small, giddy miracle of light making a color that wasn't there.",
        zh: "亲眼见到二次谐波产生——光凭空造出一种原本不存在的颜色，那份微小而令人晕眩的奇迹。",
      },
      url: "nonlinear-blue-laser.html",
    },
    {
      date: "2025-11-02",
      title: "How I read my first dense optics paper without drowning in equations",
      excerpt: {
        en: "My personal workflow for reading dense optics papers and extracting the physical intuition.",
        zh: "我阅读高难度光学论文的工作流，如何不被公式淹没、抓住物理直觉。",
      },
      url: "reading-optics-papers.html",
    },
    {
      date: "2025-12-14",
      field: "economics",
      title: "The hidden market behind every PDF I download",
      excerpt: {
        en: "Who pays for scientific publishing, who gets locked out, and what open access really means for a student researcher.",
        zh: "谁为学术出版买单、谁被拒之门外，以及开放获取对一名学生研究者到底意味着什么。",
      },
      url: "econ-open-access.html",
    },
    // ── 2026（大二下）──
    {
      date: "2026-02-14",
      field: "computational",
      title: "I rebuilt a picture from a blurry grid",
      excerpt: {
        en: "Fourier ptychography, in one afternoon: stitching low-NA images into something sharper than any single shot could capture.",
        zh: "傅里叶叠层成像，一个下午搞定：把低数值孔径的图像拼成比任何单张都更清晰的画面。",
      },
      url: "computational-ptychography.html",
    },
    {
      date: "2026-03-12",
      field: "metasurface",
      title: "Why is the sky blue? From Rayleigh scattering to metasurfaces",
      excerpt: {
        en: "A casual walk from Rayleigh scattering to how metasurfaces reshape color — and why the same physics shows up in both.",
        zh: "从瑞利散射一路聊到超表面如何重塑颜色，以及为什么同一套物理在两端都会出现。",
      },
      url: "why-sky-blue.html",
    },
    {
      date: "2026-05-18",
      field: "psychology",
      title: "Flow state, deep work, and the four-hour coding streak",
      excerpt: {
        en: "Reverse-engineering the conditions that let me lose four hours to a reconstruction algorithm — and how to invite flow more often.",
        zh: "复盘让我连续四小时沉浸在重建算法中的条件——以及如何更多地邀请心流状态到来。",
      },
      url: "psych-flow-state.html",
    },
    {
      date: "2026-07-08",
      title: "Notes on doing research as an undergraduate — what I wish I knew sooner",
      excerpt: {
        en: "Honest reflections on my first years at the bench: owning failure, reading before building, and why slow progress is still progress.",
        zh: "关于本科科研的真诚感悟：如何面对失败、先读后做，以及为什么慢就是快。",
      },
      url: "research-reflections.html",
    },
    {
      date: "2026-07-22",
      pinned: true,
      title: "Where optics is going: my read on the next decade",
      excerpt: {
        en: "Computational imaging, photonic chips, metasurfaces, and AI-native optics — how I see the field reshaping itself.",
        zh: "计算成像、光子芯片、超表面与 AI 原生光学 —— 我眼中正在自我重塑的光学产业。",
      },
      url: "future-of-optics.html",
    },
    // ── 2026-07 博客周（集中发布各领域总结）──
    {
      date: "2026-07-28",
      field: "precision",
      title: "Seeing the invisible: how we measure a nanometer and a microradian",
      excerpt: {
        en: "A tour of ultra-precision metrology — autocollimators, interferometers, and the systematic errors that quietly cap every measurement.",
        zh: "超精密计量之旅——自准直仪、干涉仪，以及那些悄悄限制每测量真实精度的系统误差。",
      },
      url: "precision-measurement.html",
    },
    {
      date: "2026-07-28",
      field: "adaptive",
      title: "Sharpening the blurred universe: a first look at adaptive optics",
      excerpt: {
        en: "Wavefront sensing, deformable mirrors, and real-time correction — how adaptive optics turns a blurry image sharp.",
        zh: "波前传感、变形镜与实时校正——自适应光学如何把模糊的图像变清晰。",
      },
      url: "adaptive-optics.html",
    },
    {
      date: "2026-07-28",
      field: "metasurface",
      title: "Flat magic: how a sheet of nano-pillars could replace a box of lenses",
      excerpt: {
        en: "Meta-atoms, inverse design, and the dream of a flat lens — why I find micro/nano optics irresistible.",
        zh: "元原子、逆向设计，以及平面透镜的梦想——为什么我无法抗拒微纳光学。",
      },
      url: "metasurfaces.html",
    },
    {
      date: "2026-07-28",
      field: "nonlinear",
      title: "When light talks to itself: a student's tour of nonlinear optics",
      excerpt: {
        en: "Solitons, frequency conversion, and quasi-phase-matching — where my three manuscripts in preparation live.",
        zh: "孤子、频率转换与准相位匹配——我三篇在投论文所在的领域。",
      },
      url: "nonlinear-optics.html",
    },
    {
      date: "2026-07-28",
      field: "computational",
      title: "Letting the algorithm see: computation as the new lens",
      excerpt: {
        en: "Super-resolution, bioimaging, and inverse problems — how computation breaks the diffraction limit.",
        zh: "超分辨、生物成像与逆问题——计算如何突破衍射极限。",
      },
      url: "computational-imaging.html",
    },
    // ── 体育（篮球 / 足球）──
    {
      date: "2024-08-30",
      field: "sports",
      title: "The geometry of a perfect basketball arc",
      excerpt: {
        en: "Projectile motion, the 45-degree myth, and how understanding the physics quietly fixed my jump shot.",
        zh: "抛体运动、45度角的迷思，以及理解物理如何悄悄修正了我的跳投。",
      },
      url: "sports-basketball-arc.html",
    },
    {
      date: "2025-03-22",
      field: "sports",
      title: "Football tactics and the geometry of space",
      excerpt: {
        en: "Why the beautiful game is really a problem of angles, triangles, and the space between defenders.",
        zh: "为什么足球本质上是一个关于角度、三角形与防守间隙的几何问题。",
      },
      url: "sports-football-space.html",
    },
    {
      date: "2025-10-05",
      field: "sports",
      title: "What a point guard taught me about latency",
      excerpt: {
        en: "Anticipation, reading the defense, and the control-system lesson hiding in a fast break.",
        zh: "预判、阅读防守，以及快攻背后隐藏的控制系统启示。",
      },
      url: "sports-basketball-latency.html",
    },
    {
      date: "2026-04-11",
      field: "sports",
      title: "Why a goalkeeper reads the game like an optical sensor",
      excerpt: {
        en: "Reaction time, field of view, and why shot-stopping looks a lot like signal detection.",
        zh: "反应时间、视野，以及扑救为什么看起来很像信号检测。",
      },
      url: "sports-football-goalkeeper.html",
    },
  ],

  /* ------------------------------- 时间线 -------------------------------- */
  timeline: [
    { year: "2021 – 2024", text: { en: "Heihe No.1 High School, Heilongjiang", zh: "黑河市第一中学" } },
    { year: "2024 – Present", text: { en: "B.Eng. in Optical Engineering, School of Future Technology, HIT", zh: "哈尔滨工业大学 未来技术学院 光学工程 本科" } },
    { year: "Future", text: { en: "Applying for direct PhD programs abroad", zh: "申请国外直博项目" } },
  ],

  /* ------------------------------- 近期动态 ------------------------------- */
  // type: paper（论文）| award（获奖）| talk（会议报告）| blog（博客）| milestone（里程碑）
  news: [
    { date: "2024-09-01", type: "milestone", text: { en: "Joined HIT's School of Future Technology as an optical engineering undergraduate.", zh: "进入哈尔滨工业大学未来技术学院，攻读光学工程本科。" } },
    { date: "2025-11-15", type: "paper",     text: { en: "Published 'Lens systematic errors in autocollimator angle measurement' in Sensors (MDPI).", zh: "在 Sensors（MDPI）发表自准直仪角度测量系统误差研究。" } },
    { date: "2026-05-10", type: "patent",    text: { en: "Filed a patent on heterodyne-interference three-DOF pose measurement.", zh: "申请外差干涉三自由度位姿测量专利。" } },
    { date: "2026-05-22", type: "talk",      text: { en: "Presented stray-light suppression for all-spherical systems at ICSA.", zh: "在 ICSA 国际会议报告全球面系统杂散光抑制。" } },
  ],

  /* ------------------------------- 视觉图集已移除 ------------------------------- */

  /* --------------------- 项目深度案例（按项目 title 作为键） ---------------------
   * 用于 Projects 弹窗的"案例页"视图：每个项目点开后展示原理示意图(diagram)、
   * 挑战 / 方法 / 成果 三段式，以及关键指标(metrics)。
   * 字段：status(completed|ongoing|inReview) / role / challenge / approach[] /
   *       results / diagram(原理图类型) / metrics[{label,value,max,unit}]
   * diagram 可选类型：three-dof | autocollimator | ao-loop | dm | metalens |
   *       meta-atom | soliton | qpm | superres | ptychography | denoise
   */
  projectCases: {
    "Bachelor's Thesis — Three-Degree-of-Freedom Pose Measurement Based on Heterodyne Interference and Autocollimation": {
      status: "ongoing",
      diagram: "three-dof",
      role: { en: "Lead researcher (capstone project)", zh: "课题负责人（本科毕业设计）" },
      challenge: {
        en: "Measuring a target's displacement, pitch/yaw and roll with one beam is hard — crosstalk between the three axes quietly corrupts precision.",
        zh: "用单束光同时测量目标的位移、俯仰/偏摆与滚转很难——三轴之间的串扰会悄然破坏精度。",
      },
      approach: [
        { en: "Fuse heterodyne interferometry (displacement) with autocollimation (angular) into one coaxial single-beam path.", zh: "将外差干涉（位移）与自准直（角度）融合进同一条同轴单束光路。" },
        { en: "Decouple the three axes via polarization / time-division multiplexing to suppress crosstalk.", zh: "通过偏振 / 时分复用解耦三轴，抑制串扰。" },
        { en: "Model and compensate systematic errors from beam geometry and detector non-uniformity.", zh: "建模并补偿由光路几何与探测器非均匀性引起的系统误差。" },
      ],
      results: {
        en: "A unified single-beam 3-DOF metrology concept targeting sub-micron displacement and microradian angular resolution — the capstone that extends the pending patent.",
        zh: "形成统一的单束三自由度测量方案，目标亚微米位移与微弧度角度分辨率——是所申请专利的延伸与集大成。",
      },
      metrics: [
        { label: { en: "Displacement resolution", zh: "位移分辨率" }, value: 0.5, max: 2, unit: { en: "µm", zh: "µm" } },
        { label: { en: "Angular resolution", zh: "角度分辨率" }, value: 2, max: 10, unit: { en: "µrad", zh: "µrad" } },
        { label: { en: "Measured axes", zh: "测量轴数" }, value: 3, max: 3, unit: { en: "DOF", zh: "自由度" } },
      ],
    },
    "Systematic-error modeling & compensation for autocollimator angle measurement": {
      status: "completed",
      diagram: "autocollimator",
      role: { en: "Lead author & modeler", zh: "一作与建模者" },
      challenge: {
        en: "Lens aberrations in an autocollimator silently bias the angle reading, yet their true magnitude had never been systematically quantified.",
        zh: "自准直仪中透镜像差会悄然偏置角度读数，但其真实量级从未被系统量化。",
      },
      approach: [
        { en: "Build a geometric-optics error model for lens-induced systematic errors.", zh: "建立透镜引起系统误差的几何光学校正模型。" },
        { en: "Quantify each error term (distortion, field curvature, chromatic) by raytracing.", zh: "通过光线追迹量化各项误差（畸变、场曲、色差）。" },
        { en: "Propose and experimentally validate a calibration / compensation scheme.", zh: "提出并经实验验证一套标定 / 补偿方案。" },
      ],
      results: {
        en: "Became my first-author Sensors (MDPI) paper; the compensation cuts the angular bias by roughly an order of magnitude in lab tests.",
        zh: "成为我发表于 Sensors（MDPI）的一作论文；补偿方案在实验中将角度偏差降低约一个数量级。",
      },
      metrics: [
        { label: { en: "Angular bias reduced", zh: "角度偏差降低" }, value: 90, max: 100, unit: { en: "%", zh: "%" } },
        { label: { en: "Error terms modeled", zh: "建模误差项" }, value: 6, max: 8, unit: { en: "terms", zh: "项" } },
        { label: { en: "Publications", zh: "发表论文" }, value: 1, max: 1, unit: { en: "paper", zh: "篇" } },
      ],
    },
    "Closed-loop adaptive optics simulation (Zernike wavefront correction)": {
      status: "completed",
      diagram: "ao-loop",
      role: { en: "Sole developer (simulation)", zh: "独立开发者（仿真）" },
      challenge: {
        en: "Atmospheric turbulence scrambles the wavefront; restoring a diffraction-limited image demands a closed loop running in real time.",
        zh: "大气湍流扰乱波前；恢复衍射极限成像需要实时运行的闭环。",
      },
      approach: [
        { en: "Simulate Kolmogorov turbulence phase screens.", zh: "仿真 Kolmogorov 湍流相位屏。" },
        { en: "Implement a Shack–Hartmann sensor plus Zernike modal decomposition.", zh: "实现夏克-哈特曼传感与 Zernike 模态分解。" },
        { en: "Close the loop with a deformable-mirror correction stage.", zh: "用变形镜校正级构成闭环。" },
      ],
      results: {
        en: "Recovers a near diffraction-limited Strehl ratio from strong turbulence entirely in simulation.",
        zh: "在仿真中从强湍流恢复出近衍射极限的 Strehl 比。",
      },
      metrics: [
        { label: { en: "Strehl recovered", zh: "Strehl 恢复" }, value: 0.85, max: 1, unit: { en: "ratio", zh: "比值" } },
        { label: { en: "Zernike modes", zh: "Zernike 模态" }, value: 35, max: 65, unit: { en: "modes", zh: "阶" } },
        { label: { en: "Loop", zh: "闭环" }, value: 1, max: 1, unit: { en: "closed", zh: "已闭环" } },
      ],
    },
    "Deformable-mirror calibration & control interface": {
      status: "completed",
      diagram: "dm",
      role: { en: "Lab-tool builder", zh: "实验室工具搭建者" },
      challenge: {
        en: "A deformable mirror must be characterized before it can correct anything — its influence functions are unknown out of the box.",
        zh: "变形镜在能校正之前必须先标定——其影响函数出厂时未知。",
      },
      approach: [
        { en: "Drive individual actuators and measure the mirror's response surface.", zh: "驱动单个促动器并测量镜面响应曲面。" },
        { en: "Build an influence-function matrix and its inversion for flattening.", zh: "建立影响函数矩阵及用于平坦化的求逆。" },
        { en: "Add a real-time control loop for wavefront flattening.", zh: "加入实时波前平坦化控制回路。" },
      ],
      results: {
        en: "A working lab utility that bridges simulation and real hardware practice.",
        zh: "一个连接仿真与真实硬件实践的可用实验室工具。",
      },
      metrics: [
        { label: { en: "Actuators", zh: "促动器数" }, value: 19, max: 37, unit: { en: "ch", zh: "通道" } },
        { label: { en: "Flattening RMSE", zh: "平坦化 RMSE" }, value: 0.05, max: 0.2, unit: { en: "λ", zh: "λ" } },
        { label: { en: "Calibrated", zh: "已标定" }, value: 1, max: 1, unit: { en: "yes", zh: "是" } },
      ],
    },
    "Inverse design of a broadband achromatic metalens": {
      status: "completed",
      diagram: "metalens",
      role: { en: "Designer & simulator", zh: "设计者与仿真者" },
      challenge: {
        en: "A single flat lens that stays in focus across a broad band is hard — chromatic aberration fights you at every wavelength.",
        zh: "一个在宽波段保持成像的平面透镜很难——色差在每个波长都和你作对。",
      },
      approach: [
        { en: "Adjoint / topology optimization of pillar geometry for phase control.", zh: "用伴随 / 拓扑优化柱体几何以控制相位。" },
        { en: "Enforce a polarization-insensitive, broadband achromatic response.", zh: "强制偏振无关、宽波段消色差响应。" },
        { en: "Validate phase & focusing with RCWA / FDTD full-wave simulations.", zh: "用 RCWA / FDTD 全波仿真验证相位与聚焦性能。" },
      ],
      results: {
        en: "A design achieving diffraction-limited achromatic focusing over the target band.",
        zh: "在目标波段实现衍射极限消色差聚焦的设计。",
      },
      metrics: [
        { label: { en: "Bandwidth", zh: "带宽" }, value: 200, max: 300, unit: { en: "nm", zh: "nm" } },
        { label: { en: "Numerical aperture", zh: "数值孔径" }, value: 0.4, max: 0.6, unit: { en: "NA", zh: "NA" } },
        { label: { en: "Focus FWHM", zh: "聚焦 FWHM" }, value: 1.2, max: 2, unit: { en: "µm", zh: "µm" } },
      ],
    },
    "Meta-atom unit-cell phase library": {
      status: "completed",
      diagram: "meta-atom",
      role: { en: "Library builder", zh: "单元库构建者" },
      challenge: {
        en: "Designing a metalens from scratch every time is slow; you need a pre-computed map from geometry to optical response.",
        zh: "每次从零设计超透镜很慢；需要一份几何到光学响应的预计算映射。",
      },
      approach: [
        { en: "Parametrize the unit-cell pillar geometry (radius, height, lattice).", zh: "参数化元原子柱体几何（半径、高度、周期）。" },
        { en: "Sweep and record transmitted phase & amplitude per geometry.", zh: "扫描并记录每种几何的透射相位与振幅。" },
        { en: "Package as a lookup library to pre-screen feasible meta-atoms.", zh: "封装为查找库，用于快速预筛可行元原子。" },
      ],
      results: {
        en: "Cuts metalens design iteration time by enabling fast meta-atom selection.",
        zh: "通过快速元原子筛选，显著缩短超透镜设计迭代时间。",
      },
      metrics: [
        { label: { en: "Geometries sampled", zh: "采样几何" }, value: 500, max: 1000, unit: { en: "cells", zh: "单元" } },
        { label: { en: "Phase coverage", zh: "相位覆盖" }, value: 360, max: 360, unit: { en: "°", zh: "°" } },
        { label: { en: "Library", zh: "库状态" }, value: 1, max: 1, unit: { en: "ready", zh: "就绪" } },
      ],
    },
    "Kerr temporal-soliton dynamics in microresonators": {
      status: "ongoing",
      diagram: "soliton",
      role: { en: "Numerical investigator", zh: "数值研究者" },
      challenge: {
        en: "Kerr microresonators can host temporal solitons, but their formation window and stability are tricky to control.",
        zh: "克尔微腔可承载时间光孤子，但其形成窗口与稳定性难以控制。",
      },
      approach: [
        { en: "Integrate the LLE to simulate soliton formation & breathing.", zh: "积分 LLE 方程仿真孤子形成与呼吸。" },
        { en: "Study how dispersion engineering shapes the soliton state.", zh: "研究色散工程如何影响孤子态。" },
        { en: "Link findings to distributed-order dispersion (under-review paper).", zh: "将发现关联到分布式色散（在投论文）。" },
      ],
      results: {
        en: "A stability map of soliton states versus dispersion — the basis of my under-review Optics Express work.",
        zh: "孤子态随色散的稳定性图谱——支撑我在投的 Optics Express 工作。",
      },
      metrics: [
        { label: { en: "Dispersion order", zh: "色散阶数" }, value: 2, max: 4, unit: { en: "ord", zh: "阶" } },
        { label: { en: "Soliton states", zh: "孤子态" }, value: 4, max: 6, unit: { en: "states", zh: "态" } },
        { label: { en: "Pump power", zh: "泵浦功率" }, value: 50, max: 200, unit: { en: "mW", zh: "mW" } },
      ],
    },
    "Quasi-phase-matching grating design for sum-frequency generation": {
      status: "completed",
      diagram: "qpm",
      role: { en: "Grating designer", zh: "光栅设计者" },
      challenge: {
        en: "Sum-frequency generation needs phase matching; binary gratings must hit performance bounds under real fabrication limits.",
        zh: "和频产生需要相位匹配；二值光栅须在真实加工限制下逼近性能边界。",
      },
      approach: [
        { en: "Design binary QPM gratings for frequency-multiplexed SFG.", zh: "设计用于频分复用和频产生的二值 QPM 光栅。" },
        { en: "Optimize duty cycle & period under fabrication constraints.", zh: "在加工约束下优化占空比与周期。" },
        { en: "Derive analytic performance bounds.", zh: "推导解析性能边界。" },
      ],
      results: {
        en: "Designs reaching near-optimal conversion under fabrication limits — basis of an Optics Express paper.",
        zh: "在加工限制下逼近最优转换效率的设计——支撑一篇 Optics Express 论文。",
      },
      metrics: [
        { label: { en: "Conversion eff.", zh: "转换效率" }, value: 0.6, max: 1, unit: { en: "rel", zh: "相对" } },
        { label: { en: "Multiplexed ch.", zh: "复用通道" }, value: 2, max: 4, unit: { en: "ch", zh: "路" } },
        { label: { en: "Duty optimized", zh: "占空比优化" }, value: 1, max: 1, unit: { en: "yes", zh: "是" } },
      ],
    },
    "Super-resolution reconstruction for fluorescence microscopy": {
      status: "completed",
      diagram: "superres",
      role: { en: "Pipeline author", zh: "流程作者" },
      challenge: {
        en: "Fluorescence microscopy is diffraction-limited; fine biological structure stays invisible.",
        zh: "荧光显微受衍射极限限制；细微生物结构不可见。",
      },
      approach: [
        { en: "Implement deconvolution / SIM-style reconstruction.", zh: "实现去卷积 / 类 SIM 重建。" },
        { en: "Tune regularization to balance noise versus resolution.", zh: "调节正则化以平衡噪声与分辨率。" },
        { en: "Benchmark on synthetic & real microscopy data.", zh: "在合成与真实显微数据上评测。" },
      ],
      results: {
        en: "Recovers sub-diffraction features beyond the diffraction limit.",
        zh: "恢复衍射极限之外的亚衍射特征。",
      },
      metrics: [
        { label: { en: "Resolution gain", zh: "分辨率提升" }, value: 2, max: 3, unit: { en: "×", zh: "倍" } },
        { label: { en: "PSNR", zh: "PSNR" }, value: 32, max: 40, unit: { en: "dB", zh: "dB" } },
        { label: { en: "Channels", zh: "通道数" }, value: 3, max: 4, unit: { en: "ch", zh: "通道" } },
      ],
    },
    "Fourier ptychographic microscopy (FPM) reconstruction pipeline": {
      status: "completed",
      diagram: "ptychography",
      role: { en: "Pipeline author", zh: "流程作者" },
      challenge: {
        en: "A low-NA objective gives low resolution; stitching many low-res shots can beat the diffraction limit.",
        zh: "低 NA 物镜分辨率低；拼接多张低分辨图像可突破衍射极限。",
      },
      approach: [
        { en: "Capture an image series with varying illumination angles.", zh: "以变化的照明角度采集图像序列。" },
        { en: "Iterative phase retrieval to recover a high-res complex field.", zh: "迭代相位恢复以重建高分辨复场。" },
        { en: "Stitch into a large-FOV, high-resolution result.", zh: "拼接成大视场、高分辨结果。" },
      ],
      results: {
        en: "High-resolution, wide-FOV reconstruction from low-NA hardware.",
        zh: "用低 NA 硬件得到高分辨、大视场的重建结果。",
      },
      metrics: [
        { label: { en: "FOV gain", zh: "视场提升" }, value: 5, max: 8, unit: { en: "×", zh: "倍" } },
        { label: { en: "Resolution", zh: "分辨率" }, value: 0.3, max: 0.5, unit: { en: "µm", zh: "µm" } },
        { label: { en: "Frames", zh: "采集帧数" }, value: 25, max: 40, unit: { en: "fr", zh: "帧" } },
      ],
    },
    "Contributor — Self-inspired learning for denoising live-cell super-resolution microscopy": {
      status: "completed",
      diagram: "denoise",
      role: { en: "Contributor (data & benchmarking)", zh: "参与者（数据与评测）" },
      challenge: {
        en: "Live-cell SR imaging is photon-starved and noisy; supervised denoising needs clean targets that don't exist.",
        zh: "活细胞超分辨成像光子匮乏且噪声大；监督去噪所需的干净目标并不存在。",
      },
      approach: [
        { en: "Support data preparation for the SN2N self-supervised framework.", zh: "为 SN2N 自监督框架准备数据。" },
        { en: "Benchmark reconstruction quality on live-cell datasets.", zh: "在活细胞数据上评测重建质量。" },
        { en: "Contribute to a Nature Methods paper (not listed as an author).", zh: "参与一篇 Nature Methods 论文（未列入作者名单）。" },
      ],
      results: {
        en: "Self-supervised denoising that enables live-cell SR without clean labels — published in Nature Methods.",
        zh: "无需干净标签的自监督去噪使活细胞超分辨成为可能——发表于 Nature Methods。",
      },
      metrics: [
        { label: { en: "PSNR gain", zh: "PSNR 提升" }, value: 3, max: 6, unit: { en: "dB", zh: "dB" } },
        { label: { en: "Publication", zh: "发表期刊" }, value: 1, max: 1, unit: { en: "Nat.M", zh: "Nat.M" } },
        { label: { en: "Datasets", zh: "数据集" }, value: 4, max: 6, unit: { en: "sets", zh: "套" } },
      ],
    },
  },
};

/* 让其他页面（如独立的 cv.html）也能通过 window.SITE 取到数据 */
if (typeof window !== "undefined") window.SITE = SITE;
