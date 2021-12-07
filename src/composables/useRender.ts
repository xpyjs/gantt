import { toRaw } from 'vue';
import { Variables } from '@/constants/vars';
import { Row } from '@/models/data/row';
import { formatDate } from '@/utils/date';
import { isBoolean, isFunction, isString, isUndefined } from '@/utils/is';

export default (data: Row) => {
  const isMerge = (m: string | boolean | ((data: any) => boolean)) => {
    let merge = false;
    if (!isUndefined(m)) {
      if (isBoolean(m)) {
        merge = m;
      } else if (isFunction(m)) {
        merge = m(toRaw(data.data));
      } else if (m === '') {
        merge = true;
      }
    }

    return merge;
  };

  function scopeData(dateFormat: string | undefined) {
    if (isUndefined(dateFormat))
      return { data: toRaw(data.data), level: data.level + 1 };

    const d = data.cloneData();
    const sl = data.options.sl as string;
    const el = data.options.el as string;
    const fmt = dateFormat || 'yyyy-MM-dd';

    d[sl] = formatDate(d[sl], fmt);
    d[el] = formatDate(d[el], fmt);

    return { data: d, level: data.level + 1 };
  }

  const textData = (
    label: string | undefined,
    dateFormat: string | undefined,
    empty: string | undefined
  ): string => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { data } = scopeData(dateFormat);
    if (isString(label)) {
      if (label in data) return data[label];
      if (label.includes('.')) {
        const [l, ...rest] = label.split('.');
        if (l in data) return rest.reduce((acc, v) => acc[v], data[l]);
      }
    }

    return empty ?? Variables.noData;
  };

  return {
    isMerge,
    scopeData,
    textData
  };
};
