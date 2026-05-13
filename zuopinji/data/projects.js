/**
 * Portfolio · 项目数据中心
 *
 * 唯一权威 (Single Source of Truth)：
 *   - 数组顺序 = DOM 顺序 = 视觉顺序（左→右、上→下）
 *   - 改顺序请直接重排数组，不要写位置依赖的 CSS 规则
 *
 * 字段约束见 ARCHITECTURE_GUIDE.md §5。
 */

export const PROJECTS = [
  {
    id: "money",
    index: "01",
    size: "tall",
    status: "live",
    statusLabel: "已上线",
    title: "薪资分配策略工具（Money Distribute AI）",
    titleLong: "基于逻辑算法的薪资分配策略工具（Money Distribute AI）",
    outcomes: [
      "批量配钞：典型场景下人工拆分与核对约从 30 分钟压到 3 分钟级",
      "支持 Excel 批量导入导出，单笔网页秒级计算",
    ],
    cover: {
      src: "./money-cover.png",
      version: "20260512-darkmoney",
      alt: "基于逻辑算法的薪资分配策略工具项目展示图",
    },
    hoverValue:
      "基于贪心算法的薪资现金分配策略：按可用面额自动拆分张数与余数，单笔即时计算 + Excel 批量导入导出，小程序版同步在路上。",
    hoverCta: {
      href: "https://karma-taylor.github.io/money_classify/",
      label: "访问演示",
      aria: "访问薪资分配策略工具演示",
    },
    tech: [
      { type: "lang", label: "JavaScript" },
      { type: "tool", label: "Excel 导入导出" },
      { type: "framework", label: "WeChat 小程序" },
      { type: "ai", label: "Cursor" },
      { type: "deploy", label: "GitHub Pages" },
    ],
    flow: {
      ariaLabel: "薪资分配策略工具 业务流程",
      steps: [
        { idx: "01", label: "选定面额" },
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
      summary:
        "一款基于贪心算法的薪资分配策略工具，按可用面额（50000/25000/10000/5000/1000）从大到小自动拆分张数与余数。提供网页端单笔计算与 Excel 批量导入导出；并已准备微信小程序版本（单笔配钞 + 批量处理）。",
      prompt:
        "Prompt：你是一个银行柜员，需要根据当天可用纸币面额为员工薪酬进行现金配钞。请按“从大到小优先”的贪心策略计算每种面额张数，并返回余数。任务要求：可用面额支持 50000、25000、10000、5000、1000（可按实际情况勾选启用/禁用）。对每笔金额先使用最大可用面额尽可能多张，再对余数继续使用下一档面额，直到最小面额处理完成。输出字段包括姓名（如有）、薪水金额、各面额张数（50000、25000、10000、5000、1000）与余数。批量模式导入规则：A 列姓名、B 列薪水，其余列可忽略并重新计算；导出固定列顺序：姓名、薪水、50000、25000、10000、5000、1000。校验规则：金额必须为非负数；无法解析的金额行需标记为错误并跳过；当未选择任何面额时，返回明确提示。",
      links: [
        {
          type: "github",
          href: "https://github.com/karma-taylor/money_classify.git",
          label: "GitHub 链接",
        },
        {
          type: "live",
          href: "https://karma-taylor.github.io/money_classify/",
          label: "上线链接",
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
    title: "HamHome Daily Digest",
    titleLong: "HamHome Daily Digest（资讯日报订阅系统）",
    outcomes: [
      "自动抓取多源资讯并按时区定时推送",
      "RAG 分桶 + 结构化摘要，降低重复浏览与摘抄成本",
    ],
    cover: {
      src: "./digest-cover.png",
      alt: "HamHome Daily Digest 项目展示图",
    },
    hoverValue:
      "把分散资讯主动整理成定时送达的结构化每日简报，AIAgent + RAG 自动分桶摘要。",
    hoverCta: {
      href: "https://hamhome-digest-web.pages.dev/digest",
      label: "访问演示",
      aria: "访问 HamHome Daily Digest 演示",
    },
    tech: [
      { type: "lang", label: "Python" },
      { type: "framework", label: "RAG" },
      { type: "tool", label: "定时任务" },
      { type: "ai", label: "Cursor" },
      { type: "deploy", label: "Cloudflare Pages" },
    ],
    flow: {
      ariaLabel: "HamHome Daily Digest 业务流程",
      steps: [
        { idx: "01", label: "多源抓取" },
        { idx: "02", label: "主题分桶" },
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
      summary:
        "基于 AIAgent + RAG 思路的自动化资讯订阅平台，支持多源抓取、主题分桶、结构化摘要，并按时区定时邮件推送。",
      prompt:
        "Prompt：你是专业新闻编辑。请基于输入的多条资讯摘录，按指定主题输出结构化 JSON（仅 JSON，不要 Markdown），每个主题提供一句话综述和若干要点；要求客观、去重、不编造事实，并确保内容聚焦订阅时区“当日”信息。",
      links: [
        {
          type: "github",
          href: "https://github.com/karma-taylor/Daily_digest",
          label: "GitHub 链接",
        },
        {
          type: "live",
          href: "https://hamhome-digest-web.pages.dev/digest",
          label: "上线链接",
        },
      ],
    },
  },

  {
    id: "fx",
    index: "03",
    size: "featured",
    status: "live",
    statusLabel: "已上线",
    title: "汇率换算 Agent",
    titleLong: "weather-fx-agent（汇率换算 Agent）",
    outcomes: [
      "多银行参考 + 防呆纠偏，换算结果可复核、可交付",
      "弱网/缓存策略，柜台与出差场景仍可快速出数",
    ],
    cover: {
      src: "./fx-cover.jpg",
      version: "20260512-darkfx",
      alt: "weather-fx-agent 项目展示图",
    },
    hoverValue:
      "把“今天哪家汇率？”瞬间变成可执行的换算结果，多银行参考、防呆纠偏、弱网可用。",
    hoverCta: {
      href: "https://karmacat-weather-fx-agent.hf.space",
      label: "访问演示",
      aria: "访问 weather-fx-agent 演示",
    },
    tech: [
      { type: "lang", label: "JavaScript" },
      { type: "lang", label: "HTML / CSS" },
      { type: "tool", label: "汇率 API" },
      { type: "ai", label: "Cursor" },
    ],
    flow: {
      ariaLabel: "汇率换算 Agent 业务流程",
      steps: [
        { idx: "01", label: "输入金额" },
        { idx: "02", label: "多银行汇率" },
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
      summary:
        "面向业务场景的汇率换算 Web 工具，支持多银行参考、固定汇率、防呆纠偏与弱网可用。",
      prompt:
        'Prompt：你是一个汇率换算助手。任务：根据用户输入的 base、target、amount 和 rate（可选），返回换算后的数字结果。规则：1) 固定汇率模式：converted = amount * rate，rate 表示 1 base = rate target。2) 若为网络模式，使用提供的实时 rate 计算。3) 若币种方向互换（A/B -> B/A），rate 需取倒数后再计算。4) 输出仅包含：换算结果数字、使用汇率、币种单位。5) 不输出业务分析、PRD术语或空泛描述。输出格式：- converted: <number> - rate_used: "1 <base> = <x> <target>" - note: "<网络汇率/固定汇率/缓存汇率>"',
      links: [
        {
          type: "github",
          href: "https://github.com/karma-taylor/weather-fx-agent",
          label: "GitHub 链接",
        },
        {
          type: "live",
          href: "https://karmacat-weather-fx-agent.hf.space",
          label: "上线链接",
        },
      ],
    },
  },

  {
    id: "calendar",
    index: "04",
    size: "wide",
    status: "live",
    statusLabel: "已上线",
    title: "工作日历排班系统",
    titleLong: "工作日历（Work Calendar）",
    outcomes: [
      "保存前冲突校验，显著减少排班撞期与返工沟通",
      "Excel 名单锁定 + 云端同步，名单与工单不易丢",
    ],
    cover: {
      src: "./calendar-cover.jpg",
      version: "20260512-darkcal",
      alt: "工作日历（Work Calendar）项目展示图",
    },
    hoverValue:
      "排班冲突在保存前就被卡住，分段安排、Excel 名单锁定、云端持久化，不丢数据。",
    hoverCta: {
      href: "https://work-calendar-52c.pages.dev",
      label: "访问演示",
      aria: "访问工作日历演示",
    },
    tech: [
      { type: "framework", label: "React" },
      { type: "framework", label: "Vite" },
      { type: "tool", label: "Supabase" },
      { type: "ai", label: "Cursor" },
      { type: "deploy", label: "Cloudflare Pages" },
    ],
    flow: {
      ariaLabel: "工作日历 业务流程",
      steps: [
        { idx: "01", label: "名单导入" },
        { idx: "02", label: "分段排期" },
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
      summary:
        "面向施工与运维排班场景的可视化日历工具，支持项目占用展示、人员分配、冲突校验与云端持久化。",
      prompt:
        "Prompt：你是一个施工计划与资源统筹专家，同时也是资深前端工程师。请为我开发一个“施工/运维排班日历系统（Work Calendar）”，用于项目排期、人员分配与冲突管控。请严格按以下要求实现：【业务目标】以月历形式展示工单占用周期（长线条可视化）。支持创建工单并分配管理人员与工人。支持同一工单内“多拨人分段参与”，而非默认全程参与。严格限制：同一人同一时间不得被分配到两个工单。支持 Excel 名单导入、锁定、自动更新检测。支持本地缓存与云端持久化，避免数据丢失。【功能需求】A. 日历与工单：月视图，支持上/下月切换。每个工单按起止日期显示横向长线，占用可跨周，视觉连续。点击工单查看详情弹窗。增加“删除模式”开关：开启后点击工单可删除（需确认）。B. 新建工单：字段：工单名称、开始日期、结束日期。保留“管理人员/工人”基础选择。重点：新增“人员分段安排”表单（可多行）：人员、角色（管理/工人）、分段开始日期、分段结束日期、备注（可选）。每行支持“复制一行”“删除一行”。分段日期必须落在工单总日期范围内。C. 冲突校验（强约束）：冲突判定粒度为“人员分段”，不是工单全程。判定规则：若同一人两条分段时间有交集（aStart <= bEnd 且 bStart <= aEnd），禁止保存。冲突提示应给出：冲突人员 + 冲突工单名。D. Excel 人员名单导入规则：只读取 sheet：江都、省建、科林。额外：CSI/CSIsheet 也读取，且其人员一律归管理人员。从第 3 行开始读取。C 列为姓名，F 列为岗位。岗位包含“工”归工人，否则归管理。同名不合并，展示时用“姓名(公司/来源sheet)”区分。E. 名单锁定与自动更新：提供“锁定人员名单文件”能力（File System Access API）。刷新后尽量自动恢复锁定；若权限失效，保留缓存名单并提示“需重新关联”。文件内容变更后自动重新解析并更新名单。F. 数据持久化：本地：localStorage 作为兜底。云端：Supabase 免费方案（云端优先 + 本地兜底）。云端存储至少覆盖：工单、人员名单状态。提供必要的建表 SQL 与环境变量说明。【技术约束】前端：React + Vite。可使用 xlsx 解析 Excel。可使用 @supabase/supabase-js。代码结构清晰，避免一次性写在单个超大函数。对关键逻辑添加简洁注释。【交付要求】给出可运行代码。给出关键数据结构定义（Project、Assignment、Staff）。给出冲突校验核心函数。给出 Supabase 建表 SQL、RLS/策略示例。给出 Cloudflare Pages 部署步骤与环境变量清单。给出最小验收清单（创建工单、分段冲突、导入锁定、刷新恢复、云端同步）。请按“先核心可用、再增强”的顺序实现，并确保最终可部署到公网固定地址使用。",
      links: [
        {
          type: "github",
          href: "https://github.com/karma-taylor/work_calendar",
          label: "GitHub 链接",
        },
        {
          type: "live",
          href: "https://work-calendar-52c.pages.dev",
          label: "上线链接",
        },
      ],
    },
  },

  {
    id: "report",
    index: "05",
    size: "small",
    status: "wip",
    statusLabel: "待部署",
    title: "日报自动化生成引擎",
    titleLong: "企业业务日报自动化生成引擎（Business Daily Report Engine）",
    outcomes: [
      "单次日结统计从约 2 小时压到约 10 分钟（人工约 ↓90%）",
      "多维数据自动清洗并按模板秒级生成日报 / 台账 / 异常清单",
    ],
    cover: {
      src: "./report-cover.png",
      version: "20260512-darkrep",
      alt: "企业业务日报自动化生成引擎项目展示图",
    },
    hoverValue:
      "用 Python 脚本取代日结的手工搬数与排版：多维业务数据自动清洗、复杂表单秒级生成与分发，单次日结结算的人工统计时间降低约 90%。",
    hoverCta: {
      href: "https://github.com/karma-taylor/Daily_report",
      label: "查看代码",
      aria: "查看企业业务日报自动化生成引擎源码",
    },
    tech: [
      { type: "lang", label: "Python" },
      { type: "framework", label: "pandas" },
      { type: "framework", label: "openpyxl" },
      { type: "framework", label: "Streamlit" },
      { type: "ai", label: "Cursor" },
    ],
    flow: {
      ariaLabel: "企业业务日报自动化生成引擎 业务流程",
      steps: [
        { idx: "01", label: "数据采集" },
        { idx: "02", label: "业务清洗" },
        { idx: "03", label: "模板渲染" },
        { idx: "04", label: "异常勘误", accent: true },
      ],
    },
    github: {
      href: "https://github.com/karma-taylor/Daily_report",
      magnetic: true,
      magneticStrength: 0.25,
    },
    detail: {
      summary:
        "面向企业业务结算场景的日报自动化引擎：用 Python 脚本取代日结的手工搬数与排版，基于 pandas + openpyxl + Streamlit 对多维业务数据自动清洗、合并与勘误，按既定模板秒级生成 B 日报、C 材料记录与 D 台账并输出异常清单，把单次日结的人工统计时间从约 2 小时压到 10 分钟以内（降低约 90%）。",
      prompt:
        "Prompt：你是一个“企业业务日报自动化”专家。请根据输入的 A 表数据和历史模板（B/C/D 表），按既定业务规则自动生成当日 B 日报、C 材料记录、D 台账，并输出异常清单。你需要确保：1）固定区复制与材料顺序正确；2）盐行规则、495/494 合并规则严格执行；3）单价匹配与累计计算准确；4）输出文件保持原模板格式（合并、边框、底色、字体、对齐）；5）结果可追溯、可复核、可直接交付。",
      links: [
        {
          type: "github",
          href: "https://github.com/karma-taylor/Daily_report",
          label: "GitHub 链接",
        },
        {
          type: "live",
          href: "https://example.com/",
          label: "暂未上线（待部署）",
        },
      ],
    },
  },
];

/**
 * 站点身份信息（用于 SEO / structured data / noscript）
 */
export const PROFILE = {
  name: "郭伟南",
  alternateName: "Guo Weinan",
  role: "AI 产品经理 · Agent 应用",
  jobTitle: "AI 产品经理",
  siteUrl: "https://karma-taylor.github.io/port_folio/",
  pageUrl: "https://karma-taylor.github.io/port_folio/zuopinji/",
  sameAs: ["https://github.com/karma-taylor"],
  description:
    "郭伟南的个人作品集：Agent 应用、数据型工具、Web 前端。包含汇率换算 Agent、HamHome 资讯日报、薪资分配策略工具等 5 个落地项目。",
};
