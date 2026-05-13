/**
 * 渲染器测试
 * 通过把 PROJECTS[0] 渲染成 DOM，验证：
 *   - 类名、data-* 属性正确
 *   - slot 文本填充正确
 *   - tech 数 / flow 数对齐数据
 *   - detail-link 图标按 type 留对应那个、去掉另一个
 *   - buildCoverUrl 拼接逻辑
 */

import {
  describe,
  it,
  assert,
  assertEqual,
  assertIncludes,
} from "./runner.js";
import { PROJECTS } from "../zuopinji/data/projects.js";
import {
  renderProjectCard,
  renderAllProjects,
  buildCoverUrl,
  sortDetailLinks,
} from "../zuopinji/render/project-card.js";
import { loadProductionTemplates } from "./test-setup.js";

await loadProductionTemplates();

describe("sortDetailLinks", () => {
  it("live 排在 github 之前", () => {
    const sorted = sortDetailLinks([
      { type: "github", href: "https://g.example", label: "G" },
      { type: "live", href: "https://l.example", label: "L" },
    ]);
    assertEqual(sorted[0].type, "live");
    assertEqual(sorted[1].type, "github");
  });
});

describe("buildCoverUrl", () => {
  it("带 version 时拼出 ?v= 参数", () => {
    const url = buildCoverUrl({ src: "./a.png", version: "20260512" });
    assertEqual(url, "./a.png?v=20260512");
  });

  it("不带 version 时返回纯 src", () => {
    const url = buildCoverUrl({ src: "./a.png" });
    assertEqual(url, "./a.png");
  });
});

describe("renderProjectCard · DOM 结构", () => {
  const sample = PROJECTS.find((p) => p.id === "money");
  let node;
  it("setup · 渲染 money 卡", () => {
    node = renderProjectCard(sample);
    assert(node, "未返回节点");
  });

  it("根节点是 article.project-card.reveal", () => {
    assertEqual(node.tagName, "ARTICLE");
    assert(node.classList.contains("project-card"));
    assert(node.classList.contains("reveal"));
  });

  it("data-status / data-size 正确", () => {
    assertEqual(node.dataset.status, sample.status);
    assertEqual(node.dataset.size, sample.size);
  });

  it("封面 src/alt + CSS var 已填", () => {
    const img = node.querySelector('[data-slot="cover-img"]');
    assertIncludes(img.src, sample.cover.src.replace("./", ""));
    if (sample.cover.version) {
      assertIncludes(img.src, sample.cover.version);
    }
    assertEqual(img.alt, sample.cover.alt);
    const cover = node.querySelector('[data-slot="cover-bg"]');
    assertIncludes(cover.style.cssText, sample.cover.src);
  });

  it("hover overlay + CTA 已填", () => {
    assertEqual(
      node.querySelector('[data-slot="hover-value"]').textContent,
      sample.hoverValue
    );
    const cta = node.querySelector('[data-slot="hover-cta"]');
    assertEqual(cta.getAttribute("href"), sample.hoverCta.href);
    assertEqual(cta.getAttribute("aria-label"), sample.hoverCta.aria);
    assertEqual(
      node.querySelector('[data-slot="hover-cta-label"]').textContent,
      sample.hoverCta.label
    );
  });

  it("meta · index / title / status / status-label", () => {
    assertEqual(node.querySelector('[data-slot="index"]').textContent, sample.index);
    assertEqual(node.querySelector('[data-slot="title"]').textContent, sample.title);
    assertEqual(node.dataset.titleLong, sample.titleLong);

    const status = node.querySelector('[data-slot="status"]');
    assert(status.classList.contains(`project-status--${sample.status}`));
    assertEqual(
      node.querySelector('[data-slot="status-label"]').textContent,
      sample.statusLabel
    );
  });

  it("outcomes 列表与数据一致", () => {
    const items = node.querySelectorAll('[data-slot="outcomes-list"] li');
    assertEqual(items.length, sample.outcomes.length);
    items.forEach((li, i) => {
      assertEqual(li.textContent, sample.outcomes[i]);
    });
  });

  it("tech 列表条数 = 数据条数，data-tech-type 正确", () => {
    const items = node.querySelectorAll('[data-slot="tech-list"] li');
    assertEqual(items.length, sample.tech.length);
    items.forEach((li, i) => {
      assertEqual(li.dataset.techType, sample.tech[i].type);
      assertEqual(li.textContent, sample.tech[i].label);
    });
  });

  it("flow 4 步 + accent 类", () => {
    const steps = node.querySelectorAll('[data-slot="flow-list"] li.flow-step');
    assertEqual(steps.length, 4);
    steps.forEach((li, i) => {
      const data = sample.flow.steps[i];
      assertEqual(li.querySelector('[data-slot="flow-idx"]').textContent, data.idx);
      assertEqual(li.querySelector('[data-slot="flow-label"]').textContent, data.label);
      if (data.accent) {
        assert(li.classList.contains("flow-step--accent"), "accent 步骤缺类");
      } else {
        assert(!li.classList.contains("flow-step--accent"), "非 accent 步骤多余类");
      }
    });
  });

  it("github-cta href + magnetic 属性正确", () => {
    const cta = node.querySelector('[data-slot="github-cta"]');
    assertEqual(cta.getAttribute("href"), sample.github.href);
    assert(cta.hasAttribute("data-magnetic"));
    if (sample.github.magneticStrength != null) {
      assertEqual(cta.dataset.magneticStrength, String(sample.github.magneticStrength));
    }
  });

  it("detail · summary / focus-export / links（上线在前）", () => {
    assertEqual(
      node.querySelector('[data-slot="summary"]').textContent,
      sample.detail.summary
    );
    const prompt = node.querySelector('[data-slot="prompt"]');
    assertEqual(prompt.textContent, "");
    assert(prompt.hasAttribute("hidden"));

    const exp = node.querySelector('[data-slot="focus-export"]');
    assert(exp, "应有 focus-export 根节点");
    assertEqual(
      exp.querySelector('[data-slot="focus-tagline"]').textContent,
      sample.detail.focus.tagline
    );
    assertEqual(
      exp.querySelector('[data-slot="focus-problem"]').textContent,
      sample.detail.focus.problem
    );

    const sorted = sortDetailLinks(sample.detail.links);
    const links = node.querySelectorAll('[data-slot="detail-links"] a');
    assertEqual(links.length, sorted.length);
    links.forEach((a, i) => {
      assertEqual(a.getAttribute("href"), sorted[i].href);
    });
  });

  it("detail link 图标按 type 留 / 去除", () => {
    const sorted = sortDetailLinks(sample.detail.links);
    const links = node.querySelectorAll('[data-slot="detail-links"] a');
    links.forEach((a, i) => {
      const type = sorted[i].type;
      const githubIcon = a.querySelector('[data-icon-for="github"]');
      const liveIcon = a.querySelector('[data-icon-for="live"]');
      if (type === "github") {
        assert(githubIcon, "github 链接应保留 github 图标");
        assert(!liveIcon, "github 链接不应保留 live 图标");
      } else if (type === "live") {
        assert(liveIcon, "live 链接应保留 live 图标");
        assert(!githubIcon, "live 链接不应保留 github 图标");
      }
    });
  });
});

describe("renderProjectCard · 边界场景", () => {
  it("github.magnetic === false 时移除 data-magnetic 属性", () => {
    const fake = JSON.parse(JSON.stringify(PROJECTS[0]));
    fake.github.magnetic = false;
    const node = renderProjectCard(fake);
    const cta = node.querySelector('[data-slot="github-cta"]');
    assert(!cta.hasAttribute("data-magnetic"));
  });

  it("detail.prompt 缺失时不写文本（保留空 slot）", () => {
    const fake = JSON.parse(JSON.stringify(PROJECTS[0]));
    delete fake.detail.prompt;
    const node = renderProjectCard(fake);
    const prompt = node.querySelector('[data-slot="prompt"]');
    assertEqual(prompt.textContent, "", "prompt 应为空");
  });
});

describe("renderAllProjects", () => {
  it("挂点为空时抛错", () => {
    let threw = false;
    try {
      renderAllProjects(PROJECTS, null);
    } catch (_) {
      threw = true;
    }
    assert(threw, "renderAllProjects(null) 应抛错");
  });

  it("正常挂载后，子节点数 = 项目数", () => {
    const mount = document.createElement("div");
    renderAllProjects(PROJECTS, mount);
    assertEqual(mount.children.length, PROJECTS.length);
  });

  it("挂载顺序 = 数据数组顺序", () => {
    const mount = document.createElement("div");
    renderAllProjects(PROJECTS, mount);
    Array.from(mount.children).forEach((card, i) => {
      assertEqual(
        card.querySelector('[data-slot="index"]').textContent,
        PROJECTS[i].index
      );
    });
  });
});
