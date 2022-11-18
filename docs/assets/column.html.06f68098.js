import{_ as d,r as e,o as r,c as u,a as s,b as a,d as n,w as h,e as o}from"./app.beba7141.js";const m={},k=a("h1",{id:"列组件-xganttcolumn",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#列组件-xganttcolumn","aria-hidden":"true"},"#"),n(" 列组件 XGanttColumn")],-1),v=o(`<p>因为我们在内部已经将其加载，所以您并不需要显示的再次导入到您的组件中就可以使用。</p><p>列组件会显示在甘特表的左侧，如果没有提供，则不显示任何列。</p><h2 id="基础使用" tabindex="-1"><a class="header-anchor" href="#基础使用" aria-hidden="true">#</a> 基础使用</h2><p>您只需要简单的将其插入到根组件内即可。</p><p>基于入门的示例，您可以直接这样使用：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt</span>
    <span class="token attr-name">data-index</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:data</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dataList<span class="token punctuation">&quot;</span></span>
<span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt-column</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>x-gantt</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line"> </div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它将显示成如下内容：</p>`,7),g=["src"],b=a("h2",{id:"属性",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#属性","aria-hidden":"true"},"#"),n(" 属性")],-1),_=a("h3",{id:"center",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#center","aria-hidden":"true"},"#"),n(" center")],-1),f=a("p",null,"可以控制当前列的内容居中，默认居左。",-1),x=a("h3",{id:"column-class",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#column-class","aria-hidden":"true"},"#"),n(" column-class")],-1),y=a("p",null,"允许向列块内注入类名，与原生使用方法一样。",-1),q=a("h3",{id:"column-style",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#column-style","aria-hidden":"true"},"#"),n(" column-style")],-1),B=a("p",null,"允许向列块内注入样式，与原生使用方法一样。",-1),j=a("h3",{id:"date-format",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#date-format","aria-hidden":"true"},"#"),n(" date-format")],-1),w=a("p",null,"自定义显示日期的格式。如果列内需要显示日期，可以通过该属性来格式化日期。",-1),E=a("div",{class:"custom-container warning"},[a("p",{class:"custom-container-title"},"请注意"),a("p",null,"值得注意的是，如果给出该字段，那么其数据内容一定会被当成日期来解析并且格式化，所以不要在非日期字段添加该属性。")],-1),S=a("h3",{id:"empty-data",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#empty-data","aria-hidden":"true"},"#"),n(" empty-data")],-1),C=a("p",null,"设置空数据时显示的内容。如果数据内容为空，则会显示空数据内容。",-1),N={id:"label",tabindex:"-1"},D=a("a",{class:"header-anchor",href:"#label","aria-hidden":"true"},"#",-1),V=o(`<p><code>label</code> 是一个必填属性，它应当对应您给出数据的某一个键名。</p><p>它将加载该字段数据的内容显示在列内容中，同时表头的名称默认也会显示为该 <code>label</code> 名称。当然，您可以通过设置 <a href="#name"><code>name</code></a> 来自定义。</p><div class="custom-container tip"><p class="custom-container-title">更新</p><p>从 <code>v1.1.7</code> 开始，它支持通过 <code>.</code> 深度读取对象内部属性。</p><p>比如原始对象为：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token string">&#39;1&#39;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么，<code>label</code> 可以通过 <code>a.b.c</code> 直接读取到值，而不用像之前那样需要通过模板导出数据再读取内部属性。</p></div><h3 id="merge" tabindex="-1"><a class="header-anchor" href="#merge" aria-hidden="true">#</a> merge</h3>`,4),A=o(`<p>设置当前列是否需要与前一列合并。您可以给出一个 Boolean 值或者一个返回 Boolean 值的函数。</p><ul><li>函数允许您使用行内数据。</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function-variable function">mergeFunc</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// your code</span>
    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token comment">// 请确保返回一个 Boolean 值。</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一个很灵活的属性，如果设置为 <code>true</code>，则会与前一列进行合并，同时不显示当前列的内容。</p><p><strong>请注意</strong>，该字段对首列无效。</p><h3 id="name" tabindex="-1"><a class="header-anchor" href="#name" aria-hidden="true">#</a> name</h3>`,6),F=a("p",null,[n("设置该列表头的显示文本，如果没有，则会显示 "),a("code",null,"label"),n(" 的内容。它的优先级比 "),a("code",null,"label"),n(" 高。")],-1),L=a("h3",{id:"selectable",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#selectable","aria-hidden":"true"},"#"),n(" selectable")],-1),M=a("p",null,"设置当前列内容的文本是否可以选择，默认禁止选择。",-1),O=a("h3",{id:"width",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#width","aria-hidden":"true"},"#"),n(" width")],-1),P=a("p",null,"设置该列的列宽。默认宽度 80，请保持宽度大于 30，否则会引起渲染异常。",-1),R=a("h2",{id:"插槽",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#插槽","aria-hidden":"true"},"#"),n(" 插槽")],-1),G=a("h3",{id:"default",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#default","aria-hidden":"true"},"#"),n(" default")],-1),T=o(`<p>列组件内部允许您插入任何内容，同时它会抛出当前行的数据以供您使用。</p><p>一个简单的示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-gantt-column</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>name<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">v-slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>data<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>{{ data }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>x-gantt-column</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，您将继续学习滑块组件的内容。</p>`,4);function X(c,$){const l=e("Description"),t=e("DataParameter"),p=e("RouterLink"),i=e("Badge");return r(),u("div",null,[k,s(l,{author:"jeremyjone",date:"2022-06-22",copyright:"jeremyjone"}),v,a("img",{src:c.$withBase("/assets/column-basic.png"),alt:"column-basic"},null,8,g),b,_,s(t,{t:"Boolean",d:"false"}),f,x,s(t,{t:"Object | String",d:"{}"}),y,q,s(t,{t:"Object | String",d:"{}"}),B,j,s(t,{t:"String",d:"yyyy-MM-dd"}),w,E,a("p",null,[n("更多关于日期格式化的属性，参看 "),s(p,{to:"/vue2/common.html#%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B1%9E%E6%80%A7"},{default:h(()=>[n("日期格式化属性")]),_:1})]),S,s(t,{t:"String",d:"无数据 😢"}),C,a("h3",N,[D,n(" label* "),s(i,{text:"required",type:"danger"})]),s(t,{r:"",t:"String"}),V,s(t,{t:"(data) => boolean | Boolean",d:"false"}),A,s(t,{t:"String"}),F,L,s(t,{t:"Boolean",d:"false"}),M,O,s(t,{t:"Number | String",d:"80"}),P,R,G,s(t,{f:"scope = data:any"}),T])}const H=d(m,[["render",X],["__file","column.html.vue"]]);export{H as default};
