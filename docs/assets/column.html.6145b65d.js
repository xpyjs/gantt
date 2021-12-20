import{r as o,o as r,c as u,a as s,b as a,w as d,F as h,d as n,e as p}from"./app.ab1a4412.js";import{_ as m}from"./plugin-vue_export-helper.21dcd24c.js";const b={},k=a("h1",{id:"\u5217\u7EC4\u4EF6-jganttcolumn",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#\u5217\u7EC4\u4EF6-jganttcolumn","aria-hidden":"true"},"#"),n(" \u5217\u7EC4\u4EF6 JGanttColumn")],-1),_=p(`<p>\u56E0\u4E3A\u6211\u4EEC\u5728\u5185\u90E8\u5DF2\u7ECF\u5C06\u5176\u52A0\u8F7D\uFF0C\u6240\u4EE5\u60A8\u5E76\u4E0D\u9700\u8981\u663E\u793A\u7684\u518D\u6B21\u5BFC\u5165\u5230\u60A8\u7684\u7EC4\u4EF6\u4E2D\u5C31\u53EF\u4EE5\u4F7F\u7528\u3002</p><p>\u5217\u7EC4\u4EF6\u4F1A\u663E\u793A\u5728\u7518\u7279\u8868\u7684\u5DE6\u4FA7\uFF0C\u5982\u679C\u6CA1\u6709\u63D0\u4F9B\uFF0C\u5219\u4E0D\u663E\u793A\u4EFB\u4F55\u5217\u3002</p><h2 id="\u57FA\u7840\u4F7F\u7528" tabindex="-1"><a class="header-anchor" href="#\u57FA\u7840\u4F7F\u7528" aria-hidden="true">#</a> \u57FA\u7840\u4F7F\u7528</h2><p>\u60A8\u53EA\u9700\u8981\u7B80\u5355\u7684\u5C06\u5176\u63D2\u5165\u5230\u6839\u7EC4\u4EF6\u5185\u5373\u53EF\u3002</p><p>\u57FA\u4E8E\u5165\u95E8\u7684\u793A\u4F8B\uFF0C\u60A8\u53EF\u4EE5\u76F4\u63A5\u8FD9\u6837\u4F7F\u7528\uFF1A</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt</span>
    <span class="token attr-name">data-index</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:data</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dataList<span class="token punctuation">&quot;</span></span>
<span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt-column</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>j-gantt</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line">\xA0</div><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>\u5B83\u5C06\u663E\u793A\u6210\u5982\u4E0B\u5185\u5BB9\uFF1A</p>`,7),g=["src"],v=a("h2",{id:"\u5C5E\u6027",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#\u5C5E\u6027","aria-hidden":"true"},"#"),n(" \u5C5E\u6027")],-1),f=a("h3",{id:"center",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#center","aria-hidden":"true"},"#"),n(" center")],-1),x=a("p",null,"\u53EF\u4EE5\u63A7\u5236\u5F53\u524D\u5217\u7684\u5185\u5BB9\u5C45\u4E2D\uFF0C\u9ED8\u8BA4\u5C45\u5DE6\u3002",-1),y={id:"column-class",tabindex:"-1"},j=a("a",{class:"header-anchor",href:"#column-class","aria-hidden":"true"},"#",-1),q=n(" column-class "),B=a("p",null,"\u5141\u8BB8\u5411\u5217\u5757\u5185\u6CE8\u5165\u7C7B\u540D\uFF0C\u4E0E\u539F\u751F\u4F7F\u7528\u65B9\u6CD5\u4E00\u6837\u3002",-1),w={id:"column-style",tabindex:"-1"},E=a("a",{class:"header-anchor",href:"#column-style","aria-hidden":"true"},"#",-1),S=n(" column-style "),C=a("p",null,"\u5141\u8BB8\u5411\u5217\u5757\u5185\u6CE8\u5165\u6837\u5F0F\uFF0C\u4E0E\u539F\u751F\u4F7F\u7528\u65B9\u6CD5\u4E00\u6837\u3002",-1),F=a("h3",{id:"date-format",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#date-format","aria-hidden":"true"},"#"),n(" date-format")],-1),N=a("p",null,"\u81EA\u5B9A\u4E49\u663E\u793A\u65E5\u671F\u7684\u683C\u5F0F\u3002\u5982\u679C\u5217\u5185\u9700\u8981\u663E\u793A\u65E5\u671F\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8BE5\u5C5E\u6027\u6765\u683C\u5F0F\u5316\u65E5\u671F\u3002",-1),D=a("div",{class:"custom-container warning"},[a("p",{class:"custom-container-title"},"\u8BF7\u6CE8\u610F"),a("p",null,"\u503C\u5F97\u6CE8\u610F\u7684\u662F\uFF0C\u5982\u679C\u7ED9\u51FA\u8BE5\u5B57\u6BB5\uFF0C\u90A3\u4E48\u5176\u6570\u636E\u5185\u5BB9\u4E00\u5B9A\u4F1A\u88AB\u5F53\u6210\u65E5\u671F\u6765\u89E3\u6790\u5E76\u4E14\u683C\u5F0F\u5316\uFF0C\u6240\u4EE5\u4E0D\u8981\u5728\u975E\u65E5\u671F\u5B57\u6BB5\u6DFB\u52A0\u8BE5\u5C5E\u6027\u3002")],-1),V=n("\u66F4\u591A\u5173\u4E8E\u65E5\u671F\u683C\u5F0F\u5316\u7684\u5C5E\u6027\uFF0C\u53C2\u770B "),A=n("\u65E5\u671F\u683C\u5F0F\u5316\u5C5E\u6027"),L=a("h3",{id:"empty-data",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#empty-data","aria-hidden":"true"},"#"),n(" empty-data")],-1),M=a("p",null,"\u8BBE\u7F6E\u7A7A\u6570\u636E\u65F6\u663E\u793A\u7684\u5185\u5BB9\u3002\u5982\u679C\u6570\u636E\u5185\u5BB9\u4E3A\u7A7A\uFF0C\u5219\u4F1A\u663E\u793A\u7A7A\u6570\u636E\u5185\u5BB9\u3002",-1),O={id:"label",tabindex:"-1"},P=a("a",{class:"header-anchor",href:"#label","aria-hidden":"true"},"#",-1),R=n(" label* "),G=n(),J=p(`<p><code>label</code> \u662F\u4E00\u4E2A\u5FC5\u586B\u5C5E\u6027\uFF0C\u5B83\u5E94\u5F53\u5BF9\u5E94\u60A8\u7ED9\u51FA\u6570\u636E\u7684\u67D0\u4E00\u4E2A\u952E\u540D\u3002</p><p>\u5B83\u5C06\u52A0\u8F7D\u8BE5\u5B57\u6BB5\u6570\u636E\u7684\u5185\u5BB9\u663E\u793A\u5728\u5217\u5185\u5BB9\u4E2D\uFF0C\u540C\u65F6\u8868\u5934\u7684\u540D\u79F0\u9ED8\u8BA4\u4E5F\u4F1A\u663E\u793A\u4E3A\u8BE5 <code>label</code> \u540D\u79F0\u3002\u5F53\u7136\uFF0C\u60A8\u53EF\u4EE5\u901A\u8FC7\u8BBE\u7F6E <a href="#name"><code>name</code></a> \u6765\u81EA\u5B9A\u4E49\u3002</p><div class="custom-container tip"><p class="custom-container-title">\u66F4\u65B0</p><p>\u4ECE <code>v1.1.7</code> \u5F00\u59CB\uFF0C\u5B83\u652F\u6301\u901A\u8FC7 <code>.</code> \u6DF1\u5EA6\u8BFB\u53D6\u5BF9\u8C61\u5185\u90E8\u5C5E\u6027\u3002</p><p>\u6BD4\u5982\u539F\u59CB\u5BF9\u8C61\u4E3A\uFF1A</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token punctuation">{</span>
  a<span class="token operator">:</span> <span class="token punctuation">{</span>
    b<span class="token operator">:</span> <span class="token punctuation">{</span>
      c<span class="token operator">:</span> <span class="token string">&#39;1&#39;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>\u90A3\u4E48\uFF0C<code>label</code> \u53EF\u4EE5\u901A\u8FC7 <code>a.b.c</code> \u76F4\u63A5\u8BFB\u53D6\u5230\u503C\uFF0C\u800C\u4E0D\u7528\u50CF\u4E4B\u524D\u90A3\u6837\u9700\u8981\u901A\u8FC7\u6A21\u677F\u5BFC\u51FA\u6570\u636E\u518D\u8BFB\u53D6\u5185\u90E8\u5C5E\u6027\u3002</p></div><h3 id="merge" tabindex="-1"><a class="header-anchor" href="#merge" aria-hidden="true">#</a> merge</h3>`,4),T=p(`<p>\u8BBE\u7F6E\u5F53\u524D\u5217\u662F\u5426\u9700\u8981\u4E0E\u524D\u4E00\u5217\u5408\u5E76\u3002\u60A8\u53EF\u4EE5\u7ED9\u51FA\u4E00\u4E2A Boolean \u503C\u6216\u8005\u4E00\u4E2A\u8FD4\u56DE Boolean \u503C\u7684\u51FD\u6570\u3002</p><ul><li>\u51FD\u6570\u5141\u8BB8\u60A8\u4F7F\u7528\u884C\u5185\u6570\u636E\u3002</li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token function-variable function">mergeFunc</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// your code</span>
    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token comment">// \u8BF7\u786E\u4FDD\u8FD4\u56DE\u4E00\u4E2A Boolean \u503C\u3002</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>\u8FD9\u662F\u4E00\u4E2A\u5F88\u7075\u6D3B\u7684\u5C5E\u6027\uFF0C\u5982\u679C\u8BBE\u7F6E\u4E3A <code>true</code>\uFF0C\u5219\u4F1A\u4E0E\u524D\u4E00\u5217\u8FDB\u884C\u5408\u5E76\uFF0C\u540C\u65F6\u4E0D\u663E\u793A\u5F53\u524D\u5217\u7684\u5185\u5BB9\u3002</p><p><strong>\u8BF7\u6CE8\u610F</strong>\uFF0C\u8BE5\u5B57\u6BB5\u5BF9\u9996\u5217\u65E0\u6548\u3002</p><h3 id="name" tabindex="-1"><a class="header-anchor" href="#name" aria-hidden="true">#</a> name</h3>`,6),$=a("p",null,[n("\u8BBE\u7F6E\u8BE5\u5217\u8868\u5934\u7684\u663E\u793A\u6587\u672C\uFF0C\u5982\u679C\u6CA1\u6709\uFF0C\u5219\u4F1A\u663E\u793A "),a("code",null,"label"),n(" \u7684\u5185\u5BB9\u3002\u5B83\u7684\u4F18\u5148\u7EA7\u6BD4 "),a("code",null,"label"),n(" \u9AD8\u3002")],-1),z=a("h3",{id:"selectable",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#selectable","aria-hidden":"true"},"#"),n(" selectable")],-1),H=a("p",null,"\u8BBE\u7F6E\u5F53\u524D\u5217\u5185\u5BB9\u7684\u6587\u672C\u662F\u5426\u53EF\u4EE5\u9009\u62E9\uFF0C\u9ED8\u8BA4\u7981\u6B62\u9009\u62E9\u3002",-1),I=a("h3",{id:"width",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#width","aria-hidden":"true"},"#"),n(" width")],-1),K=a("p",null,"\u8BBE\u7F6E\u8BE5\u5217\u7684\u5217\u5BBD\u3002\u9ED8\u8BA4\u5BBD\u5EA6 80\uFF0C\u8BF7\u4FDD\u6301\u5BBD\u5EA6\u5927\u4E8E 30\uFF0C\u5426\u5219\u4F1A\u5F15\u8D77\u6E32\u67D3\u5F02\u5E38\u3002",-1),Q=a("h2",{id:"\u63D2\u69FD",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#\u63D2\u69FD","aria-hidden":"true"},"#"),n(" \u63D2\u69FD")],-1),U=a("h3",{id:"default",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#default","aria-hidden":"true"},"#"),n(" default")],-1),W=p(`<p>\u5217\u7EC4\u4EF6\u5185\u90E8\u5141\u8BB8\u60A8\u63D2\u5165\u4EFB\u4F55\u5185\u5BB9\uFF0C\u540C\u65F6\u5B83\u4F1A\u629B\u51FA\u5F53\u524D\u884C\u7684\u6570\u636E\u4EE5\u4F9B\u60A8\u4F7F\u7528\u3002</p><p>\u4E00\u4E2A\u7B80\u5355\u7684\u793A\u4F8B\uFF1A</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt-column</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>name<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">v-slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>data<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>{{ data }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>j-gantt-column</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>\u63A5\u4E0B\u6765\uFF0C\u60A8\u5C06\u7EE7\u7EED\u5B66\u4E60\u6ED1\u5757\u7EC4\u4EF6\u7684\u5185\u5BB9\u3002</p>`,4);function X(c,Y){const l=o("Description"),t=o("DataParameter"),e=o("Badge"),i=o("RouterLink");return r(),u(h,null,[k,s(l,{author:"jeremyjone",date:"2021-09-26",copyright:"jeremyjone"}),_,a("img",{src:c.$withBase("/assets/column-basic.png"),alt:"column-basic"},null,8,g),v,f,s(t,{t:"Boolean",d:"false"}),x,a("h3",y,[j,q,s(e,{type:"tip",text:"+v1.1.7",vertical:"top"})]),s(t,{t:"Object | String",d:"{}"}),B,a("h3",w,[E,S,s(e,{type:"tip",text:"+v1.1.7",vertical:"top"})]),s(t,{t:"Object | String",d:"{}"}),C,F,s(t,{t:"String",d:"yyyy-MM-dd"}),N,D,a("p",null,[V,s(i,{to:"/common.html#%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B1%9E%E6%80%A7"},{default:d(()=>[A]),_:1})]),L,s(t,{t:"String",d:"\u65E0\u6570\u636E \u{1F622}"}),M,a("h3",O,[P,R,s(e,{text:"required",type:"danger"}),G,s(e,{type:"tip",text:"update v1.1.7",vertical:"top"})]),s(t,{r:"",t:"String"}),J,s(t,{t:"(data) => boolean | Boolean",d:"false"}),T,s(t,{t:"String"}),$,z,s(t,{t:"Boolean",d:"false"}),H,I,s(t,{t:"Number | String",d:"80"}),K,Q,U,s(t,{f:"scope = data:any"}),W],64)}var na=m(b,[["render",X]]);export{na as default};
