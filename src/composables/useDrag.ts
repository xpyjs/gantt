import { useDraggable } from '@vueuse/core';
import { type Ref, ref, computed, onMounted } from 'vue';
import useElement from './useElement';
import useParam from './useParam';

const lineLeft = ref(0);
const mousedown = ref(false);

interface DragOptions {
  onMove?: (x: number, e: MouseEvent) => void;
  onEnd?: (x: number, e: MouseEvent) => void;
  onFinally?: () => void;
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
        mousedown.value = true;
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
        mousedown.value = false;
        if (isMove.value) options?.onEnd?.(left.value, e);

        options?.onFinally?.();
      }
    });
  }

  const { $param } = useParam();
  const { rootRef } = useElement();

  function onResizeTableColumn(
    el: Ref<El>,
    options: {
      onEnd?: (x: number) => void;
      preMove?: (x: number, clientX: number) => boolean;
    } = {}
  ) {
    onMounted(() => {
      const rootRect = rootRef.value?.getBoundingClientRect();

      (el.value as HTMLElement)?.addEventListener('pointerdown', e => {
        lineLeft.value = e.clientX - (rootRect?.left ?? 0);
        $param.showMoveLine = true;
      });

      onDrag(el, {
        reset: true,

        onMove: (x, e) => {
          const clientX = e.clientX - (rootRect?.left ?? 0);
          if (options?.preMove && !options?.preMove(x, clientX)) return;

          lineLeft.value = clientX;
        },

        onEnd: x => {
          options?.onEnd?.(x);
        },

        onFinally: () => {
          $param.showMoveLine = false;
        }
      });
    });
  }

  const showLine = computed(() => $param.showMoveLine);

  return {
    onDrag,
    showLine,
    lineLeft,
    onResizeTableColumn,
    mousedown
  };
};
