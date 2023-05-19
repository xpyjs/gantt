import { ref, reactive } from 'vue';
import EventBus from '../../../src/utils/bus';
import {
  SlotsBox,
  StyleBox,
  Param,
  GanttHeader
} from '../../../src/models/param';
import { AllData, AllLinks } from '../../../src/models/data';

export const store = {
  provide: {
    $bus: reactive(new EventBus()),

    $slotsBox: reactive(new SlotsBox()),

    $data: reactive(new AllData()),

    $links: reactive(new AllLinks()),

    $styleBox: reactive(new StyleBox()),

    ganttHeader: reactive(new GanttHeader()),

    $param: reactive(new Param()),

    rootRef: ref<HTMLElement | null>(null),

    tableHeaderRef: ref<HTMLElement | null>(null),

    ganttHeaderRef: ref<HTMLElement | null>(null),

    ganttBodyRef: ref<HTMLElement | null>(null),

    moveLineLeft: ref(0),

    moveLineMousedown: ref(false),

    linking: reactive({
      startPos: { x: 0, y: 0 },
      endPos: { x: 0, y: 0 },
      isLinking: false,
      startRow: null,
      endRow: null
    })
  }
};
