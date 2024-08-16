---
outline: [2, 4]
---

# 根组件 XGantt

<Description author="jeremyjone" copyright="xpyjs" />

对于 `XGantt` 组件，它具有非常丰富的属性。

## 数据

### data

<DataParameter t="Array" d="[]" />

<!-- @include: ./demo/root-demo/basic.md -->

数据源，接收数组类型，同时数组中的每一个对象都应当包含 `id`, `startDate`, `endDate` 和 ~~`children`~~ 这些键，确保正确显示数据内容。

> `children` 不再是必填项。

另外，这些键名不是固定样式的，它可以通过传递参数进行替换，它们的作用不变。

::: tip 提示

- `id` 确保数据的唯一性，它应对于所有数据全局唯一的。通过 [data-id](#data-id) 替换
- `startDate` 可以在甘特图中正确渲染数据的起始日期。通过 [start-key](#start-key) 替换
- `endDate` 可以在甘特图中正确渲染数据的截止日期。通过 [end-key](#end-key) 替换

:::

::: warning 请注意

当修改（拖动等）对象时，startDate 和 endDate 会默认转为 Date 对象。请在使用时确保它们的类型正确。

所以建议直接使用 `Date` 对象，而不是字符串等。

:::

### ~~data-index~~ <Badge text="移除" type="warning"/>

<DataParameter r t="String" />

~~数据的全局唯一键，它应当是数据中的某一个键名，通常它会是 `index`、`id`、`uid` 等。如果它不是全局唯一的，则会引起渲染错误。~~

::: tip 提示
~~这也是我们建议在 `data` 中确保有一个 `index` 字段的具体作用。您也可以使用其他自定义字段，只需要匹配即可。~~
:::

### data-id <Badge text="十分重要" type="danger"/>

<DataParameter t="String" d="id" />

数据的全局唯一键，默认为 `id`。您必须确保它是数据中的某一个唯一的键名，通常它会是 `index`、`id`、`uid` 等。如果它不是全局唯一的，则会引起渲染错误。

::: tip 提示
如果数据中包含 `id` 属性，那么可以不提供该属性。
同时需要确保 `data` 中的每一个数据对象都包含该属性字段，并且是唯一的。
:::

### end-key

<DataParameter t="String" d="endDate" />

它对应数据中起始日期的键，默认值为 `endDate`。如果找不到，则不会渲染甘特图中的内容。

### links <Badge text="新增" type="tip"/>

<DataParameter t="Array" d="[]" />

数据的连线数据。接收数组类型，数组中的每一个对象都应当包含 `from`, `to`，确保正确显示数据内容。

<!-- @include: ./demo/root-demo/link.md -->

如上，`from` 和 `to` 属性是必须的，这两个字段的值应当对应 `data` 中的 `data-id` 值。`color` 是可选的，可以设置连线的颜色。

::: tip 提示

在 `v2.1.12` 中优化了渲染过程

为了提高性能，在页面滚动期间，使用了 `debounce` 函数减少不必要的刷新，所以连线相比 slider 会有一定延迟，当页面停止滚动后，会自动更新，这并不影响使用。

:::

### start-key

<DataParameter t="String" d="startDate" />

它对应数据中起始日期的键，默认值为 `startDate`。如果找不到，则不会渲染甘特图中的内容。

## 样式

::: tip 提示

所有颜色属性除特殊情况外，都可以传递 rgb 或 `#` 开头的 16 进制颜色值，但是不接受英文颜色值。英文颜色在黑暗模式下可能会失效。

推荐统一使用 `#` 开头的 16 进制颜色值。

:::

<!-- @include: ./demo/root-demo/style-demo.md -->

### body-style

<DataParameter t="Object" d="{}" />

用于配置甘特图内容区域的样式。它接收固定参数，用于改变其中的样式。

::: warning 请注意
`Object` 中的键应当区分大小写，这与 html 的参数方式不太一样。
:::

#### - bgColor

<DataParameter t="String" d="white" />

设置整体内容区域的背景颜色，默认为白色（黑暗模式下默认为黑色）。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### - hoverColor

<DataParameter t="String" d="#ccc" />

设置悬停行颜色。接收一个 HEX 颜色值，英文无效。

#### - selectColor

<DataParameter t="String" d="#999" />

设置悬停行颜色。接收一个 HEX 颜色值，英文无效。

#### - textColor

<DataParameter t="String" d="#282828" />

设置整体内容区域的文本颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### - todayColor

<DataParameter t="String" d="lightblue" />

设置 `今日` 时间线的背景颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### - weekendColor

<DataParameter t="String" d="lightgrey" />

设置 `周末` 时间线的背景颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

### border

<DataParameter t="Number" d="1" />

是否显示甘特表整体的边框，默认为 1，0 为不显示。

### border-color

<DataParameter t="String" d="#E5E5E5" />

设置整个组件的边框颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

### dark

<DataParameter t="Boolean" d="false" />

黑暗模式，它会修改页面的背景颜色、文字颜色和边框颜色。

::: warning 请注意
它是默认属性，只会调整默认值。如果您设置了自定义的样式，该方案则不会生效。
:::

::: warning 请注意

如果颜色使用了英文颜色值，那么在黑暗模式下可能会失效。为了避免此情况，请使用 `#` 开头的 16 进制颜色值。

:::

### draggable <Badge text="新增2.1.0+" type="tip" /> <Badge text="预览功能" type="warning" />

<DataParameter t="Boolean | { level: 'all' | 'current' }" d="false" />

::: warning 注意

这是一个预览功能，如果出现任何 bug，或者您希望有所改进，欢迎给我们提出 [issue](https://github.com/xpyjs/gantt/issues)

:::

开启该属性，允许对甘特图中的每行任务进行拖拽排序。默认情况下，仅允许拖拽同层内容的顺序。如果需要任意层级的拖拽时，可以传递一个对象，将参数配置为：`{ level: 'all' }` 即可。

它允许您将数据任意排序，但不允许拖拽具有子父关系的数据。

### expand-all

<DataParameter t="Boolean" d="true" />

是否展开所有数据，默认为展开。如果设置为 `false`，则只会渲染首层数据。

<!-- @include: ./demo/root-demo/expand-false.md -->

**请注意**，当且仅当属性 [`show-expand`](#show-expand) 为真时，该属性才会生效，否则所有数据一定会被全部展开渲染。

### format-gantt-header <Badge text="新增v2.1.12+" type="tip" />

<DataParameter t="String" d="undefined" />

在某些情况下，您可能需要自定义甘特图的表头内容，这时您可以使用该属性。它接收一个字符串，用于自定义表头内容。

这个字符串应该是 `dayjs` 的格式化字符串，例如：`YYYY-MM-DD`，`YYYY-MM-DD HH:mm:ss` 等，包括高级格式化均可使用。详细请看 [dayjs](https://day.js.org/docs/zh-CN/display/format) 文档。

### header-height

<DataParameter t="Number | String" d="80" />

设置表头的高度，它的范围应该至少大于 `30`，否则会引起渲染异常。

::: tip 说明

由于表头使用了动态计算，最终展示高度可能不会按照参数预期高度展示。它会取 `可能的最小值` 与 `给定参数值` 的最大值作为最终展示值。

:::

### header-style

<DataParameter t="Object" d="{}" />

用于配置甘特表头的样式。它接收固定参数，用于改变其中的样式。

::: warning 请注意
`Object` 中的键应当区分大小写，这与 html 的参数方式不太一样。
:::

#### - bgColor

<DataParameter t="String" d="" />

设置表头的背景颜色，默认使用 [primary-color](#primary-color)。如果给该属性赋值，则使用该属性颜色，若要重置，将该属性置为 `""` 即可。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### - textColor

<DataParameter t="String" d="black" />

设置表头的文本颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

### highlight-date <Badge text="新增" type="warning" />

<DataParameter t="Boolean" d="false" />

是否在悬停当前行时，高亮显示当前日期，默认为 `false`。

### holidays <Badge text="新增" type="tip" />

<DataParameter t="Array" d="[]" />

允许用户自定义渲染特定假期。

它接收一个数组，每一个数组都可以单独设置日期、颜色，用户可以根据自己的需求单独配置不同的日期。

`TypeScript` 类型：

```ts
Array<{
  date: (Date | number | string) | (Date | number | string)[];
  color?: string
}>
```

### gantt-column-size

<DataParameter t="'normal' | 'small' | 'large' | object" d="'normal'" />

设置甘特图中每一列的列宽，支持 `小`、`中`、`大` 三种样式。默认为 `中`。

`v2.1.4+` 增加自定义宽度。允许传递一个对象，分别对每一个单位的列宽进行单独设置（如果没有对应的值，则使用 `normal` 的值）。

```html
<x-gantt
  :gantt-column-size="{
    hour?: number;
    day?: number;
    week?: number;
    month?: number;
  }"
/>
```

### level-color

<DataParameter t="Array" d="[]" />

设置每一层级数据的颜色，默认随背景颜色。

这是一个有意思的设置。因为数据可以是树形结构，所以为了更好的区分树形数据内容，您可以为不同层级的数据内容增加不同颜色。

在渲染时，对应层级的数据会在该数组中查找对应的背景颜色，如果存在，那么就会渲染，否则渲染普通背景颜色。

::: tip 提示
例如，您的数据有 3 层，那么您可以传入一个长度为 3 的数组，内容是文本颜色，它接收任意颜色参数，包括符合 html 规范的所有颜色，包括 16 进制颜色等。

当然，您也可以只传入长度为 1 的数组，那么甘特表只会渲染顶层层级数据的背景颜色，其他层级继续使用默认背景色。
:::

### locale <Badge text="新增" type="tip" />

<DataParameter t="String" d="en" />

设置显示语言。主要为表头内容。

支持所有 `dayjs` 语言包。具体参看 [多语言](./common.html#多语言)。

### primary-color

<DataParameter t="String" d="#ECA710" />

设置组件的主色调。它会用于表头背景、滑块默认颜色，以及按钮等主色位置。

### row-height

<DataParameter t="Number | String" d="30" />

设置内容区域的行高。默认值为 `30`， 最小值 `20`，最大值 `70`。应当确保给定的数字再这个区间范围，否则会引起渲染错误。

### show-checkbox

<DataParameter t="Boolean" d="false" />

设置是否显示复选框，这个对于多选很有用。当复选框可用时，点击会抛出 [`row-checked`](#row-checked) 事件。

### show-expand

<DataParameter t="Boolean" d="true" />

设置是否显示展开数据按钮。默认为 `true`，如果给出 `false`，那么展开按钮不可用，同时所有数据会全部展开，同时 [`expand-all`](#expand-all) 属性会失效。

::: tip 建议
通常情况下，您不用设置这两个属性，因为它们已经处于使用的状态。除非您不希望展开功能，设置 `show-expand` 为 `false` 即可。
:::

### ~~show-setting-btn~~ <Badge text="移除" type="warning" />

<DataParameter t="Boolean" d="true" />

~~设置是否显示右上角的设置栏按钮。默认为 `true`。~~

~~如果关闭该选项，同时提供了对应的设置方法，可以供使用者通过调用对应方法进行设置，这给样式的自定义提供了一种便利。~~

### show-today

<DataParameter t="Boolean" d="true" />

设置是否显示甘特图中的 `今日` 时间线。

### show-weekend

<DataParameter t="Boolean" d="true" />

设置是否显示甘特图中的 `周末` 时间线。

### slider-into-view <Badge text="新增" type="tip" />

<DataParameter t="Boolean" d="false" />

该属性将允许在点击行时，将当前行的甘特区域的 slider 滑块滑动到可视区域内（如果该行数据有日期属性）。

### unit <Badge text="新增" type="tip" />

<DataParameter t="'month' | 'week' | 'day' | 'hour'" d="day" />

设置甘特图的时间单位。默认为 `day`，即以天为单位。它接收 `month`、`week`、`day`、`hour` 四种单位。

::: tip 提示

该属性替代了之前的 `setHeaderUnit` 方法。

:::

## 事件

### add-link <Badge text="更新" type="tip" />

<DataParameter f="@add-link -> function(link: {from: string | number, to: string | number}, { from: any, to: any }, cb: ({from: string | number, to: string | number}) => void)" />

添加连线时触发事件。它接收三个参数，第一个参数是当前添加的连线，第二个参数是当前添加的连线对应的数据，第三个参数是一个回调函数，如果您需要修改当前添加的连线，可以在回调函数中调整新建的连线。回调函数会在创建之后、渲染之前执行。

例如：

```js{12}
const onAddLink = (
  link: any,
  data: { from: any; to: any },
  cb: (link: any) => void
) => {
  const _link = {
    index: linkId++,
    from: link.from,
    to: link.to,
    color: 'green'
  };
  ganttLinks.push(_link);

  cb(_link);
};
```

注意上面代码的第12行（高亮行），在处理之后，请将该连线对象添加到 `ganttLinks` 中，以完成渲染。这是因为数据的填写应当在组件外部完成，它可以由用户更好的控制。

### click-link <Badge text="更新" type="tip" />

<DataParameter f="@click-link -> function(link: any | null)" />

点击连线时触发事件。参数是当前点击的连线数据。如果没有选择，会返回 null。

### no-date-error

<DataParameter f="@no-today-error -> function(date: Date)" />

`跳转到` 事件触发后，如果给出的日期不在当前甘特范围内，则触发该异常，可以接收该异常并自定义后续事件。

### ~~move-progress~~ <Badge text="移除" type="warning" />

<DataParameter f="@move-progress -> function(data: any, old: number)" />

~~移动指定甘特行中的进度条触发事件。会返回当前行的数据以及原进度数值。~~

### move-slider <Badge text="更新" type="tip" />

~~<DataParameter f="@move-slider -> function(data: any[], {start: Date, end: Date})" />~~
<DataParameter f="@move-slider -> function({row: any, old: {start: Date, end: Date}}[])" />

数组的第一项是当前选择拖动的内容，如果启用了子父级联动（[linked-resize](./slider.html#linked-resize)），则当子父级有变化时，会一同抛出，方便保存到数据库。

- row: 更新后的数据内容
- ~~{start: Date, end: Date}: 当前拖动项的旧的起止日期。~~

每一条数据都会单独保存它移动前的旧日期，方便后续操作。

移动甘特行滑块后的事件。

### row-checked

<DataParameter f="@row-checked -> function(state: Boolean, data: any, list: any[])" />

- state: 选中状态，true | false
- data: 选中的数据内容，Object
- list: 当前事件中所影响到的数据集合，Array

选择复选框时触发该事件。

### row-click

<DataParameter f="@row-click -> function(data: any)" />

- data: 行数据内容，Object | undefined

单击行元素时触发的事件。

::: tip
当您选择了一行内容，并且在外部更新了数据，使得该条数据被删除，则会触发一个选择 `undefined` 的事件。

这样做的好处是您不必担心在外部再次调用该无效内容。
:::

### row-dbl-click

<DataParameter f="@dbl-click -> function(data: any)" />

- data: 行数据内容，Object

双击行元素时触发的事件。

## 方法

### jumpToDate

<DataParameter f="jumpToDate: (date?: Date) => void" />

新增一个跳转日期方法，可以替换之前的跳转到今日，同时提供跳转到任意日期。

默认不传参或者非日期参数，则跳转到今日。

### setSelected

<DataParameter f="setSelected: (data: any) => void" />

允许向组件设置选择项，它会渲染该项内容为已选择状态。

::: tip
参数 `data` 应该是数据列表中的某一个元素。
:::

### ~~setHeaderUnit~~ <Badge text="移除" type="warning" />

~~<DataParameter f="setSelected: (data: 'day' | 'week' | 'month') => void" />~~

~~允许使用者切换甘特表头的显示方式。只接收被允许的值，如果给错误值，则默认显示为 `day`。~~

现在通过 [`unit`](#unit) 属性来设置表头显示方式。

## 插槽

根组件不支持插入默认内容，它仅仅支持如下的具名插槽或者我们提供的子组件。

### ~~settings~~ <Badge text="已移除" type="warning" />

该插槽已移除

### 列组件

参见 [列组件](./column.html)

### 滑块组件

参见 [滑块组件](./slider.html)

---

接下来，您将深入学习使用这两个组件。
