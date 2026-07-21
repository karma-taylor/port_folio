/**
 * DOM 辅助函数：克隆 <template>、按 data-slot 填充内容。
 *
 * 所有渲染函数都基于这层薄封装，避免业务代码里散落 querySelector('[data-slot="x"]')。
 */

/**
 * 从 <template id> 克隆首个子元素，深拷贝。
 * @param {string} templateId
 * @returns {HTMLElement}
 * @throws 模板不存在或为空时抛错（开发期早暴露）
 */
export function cloneTemplate(templateId) {
  const tpl = document.getElementById(templateId);
  if (!tpl || tpl.tagName !== "TEMPLATE") {
    throw new Error(`[dom-helpers] 找不到 <template id="${templateId}">`);
  }
  const first = tpl.content.firstElementChild;
  if (!first) {
    throw new Error(`[dom-helpers] <template id="${templateId}"> 内容为空`);
  }
  return first.cloneNode(true);
}

/**
 * 拿到节点内 [data-slot="name"] 元素。
 * 找不到时返回 null（调用方决定是否容错）。
 * @param {Element} root
 * @param {string} slotName
 * @returns {Element | null}
 */
export function getSlot(root, slotName) {
  return root.querySelector(`[data-slot="${slotName}"]`);
}

/**
 * 给指定 slot 写文本。slot 不存在时静默忽略（视图层可选）。
 * @param {Element} root
 * @param {string} slotName
 * @param {string} text
 */
export function setSlotText(root, slotName, text) {
  const el = getSlot(root, slotName);
  if (el) el.textContent = text;
}

/**
 * 给指定 slot 写属性。
 * @param {Element} root
 * @param {string} slotName
 * @param {string} attr
 * @param {string} value
 */
export function setSlotAttr(root, slotName, attr, value) {
  const el = getSlot(root, slotName);
  if (el) el.setAttribute(attr, value);
}

/**
 * 给指定 slot 写多个属性。
 * @param {Element} root
 * @param {string} slotName
 * @param {Record<string, string>} attrs
 */
export function setSlotAttrs(root, slotName, attrs) {
  const el = getSlot(root, slotName);
  if (!el) return;
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
}
