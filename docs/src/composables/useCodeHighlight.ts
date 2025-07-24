import hljs from "highlight.js";

// 导入常用语言支持
import "highlight.js/lib/languages/javascript";
import "highlight.js/lib/languages/typescript";
import "highlight.js/lib/languages/bash";
import "highlight.js/lib/languages/css";
import "highlight.js/lib/languages/json";
import "highlight.js/lib/languages/xml"; // 用于 HTML 和 Vue 模板

// 支持的语言映射
const languageMap: Record<string, string> = {
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  tsx: "typescript",
  vue: "xml",
  html: "xml",
  css: "css",
  scss: "css",
  json: "json",
  bash: "bash",
  shell: "bash",
  sh: "bash"
};

export function useCodeHighlight() {
  /**
   * 高亮代码块
   * @param code 要高亮的代码
   * @param language 语言标识
   * @returns 高亮后的HTML
   */
  const highlightCode = (code: string, language: string): string => {
    try {
      const lang = getLanguageForHighlight(language);
      if (hljs.getLanguage(lang)) {
        const result = hljs.highlight(code, { language: lang });
        return result.value;
      }
    } catch (err) {
      console.warn("代码高亮失败:", err);
    }

    // 回退方案：返回原始代码，但进行HTML转义
    return escapeHtml(code);
  };

  /**
   * 获取highlight.js支持的语言标识
   * @param language 输入的语言标识
   * @returns highlight.js支持的语言标识
   */
  const getLanguageForHighlight = (language: string): string => {
    const normalizedLang = language.toLowerCase();
    return languageMap[normalizedLang] || "javascript";
  };

  /**
   * HTML转义
   * @param text 要转义的文本
   * @returns 转义后的文本
   */
  const escapeHtml = (text: string): string => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  /**
   * 高亮代码块并添加class
   * @param code 要高亮的代码
   * @param language 语言标识
   * @returns 包含class的高亮HTML
   */
  const highlightCodeBlock = (code: string, language: string): string => {
    const highlightedCode = highlightCode(code, language);
    const lang = getLanguageForHighlight(language);
    return `<code class="hljs language-${lang}">${highlightedCode}</code>`;
  };

  return {
    highlightCode,
    highlightCodeBlock,
    getLanguageForHighlight,
    escapeHtml
  };
}
