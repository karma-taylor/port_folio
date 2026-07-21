# port_folio

郭伟南的 AI 产品经理作品集静态站点，聚焦真实业务规则产品化、AI 工作流设计与自动化落地案例。

## 在线访问

- 主站：[https://www.vinanverse.com/](https://www.vinanverse.com/)

## 当前发布策略

- 仓库根目录直接承载正式首页
- `zuopinji/index.html` 仅保留为历史链接兼容跳转页
- 自定义域名通过 GitHub Pages + `CNAME` 配置到 `www.vinanverse.com`

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
├─ CNAME                # GitHub Pages 自定义域名
├─ styles.css
├─ redesign.css
├─ main.js
├─ data/
├─ render/
├─ interactions/
├─ seo/
├─ zuopinji/            # 旧路径兼容层
└─ *.png / *.jpg / resume.pdf
```
