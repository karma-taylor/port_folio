import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const portfolioDir = path.join(rootDir, "zuopinji");
const dataUrl = pathToFileURL(path.join(portfolioDir, "data", "projects.js")).href;

const { PROJECTS } = await import(dataUrl);

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);

async function findChrome() {
  for (const candidate of chromeCandidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Keep looking.
    }
  }
  return undefined;
}

function runChromeScreenshot(chromePath, url, screenshotPath) {
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-dev-shm-usage",
    "--window-size=1440,900",
    "--force-device-scale-factor=1",
    "--virtual-time-budget=3500",
    `--screenshot=${screenshotPath}`,
    url,
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(chromePath, args, {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("Chrome screenshot timed out after 35s"));
    }, 35000);

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr.trim() || `Chrome exited with ${code}`));
      }
    });
  });
}

function pickSource(project) {
  const links = project.detail?.links || [];
  const live = links.find((link) => link.type === "live" && /^https?:\/\//.test(link.href));
  if (live) return { url: live.href, kind: "live" };

  const github = links.find((link) => link.type === "github" && /^https?:\/\//.test(link.href));
  if (github) return { url: github.href, kind: "github" };

  if (/^https?:\/\//.test(project.hoverCta?.href || "")) {
    return { url: project.hoverCta.href, kind: "live" };
  }

  return null;
}

function outputName(project) {
  return `${project.id}-cover-auto.png`;
}

async function captureProject(chromePath, project) {
  const source = pickSource(project);
  const outPath = path.join(portfolioDir, outputName(project));

  if (!source) {
    console.warn(`skip ${project.id}: no public URL`);
    return null;
  }

  console.log(`capture ${project.id}: ${source.url}`);
  await runChromeScreenshot(chromePath, source.url, outPath);
  return outPath;
}

const executablePath = await findChrome();
if (!executablePath) {
  throw new Error("Chrome executable was not found. Set CHROME_PATH to run cover capture.");
}

try {
  const captured = [];
  for (const project of PROJECTS) {
    try {
      const outPath = await captureProject(executablePath, project);
      if (outPath) captured.push(path.relative(rootDir, outPath));
    } catch (error) {
      console.warn(`failed ${project.id}: ${error.message}`);
    }
  }

  console.log(`done: ${captured.length} cover(s)`);
  captured.forEach((file) => console.log(` - ${file}`));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
