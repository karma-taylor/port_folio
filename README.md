# port_folio

郭伟南的作品集静态站点（解决方案工程师 / Agent 开发工程师），聚焦企业流程提效、真实业务规则系统化与 Agent / AI 工具落地案例。

## 在线访问

- 主站：[https://www.vinanverse.com/](https://www.vinanverse.com/)

## 当前发布策略

- 仓库根目录直接承载正式首页
- `zuopinji/index.html` 仅保留为历史链接兼容跳转页
- 自定义域名通过 GitHub Pages + `CNAME` 配置到 `www.vinanverse.com`

## 页面结构

- 首页 `index.html` + `script.js`：一屏一节。开屏是深色背景、居中一行身份、底部两行简介与本地时间；顶部居中黑色凹槽平时只显示「Vinan」（带扫光），悬停（桌面）时向两侧横向撑开露出 3+3 入口，点 Vinan 回开屏；手机上点按 Vinan 展开/收起；点导航按 hash 切换到对应整屏（`#about` 速览 / `#proof` 证据 / `#experience` 经历 / `#work` 案例 / `#approach` 方法 / `#contact` 联系），`#top` 回开屏，支持 ← → 键。`nav.js` 为首页与案例页共用的导航开合逻辑
- 案例页 `cases/*/index.html`：由 `tools/build-case-pages.mjs` 生成，统一为速览 → 背景与用户 → 方案与取舍 → 结果与指标 → 交付证据 → 风险与边界 → 复盘 → 联系

修改 `data/projects.js`（内容、`tier`、`homeOrder`）后，重新生成案例页与首页清单：

```bash
node tools/build-case-pages.mjs
```

## 访问统计

`analytics.js` 接入 [Umami Cloud](https://cloud.umami.is/)：

1. 在 Umami 新建站点 `www.vinanverse.com`，把 Website ID 填入 `analytics.js` 的 `UMAMI_WEBSITE_ID`。留空时不加载任何统计脚本，本地预览也不会上报。
2. 投递时给不同渠道发带参数的链接，例如 `https://www.vinanverse.com/?utm_source=boss&utm_campaign=b`。来源会在本次访问内记住，跨页面附在点击事件上。
3. 已埋点事件：`resume_download`、`email_click`、`wechat_open`、`case_open`、`live_open`、`github_open`。

## 本地预览

由于项目使用 ES Modules，请不要直接通过 `file://` 打开。建议在仓库根目录启动一个静态服务器：

```bash
python -m http.server 5500
```

然后访问：

- 首页：`http://localhost:5500/`
- 旧路径兼容页：`http://localhost:5500/zuopinji/`

## 目录说明

```text
port_folio/
├─ index.html           # 正式首页
├─ script.js            # 首页案例渲染与交互
├─ case.js              # 案例页交互
├─ analytics.js         # Umami 统计与渠道来源
├─ styles.css           # 首页与案例页样式
├─ CNAME                # GitHub Pages 自定义域名
├─ data/                # projects.js（内容源）与 case-manifest.js（生成）
├─ cases/               # 生成的案例页
├─ tools/               # 案例页生成、封面截图与审查脚本
├─ zuopinji/            # 旧路径兼容层
└─ *.png / *.jpg / resume.pdf
```
