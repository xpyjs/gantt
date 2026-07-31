import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import GanttVue from "../GanttVue.vue";

// Mock @xpyjs/gantt-core
vi.mock("@xpyjs/gantt-core", () => {
  const mockResizeTimeAxis = vi.fn();
  const mockRemoveDataById = vi.fn().mockReturnValue(true);
  const mockInstance = {
    on: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    removeDataById: mockRemoveDataById,
    resizeTimeAxis: mockResizeTimeAxis
  };
  const mockXGantt = vi.fn().mockImplementation(() => mockInstance);
  return {
    XGantt: mockXGantt,
    // 暴露mock函数供测试使用
    __mockInstance: mockInstance,
    __mockXGantt: mockXGantt,
    __mockResizeTimeAxis: mockResizeTimeAxis,
    __mockRemoveDataById: mockRemoveDataById
  };
});

describe("GanttVue - resizeTimeAxis", () => {
  let mockCore: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCore = await import("@xpyjs/gantt-core");
  });

  it("should expose resizeTimeAxis method", async () => {
    const wrapper = mount(GanttVue, {
      props: { options: { data: [] } }
    });
    await flushPromises();

    expect(wrapper.vm.resizeTimeAxis).toBeDefined();
    expect(typeof wrapper.vm.resizeTimeAxis).toBe("function");

    wrapper.unmount();
  });

  it("should delegate to the underlying XGantt instance", async () => {
    const wrapper = mount(GanttVue, {
      props: { options: { data: [] } }
    });
    await flushPromises();

    // 确保实例已创建
    expect(mockCore.__mockXGantt).toHaveBeenCalledTimes(1);

    wrapper.vm.resizeTimeAxis();

    expect(mockCore.__mockResizeTimeAxis).toHaveBeenCalledTimes(1);
    expect(mockCore.__mockResizeTimeAxis).toHaveBeenCalledWith();

    wrapper.unmount();
  });

  it("should not throw when the gantt instance is not ready", async () => {
    // 实例未就绪时，resizeTimeAxis 内部守卫应使其成为空操作
    const wrapper = mount(GanttVue, {
      props: { options: { data: [] } }
    });
    // 不等待 flushPromises，此时 ganttInstance 可能为 null
    expect(() => wrapper.vm.resizeTimeAxis()).not.toThrow();

    wrapper.unmount();
  });
});
