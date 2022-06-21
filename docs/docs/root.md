# 根组件 XGantt

<Description author="jeremyjone" date="2021-12-10" copyright="jeremyjone" />

对于 `XGantt` 组件，它具有非常丰富的属性。

## 数据

### data

<DataParameter t="Array" d="[]" />

数据源，接收数组类型，同时数组中的每一个对象都应当包含 `index`, `startDate`, `endDate` 和 `children` 这些键，确保正确显示数据内容。

另外，这些键名不是固定样式的，它可以通过传递参数进行替换，它们的作用不变。

::: tip 提示

- `index` 确保数据的唯一性，它应对于所有数据全局唯一的。通过 [data-index](#data-index) 替换
- `children` 可以使数据层级嵌套，如果没有子集，只需要置空即可
- `startDate` 可以在甘特图中正确渲染数据的起始日期。通过 [start-key](#start-key) 替换
- `endDate` 可以在甘特图中正确渲染数据的截止日期。通过 [end-key](#end-key) 替换

:::

### data-index\* <Badge text="required" type="danger"/>

<DataParameter r t="String" />

数据的全局唯一键，它应当是数据中的某一个键名，通常它会是 `index`、`id`、`uid` 等。如果它不是全局唯一的，则会引起渲染错误。

::: tip 提示
这也是我们建议在 `data` 中确保有一个 `index` 字段的具体作用。您也可以使用其他自定义字段，只需要匹配即可。
:::

### end-key

<DataParameter t="String" d="endDate" />

它对应数据中起始日期的键，默认值为 `endDate`。如果找不到，则不会渲染甘特图中的内容。

### expand-all

<DataParameter t="Boolean" d="true" />

是否展开所有数据，默认为展开。如果设置为 `false`，则只会渲染首层数据。

**请注意**，当且仅当属性 [`show-expand`](#show-expand) 为真时，该属性才会生效，否则所有数据一定会被全部展开渲染。

### start-key

<DataParameter t="String" d="startDate" />

它对应数据中起始日期的键，默认值为 `startDate`。如果找不到，则不会渲染甘特图中的内容。

## 样式

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

### borderColor

<DataParameter t="String" d="#E5E5E5" />

设置整个组件的边框颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

### dark

<DataParameter t="Boolean" d="false" />

黑暗模式，它会修改页面的背景颜色、文字颜色和边框颜色。

::: warning 请注意
它是默认属性，只会调整默认值。如果您设置了自定义的样式，该方案则不会生效。
:::

### header-height

<DataParameter t="Number | String" d="100" />

设置表头的高度，它的范围应该至少大于 `30`，否则会引起渲染异常。

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

### gantt-column-size

<DataParameter t="normal | small | large" d="normal" />

设置甘特图中每一列的列宽，支持 `小`、`中`、`大` 三种样式。默认为 `中`。

### level-color

<DataParameter t="Array" d="[]" />

设置每一层级数据的颜色，默认随背景颜色。

这是一个有意思的设置。因为数据可以是树形结构，所以为了更好的区分树形数据内容，您可以为不同层级的数据内容增加不同颜色。

在渲染时，对应层级的数据会在该数组中查找对应的背景颜色，如果存在，那么就会渲染，否则渲染普通背景颜色。

::: tip 提示
例如，您的数据有 3 层，那么您可以传入一个长度为 3 的数组，内容是文本颜色，它接收任意颜色参数，包括符合 html 规范的所有颜色，包括 16 进制颜色等。

当然，您也可以只传入长度为 1 的数组，那么甘特表只会渲染顶层层级数据的背景颜色，其他层级继续使用默认背景色。
:::

### primary-color

<DataParameter t="String" d="#ECA710" />

设置组件的主色调。它会用于表头背景、滑块默认颜色，以及按钮等主色位置。

### row-height

<DataParameter t="Number | String" d="30" />

设置内容区域的行高。默认值为 `30`， 最小值 `20`，最大值 70`。应当确保给定的数字再这个区间范围，否则会引起渲染错误。

### show-checkbox

<DataParameter t="Boolean" d="false" />

设置是否显示复选框，这个对于多选很有用。当复选框可用时，点击会抛出 [`row-checked`](#row-checked) 事件。

### show-expand

<DataParameter t="Boolean" d="true" />

设置是否显示展开数据按钮。默认为 `true`，如果给出 `false`，那么展开按钮不可用，同时所有数据会全部展开，同时 [`expand-all`](#expand-all) 属性会失效。

::: tip 建议
通常情况下，您不用设置这两个属性，因为它们已经处于使用的状态。除非您不希望展开功能，设置 `show-expand` 为 `false` 即可。
:::

### show-setting-btn

<DataParameter t="Boolean" d="true" />

设置是否显示右上角的设置栏按钮。默认为 `true`。

如果关闭该选项，同时提供了对应的设置方法，可以供使用者通过调用对应方法进行设置，这给样式的自定义提供了一种便利。

::: tip 提示
设置栏中提供的内容可以进行如下替换：

- 列宽：可以通过修改 [gantt-column-size](#gantt-column-size) 属性
- 行高：可以通过修改 [row-height](#row-height) 属性
- 显示方式：可以通过调用 [setHeaderUnit](#setHeaderUnit) 方法
  :::

### show-today

<DataParameter t="Boolean" d="true" />

设置是否显示甘特图中的 `今日` 时间线。

### show-weekend

<DataParameter t="Boolean" d="true" />

设置是否显示甘特图中的 `周末` 时间线。

## 事件

### no-date-error

<DataParameter f="@no-today-error -> function(date: Date)" />

`跳转到` 事件触发后，如果给出的日期不在当前甘特范围内，则触发该异常，可以接收该异常并自定义后续事件。

### move-progress

<DataParameter f="@move-progress -> function(data: any, old: number)" />

移动指定甘特行中的进度条触发事件。会返回当前行的数据以及原进度数值。

### move-slider

<DataParameter f="@move-slider -> function(data: any[], {start: Date, end: Date})" />

- data: 更新后的数据内容数组，Array\<Object\>。它的第一项是当前选择拖动的内容，如果启用了子父级联动（[linked-resize](./slider.html#linked-resize)），则当子父级有变化时，会一同抛出，方便保存到数据库。
- {start: Date, end: Date}: 当前拖动项的旧的起止日期。

移动甘特行滑块后的事件。

### row-checked

<DataParameter f="@row-checked -> function(state: Boolean, data: any, list: any[])" />

- state: 选中状态，true | false
- data: 选中的数据内容，Object
- list: 当前事件中所影响到的数据集合，Array

选择复选框时触发该事件。

::: tip v1.3.0 更新内容

现在复选框支持右键深度选取。左键选取当前项，右键选取当前项以及所有子项。

`list` 参数的使用：

> 该参数返回此次点击事件中所影响的数据，默认第一项永远是当前项，所以在左键单击时，其值只有一项，且与 `data` 一致；而右键单击时，其值中至少包含一项并在 0 号位，且与 `data` 一致。
>
> 无论 **选中** 还是 **取消选中**，都会返回影响集合。用户可以通过 `state` 并结合该参数自行处理结果集。

:::

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

### setHeaderUnit

<DataParameter f="setSelected: (data: 'day' | 'week' | 'month') => void" />

允许使用者切换甘特表头的显示方式。只接收被允许的值，如果给错误值，则默认显示为 `day`。

## 插槽

根组件不支持插入默认内容，它仅仅支持如下的具名插槽或者我们提供的子组件。

### settings

_我不知道这个插槽是否真正需要，但还是把它添加了。_

这个插槽会允许您在设置抽屉中添加任意内容。

使用方式：

```html
<template v-slot:settings>
  <div>
    <!-- any element -->
  </div>
</template>
```

### 列组件

参见 [列组件](./column.html)

### 滑块组件

参见 [滑块组件](./slider.html)

---

接下来，您将深入学习使用这两个组件。
