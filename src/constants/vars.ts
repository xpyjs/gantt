// 所有的默认变量
export const Variables = {
  noData: '无数据 😢',

  name: {
    root: 'JGantt',
    column: 'JGanttColumn',
    slider: 'JGanttSlider',
    table: 'JTableContent',
    gantt: 'JGanttContent',
    tableHeader: 'JTableHeader',
    ganttHeader: 'JGanttHeader',
    tableRow: 'JTableContentRow',
    ganttRow: 'JGanttContentRow',
    ganttBackgroundRow: 'JGanttContentBackgroundRow'
  },

  provider: {
    gtData: 'GanttData',
    gtParam: 'GanttParam',
    gtRootEmit: 'GanttRootEmit',
    gtRootRef: 'GanttRootRef',
    gtGanttRef: 'GanttGanttRef',
    gtTableRef: 'GanttTableRef',
    gtIsShowMask: 'GanttIsShowMask',
    gtShowDateList: 'GanttShowDateList',
    gtSuccessBarList: 'GanttSuccessBarList',
    gtInitGanttWidth: 'GanttInitGanttWidth',
    gtColumnSliderLineVisible: 'GanttColumnSliderLineVisible',
    gtColumnSliderLineLeft: 'GanttColumnSliderLineLeft',
    gtColumnDefaultLeft: 'GanttColumnDefaultLeft',
    gtSuccessBarTimeout: 'GanttSuccessBarTimeout',
    gtIsShowToast: 'GanttIsShowToast',
    gtToastMessage: 'GanttToastMessage',
    gtToastQueue: 'GanttToastQueue',
    gtScrollTop: 'GanttScrollTop',
    gtRootHeight: 'GanttRootHeight',
    gtScrollBarHeight: 'GanttScrollBarHeight'
  },

  key: {
    start: 'startDate',
    end: 'endDate',
    // columnWidth: "columnWidth",
    columnSize: 'columnSize',
    showToday: 'showToday',
    showWeekend: 'showWeekend',
    header: 'header',
    body: 'body',
    todayColor: 'todayColor',
    weekendColor: 'weekendColor',
    bgColor: 'bgColor',
    borderColor: 'borderColor',
    textColor: 'textColor',
    hoverColor: 'hoverColor',
    selectColor: 'selectColor'
  },

  slots: {
    settings: 'settings'
  },

  size: {
    defaultHeaderHeight: 100,
    defaultContentRowHeight: 30,
    defaultTableColumnWidth: 80,
    defaultScrollBarHeight: 17,
    minContentRowHeight: 20,
    maxContentRowHeight: 70,
    minHeaderHeight: 30,
    // minGanttColumnWidth: 15,
    // maxGanttColumnWidth: 100,
    minTableColumnWidth: 30
  },

  color: {
    selected: {
      default: '#999',
      dark: '#666'
    },
    hovered: {
      default: '#ccc',
      dark: '#333'
    },
    today: {
      default: 'lightblue',
      dark: 'steelblue'
    },
    weekend: {
      default: 'lightgrey',
      dark: 'grey'
    },
    primary: {
      default: '#ECA710',
      dark: '#ECA710'
    },
    text: {
      default: '#282828',
      dark: '#E5E5E5'
    },
    border: {
      default: '#E5E5E5',
      dark: '#212121'
    },
    background: {
      default: 'white',
      dark: '#181818'
    }
  },

  time: {
    millisecondOfDay: 86400000,
    millisecondOfWeek: 604800000
  }
};

export default Variables;
