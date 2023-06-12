import type rootProps from '@/components/root/rootProps';
import { useStore } from '@/store';
import { blend } from '@/utils/colors';
import { type ExtractPropTypes, computed, watchEffect, ref } from 'vue';

export default () => {
  const store = useStore();

  const rowHeight = computed(() => store.$styleBox.rowHeight);

  const bodyHeight = computed(
    () => `${rowHeight.value * store.$data.length}px`
  );

  const isDark = ref(false);
  const darkColor = computed(() => ({
    r: 0,
    g: 0,
    b: 0,
    a: 50
  }));
  const darkWrap = (color: string, darkColor: string | Rgba) => {
    return blend(darkColor, color);
  };

  const setStyles = (props: ExtractPropTypes<typeof rootProps>) => {
    const fn = () => {
      isDark.value = props.dark;

      const bc = props.borderColor ?? '#e5e5e5';
      store.$styleBox.borderColor = isDark.value
        ? darkWrap(bc, darkColor.value)
        : bc;

      store.$styleBox.setBorder(props.border);

      store.$styleBox.ganttColumnSize = props.ganttColumnSize;
      store.$styleBox.unit = props.unit;
      store.$styleBox.rowHeight = props.rowHeight;
      store.$styleBox.showCheckbox = props.showCheckbox;
      store.$styleBox.highlightDate = props.highlightDate;
      store.$styleBox.showExpand = props.showExpand;
      store.$styleBox.showToday = props.showToday;
      store.$styleBox.showWeekend = props.showWeekend;
      store.$styleBox.levelColor = props.levelColor;
      store.$styleBox.headerStyle = props.headerStyle;
      store.$styleBox.bodyStyle = props.bodyStyle;
      store.$styleBox.primaryColor = props.primaryColor;
      store.$styleBox.sliderIntoView = props.sliderIntoView;
      store.$styleBox.draggable = props.draggable;
    };

    fn();

    watchEffect(fn);
  };

  return {
    rowHeight,
    bodyHeight,
    setStyles,
    isDark,
    $styleBox: store.$styleBox
  };
};
