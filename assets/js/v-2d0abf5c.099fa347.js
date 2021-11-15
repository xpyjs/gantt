"use strict";(self.webpackChunkgantt_doc=self.webpackChunkgantt_doc||[]).push([[596],{6714:(n,a,s)=>{s.r(a),s.d(a,{data:()=>t});const t={key:"v-2d0abf5c",path:"/v0/",title:"入门",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"什么是 JzGantt",slug:"什么是-jzgantt",children:[]},{level:2,title:"安装",slug:"安装",children:[]},{level:2,title:"引入",slug:"引入",children:[]},{level:2,title:"使用",slug:"使用",children:[]},{level:2,title:"支持 TypeScript",slug:"支持-typescript",children:[]},{level:2,title:"更新日志",slug:"更新日志",children:[{level:3,title:"Release 0.0.17",slug:"release-0-0-17",children:[]},{level:3,title:"Release 0.0.16",slug:"release-0-0-16",children:[]},{level:3,title:"Release 0.0.15",slug:"release-0-0-15",children:[]}]}],filePathRelative:"v0/README.md",git:{updatedTime:1636950408e3,contributors:[{name:"jeremyjone",email:"jeremyjone@qq.com",commits:1}]}}},3329:(n,a,s)=>{s.r(a),s.d(a,{default:()=>m});var t=s(6252);const e=(0,t._)("h1",{id:"入门",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#入门","aria-hidden":"true"},"#"),(0,t.Uk)(" 入门")],-1),p=(0,t.uE)('<p>通过入门的章节内容，可以快速了解、引入并使用 JzGantt。</p><h2 id="什么是-jzgantt" tabindex="-1"><a class="header-anchor" href="#什么是-jzgantt" aria-hidden="true">#</a> 什么是 JzGantt</h2><p><code>JzGantt</code> 是一个基于 <code>vue</code> 的甘特图表插件，它包含常用的甘特图功能，如：</p><ul><li>树形数据结构展示，支持动态增减</li><li>展开、收起子项</li><li>自定义左侧表格的列内容</li><li>自定义左侧表格的合并项</li><li>自定义右侧甘特条的内容</li><li>任意拖动甘特条以修改时间</li><li>完整的响应事件</li><li>快速查找 <code>今天</code></li><li>显示周末</li></ul><p><em>动图展示</em>：</p>',5),l=["src"],c=(0,t._)("h2",{id:"安装",tabindex:"-1"},[(0,t._)("a",{class:"header-anchor",href:"#安装","aria-hidden":"true"},"#"),(0,t.Uk)(" 安装")],-1),o=(0,t._)("p",null,[(0,t.Uk)("使用 "),(0,t._)("code",null,"npm"),(0,t.Uk)(" 安装：")],-1),i=(0,t._)("div",{class:"language-bash ext-sh"},[(0,t._)("pre",{class:"language-bash"},[(0,t._)("code",null,[(0,t._)("span",{class:"token function"},"yarn"),(0,t.Uk)(),(0,t._)("span",{class:"token function"},"add"),(0,t.Uk)(" jz-gantt\n")])])],-1),r=(0,t._)("div",{class:"language-bash ext-sh"},[(0,t._)("pre",{class:"language-bash"},[(0,t._)("code",null,[(0,t._)("span",{class:"token function"},"npm"),(0,t.Uk)(),(0,t._)("span",{class:"token function"},"install"),(0,t.Uk)(" jz-gantt --save\n")])])],-1),u=(0,t.uE)('<div class="custom-container tip"><p class="custom-container-title">提示</p><p>因为处于完善阶段，请确保使用最新版本。</p></div><h2 id="引入" tabindex="-1"><a class="header-anchor" href="#引入" aria-hidden="true">#</a> 引入</h2><p>JzGantt 会被整体引入，引入的 Gantt 就是 JzGantt 的根组件。同时需要单独引入样式表，方式如下：</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">import</span> Vue <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> Gantt <span class="token keyword">from</span> <span class="token string">&quot;jz-gantt&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token string">&quot;jz-gantt/lib/jz-gantt.css&quot;</span><span class="token punctuation">;</span>\n\nVue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>Gantt<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h2><p>JzGantt 需要一个数组形式的数据对象。例如，您拥有如下数据：</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> dataList <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token punctuation">{</span>\n    index<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    startDate<span class="token operator">:</span> <span class="token string">&quot;2020-06-05&quot;</span><span class="token punctuation">,</span>\n    endDate<span class="token operator">:</span> <span class="token string">&quot;2020-08-20&quot;</span><span class="token punctuation">,</span>\n    ttt<span class="token operator">:</span> <span class="token punctuation">{</span>\n      a<span class="token operator">:</span> <span class="token string">&quot;aaa&quot;</span><span class="token punctuation">,</span>\n      b<span class="token operator">:</span> <span class="token string">&quot;bbb&quot;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    name<span class="token operator">:</span> <span class="token string">&quot;mydata1&quot;</span><span class="token punctuation">,</span>\n    children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    index<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    startDate<span class="token operator">:</span> <span class="token string">&quot;2020-07-07&quot;</span><span class="token punctuation">,</span>\n    endDate<span class="token operator">:</span> <span class="token string">&quot;2020-09-11&quot;</span><span class="token punctuation">,</span>\n    ttt<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n    name<span class="token operator">:</span> <span class="token string">&quot;mydata2&quot;</span><span class="token punctuation">,</span>\n    children<span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        index<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n        startDate<span class="token operator">:</span> <span class="token string">&quot;2020-07-10&quot;</span><span class="token punctuation">,</span>\n        endDate<span class="token operator">:</span> <span class="token string">&quot;2020-08-15&quot;</span><span class="token punctuation">,</span>\n        ttt<span class="token operator">:</span> <span class="token punctuation">{</span>\n          a<span class="token operator">:</span> <span class="token string">&quot;aaa&quot;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        name<span class="token operator">:</span> <span class="token string">&quot;child1&quot;</span><span class="token punctuation">,</span>\n        children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div><p>那么只需要在 <code>html</code> 中简单的使用 JzGantt，即可创建一个甘特内容：</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>j-gantt</span> <span class="token attr-name">data-index</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span> <span class="token attr-name">&lt;!--</span> <span class="token attr-name">请确保它存在</span> <span class="token attr-name">--</span><span class="token punctuation">&gt;</span></span>\n  :data=&quot;dataList&quot; /&gt;\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>j-gantt</span><span class="token punctuation">&gt;</span></span>\n</code></pre><div class="highlight-lines"><br><div class="highlight-line"> </div><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>如上操作之后，您将看到：</p>',10),d=["src"],k=(0,t.uE)('<p>如果没有，请尝试重新操作。</p><p>如果它正常显示，请继续深入学习其他属性，以便更好的适应您的页面。</p><h2 id="支持-typescript" tabindex="-1"><a class="header-anchor" href="#支持-typescript" aria-hidden="true">#</a> 支持 TypeScript</h2><p>JGantt 已经有了完整的 TypeScript 类型声明文件，如果您需要，只需要在使用中通过：</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> JGantt<span class="token punctuation">,</span> JGanttColumn<span class="token punctuation">,</span> JGanttSlider <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;jz-gantt&quot;</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>按需导入即可。</p><h2 id="更新日志" tabindex="-1"><a class="header-anchor" href="#更新日志" aria-hidden="true">#</a> 更新日志</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>您可以跳过此内容以继续深入学习具体配置 JGantt。</p></div><h3 id="release-0-0-17" tabindex="-1"><a class="header-anchor" href="#release-0-0-17" aria-hidden="true">#</a> Release 0.0.17</h3><ul><li>调整滑块移动的接口，现在它抛出了原数据。</li></ul><h3 id="release-0-0-16" tabindex="-1"><a class="header-anchor" href="#release-0-0-16" aria-hidden="true">#</a> Release 0.0.16</h3><ul><li>添加了一个方法 <code>setSelected</code>，用于设置一条选中的项。</li><li>修正了一些样式问题。</li></ul><h3 id="release-0-0-15" tabindex="-1"><a class="header-anchor" href="#release-0-0-15" aria-hidden="true">#</a> Release 0.0.15</h3><ul><li>添加了一个 <code>settings</code> 的具名插槽，可以向设置抽屉插入自定义内容。</li><li>添加了一个 <code>dark</code> 属性，适配黑暗模式。</li><li>调整了表头的格式。</li></ul>',14),b={},m=(0,s(3744).Z)(b,[["render",function(n,a){const s=(0,t.up)("Description"),b=(0,t.up)("CodeGroupItem"),m=(0,t.up)("CodeGroup");return(0,t.wg)(),(0,t.iD)(t.HY,null,[e,(0,t.Wm)(s,{author:"jeremyjone",version:"0.0.17",date:"2020-12-22",copyright:"jeremyjone"}),p,(0,t._)("img",{src:n.$withBase("/assets/gantt_v0.gif"),alt:"gif"},null,8,l),c,o,(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(b,{title:"YARN"},{default:(0,t.w5)((()=>[i])),_:1}),(0,t.Wm)(b,{title:"NPM",active:""},{default:(0,t.w5)((()=>[r])),_:1})])),_:1}),u,(0,t._)("img",{src:n.$withBase("/assets/basic.png"),alt:"basic"},null,8,d),k],64)}]])},3744:(n,a)=>{a.Z=(n,a)=>{const s=n.__vccOpts||n;for(const[n,t]of a)s[n]=t;return s}}}]);