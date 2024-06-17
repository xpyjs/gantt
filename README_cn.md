# XGantt

![](./src/assets/logo.png)

[![OSCS Status](https://www.oscs1024.com/platform/badge/xpyjs/gantt.svg?size=small)](https://www.oscs1024.com/project/xpyjs/gantt?ref=badge_small) ![](https://shields.io/github/v/release/xpyjs/gantt?display_name=tag) ![](https://img.shields.io/npm/v/@xpyjs/gantt.svg) ![](https://shields.io/github/v/release/xpyjs/gantt?display_name=tag&include_prereleases&label=lastest) ![](https://badgen.net/npm/dt/@xpyjs/gantt) ![](https://img.shields.io/npm/l/@xpyjs/gantt.svg) ![](https://img.shields.io/github/actions/workflow/status/xpyjs/gantt/release.yml?branch=master) ![](https://img.shields.io/github/actions/workflow/status/xpyjs/gantt/gh-pages.yml?branch=master&label=document) ![](https://img.shields.io/github/stars/xpyjs/gantt.svg?style=social) ![](https://shields.io/github/forks/xpyjs/gantt?label=Fork&style=social)

[[English](./README.md)] [[中文](./README_cn.md)]

基于vue3的一个简单的甘特组件。

- vue2 版本请移步 [这里](https://github.com/xpyjs/gantt-vue2)

## 关于版本

`v1` 和 `v2` 不兼容。

- 参数不同
- 插槽不同
- 组件不同

更多细节请参见 [文档](https://docs.xiaopangying.com/gantt/)

## 十分重要

这个库是 `jz-gantt` 的 vue3 版本的继承库。如果您之前已经使用了 `jz-gantt`，则需要仔细阅读如下内容。

**说明：**

> 这个库的 `1.0.1` 相当于 `jz-gantt@1.3.1`。并且 `jz-gantt` 不再维护。

### 如何迁移

1. 包名不同， `@xpyjs/gantt` 替换了 `jz-gantt`。
2. 所有以 `j-` 或 `J` 的前缀全都更新为 `x-` 或 `X`。

除此之外，无需其他改动。

## 截图

![截图](./public/screenshots/gantt.gif)

## 什么是 XGantt

- [x] 根据日期自动生成甘特图
- [x] 支持多层扩展
- [x] 高性能
- [x] 多层联动
- [x] 多级选取
- [x] 支持自定义表内容
- [x] 支持自定义甘特内容
- [x] 支持自定义表头
- [x] 动态更新数据
- [x] 定制任意风格
- [x] 支持黑暗模式
- [x] 支持多种日期显示模式切换
- [ ] 更多持续更新

## 文档

要查看源码，参见 [Github](http://github.com/xpyjs/gantt)

有关更详细的文档，参见 [document web](https://docs.xiaopangying.com/gantt/)

要看示例，参见 [example web](https://docs.xiaopangying.com/gantt-demo/)

如果遇到任何问题，请提 [issue](https://github.com/xpyjs/gantt/issues).

## 如何使用

### 安装

```bash
npm install @xpyjs/gantt --save
// or
yarn add @xpyjs/gantt  // 推荐
```

### 使用

```js
import Gantt from "@xpyjs/gantt";
import "@xpyjs/gantt/index.css";

createApp(App).use(Gantt).mount("#app");
```

### 基本用法

`Data` 应该是 `Array<any>` 类型，`index`，`startDate`，`endDate`和`children` 应该在 `Data item` 中，它们有助于正确显示数据。当然，每一个字段都可以自定义。

> V2 中的 `children` 不再是必须的。
> V2 中的 `index` 默认改为 `id`。

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
    children: [] // children 是必须的，如果没有，给一个空数组即可
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
        children: [] // children 是必须的，如果没有，给一个空数组即可
      }
    ]
  }
];
```

<details>
<summary>v1 版本</summary>

```html
<x-gantt data-index="index" :data="dataList" />
```

</details>
<details>
<summary>v2 版本</summary>

```html
<x-gantt data-id="index" :data="dataList" />
```

</details>

### 使用列插槽组件

我们提供了一个名为 `XGanttColumn` 的插槽。 `Label` 是必需的，它的值应当对应 `data` 中的字段名（支持深度查询），这会告诉组件渲染那一列内容。

<details>
<summary>v1 版本</summary>

```html
<x-gantt data-index="index" :data="dataList">
  <x-gantt-column label="name" />
</x-gantt>
```

</details>
<details>
<summary>v2 版本</summary>

```html
<x-gantt data-id="index" :data="dataList">
  <x-gantt-column prop="name" />
</x-gantt>
```

</details>

### 使用滑块插槽组件

我们提供一个名为 `XGanttSlider` 的插槽。如果传入多个滑块，有且只有最后一个滑块将被渲染。

<details>
<summary>v1 版本</summary>

```html
<x-gantt data-index="index" :data="dataList">
  <x-gantt-slider />   <!-- no render -->
  <x-gantt-slider />   <!-- will be rendered -->
</x-gantt>
```

</details>
<details>
<summary>v2 版本</summary>

```html
<x-gantt data-id="index" :data="dataList">
  <x-gantt-slider />   <!-- no render -->
  <x-gantt-slider />   <!-- will be rendered -->
</x-gantt>
```

</details>

## 许可证

[MIT](./LICENSE)
