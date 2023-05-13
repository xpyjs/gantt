import { useDraggable } from '@vueuse/core';
import { type Ref, ref, computed, onMounted, nextTick } from 'vue';
import useElement from './useElement';
import useParam from './useParam';
import useRoot from './useRoot';

const lineLeft = ref(0);
const mousedown = ref(false);

interface DragOptions {
  onStart?: (pos: { x: number; y: number }, e: MouseEvent) => void;
  onMove?: (x: number, e: MouseEvent) => void;
  onEnd?: (x: number, e: MouseEvent) => Promise<void> | void;
  onFinally?: () => void;
  target?: El;
  reset?: boolean;
  disabled?: () => boolean;
}

export default () => {
  function onDrag(el: Ref<El>, options: DragOptions = {}) {
    const left = ref(0);
    const delta = ref(0);

    const isMove = ref(false);

    useDraggable(el, {
      onStart: (pos, e) => {
        if (options.disabled?.()) return;

        mousedown.value = true;
        isMove.value = false;

        if (options.reset) {
          left.value = 0;
          delta.value = 0;
        }

        const rect = (options?.target ?? el.value)?.getBoundingClientRect();
        delta.value =
          Math.abs(left.value - (rect?.left ?? 0)) +
          e.offsetX +
          (((e?.target as any)?.offsetLeft as number) ?? 0);

        options?.onStart?.(pos, e);
      },

      onMove: (pos, e) => {
        if (options.disabled?.()) return;

        isMove.value = true;

        left.value = e.clientX - delta.value;
        options?.onMove?.(left.value, e);
      },

      onEnd: (pos, e) => {
        if (options.disabled?.()) return;

        mousedown.value = false;
        if (isMove.value) void options?.onEnd?.(left.value, e);

        options?.onFinally?.();
      }
    });
  }

  const { $param } = useParam();
  const { rootRef } = useRoot();

  function onResizeTableColumn(
    el: Ref<El>,
    options: {
      onEnd?: (x: number) => void;
      preMove?: (x: number, clientX: number) => boolean;
    } = {}
  ) {
    onMounted(() => {
      const rootRect = rootRef.value?.getBoundingClientRect();

      const { getMaxHeader } = useElement();

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

        onEnd: async x => {
          options?.onEnd?.(x);

          await nextTick();

          $param.headerHeight = getMaxHeader();
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
