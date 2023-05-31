# 通用方法

## 日期格式化属性

格式化对接了 `dayjs`，详看 [dayjs](https://dayjs.gitee.io/docs/zh-CN/display/format)。

### 多语言

使用 `dayjs` 的多语言功能，需要在 `main.js` 中引入 `dayjs/locale/zh-cn`，并设置为全局属性。

```js
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
```

之后，所有的日期格式化都会使用中文。
