/**
 * jsdom 未实现 canvas 2d context（未安装 canvas 原生包），
 * Konva Stage / Layer 构造时会因 getContext 返回 null 而崩溃。
 *
 * 渲染层测试只断言节点结构与属性（位置、尺寸、存在性），
 * 不验证真实像素绘制，因此用 Proxy 上下文替代：
 * 任意方法调用为 noop，常用返回值方法返回最小可用结构。
 */
export function stubCanvasContext(): void {
  const ctx: any = new Proxy(
    {},
    {
      get(t, prop) {
        if (typeof prop === 'symbol') return undefined;
        if (prop === 'measureText') return () => ({ width: 0 });
        if (
          prop === 'createLinearGradient' ||
          prop === 'createRadialGradient' ||
          prop === 'createPattern'
        ) {
          return () => ({ addColorStop: () => {} });
        }
        if (prop === 'getImageData') return () => ({ data: [] });
        if (prop === 'getLineDash') return () => [];
        if (typeof t[prop] === 'undefined') {
          t[prop] = () => {};
        }
        return t[prop];
      },
      set(t, prop, value) {
        t[prop] = value;
        return true;
      }
    }
  );

  (HTMLCanvasElement.prototype as any).getContext = () => ctx;
}
