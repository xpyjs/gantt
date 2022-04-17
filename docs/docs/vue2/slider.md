# 滑块组件 XGanttSlider

<Description author="jeremyjone" date="2020-11-05" copyright="jeremyjone" />

因为我们在内部已经将其加载，所以您并不需要显示的再次导入到您的组件中就可以使用。

滑块组件将允许您自定义甘特图中每一行的滑块内容。

::: warning 请注意
在使用之前，您需要注意，甘特图内部只接收一个滑块组件。也就是说，无论您在组件任何位置插入了滑块组件，其内部都只会渲染最后插入的那个滑块组件。

注意，是最后插入的那个。
:::

## 基础使用

您只需要简单的将其插入到根组件内即可。

基于入门的示例，您现在应该拥有一个列，那么您可以继续这样使用：

```html{5}
<x-gantt
    data-index="index"
    :data="dataList" />
    <x-gantt-column label="index" />
    <x-gantt-slider bg-color="orange" />
</x-gantt>
```

为了与原始内容进行区分，我在属性中添加了背景颜色，请注意，它并不是必须的。

它将显示成如下内容：

<img :src="$withBase('/assets/slider-basic.png')" alt="slider-basic">

## 属性

### alignment

<DataParameter t="String" d="left" />

设置内容对齐方式。接收字符串：`left`、`center` 或 `right`。

### bg-color

<DataParameter t="String" d="lightgreen" />

设置滑块组件的背景颜色。

在基础示例中，已经使用了该属性，可以看到滑块的整体背景色都产生了变化。

### date-format

<DataParameter t="String" d="yyyy-MM-dd" />

自定义显示日期的格式。如果滑块内需要显示日期，可以通过该属性来格式化日期。

::: warning 请注意
值得注意的是，如果给出该字段，那么其数据的起始日期和结束日期都将按照该格式进行格式化后再被展示。
:::

更多关于日期格式化的属性，参看 [日期格式化属性](./common.html#日期格式化属性)

### empty-data

<DataParameter t="String" d="无数据 😢" />

设置空数据时显示的内容。如果数据内容为空，则会显示空数据内容。

### flat

<DataParameter t="Boolean" d="false" />

设置滑块样式是否扁平化。

### label

<DataParameter t="String" />

设置需要显示的内容字段。默认没有该属性情况下显示默认数据，即 `empty-data` 字段内容。

如果您提供了插槽内容，则无论您是否提供了 `label` 属性，都将用插槽的内容进行替换。更多信息请查看 [插槽](#插槽) 。

### linked-resize

<DataParameter t="Boolean" d="false" />

设置滑块组件移动时，其父、子数据内容是否跟随改变。当启用该属性后，无论您使用 [`move`](#move) 、 [`resize-left`](#resize-left) 还是 [`resize-right`](#resize-right) ，都将遵循 `联动规则`。

**联动规则**：确保子级数据不会超越父级数据的时间范围，同时父级数据不会小于子级数据的时间范围。

::: warning 注意
在数据量很大的情况下，启用该属性可能会消耗大量资源。
:::

### move

<DataParameter t="Boolean" d="false" />

设置滑块组件是否可以被拖动，默认不可用。

如果设置了 `true`，则意味着滑块可以被任意拖动。当拖动结束时，会抛出 [`move-slider`](./root.html#move-slider) 事件。

### resize-left

<DataParameter t="Boolean" d="false" />

设置滑块组件左侧是否可以被拉伸，默认不可用。

该属性单独设置左侧是否可以被拖动，这意味着滑块可以单独修改起始时间。当拖动结束时，会抛出 [`move-slider`](./root.html#move-slider) 事件。

### resize-right

<DataParameter t="Boolean" d="false" />

设置滑块组件右侧是否可以被拉伸，默认不可用。

该属性单独设置右侧是否可以被拖动，这意味着滑块可以单独修改起始时间。当拖动结束时，会抛出 [`move-slider`](./root.html#move-slider) 事件。

## 插槽

### default

滑块组件内部允许您插入任何内容，它将向滑块内注入您提供的所有模板内容。同时它会抛出当前行的数据以供您使用。

一个简单的示例：

```html
<x-gantt-slider flat bg-color="orange" :move="true" :linked-resize="true">
  <template v-slot="data">
    <div>{{ data.name }}</div>
  </template>
</x-gantt-slider>
```

::: tip 提示
`default` 插槽会包含一定样式，如果您想尝试完全替换现有的滑块内容，那么下面的内容将会更适合。
:::

### content <Badge type="tip" text="+v0.0.13" vertical="top" />

有时候，您可能需要重新定义滑块样式，那么这个插槽一定适合您。它会使用您提供的插槽元素来替换默认的滑块元素，而不是向默认滑块内部插入内容。

一个简单的示例：

```html
<XGanttSlider flat label="startDate" bg-color="orange">
  <template v-slot:content="data">
    <div
      style="background-color: #123456;display: flex;justify-content: center;height:5px"
    >
      {{ data.name }} - {{ data.index }}
    </div>
  </template>
</XGanttSlider>
```

### left <Badge type="tip" text="+v0.0.13" vertical="top" />

当您重新定义了滑块的样式，那么侧边的滑动块一定也不符合现有的需求，所以我们提供了重载左右滑动块的插槽。通常情况下，它与 `content` 应该配套使用。

一个简单的示例：

```html
<XGanttSlider
  flat
  label="startDate"
  bg-color="orange"
  :move="true"
  :resize-left="true"
  :resize-right="true"
  :linked-resize="true"
>
  <template v-slot:content="data">
    <div
      style="background-color: #123456;display: flex;justify-content: center;height:5px"
    >
      {{ data.name }} - {{ data.index }}
    </div>
  </template>

  <template v-slot:left>
    <div style="background-color:#123456;width:5px;height:10px" />
  </template>

  <template v-slot:right>
    <div style="background-color:#123456;width:5px;height:10px" />
  </template>
</XGanttSlider>
```

### right <Badge type="tip" text="+v0.0.13" vertical="top" />

它的功能与 `left` 插槽一致，仅仅是将 `left` 更换为 `right` 即可，参数与功能完全一致，不再赘述。

上述示例的效果如下：

<img :src="$withBase('/assets/slider-content.png')" alt="slider-content">

恭喜您，您现在已经可以完全自定义属于您的甘特图组件了。
