# 列组件 XGanttColumn

<Description author="jeremyjone" copyright="xpyjs" />

列组件会显示在甘特表的左侧，如果没有提供，则不显示任何表格列。

::: info

因为我们在内部已经将其加载，所以您并不需要显示的再次导入到您的组件中就可以使用。

:::

::: tip 💡开发提示

该组件在行为上和 `table` 类似，但是不应该当做表格使用。因为我们的主体应该是右侧日期甘特图，列内容只是作为对每一行数据的一个内容描述补充。所以，列不宜过多。

:::

## 基础使用

您只需要简单的将其插入到根组件内即可。

基于入门的示例，您可以直接这样使用：

```html{2}
<x-gantt :data="dataList">
  <x-gantt-column prop="name" />
</x-gantt>
```

它将显示成如下内容：

<!-- @include: ./demo/column-demo/basic.md -->

在 `2.x` 版本中，我们添加了多层表头，它可以通过嵌套 `x-gantt-column` 来实现。

> 在多级表头的实现中，父级表头只接收 `label` 属性作为展示字段，其余字段均无效。

```html
<x-gantt :data="dataList">
  <x-gantt-column prop="name" />

  <x-gantt-column label="时间"> // [!code focus]
    <x-gantt-column prop="startDate" date-format="MM/DD" /> // [!code focus]
    <x-gantt-column prop="endDate" date-format="MM/DD" /> // [!code focus]
  </x-gantt-column> // [!code focus]
</x-gantt>
```

它将显示成如下内容：

<!-- @include: ./demo/column-demo/multi-col.md -->

## 属性

### center

<DataParameter t="Boolean" d="false" />

可以控制当前列的内容居中，默认居左。

### column-class

<DataParameter t="Object | String" d="{}" />

允许向列块内注入类名，与原生使用方法一样。

### column-style

<DataParameter t="Object | String" d="{}" />

允许向列块内注入样式，与原生使用方法一样。

### date-format

<DataParameter t="String" d="YYYY-MM-DD" />

自定义显示日期的格式。如果列内需要显示日期，可以通过该属性来格式化日期。

内部使用了 dayjs 的 format 方法：

- 无参: "2020-04-02T08:02:17-05:00"
- `[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]`: "YYYYescape 2019-01-25T00:00:00-02:00Z"
- `DD/MM/YYYY`: "25/01/2019"

::: warning 请注意
值得注意的是，如果给出该字段，那么其数据内容一定会被当成日期来解析并且格式化，所以不要在非日期字段添加该属性。
:::

更多关于日期格式化的属性，参看 [日期格式化属性](./common.html#日期格式化属性)

### ellipsis <Badge text="新增" type="tip"/>

<DataParameter t="Boolean" d="false" />

如果内容过长，是否显示省略号。

### empty-data

<DataParameter t="String" d="无数据 😢" />

设置空数据时显示的内容。如果数据内容为空，则会显示空数据内容。

### prop

<DataParameter t="String" />

`prop` 是一个重要的属性，它应当对应您给出数据的某一个键名。

::: tip 便捷操作
它支持通过 `.` 深度读取对象内部属性。

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

那么，`prop` 可以通过 `a.b.c` 直接读取到值，而不用像之前那样需要通过模板导出数据再读取内部属性。
:::

<!-- @include: ./demo/column-demo/prop-demo.md -->

### merge

<DataParameter t="(({row: any; $index: number; level: number}) => boolean) | Boolean" d="false" />

<!-- @include: ./demo/column-demo/merge.md -->

设置当前列是否需要与前一列合并。您可以给出一个 Boolean 值或者一个返回 Boolean 值的函数。

- 函数允许您使用行内数据。

```ts
mergeFunc: function({
      row: any,
      $index: number,
      level: number
    }) {
    // your code
    return true; // 请确保返回一个 Boolean 值。
}
```

这是一个很灵活的属性，如果设置为 `true`，则会与前一列进行合并，同时不显示当前列的内容。

**请注意**，该字段对首列无效。

### label <Badge text="调整" type="tip"/>

<DataParameter t="String" />

设置该列表头的显示文本，如果没有，则会显示 `prop` 的内容。它的优先级比 `prop` 高。

::: tip 提示

在多级表头的实现中，父级表头只接收 `label` 属性作为展示字段，其余字段均无效。

:::

### ~~selectable~~ <Badge text="废弃" type="warn"/>

该属性已废弃。

### width

<DataParameter t="Number | String" d="80" />

设置该列的列宽。默认宽度 80，请保持宽度大于 30，否则会引起渲染异常。

## 插槽

### default

<DataParameter f="scope = { row: any; $index: number; level: number }" />

列组件内部允许您插入任何内容，同时它会抛出当前行的数据以供您使用。

插槽抛出一些数据，方便使用：

```ts
{
  row: any,
  $index: number,
  level: number
}
```

一个简单的示例：

```html
<x-gantt-column prop="name">
  <template v-slot="{row, $index, level}">
    <div>{{ row }}</div>
  </template>
</x-gantt-column>
```

### title <Badge text="新增 v2.1.0" type="tip"/> <Badge text="实验性" type="warning" />

允许您在列头部插入任何内容，这对于一些特殊需求有效果，比如多行文本等样式，再比如您需要插入一些功能，排序、筛选等。

```html
<x-gantt-column prop="name">
  <template v-slot:title="{prop, label, level}">
    <div>自定义插槽内容</div>
  </template>
</x-gantt-column>
```

它抛出的数据如下：

```ts
{
  prop: string | undefined,
  label: string | undefined,
  level: number
}
```

- `prop`*: 当前列的 `prop` 属性。该属性在具有子项的表头中不存在，因为它只接收 `label` 属性作为展示字段，参见 [label](#label)。
- `label`: 当前列的 `label` 属性。
- `level`: 当前列的层级。多级表头中它会有用，从上至下，从 1 开始计算层级。

::: tip 建议

如果需要使用该插槽处理排序、筛选等，可以通过 `prop` 属性来获取当前列字段，然后通过自定义方法监听筛选事件，修改源数据即可。

在使用该插槽的过程中，如果如果出现问题，请及时 [反馈](https://github.com/xpyjs/gantt/issues)。

:::

<!-- @include: ./demo/column-demo/title-demo.md -->

接下来，您将继续学习滑块组件的内容。
