# 入门

<Description author="jeremyjone" version="1.0.0" date="2022-04-18" copyright="jeremyjone" />

通过入门的章节内容，可以快速了解、引入并使用 XGantt。

## 什么是 XGantt

`XGantt` 是一个基于 `vue` 的甘特图表插件，它包含常用的甘特图功能，如：

- 树形数据结构展示，支持动态增减
- 展开、收起子项
- 自定义左侧表格的列内容
- 自定义左侧表格的合并项
- 自定义右侧甘特条的内容
- 任意拖动甘特条以修改时间
- 完整的响应事件
- 快速查找 `今天`
- 显示周末

*动图展示*：

<img :src="$withBase('/assets/gantt_v0.gif')" alt="gif">

## 安装

使用 `npm` 安装：

<CodeGroup>
  <CodeGroupItem title="YARN" active>

```bash:no-line-numbers
yarn add @xpyjs/gantt-vue2
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install @xpyjs/gantt-vue2 --save
```

  </CodeGroupItem>
</CodeGroup>

::: tip 提示
当前内容完全继承自 `jz-gantt`。
:::

## 引入

XGantt 会被整体引入，同时需要单独引入样式表，方式如下：

```js
import Vue from "vue";
import XGantt from "@xpyjs/gantt-vue2";
import "@xpyjs/gantt-vue2/lib/gantt-vue2.css";

Vue.use(XGantt);
```

## 使用

XGantt 需要一个数组形式的数据对象。例如，您拥有如下数据：

```js
const dataList = [
  {
    index: 1,
    startDate: "2020-06-05",
    endDate: "2020-08-20",
    ttt: {
      a: "aaa",
      b: "bbb"
    },
    name: "mydata1",
    children: []
  },
  {
    index: 2,
    startDate: "2020-07-07",
    endDate: "2020-09-11",
    ttt: {},
    name: "mydata2",
    children: [
      {
        index: 3,
        startDate: "2020-07-10",
        endDate: "2020-08-15",
        ttt: {
          a: "aaa"
        },
        name: "child1",
        children: []
      }
    ]
  }
];
```

那么只需要在 `html` 中简单的使用 XGantt，即可创建一个甘特内容：

```html{2}
<x-gantt data-index="index" <!-- 请确保它存在 -->
  :data="dataList" />
</x-gantt>
```

如上操作之后，您将看到：

<img :src="$withBase('/assets/basic.png')" alt="basic">

如果没有，请尝试重新操作。

如果它正常显示，请继续深入学习其他属性，以便更好的适应您的页面。

## 支持 TypeScript

XGantt 已经有了完整的 TypeScript 类型声明文件，如果您需要，只需要在使用中通过：

```js
import { XGantt, XGanttColumn, XGanttSlider } from "@xpyjs/gantt-vue2";
```

按需导入即可。

## 更新日志

::: tip
您可以跳过此内容以继续深入学习具体配置 XGantt。
:::

### Release 1.0.0

- 更新包名
- 更新组件名

### Release 0.0.17

- 调整滑块移动的接口，现在它抛出了原数据。

### Release 0.0.16

- 添加了一个方法 `setSelected`，用于设置一条选中的项。
- 修正了一些样式问题。

### Release 0.0.15

- 添加了一个 `settings` 的具名插槽，可以向设置抽屉插入自定义内容。
- 添加了一个 `dark` 属性，适配黑暗模式。
- 调整了表头的格式。
