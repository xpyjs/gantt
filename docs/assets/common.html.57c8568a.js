import{_ as i,r as a,o as l,c as d,b as n,d as s,a as r,f as v,e as c}from"./app.45202c97.js";const o={},m=n("h1",{id:"通用方法",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#通用方法","aria-hidden":"true"},"#"),s(" 通用方法")],-1),t=n("h2",{id:"日期格式化属性",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#日期格式化属性","aria-hidden":"true"},"#"),s(" 日期格式化属性")],-1),u=n("code",null,"dayjs",-1),b={href:"https://dayjs.gitee.io/docs/zh-CN/display/format",target:"_blank",rel:"noopener noreferrer"},p=n("h3",{id:"多语言",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#多语言","aria-hidden":"true"},"#"),s(" 多语言")],-1),k=c(`<p><strong>更新版本 <code>v2.1.1</code></strong></p><p>现在通过 <code>locale</code> 参数可以设置多语言。</p><p>支持的语言列表：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>am
ar<span class="token operator">-</span>dz
ar<span class="token operator">-</span>iq
ar<span class="token operator">-</span>kw
ar<span class="token operator">-</span>ly
ar<span class="token operator">-</span>ma
ar<span class="token operator">-</span>sa
ar<span class="token operator">-</span>tn
ar
az
be
bg
bi
bm
bn<span class="token operator">-</span>bd
bn
bo
br
bs
ca
cs
cv
cy
da
de<span class="token operator">-</span>at
de<span class="token operator">-</span>ch
de
dv
el
en<span class="token operator">-</span>au
en<span class="token operator">-</span>ca
en<span class="token operator">-</span>gb
en<span class="token operator">-</span>ie
en<span class="token operator">-</span>il
en<span class="token operator">-</span><span class="token keyword">in</span>
en<span class="token operator">-</span>nz
en<span class="token operator">-</span>sg
en<span class="token operator">-</span>tt
en
eo
es<span class="token operator">-</span><span class="token keyword">do</span>
es
et
eu
fa
fi
fo
fr<span class="token operator">-</span>ca
fr<span class="token operator">-</span>ch
fr
fy
ga
gd
gl
gom<span class="token operator">-</span>latn
gu
he
hi
hr
ht
hu
hy<span class="token operator">-</span>am
id
is
it<span class="token operator">-</span>ch
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
ms<span class="token operator">-</span>my
ms
mt
my
nb
ne
nl<span class="token operator">-</span>be
nl
nn
oc<span class="token operator">-</span>lnc
pa<span class="token operator">-</span><span class="token keyword">in</span>
pl
pt<span class="token operator">-</span>br
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
sr<span class="token operator">-</span>cyrl
sr
ss
sv<span class="token operator">-</span>fi
sv
sw
ta
te
tet
tg
th
tk
tl<span class="token operator">-</span>ph
tlh
tr
tzl
tzm<span class="token operator">-</span>latn
tzm
ug<span class="token operator">-</span>cn
uk
ur
uz<span class="token operator">-</span>latn
uz
vi
x<span class="token operator">-</span>pseudo
yo
zh<span class="token operator">-</span>cn
zh<span class="token operator">-</span>hk
zh<span class="token operator">-</span>tw
zh
es<span class="token operator">-</span>mx
es<span class="token operator">-</span>pr
es<span class="token operator">-</span>us
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4);function h(_,f){const e=a("ExternalLinkIcon");return l(),d("div",null,[m,t,n("p",null,[s("格式化对接了 "),u,s("，详看 "),n("a",b,[s("dayjs"),r(e)]),s("。")]),p,v(" 使用 `dayjs` 的多语言功能，需要在 `main.js` 中引入 `dayjs/locale/zh-cn`，并设置为全局属性。\n\n```js\nimport dayjs from 'dayjs'\nimport 'dayjs/locale/zh-cn'\n\ndayjs.locale('zh-cn')\n```\n\n之后，所有的日期格式化都会使用中文。 "),k])}const g=i(o,[["render",h],["__file","common.html.vue"]]);export{g as default};
