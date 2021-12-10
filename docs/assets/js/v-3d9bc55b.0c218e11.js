"use strict";(self.webpackChunkgantt_doc=self.webpackChunkgantt_doc||[]).push([[141],{6308:(e,a,l)=>{l.r(a),l.d(a,{data:()=>n});const n={key:"v-3d9bc55b",path:"/v0/root.html",title:"根组件 JGantt",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"数据",slug:"数据",children:[{level:3,title:"data",slug:"data",children:[]},{level:3,title:"data-index*",slug:"data-index",children:[]},{level:3,title:"end-key",slug:"end-key",children:[]},{level:3,title:"expand-all",slug:"expand-all",children:[]},{level:3,title:"start-key",slug:"start-key",children:[]}]},{level:2,title:"样式",slug:"样式",children:[{level:3,title:"body-style",slug:"body-style",children:[]},{level:3,title:"border",slug:"border",children:[]},{level:3,title:"dark",slug:"dark",children:[]},{level:3,title:"header-height",slug:"header-height",children:[]},{level:3,title:"header-style",slug:"header-style",children:[]},{level:3,title:"gantt-column-width",slug:"gantt-column-width",children:[]},{level:3,title:"level-color",slug:"level-color",children:[]},{level:3,title:"row-height",slug:"row-height",children:[]},{level:3,title:"show-checkbox",slug:"show-checkbox",children:[]},{level:3,title:"show-expand",slug:"show-expand",children:[]},{level:3,title:"show-today",slug:"show-today",children:[]},{level:3,title:"show-weekend",slug:"show-weekend",children:[]}]},{level:2,title:"事件",slug:"事件",children:[{level:3,title:"no-today-error",slug:"no-today-error",children:[]},{level:3,title:"move-slider",slug:"move-slider",children:[]},{level:3,title:"row-checked",slug:"row-checked",children:[]},{level:3,title:"row-click",slug:"row-click",children:[]},{level:3,title:"row-dbl-click",slug:"row-dbl-click",children:[]}]},{level:2,title:"方法",slug:"方法",children:[{level:3,title:"setSelected",slug:"setselected",children:[]}]},{level:2,title:"插槽",slug:"插槽",children:[{level:3,title:"settings",slug:"settings",children:[]},{level:3,title:"列组件",slug:"列组件",children:[]},{level:3,title:"滑块组件",slug:"滑块组件",children:[]}]}],filePathRelative:"v0/root.md",git:{updatedTime:1639146548e3,contributors:[{name:"Jeremy Jone",email:"37676231+jeremyjone@users.noreply.github.com",commits:1}]}}},2876:(e,a,l)=>{l.r(a),l.d(a,{default:()=>sa});var n=l(6252);const t=(0,n._)("h1",{id:"根组件-jgantt",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#根组件-jgantt","aria-hidden":"true"},"#"),(0,n.Uk)(" 根组件 JGantt")],-1),d=(0,n._)("p",null,[(0,n.Uk)("对于 "),(0,n._)("code",null,"JGantt"),(0,n.Uk)(" 组件，它具有非常丰富的属性。")],-1),r=(0,n._)("h2",{id:"数据",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#数据","aria-hidden":"true"},"#"),(0,n.Uk)(" 数据")],-1),s=(0,n._)("h3",{id:"data",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#data","aria-hidden":"true"},"#"),(0,n.Uk)(" data")],-1),o=(0,n.uE)('<p>数据源，接收数组类型，同时数组中的每一个对象都应当包含 <code>index</code>, <code>startDate</code>, <code>endDate</code> 和 <code>children</code> 这些键，确保正确显示数据内容。</p><div class="custom-container tip"><p class="custom-container-title">提示</p><ul><li><code>index</code> 确保数据的唯一性，它应对于所有数据全局唯一的</li><li><code>children</code> 可以使数据层级嵌套，如果没有子集，只需要置空即可</li><li><code>startDate</code> 可以在甘特图中正确渲染数据的起始日期</li><li><code>endDate</code> 可以在甘特图中正确渲染数据的截止日期</li></ul></div><div class="custom-container warning"><p class="custom-container-title">数据的更新和限制</p><p>由于Vue的限制，<code>Array</code> 类型和 <code>Object</code> 类型不会自动监听到子层级，这导致当您修改子级内容时不会更新视图。</p><ul><li>您可以使用 <code>vm.$set()</code> 的方式。</li><li><strong>推荐</strong>：我们建议您可以直接修改子集内容时，在最后重新给 <code>data</code> 赋值即可。</li></ul><p>即：</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// 添加数据</span>\n<span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>children<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>somedata<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 最后重新赋值，以确保数据更新</span>\n<span class="token keyword">this</span><span class="token punctuation">.</span>data <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">]</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>这样的方式适用于所有针对层级数据的<strong>增、删、改</strong>，同时您并不需要担心所有数据都会重新渲染。在 JGantt 内部，我们会检查数据的变动，确保只更新有更改的内容。</p><p>当然，如果是修改顶层内容时，可以直接修改而不需要重新赋值，不用担心会出现上面的情况。</p></div>',3),c={id:"data-index",tabindex:"-1"},i=(0,n._)("a",{class:"header-anchor",href:"#data-index","aria-hidden":"true"},"#",-1),h=(0,n.Uk)(" data-index* "),u=(0,n.uE)('<p>数据的全局唯一键，它应当是数据中的某一个键名，通常它会是 <code>index</code>。如果它不是全局唯一的，则会引起渲染错误。</p><div class="custom-container tip"><p class="custom-container-title">提示</p><p>这也是我们建议在 <code>data</code> 中确保有一个 <code>index</code> 字段的具体作用。您也可以使用其他自定义字段，只需要匹配即可。</p></div><h3 id="end-key" tabindex="-1"><a class="header-anchor" href="#end-key" aria-hidden="true">#</a> end-key</h3>',3),p=(0,n._)("p",null,[(0,n.Uk)("它对应数据中起始日期的键，默认值为 "),(0,n._)("code",null,"endDate"),(0,n.Uk)("。如果找不到，则不会渲染甘特图中的内容。")],-1),k=(0,n._)("h3",{id:"expand-all",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#expand-all","aria-hidden":"true"},"#"),(0,n.Uk)(" expand-all")],-1),_=(0,n._)("p",null,[(0,n.Uk)("是否展开所有数据，默认为展开。如果设置为 "),(0,n._)("code",null,"false"),(0,n.Uk)("，则只会渲染首层数据。")],-1),m=(0,n._)("p",null,[(0,n._)("strong",null,"请注意"),(0,n.Uk)("，当且仅当属性 "),(0,n._)("a",{href:"#show-expand"},[(0,n._)("code",null,"show-expand")]),(0,n.Uk)(" 为真时，该属性才会生效，否则所有数据一定会被全部展开渲染。")],-1),g=(0,n._)("h3",{id:"start-key",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#start-key","aria-hidden":"true"},"#"),(0,n.Uk)(" start-key")],-1),b=(0,n._)("p",null,[(0,n.Uk)("它对应数据中起始日期的键，默认值为 "),(0,n._)("code",null,"startDate"),(0,n.Uk)("。如果找不到，则不会渲染甘特图中的内容。")],-1),U=(0,n._)("h2",{id:"样式",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#样式","aria-hidden":"true"},"#"),(0,n.Uk)(" 样式")],-1),v=(0,n._)("h3",{id:"body-style",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#body-style","aria-hidden":"true"},"#"),(0,n.Uk)(" body-style")],-1),x=(0,n._)("p",null,"用于配置甘特图内容区域的样式。它接收固定参数，用于改变其中的样式。",-1),f=(0,n._)("div",{class:"custom-container warning"},[(0,n._)("p",{class:"custom-container-title"},"请注意"),(0,n._)("p",null,[(0,n._)("code",null,"Object"),(0,n.Uk)(" 中的键应当区分大小写，这与 html 的参数方式不太一样。")])],-1),w=(0,n._)("h4",{id:"bgcolor",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#bgcolor","aria-hidden":"true"},"#"),(0,n.Uk)(" bgColor")],-1),y=(0,n._)("p",null,"设置整体内容区域的背景颜色，默认为白色。",-1),W=(0,n._)("p",null,[(0,n.Uk)("它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（"),(0,n._)("strong",null,[(0,n.Uk)("注意 "),(0,n._)("code",null,"#"),(0,n.Uk)(" 符号不可缺少")]),(0,n.Uk)("），或者 "),(0,n._)("code",null,"rgb()"),(0,n.Uk)(" 样式的内容，它只要是字符串格式即可。")],-1),j=(0,n._)("h4",{id:"bordercolor",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#bordercolor","aria-hidden":"true"},"#"),(0,n.Uk)(" borderColor")],-1),S=(0,n._)("p",null,"设置整体内容区域内部的边框颜色，它只负责例如表格中间的边框、甘特区域的每日分割线等边框颜色。",-1),C=(0,n._)("p",null,[(0,n.Uk)("它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（"),(0,n._)("strong",null,[(0,n.Uk)("注意 "),(0,n._)("code",null,"#"),(0,n.Uk)(" 符号不可缺少")]),(0,n.Uk)("），或者 "),(0,n._)("code",null,"rgb()"),(0,n.Uk)(" 样式的内容，它只要是字符串格式即可。")],-1),D={id:"hovercolor",tabindex:"-1"},O=(0,n._)("a",{class:"header-anchor",href:"#hovercolor","aria-hidden":"true"},"#",-1),E=(0,n.Uk)(" hoverColor "),B=(0,n._)("p",null,"设置悬停行颜色。接收一个HEX颜色值，英文无效。",-1),J={id:"selectcolor",tabindex:"-1"},N=(0,n._)("a",{class:"header-anchor",href:"#selectcolor","aria-hidden":"true"},"#",-1),G=(0,n.Uk)(" selectColor "),P=(0,n._)("p",null,"设置悬停行颜色。接收一个HEX颜色值，英文无效。",-1),A=(0,n._)("h4",{id:"textcolor",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#textcolor","aria-hidden":"true"},"#"),(0,n.Uk)(" textColor")],-1),H=(0,n._)("p",null,"设置整体内容区域的文本颜色。",-1),T=(0,n._)("p",null,[(0,n.Uk)("它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（"),(0,n._)("strong",null,[(0,n.Uk)("注意 "),(0,n._)("code",null,"#"),(0,n.Uk)(" 符号不可缺少")]),(0,n.Uk)("），或者 "),(0,n._)("code",null,"rgb()"),(0,n.Uk)(" 样式的内容，它只要是字符串格式即可。")],-1),I=(0,n._)("h4",{id:"todaycolor",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#todaycolor","aria-hidden":"true"},"#"),(0,n.Uk)(" todayColor")],-1),R=(0,n.uE)('<p>设置 <code>今日</code> 时间线的背景颜色。</p><p>它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（<strong>注意 <code>#</code> 符号不可缺少</strong>），或者 <code>rgb()</code> 样式的内容，它只要是字符串格式即可。</p><h4 id="weekendcolor" tabindex="-1"><a class="header-anchor" href="#weekendcolor" aria-hidden="true">#</a> weekendColor</h4>',3),X=(0,n.uE)('<p>设置 <code>周末</code> 时间线的背景颜色。</p><p>它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（<strong>注意 <code>#</code> 符号不可缺少</strong>），或者 <code>rgb()</code> 样式的内容，它只要是字符串格式即可。</p><h3 id="border" tabindex="-1"><a class="header-anchor" href="#border" aria-hidden="true">#</a> border</h3>',3),Z=(0,n._)("p",null,"是否显示甘特表整体的边框，默认为 1，0 为不显示。",-1),q={id:"dark",tabindex:"-1"},z=(0,n._)("a",{class:"header-anchor",href:"#dark","aria-hidden":"true"},"#",-1),L=(0,n.Uk)(" dark "),V=(0,n._)("p",null,"黑暗模式，它会修改页面的背景颜色、文字颜色和边框颜色。",-1),Y=(0,n._)("div",{class:"custom-container warning"},[(0,n._)("p",{class:"custom-container-title"},"请注意"),(0,n._)("p",null,"它是默认属性，只会调整默认值。如果您设置了自定义的样式，该方案则不会生效。")],-1),$=(0,n._)("h3",{id:"header-height",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#header-height","aria-hidden":"true"},"#"),(0,n.Uk)(" header-height")],-1),F=(0,n._)("p",null,[(0,n.Uk)("设置表头的高度，它的范围应该至少大于 "),(0,n._)("code",null,"30"),(0,n.Uk)("，否则会引起渲染异常。")],-1),K=(0,n._)("h3",{id:"header-style",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#header-style","aria-hidden":"true"},"#"),(0,n.Uk)(" header-style")],-1),M=(0,n._)("p",null,"用于配置甘特表头的样式。它接收固定参数，用于改变其中的样式。",-1),Q=(0,n._)("div",{class:"custom-container warning"},[(0,n._)("p",{class:"custom-container-title"},"请注意"),(0,n._)("p",null,[(0,n._)("code",null,"Object"),(0,n.Uk)(" 中的键应当区分大小写，这与 html 的参数方式不太一样。")])],-1),ee=(0,n._)("h4",{id:"bgcolor-1",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#bgcolor-1","aria-hidden":"true"},"#"),(0,n.Uk)(" bgColor")],-1),ae=(0,n._)("p",null,"设置表头的背景颜色，默认为灰色。",-1),le=(0,n._)("p",null,[(0,n.Uk)("它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（"),(0,n._)("strong",null,[(0,n.Uk)("注意 "),(0,n._)("code",null,"#"),(0,n.Uk)(" 符号不可缺少")]),(0,n.Uk)("），或者 "),(0,n._)("code",null,"rgb()"),(0,n.Uk)(" 样式的内容，它只要是字符串格式即可。")],-1),ne=(0,n._)("h4",{id:"bordercolor-1",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#bordercolor-1","aria-hidden":"true"},"#"),(0,n.Uk)(" borderColor")],-1),te=(0,n._)("p",null,"设置表头的边框颜色，包括中间的分割线。",-1),de=(0,n._)("p",null,[(0,n.Uk)("它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（"),(0,n._)("strong",null,[(0,n.Uk)("注意 "),(0,n._)("code",null,"#"),(0,n.Uk)(" 符号不可缺少")]),(0,n.Uk)("），或者 "),(0,n._)("code",null,"rgb()"),(0,n.Uk)(" 样式的内容，它只要是字符串格式即可。")],-1),re=(0,n._)("h4",{id:"textcolor-1",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#textcolor-1","aria-hidden":"true"},"#"),(0,n.Uk)(" textColor")],-1),se=(0,n._)("p",null,"设置表头的文本颜色。",-1),oe=(0,n._)("p",null,[(0,n.Uk)("它接收任意颜色参数，包括符合 html 规范的颜色英文，16 进制颜色描述（"),(0,n._)("strong",null,[(0,n.Uk)("注意 "),(0,n._)("code",null,"#"),(0,n.Uk)(" 符号不可缺少")]),(0,n.Uk)("），或者 "),(0,n._)("code",null,"rgb()"),(0,n.Uk)(" 样式的内容，它只要是字符串格式即可。")],-1),ce=(0,n._)("h3",{id:"gantt-column-width",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#gantt-column-width","aria-hidden":"true"},"#"),(0,n.Uk)(" gantt-column-width")],-1),ie=(0,n._)("p",null,[(0,n.Uk)("设置甘特图中每一列日期的列宽，默认为 "),(0,n._)("code",null,"15"),(0,n.Uk)("，最小值 "),(0,n._)("code",null,"15"),(0,n.Uk)("，最大值 "),(0,n._)("code",null,"100"),(0,n.Uk)("，应当确保给定的数字在这个区间范围，否则会引起渲染错误。")],-1),he=(0,n._)("h3",{id:"level-color",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#level-color","aria-hidden":"true"},"#"),(0,n.Uk)(" level-color")],-1),ue=(0,n._)("p",null,"设置每一层级数据的颜色，默认随背景颜色。",-1),pe=(0,n._)("p",null,"这是一个有意思的设置。因为数据可以是树形结构，所以为了更好的区分树形数据内容，您可以为不同层级的数据内容增加不同颜色。",-1),ke=(0,n._)("p",null,"在渲染时，对应层级的数据会在该数组中查找对应的背景颜色，如果存在，那么就会渲染，否则渲染普通背景颜色。",-1),_e=(0,n._)("div",{class:"custom-container tip"},[(0,n._)("p",{class:"custom-container-title"},"提示"),(0,n._)("p",null,"例如，您的数据有 3 层，那么您可以传入一个长度为 3 的数组，内容是文本颜色，它接收任意颜色参数，包括符合 html 规范的所有颜色，包括 16 进制颜色等。"),(0,n._)("p",null,"当然，您也可以只传入长度为 1 的数组，那么甘特表只会渲染顶层层级数据的背景颜色。")],-1),me=(0,n._)("h3",{id:"row-height",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#row-height","aria-hidden":"true"},"#"),(0,n.Uk)(" row-height")],-1),ge=(0,n._)("p",null,[(0,n.Uk)("设置内容区域的行高。默认值为 "),(0,n._)("code",null,"30"),(0,n.Uk)("， 最小值 "),(0,n._)("code",null,"20"),(0,n.Uk)("，最大值 70`。应当确保给定的数字再这个区间范围，否则会引起渲染错误。")],-1),be=(0,n._)("h3",{id:"show-checkbox",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#show-checkbox","aria-hidden":"true"},"#"),(0,n.Uk)(" show-checkbox")],-1),Ue=(0,n._)("p",null,[(0,n.Uk)("设置是否显示复选框，这个对于多选很有用。当复选框可用时，点击会抛出 "),(0,n._)("a",{href:"#row-checked"},[(0,n._)("code",null,"row-checked")]),(0,n.Uk)(" 事件。")],-1),ve=(0,n._)("h3",{id:"show-expand",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#show-expand","aria-hidden":"true"},"#"),(0,n.Uk)(" show-expand")],-1),xe=(0,n.uE)('<p>设置是否显示展开数据按钮。默认为 <code>true</code>，如果给出 <code>false</code>，那么展开按钮不可用，同时所有数据会全部展开，同时 <a href="#expand-all"><code>expand-all</code></a> 属性会失效。</p><div class="custom-container tip"><p class="custom-container-title">建议</p><p>通常情况下，您不用设置这两个属性，因为它们已经处于使用的状态。除非您不希望展开功能，设置 <code>show-expand</code> 为 <code>false</code> 即可。</p></div><h3 id="show-today" tabindex="-1"><a class="header-anchor" href="#show-today" aria-hidden="true">#</a> show-today</h3>',3),fe=(0,n._)("p",null,[(0,n.Uk)("设置是否显示甘特图中的 "),(0,n._)("code",null,"今日"),(0,n.Uk)(" 时间线。")],-1),we=(0,n._)("h3",{id:"show-weekend",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#show-weekend","aria-hidden":"true"},"#"),(0,n.Uk)(" show-weekend")],-1),ye=(0,n._)("p",null,[(0,n.Uk)("设置是否显示甘特图中的 "),(0,n._)("code",null,"周末"),(0,n.Uk)(" 时间线。")],-1),We=(0,n._)("h2",{id:"事件",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#事件","aria-hidden":"true"},"#"),(0,n.Uk)(" 事件")],-1),je=(0,n._)("h3",{id:"no-today-error",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#no-today-error","aria-hidden":"true"},"#"),(0,n.Uk)(" no-today-error")],-1),Se=(0,n._)("p",null,[(0,n.Uk)("点击 "),(0,n._)("code",null,"跳转到今日"),(0,n.Uk)(" 按钮时，"),(0,n._)("code",null,"今日"),(0,n.Uk)(" 不在当前甘特范围内所触发的异常，可以接收该异常并自定义后续事件。")],-1),Ce=(0,n._)("h3",{id:"move-slider",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#move-slider","aria-hidden":"true"},"#"),(0,n.Uk)(" move-slider")],-1),De=(0,n._)("ul",null,[(0,n._)("li",null,"data: 更新后的数据内容，Object")],-1),Oe=(0,n._)("p",null,"移动甘特行滑块后的事件。",-1),Ee=(0,n._)("h3",{id:"row-checked",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#row-checked","aria-hidden":"true"},"#"),(0,n.Uk)(" row-checked")],-1),Be=(0,n._)("ul",null,[(0,n._)("li",null,"state: 选中状态，true | false"),(0,n._)("li",null,"data: 选中的数据内容，Object")],-1),Je=(0,n._)("p",null,"选择复选框时触发的事件。",-1),Ne=(0,n._)("h3",{id:"row-click",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#row-click","aria-hidden":"true"},"#"),(0,n.Uk)(" row-click")],-1),Ge=(0,n._)("ul",null,[(0,n._)("li",null,"data: 行数据内容，Object | null")],-1),Pe=(0,n._)("p",null,"单击行元素时触发的事件。",-1),Ae=(0,n._)("div",{class:"custom-container tip"},[(0,n._)("p",{class:"custom-container-title"},"TIP"),(0,n._)("p",null,[(0,n.Uk)("当您选择了一行内容，并且在外部更新了数据，使得该条数据被删除，则会触发一个选择 "),(0,n._)("code",null,"null"),(0,n.Uk)(" 的事件。")]),(0,n._)("p",null,"这样做的好处是您不必担心在外部再次调用该无效内容。")],-1),He=(0,n._)("h3",{id:"row-dbl-click",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#row-dbl-click","aria-hidden":"true"},"#"),(0,n.Uk)(" row-dbl-click")],-1),Te=(0,n._)("ul",null,[(0,n._)("li",null,"data: 行数据内容，Object")],-1),Ie=(0,n._)("p",null,"双击行元素时触发的事件。",-1),Re=(0,n._)("h2",{id:"方法",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#方法","aria-hidden":"true"},"#"),(0,n.Uk)(" 方法")],-1),Xe={id:"setselected",tabindex:"-1"},Ze=(0,n._)("a",{class:"header-anchor",href:"#setselected","aria-hidden":"true"},"#",-1),qe=(0,n.Uk)(" setSelected "),ze=(0,n._)("p",null,"允许向组件设置选择项，它会渲染该项内容为已选择状态。",-1),Le=(0,n._)("div",{class:"custom-container tip"},[(0,n._)("p",{class:"custom-container-title"},"TIP"),(0,n._)("p",null,[(0,n.Uk)("参数 "),(0,n._)("code",null,"data"),(0,n.Uk)(" 应该是数据列表中的某一个元素。")])],-1),Ve=(0,n._)("h2",{id:"插槽",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#插槽","aria-hidden":"true"},"#"),(0,n.Uk)(" 插槽")],-1),Ye=(0,n._)("p",null,"根组件不支持插入默认内容，它仅仅支持如下的具名插槽或者我们提供的子组件。",-1),$e={id:"settings",tabindex:"-1"},Fe=(0,n._)("a",{class:"header-anchor",href:"#settings","aria-hidden":"true"},"#",-1),Ke=(0,n.Uk)(" settings "),Me=(0,n.uE)('<p><em>我不知道这个插槽是否真正需要，但还是把它添加了。</em></p><p>这个插槽会允许您在设置抽屉中添加任意内容。</p><p>使用方式：</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>settings</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>\n    <span class="token comment">&lt;!-- any element --&gt;</span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="列组件" tabindex="-1"><a class="header-anchor" href="#列组件" aria-hidden="true">#</a> 列组件</h3>',5),Qe=(0,n.Uk)("参见 "),ea=(0,n.Uk)("列组件"),aa=(0,n._)("h3",{id:"滑块组件",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#滑块组件","aria-hidden":"true"},"#"),(0,n.Uk)(" 滑块组件")],-1),la=(0,n.Uk)("参见 "),na=(0,n.Uk)("滑块组件"),ta=(0,n._)("hr",null,null,-1),da=(0,n._)("p",null,"接下来，您将深入学习使用这两个组件。",-1),ra={},sa=(0,l(3744).Z)(ra,[["render",function(e,a){const l=(0,n.up)("Description"),ra=(0,n.up)("DataParameter"),sa=(0,n.up)("Badge"),oa=(0,n.up)("RouterLink");return(0,n.wg)(),(0,n.iD)(n.HY,null,[t,(0,n.Wm)(l,{author:"jeremyjone",date:"2020-12-02",copyright:"jeremyjone"}),d,r,s,(0,n.Wm)(ra,{t:"Array",d:"[]"}),o,(0,n._)("h3",c,[i,h,(0,n.Wm)(sa,{text:"required",type:"danger"})]),(0,n.Wm)(ra,{r:"",t:"String"}),u,(0,n.Wm)(ra,{t:"String",d:"endDate"}),p,k,(0,n.Wm)(ra,{t:"Boolean",d:"true"}),_,m,g,(0,n.Wm)(ra,{t:"String",d:"startDate"}),b,U,v,(0,n.Wm)(ra,{t:"Object",d:"{}"}),x,f,w,(0,n.Wm)(ra,{t:"String",d:"white"}),y,W,j,(0,n.Wm)(ra,{t:"String",d:"lightgrey"}),S,C,(0,n._)("h4",D,[O,E,(0,n.Wm)(sa,{type:"tip",text:"+v0.0.7",vertical:"top"})]),(0,n.Wm)(ra,{t:"String",d:"#ccc"}),B,(0,n._)("h4",J,[N,G,(0,n.Wm)(sa,{type:"tip",text:"+v0.0.7",vertical:"top"})]),(0,n.Wm)(ra,{t:"String",d:"#123456"}),P,A,(0,n.Wm)(ra,{t:"String",d:"black"}),H,T,I,(0,n.Wm)(ra,{t:"String",d:"lightblue"}),R,(0,n.Wm)(ra,{t:"String",d:"lightgrey"}),X,(0,n.Wm)(ra,{t:"Number",d:"1"}),Z,(0,n._)("h3",q,[z,L,(0,n.Wm)(sa,{type:"tip",text:"+v0.0.15",vertical:"top"})]),(0,n.Wm)(ra,{t:"Boolean",d:"false"}),V,Y,$,(0,n.Wm)(ra,{t:"Number | String",d:"100"}),F,K,(0,n.Wm)(ra,{t:"Object",d:"{}"}),M,Q,ee,(0,n.Wm)(ra,{t:"String",d:"grey"}),ae,le,ne,(0,n.Wm)(ra,{t:"String",d:"black"}),te,de,re,(0,n.Wm)(ra,{t:"String",d:"black"}),se,oe,ce,(0,n.Wm)(ra,{t:"Number | String",d:"15"}),ie,he,(0,n.Wm)(ra,{t:"Array",d:"[]"}),ue,pe,ke,_e,me,(0,n.Wm)(ra,{t:"Number | String",d:"30"}),ge,be,(0,n.Wm)(ra,{t:"Boolean",d:"false"}),Ue,ve,(0,n.Wm)(ra,{t:"Boolean",d:"true"}),xe,(0,n.Wm)(ra,{t:"Boolean",d:"true"}),fe,we,(0,n.Wm)(ra,{t:"Boolean",d:"true"}),ye,We,je,(0,n.Wm)(ra,{f:"@no-today-error -> function()"}),Se,Ce,(0,n.Wm)(ra,{f:"@move-slider -> function(data)"}),De,Oe,Ee,(0,n.Wm)(ra,{f:"@row-checked -> function(state, data)"}),Be,Je,Ne,(0,n.Wm)(ra,{f:"@row-click -> function(data)"}),Ge,Pe,Ae,He,(0,n.Wm)(ra,{f:"@dbl-click -> function(data)"}),Te,Ie,Re,(0,n._)("h3",Xe,[Ze,qe,(0,n.Wm)(sa,{type:"tip",text:"+v0.0.16",vertical:"top"})]),(0,n.Wm)(ra,{f:"setSelected: (data: any) => void"}),ze,Le,Ve,Ye,(0,n._)("h3",$e,[Fe,Ke,(0,n.Wm)(sa,{type:"tip",text:"+v0.0.15",vertical:"top"})]),Me,(0,n._)("p",null,[Qe,(0,n.Wm)(oa,{to:"/v0/column.html"},{default:(0,n.w5)((()=>[ea])),_:1})]),aa,(0,n._)("p",null,[la,(0,n.Wm)(oa,{to:"/v0/slider.html"},{default:(0,n.w5)((()=>[na])),_:1})]),ta,da],64)}]])},3744:(e,a)=>{a.Z=(e,a)=>{const l=e.__vccOpts||e;for(const[e,n]of a)l[e]=n;return l}}}]);