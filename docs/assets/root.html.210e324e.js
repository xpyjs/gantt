import{r as d,o as r,c as h,a as n,b as e,w as l,F as p,d as t,e as o}from"./app.0a6247fe.js";import{_ as u}from"./plugin-vue_export-helper.21dcd24c.js";const _={},b=e("h1",{id:"\u6839\u7EC4\u4EF6-jgantt",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u6839\u7EC4\u4EF6-jgantt","aria-hidden":"true"},"#"),t(" \u6839\u7EC4\u4EF6 JGantt")],-1),g=e("p",null,[t("\u5BF9\u4E8E "),e("code",null,"JGantt"),t(" \u7EC4\u4EF6\uFF0C\u5B83\u5177\u6709\u975E\u5E38\u4E30\u5BCC\u7684\u5C5E\u6027\u3002")],-1),m=e("h2",{id:"\u6570\u636E",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u6570\u636E","aria-hidden":"true"},"#"),t(" \u6570\u636E")],-1),k=e("h3",{id:"data",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#data","aria-hidden":"true"},"#"),t(" data")],-1),x=o(`<p>\u6570\u636E\u6E90\uFF0C\u63A5\u6536\u6570\u7EC4\u7C7B\u578B\uFF0C\u540C\u65F6\u6570\u7EC4\u4E2D\u7684\u6BCF\u4E00\u4E2A\u5BF9\u8C61\u90FD\u5E94\u5F53\u5305\u542B <code>index</code>, <code>startDate</code>, <code>endDate</code> \u548C <code>children</code> \u8FD9\u4E9B\u952E\uFF0C\u786E\u4FDD\u6B63\u786E\u663E\u793A\u6570\u636E\u5185\u5BB9\u3002</p><div class="custom-container tip"><p class="custom-container-title">\u63D0\u793A</p><ul><li><code>index</code> \u786E\u4FDD\u6570\u636E\u7684\u552F\u4E00\u6027\uFF0C\u5B83\u5E94\u5BF9\u4E8E\u6240\u6709\u6570\u636E\u5168\u5C40\u552F\u4E00\u7684</li><li><code>children</code> \u53EF\u4EE5\u4F7F\u6570\u636E\u5C42\u7EA7\u5D4C\u5957\uFF0C\u5982\u679C\u6CA1\u6709\u5B50\u96C6\uFF0C\u53EA\u9700\u8981\u7F6E\u7A7A\u5373\u53EF</li><li><code>startDate</code> \u53EF\u4EE5\u5728\u7518\u7279\u56FE\u4E2D\u6B63\u786E\u6E32\u67D3\u6570\u636E\u7684\u8D77\u59CB\u65E5\u671F</li><li><code>endDate</code> \u53EF\u4EE5\u5728\u7518\u7279\u56FE\u4E2D\u6B63\u786E\u6E32\u67D3\u6570\u636E\u7684\u622A\u6B62\u65E5\u671F</li></ul></div><div class="custom-container warning"><p class="custom-container-title">\u6570\u636E\u7684\u66F4\u65B0\u548C\u9650\u5236</p><p>\u7531\u4E8EVue\u7684\u9650\u5236\uFF0C<code>Array</code> \u7C7B\u578B\u548C <code>Object</code> \u7C7B\u578B\u4E0D\u4F1A\u81EA\u52A8\u76D1\u542C\u5230\u5B50\u5C42\u7EA7\uFF0C\u8FD9\u5BFC\u81F4\u5F53\u60A8\u4FEE\u6539\u5B50\u7EA7\u5185\u5BB9\u65F6\u4E0D\u4F1A\u66F4\u65B0\u89C6\u56FE\u3002</p><ul><li>\u60A8\u53EF\u4EE5\u4F7F\u7528 <code>vm.$set()</code> \u7684\u65B9\u5F0F\u3002</li><li><strong>\u63A8\u8350</strong>\uFF1A\u6211\u4EEC\u5EFA\u8BAE\u60A8\u53EF\u4EE5\u76F4\u63A5\u4FEE\u6539\u5B50\u96C6\u5185\u5BB9\u65F6\uFF0C\u5728\u6700\u540E\u91CD\u65B0\u7ED9 <code>data</code> \u8D4B\u503C\u5373\u53EF\u3002</li></ul><p>\u5373\uFF1A</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// \u6DFB\u52A0\u6570\u636E</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>children<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>somedata<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// \u6700\u540E\u91CD\u65B0\u8D4B\u503C\uFF0C\u4EE5\u786E\u4FDD\u6570\u636E\u66F4\u65B0</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>data <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>\u8FD9\u6837\u7684\u65B9\u5F0F\u9002\u7528\u4E8E\u6240\u6709\u9488\u5BF9\u5C42\u7EA7\u6570\u636E\u7684<strong>\u589E\u3001\u5220\u3001\u6539</strong>\uFF0C\u540C\u65F6\u60A8\u5E76\u4E0D\u9700\u8981\u62C5\u5FC3\u6240\u6709\u6570\u636E\u90FD\u4F1A\u91CD\u65B0\u6E32\u67D3\u3002\u5728 JGantt \u5185\u90E8\uFF0C\u6211\u4EEC\u4F1A\u68C0\u67E5\u6570\u636E\u7684\u53D8\u52A8\uFF0C\u786E\u4FDD\u53EA\u66F4\u65B0\u6709\u66F4\u6539\u7684\u5185\u5BB9\u3002</p><p>\u5F53\u7136\uFF0C\u5982\u679C\u662F\u4FEE\u6539\u9876\u5C42\u5185\u5BB9\u65F6\uFF0C\u53EF\u4EE5\u76F4\u63A5\u4FEE\u6539\u800C\u4E0D\u9700\u8981\u91CD\u65B0\u8D4B\u503C\uFF0C\u4E0D\u7528\u62C5\u5FC3\u4F1A\u51FA\u73B0\u4E0A\u9762\u7684\u60C5\u51B5\u3002</p></div>`,3),f={id:"data-index",tabindex:"-1"},v=e("a",{class:"header-anchor",href:"#data-index","aria-hidden":"true"},"#",-1),w=t(" data-index* "),y=o('<p>\u6570\u636E\u7684\u5168\u5C40\u552F\u4E00\u952E\uFF0C\u5B83\u5E94\u5F53\u662F\u6570\u636E\u4E2D\u7684\u67D0\u4E00\u4E2A\u952E\u540D\uFF0C\u901A\u5E38\u5B83\u4F1A\u662F <code>index</code>\u3002\u5982\u679C\u5B83\u4E0D\u662F\u5168\u5C40\u552F\u4E00\u7684\uFF0C\u5219\u4F1A\u5F15\u8D77\u6E32\u67D3\u9519\u8BEF\u3002</p><div class="custom-container tip"><p class="custom-container-title">\u63D0\u793A</p><p>\u8FD9\u4E5F\u662F\u6211\u4EEC\u5EFA\u8BAE\u5728 <code>data</code> \u4E2D\u786E\u4FDD\u6709\u4E00\u4E2A <code>index</code> \u5B57\u6BB5\u7684\u5177\u4F53\u4F5C\u7528\u3002\u60A8\u4E5F\u53EF\u4EE5\u4F7F\u7528\u5176\u4ED6\u81EA\u5B9A\u4E49\u5B57\u6BB5\uFF0C\u53EA\u9700\u8981\u5339\u914D\u5373\u53EF\u3002</p></div><h3 id="end-key" tabindex="-1"><a class="header-anchor" href="#end-key" aria-hidden="true">#</a> end-key</h3>',3),j=e("p",null,[t("\u5B83\u5BF9\u5E94\u6570\u636E\u4E2D\u8D77\u59CB\u65E5\u671F\u7684\u952E\uFF0C\u9ED8\u8BA4\u503C\u4E3A "),e("code",null,"endDate"),t("\u3002\u5982\u679C\u627E\u4E0D\u5230\uFF0C\u5219\u4E0D\u4F1A\u6E32\u67D3\u7518\u7279\u56FE\u4E2D\u7684\u5185\u5BB9\u3002")],-1),S=e("h3",{id:"expand-all",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#expand-all","aria-hidden":"true"},"#"),t(" expand-all")],-1),C=e("p",null,[t("\u662F\u5426\u5C55\u5F00\u6240\u6709\u6570\u636E\uFF0C\u9ED8\u8BA4\u4E3A\u5C55\u5F00\u3002\u5982\u679C\u8BBE\u7F6E\u4E3A "),e("code",null,"false"),t("\uFF0C\u5219\u53EA\u4F1A\u6E32\u67D3\u9996\u5C42\u6570\u636E\u3002")],-1),D=e("p",null,[e("strong",null,"\u8BF7\u6CE8\u610F"),t("\uFF0C\u5F53\u4E14\u4EC5\u5F53\u5C5E\u6027 "),e("a",{href:"#show-expand"},[e("code",null,"show-expand")]),t(" \u4E3A\u771F\u65F6\uFF0C\u8BE5\u5C5E\u6027\u624D\u4F1A\u751F\u6548\uFF0C\u5426\u5219\u6240\u6709\u6570\u636E\u4E00\u5B9A\u4F1A\u88AB\u5168\u90E8\u5C55\u5F00\u6E32\u67D3\u3002")],-1),B=e("h3",{id:"start-key",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#start-key","aria-hidden":"true"},"#"),t(" start-key")],-1),O=e("p",null,[t("\u5B83\u5BF9\u5E94\u6570\u636E\u4E2D\u8D77\u59CB\u65E5\u671F\u7684\u952E\uFF0C\u9ED8\u8BA4\u503C\u4E3A "),e("code",null,"startDate"),t("\u3002\u5982\u679C\u627E\u4E0D\u5230\uFF0C\u5219\u4E0D\u4F1A\u6E32\u67D3\u7518\u7279\u56FE\u4E2D\u7684\u5185\u5BB9\u3002")],-1),N=e("h2",{id:"\u6837\u5F0F",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u6837\u5F0F","aria-hidden":"true"},"#"),t(" \u6837\u5F0F")],-1),V=e("h3",{id:"body-style",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#body-style","aria-hidden":"true"},"#"),t(" body-style")],-1),P=e("p",null,"\u7528\u4E8E\u914D\u7F6E\u7518\u7279\u56FE\u5185\u5BB9\u533A\u57DF\u7684\u6837\u5F0F\u3002\u5B83\u63A5\u6536\u56FA\u5B9A\u53C2\u6570\uFF0C\u7528\u4E8E\u6539\u53D8\u5176\u4E2D\u7684\u6837\u5F0F\u3002",-1),A=e("div",{class:"custom-container warning"},[e("p",{class:"custom-container-title"},"\u8BF7\u6CE8\u610F"),e("p",null,[e("code",null,"Object"),t(" \u4E2D\u7684\u952E\u5E94\u5F53\u533A\u5206\u5927\u5C0F\u5199\uFF0C\u8FD9\u4E0E html \u7684\u53C2\u6570\u65B9\u5F0F\u4E0D\u592A\u4E00\u6837\u3002")])],-1),E=e("h4",{id:"bgcolor",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#bgcolor","aria-hidden":"true"},"#"),t(" bgColor")],-1),G=e("p",null,"\u8BBE\u7F6E\u6574\u4F53\u5185\u5BB9\u533A\u57DF\u7684\u80CC\u666F\u989C\u8272\uFF0C\u9ED8\u8BA4\u4E3A\u767D\u8272\u3002",-1),J=e("p",null,[t("\u5B83\u63A5\u6536\u4EFB\u610F\u989C\u8272\u53C2\u6570\uFF0C\u5305\u62EC\u7B26\u5408 html \u89C4\u8303\u7684\u989C\u8272\u82F1\u6587\uFF0C16 \u8FDB\u5236\u989C\u8272\u63CF\u8FF0\uFF08"),e("strong",null,[t("\u6CE8\u610F "),e("code",null,"#"),t(" \u7B26\u53F7\u4E0D\u53EF\u7F3A\u5C11")]),t("\uFF09\uFF0C\u6216\u8005 "),e("code",null,"rgb()"),t(" \u6837\u5F0F\u7684\u5185\u5BB9\uFF0C\u5B83\u53EA\u8981\u662F\u5B57\u7B26\u4E32\u683C\u5F0F\u5373\u53EF\u3002")],-1),T=e("h4",{id:"bordercolor",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#bordercolor","aria-hidden":"true"},"#"),t(" borderColor")],-1),F=e("p",null,"\u8BBE\u7F6E\u6574\u4F53\u5185\u5BB9\u533A\u57DF\u5185\u90E8\u7684\u8FB9\u6846\u989C\u8272\uFF0C\u5B83\u53EA\u8D1F\u8D23\u4F8B\u5982\u8868\u683C\u4E2D\u95F4\u7684\u8FB9\u6846\u3001\u7518\u7279\u533A\u57DF\u7684\u6BCF\u65E5\u5206\u5272\u7EBF\u7B49\u8FB9\u6846\u989C\u8272\u3002",-1),H=e("p",null,[t("\u5B83\u63A5\u6536\u4EFB\u610F\u989C\u8272\u53C2\u6570\uFF0C\u5305\u62EC\u7B26\u5408 html \u89C4\u8303\u7684\u989C\u8272\u82F1\u6587\uFF0C16 \u8FDB\u5236\u989C\u8272\u63CF\u8FF0\uFF08"),e("strong",null,[t("\u6CE8\u610F "),e("code",null,"#"),t(" \u7B26\u53F7\u4E0D\u53EF\u7F3A\u5C11")]),t("\uFF09\uFF0C\u6216\u8005 "),e("code",null,"rgb()"),t(" \u6837\u5F0F\u7684\u5185\u5BB9\uFF0C\u5B83\u53EA\u8981\u662F\u5B57\u7B26\u4E32\u683C\u5F0F\u5373\u53EF\u3002")],-1),I={id:"hovercolor",tabindex:"-1"},L=e("a",{class:"header-anchor",href:"#hovercolor","aria-hidden":"true"},"#",-1),R=t(" hoverColor "),X=e("p",null,"\u8BBE\u7F6E\u60AC\u505C\u884C\u989C\u8272\u3002\u63A5\u6536\u4E00\u4E2AHEX\u989C\u8272\u503C\uFF0C\u82F1\u6587\u65E0\u6548\u3002",-1),q={id:"selectcolor",tabindex:"-1"},$=e("a",{class:"header-anchor",href:"#selectcolor","aria-hidden":"true"},"#",-1),z=t(" selectColor "),K=e("p",null,"\u8BBE\u7F6E\u60AC\u505C\u884C\u989C\u8272\u3002\u63A5\u6536\u4E00\u4E2AHEX\u989C\u8272\u503C\uFF0C\u82F1\u6587\u65E0\u6548\u3002",-1),M=e("h4",{id:"textcolor",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#textcolor","aria-hidden":"true"},"#"),t(" textColor")],-1),Q=e("p",null,"\u8BBE\u7F6E\u6574\u4F53\u5185\u5BB9\u533A\u57DF\u7684\u6587\u672C\u989C\u8272\u3002",-1),U=e("p",null,[t("\u5B83\u63A5\u6536\u4EFB\u610F\u989C\u8272\u53C2\u6570\uFF0C\u5305\u62EC\u7B26\u5408 html \u89C4\u8303\u7684\u989C\u8272\u82F1\u6587\uFF0C16 \u8FDB\u5236\u989C\u8272\u63CF\u8FF0\uFF08"),e("strong",null,[t("\u6CE8\u610F "),e("code",null,"#"),t(" \u7B26\u53F7\u4E0D\u53EF\u7F3A\u5C11")]),t("\uFF09\uFF0C\u6216\u8005 "),e("code",null,"rgb()"),t(" \u6837\u5F0F\u7684\u5185\u5BB9\uFF0C\u5B83\u53EA\u8981\u662F\u5B57\u7B26\u4E32\u683C\u5F0F\u5373\u53EF\u3002")],-1),W=e("h4",{id:"todaycolor",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#todaycolor","aria-hidden":"true"},"#"),t(" todayColor")],-1),Y=o('<p>\u8BBE\u7F6E <code>\u4ECA\u65E5</code> \u65F6\u95F4\u7EBF\u7684\u80CC\u666F\u989C\u8272\u3002</p><p>\u5B83\u63A5\u6536\u4EFB\u610F\u989C\u8272\u53C2\u6570\uFF0C\u5305\u62EC\u7B26\u5408 html \u89C4\u8303\u7684\u989C\u8272\u82F1\u6587\uFF0C16 \u8FDB\u5236\u989C\u8272\u63CF\u8FF0\uFF08<strong>\u6CE8\u610F <code>#</code> \u7B26\u53F7\u4E0D\u53EF\u7F3A\u5C11</strong>\uFF09\uFF0C\u6216\u8005 <code>rgb()</code> \u6837\u5F0F\u7684\u5185\u5BB9\uFF0C\u5B83\u53EA\u8981\u662F\u5B57\u7B26\u4E32\u683C\u5F0F\u5373\u53EF\u3002</p><h4 id="weekendcolor" tabindex="-1"><a class="header-anchor" href="#weekendcolor" aria-hidden="true">#</a> weekendColor</h4>',3),Z=o('<p>\u8BBE\u7F6E <code>\u5468\u672B</code> \u65F6\u95F4\u7EBF\u7684\u80CC\u666F\u989C\u8272\u3002</p><p>\u5B83\u63A5\u6536\u4EFB\u610F\u989C\u8272\u53C2\u6570\uFF0C\u5305\u62EC\u7B26\u5408 html \u89C4\u8303\u7684\u989C\u8272\u82F1\u6587\uFF0C16 \u8FDB\u5236\u989C\u8272\u63CF\u8FF0\uFF08<strong>\u6CE8\u610F <code>#</code> \u7B26\u53F7\u4E0D\u53EF\u7F3A\u5C11</strong>\uFF09\uFF0C\u6216\u8005 <code>rgb()</code> \u6837\u5F0F\u7684\u5185\u5BB9\uFF0C\u5B83\u53EA\u8981\u662F\u5B57\u7B26\u4E32\u683C\u5F0F\u5373\u53EF\u3002</p><h3 id="border" tabindex="-1"><a class="header-anchor" href="#border" aria-hidden="true">#</a> border</h3>',3),ee=e("p",null,"\u662F\u5426\u663E\u793A\u7518\u7279\u8868\u6574\u4F53\u7684\u8FB9\u6846\uFF0C\u9ED8\u8BA4\u4E3A 1\uFF0C0 \u4E3A\u4E0D\u663E\u793A\u3002",-1),te={id:"dark",tabindex:"-1"},ne=e("a",{class:"header-anchor",href:"#dark","aria-hidden":"true"},"#",-1),ae=t(" dark "),se=e("p",null,"\u9ED1\u6697\u6A21\u5F0F\uFF0C\u5B83\u4F1A\u4FEE\u6539\u9875\u9762\u7684\u80CC\u666F\u989C\u8272\u3001\u6587\u5B57\u989C\u8272\u548C\u8FB9\u6846\u989C\u8272\u3002",-1),oe=e("div",{class:"custom-container warning"},[e("p",{class:"custom-container-title"},"\u8BF7\u6CE8\u610F"),e("p",null,"\u5B83\u662F\u9ED8\u8BA4\u5C5E\u6027\uFF0C\u53EA\u4F1A\u8C03\u6574\u9ED8\u8BA4\u503C\u3002\u5982\u679C\u60A8\u8BBE\u7F6E\u4E86\u81EA\u5B9A\u4E49\u7684\u6837\u5F0F\uFF0C\u8BE5\u65B9\u6848\u5219\u4E0D\u4F1A\u751F\u6548\u3002")],-1),de=e("h3",{id:"header-height",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#header-height","aria-hidden":"true"},"#"),t(" header-height")],-1),ce=e("p",null,[t("\u8BBE\u7F6E\u8868\u5934\u7684\u9AD8\u5EA6\uFF0C\u5B83\u7684\u8303\u56F4\u5E94\u8BE5\u81F3\u5C11\u5927\u4E8E "),e("code",null,"30"),t("\uFF0C\u5426\u5219\u4F1A\u5F15\u8D77\u6E32\u67D3\u5F02\u5E38\u3002")],-1),le=e("h3",{id:"header-style",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#header-style","aria-hidden":"true"},"#"),t(" header-style")],-1),ie=e("p",null,"\u7528\u4E8E\u914D\u7F6E\u7518\u7279\u8868\u5934\u7684\u6837\u5F0F\u3002\u5B83\u63A5\u6536\u56FA\u5B9A\u53C2\u6570\uFF0C\u7528\u4E8E\u6539\u53D8\u5176\u4E2D\u7684\u6837\u5F0F\u3002",-1),re=e("div",{class:"custom-container warning"},[e("p",{class:"custom-container-title"},"\u8BF7\u6CE8\u610F"),e("p",null,[e("code",null,"Object"),t(" \u4E2D\u7684\u952E\u5E94\u5F53\u533A\u5206\u5927\u5C0F\u5199\uFF0C\u8FD9\u4E0E html \u7684\u53C2\u6570\u65B9\u5F0F\u4E0D\u592A\u4E00\u6837\u3002")])],-1),he=e("h4",{id:"bgcolor-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#bgcolor-1","aria-hidden":"true"},"#"),t(" bgColor")],-1),pe=e("p",null,"\u8BBE\u7F6E\u8868\u5934\u7684\u80CC\u666F\u989C\u8272\uFF0C\u9ED8\u8BA4\u4E3A\u7070\u8272\u3002",-1),ue=e("p",null,[t("\u5B83\u63A5\u6536\u4EFB\u610F\u989C\u8272\u53C2\u6570\uFF0C\u5305\u62EC\u7B26\u5408 html \u89C4\u8303\u7684\u989C\u8272\u82F1\u6587\uFF0C16 \u8FDB\u5236\u989C\u8272\u63CF\u8FF0\uFF08"),e("strong",null,[t("\u6CE8\u610F "),e("code",null,"#"),t(" \u7B26\u53F7\u4E0D\u53EF\u7F3A\u5C11")]),t("\uFF09\uFF0C\u6216\u8005 "),e("code",null,"rgb()"),t(" \u6837\u5F0F\u7684\u5185\u5BB9\uFF0C\u5B83\u53EA\u8981\u662F\u5B57\u7B26\u4E32\u683C\u5F0F\u5373\u53EF\u3002")],-1),_e=e("h4",{id:"bordercolor-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#bordercolor-1","aria-hidden":"true"},"#"),t(" borderColor")],-1),be=e("p",null,"\u8BBE\u7F6E\u8868\u5934\u7684\u8FB9\u6846\u989C\u8272\uFF0C\u5305\u62EC\u4E2D\u95F4\u7684\u5206\u5272\u7EBF\u3002",-1),ge=e("p",null,[t("\u5B83\u63A5\u6536\u4EFB\u610F\u989C\u8272\u53C2\u6570\uFF0C\u5305\u62EC\u7B26\u5408 html \u89C4\u8303\u7684\u989C\u8272\u82F1\u6587\uFF0C16 \u8FDB\u5236\u989C\u8272\u63CF\u8FF0\uFF08"),e("strong",null,[t("\u6CE8\u610F "),e("code",null,"#"),t(" \u7B26\u53F7\u4E0D\u53EF\u7F3A\u5C11")]),t("\uFF09\uFF0C\u6216\u8005 "),e("code",null,"rgb()"),t(" \u6837\u5F0F\u7684\u5185\u5BB9\uFF0C\u5B83\u53EA\u8981\u662F\u5B57\u7B26\u4E32\u683C\u5F0F\u5373\u53EF\u3002")],-1),me=e("h4",{id:"textcolor-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#textcolor-1","aria-hidden":"true"},"#"),t(" textColor")],-1),ke=e("p",null,"\u8BBE\u7F6E\u8868\u5934\u7684\u6587\u672C\u989C\u8272\u3002",-1),xe=e("p",null,[t("\u5B83\u63A5\u6536\u4EFB\u610F\u989C\u8272\u53C2\u6570\uFF0C\u5305\u62EC\u7B26\u5408 html \u89C4\u8303\u7684\u989C\u8272\u82F1\u6587\uFF0C16 \u8FDB\u5236\u989C\u8272\u63CF\u8FF0\uFF08"),e("strong",null,[t("\u6CE8\u610F "),e("code",null,"#"),t(" \u7B26\u53F7\u4E0D\u53EF\u7F3A\u5C11")]),t("\uFF09\uFF0C\u6216\u8005 "),e("code",null,"rgb()"),t(" \u6837\u5F0F\u7684\u5185\u5BB9\uFF0C\u5B83\u53EA\u8981\u662F\u5B57\u7B26\u4E32\u683C\u5F0F\u5373\u53EF\u3002")],-1),fe=e("h3",{id:"gantt-column-width",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#gantt-column-width","aria-hidden":"true"},"#"),t(" gantt-column-width")],-1),ve=e("p",null,[t("\u8BBE\u7F6E\u7518\u7279\u56FE\u4E2D\u6BCF\u4E00\u5217\u65E5\u671F\u7684\u5217\u5BBD\uFF0C\u9ED8\u8BA4\u4E3A "),e("code",null,"15"),t("\uFF0C\u6700\u5C0F\u503C "),e("code",null,"15"),t("\uFF0C\u6700\u5927\u503C "),e("code",null,"100"),t("\uFF0C\u5E94\u5F53\u786E\u4FDD\u7ED9\u5B9A\u7684\u6570\u5B57\u5728\u8FD9\u4E2A\u533A\u95F4\u8303\u56F4\uFF0C\u5426\u5219\u4F1A\u5F15\u8D77\u6E32\u67D3\u9519\u8BEF\u3002")],-1),we=e("h3",{id:"level-color",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#level-color","aria-hidden":"true"},"#"),t(" level-color")],-1),ye=e("p",null,"\u8BBE\u7F6E\u6BCF\u4E00\u5C42\u7EA7\u6570\u636E\u7684\u989C\u8272\uFF0C\u9ED8\u8BA4\u968F\u80CC\u666F\u989C\u8272\u3002",-1),je=e("p",null,"\u8FD9\u662F\u4E00\u4E2A\u6709\u610F\u601D\u7684\u8BBE\u7F6E\u3002\u56E0\u4E3A\u6570\u636E\u53EF\u4EE5\u662F\u6811\u5F62\u7ED3\u6784\uFF0C\u6240\u4EE5\u4E3A\u4E86\u66F4\u597D\u7684\u533A\u5206\u6811\u5F62\u6570\u636E\u5185\u5BB9\uFF0C\u60A8\u53EF\u4EE5\u4E3A\u4E0D\u540C\u5C42\u7EA7\u7684\u6570\u636E\u5185\u5BB9\u589E\u52A0\u4E0D\u540C\u989C\u8272\u3002",-1),Se=e("p",null,"\u5728\u6E32\u67D3\u65F6\uFF0C\u5BF9\u5E94\u5C42\u7EA7\u7684\u6570\u636E\u4F1A\u5728\u8BE5\u6570\u7EC4\u4E2D\u67E5\u627E\u5BF9\u5E94\u7684\u80CC\u666F\u989C\u8272\uFF0C\u5982\u679C\u5B58\u5728\uFF0C\u90A3\u4E48\u5C31\u4F1A\u6E32\u67D3\uFF0C\u5426\u5219\u6E32\u67D3\u666E\u901A\u80CC\u666F\u989C\u8272\u3002",-1),Ce=e("div",{class:"custom-container tip"},[e("p",{class:"custom-container-title"},"\u63D0\u793A"),e("p",null,"\u4F8B\u5982\uFF0C\u60A8\u7684\u6570\u636E\u6709 3 \u5C42\uFF0C\u90A3\u4E48\u60A8\u53EF\u4EE5\u4F20\u5165\u4E00\u4E2A\u957F\u5EA6\u4E3A 3 \u7684\u6570\u7EC4\uFF0C\u5185\u5BB9\u662F\u6587\u672C\u989C\u8272\uFF0C\u5B83\u63A5\u6536\u4EFB\u610F\u989C\u8272\u53C2\u6570\uFF0C\u5305\u62EC\u7B26\u5408 html \u89C4\u8303\u7684\u6240\u6709\u989C\u8272\uFF0C\u5305\u62EC 16 \u8FDB\u5236\u989C\u8272\u7B49\u3002"),e("p",null,"\u5F53\u7136\uFF0C\u60A8\u4E5F\u53EF\u4EE5\u53EA\u4F20\u5165\u957F\u5EA6\u4E3A 1 \u7684\u6570\u7EC4\uFF0C\u90A3\u4E48\u7518\u7279\u8868\u53EA\u4F1A\u6E32\u67D3\u9876\u5C42\u5C42\u7EA7\u6570\u636E\u7684\u80CC\u666F\u989C\u8272\u3002")],-1),De=e("h3",{id:"row-height",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#row-height","aria-hidden":"true"},"#"),t(" row-height")],-1),Be=e("p",null,[t("\u8BBE\u7F6E\u5185\u5BB9\u533A\u57DF\u7684\u884C\u9AD8\u3002\u9ED8\u8BA4\u503C\u4E3A "),e("code",null,"30"),t("\uFF0C \u6700\u5C0F\u503C "),e("code",null,"20"),t("\uFF0C\u6700\u5927\u503C 70`\u3002\u5E94\u5F53\u786E\u4FDD\u7ED9\u5B9A\u7684\u6570\u5B57\u518D\u8FD9\u4E2A\u533A\u95F4\u8303\u56F4\uFF0C\u5426\u5219\u4F1A\u5F15\u8D77\u6E32\u67D3\u9519\u8BEF\u3002")],-1),Oe=e("h3",{id:"show-checkbox",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#show-checkbox","aria-hidden":"true"},"#"),t(" show-checkbox")],-1),Ne=e("p",null,[t("\u8BBE\u7F6E\u662F\u5426\u663E\u793A\u590D\u9009\u6846\uFF0C\u8FD9\u4E2A\u5BF9\u4E8E\u591A\u9009\u5F88\u6709\u7528\u3002\u5F53\u590D\u9009\u6846\u53EF\u7528\u65F6\uFF0C\u70B9\u51FB\u4F1A\u629B\u51FA "),e("a",{href:"#row-checked"},[e("code",null,"row-checked")]),t(" \u4E8B\u4EF6\u3002")],-1),Ve=e("h3",{id:"show-expand",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#show-expand","aria-hidden":"true"},"#"),t(" show-expand")],-1),Pe=o('<p>\u8BBE\u7F6E\u662F\u5426\u663E\u793A\u5C55\u5F00\u6570\u636E\u6309\u94AE\u3002\u9ED8\u8BA4\u4E3A <code>true</code>\uFF0C\u5982\u679C\u7ED9\u51FA <code>false</code>\uFF0C\u90A3\u4E48\u5C55\u5F00\u6309\u94AE\u4E0D\u53EF\u7528\uFF0C\u540C\u65F6\u6240\u6709\u6570\u636E\u4F1A\u5168\u90E8\u5C55\u5F00\uFF0C\u540C\u65F6 <a href="#expand-all"><code>expand-all</code></a> \u5C5E\u6027\u4F1A\u5931\u6548\u3002</p><div class="custom-container tip"><p class="custom-container-title">\u5EFA\u8BAE</p><p>\u901A\u5E38\u60C5\u51B5\u4E0B\uFF0C\u60A8\u4E0D\u7528\u8BBE\u7F6E\u8FD9\u4E24\u4E2A\u5C5E\u6027\uFF0C\u56E0\u4E3A\u5B83\u4EEC\u5DF2\u7ECF\u5904\u4E8E\u4F7F\u7528\u7684\u72B6\u6001\u3002\u9664\u975E\u60A8\u4E0D\u5E0C\u671B\u5C55\u5F00\u529F\u80FD\uFF0C\u8BBE\u7F6E <code>show-expand</code> \u4E3A <code>false</code> \u5373\u53EF\u3002</p></div><h3 id="show-today" tabindex="-1"><a class="header-anchor" href="#show-today" aria-hidden="true">#</a> show-today</h3>',3),Ae=e("p",null,[t("\u8BBE\u7F6E\u662F\u5426\u663E\u793A\u7518\u7279\u56FE\u4E2D\u7684 "),e("code",null,"\u4ECA\u65E5"),t(" \u65F6\u95F4\u7EBF\u3002")],-1),Ee=e("h3",{id:"show-weekend",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#show-weekend","aria-hidden":"true"},"#"),t(" show-weekend")],-1),Ge=e("p",null,[t("\u8BBE\u7F6E\u662F\u5426\u663E\u793A\u7518\u7279\u56FE\u4E2D\u7684 "),e("code",null,"\u5468\u672B"),t(" \u65F6\u95F4\u7EBF\u3002")],-1),Je=e("h2",{id:"\u4E8B\u4EF6",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u4E8B\u4EF6","aria-hidden":"true"},"#"),t(" \u4E8B\u4EF6")],-1),Te=e("h3",{id:"no-today-error",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#no-today-error","aria-hidden":"true"},"#"),t(" no-today-error")],-1),Fe=e("p",null,[t("\u70B9\u51FB "),e("code",null,"\u8DF3\u8F6C\u5230\u4ECA\u65E5"),t(" \u6309\u94AE\u65F6\uFF0C"),e("code",null,"\u4ECA\u65E5"),t(" \u4E0D\u5728\u5F53\u524D\u7518\u7279\u8303\u56F4\u5185\u6240\u89E6\u53D1\u7684\u5F02\u5E38\uFF0C\u53EF\u4EE5\u63A5\u6536\u8BE5\u5F02\u5E38\u5E76\u81EA\u5B9A\u4E49\u540E\u7EED\u4E8B\u4EF6\u3002")],-1),He=e("h3",{id:"move-slider",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#move-slider","aria-hidden":"true"},"#"),t(" move-slider")],-1),Ie=e("ul",null,[e("li",null,"data: \u66F4\u65B0\u540E\u7684\u6570\u636E\u5185\u5BB9\uFF0CObject")],-1),Le=e("p",null,"\u79FB\u52A8\u7518\u7279\u884C\u6ED1\u5757\u540E\u7684\u4E8B\u4EF6\u3002",-1),Re=e("h3",{id:"row-checked",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#row-checked","aria-hidden":"true"},"#"),t(" row-checked")],-1),Xe=e("ul",null,[e("li",null,"state: \u9009\u4E2D\u72B6\u6001\uFF0Ctrue | false"),e("li",null,"data: \u9009\u4E2D\u7684\u6570\u636E\u5185\u5BB9\uFF0CObject")],-1),qe=e("p",null,"\u9009\u62E9\u590D\u9009\u6846\u65F6\u89E6\u53D1\u7684\u4E8B\u4EF6\u3002",-1),$e=e("h3",{id:"row-click",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#row-click","aria-hidden":"true"},"#"),t(" row-click")],-1),ze=e("ul",null,[e("li",null,"data: \u884C\u6570\u636E\u5185\u5BB9\uFF0CObject | null")],-1),Ke=e("p",null,"\u5355\u51FB\u884C\u5143\u7D20\u65F6\u89E6\u53D1\u7684\u4E8B\u4EF6\u3002",-1),Me=e("div",{class:"custom-container tip"},[e("p",{class:"custom-container-title"},"TIP"),e("p",null,[t("\u5F53\u60A8\u9009\u62E9\u4E86\u4E00\u884C\u5185\u5BB9\uFF0C\u5E76\u4E14\u5728\u5916\u90E8\u66F4\u65B0\u4E86\u6570\u636E\uFF0C\u4F7F\u5F97\u8BE5\u6761\u6570\u636E\u88AB\u5220\u9664\uFF0C\u5219\u4F1A\u89E6\u53D1\u4E00\u4E2A\u9009\u62E9 "),e("code",null,"null"),t(" \u7684\u4E8B\u4EF6\u3002")]),e("p",null,"\u8FD9\u6837\u505A\u7684\u597D\u5904\u662F\u60A8\u4E0D\u5FC5\u62C5\u5FC3\u5728\u5916\u90E8\u518D\u6B21\u8C03\u7528\u8BE5\u65E0\u6548\u5185\u5BB9\u3002")],-1),Qe=e("h3",{id:"row-dbl-click",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#row-dbl-click","aria-hidden":"true"},"#"),t(" row-dbl-click")],-1),Ue=e("ul",null,[e("li",null,"data: \u884C\u6570\u636E\u5185\u5BB9\uFF0CObject")],-1),We=e("p",null,"\u53CC\u51FB\u884C\u5143\u7D20\u65F6\u89E6\u53D1\u7684\u4E8B\u4EF6\u3002",-1),Ye=e("h2",{id:"\u65B9\u6CD5",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u65B9\u6CD5","aria-hidden":"true"},"#"),t(" \u65B9\u6CD5")],-1),Ze={id:"setselected",tabindex:"-1"},et=e("a",{class:"header-anchor",href:"#setselected","aria-hidden":"true"},"#",-1),tt=t(" setSelected "),nt=e("p",null,"\u5141\u8BB8\u5411\u7EC4\u4EF6\u8BBE\u7F6E\u9009\u62E9\u9879\uFF0C\u5B83\u4F1A\u6E32\u67D3\u8BE5\u9879\u5185\u5BB9\u4E3A\u5DF2\u9009\u62E9\u72B6\u6001\u3002",-1),at=e("div",{class:"custom-container tip"},[e("p",{class:"custom-container-title"},"TIP"),e("p",null,[t("\u53C2\u6570 "),e("code",null,"data"),t(" \u5E94\u8BE5\u662F\u6570\u636E\u5217\u8868\u4E2D\u7684\u67D0\u4E00\u4E2A\u5143\u7D20\u3002")])],-1),st=e("h2",{id:"\u63D2\u69FD",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u63D2\u69FD","aria-hidden":"true"},"#"),t(" \u63D2\u69FD")],-1),ot=e("p",null,"\u6839\u7EC4\u4EF6\u4E0D\u652F\u6301\u63D2\u5165\u9ED8\u8BA4\u5185\u5BB9\uFF0C\u5B83\u4EC5\u4EC5\u652F\u6301\u5982\u4E0B\u7684\u5177\u540D\u63D2\u69FD\u6216\u8005\u6211\u4EEC\u63D0\u4F9B\u7684\u5B50\u7EC4\u4EF6\u3002",-1),dt={id:"settings",tabindex:"-1"},ct=e("a",{class:"header-anchor",href:"#settings","aria-hidden":"true"},"#",-1),lt=t(" settings "),it=o(`<p><em>\u6211\u4E0D\u77E5\u9053\u8FD9\u4E2A\u63D2\u69FD\u662F\u5426\u771F\u6B63\u9700\u8981\uFF0C\u4F46\u8FD8\u662F\u628A\u5B83\u6DFB\u52A0\u4E86\u3002</em></p><p>\u8FD9\u4E2A\u63D2\u69FD\u4F1A\u5141\u8BB8\u60A8\u5728\u8BBE\u7F6E\u62BD\u5C49\u4E2D\u6DFB\u52A0\u4EFB\u610F\u5185\u5BB9\u3002</p><p>\u4F7F\u7528\u65B9\u5F0F\uFF1A</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>settings</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!-- any element --&gt;</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="\u5217\u7EC4\u4EF6" tabindex="-1"><a class="header-anchor" href="#\u5217\u7EC4\u4EF6" aria-hidden="true">#</a> \u5217\u7EC4\u4EF6</h3>`,5),rt=t("\u53C2\u89C1 "),ht=t("\u5217\u7EC4\u4EF6"),pt=e("h3",{id:"\u6ED1\u5757\u7EC4\u4EF6",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#\u6ED1\u5757\u7EC4\u4EF6","aria-hidden":"true"},"#"),t(" \u6ED1\u5757\u7EC4\u4EF6")],-1),ut=t("\u53C2\u89C1 "),_t=t("\u6ED1\u5757\u7EC4\u4EF6"),bt=e("hr",null,null,-1),gt=e("p",null,"\u63A5\u4E0B\u6765\uFF0C\u60A8\u5C06\u6DF1\u5165\u5B66\u4E60\u4F7F\u7528\u8FD9\u4E24\u4E2A\u7EC4\u4EF6\u3002",-1);function mt(kt,xt){const i=d("Description"),a=d("DataParameter"),s=d("Badge"),c=d("RouterLink");return r(),h(p,null,[b,n(i,{author:"jeremyjone",date:"2020-12-02",copyright:"jeremyjone"}),g,m,k,n(a,{t:"Array",d:"[]"}),x,e("h3",f,[v,w,n(s,{text:"required",type:"danger"})]),n(a,{r:"",t:"String"}),y,n(a,{t:"String",d:"endDate"}),j,S,n(a,{t:"Boolean",d:"true"}),C,D,B,n(a,{t:"String",d:"startDate"}),O,N,V,n(a,{t:"Object",d:"{}"}),P,A,E,n(a,{t:"String",d:"white"}),G,J,T,n(a,{t:"String",d:"lightgrey"}),F,H,e("h4",I,[L,R,n(s,{type:"tip",text:"+v0.0.7",vertical:"top"})]),n(a,{t:"String",d:"#ccc"}),X,e("h4",q,[$,z,n(s,{type:"tip",text:"+v0.0.7",vertical:"top"})]),n(a,{t:"String",d:"#123456"}),K,M,n(a,{t:"String",d:"black"}),Q,U,W,n(a,{t:"String",d:"lightblue"}),Y,n(a,{t:"String",d:"lightgrey"}),Z,n(a,{t:"Number",d:"1"}),ee,e("h3",te,[ne,ae,n(s,{type:"tip",text:"+v0.0.15",vertical:"top"})]),n(a,{t:"Boolean",d:"false"}),se,oe,de,n(a,{t:"Number | String",d:"100"}),ce,le,n(a,{t:"Object",d:"{}"}),ie,re,he,n(a,{t:"String",d:"grey"}),pe,ue,_e,n(a,{t:"String",d:"black"}),be,ge,me,n(a,{t:"String",d:"black"}),ke,xe,fe,n(a,{t:"Number | String",d:"15"}),ve,we,n(a,{t:"Array",d:"[]"}),ye,je,Se,Ce,De,n(a,{t:"Number | String",d:"30"}),Be,Oe,n(a,{t:"Boolean",d:"false"}),Ne,Ve,n(a,{t:"Boolean",d:"true"}),Pe,n(a,{t:"Boolean",d:"true"}),Ae,Ee,n(a,{t:"Boolean",d:"true"}),Ge,Je,Te,n(a,{f:"@no-today-error -> function()"}),Fe,He,n(a,{f:"@move-slider -> function(data)"}),Ie,Le,Re,n(a,{f:"@row-checked -> function(state, data)"}),Xe,qe,$e,n(a,{f:"@row-click -> function(data)"}),ze,Ke,Me,Qe,n(a,{f:"@dbl-click -> function(data)"}),Ue,We,Ye,e("h3",Ze,[et,tt,n(s,{type:"tip",text:"+v0.0.16",vertical:"top"})]),n(a,{f:"setSelected: (data: any) => void"}),nt,at,st,ot,e("h3",dt,[ct,lt,n(s,{type:"tip",text:"+v0.0.15",vertical:"top"})]),it,e("p",null,[rt,n(c,{to:"/v0/column.html"},{default:l(()=>[ht]),_:1})]),pt,e("p",null,[ut,n(c,{to:"/v0/slider.html"},{default:l(()=>[_t]),_:1})]),bt,gt],64)}var wt=u(_,[["render",mt]]);export{wt as default};