// 所有的默认变量
export const Variables = {
  noData: '无数据 😢',

  name: {
    root: 'XGantt',
    column: 'XGanttColumn',
    slider: 'XGanttSlider'
  },

  slots: {
    settings: 'settings'
  },

  size: {
    minContentRowHeight: 20,
    maxContentRowHeight: 70,
    minHeaderHeight: 30,
    minTableColumnWidth: 40,
    ganttColumnWidth: {
      small: {
        hour: 10,
        day: 15,
        week: 50
      },
      normal: {
        hour: 15,
        day: 30,
        week: 80
      },
      large: {
        hour: 30,
        day: 60,
        week: 120
      }
    }
  },

  default: {
    headerHeight: 80,
    rowHeight: 30,
    ganttColumnWidth: 30,
    tableColumnWidth: 80,
    startKey: 'startDate',
    endKey: 'endDate',
    idKey: 'id'
  },

  time: {
    millisecondOf: {
      millisecond: 1,
      second: 1000,
      minute: 60000,
      hour: 3600000,
      day: 86400000,
      week: 604800000
    },
    aggregation: {
      week: 'year',
      day: 'month',
      hour: 'day',
      minute: 'hour'
    }
  }
};

export default Variables;
