# JzGantt

![](./src/assets/logo.png)

![](https://shields.io/github/v/release/jeremyjone/jz-gantt?display_name=tag&include_prereleases&label=version) ![](https://img.shields.io/npm/v/jz-gantt.svg) ![](https://badgen.net/npm/dt/jz-gantt) ![](https://img.shields.io/npm/l/jz-gantt.svg) ![](https://shields.io/github/workflow/status/jeremyjone/jz-gantt/%E5%8F%91%E5%B8%83%20Release%20%E5%8C%85) ![](https://shields.io/github/workflow/status/jeremyjone/jz-gantt/%E9%83%A8%E7%BD%B2%E6%96%87%E6%A1%A3%E5%92%8C%20Demo?label=gh-pages) ![](https://img.shields.io/github/stars/jeremyjone/jz-gantt.svg?style=social) ![](https://shields.io/github/forks/jeremyjone/jz-gantt?label=Fork&style=social)

[[English](./README.md)] [[中文](./README_cn.md)]

A high-performance vue gantt component, support vue2 & vue3.
![vue 3.x](https://img.shields.io/badge/vue-3.x-43B984) ![animate.css](https://img.shields.io/badge/animate.css-4.x-9E84E2)

## Snipaste

![Snipaste](./public/screenshots/gantt.gif)

## What is JzGantt

- [x] Automatically generate gantt charts based on dates
- [x] Support for multi-layer expanding
- [x] High-performance
- [x] Multi-layer linkage
- [x] Custom table column content
- [x] Custom gantt row content
- [x] Custom header content
- [x] Dynamic update data
- [x] Custom any style
- [x] Support dark model
- [x] Multiple date display modes switch
- [ ] More

## Document

For resource code, see [Github](http://github.com/jeremyjone/jz-gantt)

For more detailed documentation, see [document web](https://docs.xiaopangying.com/gantt/)

For example, see [Example web](https://docs.xiaopangying.com/gantt-demo/)

## How to use

### install

```bash
npm install jz-gantt --save
// or
yarn add jz-gantt  // recommend
```

### use

```js
import Gantt from "jz-gantt";
import "jz-gantt/dist/index.css";

createApp(App).use(Gantt).mount('#app')
```

### Basic use

Data should be Array type, `index`, `startDate`, `endDate` and `children` are supposed in data item, they help to display the data correctly. Each field can be customized.

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

```html
<j-gantt
    data-index="index"
    :data="dataList"
/>
```

### Use table column

We provide a slot named `JGanttColumn`. `Label` is required, and it should match data key.

```html
<j-gantt
    data-index="index"
    :data="dataList"
>
    <j-gantt-column label="name" />
</j-gantt>
```

### Use gantt slider

We provide a slot named `JGanttSlider`.

Only one slider whill be rendered. If you insert more than one slider, only last slider will be display.

```html
<j-gantt
    data-index="index"
    :data="dataList"
>
    <j-gantt-slider />  <!-- no render -->
    <j-gantt-slider />  <!-- will be rendered -->
</j-gantt>
```

## License

[MIT](./LICENSE)
