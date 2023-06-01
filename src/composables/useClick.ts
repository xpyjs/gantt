import {
  unrefElement,
  type MaybeElementRef,
  useEventListener
} from '@vueuse/core';
import { computed } from 'vue';

export interface OnUnifyClickOptions {
  /**
   * 单击事件
   * @returns void
   */
  click?: () => void;

  /**
   * 双击事件
   * @returns void
   */
  dblClick?: () => void;

  /**
   * Time in ms till `longpress` gets called
   *
   * @default 300
   */
  delay?: number;
}

export function onUnifyClick<T extends OnUnifyClickOptions>(
  target: MaybeElementRef,
  options?: T
) {
  const elementRef = computed(() => unrefElement(target));

  let clicks = 0;
  const delay = options?.delay ?? 300;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function onClick() {
    clicks++;
    if (clicks === 1) {
      // click
      timer = setTimeout(() => {
        clicks = 0;
      }, delay);

      options?.click?.();
    } else {
      // dbl-click
      clearTimeout(timer);
      clicks = 0;

      options?.dblClick?.();
    }
  }

  useEventListener(elementRef, 'click', onClick, { passive: true });
}
