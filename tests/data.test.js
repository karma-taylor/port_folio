/**
 * 数据 schema 测试
 * 验证 zuopinji/data/projects.js 中 PROJECTS / PROFILE 的形状、唯一性与枚举值。
 */

import {
  describe,
  it,
  assert,
  assertEqual,
  assertMatch,
} from "./runner.js";
import { PROJECTS, PROFILE } from "../zuopinji/data/projects.js";

const VALID_SIZES = new Set(["featured", "tall", "wide", "small"]);
const VALID_STATUSES = new Set(["live", "wip"]);
const VALID_TECH_TYPES = new Set([
  "lang",
  "framework",
  "tool",
  "api",
  "ai",
  "deploy",
]);
const VALID_LINK_TYPES = new Set(["github", "live"]);

const URL_LIKE = /^https?:\/\//i;

describe("PROJECTS · 基础结构", () => {
  it("是非空数组", () => {
    assert(Array.isArray(PROJECTS), "PROJECTS 不是数组");
    assert(PROJECTS.length > 0, "PROJECTS 为空");
  });

  it("所有 id 唯一", () => {
    const ids = PROJECTS.map((p) => p.id);
    const unique = new Set(ids);
    assertEqual(unique.size, ids.length, `id 重复：${ids.join(", ")}`);
  });

  it("视觉编号按 01 → N 升序", () => {
    PROJECTS.forEach((p, i) => {
      const expected = String(i + 1).padStart(2, "0");
      assertEqual(p.index, expected, `第 ${i + 1} 张卡 index 应为 ${expected}，实为 ${p.index}`);
    });
  });
});

describe("PROJECTS · 字段必填与枚举", () => {
  PROJECTS.forEach((p) => {
    it(`[${p.id}] 必填字段都存在`, () => {
      assert(p.id, "id 缺失");
      assert(p.index, "index 缺失");
      assert(p.size, "size 缺失");
      assert(p.status, "status 缺失");
      assert(p.statusLabel, "statusLabel 缺失");
      assert(p.title, "title 缺失");
      assert(p.cover?.src, "cover.src 缺失");
      assert(p.cover?.alt, "cover.alt 缺失");
      assert(p.hoverValue, "hoverValue 缺失");
      assert(p.hoverCta?.href, "hoverCta.href 缺失");
      assert(p.hoverCta?.label, "hoverCta.label 缺失");
      assert(p.hoverCta?.aria, "hoverCta.aria 缺失");
      assert(Array.isArray(p.tech) && p.tech.length, "tech 为空");
      assert(p.flow?.ariaLabel, "flow.ariaLabel 缺失");
      assert(Array.isArray(p.flow?.steps), "flow.steps 不是数组");
      assert(p.github?.href, "github.href 缺失");
      assert(p.detail?.summary, "detail.summary 缺失");
      assert(Array.isArray(p.detail?.links) && p.detail.links.length, "detail.links 为空");
      assert(p.titleLong, "titleLong 缺失");
      assert(Array.isArray(p.outcomes), "outcomes 须为数组");
      assert(
        p.outcomes.length >= 1 && p.outcomes.length <= 2,
        `outcomes 应为 1–2 条，实为 ${p.outcomes.length}`
      );
      p.outcomes.forEach((line, j) => {
        assert(typeof line === "string" && line.trim(), `outcomes[${j}] 须为非空字符串`);
      });
    });

    it(`[${p.id}] size 在枚举内`, () => {
      assert(VALID_SIZES.has(p.size), `size="${p.size}" 不合法`);
    });

    it(`[${p.id}] status 在枚举内`, () => {
      assert(VALID_STATUSES.has(p.status), `status="${p.status}" 不合法`);
    });

    it(`[${p.id}] tech.type 都合法`, () => {
      p.tech.forEach((t) => {
        assert(VALID_TECH_TYPES.has(t.type), `tech.type="${t.type}" 不合法`);
        assert(t.label, `tech 缺 label`);
      });
    });

    it(`[${p.id}] flow.steps 恰好 4 步`, () => {
      assertEqual(p.flow.steps.length, 4, "flow.steps 必须是 4 步");
    });

    it(`[${p.id}] flow.steps 编号 01-04`, () => {
      p.flow.steps.forEach((s, i) => {
        const expected = String(i + 1).padStart(2, "0");
        assertEqual(s.idx, expected, `第 ${i + 1} 步 idx 应为 ${expected}`);
        assert(s.label, `第 ${i + 1} 步 label 缺失`);
      });
    });

    it(`[${p.id}] detail.links.type 都合法`, () => {
      p.detail.links.forEach((l) => {
        assert(VALID_LINK_TYPES.has(l.type), `link.type="${l.type}" 不合法`);
        assertMatch(l.href, URL_LIKE, `link.href 不是 URL：${l.href}`);
        assert(l.label, "link.label 缺失");
      });
    });
  });
});

describe("PROJECTS · 状态一致性", () => {
  PROJECTS.forEach((p) => {
    it(`[${p.id}] status=live 时 statusLabel="已上线"`, () => {
      if (p.status === "live") {
        assertEqual(p.statusLabel, "已上线");
      }
    });
  });
});

describe("PROFILE", () => {
  it("基础字段齐全", () => {
    assert(PROFILE.name, "name 缺失");
    assert(PROFILE.jobTitle, "jobTitle 缺失");
    assert(PROFILE.siteUrl, "siteUrl 缺失");
    assert(Array.isArray(PROFILE.sameAs), "sameAs 不是数组");
  });

  it("siteUrl 是合法 URL", () => {
    assertMatch(PROFILE.siteUrl, URL_LIKE);
  });
});
