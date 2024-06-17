import{ac as c,D as n,o as k,b as E,c as g,I as e,w as p,j as i,a as s,am as d,an as y,ao as m}from"./chunks/framework.BZbxhP-o.js";const u={__name:"index.md.demo.7fcd8a35",setup(r){let a=0;const l=c([]);for(let t=0;t<10;t++)l.push({index:++a,name:"t"+a,startDate:new Date(2023,5,a),endDate:new Date(2023,5,a+5),o:{t1:"a",t2:"b"}});return(t,h)=>{const o=n("x-gantt");return k(),E(o,{"data-id":"index",data:l},null,8,["data"])}}},F=i("h1",{id:"入门",tabindex:"-1"},[s("入门 "),i("a",{class:"header-anchor",href:"#入门","aria-label":'Permalink to "入门"'},"​")],-1),b=d('<p><a href="https://www.oscs1024.com/project/xpyjs/gantt?ref=badge_small" target="_blank" rel="noreferrer"><img src="https://www.oscs1024.com/platform/badge/xpyjs/gantt.svg?size=small" alt="OSCS Status"></a> <img src="https://shields.io/github/v/release/xpyjs/gantt?display_name=tag" alt=""> <img src="https://img.shields.io/npm/v/@xpyjs/gantt.svg" alt=""> <img src="https://shields.io/github/v/release/xpyjs/gantt?display_name=tag&amp;include_prereleases&amp;label=lastest" alt=""> <img src="https://badgen.net/npm/dt/@xpyjs/gantt" alt=""> <img src="https://img.shields.io/npm/l/@xpyjs/gantt.svg" alt=""> <img src="https://img.shields.io/github/actions/workflow/status/xpyjs/gantt/release.yml?branch=master" alt=""> <img src="https://img.shields.io/github/actions/workflow/status/xpyjs/gantt/gh-pages.yml?branch=master&amp;label=document" alt=""> <img src="https://img.shields.io/github/stars/xpyjs/gantt.svg?style=social" alt=""> <img src="https://shields.io/github/forks/xpyjs/gantt?label=Fork&amp;style=social" alt=""></p><p>通过入门的章节内容，可以快速了解、引入并使用 XGantt。</p><div class="tip custom-block"><p class="custom-block-title">提示</p><p>这是 vue3 版本的 Gantt 组件，如果需要使用 vue2 版本，请移步 <a href="./vue2/">这里</a></p></div><div class="tip custom-block"><p class="custom-block-title">演示</p><p>现已提供演示页面，如需要，请移步 <a href="https://docs.xiaopangying.com/gantt-demo/" target="_blank" rel="noreferrer">演示页面</a>。</p></div><h2 id="十分重要" tabindex="-1">十分重要 <a class="header-anchor" href="#十分重要" aria-label="Permalink to &quot;十分重要&quot;">​</a></h2><p>这个库是 <code>jz-gantt</code> 的 vue3 版本的继承库。如果您之前已经使用了 <code>jz-gantt</code>，则需要仔细阅读如下内容。</p><p><strong>说明：</strong></p><blockquote><p>这个库的 <code>1.0.1</code> 相当于 <code>jz-gantt@1.3.1</code>。并且 <code>jz-gantt</code> 不再维护。</p></blockquote><h3 id="如何迁移" tabindex="-1">如何迁移 <a class="header-anchor" href="#如何迁移" aria-label="Permalink to &quot;如何迁移&quot;">​</a></h3><ol><li>包名不同， <code>@xpyjs/gantt</code> 替换了 <code>jz-gantt</code>。</li><li>所有以 <code>j-</code> 或 <code>J</code> 的前缀全都更新为 <code>x-</code> 或 <code>X</code>。</li></ol><p>除此之外，无需其他改动。</p><h2 id="关于版本" tabindex="-1">关于版本 <a class="header-anchor" href="#关于版本" aria-label="Permalink to &quot;关于版本&quot;">​</a></h2><p><code>v1</code> 和 <code>v2</code> 不兼容。</p><ul><li>参数不同 <ul><li><code>data-index</code> 改为 `data-id</li><li>增加 <code>unit</code> 参数，替换之前的 <code>setHeaderUnit</code> 方法</li><li><code>label</code> 改为 <code>prop</code></li><li><code>name</code> 改为 <code>label</code></li></ul></li><li>插槽不同 <ul><li><code>xg-gantt-column</code> 支持多层嵌套，以达到多级表头效果</li></ul></li><li>组件不同 <ul><li>移除了抽屉组件</li></ul></li></ul><p>相较 <code>v1</code>，<code>v2</code> 更加灵活，更加易用，更加强大。</p><ul><li>滚动更加流畅，重写了两边的滚动联动效果</li><li>支持多级表头</li><li>增加了连线模式</li><li>调整了进度条的显示方式，移除了改变进度的功能</li></ul><h2 id="什么是-xgantt" tabindex="-1">什么是 XGantt <a class="header-anchor" href="#什么是-xgantt" aria-label="Permalink to &quot;什么是 XGantt&quot;">​</a></h2><p><code>XGantt</code> 是一个基于 <code>vue</code> 的甘特图表插件，它包含常用的甘特图功能，如：</p><ul><li>[x] 根据日期自动生成甘特图</li><li>[x] 支持多层扩展</li><li>[x] 高性能</li><li>[x] 多层联动</li><li>[x] 多级选取</li><li>[x] 支持自定义表内容</li><li>[x] 支持自定义甘特内容</li><li>[x] 支持自定义表头</li><li>[x] 动态更新数据</li><li>[x] 定制任意风格</li><li>[x] 支持黑暗模式</li><li>[x] 支持多种日期显示模式切换</li><li>[x] 支持表格部分多级表头</li><li>[x] 支持甘特部分的连线</li><li>[ ] 更多持续更新</li></ul><p>效果展示：</p><p><img src="'+y+`" alt=""></p><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-RxaG-" id="tab-Nr7K-1H" checked><label for="tab-Nr7K-1H">YARN</label><input type="radio" name="group-RxaG-" id="tab-csrvnBx"><label for="tab-csrvnBx">NPM</label></div><div class="blocks"><div class="language-bash vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @xpyjs/gantt</span></span></code></pre></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @xpyjs/gantt</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --save</span></span></code></pre></div></div></div><h2 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h2><p>XGantt 会被整体引入，引入的 Gantt 就是 XGantt 的根组件。同时需要单独引入样式表，方式如下：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Gantt </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@xpyjs/gantt&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@xpyjs/gantt/dist/index.css&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">createApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(App).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Gantt).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;#app&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><h2 id="使用" tabindex="-1">使用 <a class="header-anchor" href="#使用" aria-label="Permalink to &quot;使用&quot;">​</a></h2><p>XGantt 需要一个数组形式的数据对象。例如，您拥有如下数据：</p><blockquote><p>确保数组嵌套在 <code>reactive</code> / <code>ref</code> 方法中，它可以保证数据的内外响应式。</p></blockquote><p>下面是一个最简单的示例：</p>`,30),x=i("div",{class:"language-vue vp-adaptive-theme"},[i("span",{class:"lang"},"vue"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"<"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"template"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  <!-- 请确保 data-id 的存在，它默认为 id -->")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  <"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"x-gantt")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"    data-id"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"index"')]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    :"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"data"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"dataList"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"')]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  />")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"template"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"<"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"script"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," setup"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"import"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," { reactive } "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"from"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'vue'"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},";")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"let"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," id "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 0"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},";")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"const"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," dataList"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," ="),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," reactive"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"([]);")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ("),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"let"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," i "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 0"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"; i "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"<"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"; i"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"++"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},") {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  dataList."),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"push"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"({")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    index: "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"++"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"id,")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    name: "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'t'"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," +"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," id,")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    startDate: "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"new"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," Date"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"2023"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"5"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", id),")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    endDate: "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"new"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," Date"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"2023"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"5"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", id "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 5"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"),")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    o: { t1: "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'a'"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", t2: "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'b'"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," }")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  });")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"</"),i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"script"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">")])])])],-1),v=d(`<p>如果没有，请尝试重新操作。</p><p>如果它正常显示，请继续深入学习其他属性，以便更好的适应您的页面。</p><h2 id="支持-typescript" tabindex="-1">支持 TypeScript <a class="header-anchor" href="#支持-typescript" aria-label="Permalink to &quot;支持 TypeScript&quot;">​</a></h2><p>XGantt 有完整的 TypeScript 类型声明文件。</p><p>如果您需要，只需要在使用中通过：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  XGanttComponent,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  XGanttColumnComponent,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  XGanttSliderComponent</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@xpyjs/gantt&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>按需导入使用即可。如：</p><p><img src="`+m+'" alt=""></p><h2 id="更新日志" tabindex="-1">更新日志 <a class="header-anchor" href="#更新日志" aria-label="Permalink to &quot;更新日志&quot;">​</a></h2><p><a href="https://github.com/xpyjs/gantt/CHANGELOG.md" target="_blank" rel="noreferrer">CHANGELOG</a></p>',10),D=JSON.parse('{"title":"入门","description":"","frontmatter":{},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":1718588791000}'),_={name:"index.md"},B=Object.assign(_,{setup(r){return(a,l)=>{const t=n("Description"),h=n("demo");return k(),g("div",null,[F,e(t,{author:"jeremyjone",version:"2",date:"2024-06-13",copyright:"xpyjs"}),b,e(h,{customClass:"",sourceCode:`<template>
  <!-- 请确保 data-id 的存在，它默认为 id -->
  <x-gantt
    data-id="index"
    :data="dataList"
  />
</template>

<script setup>
import { reactive } from 'vue';

let id = 0;
const dataList = reactive([]);

for (let i = 0; i < 10; i++) {
  dataList.push({
    index: ++id,
    name: 't' + id,
    startDate: new Date(2023, 5, id),
    endDate: new Date(2023, 5, id + 5),
    o: { t1: 'a', t2: 'b' }
  });
}
<\/script>
`,options:"{}"},{highlight:p(()=>[x]),default:p(()=>[e(u)]),_:1}),v])}}});export{D as __pageData,B as default};
