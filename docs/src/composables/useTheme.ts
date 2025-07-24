import { ref, watch, readonly } from "vue";

export type Theme = "light" | "dark";

// 全局主题状态
const isDark = ref<boolean>(false);
const currentTheme = ref<Theme>("light");

// 从本地存储获取主题设置
const savedTheme = localStorage.getItem("xgantt-theme") as Theme;
if (savedTheme && ["light", "dark"].includes(savedTheme)) {
  currentTheme.value = savedTheme;
  isDark.value = savedTheme === "dark";
} else {
  // 检测系统主题偏好
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  isDark.value = prefersDark;
  currentTheme.value = prefersDark ? "dark" : "light";
}

// 应用主题到DOM
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

// 初始化主题
applyTheme(currentTheme.value);

// 监听主题变化
watch(currentTheme, newTheme => {
  applyTheme(newTheme);
  localStorage.setItem("xgantt-theme", newTheme);
  isDark.value = newTheme === "dark";
});

// 切换主题
export const toggleTheme = () => {
  currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
};

// 设置主题
export const setTheme = (theme: Theme) => {
  currentTheme.value = theme;
};

// 组合式函数
export const useTheme = () => {
  return {
    isDark: readonly(isDark),
    currentTheme: readonly(currentTheme),
    toggleTheme,
    setTheme
  };
};

// 监听系统主题变化
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", e => {
    if (!localStorage.getItem("xgantt-theme")) {
      currentTheme.value = e.matches ? "dark" : "light";
    }
  });
