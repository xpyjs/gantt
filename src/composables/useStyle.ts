import type rootProps from '@/components/root/rootProps';
import { useStore } from '@/store';
import { type ExtractPropTypes, computed, watch } from 'vue';

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
