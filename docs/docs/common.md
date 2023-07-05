# 通用方法

## 日期格式化属性

格式化对接了 `dayjs`，详看 [dayjs](https://dayjs.gitee.io/docs/zh-CN/display/format)。

### 多语言

<!-- 使用 `dayjs` 的多语言功能，需要在 `main.js` 中引入 `dayjs/locale/zh-cn`，并设置为全局属性。

```js
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
```

之后，所有的日期格式化都会使用中文。 -->

**更新版本 `v2.1.1`**

现在通过 `locale` 参数可以设置多语言。

支持的语言列表：

```js
am
ar-dz
ar-iq
ar-kw
ar-ly
ar-ma
ar-sa
ar-tn
ar
az
be
bg
bi
bm
bn-bd
bn
bo
br
bs
ca
cs
cv
cy
da
de-at
de-ch
de
dv
el
en-au
en-ca
en-gb
en-ie
en-il
en-in
en-nz
en-sg
en-tt
en
eo
es-do
es
et
eu
fa
fi
fo
fr-ca
fr-ch
fr
fy
ga
gd
gl
gom-latn
gu
he
hi
hr
ht
hu
hy-am
id
is
it-ch
it
ja
jv
ka
kk
km
kn
ko
ku
ky
lb
lo
lt
lv
me
mi
mk
ml
mn
mr
ms-my
ms
mt
my
nb
ne
nl-be
nl
nn
oc-lnc
pa-in
pl
pt-br
pt
rn
ro
ru
rw
sd
se
si
sk
sl
sq
sr-cyrl
sr
ss
sv-fi
sv
sw
ta
te
tet
tg
th
tk
tl-ph
tlh
tr
tzl
tzm-latn
tzm
ug-cn
uk
ur
uz-latn
uz
vi
x-pseudo
yo
zh-cn
zh-hk
zh-tw
zh
es-mx
es-pr
es-us
```
