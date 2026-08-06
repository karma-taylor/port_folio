import { chromium } from "playwright";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.resolve(ROOT_DIR, "tmp-playwright-audit");
const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 4174;
const HOST = "127.0.0.1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

async function capture(page, name, locator = null) {
  const target = locator ? page.locator(locator) : page;
  await target.screenshot({
    path: path.join(OUTPUT_DIR, `${name}.png`),
  });
}

function resolveFilePath(requestUrl) {
  const pathname = new URL(requestUrl, `http://${HOST}:${PORT}`).pathname;
  const normalized = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
  const resolved = path.resolve(ROOT_DIR, `.${normalized}`);
  if (!resolved.startsWith(ROOT_DIR)) {
    return null;
  }
  return resolved;
}

function createStaticServer() {
  return http.createServer(async (req, res) => {
    const filePath = resolveFilePath(req.url || "/");
    if (!filePath) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("forbidden");
      return;
    }

    try {
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("not found");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("not found");
    }
  });
}

async function startServer() {
  const server = createStaticServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, HOST, () => resolve());
  });
  return server;
}

async function main() {
  await ensureOutputDir();
  const server = await startServer();

  try {
    const browser = await chromium.launch({
      headless: true,
      executablePath: CHROME_PATH,
      args: ["--no-proxy-server"],
    });

    const page = await browser.newPage({
      viewport: { width: 1512, height: 1400 },
      deviceScaleFactor: 1,
    });

    const consoleMessages = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleMessages.push(`${message.type()}: ${message.text()}`);
      }
    });

    await page.goto(`http://${HOST}:${PORT}/`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2200);

    const heroStage = await page.locator(".projects-masthead").getAttribute("data-hero-stage");
    const projectCount = await page.locator(".project-card").count();

    await capture(page, "01-home-initial");

    const wechatTrigger = page.locator(".about-contact__item--wechat");
    await wechatTrigger.scrollIntoViewIfNeeded();
    await wechatTrigger.hover();
    const qrLayer = page.locator("#wechatQrFloating");
    if (!await qrLayer.evaluate((node) => node.classList.contains("is-visible") && Number(getComputedStyle(node).zIndex) > 1000000)) {
      throw new Error("wechat QR top-layer regression");
    }
    await page.mouse.move(8, 8);
    await page.evaluate(() => window.scrollTo(0, 0));

    await page.mouse.move(760, 30);
    await page.waitForTimeout(450);
    await capture(page, "02-nav-expanded", ".os-topbar");

    await page.mouse.move(760, 360);
    await page.waitForTimeout(380);
    await capture(page, "03-hero-settled", ".projects-masthead");

    await page.locator("#coreProjectsGrid .project-card").nth(1).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await capture(page, "04-core-scroll");

    await page.mouse.move(780, 870);
    await page.waitForTimeout(350);
    await capture(page, "05-core-focus");

    await page.locator(".featured-hero .project-trigger").click();
    await page.waitForTimeout(950);
    await capture(page, "06-overlay-open", ".focus-overlay");

    const caseHeadings = await page.locator("#focusBodyScroll .focus-export-h").allTextContents();
    const expectedHeadings = [
      "01 / 业务痛点",
      "02 / 调研与范围定义",
      "03 / 方案、规则与风险处理",
      "04 / 交付、上线与验收",
      "05 / 边界与下一步",
    ];
    if (caseHeadings.length !== expectedHeadings.length || caseHeadings.some((item, index) => item !== expectedHeadings[index])) {
      throw new Error(`case-study section regression: ${JSON.stringify(caseHeadings)}`);
    }
    if (await page.locator("#experienceTimeline .experience-entry").count() !== 2) {
      throw new Error("experience timeline regression");
    }
    if (await page.locator(".projects-masthead .hero-case").count() !== 1) {
      throw new Error("flagship hero case regression");
    }
    if (await page.locator(".projects-masthead .hero-proof > div").count() !== 3) {
      throw new Error("delivery method proof regression");
    }
    if (await page.locator("#focusBodyScroll .focus-management-meta").count() !== 1) {
      throw new Error("project management metadata regression");
    }
    if (await page.locator("#focusBodyScroll .focus-evidence li").count() !== 4) {
      throw new Error("flagship evidence flow regression");
    }
    const chapterNav = page.locator("#focusBodyScroll .focus-export-nav");
    if (await chapterNav.locator("button").count() !== 5) {
      throw new Error("case chapter navigation regression");
    }
    await chapterNav.locator("button").nth(3).press("Enter");
    if (await page.locator("#focusBodyScroll .focus-case-hero, #focusBodyScroll .focus-result-grid, #focusBodyScroll .focus-pd-dl").count()) {
      throw new Error("retired case-study module rendered");
    }

    const detailMetrics = await page.locator("#focusImage").evaluate((image) => {
      const rect = image.getBoundingClientRect();
      const titleRect = document.getElementById("focusTitle")?.getBoundingClientRect();
      return {
        naturalRatio: image.naturalWidth / image.naturalHeight,
        renderedRatio: rect.width / rect.height,
        width: Math.round(rect.width),
        imageBottom: Math.round(rect.bottom),
        titleTop: Math.round(titleRect?.top || 0),
      };
    });

    const ratioDelta = Math.abs(detailMetrics.naturalRatio - detailMetrics.renderedRatio);
    if (detailMetrics.width < 900 || ratioDelta > 0.02) {
      throw new Error(`detail hero image regression: ${JSON.stringify(detailMetrics)}`);
    }
    if (detailMetrics.titleTop <= detailMetrics.imageBottom) {
      throw new Error(`detail content does not follow hero image: ${JSON.stringify(detailMetrics)}`);
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    await capture(page, "07-overlay-closed");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".featured-hero .project-trigger").scrollIntoViewIfNeeded();
    await page.locator(".featured-hero .project-trigger").click();
    await page.waitForTimeout(650);
    await capture(page, "08-overlay-mobile");
    await page.keyboard.press("Escape");

    console.log(`hero_stage=${heroStage}`);
    console.log(`project_count=${projectCount}`);
    console.log(`detail_image_width=${detailMetrics.width}`);
    console.log(`detail_ratio_delta=${ratioDelta.toFixed(4)}`);
    console.log(
      `console_messages=${consoleMessages.length ? consoleMessages.join(" || ") : "none"}`
    );

    await browser.close();
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
