/**
 * Portfolio · 项目数据中心
 *
 * 唯一权威 (Single Source of Truth)：
 *   - 数组顺序 = DOM 顺序 = 视觉顺序（左→右、上→下）
 *   - 当前顺序按「产品 + AI + 业务价值」突出度排列（非按时间/字母）
 *   - 改顺序请直接重排数组，不要写位置依赖的 CSS 规则
 *
 * 字段约束见 ARCHITECTURE_GUIDE.md §5。
 */

export const PROJECTS = [
  {
    id: "calendar",
    index: "01",
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
      focus: {
        tagline: "让「谁在哪段工期、有没有撞期」在保存前就被系统拦住，减少群里反复确认。",
        problem:
          "谁在用：施工 / 运维排班、项目统筹。痛点：同一工单多人分段参与、Excel 名单频繁变，靠人肉对齐时间窗极易撞期。",
        flowSummary:
          "① 月视图展示工单跨周占用 → ② 人员分段参与（非全程默认）→ ③ 以「分段」粒度做冲突校验 → ④ 云端 + 本地双持久化。",
        promptDesign: {
          goal: "生成可部署的排班日历：工单、人员分段、冲突规则与名单导入策略都可验收。",
          inputs: "工单起止、人员角色、分段起止；多 sheet 名单与岗位列映射规则。",
          rules: "冲突粒度到「人员分段」；区间相交即禁止保存并提示人员 + 工单名；分段必须落在工单总区间内。",
          output: "可运行前端 + 数据结构说明 + 冲突函数 + Supabase SQL 与部署说明。",
          excerpt:
            "你是施工计划与资源统筹专家 + 资深前端。\n目标：月历 + 工单长线 + 分段人员。\n硬约束：同人分段不得时间相交。\n交付：React+Vite+Supabase，可部署。",
        },
      },
      summary:
        "面向施工与运维排班场景的可视化日历工具，支持项目占用展示、人员分配、冲突校验与云端持久化。",
      prompt:
        "Prompt：你是一个施工计划与资源统筹专家，同时也是资深前端工程师。请为我开发一个“施工/运维排班日历系统（Work Calendar）”，用于项目排期、人员分配与冲突管控。请严格按以下要求实现：【业务目标】以月历形式展示工单占用周期（长线条可视化）。支持创建工单并分配管理人员与工人。支持同一工单内“多拨人分段参与”，而非默认全程参与。严格限制：同一人同一时间不得被分配到两个工单。支持 Excel 名单导入、锁定、自动更新检测。支持本地缓存与云端持久化，避免数据丢失。【功能需求】A. 日历与工单：月视图，支持上/下月切换。每个工单按起止日期显示横向长线，占用可跨周，视觉连续。点击工单查看详情弹窗。增加“删除模式”开关：开启后点击工单可删除（需确认）。B. 新建工单：字段：工单名称、开始日期、结束日期。保留“管理人员/工人”基础选择。重点：新增“人员分段安排”表单（可多行）：人员、角色（管理/工人）、分段开始日期、分段结束日期、备注（可选）。每行支持“复制一行”“删除一行”。分段日期必须落在工单总日期范围内。C. 冲突校验（强约束）：冲突判定粒度为“人员分段”，不是工单全程。判定规则：若同一人两条分段时间有交集（aStart <= bEnd 且 bStart <= aEnd），禁止保存。冲突提示应给出：冲突人员 + 冲突工单名。D. Excel 人员名单导入规则：只读取 sheet：江都、省建、科林。额外：CSI/CSIsheet 也读取，且其人员一律归管理人员。从第 3 行开始读取。C 列为姓名，F 列为岗位。岗位包含“工”归工人，否则归管理。同名不合并，展示时用“姓名(公司/来源sheet)”区分。E. 名单锁定与自动更新：提供“锁定人员名单文件”能力（File System Access API）。刷新后尽量自动恢复锁定；若权限失效，保留缓存名单并提示“需重新关联”。文件内容变更后自动重新解析并更新名单。F. 数据持久化：本地：localStorage 作为兜底。云端：Supabase 免费方案（云端优先 + 本地兜底）。云端存储至少覆盖：工单、人员名单状态。提供必要的建表 SQL 与环境变量说明。【技术约束】前端：React + Vite。可使用 xlsx 解析 Excel。可使用 @supabase/supabase-js。代码结构清晰，避免一次性写在单个超大函数。对关键逻辑添加简洁注释。【交付要求】给出可运行代码。给出关键数据结构定义（Project、Assignment、Staff）。给出冲突校验核心函数。给出 Supabase 建表 SQL、RLS/策略示例。给出 Cloudflare Pages 部署步骤与环境变量清单。给出最小验收清单（创建工单、分段冲突、导入锁定、刷新恢复、云端同步）。请按“先核心可用、再增强”的顺序实现，并确保最终可部署到公网固定地址使用。",
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
      focus: {
        tagline: "把分散资讯收敛成「按时送达」的结构化日报，减少每天刷群和摘抄。",
        problem:
          "谁在用：需要跟踪多源信息的产品/运营/研究。痛点：信息源碎、重复阅读成本高，且要按时区对齐「当日」要点。",
        flowSummary:
          "① 多源抓取 → ② 主题分桶与去重 → ③ 结构化摘要（JSON 形态约束）→ ④ 定时邮件推送。",
        promptDesign: {
          goal: "把多条摘录压缩成按主题组织的 JSON，便于下游直接消费或存档。",
          inputs: "多条资讯摘录 + 指定主题列表 + 订阅时区（约束「当日」范围）。",
          rules: "客观、去重、不编造；只输出 JSON、不要 Markdown；每主题需一句话综述 + 要点。",
          output: "单一 JSON：主题 → { 综述, 要点[] }，可被邮件模板或前端直接渲染。",
          excerpt:
            "你是专业新闻编辑。\n基于摘录按主题输出结构化 JSON（仅 JSON）。\n每个主题：一句话综述 + 若干要点。\n聚焦订阅时区「当日」信息，禁止臆造。",
        },
      },
      summary:
        "基于 AIAgent + RAG 思路的自动化资讯订阅平台，支持多源抓取、主题分桶、结构化摘要，并按时区定时邮件推送。",
      prompt:
        "Prompt：你是专业新闻编辑。请基于输入的多条资讯摘录，按指定主题输出结构化 JSON（仅 JSON，不要 Markdown），每个主题提供一句话综述和若干要点；要求客观、去重、不编造事实，并确保内容聚焦订阅时区“当日”信息。",
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
      focus: {
        tagline:
          "把「按面额发薪配钞」做成可批量跑、可校验的在线工具，减少 Excel 来回和人工复读。",
        problem:
          "谁在用：人力、财务或协同发薪岗位。痛点：多档面额组合、余数不能硬圆、批量名单纠错成本高，还要和既有 Excel 习惯衔接。",
        flowSummary:
          "① 勾选可用面额 → ② 按「从大到小」贪心拆张 → ③ 单笔与批量行的余数 / 非法金额校验 → ④ 一键导出固定列顺序，便于二次分发。",
        promptDesign: {
          goal: "在给定可选面额下，为每笔薪水分解张数并给出余数，并支持批量导入导出与列约束。",
          inputs: "单笔：薪资金额 + 启用的面额；批量：A 列姓名、B 列薪水（其余列忽略并重算）。",
          rules: "金额非负；未选面额须明确提示；无法解析的行标记跳过；导出列顺序写死，避免下游再吃格式。",
          output: "每行：各面额张数 + 余数；批量导出顺序：姓名、薪水、50000…1000。",
          excerpt:
            "你是银行柜员，负责现金配钞。\n按「从大到小优先」贪心：先用最大可用面额，再依次处理余数。\n输出：姓名（可选）、各面额张数、余数。\n批量：A 列姓名、B 列薪水；导出列顺序固定。",
        },
      },
      summary:
        "一款基于贪心算法的薪资分配策略工具，按可用面额（50000/25000/10000/5000/1000）从大到小自动拆分张数与余数。提供网页端单笔计算与 Excel 批量导入导出；并已准备微信小程序版本（单笔配钞 + 批量处理）。",
      prompt:
        "Prompt：你是一个银行柜员，需要根据当天可用纸币面额为员工薪酬进行现金配钞。请按“从大到小优先”的贪心策略计算每种面额张数，并返回余数。任务要求：可用面额支持 50000、25000、10000、5000、1000（可按实际情况勾选启用/禁用）。对每笔金额先使用最大可用面额尽可能多张，再对余数继续使用下一档面额，直到最小面额处理完成。输出字段包括姓名（如有）、薪水金额、各面额张数（50000、25000、10000、5000、1000）与余数。批量模式导入规则：A 列姓名、B 列薪水，其余列可忽略并重新计算；导出固定列顺序：姓名、薪水、50000、25000、10000、5000、1000。校验规则：金额必须为非负数；无法解析的金额行需标记为错误并跳过；当未选择任何面额时，返回明确提示。",
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
      focus: {
        tagline: "把「今天用哪家汇率」变成可复核的数字结果，减少口头对账和二次计算。",
        problem:
          "谁在用：有跨境结算、差旅报销或柜台询价的人。痛点：多源汇率不一致、手算易错、弱网下还要能出数。",
        flowSummary:
          "① 输入币种与金额 → ② 拉取/选择参考汇率（网络或固定）→ ③ 方向互换时倒数修正 + 防呆校验 → ④ 输出换算结果与所用口径。",
        promptDesign: {
          goal: "在给定 base/target/amount（及可选 rate）下返回可审计的换算结果与所用汇率说明。",
          inputs: "base、target、amount、可选 rate；网络模式使用实时 rate。",
          rules: "固定模式：converted = amount × rate（1 base = rate target）；互换方向时先取倒数；禁止输出营销话术。",
          output: "converted 数值 + rate_used 文案 + note（网络/固定/缓存）。",
          excerpt:
            "你是汇率换算助手。\n根据 base、target、amount、rate（可选）返回数字结果。\n固定：1 base = rate target；互换需倒数。\n只输出：结果、汇率、币种说明。",
        },
      },
      summary:
        "面向业务场景的汇率换算 Web 工具，支持多银行参考、固定汇率、防呆纠偏与弱网可用。",
      prompt:
        'Prompt：你是一个汇率换算助手。任务：根据用户输入的 base、target、amount 和 rate（可选），返回换算后的数字结果。规则：1) 固定汇率模式：converted = amount * rate，rate 表示 1 base = rate target。2) 若为网络模式，使用提供的实时 rate 计算。3) 若币种方向互换（A/B -> B/A），rate 需取倒数后再计算。4) 输出仅包含：换算结果数字、使用汇率、币种单位。5) 不输出业务分析、PRD术语或空泛描述。输出格式：- converted: <number> - rate_used: "1 <base> = <x> <target>" - note: "<网络汇率/固定汇率/缓存汇率>"',
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
      focus: {
        tagline: "把日结里「搬数、对齐模板、出异常清单」交给脚本，让人只做复核与拍板。",
        problem:
          "谁在用：结算 / 运营做日报与台账的团队。痛点：多维表合并、规则多、模板格式不能丢，人肉耗时长且易返工。",
        flowSummary:
          "① 采集 A 表与历史模板 → ② pandas 清洗合并与规则校验 → ③ 按模板渲染 B/C/D → ④ 输出异常清单供人工勘误。",
        promptDesign: {
          goal: "按业务规则从 A 表生成当日 B/C/D，并保证版式与审计要求。",
          inputs: "当日 A 表数据 + 既有模板（B/C/D）与历史口径。",
          rules: "固定区复制、材料顺序、盐行与 495/494 合并等硬规则；单价与累计可复核。",
          output: "保持合并单元格与样式的 Excel；附异常清单，便于追溯。",
          excerpt:
            "你是企业业务日报自动化专家。\n输入 A 表 + 模板，生成 B/C/D。\n硬规则：盐行、495/494 合并、单价匹配。\n输出：保持原模板格式，可追溯。",
        },
      },
      summary:
        "面向企业业务结算场景的日报自动化引擎：用 Python 脚本取代日结的手工搬数与排版，基于 pandas + openpyxl + Streamlit 对多维业务数据自动清洗、合并与勘误，按既定模板秒级生成 B 日报、C 材料记录与 D 台账并输出异常清单，把单次日结的人工统计时间从约 2 小时压到 10 分钟以内（降低约 90%）。",
      prompt:
        "Prompt：你是一个“企业业务日报自动化”专家。请根据输入的 A 表数据和历史模板（B/C/D 表），按既定业务规则自动生成当日 B 日报、C 材料记录、D 台账，并输出异常清单。你需要确保：1）固定区复制与材料顺序正确；2）盐行规则、495/494 合并规则严格执行；3）单价匹配与累计计算准确；4）输出文件保持原模板格式（合并、边框、底色、字体、对齐）；5）结果可追溯、可复核、可直接交付。",
      links: [
        {
          type: "github",
          href: "https://github.com/karma-taylor/Daily_report",
          label: "查看 GitHub",
        },
      ],
    },
  }

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
    "郭伟南的个人作品集：突出工作日历排班、HamHome 资讯日报（RAG）、薪资分配策略工具、汇率换算 Agent 与业务日报自动化等「产品 + AI + 业务价值」落地案例。",
};
