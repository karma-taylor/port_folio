export const PROJECTS = [
  {
    id: "calendar",
    index: "01",
    tier: "core",
    homeOrder: 2,
    size: "wide",
    status: "live",
    statusLabel: "Skill 协同",
    title: "项目排班协同系统（Work Calendar Skill）",
    titleLong: "项目排班协同系统（Work Calendar Skill）",
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
    engineering: {
      repo: "https://github.com/karma-taylor/work_calendar",
      architecture: {
        lanes: [
          { title: "入口", nodes: ["网页 · React 19 / Vite", "Codex work-calendar Skill", "本地名单 · SheetJS（只在浏览器）"] },
          { title: "受控接口 · 服务端裁决", boundary: true, nodes: ["Supabase Edge Function（Deno / TS）", "JWT 或 Skill Key 鉴权 · 角色", "Schema 校验 · 冲突检测", "预览 = dry run · 确认后 PATCH", "expectedRevision 乐观锁 · 审计"] },
          { title: "数据", nodes: ["Postgres · apply_schedule_patch RPC", "work_calendar_events 审计（90 天）", "历史快照（365 天）· 保留期清理"] },
        ],
        caption: "网页和 Skill 都不直接读写数据库表。两条入口调用同一个 Edge Function，预览与写入走同一段校验代码，只差一个 p_dry_run；因此规则不会因入口不同而分叉。",
      },
      modules: [
        { path: "supabase/functions/work-calendar/index.ts", what: "鉴权、Patch 校验、冲突检测、revision 写入、脱敏审计（单文件 Edge Function）" },
        { path: "supabase/migrations/*.sql", what: "4 个迁移：成员与角色、Key 哈希与限流、schedule delta 与 apply_schedule_patch、Skill 质量观测" },
        { path: "src/App.jsx · src/lib/cloudStore.js", what: "月历、人员选择、Patch 预览确认 UI，以及只经 Edge Function 访问的云端存储层" },
        { path: "tests/*-contract.mjs", what: "security / patch / skill-quality 三个契约测试，CI 全过才部署 staging" },
        { path: "evals/ · scripts/run-skill-evals.mjs · skillopt_pipeline.py", what: "冻结评测集、Skill 失败轨迹脱敏记录、候选规则有界编辑与人工发布门禁" },
      ],
      snippets: [
        { title: "预览与写入共用一条路径", lang: "ts", src: "work-calendar-1.txt", file: "supabase/functions/work-calendar/index.ts", lines: "167-180", note: "为便于阅读做了换行与裁剪，逻辑未改。" },
        { title: "保存前的冲突阻断", lang: "ts", src: "work-calendar-2.txt", file: "supabase/functions/work-calendar/index.ts", lines: "85-90" },
      ],
      metrics: [
        { value: "9", label: "冻结评测用例", note: "8 条标为安全关键：歧义、未知人员、撞期、超工时、revision 过期不重试、删除需确认" },
        { value: "5", label: "中文意图解析用例", note: "意图、人员、日期、项目、变更类型字段需完全匹配" },
        { value: "3", label: "CI 契约测试", note: "security · patch · skill-quality，任一失败不部署" },
        { value: "3", label: "允许的 Patch 动作", note: "replace_assignee · update_window · cancel_shift，每条带 old 断言，单次 ≤ 20 条" },
        { value: "≤ 1s", label: "端到端 P95 目标", note: "服务端记录每次请求耗时；这是设计目标，不是上线实测" },
      ],
      metricsNote: "以上数字来自公开仓库的 evals/、tests/ 与 README，用例使用化名与合成项目；没有生产流量数据，因此不写采纳率或节省工时。",
    },
    detail: {
      heroTeaser:
        "把项目排班从网页表单延伸到 Codex Skill：AI 只提出候选变更，服务端先验证，用户确认后才落库。",
      focus: {
        tagline:
          "让自然语言排班具备与网页端一致的权限、冲突规则、版本控制与审计边界。",
        problem:
          "项目排班既需要在月历中操作，也需要让 AI 协助查询和调整。若 AI 直接写库，人员撞期、越权和并发覆盖会从效率问题变成不可追溯的业务风险。",
        ownership:
          "我负责将排班规则建模为网页与 Skill 共享的受控 API：定义命令边界、预览与确认协议、角色权限、revision 写入，以及隐私最小化的审计方式。",
        flowSummary:
          "Skill 先读取最新项目、人员与 revision，再将自然语言收敛为一项明确变更；服务端返回冲突预览，用户确认后才以 expectedRevision 提交。",
        productJudgment:
          "Skill 不拥有绕过规则的特权写入。它与网页端调用同一 Edge Function；身份、角色、冲突、Schema 和 revision 均由服务端裁决，安全性不依赖提示词。",
        promptDesign: {
          goal: "让 Codex 用自然语言安全地查询、预览并管理项目排班，而不是让模型直接改数据库。",
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
          "我把高规则密度的项目排班，推进为“系统先判断、AI 提出候选、用户确认”的人机协同模式。",
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
              { text: "排班 Skill 的价值不在于替人点击，而在于让自然语言操作也遵守真实业务约束。", strong: true },
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
        "面向项目排班的网页与 Codex Skill 协同系统。核心不是让 AI 直接操作数据，而是让每一项自然语言变更都经过读取、预览、确认、服务端裁决与审计。",
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
    tier: "core",
    homeOrder: 3,
    size: "wide",
    status: "public-demo",
    statusLabel: "公开合成数据 Demo",
    title: "企业制度 RAG：权限与证据可追溯问答",
    titleLong: "企业制度 RAG：权限与证据可追溯问答（Enterprise Policy RAG Demo）",
    outcomes: [
      "私有 40 题评测 Hit@5 从 dense 基线 67.5% 提到 97.5%",
      "ACL-first 让未授权制度不参与召回：越权候选与越权结果均为 0",
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
      { type: "lang", label: "Python 3.12" },
      { type: "framework", label: "FastAPI" },
      { type: "framework", label: "BM25 + BGE-M3 + RRF" },
      { type: "ai", label: "DeepSeek / OpenAI-compatible" },
      { type: "tool", label: "JWT fail-closed 边界" },
      { type: "tool", label: "Docker / Render Blueprint" },
      { type: "tool", label: "GitHub Actions / Pytest" },
    ],
    route: [
      { label: "权限", value: "ACL-first / 未授权文档不参与召回" },
      { label: "检索", value: "BM25 + 可选 BGE-M3 / RRF / 轻量重排" },
      { label: "生成", value: "引用校验 / 无证据 fail-closed" },
      { label: "评测", value: "Hit@5 97.5% / MRR@10 88.9 / 回归门禁" },
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
    github: { href: "https://github.com/karma-taylor/hybrid-rag-mvp", magnetic: true, magneticStrength: 0.25 },
    engineering: {
      repo: "https://github.com/karma-taylor/hybrid-rag-mvp",
      architecture: {
        lanes: [
          { title: "入口", nodes: ["FastAPI 演示端 · app/（问答 / X-Ray / 治理页）", "enterprise_api.py · 生产 API 边界", "JWT 校验 fail-closed（issuer / audience / JWK）"] },
          { title: "安全编排 · harness.py", boundary: true, nodes: ["受限证据包 · 不传整库", "提示注入隔离（入库时切分并隔离）", "引用校验 · 非法 [n] 拒答", "并发上限 · 超时 · 熔断", "Trace 脱敏：只记 request ID 与阶段耗时"] },
          { title: "检索与生成", nodes: ["ACL 过滤 → BM25 → 可选 BGE-M3 dense", "RRF 融合 → 轻量重排 → Top-k 证据", "DeepSeek / OpenAI-compatible 生成，带 [n] 引用", "无 Key 时降级为标注的检索演示"] },
        ],
        caption: "权限在候选生成之前执行，不是生成后的遮罩。guest 角色直接返回空候选，不进入任何打分；检索的每一步都保留可解释轨迹，X-Ray 页能对比不同角色看到的证据。",
      },
      modules: [
        { path: "hybrid_retrieval.py · app/retrieval.py", what: "ACL-first 混合检索核心：BM25、BGE-M3 dense、RRF 融合、重排；实验版与演示版接口一致" },
        { path: "harness.py · security.py", what: "可接生产边界的编排层：证据包限制、注入检测、引用校验、并发 / 超时 / 熔断、Trace 脱敏" },
        { path: "app/auth.py · enterprise_api.py", what: "本地演示的注册 → 首次改密 → 管理员分配角色；生产版 Bearer JWT 校验，缺任一配置项即启动失败" },
        { path: "eval_pipeline.py · tune_fusion.py · validate_regression_gate.py", what: "Hit@K / MRR / nDCG 评测、融合参数搜索（只用确定性指标）、回归门禁" },
        { path: "chunking_mac.py · test_*.py", what: "文档切分与注入 chunk 隔离清单；ACL、引用、注入、JWT、并发与隔离的回归测试" },
      ],
      snippets: [
        { title: "ACL 先于任何打分", lang: "py", src: "rag-1.txt", file: "app/retrieval.py", lines: "60-108", note: "节选并加了步骤注释，逻辑未改。" },
        { title: "回归门禁：任一失败即不发布", lang: "py", src: "rag-2.txt", file: "validate_regression_gate.py", lines: "24-37" },
      ],
      metrics: [
        { value: "97.5%", label: "Hit@5", note: "39 / 40，私有评测集；dense 基线 67.5% → 混合 95.0% → 重排 + 门禁 97.5%" },
        { value: "85.0%", label: "Hit@1", note: "Hit@3 92.5% · MRR@10 88.92 · nDCG@10 77.22" },
        { value: "0", label: "ACL 越权", note: "preflight 异常 0 · 越权候选 0 · 越权最终结果 0" },
        { value: "4 / 5", label: "题型满分", note: "单文档、实体消歧、表格对账、跨文档 100%；精确字段或表格 75%，是当前短板" },
        { value: "95%", label: "门禁下限", note: "Hit@5 低于 95%、保护题回退、满分题型掉分、ACL 异常，任一即 fail" },
      ],
      metricsNote: "指标来自仓库内 evaluation_summary.json 与 EVALUATION_HISTORY.md，是私有 40 题评测集上的聚合结果；公开仓库只含合成制度数据，原始语料、gold set 与逐题报告不公开，因此这里不展示逐题明细。",
    },
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
        results: [{ label: "Hit@5", value: "97.5%（39 / 40）" }, { label: "Hit@1 / MRR@10", value: "85.0% / 88.9" }, { label: "ACL 越权", value: "0 候选 · 0 结果" }, { label: "回归门禁", value: "Hit@5 < 95% 即阻断" }],
      },
      retrospective: { sections: [
        { label: "先定义可信边界", summary: [{ text: "企业问答的风险不只在答错，也在未授权文本被带入检索和生成。", strong: true }], points: [[{ text: "将 ACL 放在所有检索通道之前，未知路径默认拒绝，不做全库回退。" }], [{ text: "公开版仅使用合成制度数据；真实文档、原始 chunk、私有 gold-set 和密钥不进入仓库或截图。" }]] },
        { label: "让检索链路可解释", summary: [{ text: "把词法、向量、融合和重排从黑盒结果拆成可查看的证据轨迹。", strong: true }], points: [[{ text: "BM25 与可选 BGE 通道通过 RRF 融合，再由轻量重排输出授权证据包。" }], [{ text: "X-Ray 页展示 doc_id、分数、作用域与检索轨迹，方便对比访客与财务角色。" }]] },
        { label: "把拒答和回归纳入交付", summary: [{ text: "证据不足时拒答，不把模型补全当作产品默认。", strong: true }], points: [[{ text: "引用校验、无证据和服务异常都降级为受控回答。" }], [{ text: "私有 40 题评测 Hit@5 从 67.5% 提到 97.5%；参数选择只看确定性检索指标，答案质量评判与参数搜索分离；保护题回退或 ACL 异常会阻断发布。" }]] },
      ] },
      summary: "面向公开合成企业制度数据的 RAG 作品：以 ACL-first、混合检索、证据溯源和 fail-closed，把“能回答”收束为可授权、可解释、可回归验证的问答路径。私有评测集 Hit@5 97.5%，ACL 越权为 0。",
      links: [{ type: "github", href: "https://github.com/karma-taylor/hybrid-rag-mvp", label: "查看 GitHub" }],
    },
  },
  {
    id: "digest",
    index: "03",
    tier: "more",
    homeOrder: 4,
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
    tier: "more",
    homeOrder: 5,
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
    tier: "more",
    homeOrder: 6,
    size: "featured",
    status: "live",
    statusLabel: "已上线",
    title: "汇率 / 天气工具调用 Agent（Weather FX Agent）",
    titleLong: "汇率 / 天气工具调用 Agent（Weather FX Agent）",
    outcomes: [
      "CLI Agent：OpenAI function calling 循环，两个工具按需调用，模型可换（OpenAI / DeepSeek / Ollama）",
      "Web 换算器：FastAPI + PWA，多银行参考、固定汇率方向取倒数、弱网缓存降级",
      "工具失败回传给模型解释，而不是让会话崩溃",
    ],
    cover: {
      src: "./fx-cover-auto.png",
      version: "20260625-live-capture",
      alt: "汇率换算 Web 端项目封面",
    },
    hoverValue:
      "一个最小但完整的工具调用 Agent：模型决定何时查天气、何时查汇率，结果可复核；Web 端单独承担换算与弱网可用。",
    hoverCta: {
      href: "https://karmacat-weather-fx-agent.hf.space",
      label: "访问 Web 端",
      aria: "访问汇率换算 Web 端演示",
    },
    tech: [
      { type: "lang", label: "Python" },
      { type: "ai", label: "OpenAI function calling" },
      { type: "ai", label: "Ollama 本地模型" },
      { type: "framework", label: "FastAPI" },
      { type: "tool", label: "PWA / Service Worker" },
      { type: "tool", label: "汇率 API" },
      { type: "tool", label: "Hugging Face Spaces" },
    ],
    route: [
      { label: "Agent", value: "agent.py · chat.completions + tools · tool_choice auto" },
      { label: "工具", value: "get_weather / get_exchange_rate · JSON Schema 参数" },
      { label: "Web", value: "webapp.py · /api/convert · 银行系数 · PWA 离线" },
      { label: "部署", value: "Docker · Hugging Face Spaces" },
    ],
    flow: {
      ariaLabel: "工具调用 Agent 业务流程",
      steps: [
        { idx: "01", label: "用户自然语言" },
        { idx: "02", label: "模型选工具" },
        { idx: "03", label: "执行并回填" },
        { idx: "04", label: "生成可复核回答", accent: true },
      ],
    },
    github: {
      href: "https://github.com/karma-taylor/weather-fx-agent",
      magnetic: true,
      magneticStrength: 0.25,
    },
    engineering: {
      repo: "https://github.com/karma-taylor/weather-fx-agent",
      architecture: {
        lanes: [
          { title: "CLI Agent · agent.py", boundary: true, nodes: ["读取 .env：API Key / BASE_URL / MODEL", "chat.completions(tools=TOOLS, tool_choice=auto)", "tool_calls → 本地执行 → role: tool 回填", "无 tool_calls 时输出最终回答", "401 / 429 / 404 / 断网分别给可操作提示"] },
          { title: "工具", nodes: ["get_weather(city) · 公开天气 API", "get_exchange_rate(base, target, amount)", "返回结构化 JSON，失败也带 ok:false"] },
          { title: "Web 换算器 · webapp.py", nodes: ["FastAPI /api/convert · 银行系数表", "固定汇率：方向互换自动取倒数", "PWA + Service Worker 离线可用", "访问统计与每日 Excel 导出", "Docker → Hugging Face Spaces"] },
        ],
        caption: "两层各自独立：Agent 层只负责「什么时候调哪个工具、怎么把结果说清楚」，模型可在 OpenAI、DeepSeek 与本机 Ollama 之间切换；Web 层不走模型，保证弱网和离线时换算仍可用。",
      },
      modules: [
        { path: "agent.py", what: "function calling 主循环、两个工具的 JSON Schema 定义、Ollama 模型存在性检查、针对 401 / 429 / 404 的诊断提示" },
        { path: "webapp.py", what: "FastAPI 换算接口、银行汇率系数、历史曲线接口、访问统计与定时 Excel 导出" },
        { path: "templates/index.html · static/sw.js", what: "换算 UI、固定汇率快照与人民币多档预设（localStorage）、Service Worker 离线缓存" },
        { path: "Dockerfile · render.yaml", what: "容器化与 Hugging Face Spaces / Render 部署配置" },
      ],
      snippets: [
        { title: "工具调用循环", lang: "py", src: "fx-1.txt", file: "agent.py", lines: "312-369", note: "去掉了错误分支的提示文案，结构未改。" },
        { title: "工具定义：参数即契约", lang: "py", src: "fx-2.txt", file: "agent.py", lines: "94-123" },
      ],
      metrics: [
        { value: "2", label: "可调用工具", note: "天气与汇率，参数用 JSON Schema 约束，required 字段缺失由模型补问" },
        { value: "3", label: "可切换模型来源", note: "OpenAI 官方 · OpenAI-compatible（如 DeepSeek）· 本机 Ollama，改 .env 即可" },
        { value: "4", label: "失败类型分别处理", note: "鉴权失败、额度不足、模型不存在、网络异常，各给一条能照着做的提示" },
        { value: "离线", label: "Web 端可用性", note: "PWA 缓存页面与最近一次实时汇率；固定汇率完全本地计算" },
      ],
      metricsNote: "这个项目没有评测集，不写准确率或耗时数字。它的价值是一个能读完的最小工具调用 Agent 实现，以及 Web 端对结果可复核与弱网可用的处理。",
    },
    detail: {
      heroTeaser: "最小但完整的工具调用 Agent：模型决定调什么工具，工具结果回填后再回答；Web 端独立提供弱网可用的换算。",
      focus: {
        tagline:
          "模型决定何时查天气、何时查汇率；换算结果附来源与口径，弱网也能出数。",
        problem:
          "面向跨境结算、差旅报销和柜台咨询场景。痛点在于多来源汇率不一致、手算容易出错、弱网环境下仍需快速出数；同时想验证一个最小 function calling 循环要处理哪些边角。",
        ownership:
          "我负责 Agent 的工具契约与调用循环、模型来源切换与失败诊断，以及 Web 端的汇率口径、换算纠偏规则、缓存与弱网策略。",
        flowSummary:
          "用户自然语言 → 模型判断是否需要工具 → 执行 get_weather / get_exchange_rate → 结果以 role: tool 回填 → 模型生成带来源的回答；Web 端则是 输入币种金额 → 选择参考汇率 → 方向互换取倒数 → 输出结果与口径说明。",
        productJudgment:
          "工具失败不中断会话，而是把 ok:false 回传给模型解释；Web 端不做“黑盒换算结果”，明确展示所用来源和汇率口径。",
        promptDesign: {
          goal: "让模型在需要事实数据时调用工具，并基于工具返回值回答，而不是凭记忆给汇率。",
          inputs: "用户自然语言；工具返回的结构化 JSON（含 ok、来源、时间戳）。",
          rules: "tool_choice 为 auto；一次回复中可多次调用；工具报错时解释原因并建议下一步。",
          output: "带来源与时间的换算或天气结论；Web 端输出结果数值、rate_used 文案与来源说明。",
          safeguards: "非法币种、负数金额或缺失汇率时拒绝计算；未知工具名返回错误而不是猜测执行。",
          excerpt:
            "你是汇率与天气助手。需要实时数据时调用工具；回答时说明数据来源与更新时间。",
        },
      },
      recruiting: {
        background:
          "这个项目是一次“最小工具调用 Agent + 结果可信度设计”的练习，而不是单纯做一个换算器。",
        usersScene: "适用于报销、差旅、柜台咨询和跨境结算场景；Agent 层适合在终端里快速问汇率与天气。",
        coreProblem: "汇率来源不一致、人工换算易错、弱网场景仍需出数；Agent 层要处理模型切换、工具失败与配置错误。",
        researchScope: "围绕工具契约、调用循环、模型来源切换、币种方向、汇率来源与弱网回退定义口径；不覆盖交易执行、实时行情承诺或合规报价。",
        delivery: "交付 CLI Agent（两个工具、模型可换、失败诊断）与 Web 换算器（多银行参考、固定汇率、PWA 离线、访问统计导出）。",
        risks: "Agent 层没有评测集与多轮状态管理；后续可加工具调用日志、历史汇率与银行对比视图。",
        results: [
          { label: "工具", value: "2 个 · JSON Schema" },
          { label: "模型来源", value: "OpenAI / DeepSeek / Ollama" },
          { label: "失败处理", value: "回传模型解释" },
          { label: "Web 端", value: "PWA 离线 · 缓存降级" },
        ],
      },
    summary:
        "一个最小但完整的 function calling Agent（天气 + 汇率两个工具，模型可换），加一个独立的 FastAPI / PWA 汇率换算 Web 端。重点是工具契约、失败处理与结果可复核。",
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
    tier: "core",
    homeOrder: 1,
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
  { label: "业务场景", value: "海外 B 端项目交付与跨国结算" },
  { label: "负责范围", value: "需求、规则、交付与验收路径" },
  { label: "交付方法", value: "规则建模、全栈原型、自动化验证" },
  { label: "验证方式", value: "脱敏试跑、回放与边界复盘" },
];

export const PROJECT_MANAGEMENT_META = {
  "enterprise-rag": {
    scenario: "企业制度与风险问答（公开合成数据）",
    role: "权限边界、检索链路、证据与评测设计",
    status: "公开合成数据 Demo",
    verification: "私有 40 题评测（Hit@5 97.5%）、访客／财务角色对比、X-Ray 证据检查与回归门禁",
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
    scenario: "多班组项目排期协调（脱敏）",
    role: "需求拆解、规则设计、前端交付",
    status: "公开演示原型",
    verification: "脱敏场景试排与冲突回归",
    userStory: {
      actor: "项目协调员（脱敏角色）",
      situation: "上一道工序完成后，需确认下一班组的进场安排。",
      need: "在确认前看清关键人员的参与区间是否已被其他工单占用。",
      risk: "若撞期在对方确认后才发现，需要重新协调人员与进场节点。",
      resolution: "系统在保存前拦截冲突；调整分段或更换班组成员后再保存复核。",
      evidence: "脱敏试排：排期请求、人员撞期、调整分段、保存复核。",
    },
    evidence: { title: "项目协调员的冲突处理闭环", steps: ["排期请求", "人员撞期", "调整分段", "保存复核"] },
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
      risk: "分发时容易出现余数、漏项或不同操作人员口径不一致。",
      resolution: "让单笔和批量输入共用拆分规则，并在导出前提示异常。",
      evidence: "规则用例：单笔与批量输入、余数校验、固定列导出、异常提示。",
    },
  },
  fx: {
    scenario: "终端内查汇率 / 天气，以及跨币种换算与报价辅助",
    role: "工具契约、调用循环、换算口径与弱网策略",
    status: "已上线",
    verification: "工具调用回放与多源交叉比对",
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
  role: "解决方案工程师 / Agent 开发工程师 · 企业流程提效与 AI 工具落地",
  jobTitle: "解决方案工程师 / Agent 开发工程师",
  siteUrl: "https://www.vinanverse.com/",
  pageUrl: "https://www.vinanverse.com/",
  sameAs: ["https://github.com/karma-taylor"],
  description:
    "郭伟南的作品集（解决方案工程师 / Agent 开发工程师），聚焦将海外 B 端项目交付中的规则、合规与协同经验，转化为可验证的流程提效工具与 Agent。",
  experience: [
    {
      period: "2025.07 — 至今",
      title: "海外 B 端项目交付",
      context: "Halfaya 11kV 项目 · 综合解决方案实施经理",
      detail: "推进复杂节点交付、跨文化协同与合规验收；同时梳理跨国结算中的计价、审批与审计口径。",
      proof: "将一线交付的范围、规则和验收方法迁移到系统与 Agent 设计。",
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
