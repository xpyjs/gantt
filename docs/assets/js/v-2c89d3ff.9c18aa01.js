"use strict";(self.webpackChunkgantt_doc=self.webpackChunkgantt_doc||[]).push([[913],{2071:(a,n,s)=>{s.r(n),s.d(n,{data:()=>t});const t={key:"v-2c89d3ff",path:"/slider.html",title:"滑块组件 JGanttSlider",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"基础使用",slug:"基础使用",children:[]},{level:2,title:"属性",slug:"属性",children:[{level:3,title:"alignment",slug:"alignment",children:[]},{level:3,title:"bg-color",slug:"bg-color",children:[]},{level:3,title:"date-format",slug:"date-format",children:[]},{level:3,title:"empty-data",slug:"empty-data",children:[]},{level:3,title:"flat",slug:"flat",children:[]},{level:3,title:"label",slug:"label",children:[]},{level:3,title:"linked-resize",slug:"linked-resize",children:[]},{level:3,title:"move",slug:"move",children:[]},{level:3,title:"progress",slug:"progress",children:[]},{level:3,title:"resize-left",slug:"resize-left",children:[]},{level:3,title:"resize-right",slug:"resize-right",children:[]}]},{level:2,title:"插槽",slug:"插槽",children:[{level:3,title:"default",slug:"default",children:[]},{level:3,title:"content",slug:"content",children:[]},{level:3,title:"left",slug:"left",children:[]},{level:3,title:"right",slug:"right",children:[]}]}],filePathRelative:"slider.md",git:{updatedTime:1639363027e3,contributors:[{name:"jeremyjone",email:"jeremyjone@qq.com",commits:1}]}}},9803:(a,n,s)=>{s.r(n),s.d(n,{default:()=>oa});var t=s(6252);const e=(0,t._)("h1",{id:"滑块组件-jganttslider",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#滑块组件-jganttslider","aria-hidden":"true"},"#"),(0,t.Uk)(" 滑块组件 JGanttSlider")],-1),p=(0,t.uE)('<p>因为我们在内部已经将其加载，所以您并不需要显示的再次导入到您的组件中就可以使用。</p><p>滑块组件将允许您自定义甘特图中每一行的滑块内容。</p><div class="custom-container warning"><p class="custom-container-title">请注意</p><p>在使用之前，您需要注意，甘特图内部只接收一个滑块组件。也就是说，无论您在组件任何位置插入了滑块组件，其内部都只会渲染最后插入的那个滑块组件。</p><p>注意，是最后插入的那个。</p></div><h2 id="基础使用" tabindex="-1"><a class="header-anchor" href="#基础使用" aria-hidden="true">#</a> 基础使用</h2><p>您只需要简单的将其插入到根组件内即可。</p><p>基于入门的示例，您现在应该拥有一个列，那么您可以继续这样使用：</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt</span>\n    <span class="token attr-name">data-index</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span>\n    <span class="token attr-name">:data</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dataList<span class="token punctuation">&quot;</span></span>\n<span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt-column</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt-slider</span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>j-gantt</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line"> </div><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>为了与原始内容进行区分，我在属性中添加了背景颜色，请注意，它并不是必须的。</p><p>它将显示成如下内容：</p>',9),l=["src"],o=(0,t._)("h2",{id:"属性",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#属性","aria-hidden":"true"},"#"),(0,t.Uk)(" 属性")],-1),c=(0,t._)("h3",{id:"alignment",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#alignment","aria-hidden":"true"},"#"),(0,t.Uk)(" alignment")],-1),u=(0,t._)("p",null,[(0,t.Uk)("设置内容对齐方式。接收字符串："),(0,t._)("code",null,"left"),(0,t.Uk)("、"),(0,t._)("code",null,"center"),(0,t.Uk)(" 或 "),(0,t._)("code",null,"right"),(0,t.Uk)("。")],-1),r=(0,t._)("h3",{id:"bg-color",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#bg-color","aria-hidden":"true"},"#"),(0,t.Uk)(" bg-color")],-1),i=(0,t.Uk)("设置滑块组件的背景颜色，默认使用 "),k=(0,t.Uk)("primary-color"),d=(0,t.Uk)("。"),g=(0,t._)("p",null,"在基础示例中，已经使用了该属性，可以看到滑块的整体背景色都产生了变化。",-1),m=(0,t._)("h3",{id:"date-format",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#date-format","aria-hidden":"true"},"#"),(0,t.Uk)(" date-format")],-1),h=(0,t._)("p",null,"自定义显示日期的格式。如果滑块内需要显示日期，可以通过该属性来格式化日期。",-1),b=(0,t._)("div",{class:"custom-container warning"},[(0,t._)("p",{class:"custom-container-title"},"请注意"),(0,t._)("p",null,"值得注意的是，如果给出该字段，那么其数据的起始日期和结束日期都将按照该格式进行格式化后再被展示。")],-1),v=(0,t.Uk)("更多关于日期格式化的属性，参看 "),f=(0,t.Uk)("日期格式化属性"),_=(0,t._)("h3",{id:"empty-data",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#empty-data","aria-hidden":"true"},"#"),(0,t.Uk)(" empty-data")],-1),q=(0,t._)("p",null,"设置空数据时显示的内容。如果数据内容为空，则会显示空数据内容。",-1),y=(0,t._)("h3",{id:"flat",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#flat","aria-hidden":"true"},"#"),(0,t.Uk)(" flat")],-1),x=(0,t._)("p",null,"设置滑块样式是否扁平化。",-1),U=(0,t._)("h3",{id:"label",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#label","aria-hidden":"true"},"#"),(0,t.Uk)(" label")],-1),z=(0,t._)("p",null,[(0,t.Uk)("设置需要显示的内容字段。默认没有该属性情况下显示默认数据，即 "),(0,t._)("code",null,"empty-data"),(0,t.Uk)(" 字段内容。")],-1),W=(0,t._)("p",null,[(0,t.Uk)("如果您提供了插槽内容，则无论您是否提供了 "),(0,t._)("code",null,"label"),(0,t.Uk)(" 属性，都将用插槽的内容进行替换。更多信息请查看 "),(0,t._)("a",{href:"#%E6%8F%92%E6%A7%BD"},"插槽"),(0,t.Uk)(" 。")],-1),j=(0,t._)("h3",{id:"linked-resize",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#linked-resize","aria-hidden":"true"},"#"),(0,t.Uk)(" linked-resize")],-1),w=(0,t.uE)('<p>设置滑块组件移动时，其父、子数据内容是否跟随改变。当启用该属性后，无论您使用 <a href="#move"><code>move</code></a> 、 <a href="#resize-left"><code>resize-left</code></a> 还是 <a href="#resize-right"><code>resize-right</code></a> ，都将遵循 <code>联动规则</code>。</p><p><strong>联动规则</strong>：确保子级数据不会超越父级数据的时间范围，同时父级数据不会小于子级数据的时间范围。</p><div class="custom-container warning"><p class="custom-container-title">注意</p><p>在数据量很大的情况下，启用该属性可能会消耗大量资源。</p></div>',3),B={id:"move",tabindex:"-1"},E=(0,t._)("a",{class:"header-anchor",href:"#move","aria-hidden":"true"},"#",-1),S=(0,t.Uk)(" move "),C=(0,t._)("p",null,"设置滑块组件是否可以被拖动，默认不可用。",-1),D=(0,t._)("ul",null,[(0,t._)("li",null,[(0,t.Uk)("Function：类型 "),(0,t._)("code",null,"({ data: any, level: Number }) => Boolean"),(0,t.Uk)("。将数据和层级抛出，用于更加精准的定义哪些数据可以移动")])],-1),G=(0,t.Uk)("如果设置了 "),J=(0,t._)("code",null,"true",-1),F=(0,t.Uk)("，则意味着滑块可以被任意拖动。当拖动结束时，修改数据，同时会抛出 "),A=(0,t._)("code",null,"move-slider",-1),L=(0,t.Uk)(" 事件。"),M={id:"progress",tabindex:"-1"},N=(0,t._)("a",{class:"header-anchor",href:"#progress","aria-hidden":"true"},"#",-1),P=(0,t.Uk)(" progress "),R=(0,t.uE)('<p>启用进度条显示。</p><p>允许使用者打开进度条选项。如果开启了该选项，则可以读取源数据中的 <code>progress</code> 数值，范围为 <code>[0~1]</code>，系统会自动转换为百分比数值。</p><p>需要注意的是，该属性尽管可以存在于每一个数据中，但是只有末层数据会被正确展示，父级的进度会自动根据子项 <code>children</code> 的完成度进行换算，所以只需要确保每一个子项内容正确即可。</p><p>同时，如果您自定义了滑块插槽，那么无论您是否开启了进度条，都不会显示这个功能。</p><h3 id="resize-left" tabindex="-1"><a class="header-anchor" href="#resize-left" aria-hidden="true">#</a> resize-left</h3>',5),Z=(0,t._)("p",null,[(0,t._)("strong",null,[(0,t.Uk)("该属性只有当 "),(0,t._)("code",null,"move"),(0,t.Uk)(" 属性可用时才会生效。")])],-1),$=(0,t._)("p",null,"设置滑块组件左侧是否可以被拉伸，默认不可用。",-1),H=(0,t.Uk)("该属性单独设置左侧是否可以被拖动，这意味着滑块可以单独修改起始时间。当拖动结束时，修改数据，同时会抛出 "),O=(0,t._)("code",null,"move-slider",-1),T=(0,t.Uk)(" 事件。"),Y=(0,t._)("h3",{id:"resize-right",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#resize-right","aria-hidden":"true"},"#"),(0,t.Uk)(" resize-right")],-1),I=(0,t._)("p",null,[(0,t._)("strong",null,[(0,t.Uk)("该属性只有当 "),(0,t._)("code",null,"move"),(0,t.Uk)(" 属性可用时才会生效。")])],-1),K=(0,t._)("p",null,"设置滑块组件右侧是否可以被拉伸，默认不可用。",-1),Q=(0,t.Uk)("该属性单独设置右侧是否可以被拖动，这意味着滑块可以单独修改结束时间。当拖动结束时，修改数据，同时会抛出 "),V=(0,t._)("code",null,"move-slider",-1),X=(0,t.Uk)(" 事件。"),aa={id:"插槽",tabindex:"-1"},na=(0,t._)("a",{class:"header-anchor",href:"#插槽","aria-hidden":"true"},"#",-1),sa=(0,t.Uk)(" 插槽 "),ta=(0,t.uE)('<div class="custom-container tip"><p class="custom-container-title">更新提示</p><p>所有插槽抛出的内容变更，在抛出当前数据的同时，也抛出层级，方便按层级自定义内容。</p></div><h3 id="default" tabindex="-1"><a class="header-anchor" href="#default" aria-hidden="true">#</a> default</h3><p>滑块组件内部允许您插入任何内容，它将向滑块内注入您提供的所有模板内容。同时它会抛出当前行的数据以供您使用。</p><p>一个简单的示例：</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt-slider</span> <span class="token attr-name">flat</span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:move</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:linked-resize</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">v-slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{data, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>{{ data.name }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>j-gantt-slider</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">提示</p><p><code>default</code> 插槽会包含一定样式，如果您想尝试完全替换现有的滑块内容，那么下面的内容将会更适合。</p></div><h3 id="content" tabindex="-1"><a class="header-anchor" href="#content" aria-hidden="true">#</a> content</h3><p>有时候，您可能需要重新定义滑块样式，那么这个插槽一定适合您。它会使用您提供的插槽元素来替换默认的滑块元素，而不是向默认滑块内部插入内容。</p><p>一个简单的示例：</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>JGanttSlider</span> <span class="token attr-name">flat</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>startDate<span class="token punctuation">&quot;</span></span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{data, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>\n      <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span> #123456<span class="token punctuation">;</span><span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span><span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>5px</span><span class="token punctuation">&quot;</span></span></span>\n    <span class="token punctuation">&gt;</span></span>\n      {{ data.name }} - {{ data.index }}\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>JGanttSlider</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="left" tabindex="-1"><a class="header-anchor" href="#left" aria-hidden="true">#</a> left</h3><p>当您重新定义了滑块的样式，那么侧边的滑动块一定也不符合现有的需求，所以我们提供了重载左右滑动块的插槽。通常情况下，它与 <code>content</code> 应该配套使用。</p><p>一个简单的示例：</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>JGanttSlider</span>\n  <span class="token attr-name">flat</span>\n  <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>startDate<span class="token punctuation">&quot;</span></span>\n  <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span>\n  <span class="token attr-name">:move</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>\n  <span class="token attr-name">:resize-left</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>\n  <span class="token attr-name">:resize-right</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>\n  <span class="token attr-name">:linked-resize</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>\n<span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{data, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>\n      <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span> #123456<span class="token punctuation">;</span><span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span><span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>5px</span><span class="token punctuation">&quot;</span></span></span>\n    <span class="token punctuation">&gt;</span></span>\n      {{ data.name }} - {{ data.index }}\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>left</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span>#123456<span class="token punctuation">;</span><span class="token property">width</span><span class="token punctuation">:</span>5px<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>10px</span><span class="token punctuation">&quot;</span></span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>right</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span>#123456<span class="token punctuation">;</span><span class="token property">width</span><span class="token punctuation">:</span>5px<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>10px</span><span class="token punctuation">&quot;</span></span></span> <span class="token punctuation">/&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>JGanttSlider</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h3 id="right" tabindex="-1"><a class="header-anchor" href="#right" aria-hidden="true">#</a> right</h3><p>它的功能与 <code>left</code> 插槽一致，仅仅是将 <code>left</code> 更换为 <code>right</code> 即可，参数与功能完全一致，不再赘述。</p><p>上述示例的效果如下：</p>',17),ea=["src"],pa=(0,t._)("p",null,"恭喜您，您现在已经可以完全自定义属于您的甘特图组件了。",-1),la={},oa=(0,s(3744).Z)(la,[["render",function(a,n){const s=(0,t.up)("Description"),la=(0,t.up)("DataParameter"),oa=(0,t.up)("RouterLink"),ca=(0,t.up)("Badge");return(0,t.wg)(),(0,t.iD)(t.HY,null,[e,(0,t.Wm)(s,{author:"jeremyjone",date:"2021-12-10",copyright:"jeremyjone"}),p,(0,t._)("img",{src:a.$withBase("/assets/slider-basic.png"),alt:"slider-basic"},null,8,l),o,c,(0,t.Wm)(la,{t:"String",d:"left"}),u,r,(0,t.Wm)(la,{t:"String",d:""}),(0,t._)("p",null,[i,(0,t.Wm)(oa,{to:"/root.html#primary-color"},{default:(0,t.w5)((()=>[k])),_:1}),d]),g,m,(0,t.Wm)(la,{t:"String",d:"yyyy-MM-dd"}),h,b,(0,t._)("p",null,[v,(0,t.Wm)(oa,{to:"/common.html#%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B1%9E%E6%80%A7"},{default:(0,t.w5)((()=>[f])),_:1})]),_,(0,t.Wm)(la,{t:"String",d:"无数据 😢"}),q,y,(0,t.Wm)(la,{t:"Boolean",d:"false"}),x,U,(0,t.Wm)(la,{t:"String"}),z,W,j,(0,t.Wm)(la,{t:"Boolean",d:"false"}),w,(0,t._)("h3",B,[E,S,(0,t.Wm)(ca,{type:"tip",text:"update v1.0.0",vertical:"top"})]),(0,t.Wm)(la,{t:"[Boolean, Function]",d:"false"}),C,D,(0,t._)("p",null,[G,J,F,(0,t.Wm)(oa,{to:"/root.html#move-slider"},{default:(0,t.w5)((()=>[A])),_:1}),L]),(0,t._)("h3",M,[N,P,(0,t.Wm)(ca,{type:"tip",text:"+ v1.2.0",vertical:"top"})]),(0,t.Wm)(la,{t:"Boolean",d:"false"}),R,(0,t.Wm)(la,{t:"Boolean",d:"false"}),Z,$,(0,t._)("p",null,[H,(0,t.Wm)(oa,{to:"/root.html#move-slider"},{default:(0,t.w5)((()=>[O])),_:1}),T]),Y,(0,t.Wm)(la,{t:"Boolean",d:"false"}),I,K,(0,t._)("p",null,[Q,(0,t.Wm)(oa,{to:"/root.html#move-slider"},{default:(0,t.w5)((()=>[V])),_:1}),X]),(0,t._)("h2",aa,[na,sa,(0,t.Wm)(ca,{type:"tip",text:"update v1.0.0",vertical:"top"})]),ta,(0,t._)("img",{src:a.$withBase("/assets/slider-content.png"),alt:"slider-content"},null,8,ea),pa],64)}]])},3744:(a,n)=>{n.Z=(a,n)=>{const s=a.__vccOpts||a;for(const[a,t]of n)s[a]=t;return s}}}]);