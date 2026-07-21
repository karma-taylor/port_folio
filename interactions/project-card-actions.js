/**
 * 首页项目卡底部「查看详情」→ 触发同卡 .project-trigger 打开弹层。
 */
export function bindProjectCardDetailButtons(root = document) {
  root.addEventListener("click", (event) => {
    const btn = event.target.closest(".project-action--detail");
    if (!btn) return;
    const card = btn.closest(".project-card");
    const trigger = card?.querySelector(".project-trigger");
    if (trigger instanceof HTMLElement) {
      trigger.click();
    }
  });
}
