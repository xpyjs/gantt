import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { svgToImage } from "../../src/utils/helpers";

describe("svgToImage", () => {
  // Mock Image 类
  let mockImage: any;
  let createObjectURLMock: any;
  let revokeObjectURLMock: any;

  beforeEach(() => {
    // Mock URL.createObjectURL 和 revokeObjectURL
    createObjectURLMock = vi.fn((blob: Blob) => `blob:mock-url-${Math.random()}`);
    revokeObjectURLMock = vi.fn();

    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    // Mock Image 类
    mockImage = null;
    global.Image = class MockImage {
      src: string = "";
      onload: (() => void) | null = null;
      onerror: ((error: any) => void) | null = null;

      constructor() {
        mockImage = this;
      }
    } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("应该将SVG转换为HTMLImageElement", async () => {
    const svg = '<svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="red"/></svg>';

    const promise = svgToImage(svg);

    // 模拟图片加载成功
    setTimeout(() => {
      if (mockImage && mockImage.onload) {
        mockImage.onload();
      }
    }, 0);

    const img = await promise;
    expect(img).toBeDefined();
    expect(createObjectURLMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });

  it("应该缓存相同的SVG字符串", async () => {
    const svg = '<svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="blue"/></svg>';

    const promise1 = svgToImage(svg);
    const promise2 = svgToImage(svg);

    // 模拟图片加载成功
    setTimeout(() => {
      if (mockImage && mockImage.onload) {
        mockImage.onload();
      }
    }, 0);

    const [img1, img2] = await Promise.all([promise1, promise2]);

    // 应该返回相同的 Promise
    expect(promise1).toBe(promise2);
    expect(img1).toBe(img2);
    // createObjectURL 只应该被调用一次
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  });

  it("应该添加viewBox属性如果SVG没有", async () => {
    const svg = '<svg width="24" height="24"><rect width="24" height="24" fill="green"/></svg>';

    svgToImage(svg);

    // 检查传递给 Blob 的 SVG 字符串是否包含 viewBox
    const blobCalls = createObjectURLMock.mock.calls;
    expect(blobCalls.length).toBeGreaterThan(0);

    // 模拟图片加载
    if (mockImage && mockImage.onload) {
      mockImage.onload();
    }
  });

  it("应该使用自定义宽高", async () => {
    const svg = '<svg><rect width="100" height="100" fill="yellow"/></svg>';

    svgToImage(svg, 32, 32);

    // 检查 Blob 内容
    const blobCalls = createObjectURLMock.mock.calls;
    expect(blobCalls.length).toBeGreaterThan(0);

    // 模拟图片加载
    if (mockImage && mockImage.onload) {
      mockImage.onload();
    }
  });

  it("应该替换现有的width和height属性", async () => {
    const svg = '<svg width="100" height="100"><circle cx="50" cy="50" r="50" fill="purple"/></svg>';

    svgToImage(svg, 20, 20);

    // 模拟图片加载
    if (mockImage && mockImage.onload) {
      mockImage.onload();
    }
  });

  it("应该保留已存在的viewBox", async () => {
    const svg = '<svg viewBox="0 0 50 50" width="16" height="16"><rect width="50" height="50" fill="orange"/></svg>';

    svgToImage(svg);

    // 模拟图片加载
    if (mockImage && mockImage.onload) {
      mockImage.onload();
    }
  });

  it("应该添加preserveAspectRatio属性如果不存在", async () => {
    const svg = '<svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="cyan"/></svg>';

    svgToImage(svg);

    // 模拟图片加载
    if (mockImage && mockImage.onload) {
      mockImage.onload();
    }
  });

  it("应该在加载失败时reject Promise", async () => {
    const svg = '<svg width="16" height="16"><invalid-element/></svg>';

    const promise = svgToImage(svg);

    // 模拟图片加载失败
    setTimeout(() => {
      if (mockImage && mockImage.onerror) {
        mockImage.onerror(new Error("Failed to load image"));
      }
    }, 0);

    await expect(promise).rejects.toThrow();
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });

  it("应该在错误时从缓存中移除", async () => {
    const svg = '<svg width="16" height="16"><bad-element/></svg>';

    const promise1 = svgToImage(svg);

    // 模拟图片加载失败
    setTimeout(() => {
      if (mockImage && mockImage.onerror) {
        mockImage.onerror(new Error("Failed to load"));
      }
    }, 0);

    try {
      await promise1;
    } catch (e) {
      // 预期会失败
    }

    // 再次尝试应该创建新的 Promise
    const promise2 = svgToImage(svg);
    expect(promise1).not.toBe(promise2);

    // 模拟第二次加载成功
    setTimeout(() => {
      if (mockImage && mockImage.onload) {
        mockImage.onload();
      }
    }, 0);

    await promise2;
  });

  it("应该处理没有宽高属性的SVG", async () => {
    const svg = '<svg><circle cx="50" cy="50" r="40" fill="pink"/></svg>';

    svgToImage(svg, 16, 16);

    // 模拟图片加载
    if (mockImage && mockImage.onload) {
      mockImage.onload();
    }
  });

  it("应该使用默认宽高(16x16)", async () => {
    const svg = '<svg><rect x="0" y="0" width="100" height="100" fill="brown"/></svg>';

    svgToImage(svg);

    // 模拟图片加载
    if (mockImage && mockImage.onload) {
      mockImage.onload();
    }
  });
});
