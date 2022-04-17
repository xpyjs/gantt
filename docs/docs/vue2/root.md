# 根组件 XGantt

<Description author="jeremyjone" date="2020-12-02" copyright="jeremyjone" />

对于 `XGantt` 组件，它具有非常丰富的属性。

## 数据

### data

<DataParameter t="Array" d="[]" />

数据源，接收数组类型，同时数组中的每一个对象都应当包含 `index`, `startDate`, `endDate` 和 `children` 这些键，确保正确显示数据内容。

::: tip 提示

- `index` 确保数据的唯一性，它应对于所有数据全局唯一的
- `children` 可以使数据层级嵌套，如果没有子集，只需要置空即可
- `startDate` 可以在甘特图中正确渲染数据的起始日期
- `endDate` 可以在甘特图中正确渲染数据的截止日期
  :::

::: warning 数据的更新和限制
由于Vue的限制，`Array` 类型和 `Object` 类型不会自动监听到子层级，这导致当您修改子级内容时不会更新视图。

- 您可以使用 `vm.$set()` 的方式。
- **推荐**：我们建议您可以直接修改子集内容时，在最后重新给 `data` 赋值即可。

即：

```js
// 添加数据
this.data[0].children.push(somedata);

// 最后重新赋值，以确保数据更新
this.data = [...this.data];
```

这样的方式适用于所有针对层级数据的**增、删、改**，同时您并不需要担心所有数据都会重新渲染。在 XGantt 内部，我们会检查数据的变动，确保只更新有更改的内容。

当然，如果是修改顶层内容时，可以直接修改而不需要重新赋值，不用担心会出现上面的情况。
:::

### data-index* <Badge text="required" type="danger"/>

<DataParameter r t="String" />

数据的全局唯一键，它应当是数据中的某一个键名，通常它会是 `index`。如果它不是全局唯一的，则会引起渲染错误。

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

#### bgColor

<DataParameter t="String" d="white" />

设置整体内容区域的背景颜色，默认为白色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### borderColor

<DataParameter t="String" d="lightgrey" />

设置整体内容区域内部的边框颜色，它只负责例如表格中间的边框、甘特区域的每日分割线等边框颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### hoverColor <Badge type="tip" text="+v0.0.7" vertical="top" />

<DataParameter t="String" d="#ccc" />

设置悬停行颜色。接收一个HEX颜色值，英文无效。

#### selectColor <Badge type="tip" text="+v0.0.7" vertical="top" />

<DataParameter t="String" d="#123456" />

设置悬停行颜色。接收一个HEX颜色值，英文无效。

#### textColor

<DataParameter t="String" d="black" />

设置整体内容区域的文本颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### todayColor

<DataParameter t="String" d="lightblue" />

设置 `今日` 时间线的背景颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### weekendColor

<DataParameter t="String" d="lightgrey" />

设置 `周末` 时间线的背景颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

### border

<DataParameter t="Number" d="1" />

是否显示甘特表整体的边框，默认为 1，0 为不显示。

### dark <Badge type="tip" text="+v0.0.15" vertical="top" />

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

#### bgColor

<DataParameter t="String" d="grey" />

设置表头的背景颜色，默认为灰色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### borderColor

<DataParameter t="String" d="black" />

设置表头的边框颜色，包括中间的分割线。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

#### textColor

<DataParameter t="String" d="black" />

设置表头的文本颜色。

它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（**注意 `#` 符号不可缺少**），或者 `rgb()` 样式的内容，它只要是字符串格式即可。

### gantt-column-width

<DataParameter t="Number | String" d="15" />

设置甘特图中每一列日期的列宽，默认为 `15`，最小值 `15`，最大值 `100`，应当确保给定的数字在这个区间范围，否则会引起渲染错误。

### level-color

<DataParameter t="Array" d="[]" />

设置每一层级数据的颜色，默认随背景颜色。

这是一个有意思的设置。因为数据可以是树形结构，所以为了更好的区分树形数据内容，您可以为不同层级的数据内容增加不同颜色。

在渲染时，对应层级的数据会在该数组中查找对应的背景颜色，如果存在，那么就会渲染，否则渲染普通背景颜色。

::: tip 提示
例如，您的数据有 3 层，那么您可以传入一个长度为 3 的数组，内容是文本颜色，它接收任意颜色参数，包括符合 html 规范的所有颜色，包括 16 进制颜色等。

当然，您也可以只传入长度为 1 的数组，那么甘特表只会渲染顶层层级数据的背景颜色。
:::

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

### show-today

<DataParameter t="Boolean" d="true" />

设置是否显示甘特图中的 `今日` 时间线。

### show-weekend

<DataParameter t="Boolean" d="true" />

设置是否显示甘特图中的 `周末` 时间线。

## 事件

### no-today-error

<DataParameter f="@no-today-error -> function()" />

点击 `跳转到今日` 按钮时，`今日` 不在当前甘特范围内所触发的异常，可以接收该异常并自定义后续事件。

### move-slider

<DataParameter f="@move-slider -> function(data)" />

- data: 更新后的数据内容，Object

移动甘特行滑块后的事件。

### row-checked

<DataParameter f="@row-checked -> function(state, data)" />

- state: 选中状态，true | false
- data: 选中的数据内容，Object

选择复选框时触发的事件。

### row-click

<DataParameter f="@row-click -> function(data)" />

- data: 行数据内容，Object | null

单击行元素时触发的事件。

::: tip
当您选择了一行内容，并且在外部更新了数据，使得该条数据被删除，则会触发一个选择 `null` 的事件。

这样做的好处是您不必担心在外部再次调用该无效内容。
:::

### row-dbl-click

<DataParameter f="@dbl-click -> function(data)" />

- data: 行数据内容，Object

双击行元素时触发的事件。

## 方法

### setSelected <Badge type="tip" text="+v0.0.16" vertical="top" />

<DataParameter f="setSelected: (data: any) => void" />

允许向组件设置选择项，它会渲染该项内容为已选择状态。

::: tip
参数 `data` 应该是数据列表中的某一个元素。
:::

## 插槽

根组件不支持插入默认内容，它仅仅支持如下的具名插槽或者我们提供的子组件。

### settings <Badge type="tip" text="+v0.0.15" vertical="top" />

*我不知道这个插槽是否真正需要，但还是把它添加了。*

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
