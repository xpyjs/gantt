// 对象相等
export function isDeepEqual(a: any, b: any) {
  const o1 = a instanceof Object;
  const o2 = b instanceof Object;
  // 判断是不是对象
  if (!o1 || !o2) {
    return a === b;
  }

  //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,
  //例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const o in a) {
    const t1 = a[o] instanceof Object;
    const t2 = b[o] instanceof Object;
    if (t1 && t2) {
      if (!isDeepEqual(a[o], b[o])) return false;
    } else if (a[o] !== b[o]) {
      return false;
    }
  }
  return true;
}

function isType(o: any, t: string) {
  return Object.prototype.toString.call(o).slice(8, -1) === t;
}

/**
 * 对象类型是否为 Null
 * @param o 任意对象
 * @returns 如果为 Null 返回 true，否则返回 false
 */
export const isNull = (o: any): o is null => isType(o, "Null");

/**
 * 对象类型是否为 Undefined
 * @param o 任意对象
 * @returns 如果为 Undefined 返回 true，否则返回 false
 */
export const isUndefined = (o: any): o is undefined => isType(o, "Undefined");

/**
 * 对象类型是否为 Object
 * @param o 任意对象
 * @returns 如果为 Object 返回 true，否则返回 false
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const isObject = (o: any): o is Object => isType(o, "Object");

/**
 * 对象类型是否为 Array
 * @param o 任意对象
 * @returns 如果为 Array 返回 true，否则返回 false
 */
export const isArray = (o: any): o is Array<any> => isType(o, "Array");

/**
 * 对象类型是否为 Date
 * @param o 任意对象
 * @returns 如果为 Date 返回 true，否则返回 false
 */
export const isDate = (o: any): o is Date => isType(o, "Date");

/**
 * 对象类型是否为 Function
 * @param o 任意对象
 * @returns 如果为 Function 返回 true，否则返回 false
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (o: any): o is Function => isType(o, "Function");

/**
 * 对象类型是否为 Boolean
 * @param o 任意对象
 * @returns 如果为 Boolean 返回 true，否则返回 false
 */
export const isBoolean = (o: any): o is boolean => isType(o, "Boolean");

/**
 * 对象类型是否为 String
 * @param o 任意对象
 * @returns 如果为 String 返回 true，否则返回 false
 */
export const isString = (o: any): o is string => isType(o, "String");

/**
 * 对象类型是否为 Number
 * @param o 任意对象
 * @returns 如果为 Number 返回 true，否则返回 false
 */
export const isNumber = (o: any): o is number => isType(o, "Number");
