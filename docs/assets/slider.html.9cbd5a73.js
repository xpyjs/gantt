import{_ as r,r as l,o as d,c as k,a as s,b as a,d as n,w as o,e}from"./app.6550bde5.js";const h={},v=a("h1",{id:"滑块组件-xganttslider",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#滑块组件-xganttslider","aria-hidden":"true"},"#"),n(" 滑块组件 XGanttSlider")],-1),g=e(`<p>因为我们在内部已经将其加载，所以您并不需要显示的再次导入到您的组件中就可以使用。</p><p>滑块组件将允许您自定义甘特图中每一行的滑块内容。</p><div class="custom-container warning"><p class="custom-container-title">请注意</p><p>在使用之前，您需要注意，甘特图内部只接收一个滑块组件。也就是说，无论您在组件任何位置插入了滑块组件，其内部都只会渲染最后插入的那个滑块组件。</p><p>注意，是最后插入的那个。</p></div><h2 id="基础使用" tabindex="-1"><a class="header-anchor" href="#基础使用" aria-hidden="true">#</a> 基础使用</h2><p>您只需要简单的将其插入到根组件内即可。</p><p>基于入门的示例，您现在应该拥有一个列，那么您可以继续这样使用：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt</span>
    <span class="token attr-name">data-index</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:data</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dataList<span class="token punctuation">&quot;</span></span>
<span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt-column</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt-slider</span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>x-gantt</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line"> </div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了与原始内容进行区分，我在属性中添加了背景颜色，请注意，它并不是必须的。</p><p>它将显示成如下内容：</p>`,9),m=["src"],_=a("h2",{id:"属性",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#属性","aria-hidden":"true"},"#"),n(" 属性")],-1),b=a("h3",{id:"alignment",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#alignment","aria-hidden":"true"},"#"),n(" alignment")],-1),f=a("p",null,[n("设置内容对齐方式。接收字符串："),a("code",null,"left"),n("、"),a("code",null,"center"),n(" 或 "),a("code",null,"right"),n("。")],-1),q=a("h3",{id:"bg-color",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#bg-color","aria-hidden":"true"},"#"),n(" bg-color")],-1),x=a("p",null,"在基础示例中，已经使用了该属性，可以看到滑块的整体背景色都产生了变化。",-1),y=a("h3",{id:"date-format",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#date-format","aria-hidden":"true"},"#"),n(" date-format")],-1),B=a("p",null,"自定义显示日期的格式。如果滑块内需要显示日期，可以通过该属性来格式化日期。",-1),z=a("div",{class:"custom-container warning"},[a("p",{class:"custom-container-title"},"请注意"),a("p",null,"值得注意的是，如果给出该字段，那么其数据的起始日期和结束日期都将按照该格式进行格式化后再被展示。")],-1),E=a("h3",{id:"empty-data",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#empty-data","aria-hidden":"true"},"#"),n(" empty-data")],-1),S=a("p",null,"设置空数据时显示的内容。如果数据内容为空，则会显示空数据内容。",-1),w=a("h3",{id:"flat",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#flat","aria-hidden":"true"},"#"),n(" flat")],-1),D=a("p",null,"设置滑块样式是否扁平化。",-1),j={id:"highlightdate",tabindex:"-1"},C=a("a",{class:"header-anchor",href:"#highlightdate","aria-hidden":"true"},"#",-1),N=a("p",null,"允许鼠标悬停高亮表头对应日期",-1),F=a("h3",{id:"label",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#label","aria-hidden":"true"},"#"),n(" label")],-1),G=a("p",null,[n("设置需要显示的内容字段。默认没有该属性情况下显示默认数据，即 "),a("code",null,"empty-data"),n(" 字段内容。")],-1),X=a("p",null,[n("如果您提供了插槽内容，则无论您是否提供了 "),a("code",null,"label"),n(" 属性，都将用插槽的内容进行替换。更多信息请查看 "),a("a",{href:"#%E6%8F%92%E6%A7%BD"},"插槽"),n(" 。")],-1),A=a("h3",{id:"linked-resize",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#linked-resize","aria-hidden":"true"},"#"),n(" linked-resize")],-1),V=e('<p>设置滑块组件移动时，其父、子数据内容是否跟随改变。当启用该属性后，无论您使用 <a href="#move"><code>move</code></a> 、 <a href="#resize-left"><code>resize-left</code></a> 还是 <a href="#resize-right"><code>resize-right</code></a> ，都将遵循 <code>联动规则</code>。</p><p><strong>联动规则</strong>：确保子级数据不会超越父级数据的时间范围，同时父级数据不会小于子级数据的时间范围。</p><div class="custom-container warning"><p class="custom-container-title">注意</p><p>在数据量很大的情况下，启用该属性可能会消耗大量资源。</p></div><h3 id="move" tabindex="-1"><a class="header-anchor" href="#move" aria-hidden="true">#</a> move</h3>',4),L=a("p",null,"设置滑块组件是否可以被拖动，默认不可用。",-1),M=a("ul",null,[a("li",null,[n("Function：类型 "),a("code",null,"({ data: any, level: Number }) => Boolean"),n("。将数据和层级抛出，用于更加精准的定义哪些数据可以移动")])],-1),P=a("code",null,"true",-1),R=a("code",null,"move-slider",-1),$=a("h3",{id:"progress",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#progress","aria-hidden":"true"},"#"),n(" progress")],-1),T=e('<p>启用进度条显示。</p><p>允许使用者打开进度条选项。如果开启了该选项，则可以读取源数据中的 <code>progress</code> 数值，范围为 <code>[0~1]</code>，系统会自动转换为百分比数值。</p><p>需要注意的是，该属性尽管可以存在于每一个数据中，但是只有末层数据会被正确展示，父级的进度会自动根据子项 <code>children</code> 的完成度进行换算，所以只需要确保每一个子项内容正确即可。</p><p>同时，如果您自定义了滑块插槽，那么无论您是否开启了进度条，都不会显示这个功能。</p><h3 id="progressdecimal" tabindex="-1"><a class="header-anchor" href="#progressdecimal" aria-hidden="true">#</a> progressDecimal</h3>',5),H=a("p",null,[n("允许自定义进度条数值位数，默认只显示整数，通过传递 "),a("code",null,"true"),n(" 值，可以启动默认 2 位的小数。")],-1),I=a("p",null,"也可以传递一个数字（范围：[0, 10]）来自定义显示位数。",-1),J=a("h3",{id:"resize-left",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#resize-left","aria-hidden":"true"},"#"),n(" resize-left")],-1),K=a("p",null,[a("strong",null,[n("该属性只有当 "),a("code",null,"move"),n(" 属性可用时才会生效。")])],-1),O=a("p",null,"设置滑块组件左侧是否可以被拉伸，默认不可用。",-1),Q=a("code",null,"move-slider",-1),U=a("h3",{id:"resize-right",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#resize-right","aria-hidden":"true"},"#"),n(" resize-right")],-1),W=a("p",null,[a("strong",null,[n("该属性只有当 "),a("code",null,"move"),n(" 属性可用时才会生效。")])],-1),Y=a("p",null,"设置滑块组件右侧是否可以被拉伸，默认不可用。",-1),Z=a("code",null,"move-slider",-1),aa=e('<h2 id="插槽" tabindex="-1"><a class="header-anchor" href="#插槽" aria-hidden="true">#</a> 插槽</h2><div class="custom-container tip"><p class="custom-container-title">更新提示</p><p>所有插槽抛出的内容变更，在抛出当前数据的同时，也抛出层级，方便按层级自定义内容。</p></div><h3 id="default" tabindex="-1"><a class="header-anchor" href="#default" aria-hidden="true">#</a> default</h3>',3),na=e(`<p>滑块组件内部允许您插入任何内容，它将向滑块内注入您提供的所有模板内容。同时它会抛出当前行的数据以供您使用。</p><p>一个简单的示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt-slider</span> <span class="token attr-name">flat</span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:move</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:linked-resize</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">v-slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{data, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>{{ data.name }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>x-gantt-slider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">提示</p><p><code>default</code> 插槽会包含一定样式，如果您想尝试完全替换现有的滑块内容，那么下面的内容将会更适合。</p></div><h3 id="content" tabindex="-1"><a class="header-anchor" href="#content" aria-hidden="true">#</a> content</h3>`,5),sa=e(`<p>有时候，您可能需要重新定义滑块样式，那么这个插槽一定适合您。它会使用您提供的插槽元素来替换默认的滑块元素，而不是向默认滑块内部插入内容。</p><p>一个简单的示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>XGanttSlider</span> <span class="token attr-name">flat</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>startDate<span class="token punctuation">&quot;</span></span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{data, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
      <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span> #123456<span class="token punctuation">;</span><span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span><span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>5px</span><span class="token punctuation">&quot;</span></span></span>
    <span class="token punctuation">&gt;</span></span>
      {{ data.name }} - {{ data.index }}
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>XGanttSlider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="left" tabindex="-1"><a class="header-anchor" href="#left" aria-hidden="true">#</a> left</h3>`,4),ta=e(`<p>当您重新定义了滑块的样式，那么侧边的滑动块一定也不符合现有的需求，所以我们提供了重载左右滑动块的插槽。通常情况下，它与 <code>content</code> 应该配套使用。</p><p>一个简单的示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>XGanttSlider</span>
  <span class="token attr-name">flat</span>
  <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>startDate<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">:move</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">:resize-left</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">:resize-right</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">:linked-resize</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
<span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{data, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
      <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span> #123456<span class="token punctuation">;</span><span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span><span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>5px</span><span class="token punctuation">&quot;</span></span></span>
    <span class="token punctuation">&gt;</span></span>
      {{ data.name }} - {{ data.index }}
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>left</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span>#123456<span class="token punctuation">;</span><span class="token property">width</span><span class="token punctuation">:</span>5px<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>10px</span><span class="token punctuation">&quot;</span></span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>right</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span>#123456<span class="token punctuation">;</span><span class="token property">width</span><span class="token punctuation">:</span>5px<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>10px</span><span class="token punctuation">&quot;</span></span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>XGanttSlider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="right" tabindex="-1"><a class="header-anchor" href="#right" aria-hidden="true">#</a> right</h3>`,4),ea=a("p",null,[n("它的功能与 "),a("code",null,"left"),n(" 插槽一致，仅仅是将 "),a("code",null,"left"),n(" 更换为 "),a("code",null,"right"),n(" 即可，参数与功能完全一致，不再赘述。")],-1),pa=a("p",null,"上述示例的效果如下：",-1),oa=["src"],la=a("p",null,"恭喜您，您现在已经可以完全自定义属于您的甘特图组件了。",-1);function ca(c,ia){const i=l("Description"),t=l("DataParameter"),p=l("RouterLink"),u=l("Badge");return d(),k("div",null,[v,s(i,{author:"jeremyjone",date:"2021-12-10",copyright:"jeremyjone"}),g,a("img",{src:c.$withBase("/assets/slider-basic.png"),alt:"slider-basic"},null,8,m),_,b,s(t,{t:"String",d:"left"}),f,q,s(t,{t:"String",d:""}),a("p",null,[n("设置滑块组件的背景颜色，默认使用 "),s(p,{to:"/vue3-v1/root.html#primary-color"},{default:o(()=>[n("primary-color")]),_:1}),n("。")]),x,y,s(t,{t:"String",d:"yyyy-MM-dd"}),B,z,a("p",null,[n("更多关于日期格式化的属性，参看 "),s(p,{to:"/vue3-v1/common.html#%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B1%9E%E6%80%A7"},{default:o(()=>[n("日期格式化属性")]),_:1})]),E,s(t,{t:"String",d:"无数据 😢"}),S,w,s(t,{t:"Boolean",d:"false"}),D,a("h3",j,[C,n(" highlightDate "),s(u,{text:"+v1.0.2",type:"tip"})]),s(t,{t:"Boolean",d:"false"}),N,F,s(t,{t:"String"}),G,X,A,s(t,{t:"Boolean",d:"false"}),V,s(t,{t:"[Boolean, Function]",d:"false"}),L,M,a("p",null,[n("如果设置了 "),P,n("，则意味着滑块可以被任意拖动。当拖动结束时，修改数据，同时会抛出 "),s(p,{to:"/vue3-v1/root.html#move-slider"},{default:o(()=>[R]),_:1}),n(" 事件。")]),$,s(t,{t:"Boolean",d:"false"}),T,s(t,{t:"[Boolean, Number]",d:"false"}),H,I,J,s(t,{t:"Boolean",d:"false"}),K,O,a("p",null,[n("该属性单独设置左侧是否可以被拖动，这意味着滑块可以单独修改起始时间。当拖动结束时，修改数据，同时会抛出 "),s(p,{to:"/vue3-v1/root.html#move-slider"},{default:o(()=>[Q]),_:1}),n(" 事件。")]),U,s(t,{t:"Boolean",d:"false"}),W,Y,a("p",null,[n("该属性单独设置右侧是否可以被拖动，这意味着滑块可以单独修改结束时间。当拖动结束时，修改数据，同时会抛出 "),s(p,{to:"/vue3-v1/root.html#move-slider"},{default:o(()=>[Z]),_:1}),n(" 事件。")]),aa,s(t,{f:"scope = {data:any, level:number}"}),na,s(t,{f:"scope = {data:any, level:number}"}),sa,s(t,{f:"scope = {data:any, level:number}"}),ta,s(t,{f:"scope = {data:any, level:number}"}),ea,pa,a("img",{src:c.$withBase("/assets/slider-content.png"),alt:"slider-content"},null,8,oa),la])}const ra=r(h,[["render",ca],["__file","slider.html.vue"]]);export{ra as default};
