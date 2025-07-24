import { ref } from "vue";
import type { ToastProps } from "@/components/Toast.vue";

export interface ToastOptions extends Omit<ToastProps, "message"> {
  id?: string;
}

export interface ToastInstance extends ToastProps {
  id: string;
}

// 全局 Toast 状态
const toasts = ref<ToastInstance[]>([]);
let toastId = 0;

/**
 * 生成唯一的 Toast ID
 */
const generateToastId = (): string => {
  return `toast-${++toastId}-${Date.now()}`;
};

/**
 * useToast composable
 * 提供 Toast 管理功能
 */
export function useToast() {
  /**
   * 显示 Toast
   * @param message - 消息内容
   * @param options - Toast 选项
   */
  const showToast = (message: string, options: ToastOptions = {}): string => {
    const id = options.id || generateToastId();

    const toast: ToastInstance = {
      id,
      message,
      type: options.type || "success",
      duration: options.duration !== undefined ? options.duration : 3000,
      position: options.position || "top-right",
      closable: options.closable || false
    };

    // 如果已存在相同 ID 的 toast，先移除
    const existingIndex = toasts.value.findIndex(t => t.id === id);
    if (existingIndex > -1) {
      toasts.value.splice(existingIndex, 1);
    }

    toasts.value.push(toast);

    return id;
  };

  /**
   * 显示成功消息
   * @param message - 消息内容
   * @param options - Toast 选项
   */
  const success = (
    message: string,
    options: Omit<ToastOptions, "type"> = {}
  ): string => {
    return showToast(message, { ...options, type: "success" });
  };

  /**
   * 显示错误消息
   * @param message - 消息内容
   * @param options - Toast 选项
   */
  const error = (
    message: string,
    options: Omit<ToastOptions, "type"> = {}
  ): string => {
    return showToast(message, { ...options, type: "error" });
  };

  /**
   * 显示警告消息
   * @param message - 消息内容
   * @param options - Toast 选项
   */
  const warning = (
    message: string,
    options: Omit<ToastOptions, "type"> = {}
  ): string => {
    return showToast(message, { ...options, type: "warning" });
  };

  /**
   * 显示信息消息
   * @param message - 消息内容
   * @param options - Toast 选项
   */
  const info = (
    message: string,
    options: Omit<ToastOptions, "type"> = {}
  ): string => {
    return showToast(message, { ...options, type: "info" });
  };

  /**
   * 移除指定 Toast
   * @param id - Toast ID
   */
  const removeToast = (id: string): void => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  /**
   * 清空所有 Toast
   */
  const clearAll = (): void => {
    toasts.value = [];
  };

  /**
   * 检查是否存在指定类型的 Toast
   * @param type - Toast 类型
   */
  const hasToast = (type?: ToastProps["type"]): boolean => {
    if (!type) {
      return toasts.value.length > 0;
    }
    return toasts.value.some(toast => toast.type === type);
  };

  /**
   * 获取指定类型的 Toast 数量
   * @param type - Toast 类型
   */
  const getToastCount = (type?: ToastProps["type"]): number => {
    if (!type) {
      return toasts.value.length;
    }
    return toasts.value.filter(toast => toast.type === type).length;
  };
  return {
    // 状态
    toasts,

    // 方法
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll,
    hasToast,
    getToastCount
  };
}

/**
 * 全局 Toast 实例
 * 可以在任何地方使用
 */
export const toast = {
  success: (message: string, options?: Omit<ToastOptions, "type">) => {
    const { success } = useToast();
    return success(message, options);
  },

  error: (message: string, options?: Omit<ToastOptions, "type">) => {
    const { error } = useToast();
    return error(message, options);
  },

  warning: (message: string, options?: Omit<ToastOptions, "type">) => {
    const { warning } = useToast();
    return warning(message, options);
  },

  info: (message: string, options?: Omit<ToastOptions, "type">) => {
    const { info } = useToast();
    return info(message, options);
  },

  show: (message: string, options?: ToastOptions) => {
    const { showToast } = useToast();
    return showToast(message, options);
  }
};

// 导出类型
export type { ToastProps };
