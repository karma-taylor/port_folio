export const PROJECTS = [
  {
    id: "calendar",
    index: "01",
    size: "wide",
    status: "live",
    statusLabel: "已上线",
    title: "工作日历协同系统（Work Calendar）",
    titleLong: "工作日历协同系统（Work Calendar）",
    outcomes: [
      "冲突在保存前暴露",
      "任务状态可跨设备恢复",
      "支持分段参与而非整段默认参与",
    ],
    cover: {
      src: "./calendar-cover-auto.png",
      version: "20260625-live-capture",
      alt: "工作日历协同系统项目封面",
    },
    hoverValue:
      "把多人排期、分段参与、Excel 名单和云端同步做成真正可用的规则系统，减少重复确认。",
    hoverCta: {
      href: "https://work-calendar-52c.pages.dev",
      label: "访问演示",
      aria: "访问工作日历协同系统演示",
    },
    tech: [
      { type: "framework", label: "React" },
      { type: "framework", label: "Vite" },
      { type: "tool", label: "Supabase" },
      { type: "ai", label: "Cursor" },
      { type: "ai", label: "Codex" },
      { type: "deploy", label: "Cloudflare Pages" },
    ],
    route: [
      { label: "前端", value: "React / Vite / JavaScript" },
      { label: "服务", value: "Supabase 实时同步" },
      { label: "数据AI", value: "Excel 名单导入 / 分段参与 / 冲突校验" },
      { label: "部署", value: "Cloudflare Pages" },
    ],
    flow: {
      ariaLabel: "工作日历协同系统业务流程",
      steps: [
        { idx: "01", label: "名单导入" },
        { idx: "02", label: "分段安排" },
        { idx: "03", label: "冲突校验" },
        { idx: "04", label: "云端同步", accent: true },
      ],
    },
    github: {
      href: "https://github.com/karma-taylor/work_calendar",
      magnetic: true,
      magneticStrength: 0.25,
    },
    detail: {
      heroTeaser:
        "把 Excel 协调型排期，产品化为一套可上线、可复核的规则系统。",
      caseStudy: {
        eyebrow: "代表作拆解",
        title: "把多人协同排期，抽象成一套系统能执行的产品规则",
        intro:
          "这不是把表格搬到网页，而是把人、时间窗、角色、冲突和恢复机制组织成一套真正能支撑协同的产品能力。",
        bullets: [
          "错误在保存前暴露，而不是事后返工",
          "任务状态可跨设备恢复，减少中断成本",
          "分段参与更贴近真实协同，而非整段默认参与",
        ],
      },
      focus: {
        tagline:
          "让“谁在什么时间参与、有没有撞期”在保存前就被系统拦住，减少反复确认。",
        problem:
          "适用于需要多人协同排期、资源分配和任务统筹的团队。核心痛点是同一任务存在多人分段参与，Excel 名单又频繁变化，人工对齐时间窗很容易撞期。",
        ownership:
          "我负责需求拆解、流程建模、交互原型、冲突规则设计、名单导入策略、Supabase 数据结构设计与上线验证。",
        flowSummary:
          "月视图展示任务跨周占用 → 人员分段参与 → 以“分段”为粒度做冲突校验 → 本地与云端双持久化。",
        productJudgment:
          "我没有把它做成自由编辑表格，而是先锁定任务、人员分段和冲突规则，让错误在保存前暴露，优先保证排期正确性。",
        promptDesign: {
          goal: "生成一个可部署的协同日历系统，覆盖任务、分段、冲突规则与名单导入。",
          inputs: "任务起止、参与人员、角色、分段起止时间，以及 Excel 名单映射关系。",
          rules: "冲突粒度到人和分段；时间区间相交则禁止保存；所有分段必须落在任务总区间内。",
          output: "可运行前端、冲突函数、Supabase SQL 以及部署说明。",
          safeguards: "未选人员、非法日期、跨区间分段都直接阻止保存；云端失败时回退本地缓存。",
          excerpt:
            "你是复杂协同流程设计专家与资深前端工程师。目标是构建一个支持多人分段参与、保存前冲突校验、云端同步的月历型工作台。",
        },
      },
      recruiting: {
        background:
          "我把排期这类高规则密度场景，从“人工协调”推进成“系统先判断、用户再确认”的产品模式。",
        usersScene: "适用于项目协调、任务分配、多人协同参与与排期管理场景。",
        coreProblem: "Excel 易撞期、状态易丢失、规则难沉淀。",
        risks: "后续仍可继续补充权限与历史审计能力。",
        results: [
          { label: "规则前置", value: "保存前校验" },
          { label: "协同方式", value: "支持分段参与" },
          { label: "状态恢复", value: "跨设备可续接" },
          { label: "上线形态", value: "Cloudflare Pages" },
        ],
      },
      summary:
        "面向多人协同排期场景的可视化日历工具。真正解决的不是“做一个日历”，而是把人员、角色、时间窗和冲突约束抽象成系统可执行的规则。",
      prompt:
        "Prompt：请实现一个支持月视图排期、多人分段参与、保存前冲突校验、Excel 名单导入以及 Supabase 持久化的协同工作日历系统。",
      links: [
        {
          type: "live",
          href: "https://work-calendar-52c.pages.dev",
          label: "访问上线版本",
        },
        {
          type: "github",
          href: "https://github.com/karma-taylor/work_calendar",
          label: "查看 GitHub",
        },
      ],
    },
  },
  {
    id: "digest",
    index: "02",
    size: "tall",
    status: "live",
    statusLabel: "已上线",
    title: "资讯日报订阅系统（HamHome Daily Digest）",
    titleLong: "资讯日报订阅系统（HamHome Daily Digest）",
    outcomes: [
      "多源信息自动整理成结构化日报",
      "摘要结果可复用到邮件模板与前端页面",
      "定时推送替代高频手工汇总",
    ],
    cover: {
      src: "./digest-cover-auto.png",
      version: "20260625-live-capture",
      alt: "HamHome Daily Digest 项目封面",
    },
    hoverValue:
      "把分散资讯整理成定时送达的结构化日报，用 Agent 思路替代重复摘要劳动。",
    hoverCta: {
      href: "https://hamhome-digest-web.pages.dev/digest",
      label: "访问演示",
      aria: "访问 HamHome Daily Digest 演示",
    },
    tech: [
      { type: "lang", label: "Python" },
      { type: "framework", label: "RAG" },
      { type: "tool", label: "定时任务" },
      { type: "ai", label: "LLM API" },
      { type: "ai", label: "Cursor" },
      { type: "ai", label: "Codex" },
      { type: "deploy", label: "Cloudflare Pages" },
    ],
    route: [
      { label: "前端", value: "React 19 / Next.js 16 / TypeScript" },
      { label: "服务", value: "Cloudflare Workers / Hono" },
      { label: "数据AI", value: "D1 / Drizzle / Queue / OpenAI 兼容接口" },
      { label: "部署", value: "pnpm workspace / Turborepo / Wrangler" },
    ],
    flow: {
      ariaLabel: "资讯日报订阅系统业务流程",
      steps: [
        { idx: "01", label: "多源抓取" },
        { idx: "02", label: "主题分栏" },
        { idx: "03", label: "结构化摘要" },
        { idx: "04", label: "邮件推送", accent: true },
      ],
    },
    github: {
      href: "https://github.com/karma-taylor/Daily_digest",
      magnetic: true,
      magneticStrength: 0.25,
    },
    detail: {
      focus: {
        tagline:
          "多源资讯抓取、主题分栏，并定时生成可直接消费的结构化日报。",
        problem:
          "面向需要高频跟踪多源信息的产品、运营和研究角色。痛点在于信息源碎、重复阅读成本高，还要按时区对齐“当天”要点。",
        ownership:
          "我负责订阅场景梳理、主题分栏策略、摘要结构定义、定时推送机制以及结果验收口径。",
        flowSummary:
          "多源抓取 → 去重分栏 → 结构化摘要 → 邮件与页面双端输出。",
        productJudgment:
          "我优先输出可消费的结构化日报，而不是一次性长文总结，先保证按时送达与可复用，再逐步增强深度分析能力。",
        promptDesign: {
          goal: "把多条资讯摘要压缩成按主题组织的结构化 JSON，便于下游直接渲染。",
          inputs: "多条资讯摘要、主题清单和订阅时区。",
          rules: "客观、去重、不编造；只输出 JSON；每个主题保留一句总述和若干要点。",
          output: "单一 JSON：主题 → {总述, 要点[]}。",
          safeguards: "跨时区越界与重复条目先过滤；字段缺失时降级为简版摘要并标记来源不完整。",
          excerpt:
            "你是专业新闻编辑。请基于多条资讯摘要，按指定主题输出结构化 JSON，每个主题包含一句总述和要点列表。",
        },
      },
      recruiting: {
        background:
          "我关注的是把“读很多来源”变成“稳定收到一份结构化结果”，而不是单纯做信息抓取。",
        usersScene: "适用于需要晨报、晚报、行业订阅和内部情报汇总的团队。",
        coreProblem: "多源信息碎片化，人工摘要成本高，缺少稳定送达。",
        risks: "后续可以继续扩展更细的主题标签与人工反馈闭环。",
        results: [
          { label: "信息获取", value: "多源自动抓取" },
          { label: "结果形态", value: "结构化日报" },
          { label: "交付方式", value: "邮件 + Web" },
          { label: "驱动模式", value: "定时自动推送" },
        ],
      },
      summary:
        "基于 Agent + RAG 思路的自动化资讯订阅平台，重点在于把多源信息稳定加工成可订阅、可复用、可按时送达的内容产品。",
      prompt:
        "Prompt：基于多条资讯摘要，按指定主题输出结构化 JSON，每个主题提供一句总述和若干要点，并保证内容客观、去重、可复用。",
      links: [
        {
          type: "live",
          href: "https://hamhome-digest-web.pages.dev/digest",
          label: "访问上线版本",
        },
        {
          type: "github",
          href: "https://github.com/karma-taylor/Daily_digest",
          label: "查看 GitHub",
        },
      ],
    },
  },
  {
    id: "money",
    index: "03",
    size: "tall",
    status: "live",
    statusLabel: "已上线",
    title: "轻松配钞（Money Distribute AI）",
    titleLong: "轻松配钞：薪资分配策略工具（Money Distribute AI）",
    outcomes: [
      "批量配钞约 30 分钟压缩至 3 分钟",
      "网页端与小程序端复用同一拆分口径",
      "Excel 批量导入导出结果可复核",
    ],
    cover: {
      src: "./money-cover-auto.png",
      version: "20260625-live-capture",
      alt: "轻松配钞项目封面",
    },
    hoverValue:
      "把高频、易错的薪资拆分与配钞流程，做成双端可用的规则工具。",
    hoverCta: {
      href: "https://karma-taylor.github.io/money_classify/",
      label: "访问演示",
      aria: "访问轻松配钞演示",
    },
    tech: [
      { type: "lang", label: "JavaScript" },
      { type: "tool", label: "Excel 导入导出" },
      { type: "framework", label: "微信小程序" },
      { type: "ai", label: "Cursor" },
      { type: "ai", label: "Codex" },
      { type: "deploy", label: "GitHub Pages" },
    ],
    route: [
      { label: "前端", value: "原生 HTML / CSS / JavaScript" },
      { label: "终端", value: "微信原生小程序 WXML / WXSS / JS" },
      { label: "数据AI", value: "SheetJS / 贪心配钞算法 / Excel 批量导入导出" },
      { label: "部署", value: "GitHub Pages / 微信开发者工具" },
    ],
    flow: {
      ariaLabel: "轻松配钞业务流程",
      steps: [
        { idx: "01", label: "勾选面额" },
        { idx: "02", label: "贪心拆分" },
        { idx: "03", label: "余数校验" },
        { idx: "04", label: "批量导出", accent: true },
      ],
    },
    github: {
      href: "https://github.com/karma-taylor/money_classify",
      magnetic: true,
      magneticStrength: 0.25,
    },
    detail: {
      focus: {
        tagline:
          "批量计算发薪配钞方案，自动校验余数与贪心拆分结果。",
        problem:
          "面向人力、财务与协同发薪场景。痛点是多档面额组合复杂、余数容易出错、批量名单处理成本高，还要兼容既有 Excel 习惯。",
        ownership:
          "我负责需求梳理、拆分规则定义、批量导入导出流程设计、异常校验策略，以及网页端与小程序端口径统一。",
        flowSummary:
          "勾选可用面额 → 按从大到小贪心拆分 → 校验余数与异常金额 → 一键导出固定列顺序。",
        productJudgment:
          "我优先保证“算得对、导得出、能批量复核”，而不是堆叠复杂交互，确保下游流程稳定接住输出结果。",
        promptDesign: {
          goal: "在给定可选面额下，为每笔金额拆解张数并返回余数，同时支持批量输入输出。",
          inputs: "单笔金额、可选面额，或 A 列姓名 / B 列薪资的批量表。",
          rules: "金额必须非负；必须至少勾选一种面额；导出列顺序固定。",
          output: "每笔金额的面额张数、余数与批量导出表。",
          safeguards: "未选面额与异常金额直接提示；解析失败行单独标记，不阻塞整体结果。",
          excerpt:
            "你是现金配钞助手。请按从大到小优先的策略，为每笔薪资计算各面额张数和余数，并输出固定列顺序结果。",
        },
      },
      recruiting: {
        background:
          "我在意的不是算法名词本身，而是把反复发生的规则判断变成稳定可交付的小产品。",
        usersScene: "适用于发薪、现金分发、批量换钞与柜台场景。",
        coreProblem: "人工拆分慢、余数易错、批量名单校对成本高。",
        risks: "后续可以继续补充更多票面和更细的异常处理策略。",
        results: [
          { label: "处理速度", value: "30min → 3min" },
          { label: "输入方式", value: "单笔 + Excel 批量" },
          { label: "输出形式", value: "固定列导出" },
          { label: "交付终端", value: "Web + 小程序" },
        ],
      },
      summary:
        "一款面向高规则密度场景的薪资分配策略工具。相比强调“贪心算法”，它更体现我如何把重复、易错的流程做成双端可用的小产品。",
      prompt:
        "Prompt：根据当日可用纸币面额，为单笔或批量薪资计算各面额张数与余数，支持 Excel 导入导出，并对异常金额和空面额选择给出明确提示。",
      links: [
        {
          type: "live",
          href: "https://karma-taylor.github.io/money_classify/",
          label: "访问上线版本",
        },
        {
          type: "github",
          href: "https://github.com/karma-taylor/money_classify.git",
          label: "查看 GitHub",
        },
      ],
    },
  },
  {
    id: "fx",
    index: "04",
    size: "featured",
    status: "live",
    statusLabel: "已上线",
    title: "汇率换算 Agent（Weather FX Agent）",
    titleLong: "汇率换算 Agent（Weather FX Agent）",
    outcomes: [
      "多银行参考与防呆纠偏，结果可复核",
      "弱网 / 缓存降级策略保证可用性",
      "把换算过程做成可交付而非黑盒结果",
    ],
    cover: {
      src: "./fx-cover-auto.png",
      version: "20260625-live-capture",
      alt: "汇率换算 Agent 项目封面",
    },
    hoverValue:
      "把“今天哪家汇率更合适”变成可执行、可复核的换算结果，兼顾弱网可用。",
    hoverCta: {
      href: "https://karmacat-weather-fx-agent.hf.space",
      label: "访问演示",
      aria: "访问汇率换算 Agent 演示",
    },
    tech: [
      { type: "lang", label: "JavaScript" },
      { type: "lang", label: "HTML / CSS" },
      { type: "tool", label: "汇率 API" },
      { type: "ai", label: "Hugging Face" },
      { type: "ai", label: "Cursor" },
      { type: "ai", label: "Codex" },
    ],
    route: [
      { label: "前端", value: "原生 HTML / CSS / JavaScript" },
      { label: "服务", value: "Hugging Face Space" },
      { label: "数据AI", value: "多银行汇率参考 / 防呆纠偏 / 缓存降级" },
      { label: "部署", value: "Hugging Face Spaces" },
    ],
    flow: {
      ariaLabel: "汇率换算 Agent 业务流程",
      steps: [
        { idx: "01", label: "输入金额" },
        { idx: "02", label: "多源汇率" },
        { idx: "03", label: "防呆纠偏" },
        { idx: "04", label: "换算输出", accent: true },
      ],
    },
    github: {
      href: "https://github.com/karma-taylor/weather-fx-agent",
      magnetic: true,
      magneticStrength: 0.25,
    },
    detail: {
      focus: {
        tagline:
          "多银行汇率参考与防呆纠偏，输出可复核的换算结果。",
        problem:
          "面向跨境结算、差旅报销和柜台咨询场景。痛点在于多来源汇率不一致、手算容易出错、弱网环境下仍需快速出数。",
        ownership:
          "我负责场景拆解、汇率口径定义、换算纠偏规则、异常提示设计，以及缓存与弱网策略验证。",
        flowSummary:
          "输入币种和金额 → 选择参考汇率 → 方向互换时做倒数修正 → 输出结果与口径说明。",
        productJudgment:
          "我不做“黑盒换算结果”，而是明确展示所用来源和汇率口径，优先保证结果可复核与可交付。",
        promptDesign: {
          goal: "根据 base / target / amount / rate 返回可审计的换算结果。",
          inputs: "base、target、amount 及可选 rate，必要时回退缓存汇率。",
          rules: "固定模式下使用 amount × rate；方向互换先取倒数；禁止输出营销化语言。",
          output: "结果数值、rate_used 文案与来源说明。",
          safeguards: "非法币种、负数金额或缺失汇率时拒绝计算并给出明确提示。",
          excerpt:
            "你是汇率换算助手。请根据 base、target、amount 和可选 rate 返回结果、汇率说明和来源标签。",
        },
      },
      recruiting: {
        background:
          "这个项目更像一次‘结果可信度设计’练习，而不是单纯做一个换算器。",
        usersScene: "适用于报销、差旅、柜台咨询和跨境结算场景。",
        coreProblem: "汇率来源不一致、人工换算易错、弱网场景仍需出数。",
        risks: "后续可继续增强历史汇率与银行对比视图。",
        results: [
          { label: "结果可信度", value: "可复核" },
          { label: "参考方式", value: "多源汇率" },
          { label: "异常处理", value: "防呆纠偏" },
          { label: "网络策略", value: "缓存降级" },
        ],
      },
      summary:
        "面向业务场景的汇率换算 Web 工具，支持多银行参考、固定汇率、防呆纠偏与弱网可用。重点在于结果的可信度与可追溯性。",
      prompt:
        "Prompt：根据用户输入的 base、target、amount 和 rate（可选），返回换算结果、汇率说明和来源标签，保证方向互换时可正确取倒数。",
      links: [
        {
          type: "live",
          href: "https://karmacat-weather-fx-agent.hf.space",
          label: "访问上线版本",
        },
        {
          type: "github",
          href: "https://github.com/karma-taylor/weather-fx-agent",
          label: "查看 GitHub",
        },
      ],
    },
  },
  {
    id: "report",
    index: "05",
    size: "small",
    status: "wip",
    statusLabel: "代码案例",
    title: "日报自动化生成引擎（Business Daily Report Engine）",
    titleLong: "日报自动化生成引擎（Business Daily Report Engine）",
    outcomes: [
      "单次日结统计从约 2 小时压缩到 10 分钟内",
      "多维数据自动清洗并按模板秒级生成日报",
      "异常清单随结果一起输出，便于复核",
    ],
    cover: {
      src: "./report-cover.png",
      version: "20260512-darkrep",
      alt: "日报自动化生成引擎项目封面",
    },
    hoverValue:
      "用 Python 脚本替代日结中的手工搬数与排版，把多表清洗、模板渲染和异常勾核做成稳定链路。",
    hoverCta: {
      href: "https://github.com/karma-taylor/Daily_report",
      label: "查看代码",
      aria: "查看日报自动化生成引擎代码仓库",
    },
    tech: [
      { type: "lang", label: "Python" },
      { type: "framework", label: "pandas" },
      { type: "framework", label: "openpyxl" },
      { type: "ai", label: "Cursor" },
      { type: "ai", label: "Codex" },
      { type: "framework", label: "Streamlit" },
    ],
    route: [
      { label: "运行时", value: "Python / Streamlit" },
      { label: "服务", value: "本地脚本流程" },
      { label: "数据AI", value: "pandas / openpyxl / 模板渲染 / 异常勾核" },
      { label: "部署", value: "本地运行 / GitHub 代码案例" },
    ],
    flow: {
      ariaLabel: "日报自动化生成引擎业务流程",
      steps: [
        { idx: "01", label: "数据采集" },
        { idx: "02", label: "业务清洗" },
        { idx: "03", label: "模板渲染" },
        { idx: "04", label: "异常勾核", accent: true },
      ],
    },
    github: {
      href: "https://github.com/karma-taylor/Daily_report",
      magnetic: true,
      magneticStrength: 0.25,
    },
    detail: {
      focus: {
        tagline:
          "日报数据自动汇总、对齐模板，并秒级输出异常清单。",
        problem:
          "面向结算与运营日报场景。痛点在于多表合并、规则复杂、模板格式不能丢，人肉处理既慢又容易返工。",
        ownership:
          "我负责规则抽象、模板字段映射、异常校验定义、自动化流程编排以及结果验收标准制定。",
        flowSummary:
          "采集 A 表与历史模板 → pandas 清洗合并与规则校验 → 渲染 B/C/D 表 → 输出异常清单供人工勾核。",
        productJudgment:
          "我先保证模板一致性和结果可追溯，再追求极致速度，把‘可复核’作为自动化交付的第一优先级。",
        promptDesign: {
          goal: "按业务规则从 A 表生成当日 B/C/D 表，并保留既有模板格式。",
          inputs: "当日 A 表数据、历史模板以及固定业务口径。",
          rules: "固定区域复制、材料顺序、合并规则和单价匹配都必须严格执行。",
          output: "保留模板样式的 Excel 与异常清单。",
          safeguards: "字段缺失、规则冲突或格式不匹配时中断生成并输出原因。",
          excerpt:
            "你是企业业务日报自动化专家。请根据 A 表和既有模板，输出 B/C/D 表及异常清单，并保证样式和口径一致。",
        },
      },
      recruiting: {
        background:
          "这个案例体现的是我如何把重复搬数与排版，改造成可复核的自动化交付链路。",
        usersScene: "适用于财务、结算、运营日报与材料记录场景。",
        coreProblem: "多表合并复杂、格式要求高、人工处理耗时且易返工。",
        risks: "若后续业务规则继续膨胀，需要再拆更清晰的配置层。",
        results: [
          { label: "日结耗时", value: "2h → 10min" },
          { label: "处理方式", value: "自动清洗渲染" },
          { label: "输出结果", value: "日报 + 台账 + 异常清单" },
          { label: "验证方式", value: "保留模板格式" },
        ],
      },
      summary:
        "面向企业业务结算场景的日报自动化引擎：用 Python 替代人工搬数与排版，将多维业务数据清洗、渲染和勾核串成可复核的自动化链路。",
      prompt:
        "Prompt：根据 A 表数据和既有 B/C/D 模板，按固定业务规则自动生成日报、材料记录、台账和异常清单，并保持原模板格式。",
      links: [
        {
          type: "github",
          href: "https://github.com/karma-taylor/Daily_report",
          label: "查看 GitHub",
        },
      ],
    },
  },
];

export const PROFILE = {
  name: "郭伟南",
  alternateName: "Guo Weinan",
  role: "AI 产品经理 · AI 工作流 / Agent 应用",
  jobTitle: "AI 产品经理",
  siteUrl: "https://www.vinanverse.com/",
  pageUrl: "https://www.vinanverse.com/",
  sameAs: ["https://github.com/karma-taylor"],
  description:
    "郭伟南的 AI 产品经理作品集，聚焦真实业务规则产品化、AI 工作流设计与自动化落地案例，包含工作日历协同、资讯日报、薪资分配策略、汇率换算 Agent 与日报自动化生成引擎。",
};
