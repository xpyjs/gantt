import { ref } from "vue";
import {
  FRAMEWORK_CONFIGS,
  getDefaultFramework,
  getFrameworkConfig,
  type FrameworkKey,
  type FrameworkConfig
} from "@/config/frameworks";

// 导出类型以保持向后兼容
export type { FrameworkKey, FrameworkConfig as Framework };

// 全局状态 - 默认选中默认框架
const activeFramework = ref<FrameworkKey>(getDefaultFramework().key);

export function useFramework() {
  const setActiveFramework = (framework: FrameworkKey) => {
    activeFramework.value = framework;
  };

  const getFrameworkByKey = (key: FrameworkKey) => {
    return getFrameworkConfig(key);
  };

  return {
    activeFramework,
    setActiveFramework,
    frameworks: FRAMEWORK_CONFIGS,
    getFrameworkByKey
  };
}
