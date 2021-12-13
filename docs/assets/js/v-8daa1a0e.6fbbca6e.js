"use strict";(self.webpackChunkgantt_doc=self.webpackChunkgantt_doc||[]).push([[509],{6464:(n,a,s)=>{s.r(a),s.d(a,{data:()=>e});const e={key:"v-8daa1a0e",path:"/",title:"入门",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"什么是 JzGantt",slug:"什么是-jzgantt",children:[]},{level:2,title:"安装",slug:"安装",children:[]},{level:2,title:"引入",slug:"引入",children:[]},{level:2,title:"使用",slug:"使用",children:[]},{level:2,title:"支持 TypeScript",slug:"支持-typescript",children:[]},{level:2,title:"更新日志",slug:"更新日志",children:[{level:3,title:"v1.2.0-alpha.0",slug:"v1-2-0-alpha-0",children:[]},{level:3,title:"v1.1.7",slug:"v1-1-7",children:[]},{level:3,title:"v1.1.6",slug:"v1-1-6",children:[]},{level:3,title:"v1.1.5",slug:"v1-1-5",children:[]},{level:3,title:"v1.1.4",slug:"v1-1-4",children:[]},{level:3,title:"v1.1.3",slug:"v1-1-3",children:[]},{level:3,title:"v1.1.2",slug:"v1-1-2",children:[]},{level:3,title:"v1.1.1",slug:"v1-1-1",children:[]},{level:3,title:"v1.1.0",slug:"v1-1-0",children:[]},{level:3,title:"v1.0.0-rc2",slug:"v1-0-0-rc2",children:[]},{level:3,title:"v1.0.0-rc1",slug:"v1-0-0-rc1",children:[]}]}],filePathRelative:"README.md",git:{updatedTime:1639363027e3,contributors:[{name:"jeremyjone",email:"jeremyjone@qq.com",commits:1}]}}},3391:(n,a,s)=>{s.r(a),s.d(a,{default:()=>zn});var e=s(6252);const t=(0,e._)("h1",{id:"入门",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#入门","aria-hidden":"true"},"#"),(0,e.Uk)(" 入门")],-1),l=(0,e._)("p",null,"通过入门的章节内容，可以快速了解、引入并使用 JzGantt。",-1),p={class:"custom-container tip"},o=(0,e._)("p",{class:"custom-container-title"},"提示",-1),c=(0,e.Uk)("这是 vue3 版本的 Gantt 组件，如果需要使用 vue2 版本，请移步 "),r=(0,e.Uk)("这里"),i={class:"custom-container tip"},u=(0,e._)("p",{class:"custom-container-title"},"演示",-1),d=(0,e.Uk)("现已提供演示页面，如需要，请移步 "),k={href:"https://docs.xiaopangying.com/gantt-demo/",target:"_blank",rel:"noopener noreferrer"},h=(0,e.Uk)("演示页面"),m=(0,e.Uk)("。"),b=(0,e.uE)('<h2 id="什么是-jzgantt" tabindex="-1"><a class="header-anchor" href="#什么是-jzgantt" aria-hidden="true">#</a> 什么是 JzGantt</h2><p><code>JzGantt</code> 是一个基于 <code>vue</code> 的甘特图表插件，它包含常用的甘特图功能，如：</p><ul><li>根据日期自动生成甘特图</li><li>支持多层扩展</li><li>高性能</li><li>多层联动</li><li>支持自定义表内容</li><li>支持自定义甘特内容</li><li>支持自定义表头</li><li>动态更新数据</li><li>定制任意风格</li><li>支持黑暗模式</li><li>支持多种日期显示模式切换</li><li>更多持续更新</li></ul><p><em>动图展示</em>：</p>',4),g=["src"],v=(0,e._)("h2",{id:"安装",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#安装","aria-hidden":"true"},"#"),(0,e.Uk)(" 安装")],-1),_=(0,e._)("p",null,[(0,e.Uk)("使用 "),(0,e._)("code",null,"npm"),(0,e.Uk)(" 安装：")],-1),f=(0,e._)("div",{class:"language-bash ext-sh"},[(0,e._)("pre",{class:"language-bash"},[(0,e._)("code",null,[(0,e._)("span",{class:"token function"},"yarn"),(0,e.Uk)(),(0,e._)("span",{class:"token function"},"add"),(0,e.Uk)(" jz-gantt\n")])])],-1),U=(0,e._)("div",{class:"language-bash ext-sh"},[(0,e._)("pre",{class:"language-bash"},[(0,e._)("code",null,[(0,e._)("span",{class:"token function"},"npm"),(0,e.Uk)(),(0,e._)("span",{class:"token function"},"install"),(0,e.Uk)(" jz-gantt --save\n")])])],-1),j=(0,e.uE)('<h2 id="引入" tabindex="-1"><a class="header-anchor" href="#引入" aria-hidden="true">#</a> 引入</h2><p>JzGantt 会被整体引入，引入的 Gantt 就是 JzGantt 的根组件。同时需要单独引入样式表，方式如下：</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">import</span> Gantt <span class="token keyword">from</span> <span class="token string">&#39;jz-gantt&#39;</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token string">&#39;jz-gantt/dist/index.css&#39;</span><span class="token punctuation">;</span>\n\n<span class="token function">createApp</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>Gantt<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">mount</span><span class="token punctuation">(</span><span class="token string">&#39;#app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h2><p>JzGantt 需要一个数组形式的数据对象。例如，您拥有如下数据：</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> dataList <span class="token operator">=</span> <span class="token function">reactive</span><span class="token punctuation">(</span><span class="token punctuation">[</span>\n  <span class="token punctuation">{</span>\n    index<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    startDate<span class="token operator">:</span> <span class="token string">&#39;2020-06-05&#39;</span><span class="token punctuation">,</span>\n    endDate<span class="token operator">:</span> <span class="token string">&#39;2020-08-20&#39;</span><span class="token punctuation">,</span>\n    ttt<span class="token operator">:</span> <span class="token punctuation">{</span>\n      a<span class="token operator">:</span> <span class="token string">&#39;aaa&#39;</span><span class="token punctuation">,</span>\n      b<span class="token operator">:</span> <span class="token string">&#39;bbb&#39;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    name<span class="token operator">:</span> <span class="token string">&#39;mydata1&#39;</span><span class="token punctuation">,</span>\n    children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    index<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    startDate<span class="token operator">:</span> <span class="token string">&#39;2020-07-07&#39;</span><span class="token punctuation">,</span>\n    endDate<span class="token operator">:</span> <span class="token string">&#39;2020-09-11&#39;</span><span class="token punctuation">,</span>\n    ttt<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n    name<span class="token operator">:</span> <span class="token string">&#39;mydata2&#39;</span><span class="token punctuation">,</span>\n    children<span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        index<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n        startDate<span class="token operator">:</span> <span class="token string">&#39;2020-07-10&#39;</span><span class="token punctuation">,</span>\n        endDate<span class="token operator">:</span> <span class="token string">&#39;2020-08-15&#39;</span><span class="token punctuation">,</span>\n        ttt<span class="token operator">:</span> <span class="token punctuation">{</span>\n          a<span class="token operator">:</span> <span class="token string">&#39;aaa&#39;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        name<span class="token operator">:</span> <span class="token string">&#39;child1&#39;</span><span class="token punctuation">,</span>\n        children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div><p>那么只需要在 <code>html</code> 中简单的使用 JzGantt，即可创建一个甘特内容：</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt</span>\n  <span class="token attr-name">data-index</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span> <span class="token attr-name">&lt;!--</span> <span class="token attr-name">请确保它存在</span> <span class="token attr-name">--</span><span class="token punctuation">&gt;</span></span>\n  :data=&quot;dataList&quot;\n/&gt;\n</code></pre><div class="highlight-lines"><br><div class="highlight-line"> </div><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>如上操作之后，您将看到：</p>',9),y=["src"],x=(0,e.uE)('<p>如果没有，请尝试重新操作。</p><p>如果它正常显示，请继续深入学习其他属性，以便更好的适应您的页面。</p><h2 id="支持-typescript" tabindex="-1"><a class="header-anchor" href="#支持-typescript" aria-hidden="true">#</a> 支持 TypeScript</h2><p>JGantt 有完整的 TypeScript 类型声明文件。</p><div class="custom-container tip"><p class="custom-container-title">更新</p><p>与 v0 版本不同，该版本所有类型都添加了一个 <code>Component</code> 后缀以示区别。</p></div><p>如果您需要，只需要在使用中通过：</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>\n  JGanttComponent<span class="token punctuation">,</span>\n  JGanttColumnComponent<span class="token punctuation">,</span>\n  JGanttSliderComponent\n<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;jz-gantt&#39;</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>按需导入使用即可。如：</p>',8),w=["src"],z=(0,e.uE)('<h2 id="更新日志" tabindex="-1"><a class="header-anchor" href="#更新日志" aria-hidden="true">#</a> 更新日志</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>您可以跳过此内容以继续深入学习具体配置 JGantt。</p></div><h3 id="v1-2-0-alpha-0" tabindex="-1"><a class="header-anchor" href="#v1-2-0-alpha-0" aria-hidden="true">#</a> v1.2.0-alpha.0</h3><p><strong>新增预览功能：</strong></p>',4),G=(0,e.Uk)("增加滑块的进度条显示("),W=(0,e.Uk)("progress"),J=(0,e.Uk)(") ("),C={href:"https://github.com/jeremyjone/jz-gantt/commit/be0d24b74a960437a567d0013cf741ba1c8f4c92",target:"_blank",rel:"noopener noreferrer"},D=(0,e.Uk)("be0d24b"),E=(0,e.Uk)(")"),q=(0,e._)("h3",{id:"v1-1-7",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#v1-1-7","aria-hidden":"true"},"#"),(0,e.Uk)(" v1.1.7")],-1),S=(0,e._)("p",null,[(0,e._)("strong",null,"新增功能：")],-1),T=(0,e.Uk)("添加列标签深度读取属性功能 ("),B={href:"https://github.com/jeremyjone/jz-gantt/commit/c9b25f135b52b1a16c96aecce9e72fdef23c8aa4",target:"_blank",rel:"noopener noreferrer"},A=(0,e.Uk)("c9b25f1"),L=(0,e.Uk)(")"),R=(0,e.Uk)("添加两个列属性("),N=(0,e.Uk)("column-class"),P=(0,e.Uk)(" 和 "),$=(0,e.Uk)("column-style"),H=(0,e.Uk)(") ("),I={href:"https://github.com/jeremyjone/jz-gantt/commit/edd2bbf74eaffd55230c93debfafaef43fa3667e",target:"_blank",rel:"noopener noreferrer"},M=(0,e.Uk)("edd2bbf"),O=(0,e.Uk)("), closes "),Y={href:"https://github.com/jeremyjone/jz-gantt/issues/7",target:"_blank",rel:"noopener noreferrer"},Z=(0,e.Uk)("#7"),F=(0,e.uE)('<h3 id="v1-1-6" tabindex="-1"><a class="header-anchor" href="#v1-1-6" aria-hidden="true">#</a> v1.1.6</h3><p><strong>修复问题：</strong></p><ul><li>修复背景颜色异常的问题</li><li>修复导入 css 样式的问题</li></ul><h3 id="v1-1-5" tabindex="-1"><a class="header-anchor" href="#v1-1-5" aria-hidden="true">#</a> v1.1.5</h3><p><strong>修复问题：</strong></p><ul><li>修复重复底边 border</li><li>修复列块样式</li></ul><h3 id="v1-1-4" tabindex="-1"><a class="header-anchor" href="#v1-1-4" aria-hidden="true">#</a> v1.1.4</h3><p><strong>修复问题：</strong></p><ul><li>修复 <code>JGanttColumn</code> 重复加载的问题。</li></ul><h3 id="v1-1-3" tabindex="-1"><a class="header-anchor" href="#v1-1-3" aria-hidden="true">#</a> v1.1.3</h3><p><strong>修复问题：</strong></p>',11),K=(0,e.Uk)("修复触发 "),Q=(0,e.Uk)("move-slider"),V=(0,e.Uk)(" 后数据抛出不完整的错误。"),X=(0,e.uE)('<h3 id="v1-1-2" tabindex="-1"><a class="header-anchor" href="#v1-1-2" aria-hidden="true">#</a> v1.1.2</h3><p><strong>修复问题：</strong></p><ul><li>修复切换视图时甘特表不重置导致过长的问题。</li><li>修复今日线的位移问题。</li><li>修复时间线（今日线和周末线等）在甘特条之上的问题。</li></ul><h3 id="v1-1-1" tabindex="-1"><a class="header-anchor" href="#v1-1-1" aria-hidden="true">#</a> v1.1.1</h3><p><strong>新增：</strong></p>',5),nn=(0,e.Uk)("新增设置按钮的显示控制（"),an=(0,e.Uk)("show-setting-btn"),sn=(0,e.Uk)("），同时外置了设置内容方法（"),en=(0,e.Uk)("setHeaderUnit"),tn=(0,e.Uk)("）。"),ln=(0,e._)("h3",{id:"v1-1-0",tabindex:"-1"},[(0,e._)("a",{class:"header-anchor",href:"#v1-1-0","aria-hidden":"true"},"#"),(0,e.Uk)(" v1.1.0")],-1),pn=(0,e._)("p",null,[(0,e._)("strong",null,"新增：")],-1),on=(0,e._)("ul",null,[(0,e._)("li",null,"甘特视图的日期显示切换功能。现在可以按日、周、月进行切换甘特视图")],-1),cn=(0,e._)("p",null,[(0,e._)("strong",null,"调整：")],-1),rn=(0,e.Uk)("删除了甘特视图的列宽属性（"),un=(0,e.Uk)("gantt-column-width"),dn=(0,e.Uk)("）。取而代之的是三种固定列宽，可以在选项面板中选择，也可以通过 "),kn=(0,e.Uk)("gantt-column-size"),hn=(0,e.Uk)(" 属性自定义，分别是 "),mn=(0,e._)("code",null,"小",-1),bn=(0,e.Uk)("、"),gn=(0,e._)("code",null,"中",-1),vn=(0,e.Uk)("、"),_n=(0,e._)("code",null,"大",-1),fn=(0,e.Uk)("，默认为 "),Un=(0,e._)("code",null,"中",-1),jn=(0,e.Uk)("。"),yn=(0,e._)("li",null,"略调了表头样式。",-1),xn=(0,e.uE)('<h3 id="v1-0-0-rc2" tabindex="-1"><a class="header-anchor" href="#v1-0-0-rc2" aria-hidden="true">#</a> v1.0.0-rc2</h3><ul><li>更新类型接口</li></ul><h3 id="v1-0-0-rc1" tabindex="-1"><a class="header-anchor" href="#v1-0-0-rc1" aria-hidden="true">#</a> v1.0.0-rc1</h3><ul><li>在 v0 版本的基础上适配 vue3。此次更新主要为了适配 vue3，没有太大的变化，所有断层更新内容列在下面。</li><li>删除了 <code>跳转到今天</code> 的按钮，改为抛出一个跳转方法 <code>jumpToDate(date?: Date)</code>，可以跳转到任意日期，默认为今天。</li><li>统一边框颜色。现在不再区分表头与表体的边框颜色。在根元素上有一个全新的属性 <code>borderColor</code>，接收一个颜色字符串。同时删除 <code>bodyStyle</code> 与 <code>headerStyle</code> 对象中的 <code>borderColor</code> 属性。</li><li>在根元素上新增一个 <code>primary-color</code> 属性，用于修改全局的主色，包括表头、按钮，以及其他用于主色地方。</li><li>更新滑块 <code>JGanttSlider</code> 上的 <code>move</code> 属性，从 <code>Boolean</code> 类型修改为 <code>[Function, Boolean]</code>。可以通过数据直接判断哪些内容可以滑动，同时所有 <code>resize</code> 连接属性将首先判断 <code>move</code> 是否可用。</li><li>滑块的所有插槽属性，同时抛出数据和层级，方便使用。</li><li>修改 <code>no-today-error</code> 事件名为 <code>no-date-error</code>，同时抛出异常日期参数。</li><li>修正了之前一些样式问题。</li></ul>',4),wn={},zn=(0,s(3744).Z)(wn,[["render",function(n,a){const s=(0,e.up)("Description"),wn=(0,e.up)("RouterLink"),zn=(0,e.up)("OutboundLink"),Gn=(0,e.up)("CodeGroupItem"),Wn=(0,e.up)("CodeGroup");return(0,e.wg)(),(0,e.iD)(e.HY,null,[t,(0,e.Wm)(s,{author:"jeremyjone",version:"1.2.0-alpha.0",date:"2021-12-10",copyright:"jeremyjone"}),l,(0,e._)("div",p,[o,(0,e._)("p",null,[c,(0,e.Wm)(wn,{to:"/v0/"},{default:(0,e.w5)((()=>[r])),_:1})])]),(0,e._)("div",i,[u,(0,e._)("p",null,[d,(0,e._)("a",k,[h,(0,e.Wm)(zn)]),m])]),b,(0,e._)("img",{src:n.$withBase("/assets/gantt_v1.gif"),alt:"gif"},null,8,g),v,_,(0,e.Wm)(Wn,null,{default:(0,e.w5)((()=>[(0,e.Wm)(Gn,{title:"YARN"},{default:(0,e.w5)((()=>[f])),_:1}),(0,e.Wm)(Gn,{title:"NPM",active:""},{default:(0,e.w5)((()=>[U])),_:1})])),_:1}),j,(0,e._)("img",{src:n.$withBase("/assets/basic.png"),alt:"basic"},null,8,y),x,(0,e._)("img",{src:n.$withBase("/assets/v1_type.png"),alt:"type"},null,8,w),z,(0,e._)("ul",null,[(0,e._)("li",null,[G,(0,e.Wm)(wn,{to:"/slider.html#progress"},{default:(0,e.w5)((()=>[W])),_:1}),J,(0,e._)("a",C,[D,(0,e.Wm)(zn)]),E])]),q,S,(0,e._)("ul",null,[(0,e._)("li",null,[(0,e._)("p",null,[T,(0,e._)("a",B,[A,(0,e.Wm)(zn)]),L])]),(0,e._)("li",null,[(0,e._)("p",null,[R,(0,e.Wm)(wn,{to:"/column.html#column-class"},{default:(0,e.w5)((()=>[N])),_:1}),P,(0,e.Wm)(wn,{to:"/column.html#column-style"},{default:(0,e.w5)((()=>[$])),_:1}),H,(0,e._)("a",I,[M,(0,e.Wm)(zn)]),O,(0,e._)("a",Y,[Z,(0,e.Wm)(zn)])])])]),F,(0,e._)("ul",null,[(0,e._)("li",null,[K,(0,e.Wm)(wn,{to:"/root.html#move-slider"},{default:(0,e.w5)((()=>[Q])),_:1}),V])]),X,(0,e._)("ul",null,[(0,e._)("li",null,[nn,(0,e.Wm)(wn,{to:"/root.html#show-setting-btn"},{default:(0,e.w5)((()=>[an])),_:1}),sn,(0,e.Wm)(wn,{to:"/root.html#setheaderunit"},{default:(0,e.w5)((()=>[en])),_:1}),tn])]),ln,pn,on,cn,(0,e._)("ul",null,[(0,e._)("li",null,[rn,(0,e.Wm)(wn,{to:"/root.html#gantt-column-width"},{default:(0,e.w5)((()=>[un])),_:1}),dn,(0,e.Wm)(wn,{to:"/root.html#gantt-column-size"},{default:(0,e.w5)((()=>[kn])),_:1}),hn,mn,bn,gn,vn,_n,fn,Un,jn]),yn]),xn],64)}]])},3744:(n,a)=>{a.Z=(n,a)=>{const s=n.__vccOpts||n;for(const[n,e]of a)s[n]=e;return s}}}]);