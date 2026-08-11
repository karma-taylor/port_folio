export const PROJECTS = [
  {
    id: "calendar",
    index: "01",
    size: "wide",
    status: "live",
    statusLabel: "演示原型",
    title: "工作日历协同系统（Work Calendar）",
    titleLong: "工作日历协同系统（Work Calendar）",
    outcomes: [
      "工程班组撞期在保存前拦截",
      "钢构、焊接与照明预埋可按分段安排",
      "示例试排仅保存到访客本地草稿",
    ],
    cover: {
      src: "./calendar-cover-auto.png",
      version: "20260625-live-capture",
      alt: "工作日历协同系统项目封面",
    },
    hoverValue:
      "把钢结构遮阳棚施工中的班组分段与焊工撞期，做成保存前可拦截、可复核的规则系统。",
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
        "把工程现场靠 Excel 协调的施工排期，产品化为保存前拦截冲突的规则系统。",
      focus: {
        tagline:
          "让工程班组“谁在什么时间参与、是否撞期”在保存前就被系统拦住。",
        problem:
          "适用于需要多人协同排期、资源分配和任务统筹的团队。核心痛点是同一任务存在多人分段参与，Excel 名单又频繁变化，人工对齐时间窗很容易撞期。",
        ownership:
          "我负责需求拆解、流程建模、交互原型、冲突规则设计、名单导入策略、Supabase 数据结构设计与上线验证。",
        flowSummary:
          "钢构吊装 → 节点焊接 → 照明预埋复核；以人员分段为粒度预检，冲突时阻断保存，访客草稿仅留在本机。",
        productJudgment:
          "我没有把它做成自由编辑表格，而是先锁定任务边界、人员分段与冲突规则。冲突 Modal 在前端阻断保存，因此不会写入草稿或触发云端请求。",
        promptDesign: {
          goal: "生成一个可部署的协同日历系统，覆盖任务、分段、冲突规则与名单导入。",
          inputs: "任务起止、参与人员、角色、分段起止时间，以及 Excel 名单映射关系。",
          rules: "冲突粒度到人和分段；时间区间相交则禁止保存；所有分段必须落在任务总区间内。",
          output: "可运行前端、冲突函数、Supabase SQL 以及部署说明。",
          safeguards: "未选人员、非法日期、跨区间分段或同人撞期都直接阻止保存；公开演示只写入本地草稿，并对存储失败给出提示。",
          excerpt:
            "你是复杂协同流程设计专家与资深前端工程师。目标是构建一个支持多人分段参与、保存前冲突校验、云端同步的月历型工作台。",
        },
      },
      recruiting: {
        background:
          "我把排期这类高规则密度场景，从“人工协调”推进成“系统先判断、用户再确认”的产品模式。",
        usersScene: "适用于项目协调、任务分配、多人协同参与与排期管理场景。",
        coreProblem: "Excel 易撞期、状态易丢失、规则难沉淀。",
        researchScope: "围绕工程排期中人员、角色、任务区间和分段参与四类信息梳理约束；本轮只解决保存前发现撞期，不扩展到权限和多人并发编辑。",
        delivery: "交付月视图、人员分段表单、冲突拦截与可复核详情；以脱敏工程班组试排验证“撞期不可保存、调整后可保存”的闭环。",
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
        researchScope: "以“每天按时得到可消费的主题摘要”为范围，梳理信息源、主题、时区与订阅输出；不在本轮解决深度研判和个性化推荐。",
        delivery: "交付多源抓取、去重分栏、结构化摘要和邮件/Web 双端输出；以定时任务试跑验证当天内容可按主题送达。",
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
      "单笔与批量输入复用同一拆分口径",
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
        researchScope: "围绕单笔与 Excel 批量发薪的输入、面额选择、余数和固定导出列定义口径；不处理现金库存或跨机构调拨。",
        delivery: "交付 Web 与微信小程序两端的统一拆分规则、Excel 导入导出和异常提示；用单笔与批量结果复核固定列输出。",
        risks: "后续可以继续补充更多票面和更细的异常处理策略。",
        results: [
          { label: "规则执行", value: "贪心拆分 + 余数校验" },
          { label: "输入方式", value: "单笔 + Excel 批量" },
          { label: "输出形式", value: "固定列导出" },
          { label: "交付终端", value: "Web + 小程序" },
        ],
      },
      summary:
        "一款面向高规则密度场景的薪资分配策略工具。相比强调“贪心算法”，它更体现我如何把重复、易错的流程做成双端可用的小产品。",
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
        researchScope: "围绕币种方向、金额、汇率来源与弱网回退定义输入输出口径；不覆盖交易执行、实时行情承诺或合规报价。",
        delivery: "交付多源汇率参考、防呆纠偏、缓存降级和来源说明；通过多源交叉比对与异常输入验证结果可复核。",
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
      "单次日报生成从约 4 小时压缩至 6 分钟",
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
        researchScope: "从当日 A 表、既有 B/C/D 模板和固定业务口径中梳理字段映射与异常条件；不在本轮建设通用配置平台。",
        delivery: "交付 Python 清洗、模板渲染、日报/台账和异常清单输出；以历史模板回放校验格式、材料顺序和异常留痕。",
        risks: "若后续业务规则继续膨胀，需要再拆更清晰的配置层。",
        results: [
          { label: "日报耗时", value: "4h → 6min" },
          { label: "处理方式", value: "自动清洗渲染" },
          { label: "输出结果", value: "日报 + 台账 + 异常清单" },
          { label: "验证方式", value: "保留模板格式" },
        ],
      },
      summary:
        "面向企业业务结算场景的日报自动化引擎：用 Python 替代人工搬数与排版，将多维业务数据清洗、渲染和勾核串成可复核的自动化链路。",
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

export const DELIVERY_SUMMARY = [
  { label: "业务场景", value: "海外重资产工程与跨国结算" },
  { label: "负责范围", value: "需求、规则、交付与验收路径" },
  { label: "交付方法", value: "流程拆解、前端原型、自动化验证" },
  { label: "验证方式", value: "脱敏试跑、回放与边界复盘" },
];

export const PROJECT_MANAGEMENT_META = {
  calendar: {
    scenario: "钢结构遮阳棚施工班组协调",
    role: "需求拆解、规则设计、前端交付",
    status: "公开演示原型",
    verification: "脱敏场景试排与冲突回归",
    userStory: {
      actor: "总包协调员（脱敏角色）",
      situation: "钢构吊装完成后，需确认檩条安装班组的进场安排。",
      need: "在确认前看清焊工的参与区间是否已被节点焊接占用。",
      risk: "若撞期在分包确认后才发现，需要重新协调人员与进场节点。",
      resolution: "系统在保存前拦截冲突；调整分段或更换班组成员后再保存复核。",
      evidence: "脱敏试排：排期请求、焊工撞期、调整分段、保存复核。",
    },
    evidence: { title: "总包协调员的冲突处理闭环", steps: ["排期请求", "焊工撞期", "调整分段", "保存复核"] },
  },
  digest: {
    scenario: "多源行业资讯订阅与交付",
    role: "流程定义、信息结构与验证",
    status: "已上线",
    verification: "订阅链路试跑",
    userStory: {
      actor: "产品／运营负责人（脱敏角色）",
      situation: "每天工作开始前，需要获取按主题和时区整理的行业摘要。",
      need: "在一个入口完成重点信息判断，而非在多个来源间反复切换。",
      risk: "重复阅读与手工汇总会挤占当天的判断和协同时间。",
      resolution: "将抓取、去重、分栏摘要与定时送达收束为订阅链路。",
      evidence: "订阅试跑：抓取、去重、分栏摘要、定时送达与订阅链路。",
    },
  },
  money: {
    scenario: "薪资配钞与批量核对",
    role: "规则抽象、双端交付与验收",
    status: "已上线",
    verification: "单笔与批量模板回放",
    userStory: {
      actor: "发薪协助人员／柜台操作人员（脱敏角色）",
      situation: "批量发薪前，需要按固定票面拆分金额并核对名单。",
      need: "确认每笔拆分无余数、批量结果口径一致，并可直接导出。",
      risk: "现场分发时容易出现余数、漏项或不同操作人员口径不一致。",
      resolution: "让单笔和批量输入共用拆分规则，并在导出前提示异常。",
      evidence: "规则用例：单笔与批量输入、余数校验、固定列导出、异常提示。",
    },
  },
  fx: {
    scenario: "跨币种换算与业务报价辅助",
    role: "边界定义、异常策略与交付",
    status: "已上线",
    verification: "多源交叉比对",
    userStory: {
      actor: "跨境结算／报价协助人员（脱敏角色）",
      situation: "提交报价或报销前，需要确认汇率换算方向、来源和结果。",
      need: "得到可追溯的换算结果；弱网时也能明确知道系统采用了何种降级结果。",
      risk: "不透明数字或换算方向错误会把核对压力留到提交之后。",
      resolution: "提供来源说明、防呆纠偏、多源比对与缓存降级提示。",
      evidence: "多源交叉比对：来源说明、换算方向校验与弱网缓存降级。",
    },
  },
  report: {
    scenario: "业务日结与模板化日报",
    role: "自动化流程、异常清单与回放",
    status: "代码案例",
    verification: "历史模板回放",
    userStory: {
      actor: "结算／运营人员（脱敏角色）",
      situation: "日结节点前，需要把当日表、既有模板和异常条件合并为可提交日报。",
      need: "减少人工搬数、格式核对和反复返工，并保留异常项供复核。",
      risk: "字段遗漏或模板口径不一致会导致日报退回，压缩后续结算时间。",
      resolution: "通过字段映射与清洗、模板渲染和异常清单完成可回放交付。",
      evidence: "模板回放：输入表、字段映射与清洗、模板渲染、异常清单与历史模板回放。",
    },
  },
};

export const PROFILE = {
  name: "郭伟南",
  alternateName: "Guo Weinan",
  role: "AI 产品经理 · 重资产 B 端业务流程重塑",
  jobTitle: "AI 产品经理",
  siteUrl: "https://www.vinanverse.com/",
  pageUrl: "https://www.vinanverse.com/",
  sameAs: ["https://github.com/karma-taylor"],
  description:
    "郭伟南的 AI 产品经理作品集，聚焦将重资产 B 端项目交付中的规则、合规与协同经验转化为可验证的 AI 自动化产品。",
  experience: [
    {
      period: "2025.07 — 至今",
      title: "海外重资产 B 端项目交付",
      context: "Halfaya 11kV 项目 · 综合解决方案实施经理",
      detail: "推进复杂节点、跨文化协同与现场安全合规；同时梳理跨国结算中的计价、审批与审计口径。",
      proof: "将工程现场的范围、规则和验收方法迁移到 AI 产品设计。",
    },
    {
      period: "PoC 复盘",
      title: "跨国结算 PDF 账单自动化探索",
      context: "解析规则与财务验收门槛验证",
      detail: "完成账单解析与规则处理的概念验证，但未进入正式流程。",
      proof: "OCR 准确率未达到财务级要求，且供应商模板频繁变化导致维护 ROI 不成立，因此停止投入并保留复盘结论。",
    },
  ],
};
