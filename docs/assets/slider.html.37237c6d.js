import{r as c,o as r,c as d,f as s,a as n,w as p,F as k,g as a,h as o}from"./app.62988fa4.js";import{_ as h}from"./plugin-vue_export-helper.21dcd24c.js";const m={},g=n("h1",{id:"\u6ED1\u5757\u7EC4\u4EF6-jganttslider",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#\u6ED1\u5757\u7EC4\u4EF6-jganttslider","aria-hidden":"true"},"#"),a(" \u6ED1\u5757\u7EC4\u4EF6 JGanttSlider")],-1),_=o(`<p>\u56E0\u4E3A\u6211\u4EEC\u5728\u5185\u90E8\u5DF2\u7ECF\u5C06\u5176\u52A0\u8F7D\uFF0C\u6240\u4EE5\u60A8\u5E76\u4E0D\u9700\u8981\u663E\u793A\u7684\u518D\u6B21\u5BFC\u5165\u5230\u60A8\u7684\u7EC4\u4EF6\u4E2D\u5C31\u53EF\u4EE5\u4F7F\u7528\u3002</p><p>\u6ED1\u5757\u7EC4\u4EF6\u5C06\u5141\u8BB8\u60A8\u81EA\u5B9A\u4E49\u7518\u7279\u56FE\u4E2D\u6BCF\u4E00\u884C\u7684\u6ED1\u5757\u5185\u5BB9\u3002</p><div class="custom-container warning"><p class="custom-container-title">\u8BF7\u6CE8\u610F</p><p>\u5728\u4F7F\u7528\u4E4B\u524D\uFF0C\u60A8\u9700\u8981\u6CE8\u610F\uFF0C\u7518\u7279\u56FE\u5185\u90E8\u53EA\u63A5\u6536\u4E00\u4E2A\u6ED1\u5757\u7EC4\u4EF6\u3002\u4E5F\u5C31\u662F\u8BF4\uFF0C\u65E0\u8BBA\u60A8\u5728\u7EC4\u4EF6\u4EFB\u4F55\u4F4D\u7F6E\u63D2\u5165\u4E86\u6ED1\u5757\u7EC4\u4EF6\uFF0C\u5176\u5185\u90E8\u90FD\u53EA\u4F1A\u6E32\u67D3\u6700\u540E\u63D2\u5165\u7684\u90A3\u4E2A\u6ED1\u5757\u7EC4\u4EF6\u3002</p><p>\u6CE8\u610F\uFF0C\u662F\u6700\u540E\u63D2\u5165\u7684\u90A3\u4E2A\u3002</p></div><h2 id="\u57FA\u7840\u4F7F\u7528" tabindex="-1"><a class="header-anchor" href="#\u57FA\u7840\u4F7F\u7528" aria-hidden="true">#</a> \u57FA\u7840\u4F7F\u7528</h2><p>\u60A8\u53EA\u9700\u8981\u7B80\u5355\u7684\u5C06\u5176\u63D2\u5165\u5230\u6839\u7EC4\u4EF6\u5185\u5373\u53EF\u3002</p><p>\u57FA\u4E8E\u5165\u95E8\u7684\u793A\u4F8B\uFF0C\u60A8\u73B0\u5728\u5E94\u8BE5\u62E5\u6709\u4E00\u4E2A\u5217\uFF0C\u90A3\u4E48\u60A8\u53EF\u4EE5\u7EE7\u7EED\u8FD9\u6837\u4F7F\u7528\uFF1A</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt</span>
    <span class="token attr-name">data-index</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:data</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>dataList<span class="token punctuation">&quot;</span></span>
<span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt-column</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt-slider</span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>j-gantt</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line">\xA0</div><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>\u4E3A\u4E86\u4E0E\u539F\u59CB\u5185\u5BB9\u8FDB\u884C\u533A\u5206\uFF0C\u6211\u5728\u5C5E\u6027\u4E2D\u6DFB\u52A0\u4E86\u80CC\u666F\u989C\u8272\uFF0C\u8BF7\u6CE8\u610F\uFF0C\u5B83\u5E76\u4E0D\u662F\u5FC5\u987B\u7684\u3002</p><p>\u5B83\u5C06\u663E\u793A\u6210\u5982\u4E0B\u5185\u5BB9\uFF1A</p>`,9),b=["src"],v=n("h2",{id:"\u5C5E\u6027",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#\u5C5E\u6027","aria-hidden":"true"},"#"),a(" \u5C5E\u6027")],-1),f=n("h3",{id:"alignment",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#alignment","aria-hidden":"true"},"#"),a(" alignment")],-1),q=n("p",null,[a("\u8BBE\u7F6E\u5185\u5BB9\u5BF9\u9F50\u65B9\u5F0F\u3002\u63A5\u6536\u5B57\u7B26\u4E32\uFF1A"),n("code",null,"left"),a("\u3001"),n("code",null,"center"),a(" \u6216 "),n("code",null,"right"),a("\u3002")],-1),x=n("h3",{id:"bg-color",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#bg-color","aria-hidden":"true"},"#"),a(" bg-color")],-1),y=a("\u8BBE\u7F6E\u6ED1\u5757\u7EC4\u4EF6\u7684\u80CC\u666F\u989C\u8272\uFF0C\u9ED8\u8BA4\u4F7F\u7528 "),B=a("primary-color"),z=a("\u3002"),j=n("p",null,"\u5728\u57FA\u7840\u793A\u4F8B\u4E2D\uFF0C\u5DF2\u7ECF\u4F7F\u7528\u4E86\u8BE5\u5C5E\u6027\uFF0C\u53EF\u4EE5\u770B\u5230\u6ED1\u5757\u7684\u6574\u4F53\u80CC\u666F\u8272\u90FD\u4EA7\u751F\u4E86\u53D8\u5316\u3002",-1),E=n("h3",{id:"date-format",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#date-format","aria-hidden":"true"},"#"),a(" date-format")],-1),S=n("p",null,"\u81EA\u5B9A\u4E49\u663E\u793A\u65E5\u671F\u7684\u683C\u5F0F\u3002\u5982\u679C\u6ED1\u5757\u5185\u9700\u8981\u663E\u793A\u65E5\u671F\uFF0C\u53EF\u4EE5\u901A\u8FC7\u8BE5\u5C5E\u6027\u6765\u683C\u5F0F\u5316\u65E5\u671F\u3002",-1),w=n("div",{class:"custom-container warning"},[n("p",{class:"custom-container-title"},"\u8BF7\u6CE8\u610F"),n("p",null,"\u503C\u5F97\u6CE8\u610F\u7684\u662F\uFF0C\u5982\u679C\u7ED9\u51FA\u8BE5\u5B57\u6BB5\uFF0C\u90A3\u4E48\u5176\u6570\u636E\u7684\u8D77\u59CB\u65E5\u671F\u548C\u7ED3\u675F\u65E5\u671F\u90FD\u5C06\u6309\u7167\u8BE5\u683C\u5F0F\u8FDB\u884C\u683C\u5F0F\u5316\u540E\u518D\u88AB\u5C55\u793A\u3002")],-1),D=a("\u66F4\u591A\u5173\u4E8E\u65E5\u671F\u683C\u5F0F\u5316\u7684\u5C5E\u6027\uFF0C\u53C2\u770B "),F=a("\u65E5\u671F\u683C\u5F0F\u5316\u5C5E\u6027"),C=n("h3",{id:"empty-data",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#empty-data","aria-hidden":"true"},"#"),a(" empty-data")],-1),N=n("p",null,"\u8BBE\u7F6E\u7A7A\u6570\u636E\u65F6\u663E\u793A\u7684\u5185\u5BB9\u3002\u5982\u679C\u6570\u636E\u5185\u5BB9\u4E3A\u7A7A\uFF0C\u5219\u4F1A\u663E\u793A\u7A7A\u6570\u636E\u5185\u5BB9\u3002",-1),G=n("h3",{id:"flat",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#flat","aria-hidden":"true"},"#"),a(" flat")],-1),J=n("p",null,"\u8BBE\u7F6E\u6ED1\u5757\u6837\u5F0F\u662F\u5426\u6241\u5E73\u5316\u3002",-1),A=n("h3",{id:"label",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#label","aria-hidden":"true"},"#"),a(" label")],-1),V=n("p",null,[a("\u8BBE\u7F6E\u9700\u8981\u663E\u793A\u7684\u5185\u5BB9\u5B57\u6BB5\u3002\u9ED8\u8BA4\u6CA1\u6709\u8BE5\u5C5E\u6027\u60C5\u51B5\u4E0B\u663E\u793A\u9ED8\u8BA4\u6570\u636E\uFF0C\u5373 "),n("code",null,"empty-data"),a(" \u5B57\u6BB5\u5185\u5BB9\u3002")],-1),L=n("p",null,[a("\u5982\u679C\u60A8\u63D0\u4F9B\u4E86\u63D2\u69FD\u5185\u5BB9\uFF0C\u5219\u65E0\u8BBA\u60A8\u662F\u5426\u63D0\u4F9B\u4E86 "),n("code",null,"label"),a(" \u5C5E\u6027\uFF0C\u90FD\u5C06\u7528\u63D2\u69FD\u7684\u5185\u5BB9\u8FDB\u884C\u66FF\u6362\u3002\u66F4\u591A\u4FE1\u606F\u8BF7\u67E5\u770B "),n("a",{href:"#%E6%8F%92%E6%A7%BD"},"\u63D2\u69FD"),a(" \u3002")],-1),M=n("h3",{id:"linked-resize",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#linked-resize","aria-hidden":"true"},"#"),a(" linked-resize")],-1),P=o('<p>\u8BBE\u7F6E\u6ED1\u5757\u7EC4\u4EF6\u79FB\u52A8\u65F6\uFF0C\u5176\u7236\u3001\u5B50\u6570\u636E\u5185\u5BB9\u662F\u5426\u8DDF\u968F\u6539\u53D8\u3002\u5F53\u542F\u7528\u8BE5\u5C5E\u6027\u540E\uFF0C\u65E0\u8BBA\u60A8\u4F7F\u7528 <a href="#move"><code>move</code></a> \u3001 <a href="#resize-left"><code>resize-left</code></a> \u8FD8\u662F <a href="#resize-right"><code>resize-right</code></a> \uFF0C\u90FD\u5C06\u9075\u5FAA <code>\u8054\u52A8\u89C4\u5219</code>\u3002</p><p><strong>\u8054\u52A8\u89C4\u5219</strong>\uFF1A\u786E\u4FDD\u5B50\u7EA7\u6570\u636E\u4E0D\u4F1A\u8D85\u8D8A\u7236\u7EA7\u6570\u636E\u7684\u65F6\u95F4\u8303\u56F4\uFF0C\u540C\u65F6\u7236\u7EA7\u6570\u636E\u4E0D\u4F1A\u5C0F\u4E8E\u5B50\u7EA7\u6570\u636E\u7684\u65F6\u95F4\u8303\u56F4\u3002</p><div class="custom-container warning"><p class="custom-container-title">\u6CE8\u610F</p><p>\u5728\u6570\u636E\u91CF\u5F88\u5927\u7684\u60C5\u51B5\u4E0B\uFF0C\u542F\u7528\u8BE5\u5C5E\u6027\u53EF\u80FD\u4F1A\u6D88\u8017\u5927\u91CF\u8D44\u6E90\u3002</p></div>',3),R={id:"move",tabindex:"-1"},$=n("a",{class:"header-anchor",href:"#move","aria-hidden":"true"},"#",-1),T=a(" move "),H=n("p",null,"\u8BBE\u7F6E\u6ED1\u5757\u7EC4\u4EF6\u662F\u5426\u53EF\u4EE5\u88AB\u62D6\u52A8\uFF0C\u9ED8\u8BA4\u4E0D\u53EF\u7528\u3002",-1),I=n("ul",null,[n("li",null,[a("Function\uFF1A\u7C7B\u578B "),n("code",null,"({ data: any, level: Number }) => Boolean"),a("\u3002\u5C06\u6570\u636E\u548C\u5C42\u7EA7\u629B\u51FA\uFF0C\u7528\u4E8E\u66F4\u52A0\u7CBE\u51C6\u7684\u5B9A\u4E49\u54EA\u4E9B\u6570\u636E\u53EF\u4EE5\u79FB\u52A8")])],-1),K=a("\u5982\u679C\u8BBE\u7F6E\u4E86 "),O=n("code",null,"true",-1),Q=a("\uFF0C\u5219\u610F\u5473\u7740\u6ED1\u5757\u53EF\u4EE5\u88AB\u4EFB\u610F\u62D6\u52A8\u3002\u5F53\u62D6\u52A8\u7ED3\u675F\u65F6\uFF0C\u4FEE\u6539\u6570\u636E\uFF0C\u540C\u65F6\u4F1A\u629B\u51FA "),U=n("code",null,"move-slider",-1),W=a(" \u4E8B\u4EF6\u3002"),X={id:"progress",tabindex:"-1"},Y=n("a",{class:"header-anchor",href:"#progress","aria-hidden":"true"},"#",-1),Z=a(" progress "),nn=n("p",null,"\u542F\u7528\u8FDB\u5EA6\u6761\u663E\u793A\u3002",-1),an=n("p",null,[a("\u5141\u8BB8\u4F7F\u7528\u8005\u6253\u5F00\u8FDB\u5EA6\u6761\u9009\u9879\u3002\u5982\u679C\u5F00\u542F\u4E86\u8BE5\u9009\u9879\uFF0C\u5219\u53EF\u4EE5\u8BFB\u53D6\u6E90\u6570\u636E\u4E2D\u7684 "),n("code",null,"progress"),a(" \u6570\u503C\uFF0C\u8303\u56F4\u4E3A "),n("code",null,"[0~1]"),a("\uFF0C\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u8F6C\u6362\u4E3A\u767E\u5206\u6BD4\u6570\u503C\u3002")],-1),sn=n("p",null,[a("\u9700\u8981\u6CE8\u610F\u7684\u662F\uFF0C\u8BE5\u5C5E\u6027\u5C3D\u7BA1\u53EF\u4EE5\u5B58\u5728\u4E8E\u6BCF\u4E00\u4E2A\u6570\u636E\u4E2D\uFF0C\u4F46\u662F\u53EA\u6709\u672B\u5C42\u6570\u636E\u4F1A\u88AB\u6B63\u786E\u5C55\u793A\uFF0C\u7236\u7EA7\u7684\u8FDB\u5EA6\u4F1A\u81EA\u52A8\u6839\u636E\u5B50\u9879 "),n("code",null,"children"),a(" \u7684\u5B8C\u6210\u5EA6\u8FDB\u884C\u6362\u7B97\uFF0C\u6240\u4EE5\u53EA\u9700\u8981\u786E\u4FDD\u6BCF\u4E00\u4E2A\u5B50\u9879\u5185\u5BB9\u6B63\u786E\u5373\u53EF\u3002")],-1),tn=n("p",null,"\u540C\u65F6\uFF0C\u5982\u679C\u60A8\u81EA\u5B9A\u4E49\u4E86\u6ED1\u5757\u63D2\u69FD\uFF0C\u90A3\u4E48\u65E0\u8BBA\u60A8\u662F\u5426\u5F00\u542F\u4E86\u8FDB\u5EA6\u6761\uFF0C\u90FD\u4E0D\u4F1A\u663E\u793A\u8FD9\u4E2A\u529F\u80FD\u3002",-1),en={id:"progressdecimal",tabindex:"-1"},pn=n("a",{class:"header-anchor",href:"#progressdecimal","aria-hidden":"true"},"#",-1),on=a(" progressDecimal "),ln=n("p",null,[a("\u5141\u8BB8\u81EA\u5B9A\u4E49\u8FDB\u5EA6\u6761\u6570\u503C\u4F4D\u6570\uFF0C\u9ED8\u8BA4\u53EA\u663E\u793A\u6574\u6570\uFF0C\u901A\u8FC7\u4F20\u9012 "),n("code",null,"true"),a(" \u503C\uFF0C\u53EF\u4EE5\u542F\u52A8\u9ED8\u8BA4 2 \u4F4D\u7684\u5C0F\u6570\u3002")],-1),cn=n("p",null,"\u4E5F\u53EF\u4EE5\u4F20\u9012\u4E00\u4E2A\u6570\u5B57\uFF08\u8303\u56F4\uFF1A[0, 10]\uFF09\u6765\u81EA\u5B9A\u4E49\u663E\u793A\u4F4D\u6570\u3002",-1),un=n("h3",{id:"resize-left",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#resize-left","aria-hidden":"true"},"#"),a(" resize-left")],-1),rn=n("p",null,[n("strong",null,[a("\u8BE5\u5C5E\u6027\u53EA\u6709\u5F53 "),n("code",null,"move"),a(" \u5C5E\u6027\u53EF\u7528\u65F6\u624D\u4F1A\u751F\u6548\u3002")])],-1),dn=n("p",null,"\u8BBE\u7F6E\u6ED1\u5757\u7EC4\u4EF6\u5DE6\u4FA7\u662F\u5426\u53EF\u4EE5\u88AB\u62C9\u4F38\uFF0C\u9ED8\u8BA4\u4E0D\u53EF\u7528\u3002",-1),kn=a("\u8BE5\u5C5E\u6027\u5355\u72EC\u8BBE\u7F6E\u5DE6\u4FA7\u662F\u5426\u53EF\u4EE5\u88AB\u62D6\u52A8\uFF0C\u8FD9\u610F\u5473\u7740\u6ED1\u5757\u53EF\u4EE5\u5355\u72EC\u4FEE\u6539\u8D77\u59CB\u65F6\u95F4\u3002\u5F53\u62D6\u52A8\u7ED3\u675F\u65F6\uFF0C\u4FEE\u6539\u6570\u636E\uFF0C\u540C\u65F6\u4F1A\u629B\u51FA "),hn=n("code",null,"move-slider",-1),mn=a(" \u4E8B\u4EF6\u3002"),gn=n("h3",{id:"resize-right",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#resize-right","aria-hidden":"true"},"#"),a(" resize-right")],-1),_n=n("p",null,[n("strong",null,[a("\u8BE5\u5C5E\u6027\u53EA\u6709\u5F53 "),n("code",null,"move"),a(" \u5C5E\u6027\u53EF\u7528\u65F6\u624D\u4F1A\u751F\u6548\u3002")])],-1),bn=n("p",null,"\u8BBE\u7F6E\u6ED1\u5757\u7EC4\u4EF6\u53F3\u4FA7\u662F\u5426\u53EF\u4EE5\u88AB\u62C9\u4F38\uFF0C\u9ED8\u8BA4\u4E0D\u53EF\u7528\u3002",-1),vn=a("\u8BE5\u5C5E\u6027\u5355\u72EC\u8BBE\u7F6E\u53F3\u4FA7\u662F\u5426\u53EF\u4EE5\u88AB\u62D6\u52A8\uFF0C\u8FD9\u610F\u5473\u7740\u6ED1\u5757\u53EF\u4EE5\u5355\u72EC\u4FEE\u6539\u7ED3\u675F\u65F6\u95F4\u3002\u5F53\u62D6\u52A8\u7ED3\u675F\u65F6\uFF0C\u4FEE\u6539\u6570\u636E\uFF0C\u540C\u65F6\u4F1A\u629B\u51FA "),fn=n("code",null,"move-slider",-1),qn=a(" \u4E8B\u4EF6\u3002"),xn={id:"\u63D2\u69FD",tabindex:"-1"},yn=n("a",{class:"header-anchor",href:"#\u63D2\u69FD","aria-hidden":"true"},"#",-1),Bn=a(" \u63D2\u69FD "),zn=n("div",{class:"custom-container tip"},[n("p",{class:"custom-container-title"},"\u66F4\u65B0\u63D0\u793A"),n("p",null,"\u6240\u6709\u63D2\u69FD\u629B\u51FA\u7684\u5185\u5BB9\u53D8\u66F4\uFF0C\u5728\u629B\u51FA\u5F53\u524D\u6570\u636E\u7684\u540C\u65F6\uFF0C\u4E5F\u629B\u51FA\u5C42\u7EA7\uFF0C\u65B9\u4FBF\u6309\u5C42\u7EA7\u81EA\u5B9A\u4E49\u5185\u5BB9\u3002")],-1),jn=n("h3",{id:"default",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#default","aria-hidden":"true"},"#"),a(" default")],-1),En=o(`<p>\u6ED1\u5757\u7EC4\u4EF6\u5185\u90E8\u5141\u8BB8\u60A8\u63D2\u5165\u4EFB\u4F55\u5185\u5BB9\uFF0C\u5B83\u5C06\u5411\u6ED1\u5757\u5185\u6CE8\u5165\u60A8\u63D0\u4F9B\u7684\u6240\u6709\u6A21\u677F\u5185\u5BB9\u3002\u540C\u65F6\u5B83\u4F1A\u629B\u51FA\u5F53\u524D\u884C\u7684\u6570\u636E\u4EE5\u4F9B\u60A8\u4F7F\u7528\u3002</p><p>\u4E00\u4E2A\u7B80\u5355\u7684\u793A\u4F8B\uFF1A</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt-slider</span> <span class="token attr-name">flat</span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:move</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:linked-resize</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">v-slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{data, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>{{ data.name }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>j-gantt-slider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">\u63D0\u793A</p><p><code>default</code> \u63D2\u69FD\u4F1A\u5305\u542B\u4E00\u5B9A\u6837\u5F0F\uFF0C\u5982\u679C\u60A8\u60F3\u5C1D\u8BD5\u5B8C\u5168\u66FF\u6362\u73B0\u6709\u7684\u6ED1\u5757\u5185\u5BB9\uFF0C\u90A3\u4E48\u4E0B\u9762\u7684\u5185\u5BB9\u5C06\u4F1A\u66F4\u9002\u5408\u3002</p></div><h3 id="content" tabindex="-1"><a class="header-anchor" href="#content" aria-hidden="true">#</a> content</h3>`,5),Sn=o(`<p>\u6709\u65F6\u5019\uFF0C\u60A8\u53EF\u80FD\u9700\u8981\u91CD\u65B0\u5B9A\u4E49\u6ED1\u5757\u6837\u5F0F\uFF0C\u90A3\u4E48\u8FD9\u4E2A\u63D2\u69FD\u4E00\u5B9A\u9002\u5408\u60A8\u3002\u5B83\u4F1A\u4F7F\u7528\u60A8\u63D0\u4F9B\u7684\u63D2\u69FD\u5143\u7D20\u6765\u66FF\u6362\u9ED8\u8BA4\u7684\u6ED1\u5757\u5143\u7D20\uFF0C\u800C\u4E0D\u662F\u5411\u9ED8\u8BA4\u6ED1\u5757\u5185\u90E8\u63D2\u5165\u5185\u5BB9\u3002</p><p>\u4E00\u4E2A\u7B80\u5355\u7684\u793A\u4F8B\uFF1A</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>JGanttSlider</span> <span class="token attr-name">flat</span> <span class="token attr-name">label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>startDate<span class="token punctuation">&quot;</span></span> <span class="token attr-name">bg-color</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>orange<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{data, level}<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
      <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token value css language-css"><span class="token property">background-color</span><span class="token punctuation">:</span> #123456<span class="token punctuation">;</span><span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span><span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span><span class="token property">height</span><span class="token punctuation">:</span>5px</span><span class="token punctuation">&quot;</span></span></span>
    <span class="token punctuation">&gt;</span></span>
      {{ data.name }} - {{ data.index }}
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>JGanttSlider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="left" tabindex="-1"><a class="header-anchor" href="#left" aria-hidden="true">#</a> left</h3>`,4),wn=o(`<p>\u5F53\u60A8\u91CD\u65B0\u5B9A\u4E49\u4E86\u6ED1\u5757\u7684\u6837\u5F0F\uFF0C\u90A3\u4E48\u4FA7\u8FB9\u7684\u6ED1\u52A8\u5757\u4E00\u5B9A\u4E5F\u4E0D\u7B26\u5408\u73B0\u6709\u7684\u9700\u6C42\uFF0C\u6240\u4EE5\u6211\u4EEC\u63D0\u4F9B\u4E86\u91CD\u8F7D\u5DE6\u53F3\u6ED1\u52A8\u5757\u7684\u63D2\u69FD\u3002\u901A\u5E38\u60C5\u51B5\u4E0B\uFF0C\u5B83\u4E0E <code>content</code> \u5E94\u8BE5\u914D\u5957\u4F7F\u7528\u3002</p><p>\u4E00\u4E2A\u7B80\u5355\u7684\u793A\u4F8B\uFF1A</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>JGanttSlider</span>
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
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>JGanttSlider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><h3 id="right" tabindex="-1"><a class="header-anchor" href="#right" aria-hidden="true">#</a> right</h3>`,4),Dn=n("p",null,[a("\u5B83\u7684\u529F\u80FD\u4E0E "),n("code",null,"left"),a(" \u63D2\u69FD\u4E00\u81F4\uFF0C\u4EC5\u4EC5\u662F\u5C06 "),n("code",null,"left"),a(" \u66F4\u6362\u4E3A "),n("code",null,"right"),a(" \u5373\u53EF\uFF0C\u53C2\u6570\u4E0E\u529F\u80FD\u5B8C\u5168\u4E00\u81F4\uFF0C\u4E0D\u518D\u8D58\u8FF0\u3002")],-1),Fn=n("p",null,"\u4E0A\u8FF0\u793A\u4F8B\u7684\u6548\u679C\u5982\u4E0B\uFF1A",-1),Cn=["src"],Nn=n("p",null,"\u606D\u559C\u60A8\uFF0C\u60A8\u73B0\u5728\u5DF2\u7ECF\u53EF\u4EE5\u5B8C\u5168\u81EA\u5B9A\u4E49\u5C5E\u4E8E\u60A8\u7684\u7518\u7279\u56FE\u7EC4\u4EF6\u4E86\u3002",-1);function Gn(u,Jn){const i=c("Description"),t=c("DataParameter"),e=c("RouterLink"),l=c("Badge");return r(),d(k,null,[g,s(i,{author:"jeremyjone",date:"2021-12-10",copyright:"jeremyjone"}),_,n("img",{src:u.$withBase("/assets/slider-basic.png"),alt:"slider-basic"},null,8,b),v,f,s(t,{t:"String",d:"left"}),q,x,s(t,{t:"String",d:""}),n("p",null,[y,s(e,{to:"/root.html#primary-color"},{default:p(()=>[B]),_:1}),z]),j,E,s(t,{t:"String",d:"yyyy-MM-dd"}),S,w,n("p",null,[D,s(e,{to:"/common.html#%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B1%9E%E6%80%A7"},{default:p(()=>[F]),_:1})]),C,s(t,{t:"String",d:"\u65E0\u6570\u636E \u{1F622}"}),N,G,s(t,{t:"Boolean",d:"false"}),J,A,s(t,{t:"String"}),V,L,M,s(t,{t:"Boolean",d:"false"}),P,n("h3",R,[$,T,s(l,{type:"tip",text:"update v1.0.0",vertical:"top"})]),s(t,{t:"[Boolean, Function]",d:"false"}),H,I,n("p",null,[K,O,Q,s(e,{to:"/root.html#move-slider"},{default:p(()=>[U]),_:1}),W]),n("h3",X,[Y,Z,s(l,{type:"tip",text:"+ v1.2.0",vertical:"top"})]),s(t,{t:"Boolean",d:"false"}),nn,an,sn,tn,n("h3",en,[pn,on,s(l,{type:"tip",text:"+ v1.2.0",vertical:"top"})]),s(t,{t:"[Boolean, Number]",d:"false"}),ln,cn,un,s(t,{t:"Boolean",d:"false"}),rn,dn,n("p",null,[kn,s(e,{to:"/root.html#move-slider"},{default:p(()=>[hn]),_:1}),mn]),gn,s(t,{t:"Boolean",d:"false"}),_n,bn,n("p",null,[vn,s(e,{to:"/root.html#move-slider"},{default:p(()=>[fn]),_:1}),qn]),n("h2",xn,[yn,Bn,s(l,{type:"tip",text:"update v1.0.0",vertical:"top"})]),zn,jn,s(t,{f:"scope = {data:any, level:number}"}),En,s(t,{f:"scope = {data:any, level:number}"}),Sn,s(t,{f:"scope = {data:any, level:number}"}),wn,s(t,{f:"scope = {data:any, level:number}"}),Dn,Fn,n("img",{src:u.$withBase("/assets/slider-content.png"),alt:"slider-content"},null,8,Cn),Nn],64)}var Ln=h(m,[["render",Gn]]);export{Ln as default};
