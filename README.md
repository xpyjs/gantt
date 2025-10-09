# XGantt

![](./src/assets/logo.png)

[![OSCS Status](https://www.oscs1024.com/platform/badge/xpyjs/gantt.svg?size=small)](https://www.oscs1024.com/project/xpyjs/gantt?ref=badge_small) ![](https://shields.io/github/v/release/xpyjs/gantt?display_name=tag) ![](https://img.shields.io/npm/v/@xpyjs/gantt.svg) ![](https://shields.io/github/v/release/xpyjs/gantt?display_name=tag&include_prereleases&label=lastest) ![](https://badgen.net/npm/dt/@xpyjs/gantt) ![](https://img.shields.io/npm/l/@xpyjs/gantt.svg) ![](https://img.shields.io/github/actions/workflow/status/xpyjs/gantt/release.yml?branch=master) ![](https://img.shields.io/github/actions/workflow/status/xpyjs/gantt/gh-pages.yml?branch=master&label=document) ![](https://img.shields.io/github/stars/xpyjs/gantt.svg?style=social) ![](https://shields.io/github/forks/xpyjs/gantt?label=Fork&style=social)

[[English](./README.md)] [[中文](./README_cn.md)]

A high-performance vue gantt component for vue3.

- vue2 version is [HERE](https://github.com/xpyjs/gantt-vue2)

## About Version

`v1` and `v2` are not compatible.

- props not same
- slots not same
- components not same

More details see [document](https://docs.xiaopangying.com/gantt/docs)

## Important

This repo is pervious `jz-gantt`. Only vue3 version. If you have used `jz-gantt` before, you should read the following section carefully.

**Specification:**

> This version `1.0.1` is correspond to `jz-gantt@1.3.1`. And `jz-gantt` is archived.

### How to migrate

1. package name changesd `@xpyjs/gantt` replaced `jz-gantt`.
2. All `j-` or `J` prefixes update to `x-` or `X`.

Beyond that, no other action is required.

## Snipaste

![Snipaste](./public/screenshots/gantt.gif)

## What is XGantt

- [x] Automatically generate gantt charts based on dates
- [x] Support for multi-layer expanding
- [x] High-performance
- [x] Multi-layer linkage
- [x] Multistage selected
- [x] Custom table column content
- [x] Custom gantt row content
- [x] Custom header content
- [x] Dynamic update data
- [x] Custom any style
- [x] Support dark model
- [x] Multiple date display modes switch
- [ ] More

## Document

For resource code, see [Github](http://github.com/xpyjs/gantt)

For more detailed documentation, see [document web](https://docs.xiaopangying.com/gantt/docs/)

For example, see [Example web](https://docs.xiaopangying.com/gantt/demo/)

If you has any problem, please [issue](https://github.com/xpyjs/gantt/issues).

## How to use

### install

```bash
npm install @xpyjs/gantt --save

// or
yarn add @xpyjs/gantt
```

### use

```js
import XGantt from "@xpyjs/gantt";
import "@xpyjs/gantt/index.css";

createApp(App).use(XGantt).mount('#app')
```

### Basic use

Data should be Array type, `index`, `startDate`, `endDate` and `children` are supposed in data item, they help to display the data correctly. Each field can be customized.

> `children` in V2 is no longer required.
> V2 `index` to `id` default.

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
        children: [] // children is required. If no child, empty array is ok.
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
                children: [] // children is required. If no child, empty array is ok.
            }
        ]
    }
];
```

<details>
<summary>version 1</summary>

```html
<x-gantt data-index="index" :data="dataList" />
```

</details>
<details>
<summary>version 2</summary>

```html
<x-gantt data-id="index" :data="dataList" />
```

</details>

### Use table column

We provide a slot named `XGanttColumn`. `Label` is required, and it should match data key.

label is required, and it should match data key. label's value should correspond to the name of the field in 'data' (deep query support), which tells the component to render the column.

<details>
<summary>version 1</summary>

```html
<x-gantt data-index="index" :data="dataList">
  <x-gantt-column label="name" />
</x-gantt>
```

</details>
<details>
<summary>version 2</summary>

```html
<x-gantt data-id="index" :data="dataList">
  <x-gantt-column prop="name" />
</x-gantt>
```

</details>

### Use gantt slider

We provide a slot named `XGanttSlider`.

Only one slider whill be rendered. If you insert more than one slider, only last slider will be display.

<details>
<summary>version 1</summary>

```html
<x-gantt data-index="index" :data="dataList">
  <x-gantt-slider />   <!-- no render -->
  <x-gantt-slider />   <!-- will be rendered -->
</x-gantt>
```

</details>
<details>
<summary>version 2</summary>

```html
<x-gantt data-id="index" :data="dataList">
  <x-gantt-slider />   <!-- no render -->
  <x-gantt-slider />   <!-- will be rendered -->
</x-gantt>
```

## License

[MIT](./LICENSE)

