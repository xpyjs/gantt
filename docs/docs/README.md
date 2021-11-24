# 入门

<Description author="jeremyjone" version="1.1.4" date="2021-11-15" copyright="jeremyjone" />

通过入门的章节内容，可以快速了解、引入并使用 JzGantt。

::: tip 提示
这是 vue3 版本的 Gantt 组件，如果需要使用 vue2 版本，请移步 [这里](./v0/)
:::

::: tip 演示
现已提供演示页面，如需要，请移步 [演示页面](https://docs.xiaopangying.com/gantt-demo/)。
:::

## 什么是 JzGantt

`JzGantt` 是一个基于 `vue` 的甘特图表插件，它包含常用的甘特图功能，如：

- 根据日期自动生成甘特图
- 支持多层扩展
- 高性能
- 多层联动
- 支持自定义表内容
- 支持自定义甘特内容
- 支持自定义表头
- 动态更新数据
- 定制任意风格
- 支持黑暗模式
- 支持多种日期显示模式切换
- 更多持续更新

_动图展示_：

<img :src="$withBase('/assets/gantt_v1.gif')" alt="gif">

## 安装

使用 `npm` 安装：

<CodeGroup>
  <CodeGroupItem title="YARN">

```bash:no-line-numbers
yarn add jz-gantt
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM" active>

```bash:no-line-numbers
npm install jz-gantt --save
```

  </CodeGroupItem>
</CodeGroup>

## 引入

JzGantt 会被整体引入，引入的 Gantt 就是 JzGantt 的根组件。同时需要单独引入样式表，方式如下：

```js
import Gantt from 'jz-gantt';
import 'jz-gantt/dist/index.css';

createApp(App).use(Gantt).mount('#app');
```

## 使用

JzGantt 需要一个数组形式的数据对象。例如，您拥有如下数据：

```js
const dataList = reactive([
  {
    index: 1,
    startDate: '2020-06-05',
    endDate: '2020-08-20',
    ttt: {
      a: 'aaa',
      b: 'bbb'
    },
    name: 'mydata1',
    children: []
  },
  {
    index: 2,
    startDate: '2020-07-07',
    endDate: '2020-09-11',
    ttt: {},
    name: 'mydata2',
    children: [
      {
        index: 3,
        startDate: '2020-07-10',
        endDate: '2020-08-15',
        ttt: {
          a: 'aaa'
        },
        name: 'child1',
        children: []
      }
    ]
  }
]);
```

那么只需要在 `html` 中简单的使用 JzGantt，即可创建一个甘特内容：

```html{2}
<j-gantt
  data-index="index" <!-- 请确保它存在 -->
  :data="dataList"
/>
```

如上操作之后，您将看到：

<img :src="$withBase('/assets/basic.png')" alt="basic">

如果没有，请尝试重新操作。

如果它正常显示，请继续深入学习其他属性，以便更好的适应您的页面。

## 支持 TypeScript

JGantt 有完整的 TypeScript 类型声明文件。

::: tip 更新
与 v0 版本不同，该版本所有类型都添加了一个 `Component` 后缀以示区别。
:::

如果您需要，只需要在使用中通过：

```js
import {
  JGanttComponent,
  JGanttColumnComponent,
  JGanttSliderComponent
} from 'jz-gantt';
```

按需导入使用即可。如：

<img :src="$withBase('/assets/v1_type.png')" alt="type">

## 更新日志

::: tip
您可以跳过此内容以继续深入学习具体配置 JGantt。
:::

### v1.1.5

**修复问题：**

- 修复重复底边 border
- 修复列块样式

### v1.1.4

**修复问题：**

- 修复 `JGanttColumn` 重复加载的问题。

### v1.1.3

**修复问题：**

- 修复触发 [move-slider](./root.html#move-slider) 后数据抛出不完整的错误。

### v1.1.2

**修复问题：**

- 修复切换视图时甘特表不重置导致过长的问题。
- 修复今日线的位移问题。
- 修复时间线（今日线和周末线等）在甘特条之上的问题。

### v1.1.1

**新增：**

- 新增设置按钮的显示控制（[show-setting-btn](./root.html#show-setting-btn)），同时外置了设置内容方法（[setHeaderUnit](./root.html#setheaderunit)）。

### v1.1.0

**新增：**

- 甘特视图的日期显示切换功能。现在可以按日、周、月进行切换甘特视图

**调整：**

- 删除了甘特视图的列宽属性（[gantt-column-width](./root.html#gantt-column-width)）。取而代之的是三种固定列宽，可以在选项面板中选择，也可以通过 [gantt-column-size](./root.html#gantt-column-size) 属性自定义，分别是 `小`、`中`、`大`，默认为 `中`。
- 略调了表头样式。

### v1.0.0-rc2

- 更新类型接口

### v1.0.0-rc1

- 在 v0 版本的基础上适配 vue3。此次更新主要为了适配 vue3，没有太大的变化，所有断层更新内容列在下面。
- 删除了 `跳转到今天` 的按钮，改为抛出一个跳转方法 `jumpToDate(date?: Date)`，可以跳转到任意日期，默认为今天。
- 统一边框颜色。现在不再区分表头与表体的边框颜色。在根元素上有一个全新的属性 `borderColor`，接收一个颜色字符串。同时删除 `bodyStyle` 与 `headerStyle` 对象中的 `borderColor` 属性。
- 在根元素上新增一个 `primary-color` 属性，用于修改全局的主色，包括表头、按钮，以及其他用于主色地方。
- 更新滑块 `JGanttSlider` 上的 `move` 属性，从 `Boolean` 类型修改为 `[Function, Boolean]`。可以通过数据直接判断哪些内容可以滑动，同时所有 `resize` 连接属性将首先判断 `move` 是否可用。
- 滑块的所有插槽属性，同时抛出数据和层级，方便使用。
- 修改 `no-today-error` 事件名为 `no-date-error`，同时抛出异常日期参数。
- 修正了之前一些样式问题。
