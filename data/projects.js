export const PROJECTS = [
  {
    id: "calendar",
    index: "01",
    size: "wide",
    status: "live",
    statusLabel: "Skill 协同",
    title: "工程排班协同系统（Work Calendar Skill）",
    titleLong: "工程排班协同系统（Work Calendar Skill）",
    outcomes: [
      "网页与 Codex Skill 共享同一受控排班接口",
      "每次变更先预览冲突，再经用户确认写入",
      "revision 校验拒绝多人协作时的静默覆盖",
    ],
    cover: {
      src: "./calendar-cover-auto.png",
      version: "20260625-live-capture",
      alt: "工作日历协同系统项目封面",
    },
    hoverValue:
      "把自然语言排班纳入“读取状态 → 预览校验 → 确认写入”的受控流程，让 AI 协作可执行、可拒绝、可审计。",
    hoverCta: {
      href: "https://work-calendar-52c.pages.dev",
      label: "访问演示",
      aria: "访问工作日历协同系统演示",
    },
    tech: [
      { type: "ai", label: "Codex work-calendar Skill" },
      { type: "api", label: "Supabase Edge Function" },
      { type: "tool", label: "Supabase Auth / Postgres" },
      { type: "framework", label: "React 19 / Vite" },
      { type: "lang", label: "TypeScript / Deno" },
      { type: "tool", label: "SheetJS 本地名单解析" },
    ],
    route: [
      { label: "Skill", value: "自然语言解析 / 状态查询 / 变更预览" },
      { label: "受控写入", value: "显式命令 + 用户确认 + expectedRevision" },
      { label: "服务端", value: "鉴权 / Schema / 冲突校验 / 审计" },
      { label: "身份数据", value: "Magic Link / 角色权限 / 匿名人员 ID" },
    ],
    flow: {
      ariaLabel: "工作日历协同系统业务流程",
      steps: [
        { idx: "01", label: "读取状态" },
        { idx: "02", label: "解析意图" },
        { idx: "03", label: "预览校验" },
        { idx: "04", label: "确认写入", accent: true },
      ],
    },
    github: {
      href: "https://github.com/karma-taylor/work_calendar",
      magnetic: true,
      magneticStrength: 0.25,
    },
    detail: {
      heroTeaser:
        "把工程排班从网页表单延伸到 Codex Skill：AI 只提出候选变更，服务端先验证，用户确认后才落库。",
      focus: {
        tagline:
          "让自然语言排班具备与网页端一致的权限、冲突规则、版本控制与审计边界。",
        problem:
          "工程排班既需要在月历中操作，也需要让 AI 协助查询和调整。若 AI 直接写库，人员撞期、越权和并发覆盖会从效率问题变成不可追溯的业务风险。",
        ownership:
          "我负责将排班规则建模为网页与 Skill 共享的受控 API：定义命令边界、预览与确认协议、角色权限、revision 写入，以及隐私最小化的审计方式。",
        flowSummary:
          "Skill 先读取最新项目、人员与 revision，再将自然语言收敛为一项明确变更；服务端返回冲突预览，用户确认后才以 expectedRevision 提交。",
        productJudgment:
          "Skill 不拥有绕过规则的特权写入。它与网页端调用同一 Edge Function；身份、角色、冲突、Schema 和 revision 均由服务端裁决，安全性不依赖提示词。",
        promptDesign: {
          goal: "让 Codex 用自然语言安全地查询、预览并管理工程排班，而不是让模型直接改数据库。",
          inputs: "用户意图、日期范围、项目与人员标识；Skill 始终从云端读取当前状态与 revision。",
          rules: "一次请求只收敛为 create / update / delete 一项明确命令；先预览，再等待用户明确确认。",
          output: "包含项目、人员、日期范围、冲突结果与 revision 的变更摘要；写入结果可由服务端审计。",
          safeguards: "不根据模糊姓名猜测人员；拒绝越权、撞期、非法日期和过期 revision；发生 revision 不一致时不自动重试或覆盖。",
          excerpt:
            "先读取当前排班与 revision；将请求转化为单一明确变更，调用预览检查冲突。只有用户确认后，才携带 expectedRevision 写入。",
        },
      },
      recruiting: {
        background:
          "我把高规则密度的工程排班，推进为“系统先判断、AI 提出候选、用户确认”的人机协同模式。",
        usersScene: "适用于项目协调员既要在网页中查看月历，也要借助 AI 快速查询、预览和调整排班的场景。",
        coreProblem: "自然语言很灵活，但排班写入必须面对人员撞期、角色权限、并发修改和隐私数据边界。",
        researchScope: "围绕 Skill 的意图收敛、受影响日期读取、服务端预览、明确确认与 revision 写入设计闭环，不让模型承担最终业务裁决。",
        delivery: "交付网页与 Skill 共用的 Edge Function、角色与 Key 鉴权、冲突校验、审计事件、历史快照及隐私安全的脱敏测试样例。",
        risks: "生产环境仍需按部署清单完成白名单、Key 轮换、CORS、数据保留和分级验收。",
        results: [
          { label: "AI 写入", value: "预览后需明确确认" },
          { label: "并发保护", value: "expectedRevision" },
          { label: "权限边界", value: "角色 + 可轮换 Key" },
          { label: "隐私策略", value: "匿名 ID + 最小审计" },
        ],
      },
      retrospective: {
        sections: [
          {
            label: "业务痛点溯源",
            summary: [
              { text: "排班 Skill 的价值不在于替人点击，而在于让自然语言操作也遵守工程现场的业务约束。", strong: true },
            ],
            points: [
              [{ text: "业务约束：同一人员可分段参与多个工单，但相交的时间区间必须被阻止。" }],
              [{ text: "AI 风险：如果模型绕过当前状态、权限与冲突校验直接写入，错误会被放大为跨端协作事故。" }],
              [{ text: "产品判断：把 AI 定位为受控操作入口，而不是拥有数据库直写权限的自动化脚本。" }],
            ],
          },
          {
            label: "需求拆解与产品方案",
            summary: [{ text: "先将自然语言收敛为可预览的单一命令，再由服务端完成业务裁决。", strong: true }],
            points: [
              [{ text: "Skill 先读云端状态与" }, { text: "expectedRevision", strong: true }, { text: "，而非依赖用户描述推断当前排班。" }],
              [{ text: "请求只能映射为" }, { text: "create / update / delete", strong: true }, { text: "之一；变更对象、人员与日期范围在预览阶段完整展开。" }],
              [{ text: "网页与 Skill 复用同一 Edge Function，使权限、Schema、冲突和审计规则不因入口不同而分叉。" }],
            ],
          },
          {
            label: "风险应对与落地交付",
            summary: [{ text: "把模型理解转化为可拒绝、可恢复、可追责的服务端协议。", strong: true }],
            points: [
              [{ text: "预览阶段由服务端检查身份、角色、人员重叠、非法日期和分段边界；冲突不会进入写入路径。" }],
              [{ text: "写入必须等用户", }, { text: "明确确认", strong: true }, { text: "；过期 revision 返回 REVISION_MISMATCH，Skill 不自动覆盖或重试。" }],
              [{ text: "审计事件只记录角色、动作、结果、耗时和摘要；名单与原始对话不进入日志。" }],
            ],
          },
          {
            label: "业务价值与验收闭环",
            summary: [{ text: "以安全契约与可复现变更流程验收 Skill，而不用未经验证的 AI 提效数字包装结果。", strong: true }],
            points: [
              [{ text: "验收场景一：Skill 与网页端读取同一状态，且预览输出明确列出项目、人员、日期与冲突。" }],
              [{ text: "验收场景二：越权、撞期、非法请求和过期 revision", }, { text: "均不可写入", strong: true }, { text: "。" }],
              [{ text: "验收场景三：用户确认后才写入，结果可通过 revision 与审计记录", }, { text: "复核", strong: true }, { text: "。" }],
            ],
          },
        ],
      },
      summary:
        "面向工程排班的网页与 Codex Skill 协同系统。核心不是让 AI 直接操作数据，而是让每一项自然语言变更都经过读取、预览、确认、服务端裁决与审计。",
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
    id: "enterprise-rag",
    index: "02",
    size: "wide",
    status: "public-demo",
    statusLabel: "公开合成数据 Demo",
    title: "企业制度 RAG：权限与证据可追溯问答",
    titleLong: "企业制度 RAG：权限与证据可追溯问答（Enterprise Policy RAG Demo）",
    outcomes: [
      "ACL-first 让未授权制度不参与召回",
      "BM25 与可选 BGE 通道经 RRF 融合、重排后输出授权证据",
      "无证据、非法引用或服务异常时 fail-closed 拒答",
    ],
    cover: {
      src: "./assets/cases/enterprise-rag/qa.webp",
      version: "public-synthetic-demo",
      alt: "企业制度 RAG 员工问答界面",
    },
    hoverValue:
      "把企业问答从“能回答”做成“只对有权限的人、基于可追溯证据地回答”。",
    tech: [
      { type: "framework", label: "FastAPI" },
      { type: "tool", label: "Docker / Render Blueprint" },
      { type: "ai", label: "OpenAI-compatible LLM" },
      { type: "framework", label: "BM25 + BGE + RRF" },
      { type: "tool", label: "GitHub Actions / Pytest" },
    ],
    route: [
      { label: "权限", value: "ACL-first / 未授权文档不参与召回" },
      { label: "检索", value: "BM25 + 可选 BGE / RRF / 轻量重排" },
      { label: "生成", value: "引用校验 / 无证据 fail-closed" },
      { label: "评测", value: "Hit@1 / Hit@5 / MRR@10 / Protected Gate" },
    ],
    flow: {
      ariaLabel: "企业制度 RAG 权限与证据检索流程",
      steps: [
        { idx: "01", label: "角色与问题" },
        { idx: "02", label: "ACL-first" },
        { idx: "03", label: "融合与重排" },
        { idx: "04", label: "引用回答／拒答", accent: true },
      ],
    },
    github: { href: "https://github.com/karma-taylor/enterprise-policy-rag-demo", magnetic: true, magneticStrength: 0.25 },
    detail: {
      heroTeaser: "面向公开合成企业制度的 RAG Demo：先做权限隔离与证据检索，再决定是否生成回答。",
      focus: {
        tagline: "让企业问答只基于当前角色有权访问、且能够被逐条追溯的证据回答。",
        problem: "企业制度、合同与保险风险问答不仅要召回相关文本，还必须避免未授权内容进入召回与生成链路，并让使用者能核对答案依据。",
        ownership: "我负责公开作品的权限边界、混合检索路径、证据引用与拒答策略、评测门禁和可解释界面设计。",
        flowSummary: "用户问题与角色先进入 ACL 过滤；授权范围内再执行 BM25、可选 BGE、RRF 与轻量重排，最后以引用校验决定回答或拒答。",
        productJudgment: "权限不是生成后的遮罩，而应当发生在召回之前；无证据、非法引用或服务异常时，系统应明确降级为受控回答，而不是补全猜测。",
        promptDesign: { goal: "仅基于授权证据回答制度问题，并在每条事实后保留可核对的证据编号。", inputs: "用户问题、角色、已授权的检索证据包。", rules: "证据不足时拒答；不得引用未授权证据；事实必须对应有效证据编号。", output: "带证据编号的回答，或说明无法基于当前授权证据作答的受控回复。", safeguards: "ACL 在检索前执行；非法引用、无证据和服务失败均不生成未经支持的结论。", excerpt: "只根据提供的授权证据回答；若证据不足或引用不合法，明确说明不能作答，不得补充猜测。" },
      },
      recruiting: {
        background: "我把 RAG 的评价从“是否生成答案”前移到“权限、证据和拒答边界是否可信”。",
        usersScene: "适用于企业员工按角色查询制度、流程、合同与保险风险信息的公开合成数据演示场景。",
        coreProblem: "纯召回或自由生成可能让未授权内容被检索、让答案失去证据来源，且难以在回归后识别保护问题是否退化。",
        researchScope: "覆盖 ACL-first、混合检索、证据引用、fail-closed 和公开小规模评测；不宣称真实企业身份、审计或生产级限流能力。",
        delivery: "交付员工问答、X-Ray 检索透视、只读知识治理页、FastAPI/Docker/Render 配置与 Protected Regression Gate。",
        risks: "真实部署仍需企业 IdP、受控语料存储、集中脱敏日志、独立评测环境与生产级限流。",
        results: [{ label: "权限顺序", value: "ACL-first" }, { label: "检索路径", value: "BM25 + 可选 BGE + RRF" }, { label: "可信边界", value: "引用校验 + fail-closed" }, { label: "回归门禁", value: "Protected Query Gate" }],
      },
      retrospective: { sections: [
        { label: "先定义可信边界", summary: [{ text: "企业问答的风险不只在答错，也在未授权文本被带入检索和生成。", strong: true }], points: [[{ text: "将 ACL 放在所有检索通道之前，未知路径默认拒绝，不做全库回退。" }], [{ text: "公开版仅使用合成制度数据；真实文档、原始 chunk、私有 gold-set 和密钥不进入仓库或截图。" }]] },
        { label: "让检索链路可解释", summary: [{ text: "把词法、向量、融合和重排从黑盒结果拆成可查看的证据轨迹。", strong: true }], points: [[{ text: "BM25 与可选 BGE 通道通过 RRF 融合，再由轻量重排输出授权证据包。" }], [{ text: "X-Ray 页展示 doc_id、分数、作用域与检索轨迹，方便对比访客与财务角色。" }]] },
        { label: "把拒答和回归纳入交付", summary: [{ text: "证据不足时拒答，不把模型补全当作产品默认。", strong: true }], points: [[{ text: "引用校验、无证据和服务异常都降级为受控回答。" }], [{ text: "公开评测计算 Hit@1、Hit@5 与 MRR@10；Protected Query 失败会阻断发布测试。" }]] },
      ] },
      summary: "面向公开合成企业制度数据的 RAG 作品：以 ACL-first、混合检索、证据溯源和 fail-closed，把“能回答”收束为可授权、可解释、可回归验证的问答路径。",
      links: [{ type: "github", href: "https://github.com/karma-taylor/enterprise-policy-rag-demo", label: "查看 GitHub" }],
    },
  },
  {
    id: "digest",
    index: "03",
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
    index: "04",
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
    index: "05",
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
    index: "06",
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
      retrospective: {
        sections: [
          {
            label: "业务痛点溯源",
            summary: [{ text: "日结压力不在于生成一张表，而在于多表、模板和异常条件必须同时满足提交口径。", strong: true }],
            points: [
              [{ text: "结算／运营人员在日结节点前，需要合并当日 A 表、既有 B/C/D 模板及固定业务口径。" }],
              [{ text: "人工搬数后还要逐项核对格式、材料顺序与异常项，问题往往在提交前后反复暴露。" }],
              [{ text: "一旦模板口径不一致或字段遗漏，日报会退回并压缩后续结算时间。" }],
            ],
          },
          {
            label: "需求拆解与产品方案",
            summary: [{ text: "将“做日报”拆解为输入口径、映射规则、模板输出与复核四个可验收环节。", strong: true }],
            points: [
              [{ text: "先做" }, { text: "需求澄清", strong: true }, { text: "：锁定当日表、历史模板、固定列和不可变的业务口径。" }],
              [{ text: "再定义" }, { text: "字段映射", strong: true }, { text: "与清洗规则，把源数据转换为模板可消费的结构。" }],
              [{ text: "将模板渲染、日报／台账输出和异常清单组合为一次交付，避免只完成数据加工却遗漏提交物。" }],
            ],
          },
          {
            label: "风险应对与落地交付",
            summary: [{ text: "以模板一致性和异常可追溯作为自动化交付的第一道门槛。", strong: true }],
            points: [
              [{ text: "字段缺失、规则冲突或格式不匹配时，输出明确异常而非生成看似完整但不可提交的日报。" }],
              [{ text: "通过" }, { text: "异常留痕", strong: true }, { text: "保留需要人工复核的项目，使业务判断仍留在可控环节。" }],
              [{ text: "使用" }, { text: "模板回放", strong: true }, { text: "验证材料顺序、格式与历史口径，降低模板变动带来的交付风险。" }],
            ],
          },
          {
            label: "业务价值与验收闭环",
            summary: [{ text: "已确认的模板回放显示：单次日报生成由约 4h 缩短至 6min。", strong: true }],
            points: [
              [{ text: "以" }, { text: "验收指标", strong: true }, { text: "复核输出格式、材料顺序、异常清单和模板口径是否保留。" }],
              [{ text: "历史模板回放证明自动化输出可进入既有提交流程，而非仅生成演示样例。" }],
              [{ text: "边界明确：当前以固定业务口径交付；规则持续膨胀时，再拆出可配置层。" }],
            ],
          },
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
  "enterprise-rag": {
    scenario: "企业制度与风险问答（公开合成数据）",
    role: "权限边界、检索链路、证据与评测设计",
    status: "公开合成数据 Demo",
    verification: "访客／财务角色对比、X-Ray 证据检查与 Protected Query Gate",
    userStory: {
      actor: "企业员工（公开合成角色）",
      situation: "需要查询制度、报销或风险流程，但不同角色只能看到授权范围内的证据。",
      need: "在得到答案时同时确认它来自哪些授权证据，并在无证据时获得明确拒答。",
      risk: "未授权语料进入检索或生成，会把权限问题伪装成一次看似合理的回答。",
      resolution: "先按角色执行 ACL，再做混合检索与引用校验；无法支持时受控拒答。",
      evidence: "访客拒答、财务授权证据、X-Ray 检索轨迹、Protected Query 回归门禁。",
    },
    evidence: { title: "企业制度 RAG 的可信问答闭环", steps: ["角色识别", "ACL-first", "授权证据", "引用回答／拒答"] },
  },
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
