import Variables from '@/constants/vars';
import { XDate } from '@/models/param/date';
import { useStore } from '@/store';
import { day } from '@/utils/date';
import { computed } from 'vue';

export default () => {
  const store = useStore();

  const headerShowUnit = computed(() => {
    switch (store.ganttHeader.unit) {
      case 'hour':
        return 'hour';
      case 'day':
      case 'week':
      case 'month':
      default:
        return 'day';
    }
  });

  const ganttColumnWidth = computed(() => {
    const size = store.$styleBox.ganttColumnSize;
    if (typeof size === 'number') return size;
    return Variables.size.ganttColumnWidth[size][store.ganttHeader.unit];
  });

  function getGanttUnitColumnWidth(
    date: Date | number,
    condition?: 'after' | 'before'
  ) {
    const calc = (full: number) => {
      if (condition === 'after') {
        // 计算全量之前的日期长度
        const d = new XDate(date);
        if (store.ganttHeader.unit === 'week') {
          return full - day(date).weekday();
        }

        return full - d.getBy(headerShowUnit.value) + 1;
      }

      if (condition === 'before') {
        // 计算全量之前的日期长度
        const d = new XDate(date);
        if (store.ganttHeader.unit === 'week') {
          return day(date).weekday() + 1;
        }

        return d.getBy(headerShowUnit.value);
      }

      return full;
    };

    let gap = 1;
    switch (store.ganttHeader.unit) {
      case 'week':
        gap = calc(7);
        break;
      case 'month':
        gap = calc(day(date).daysInMonth());
        break;
      case 'day':
      case 'hour':
      default:
        gap = 1;
        break;
    }

    return ganttColumnWidth.value * gap;
  }

  const ganttWidth = computed(() => {
    return store.ganttHeader.datesByUnit.length * ganttColumnWidth.value;
  });

  const currentMillisecond = computed(() => {
    if (store.ganttHeader.unit === 'hour') {
      return Variables.time.millisecondOf.hour;
    }

    return Variables.time.millisecondOf.day;
  });

  return {
    ganttWidth,
    headerShowUnit,

    /**
     * 获取甘特图一列的列宽
     */
    ganttColumnWidth,

    /**
     * 获取甘特图最小单位的列宽（基于当前单位）
     */
    getGanttUnitColumnWidth,

    /**
     * 获取当前单位的毫秒数（小时或天）
     */
    currentMillisecond
  };
};
