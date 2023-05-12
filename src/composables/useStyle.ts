import type rootProps from '@/components/root/rootProps';
import { useStore } from '@/store';
import { type ExtractPropTypes, computed, unref, watch } from 'vue';

export default () => {
  const store = useStore();

  const rowHeight = computed(() => store.$styleBox.rowHeight);

  const bodyHeight = computed(
    () => `${rowHeight.value * store.$data.length}px`
  );

  const setStyles = (props: ExtractPropTypes<typeof rootProps>) => {
    const fn = () => {
      store.$styleBox.setBorder(props.border);
      store.$styleBox.setBorderColor(props.borderColor);

      store.$styleBox.ganttColumnSize = unref(props.ganttColumnSize);
      store.$styleBox.unit = unref(props.unit);
      store.$styleBox.rowHeight = unref(props.rowHeight);
      store.$styleBox.showCheckbox = unref(props.showCheckbox);
      store.$styleBox.highlightDate = unref(props.highlightDate);
      store.$styleBox.showExpand = unref(props.showExpand);
      store.$styleBox.showToday = unref(props.showToday);
      store.$styleBox.showWeekend = unref(props.showWeekend);
      store.$styleBox.levelColor = unref(props.levelColor);
      store.$styleBox.headerStyle = unref(props.headerStyle);
      store.$styleBox.bodyStyle = unref(props.bodyStyle);
      store.$styleBox.primaryColor = unref(props.primaryColor);
    };

    fn();

    watch(
      () => [
        props.border,
        props.borderColor,
        props.ganttColumnSize,
        props.unit,
        props.rowHeight,
        props.showCheckbox,
        props.highlightDate,
        props.showExpand,
        props.showToday,
        props.showWeekend,
        props.levelColor,
        props.headerStyle,
        props.bodyStyle,
        props.primaryColor
      ],
      fn,
      { deep: true }
    );
  };

  return { rowHeight, bodyHeight, setStyles, $styleBox: store.$styleBox };
};
