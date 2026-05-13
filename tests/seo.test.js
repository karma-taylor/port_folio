/**
 * SEO 生成器测试
 * 验证 structured-data.js / noscript.js 两个生成器在样本输入下的行为。
 */

import {
  describe,
  it,
  assert,
  assertEqual,
  assertIncludes,
} from "./runner.js";
import { PROJECTS, PROFILE } from "../zuopinji/data/projects.js";
import {
  buildPersonJsonLd,
  projectToCreativeWork,
  injectJsonLd,
} from "../zuopinji/seo/structured-data.js";
import {
  escapeHtml,
  projectToNoscriptItem,
  buildNoscriptList,
} from "../zuopinji/seo/noscript.js";

describe("structured-data · projectToCreativeWork", () => {
  it("有 live 链接时优先用 live", () => {
    const money = PROJECTS.find((p) => p.id === "money");
    const work = projectToCreativeWork(money);
    assertEqual(work["@type"], "CreativeWork");
    assertEqual(work.name, money.titleLong);
    assertEqual(work.url, "https://karma-taylor.github.io/money_classify/");
  });

  it("live 是 example.com 占位时退回 github", () => {
    const report = PROJECTS.find((p) => p.id === "report");
    const work = projectToCreativeWork(report);
    assert(
      !work.url.includes("example.com"),
      `report 的 url 不该回退到 example.com 占位，实际 ${work.url}`
    );
    assertEqual(work.url, "https://github.com/karma-taylor/Daily_report");
  });

  it("没有 detail.links 时回退 hoverCta", () => {
    const fake = {
      title: "X",
      hoverValue: "h",
      hoverCta: { href: "https://example-fallback.com" },
      detail: { links: [] },
    };
    const work = projectToCreativeWork(fake);
    assertEqual(work.url, "https://example-fallback.com");
  });
});

describe("structured-data · buildPersonJsonLd", () => {
  const ld = buildPersonJsonLd(PROFILE, PROJECTS);

  it("根字段是 Person + 包含 hasPart", () => {
    assertEqual(ld["@context"], "https://schema.org");
    assertEqual(ld["@type"], "Person");
    assertEqual(ld.name, PROFILE.name);
    assert(Array.isArray(ld.hasPart));
  });

  it("hasPart 数量与 PROJECTS 一致", () => {
    assertEqual(ld.hasPart.length, PROJECTS.length);
  });

  it("hasPart 顺序与 PROJECTS 顺序一致", () => {
    PROJECTS.forEach((p, i) => {
      assertEqual(ld.hasPart[i].name, p.titleLong || p.title);
    });
  });
});

describe("structured-data · injectJsonLd", () => {
  it("没有节点时新建 #structuredData", () => {
    const doc = document.implementation.createHTMLDocument("test");
    const data = { hello: "world" };
    injectJsonLd(data, doc);
    const node = doc.getElementById("structuredData");
    assert(node, "应创建 script 节点");
    assertEqual(node.type, "application/ld+json");
    assertIncludes(node.textContent, "hello");
  });

  it("已存在节点时复用，更新内容", () => {
    const doc = document.implementation.createHTMLDocument("test");
    const script = doc.createElement("script");
    script.id = "structuredData";
    script.type = "application/ld+json";
    script.textContent = "{}";
    doc.head.appendChild(script);

    injectJsonLd({ refreshed: true }, doc);
    const nodes = doc.querySelectorAll("#structuredData");
    assertEqual(nodes.length, 1, "不应创建重复节点");
    assertIncludes(nodes[0].textContent, "refreshed");
  });
});

describe("noscript · escapeHtml", () => {
  it("转义 < > & \" '", () => {
    assertEqual(escapeHtml("<a href=\"x\">'&'</a>"), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });

  it("纯文本不变", () => {
    assertEqual(escapeHtml("hello 你好"), "hello 你好");
  });
});

describe("noscript · projectToNoscriptItem", () => {
  it("正常项目含 strong + 演示链接 + GitHub 链接", () => {
    const money = PROJECTS.find((p) => p.id === "money");
    const html = projectToNoscriptItem(money);
    assertIncludes(html, "<strong>");
    assertIncludes(html, "演示");
    assertIncludes(html, "GitHub");
    assertIncludes(html, money.title.split("（")[0]);
  });

  it("example.com 占位不输出演示链接", () => {
    const report = PROJECTS.find((p) => p.id === "report");
    const html = projectToNoscriptItem(report);
    assert(!html.includes("example.com"), `不应包含 example.com，实际 ${html}`);
    assertIncludes(html, "GitHub");
  });
});

describe("noscript · buildNoscriptList", () => {
  it("包裹 section + h2 + ol，含全部项目", () => {
    const html = buildNoscriptList(PROJECTS);
    assertIncludes(html, '<section class="noscript-fallback">');
    assertIncludes(html, "<ol>");
    PROJECTS.forEach((p) => {
      assertIncludes(html, p.title);
    });
  });
});
