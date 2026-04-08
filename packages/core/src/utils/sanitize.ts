/*
 * @Author: JeremyJone
 * @Date: 2026-04-07 22:00:00
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-04-07 22:00:00
 * @Description: HTML 消毒工具，防止 XSS 攻击
 */

/** 危险的 HTML 标签 */
const DANGEROUS_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "form",
  "base",
  "meta",
  "link",
  "style",
  "template"
];

/**
 * 清理 HTML 字符串，移除潜在的 XSS 攻击载荷。
 *
 * 清理规则：
 * - 移除危险标签（script, iframe, object 等）
 * - 移除所有 on* 事件处理器属性
 * - 移除 javascript: 协议的 URL
 *
 * @param html 待清理的 HTML 字符串
 * @returns 清理后的安全 HTML 字符串
 */
export function sanitizeHtml(html: string): string {
  // 快速路径：纯文本无需解析
  if (!html || !html.includes("<")) {
    return html;
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  // 移除危险标签
  DANGEROUS_TAGS.forEach(tag => {
    const elements = doc.body.querySelectorAll(tag);
    elements.forEach(el => el.remove());
  });

  // 清理所有元素的属性
  const allElements = doc.body.querySelectorAll("*");
  allElements.forEach(el => {
    const attrs = Array.from(el.attributes);
    attrs.forEach(attr => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();

      // 移除事件处理器属性 (onclick, onerror, onload 等)
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
        return;
      }

      // 移除 javascript: 协议
      if (
        (name === "href" || name === "src" || name === "action" || name === "xlink:href") &&
        value.startsWith("javascript:")
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}
