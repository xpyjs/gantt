import { ref, reactive } from 'vue';
import { GanttData } from '@/models/data/data';
import { ParamData } from '@/models/param/param';
import { Variables } from '@/constants/vars';

export const store = {
  provide: {
    [Variables.provider.gtData]: reactive(new GanttData()),
    [Variables.provider.gtParam]: reactive(new ParamData()),
    [Variables.provider.gtRootEmit]: ref(),
    [Variables.provider.gtRootRef]: ref(),
    [Variables.provider.gtGanttRef]: ref(),
    [Variables.provider.gtTableRef]: ref(),
    [Variables.provider.gtIsShowMask]: ref(false),
    [Variables.provider.gtShowDateList]: reactive([]),
    [Variables.provider.gtSuccessBarList]: reactive([]),
    [Variables.provider.gtInitGanttWidth]: ref(0),
    [Variables.provider.gtColumnSliderLineVisible]: ref(false),
    [Variables.provider.gtColumnSliderLineLeft]: ref(0),
    [Variables.provider.gtColumnDefaultLeft]: ref(-1),
    [Variables.provider.gtSuccessBarTimeout]: 1000,
    [Variables.provider.gtIsShowToast]: ref(false),
    [Variables.provider.gtToastMessage]: ref(''),
    [Variables.provider.gtToastQueue]: [],
    [Variables.provider.gtScrollTop]: ref(0),
    [Variables.provider.gtRootHeight]: ref(0),
    [Variables.provider.gtScrollBarHeight]: ref(
      Variables.size.defaultScrollBarHeight
    )
  }
};
