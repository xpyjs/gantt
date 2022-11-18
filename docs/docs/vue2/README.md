# 入门

<Description author="jeremyjone" version="1.0.3" date="2022-06-22" copyright="jeremyjone" />

![](https://img.shields.io/npm/v/@xpyjs/gantt-vue2.svg)

通过入门的章节内容，可以快速了解、引入并使用 XGantt。

## vue2 使用问题，使用前阅读，特别重要

********************************

`vue2.6.x` 与 `vue2.7.x` 版本不兼容，本项目使用 `vue2.6.14` 开发，请勿在 `vue2.7.x` 下使用。

同时，由于 npm 升级机制原因，请修改依赖版本为固定：

```json
"vue": "2.6.14",
"vue-template-compiler": "2.6.14"
```

以上，能够解决初始化报错问题，详见 [ISSUE](https://github.com/xpyjs/gantt-vue2/issues/5)

********************************

## 十分重要

这个库是 `jz-gantt` 的 vue2 版本的继承库。如果您之前已经使用了 `jz-gantt`，则需要仔细阅读如下内容。

**说明：**

> - `jz-gantt` vue2 版本（v0.0.17）已经被弃用。
> - 本项目完全重写。基于 `vue3` 代码，支持内容到 `1.3.1`，但不再更新内容，只做基本维护。如需更新内容，请使用 vue3 版本，或者自行更新。
> - 另外，如果您 fork 并提交了代码，我检测后会合并到主分支，并更新版本内容。

### 如何迁移

1. 包名不同， `@xpyjs/gantt-vue2` 替换了 `jz-gantt`。
2. 所有以 `j-` 或 `J` 的前缀全都更新为 `x-` 或 `X`。

除此之外，无需其他改动。

## 什么是 XGantt

`XGantt` 是一个基于 `vue` 的甘特图表插件，它包含常用的甘特图功能，如：

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

*动图展示*：

<img :src="$withBase('/assets/gantt_v1.gif')" alt="gif">

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

## 引入

XGantt 会被整体引入，同时需要单独引入样式表，方式如下：

```js
import Vue from "vue";
import XGantt from "@xpyjs/gantt-vue2";
import '@xpyjs/gantt-vue2/lib/index.css';

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

那么只需要在 `html` 中简单的使用 XGantt，即可创建一个甘特内容：

```html{2}
<x-gantt
  data-index="index" <!-- 请确保它存在 -->
  :data="dataList">
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
