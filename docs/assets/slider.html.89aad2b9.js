import{_ as r,r as c,o as d,c as k,a as s,b as n,d as a,w as l,e}from"./app.e28d4092.js";const h={},v=n("h1",{id:"滑块组件-xganttslider",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#滑块组件-xganttslider","aria-hidden":"true"},"#"),a(" 滑块组件 XGanttSlider")],-1),m=e(`<p>因为我们在内部已经将其加载，所以您并不需要显示的再次导入到您的组件中就可以使用。</p><p>滑块组件将允许您自定义甘特图中每一行的滑块内容。</p><div class="custom-container warning"><p class="custom-container-title">请注意</p><p>在使用之前，您需要注意，甘特图内部只接收一个滑块组件。也就是说，无论您在组件任何位置插入了滑块组件，其内部都只会渲染最后插入的那个滑块组件。</p><p>注意，是最后插入的那个。</p></div><h2 id="基础使用" tabindex="-1"><a class="header-anchor" href="#基础使用" aria-hidden="true">#</a> 基础使用</h2><p>您只需要简单的将其插入到根组件内即可。</p><p>基于入门的示例，您现在应该拥有一个列，那么您可以继续这样使用：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt</span>
    <span class="token attr-name">data-id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:data</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dataList<span class="token punctuation">&quot;</span></span>
<span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt-column</span> <span class="token attr-name">prop</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt-slider</span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>green<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>x-gantt</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line"> </div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了与原始内容进行区分，我在属性中添加了背景颜色，请注意，它并不是必须的。</p><p>它将显示成如下内容：</p>`,9),g=["src"],_=n("h2",{id:"属性",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#属性","aria-hidden":"true"},"#"),a(" 属性")],-1),b=n("h3",{id:"alignment",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#alignment","aria-hidden":"true"},"#"),a(" alignment")],-1),f=n("p",null,[a("设置内容对齐方式。接收字符串："),n("code",null,"left"),a("、"),n("code",null,"center"),a(" 或 "),n("code",null,"right"),a("。")],-1),x={id:"allowlink",tabindex:"-1"},q=n("a",{class:"header-anchor",href:"#allowlink","aria-hidden":"true"},"#",-1),y=n("p",null,"是否允许创建、修改连线。如果设置为 false，仅仅是不可以从当前 slider 创建连线，而不会影响已有连线的展示。",-1),w=n("h3",{id:"bg-color",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#bg-color","aria-hidden":"true"},"#"),a(" bg-color")],-1),B=n("p",null,"在基础示例中，已经使用了该属性，可以看到滑块的整体背景色都产生了变化。",-1),z=n("h3",{id:"date-format",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#date-format","aria-hidden":"true"},"#"),a(" date-format")],-1),S=n("p",null,"自定义显示日期的格式。如果滑块内需要显示日期，可以通过该属性来格式化日期。",-1),$=n("div",{class:"custom-container warning"},[n("p",{class:"custom-container-title"},"请注意"),n("p",null,"值得注意的是，如果给出该字段，那么其数据的起始日期和结束日期都将按照该格式进行格式化后再被展示。")],-1),E=n("h3",{id:"empty-data",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#empty-data","aria-hidden":"true"},"#"),a(" empty-data")],-1),D=n("p",null,"设置空数据时显示的内容。如果数据内容为空，则会显示空数据内容。",-1),F={id:"flat",tabindex:"-1"},N=n("a",{class:"header-anchor",href:"#flat","aria-hidden":"true"},"#",-1),C=n("s",null,"flat",-1),j=n("p",null,[n("s",null,"设置滑块样式是否扁平化。")],-1),G={id:"highlightdate",tabindex:"-1"},X=n("a",{class:"header-anchor",href:"#highlightdate","aria-hidden":"true"},"#",-1),A=n("s",null,"highlightDate",-1),L=n("p",null,[n("s",null,"允许鼠标悬停高亮表头对应日期")],-1),V={class:"custom-container tip"},M=n("p",{class:"custom-container-title"},"提示",-1),P={id:"height",tabindex:"-1"},R=n("a",{class:"header-anchor",href:"#height","aria-hidden":"true"},"#",-1),T=n("p",null,"滑块的高度，支持数值（单位 px），以及百分比形式（相对于父元素）",-1),H={id:"label",tabindex:"-1"},I=n("a",{class:"header-anchor",href:"#label","aria-hidden":"true"},"#",-1),J=e('<p><s>设置需要显示的内容字段。默认没有该属性情况下显示默认数据，即 <code>empty-data</code> 字段内容。</s></p><p><s>如果您提供了插槽内容，则无论您是否提供了 <code>label</code> 属性，都将用插槽的内容进行替换。更多信息请查看 <a href="#%E6%8F%92%E6%A7%BD">插槽</a> 。</s></p><p>该属性的值会直接显示在滑块组件内，它之前的功能被 <a href="#prop">prop</a> 属性所替代，同时，<code>label</code> 的优先级要比 <code>prop</code> 更高。如果您需要显示更多内容，可以使用插槽。</p><h3 id="linked-resize" tabindex="-1"><a class="header-anchor" href="#linked-resize" aria-hidden="true">#</a> linked-resize</h3>',4),K=e('<p>设置滑块组件移动时，其父、子数据内容是否跟随改变。当启用该属性后，无论您使用 <a href="#move"><code>move</code></a> 、 <a href="#resize-left"><code>resize-left</code></a> 还是 <a href="#resize-right"><code>resize-right</code></a> ，都将遵循 <code>联动规则</code>。</p><p><strong>联动规则</strong>：确保子级数据不会超越父级数据的时间范围，同时父级数据不会小于子级数据的时间范围。</p><div class="custom-container warning"><p class="custom-container-title">注意</p><p>在数据量很大的情况下，启用该属性可能会消耗大量资源。</p></div><h3 id="move" tabindex="-1"><a class="header-anchor" href="#move" aria-hidden="true">#</a> move</h3>',4),O=n("p",null,"设置滑块组件是否可以被拖动，默认不可用。",-1),Q=n("ul",null,[n("li",null,[a("Function：类型 "),n("code",null,"({ row: any, $index: number, level: Number }) => Boolean"),a("。将数据、当前索引和层级抛出，用于更加精准的定义哪些数据可以移动")])],-1),U=n("code",null,"true",-1),W=n("code",null,"move-slider",-1),Y=n("h3",{id:"progress",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#progress","aria-hidden":"true"},"#"),a(" progress")],-1),Z=n("p",null,"启用进度条显示。",-1),nn=n("p",null,[a("允许使用者打开进度条选项。如果开启了该选项，则可以读取源数据中的 "),n("code",null,"progress"),a(" 数值，范围为 "),n("code",null,"[0~1]"),a("，系统会自动转换为百分比数值。")],-1),an=n("p",null,[a("需要注意的是，该属性尽管可以存在于每一个数据中，但是只有末层数据会被正确展示，父级的进度会自动根据子项 "),n("code",null,"children"),a(" 的完成度进行换算，所以只需要确保每一个子项内容正确即可。")],-1),sn=n("p",null,"同时，如果您自定义了滑块插槽，那么无论您是否开启了进度条，都不会显示这个功能。",-1),tn={id:"progresscolor",tabindex:"-1"},en=n("a",{class:"header-anchor",href:"#progresscolor","aria-hidden":"true"},"#",-1),pn=e('<p>设置进度条的颜色，默认使用 <a href="#bg-color">bg-color</a> 属性的值。</p><div class="custom-container tip"><p class="custom-container-title">提示</p><p>默认值会根据给出的背景色进行渲染。自定义颜色可以使颜色更加多样化，您可以尝试通过给 alpha 通道赋值来实现透明度效果。</p></div><h3 id="progressdecimal" tabindex="-1"><a class="header-anchor" href="#progressdecimal" aria-hidden="true">#</a> progressDecimal</h3>',3),on=n("p",null,[a("允许自定义进度条数值位数，默认只显示整数，通过传递 "),n("code",null,"true"),a(" 值，可以启动默认 2 位的小数。")],-1),ln=n("p",null,"也可以传递一个数字（范围：[0, 10]）来自定义显示位数。",-1),cn=n("h3",{id:"resize-left",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#resize-left","aria-hidden":"true"},"#"),a(" resize-left")],-1),un=n("ul",null,[n("li",null,[a("Function：类型 "),n("code",null,"({ row: any, $index: number, level: Number }) => Boolean"),a("。将数据、当前索引和层级抛出，用于更加精准的定义哪些数据可以移动")])],-1),rn=n("p",null,[n("strong",null,[a("该属性只有当 "),n("code",null,"move"),a(" 属性可用时才会生效。")])],-1),dn=n("p",null,"设置滑块组件左侧是否可以被拉伸，默认不可用。",-1),kn=n("code",null,"move-slider",-1),hn=n("h3",{id:"resize-right",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#resize-right","aria-hidden":"true"},"#"),a(" resize-right")],-1),vn=n("ul",null,[n("li",null,[a("Function：类型 "),n("code",null,"({ row: any, $index: number, level: Number }) => Boolean"),a("。将数据、当前索引和层级抛出，用于更加精准的定义哪些数据可以移动")])],-1),mn=n("p",null,[n("strong",null,[a("该属性只有当 "),n("code",null,"move"),a(" 属性可用时才会生效。")])],-1),gn=n("p",null,"设置滑块组件右侧是否可以被拉伸，默认不可用。",-1),_n=n("code",null,"move-slider",-1),bn=e('<h2 id="插槽" tabindex="-1"><a class="header-anchor" href="#插槽" aria-hidden="true">#</a> 插槽</h2><div class="custom-container tip"><p class="custom-container-title">更新提示</p><p>所有插槽抛出的内容变更，在抛出当前数据的同时，也抛出层级，方便按层级自定义内容。</p></div><h3 id="default" tabindex="-1"><a class="header-anchor" href="#default" aria-hidden="true">#</a> default</h3>',3),fn=e(`<p>滑块组件内部允许您插入任何内容，它将向滑块内注入您提供的所有模板内容。同时它会抛出当前行的数据以供您使用。</p><p>一个简单的示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt-slider</span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>green<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:move</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:linked-resize</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">v-slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{row, $index, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>{{ row.name }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>x-gantt-slider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">提示</p><p><code>default</code> 插槽会包含一定样式，如果您想尝试完全替换现有的滑块内容，那么下面的内容将会更适合。</p></div><h3 id="content" tabindex="-1"><a class="header-anchor" href="#content" aria-hidden="true">#</a> content</h3>`,5),xn=e(`<p>有时候，您可能需要重新定义滑块样式，那么这个插槽一定适合您。它会使用您提供的插槽元素来替换默认的滑块元素，而不是向默认滑块内部插入内容。</p><p>一个简单的示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>XGanttSlider</span> <span class="token attr-name">prop</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>startDate<span class="token punctuation">&quot;</span></span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>green<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{row, $index, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
      <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span> #123456<span class="token punctuation">;</span><span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span><span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>5px</span><span class="token punctuation">&quot;</span></span></span>
    <span class="token punctuation">&gt;</span></span>
      {{ row.name }} - {{ row.index }}
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>XGanttSlider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container warning"><p class="custom-container-title">注意</p><p>该插槽会替换包含在滑块内部的所有内容，如果启用了 <a href="#progress"><code>progress</code></a> 属性，那么您需要根据需要自行添加进度条。</p><p>但不包括左右滑块，如果您需要替换左右滑块，那么请使用 <a href="#left"><code>left</code></a> 和 <a href="#right"><code>right</code></a> 插槽。</p></div><h3 id="left" tabindex="-1"><a class="header-anchor" href="#left" aria-hidden="true">#</a> left</h3>`,5),qn=e(`<p>当您重新定义了滑块的样式，那么侧边的滑动块一定也不符合现有的需求，所以我们提供了重载左右滑动块的插槽。通常情况下，它与 <code>content</code> 应该配套使用。</p><p>一个简单的示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>XGanttSlider</span>
  <span class="token attr-name">prop</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>startDate<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">:move</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">:resize-left</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">:resize-right</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">:linked-resize</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
<span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{row, $index, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
      <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span> #123456<span class="token punctuation">;</span><span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span><span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>5px</span><span class="token punctuation">&quot;</span></span></span>
    <span class="token punctuation">&gt;</span></span>
      {{ row.name }} - {{ row.index }}
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>left</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span>#123456<span class="token punctuation">;</span><span class="token property">width</span><span class="token punctuation">:</span>5px<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>10px<span class="token punctuation">;</span></span><span class="token punctuation">&quot;</span></span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>right</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span>#123456<span class="token punctuation">;</span><span class="token property">width</span><span class="token punctuation">:</span>5px<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>10px<span class="token punctuation">;</span></span><span class="token punctuation">&quot;</span></span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>XGanttSlider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">提示</p><p>在默认的 slider 中，是包含一定圆角的。您可以通过以下方式实现：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code>// 左侧
<span class="token property">border-left-top-radius</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
<span class="token property">border-left-bottom-radius</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>

// 和

// 右侧
<span class="token property">border-right-top-radius</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
<span class="token property">border-right-bottom-radius</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>您可以根据实际情况而定。</p></div><h3 id="right" tabindex="-1"><a class="header-anchor" href="#right" aria-hidden="true">#</a> right</h3>`,5),yn=n("p",null,[a("它的功能与 "),n("code",null,"left"),a(" 插槽一致，仅仅是将 "),n("code",null,"left"),a(" 更换为 "),n("code",null,"right"),a(" 即可，参数与功能完全一致，不再赘述。")],-1),wn=n("p",null,"上述示例的效果如下：",-1),Bn=["src"],zn=n("p",null,"恭喜您，您现在已经可以完全自定义属于您的甘特图组件了。",-1);function Sn(i,$n){const u=c("Description"),t=c("DataParameter"),p=c("Badge"),o=c("RouterLink");return d(),k("div",null,[v,s(u,{author:"jeremyjone",date:"2023-05-20",copyright:"jeremyjone"}),m,n("img",{src:i.$withBase("/assets/v2-slider-basic.png"),alt:"slider-basic"},null,8,g),_,b,s(t,{t:"left | center | right",d:"left"}),f,n("h3",x,[q,a(" allowLink "),s(p,{text:"新增",type:"tip"})]),s(t,{t:"Boolean",d:"true"}),y,w,s(t,{t:"String",d:""}),n("p",null,[a("设置滑块组件的背景颜色，默认使用 "),s(o,{to:"/root.html#primary-color"},{default:l(()=>[a("primary-color")]),_:1}),a("。")]),B,z,s(t,{t:"String",d:"yyyy-MM-dd"}),S,$,n("p",null,[a("更多关于日期格式化的属性，参看 "),s(o,{to:"/common.html#%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B1%9E%E6%80%A7"},{default:l(()=>[a("日期格式化属性")]),_:1})]),E,s(t,{t:"String",d:"无数据 😢"}),D,n("h3",F,[N,a(),C,a(),s(p,{text:"移除",type:"warning"})]),n("p",null,[n("s",null,[s(t,{t:"Boolean",d:"false"})])]),j,n("h3",G,[X,a(),A,a(),s(p,{text:"移除",type:"warning"})]),n("p",null,[n("s",null,[s(t,{t:"Boolean",d:"false"})])]),L,n("div",V,[M,n("p",null,[a("该属性移动到了 "),s(o,{to:"/root.html#highlight-date"},{default:l(()=>[a("x-gantt")]),_:1}),a(" 组件中，现在可以在移动到行内任意地方实现该效果。")])]),n("h3",P,[R,a(" height "),s(p,{text:"新增",type:"tip"})]),s(t,{t:"[Number, String]",d:"'50%'"}),T,n("h3",H,[I,a(" label "),s(p,{text:"修改",type:"info"})]),s(t,{t:"String"}),J,s(t,{t:"Boolean",d:"false"}),K,s(t,{t:"[Boolean, Function]",d:"false"}),O,Q,n("p",null,[a("如果设置了 "),U,a("，则意味着滑块可以被任意拖动。当拖动结束时，修改数据，同时会抛出 "),s(o,{to:"/root.html#move-slider"},{default:l(()=>[W]),_:1}),a(" 事件。")]),Y,s(t,{t:"Boolean",d:"false"}),Z,nn,an,sn,n("h3",tn,[en,a(" progressColor "),s(p,{text:"新增",type:"tip"})]),s(t,{t:"String",d:"#1890ff"}),pn,s(t,{t:"[Boolean, Number]",d:"false"}),on,ln,cn,s(t,{t:"[Boolean, Function]",d:"false"}),un,rn,dn,n("p",null,[a("该属性单独设置左侧是否可以被拖动，这意味着滑块可以单独修改起始时间。当拖动结束时，修改数据，同时会抛出 "),s(o,{to:"/root.html#move-slider"},{default:l(()=>[kn]),_:1}),a(" 事件。")]),hn,s(t,{t:"[Boolean, Function]",d:"false"}),vn,mn,gn,n("p",null,[a("该属性单独设置右侧是否可以被拖动，这意味着滑块可以单独修改结束时间。当拖动结束时，修改数据，同时会抛出 "),s(o,{to:"/root.html#move-slider"},{default:l(()=>[_n]),_:1}),a(" 事件。")]),bn,s(t,{f:"scope = {row:any, $index: number, level:number}"}),fn,s(t,{f:"scope = {row:any, $index: number, level:number}"}),xn,s(t,{f:"scope = {row:any, $index: number, level:number}"}),qn,s(t,{f:"scope = {row:any,  $index: number,level:number}"}),yn,wn,n("img",{src:i.$withBase("/assets/slider-content.png"),alt:"slider-content"},null,8,Bn),zn])}const Dn=r(h,[["render",Sn],["__file","slider.html.vue"]]);export{Dn as default};
