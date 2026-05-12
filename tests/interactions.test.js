/**
 * 交互模块的纯逻辑单元测试
 *
 * 不依赖完整 DOM 的部分（纯计算函数）单独抽测；DOM/事件部分仅做最小 setup smoke。
 */

import {
  describe,
  it,
  assert,
  assertEqual,
} from "./runner.js";
import { computeScrollProgress } from "../zuopinji/interactions/scroll-progress.js";
import { computeMagneticOffset } from "../zuopinji/interactions/magnetic.js";

describe("scroll-progress · computeScrollProgress", () => {
  it("scrollHeight === clientHeight 时返回 0（无可滚动空间）", () => {
    assertEqual(
      computeScrollProgress({ scrollTop: 0, scrollHeight: 800, clientHeight: 800 }),
      0
    );
  });

  it("scrollTop = 0 → 0", () => {
    assertEqual(
      computeScrollProgress({ scrollTop: 0, scrollHeight: 2000, clientHeight: 800 }),
      0
    );
  });

  it("scrollTop = max → 1", () => {
    assertEqual(
      computeScrollProgress({ scrollTop: 1200, scrollHeight: 2000, clientHeight: 800 }),
      1
    );
  });

  it("中段 = 0.5", () => {
    assertEqual(
      computeScrollProgress({ scrollTop: 600, scrollHeight: 2000, clientHeight: 800 }),
      0.5
    );
  });

  it("scrollTop > max 被钳制到 1", () => {
    assertEqual(
      computeScrollProgress({ scrollTop: 9999, scrollHeight: 2000, clientHeight: 800 }),
      1
    );
  });

  it("scrollTop 负值被钳制到 0", () => {
    assertEqual(
      computeScrollProgress({ scrollTop: -100, scrollHeight: 2000, clientHeight: 800 }),
      0
    );
  });
});

describe("magnetic · computeMagneticOffset", () => {
  const target = { cx: 100, cy: 100, strength: 0.5 };

  it("pointer.active === false 时偏移为 0", () => {
    const { tx, ty } = computeMagneticOffset(target, {
      x: 90,
      y: 90,
      active: false,
    });
    assertEqual(tx, 0);
    assertEqual(ty, 0);
  });

  it("距离 > 激活半径(110) 时偏移为 0", () => {
    const { tx, ty } = computeMagneticOffset(target, {
      x: 300,
      y: 300,
      active: true,
    });
    assertEqual(tx, 0);
    assertEqual(ty, 0);
  });

  it("指针正在元素中心时偏移为 0（dx/dy 为 0）", () => {
    const { tx, ty } = computeMagneticOffset(target, {
      x: 100,
      y: 100,
      active: true,
    });
    assertEqual(tx, 0);
    assertEqual(ty, 0);
  });

  it("指针靠近时偏移方向正确（指向鼠标）", () => {
    const { tx, ty } = computeMagneticOffset(target, {
      x: 150,
      y: 100,
      active: true,
    });
    assert(tx > 0, `tx 应 > 0, 实际 ${tx}`);
    assertEqual(ty, 0, "ty 应为 0（y 没偏移）");
  });

  it("中段（约半径 R/2 处）偏移最大、向两端衰减回 0", () => {
    // f(x) = x * strength * (1 - x/R) 的峰值在 x = R/2 (=55)
    const atPeak = computeMagneticOffset(target, { x: 155, y: 100, active: true });
    const nearCenter = computeMagneticOffset(target, { x: 105, y: 100, active: true });
    const nearEdge = computeMagneticOffset(target, { x: 205, y: 100, active: true });
    assert(atPeak.tx > nearCenter.tx, `峰值应大于近中心：peak=${atPeak.tx} near=${nearCenter.tx}`);
    assert(atPeak.tx > nearEdge.tx, `峰值应大于近边缘：peak=${atPeak.tx} edge=${nearEdge.tx}`);
  });

  it("强度更大 → 偏移更大", () => {
    const weak = computeMagneticOffset({ ...target, strength: 0.1 }, { x: 130, y: 100, active: true });
    const strong = computeMagneticOffset({ ...target, strength: 0.9 }, { x: 130, y: 100, active: true });
    assert(strong.tx > weak.tx, "强度大时偏移应更大");
  });
});

describe("interactions · 模块导入 smoke", () => {
  it("scroll-progress 默认导出形态", async () => {
    const mod = await import("../zuopinji/interactions/scroll-progress.js");
    assertEqual(typeof mod.setupScrollProgress, "function");
    assertEqual(typeof mod.computeScrollProgress, "function");
  });

  it("magnetic 默认导出形态", async () => {
    const mod = await import("../zuopinji/interactions/magnetic.js");
    assertEqual(typeof mod.setupMagneticTargets, "function");
    assertEqual(typeof mod.shouldSkipMagnetic, "function");
    assertEqual(typeof mod.computeMagneticOffset, "function");
  });

  it("boot-loader 默认导出形态", async () => {
    const mod = await import("../zuopinji/interactions/boot-loader.js");
    assertEqual(typeof mod.runBootLoader, "function");
  });

  it("reveal 默认导出形态", async () => {
    const mod = await import("../zuopinji/interactions/reveal.js");
    assertEqual(typeof mod.revealCards, "function");
  });

  it("focus-overlay 默认导出形态", async () => {
    const mod = await import("../zuopinji/interactions/focus-overlay.js");
    assertEqual(typeof mod.setupProjectFocusOverlay, "function");
  });
});
