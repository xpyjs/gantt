import { Variables } from "@/constants/vars";
import { Row } from "@/models/data/row";
import { formatDate } from "@/utils/date";
import { isBoolean, isFunction, isString, isUndefined } from "@/utils/is";
import { toRaw } from "vue";

export default function (data: Row) {
  const isMerge = function (m: string | boolean | ((data: any) => boolean)) {
    let merge = false;
    if (!isUndefined(m)) {
      if (isBoolean(m)) {
        merge = m;
      } else if (isFunction(m)) {
        merge = m(toRaw(data.data));
      } else {
        if (m === "") {
          merge = true;
        }
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
    const fmt = dateFormat ? dateFormat : "yyyy-MM-dd";

    d[sl] = formatDate(d[sl], fmt);
    d[el] = formatDate(d[el], fmt);

    return { data: d, level: data.level + 1 };
  }

  const textData = function (
    label: string | undefined,
    dateFormat: string | undefined,
    empty: string | undefined
  ): string {
    const { data } = scopeData(dateFormat);
    if (isString(label) && label in data) {
      return data[label];
    }

    return empty ?? Variables.noData;
  };

  return {
    isMerge,
    scopeData,
    textData
  };
}
