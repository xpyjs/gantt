# 列组件 JGanttColumn

<Description author="jeremyjone" date="2021-09-26" copyright="jeremyjone" />

因为我们在内部已经将其加载，所以您并不需要显示的再次导入到您的组件中就可以使用。

列组件会显示在甘特表的左侧，如果没有提供，则不显示任何列。

## 基础使用

您只需要简单的将其插入到根组件内即可。

基于入门的示例，您可以直接这样使用：

```html{5}
<j-gantt
    data-index="index"
    :data="dataList"
>
    <j-gantt-column label="index" />
</j-gantt>
```

它将显示成如下内容：

<img :src="$withBase('/assets/column-basic.png')" alt="column-basic">

## 属性

### center

<DataParameter t="Boolean" d="false" />

可以控制当前列的内容居中，默认居左。

### column-class <Badge type="tip" text="+v1.1.7" vertical="top" />

<DataParameter t="Object | String" d="{}" />

允许向列块内注入类名，与原生使用方法一样。

### column-style <Badge type="tip" text="+v1.1.7" vertical="top" />

<DataParameter t="Object | String" d="{}" />

允许向列块内注入样式，与原生使用方法一样。

### date-format

<DataParameter t="String" d="yyyy-MM-dd" />

自定义显示日期的格式。如果列内需要显示日期，可以通过该属性来格式化日期。

::: warning 请注意
值得注意的是，如果给出该字段，那么其数据内容一定会被当成日期来解析并且格式化，所以不要在非日期字段添加该属性。
:::

更多关于日期格式化的属性，参看 [日期格式化属性](./common.html#日期格式化属性)

### empty-data

<DataParameter t="String" d="无数据 😢" />

设置空数据时显示的内容。如果数据内容为空，则会显示空数据内容。

### label\* <Badge text="required" type="danger"/> <Badge type="tip" text="update v1.1.7" vertical="top" />

<DataParameter r t="String" />

`label` 是一个必填属性，它应当对应您给出数据的某一个键名。

它将加载该字段数据的内容显示在列内容中，同时表头的名称默认也会显示为该 `label` 名称。当然，您可以通过设置 [`name`](#name) 来自定义。

::: tip 更新
从 `v1.1.7` 开始，它支持通过 `.` 深度读取对象内部属性。

比如原始对象为：

```js
const data = {
  a: {
    b: {
      c: '1'
    }
  }
};
```

那么，`label` 可以通过 `a.b.c` 直接读取到值，而不用像之前那样需要通过模板导出数据再读取内部属性。
:::

### merge

<DataParameter t="(data) => boolean | Boolean" d="false" />

设置当前列是否需要与前一列合并。您可以给出一个 Boolean 值或者一个返回 Boolean 值的函数。

- 函数允许您使用行内数据。

```js
mergeFunc: function(data) {
    // your code
    return true; // 请确保返回一个 Boolean 值。
}
```

这是一个很灵活的属性，如果设置为 `true`，则会与前一列进行合并，同时不显示当前列的内容。

**请注意**，该字段对首列无效。

### name

<DataParameter t="String" />

设置该列表头的显示文本，如果没有，则会显示 `label` 的内容。它的优先级比 `label` 高。

### selectable

<DataParameter t="Boolean" d="false" />

设置当前列内容的文本是否可以选择，默认禁止选择。

### width

<DataParameter t="Number | String" d="80" />

设置该列的列宽。默认宽度 80，请保持宽度大于 30，否则会引起渲染异常。

## 插槽

列组件内部允许您插入任何内容，同时它会抛出当前行的数据以供您使用。

一个简单的示例：

```html
<j-gantt-column label="name">
  <template v-slot="data">
    <div>{{ data }}</div>
  </template>
</j-gantt-column>
```

接下来，您将继续学习滑块组件的内容。
