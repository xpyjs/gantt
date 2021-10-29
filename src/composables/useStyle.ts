import { computed } from 'vue';
import { Variables } from '@/constants/vars';
import { ColorSelectStr } from '@/typings/ParamOptions';
import { changeAlpha } from '@/utils/colors';
import useParam from './useParam';
import useResize from './useResize';
import useData from './data/useData';

export function useDark() {
  const { GtParam } = useParam();

  const dark = computed(() => GtParam.dark);

  const colorSelectStr = computed<ColorSelectStr>(() =>
    dark.value ? 'dark' : 'default'
  );
  return { dark, colorSelectStr };
}

export default () => {
  const { GtParam, oneDayWidth } = useParam();
  const { GtData } = useData();
  const { rowHeight } = useResize();
  const { colorSelectStr } = useDark();

  const rowBgColor = computed(() => {
    return (level?: number) => {
      const color =
        GtParam.ganttOptions.body?.bgColor || 'var(--j-content-bg-color)';

      return level !== undefined
        ? {
            backgroundColor: `${GtParam.levelColor[level] || color} !important`
          }
        : {};
    };
  });

  const tableRowStyle = computed(() => {
    return (level?: number) => {
      return {
        height: `${rowHeight.value}px`,
        borderColor: 'var(--j-content-border-color)',
        color: GtParam.ganttOptions.body?.textColor,
        ...rowBgColor.value(level)
      };
    };
  });

  const ganttRowStyle = computed(() => {
    return (level?: number) => {
      return {
        height: `${rowHeight.value}px`,
        borderColor: 'var(--j-content-border-color)',
        color: GtParam.ganttOptions.body?.textColor,

        backgroundSize: `${
          oneDayWidth.value * (GtParam.headerUnit === 'week' ? 7 : 1)
        }px`,
        backgroundImage:
          GtParam.headerUnit === 'day'
            ? 'linear-gradient(270deg, var(--j-content-border-color) 1px, transparent 0)'
            : '',
        ...rowBgColor.value(level)
      };
    };
  });

  const rowWrapStyle = computed(() => {
    return (index: number, uuid: string) => {
      let style = {};

      // 先写选择，后写悬停，注意顺序。悬停时可以覆盖选择样式
      if (GtData.selected.index === index && GtData.selected.uuid === uuid) {
        style = {
          backgroundColor: `${changeAlpha(
            GtParam.ganttOptions.body?.selectColor ||
              Variables.color.selected[colorSelectStr.value],
            0.5
          )} !important`
        };
      }

      if (GtData.hovered.index === index && GtData.hovered.uuid === uuid) {
        style = {
          backgroundColor: `${changeAlpha(
            GtParam.ganttOptions?.body?.hoverColor ||
              Variables.color.hovered[colorSelectStr.value],
            0.5
          )} !important`
        };
      }

      return {
        height: `${rowHeight.value}px`,
        position: 'absolute',
        width: '100%',
        top: `${rowHeight.value * index}px`,
        ...style
      };
    };
  });

  const headerStyle = computed(() => {
    return {
      backgroundColor: `${GtParam.ganttOptions.header?.bgColor}`,
      borderColor: 'var(--j-content-border-color)',
      color: `${GtParam.ganttOptions.header?.textColor}`
    };
  });

  return { tableRowStyle, ganttRowStyle, rowWrapStyle, headerStyle };
};
