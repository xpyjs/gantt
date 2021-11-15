<script lang="ts">
import {
  toRefs,
  computed,
  defineComponent,
  ref,
  useAttrs,
  useSlots
} from 'vue';
import useEvent from '@/composables/event/useEvent';
import useParam from '@/composables/useParam';
import { Variables } from '@/constants/vars';
import { Row } from '@/models/data/row';
import columnProps from './props';
import ArrowIcon from '../common/Arrow.vue';
import useResize from '@/composables/useResize';
import useRender from '@/composables/useRender';
// eslint-disable-next-line import/named
import { CustomCssProperties } from '@/typings/private/CSSProperties';

export default defineComponent({
  name: Variables.name.column
});
</script>

<script lang="ts" setup>
const props = defineProps(columnProps);
const slots = useSlots();
const attrs = useAttrs();

const { dateFormat, label, emptyData, center } = toRefs(props);
// eslint-disable-next-line no-underscore-dangle
const nodeKey = attrs.__key as number;
const data = attrs.data as Row;
const { GtParam } = useParam();
const { isMerge, scopeData, textData } = useRender(data);

const realWidth = computed(() => {
  return GtParam.tableHeaders[nodeKey].width;
});

const colWidth = computed(() => {
  let w = Variables.size.defaultTableColumnWidth;
  if (realWidth.value > 0) {
    w = realWidth.value;
  }

  // 向后查找可合并的节点
  for (let i = (nodeKey as number) + 1; i < GtParam.colNodes.length; i++) {
    const v = GtParam.colNodes[i];
    if (isMerge(v.merge)) {
      w += GtParam.tableHeaders[i].width;
    } else {
      break;
    }
  }

  return w;
});
const rootStyle = computed(() => {
  return {
    '--column-width': `${colWidth.value - 1}px`,
    borderColor: 'var(--j-content-border-color)'
  } as CustomCssProperties;
});

// checkbox & expandbox
const boxSize = ref(15);
const boxSizeStyle = computed(() => {
  return { '--box-size': `${boxSize.value}px` } as CustomCssProperties;
});
const showCheckbox = computed(() => GtParam.showCheckbox && nodeKey === 0);
const showExpand = computed(() => GtParam.showExpand && nodeKey === 0);
const canshowExpand = computed(() => data.children.length > 0);
const expandMarginLeft = computed(() => data.level * 10);
const isExpand = computed(() => data.isExpand);
const { onChangeCheckbox } = useEvent(data);
function onClickExpand() {
  data.setExpand(!isExpand.value);
}

// chunk content
const { rowHeight } = useResize();
const chunkStyle = computed(() => {
  return {
    '--row-height': `${rowHeight.value}px`,
    justifyContent: center.value ? 'center' : 'flex-start'
  } as CustomCssProperties;
});

const isChunkNode = computed(() => !!slots?.default);
const chunkNode = computed(() => {
  return slots?.default && slots.default(scopeData(dateFormat?.value))[0];
});
const chunkText = computed(() => {
  return (
    !isChunkNode.value &&
    textData(label?.value, dateFormat?.value, emptyData.value)
  );
});
</script>

<template>
  <div
    class="gt-column"
    :class="{ 'gt-noselect': !selectable }"
    :style="rootStyle"
  >
    <input
      v-if="showCheckbox"
      id="checkbox"
      class="gt-column__checkbox"
      type="checkbox"
      name="checkbox"
      :style="boxSizeStyle"
      @change="e => onChangeCheckbox(e)"
      @click.stop
      @dblclick.stop
    />

    <div
      v-if="showExpand"
      class="gt-column__expand"
      :class="{ 'gt-hide': !canshowExpand }"
      :style="{
        ...boxSizeStyle,
        marginLeft: `${expandMarginLeft}px`
      }"
      @click.stop="onClickExpand"
    >
      <ArrowIcon :direction="isExpand ? 'down' : 'right'" />
    </div>

    <!-- 加载内容 -->
    <div class="gt-column__chunk" :style="chunkStyle">
      <component :is="chunkNode" v-if="isChunkNode" />
      <template v-else>
        {{ chunkText }}
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gt-column {
  width: calc(var(--column-width) - 4px);
  height: calc(100% - 4px);
  padding: 2px;
  display: flex;
  flex-shrink: 0;
  border-right: 1px solid var(--j-content-border-color);

  .gt-column__checkbox {
    width: var(--box-size);
    height: var(--box-size);
    flex-shrink: 0;
    margin: auto 5px;
  }

  .gt-column__expand {
    width: var(--box-size);
    height: var(--box-size);
    flex-shrink: 0;
    margin: auto 5px auto 0;
  }

  .gt-column__chunk {
    width: 100%;
    height: calc(var(--row-height) - 4px);
    line-height: height;
    display: flex;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>