import { useDraggable } from '@vueuse/core';
import { type Ref, ref, computed } from 'vue';
import useParam from './useParam';

const lineLeft = ref(0);

interface DragOptions {
  onMove?: (x: number, e: MouseEvent) => void;
  onEnd?: (x: number, e: MouseEvent) => void;
  target?: El;
  reset?: boolean;
}

type El = HTMLElement | SVGElement | null | undefined;

export default () => {
  function onDrag(el: Ref<El>, options: DragOptions = {}) {
    const left = ref(0);
    const delta = ref(0);

    const isMove = ref(false);

    useDraggable(el, {
      onStart: (pos, e) => {
        isMove.value = false;

        if (options.reset) {
          left.value = 0;
          delta.value = 0;
        }

        const rect = (options?.target ?? el.value)?.getBoundingClientRect();
        delta.value = Math.abs(left.value - (rect?.left ?? 0)) + e.offsetX;
      },

      onMove: (pos, e) => {
        isMove.value = true;

        left.value = e.clientX - delta.value;
        options?.onMove?.(left.value, e);
      },

      onEnd: (pos, e) => {
        if (isMove.value) options?.onEnd?.(left.value, e);
      }
    });
  }

  const { $param } = useParam();
  const showLine = computed(() => $param.showMoveLine);

  return {
    onDrag,
    showLine,
    lineLeft
  };
};
