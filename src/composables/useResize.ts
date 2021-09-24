import { Variables } from "@/constants/vars";
import { TableHeader } from "@/models/param/header";
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  readonly,
  ref
} from "vue";
import useParam, { useSetGanttHeader } from "./useParam";
import { isNumber } from "@/utils/is";
import useGanttRef from "./useGanttRef";
import useData from "./useData";
import useRootRef from "./useRootRef";

export default function () {
  const { GtParam, colWidth } = useParam();

  const tableWidth = computed(() =>
    GtParam.tableHeaders.reduce((p, x) => p + x.width, 0)
  );

  const ganttWidth = computed(() => {
    const width = colWidth.value || Variables.size.minGanttColumnWidth;
    return GtParam.ganttHeaders.length * width;
  });

  return {
    rowHeight: computed(() => GtParam.rowHeight),
    tableWidth: readonly(tableWidth),
    ganttWidth: readonly(ganttWidth),
    headerHeight: computed(() => GtParam.headerHeight)
  };
}

/**
 * 监听甘特横向大小变化
 */
export function useResizeGanttObserver() {
  const { initGanttWidth, setHeaders } = useSetGanttHeader();
  const { ganttRef } = useGanttRef();

  const ganttResizeObserver = ref<ResizeObserver>();

  onBeforeMount(() => {
    ganttResizeObserver.value = new ResizeObserver(entries => {
      for (const entry of entries) {
        initGanttWidth.value = entry.contentRect.width;
        setHeaders();
      }
    });
  });

  onMounted(() => {
    ganttRef?.value && ganttResizeObserver.value?.observe(ganttRef.value);
  });

  onUnmounted(() => {
    ganttResizeObserver.value = undefined;
  });

  return {};
}

// 设置移动线
const columnSliderLineVisible = ref(false);
const columnSliderLineLeft = ref(0);
const columnDefaultLeft = ref(-1);
/**
 * 左侧表格调整列宽方法
 */
export function useResizeTableColumn() {
  const { GtParam } = useParam();
  const { GtData } = useData();
  const { rootRef } = useRootRef();

  const rootClientWidth = computed(() => rootRef.value?.clientWidth || 0);

  function onHiddenColumnSliderLine() {
    columnSliderLineVisible.value = false;
    columnDefaultLeft.value = -1;
  }

  function onMoveColumnSliderLine(offset: number) {
    if (columnSliderLineVisible.value === false) {
      columnSliderLineVisible.value = true;
    }

    if (columnDefaultLeft.value === -1) {
      columnDefaultLeft.value = rootRef.value?.offsetLeft as number;
    }

    columnSliderLineLeft.value = offset - columnDefaultLeft.value;
  }

  /**
   * 处理整个表格的右侧拉伸线
   */
  function onResizeTableWidth(e: MouseEvent) {
    let offset = 0;
    const srcX = e.pageX;
    const w = GtParam.tableHeaders[GtParam.tableHeaders.length - 1].width;

    document.onmousemove = e => {
      let targetX = e.pageX;
      // 如果鼠标离从左侧离开浏览器, 那么鼠标的位置停留在浏览器最左侧的位置, 也就是targetX = 0.
      if (targetX < 0) {
        targetX = 0;
      }

      // 判断最大值，最大总宽度要给甘特留出一定空间
      const space = 100;
      const originAllWidth = GtParam.tableHeaders.reduce(
        (res, head) => res + head.width,
        0
      );
      const diffWidth = targetX - srcX;
      if (
        originAllWidth + diffWidth >
        (rootRef.value?.clientWidth as number) - space
      ) {
        return;
      }

      // 判断表格宽度的最小值
      if (w + targetX - srcX > Variables.size.minTableColumnWidth) {
        // 赋差值
        offset = targetX - srcX;
        onMoveColumnSliderLine(targetX);
      }
    };

    document.onmouseup = () => {
      document.onmousemove = document.onmouseup = null;
      const w = GtParam.tableHeaders[GtParam.tableHeaders.length - 1].width;
      GtParam.tableHeaders[GtParam.tableHeaders.length - 1].setWidth(
        w + offset
      );
      onHiddenColumnSliderLine();
    };
  }

  function onResizeColumnWidth(e: MouseEvent, item: TableHeader) {
    let offset = 0;
    const srcX = e.pageX;

    document.onmousemove = e => {
      let targetX = e.pageX;
      // 如果鼠标离从左侧离开浏览器, 那么鼠标的位置停留在浏览器最左侧的位置, 也就是targetX = 0.
      if (targetX < 0) {
        targetX = 0;
      }

      // 判断表格宽度的最小值
      let minWidth = Variables.size.minTableColumnWidth;
      if (item.key === 0) {
        let w = 0;
        // 留出层级的宽度
        w += GtParam.expandWidth * GtData.hierarchy;

        // 需要留出层级和 checkbox 的宽度
        if (GtParam.showCheckbox) w += GtParam.checkBoxWidth;

        if (w > minWidth) minWidth = w;
      }

      // 判断最大值，最大总宽度要给甘特留出一定空间
      const space = 100;
      const originAllWidth = GtParam.tableHeaders.reduce(
        (res, head) => res + head.width,
        0
      );
      const diffWidth = targetX - srcX;

      if (originAllWidth + diffWidth > rootClientWidth.value - space) {
        return;
      }

      if (item.width + targetX - srcX > minWidth) {
        // 赋差值
        offset = targetX - srcX;
        onMoveColumnSliderLine(targetX);
      }
    };

    document.onmouseup = () => {
      document.onmousemove = document.onmouseup = null;
      item.setWidth(item.width + offset);
      onHiddenColumnSliderLine();
    };
  }

  const sliderLineClass = computed(() => {
    return {
      "gt-hide": !columnSliderLineVisible.value
    };
  });

  const sliderLineStyle = computed(() => {
    return {
      left: `${columnSliderLineLeft.value}px`
    };
  });

  return {
    sliderLineClass,
    sliderLineStyle,

    onResizeTableWidth,
    onResizeColumnWidth
  };
}

/**
 * 悬停按钮的定位方法
 */
export function useBtnPosition() {
  const size = ref(30);
  const top = ref(size.value / 2);
  const right = ref(-size.value / 2);

  const opBtnStyle = computed(() => {
    return {
      position: " absolute",
      right: `${right.value}px`,
      top: `${top.value}px`,
      zIndex: 99
    };
  });

  const originPosition = ref<null | number>(null);
  function onOpBtnMouseLeave() {
    if (isNumber(originPosition.value)) {
      right.value = originPosition.value;
    }
  }

  function onOpBtnMouseEnter() {
    if (right.value >= 0) {
      originPosition.value = null;
      return;
    }

    originPosition.value = right.value;
    right.value = 0;
  }

  return {
    btnSize: readonly(size),
    opBtnStyle,
    onOpBtnMouseLeave,
    onOpBtnMouseEnter
  };
}
