/**
 * 极简单元测试运行器
 *
 * 设计目标：
 *   - 零依赖，原生 ES Module，浏览器直接打开 tests/index.html 即可跑
 *   - 支持 describe / it 嵌套（一层即可），支持 async 测试
 *   - 输出到 DOM 容器 + console，pass/fail/total 统计
 */

const state = {
  groups: [],
  current: null,
};

/**
 * 定义一组测试。
 * @param {string} name
 * @param {() => void} fn 内部注册若干 it()
 */
export function describe(name, fn) {
  const group = { name, tests: [] };
  state.groups.push(group);
  state.current = group;
  try {
    fn();
  } finally {
    state.current = null;
  }
}

/**
 * 注册一个测试用例。
 * @param {string} name
 * @param {() => void | Promise<void>} fn
 */
export function it(name, fn) {
  if (!state.current) {
    throw new Error(`it("${name}") 必须在 describe() 内部调用`);
  }
  state.current.tests.push({ name, fn });
}

/* -------------------- assertions -------------------- */

export function assert(cond, msg = "断言失败") {
  if (!cond) throw new Error(msg);
}

export function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(
      msg || `期望 ${JSON.stringify(expected)} 但得到 ${JSON.stringify(actual)}`
    );
  }
}

export function assertDeepEqual(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a !== b) {
    throw new Error(msg || `深比较不等：\n  实际: ${a}\n  预期: ${b}`);
  }
}

export function assertThrows(fn, msg = "期望抛错但没有") {
  try {
    fn();
  } catch (_e) {
    return;
  }
  throw new Error(msg);
}

export async function assertRejects(promiseOrFn, msg = "期望 reject 但没有") {
  try {
    if (typeof promiseOrFn === "function") {
      await promiseOrFn();
    } else {
      await promiseOrFn;
    }
  } catch (_e) {
    return;
  }
  throw new Error(msg);
}

export function assertMatch(value, regex, msg) {
  if (!regex.test(String(value))) {
    throw new Error(msg || `"${value}" 不匹配 ${regex}`);
  }
}

export function assertIncludes(haystack, needle, msg) {
  if (!String(haystack).includes(needle)) {
    throw new Error(msg || `"${haystack}" 不包含 "${needle}"`);
  }
}

/* -------------------- runner -------------------- */

function createRow(label, status, detail = "") {
  const row = document.createElement("div");
  row.className = `test-row test-row--${status}`;
  row.innerHTML = `
    <span class="test-status">${status === "pass" ? "✓" : status === "fail" ? "✗" : "—"}</span>
    <span class="test-name">${label}</span>
    ${detail ? `<pre class="test-detail">${detail.replace(/</g, "&lt;")}</pre>` : ""}
  `;
  return row;
}

/**
 * 执行所有注册的测试。
 * @param {HTMLElement} container 输出 DOM 节点
 */
export async function run(container) {
  container.innerHTML = "";
  let pass = 0;
  let fail = 0;
  let total = 0;

  for (const group of state.groups) {
    const groupNode = document.createElement("section");
    groupNode.className = "test-group";
    groupNode.innerHTML = `<h2>${group.name}</h2>`;
    container.appendChild(groupNode);

    for (const test of group.tests) {
      total++;
      try {
        await test.fn();
        pass++;
        groupNode.appendChild(createRow(test.name, "pass"));
      } catch (err) {
        fail++;
        const stack = err && err.stack ? err.stack : String(err);
        groupNode.appendChild(createRow(test.name, "fail", stack));
        console.error(`[FAIL] ${group.name} > ${test.name}`, err);
      }
    }
  }

  const summary = document.createElement("div");
  summary.className = `test-summary ${fail === 0 ? "test-summary--ok" : "test-summary--bad"}`;
  summary.textContent = `共 ${total} 项 · 通过 ${pass} · 失败 ${fail}`;
  container.prepend(summary);

  return { total, pass, fail };
}
