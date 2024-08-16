# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.13](https://github.com/xpyjs/gantt/compare/v2.1.12...v2.1.13) (2024-08-16)


### Bug Fixes

* 表头高度属性不生效 ([8a2782d](https://github.com/xpyjs/gantt/commit/8a2782d8eda64650de6b2cb80b8bb3fbb90e3979)), closes [#127](https://github.com/xpyjs/gantt/issues/127)

### [2.1.12](https://github.com/xpyjs/gantt/compare/v2.1.11...v2.1.12) (2024-07-01)


### Features

* 自定义头部日期格式化 ([1c2a3e8](https://github.com/xpyjs/gantt/commit/1c2a3e878f5c16441f8415f4b25f3608941cfef7)), closes [#106](https://github.com/xpyjs/gantt/issues/106)


### Bug Fixes

* 连线缺失监听 ([8ece20a](https://github.com/xpyjs/gantt/commit/8ece20add6b1290a3f10f5495e326b5530f2b291)), closes [#102](https://github.com/xpyjs/gantt/issues/102) [#108](https://github.com/xpyjs/gantt/issues/108)
* 修复数据重新赋值部分无效的问题 ([3ad16b3](https://github.com/xpyjs/gantt/commit/3ad16b30b4be7121c446d8b0e63c1c5b36eef98c)), closes [#108](https://github.com/xpyjs/gantt/issues/108)
* 修复中线高度问题 ([2e5e7f5](https://github.com/xpyjs/gantt/commit/2e5e7f54c6c1e51373fe808c6e3b0fef8d50aef2))
* 优化连线的性能 ([f83ed29](https://github.com/xpyjs/gantt/commit/f83ed29fc3988a7ef2720f2fd7a5d229797efb75))
* 语言设置响应式 ([a2ac28b](https://github.com/xpyjs/gantt/commit/a2ac28b1cdb32a4bd2a6043238767bb36dbcc767))

### [2.1.11](https://github.com/xpyjs/gantt/compare/v2.1.10...v2.1.11) (2024-06-28)


### Bug Fixes

* 修复按单位移动后时间精度被改变的问题 ([192e734](https://github.com/xpyjs/gantt/commit/192e734534628a5c35679ba6713a86c3207b0701)), closes [#104](https://github.com/xpyjs/gantt/issues/104)
* 修复节假日超出渲染 ([69c6229](https://github.com/xpyjs/gantt/commit/69c6229b8898b5f05f6eab6166ae60925b4fe662)), closes [#105](https://github.com/xpyjs/gantt/issues/105)

### [2.1.10](https://github.com/xpyjs/gantt/compare/v2.1.9...v2.1.10) (2024-06-21)


### Bug Fixes

* 修复滑块移动会增删日期的问题 ([40ff1ad](https://github.com/xpyjs/gantt/commit/40ff1adfac31520d4871002cb0185bbc24ea6480)), closes [#101](https://github.com/xpyjs/gantt/issues/101)

### [2.1.9](https://github.com/xpyjs/gantt/compare/v2.1.8...v2.1.9) (2024-06-17)

### [2.1.8](https://github.com/xpyjs/gantt/compare/v2.1.7...v2.1.8) (2024-06-14)


### Bug Fixes

* 调整锚点样式 ([9606c08](https://github.com/xpyjs/gantt/commit/9606c0840ebd44ae24fc62c6e7d851ec8724ef0a))
* 修正表头事件被阻的问题 ([afde2a7](https://github.com/xpyjs/gantt/commit/afde2a78aadd3222aea8af991e6f4135ec904cf5)), closes [#100](https://github.com/xpyjs/gantt/issues/100)
* 修正body样式不生效的问题 ([0d6b89c](https://github.com/xpyjs/gantt/commit/0d6b89c2b0ed97f70620f80e144b3761788b2fb7))

### [2.1.7](https://github.com/xpyjs/gantt/compare/v2.1.6...v2.1.7) (2024-06-13)


### Features

* column插槽抛出一个溢出属性 ([08d3f29](https://github.com/xpyjs/gantt/commit/08d3f292a18202b0e0e4d4599e9bde6bc221bf5b)), closes [#84](https://github.com/xpyjs/gantt/issues/84)


### Bug Fixes

* 表头高度重新设置 ([cacf8a0](https://github.com/xpyjs/gantt/commit/cacf8a0cd7c27555d69f98fba23d7cb75542efbe))
* 加载数量过小时不渲染内容的问题 ([30dc9c2](https://github.com/xpyjs/gantt/commit/30dc9c262a7cbfcf6b9449656fbadd75e243f603))
* 解决 vue 版本冲突问题 ([4a9ed5e](https://github.com/xpyjs/gantt/commit/4a9ed5ec3e81d781bf560e08191b8f93e9e56a25)), closes [#94](https://github.com/xpyjs/gantt/issues/94)

### [2.1.6](https://github.com/xpyjs/gantt/compare/v2.1.5...v2.1.6) (2024-05-14)


### Bug Fixes

* **slider:** 修复两侧拖拽时可以超过对侧父级的内容 ([6ad734b](https://github.com/xpyjs/gantt/commit/6ad734bf7735dbc7e7d5529967d20c0d744b9174)), closes [#93](https://github.com/xpyjs/gantt/issues/93)

### [2.1.5](https://github.com/xpyjs/gantt/compare/v2.1.4...v2.1.5) (2023-12-14)


### Bug Fixes

* 🐛 支持列循环创建 ([c1fb02a](https://github.com/xpyjs/gantt/commit/c1fb02a82284935cb15db952e0d54346ffe52f08)), closes [#52](https://github.com/xpyjs/gantt/issues/52) [#68](https://github.com/xpyjs/gantt/issues/68)

### [2.1.4](https://github.com/xpyjs/gantt/compare/v2.1.3...v2.1.4) (2023-10-10)


### Features

* GanttColumnSize添加支持自定义宽度 ([a9c19fe](https://github.com/xpyjs/gantt/commit/a9c19fed40bd5eb0d558ec298e5044e0a78155cf))
* GanttColumnSize支持使用对象自定义宽度 ([b7fab5c](https://github.com/xpyjs/gantt/commit/b7fab5cd6d9f788ed5f834766d1c15ed2887011d))

### [2.1.3](https://github.com/xpyjs/gantt/compare/v2.1.2...v2.1.3) (2023-08-17)


### Bug Fixes

* **header:** 🐛 修复 `月/周` 下头部长度问题 ([29d9440](https://github.com/xpyjs/gantt/commit/29d9440563c52e5fcd0020b290b3892367d39291))
* **header:** 🐛 修复月单位下表头显示问题 ([cdaa7ca](https://github.com/xpyjs/gantt/commit/cdaa7caeda546d43d1c96deaf5616d189145c280)), closes [#57](https://github.com/xpyjs/gantt/issues/57) [#61](https://github.com/xpyjs/gantt/issues/61)

### [2.1.2](https://github.com/xpyjs/gantt/compare/v2.1.1...v2.1.2) (2023-08-04)


### Features

* **gantt:** ✨ 添加特殊日期的渲染 ([4f6c0f0](https://github.com/xpyjs/gantt/commit/4f6c0f067802db8d49b2b2da35d550cf78e43081)), closes [#46](https://github.com/xpyjs/gantt/issues/46) [#51](https://github.com/xpyjs/gantt/issues/51)


### Bug Fixes

* **column:** 🐛 展开按钮错位 ([55adf32](https://github.com/xpyjs/gantt/commit/55adf32fe06f35117b20b71eb593190d2a2824e1))

### [2.1.1](https://github.com/xpyjs/gantt/compare/v2.1.0...v2.1.1) (2023-07-05)


### Bug Fixes

* **日期:** 🐛 修复日期在特定情况下表头异常错位 ([89d5730](https://github.com/xpyjs/gantt/commit/89d57307820fb0b660d7cdbc98a94a2a24df6135)), closes [#53](https://github.com/xpyjs/gantt/issues/53)
* **i18n:** 🐛 dayjs 切换语言不更新 ([7f9b1cb](https://github.com/xpyjs/gantt/commit/7f9b1cbaaf330d29b306acb697029007e4359f31)), closes [#54](https://github.com/xpyjs/gantt/issues/54)

## [2.1.0](https://github.com/xpyjs/gantt/compare/v2.0.5...v2.1.0) (2023-06-12)


### Features

* **data:** ✨ 允许拖拽 ([9daa076](https://github.com/xpyjs/gantt/commit/9daa076189fd6b33d6e8d7c78f44d712599522f2)), closes [#14](https://github.com/xpyjs/gantt/issues/14)
* **date:** ✨ 对接 dayjs 显示 ([d02978f](https://github.com/xpyjs/gantt/commit/d02978f344c3523de45a63bd6ba4c34c6cb89c88))
* **header:** ✨ 添加每列表头（table）的插槽 ([c6664bd](https://github.com/xpyjs/gantt/commit/c6664bd514265a8e9350de911e48a7a788c1a202)), closes [#44](https://github.com/xpyjs/gantt/issues/44)
* **slider:** ✨ 点击行可以将 slider 移动到视图 ([53226e6](https://github.com/xpyjs/gantt/commit/53226e6a9e661ab258e36dd57ed482a40af567fc))
* **slider:** ✨ 添加 move-by-unit 参数 ([d94f750](https://github.com/xpyjs/gantt/commit/d94f750c7e57469536fff2ed4c37396f98069392))


### Bug Fixes

* **column:** 🐛 列的盒子模型 ([31527bf](https://github.com/xpyjs/gantt/commit/31527bf2a0a10881b3bab7a65fd53d16615a94bc))
* **header:** 🐛 表头内容更改时两边高度不统一 ([e3c7341](https://github.com/xpyjs/gantt/commit/e3c73414f1ea585a8ceb42571e432c54b0c57672))
* **indent:** 🐛 更新缩进样式 ([7062371](https://github.com/xpyjs/gantt/commit/7062371b4d94a8ca1375cd1baf30287206485691))
* **jump:** 🐛 jumpToDate方法日期位置跳转不准 ([5673fa9](https://github.com/xpyjs/gantt/commit/5673fa91fd71adcf42e534df1b2ad48ced1e4926)), closes [#43](https://github.com/xpyjs/gantt/issues/43)

### [2.0.5](https://github.com/xpyjs/gantt/compare/v2.0.4...v2.0.5) (2023-05-30)


### Bug Fixes

* 🐛body-style 不生效的问题 ([de2b06c](https://github.com/xpyjs/gantt/commit/de2b06cc0f11aa40154488ffe8d558b07c6b9d62))

### [2.0.4](https://github.com/xpyjs/gantt/compare/v2.0.3...v2.0.4) (2023-05-25)


### Features

* **reactive:** allow scope data to reactive ([d8f582c](https://github.com/xpyjs/gantt/commit/d8f582cc8314da1f48e10306494e42bd69e26247)), closes [#42](https://github.com/xpyjs/gantt/issues/42)


### Bug Fixes

* 🐛text slots can not display ([05a8e74](https://github.com/xpyjs/gantt/commit/05a8e74672bc3ccfbf235742af4875a4662cbc4f))

### [2.0.3](https://github.com/xpyjs/gantt/compare/v2.0.2...v2.0.3) (2023-05-24)


### Bug Fixes

* 🐛初始为空数据时，表头无法渲染 ([0ee9a56](https://github.com/xpyjs/gantt/commit/0ee9a5684f35c046647f602f525bd42eeb47a392))
* 🐛清空数据异常 ([2506e97](https://github.com/xpyjs/gantt/commit/2506e97bdd504f82762e0c9569ba620ad91d5d3d))
* 🐛中线在无高度情况下丢失 ([f04d632](https://github.com/xpyjs/gantt/commit/f04d632601c8cd7961c6a8a51ab237e15805e993))
* 数据切换后展示不正常 ([c3cb633](https://github.com/xpyjs/gantt/commit/c3cb633e577c61cbdf48d64087348882b710d40a)), closes [#41](https://github.com/xpyjs/gantt/issues/41)

### [2.0.2](https://github.com/xpyjs/gantt/compare/v2.0.1...v2.0.2) (2023-05-22)


### Bug Fixes

* 🐛修复插槽默认值问题 ([4263bf5](https://github.com/xpyjs/gantt/commit/4263bf52b88eebdf61db87fb553b116d245cd3b1))
* 🐛check emit data type error ([63050e9](https://github.com/xpyjs/gantt/commit/63050e94bdfd907c9a68b577c1e1e433a8d592c4))
* 🐛column 更新展示内容后宽度重新计算 ([b6f9daa](https://github.com/xpyjs/gantt/commit/b6f9daac3d437e77df2c54db3b149fe56e889ef6))
* 🐛level 应该从1 起始，而不是 0。与语义和之前版本同步 ([817081f](https://github.com/xpyjs/gantt/commit/817081f3fb925e3e06026dc16c54e81500448b93))
* 🐛move 属性为 false 时，left 和 right 依旧可以展示并拖拽的问题 ([9ebca0b](https://github.com/xpyjs/gantt/commit/9ebca0b4d36c2b66b7e4a16791131ea43ae13e72))

## [2.0.0](https://github.com/xpyjs/gantt/compare/v1.0.2...v2.0.0) (2023-05-19)


### Features

* ✨封装 icon ([39190a6](https://github.com/xpyjs/gantt/commit/39190a6241291a49a7f62c19784a42e2aaa7981c))
* ✨滑块的左右单独移动 ([ddcc06d](https://github.com/xpyjs/gantt/commit/ddcc06d38a35461f252b06d6e9cac908b7db454b))
* ✨添加 column 对日期格式化的支持 ([e3b27f8](https://github.com/xpyjs/gantt/commit/e3b27f8a555add54e6603d5797406c26b3c23287))
* ✨添加 slider 的插槽 ([e598762](https://github.com/xpyjs/gantt/commit/e598762232a346c80ba72616d68380b68b27390d))
* ✨添加 slider 两端锚点 ([aef0a80](https://github.com/xpyjs/gantt/commit/aef0a806de281cc1b23b3e6d93ac099d0abefdaf))
* ✨添加初始化数据的 options ([b426863](https://github.com/xpyjs/gantt/commit/b42686368567be8a35dcca5f8e37331c1dd5f219))
* ✨添加点击连线事件 ([6262cc0](https://github.com/xpyjs/gantt/commit/6262cc0ca9fb23e0f804d25144441ed84b13d427))
* ✨添加点击连线事件 ([f4e5efa](https://github.com/xpyjs/gantt/commit/f4e5efa62847218b9f92d0c48c934f2b524413df))
* ✨添加连线的控制开关属性 ([b5c3d98](https://github.com/xpyjs/gantt/commit/b5c3d98e1d84406366a04cfa584e6236231c587d))
* ✨添加连线功能（基础） ([faebcc7](https://github.com/xpyjs/gantt/commit/faebcc7a77c97938f1c12e42d39af4f8ae4c001d))
* ✨添加连线以及动态增加连线 ([567eedd](https://github.com/xpyjs/gantt/commit/567eedd0236bb2154ee7a3fd6452d1d23ea4fc66))
* ✨添加抛出事件 ([08ad555](https://github.com/xpyjs/gantt/commit/08ad5554dd7f511b5afafa309b289a7cc2ce668f))
* ✨添加所有 root 的 props ([295c129](https://github.com/xpyjs/gantt/commit/295c129a656d23ea1576d38dd08f90fd0c3183d1))
* ✨添加移动的层级联动 ([fce07ce](https://github.com/xpyjs/gantt/commit/fce07ce55f8917268794d3f3fca78e8811c372ef))
* ✨添加展示数据的逻辑 ([625e862](https://github.com/xpyjs/gantt/commit/625e8628ec543cda47d49c69055c5a22b17f1a7d))
* ✨添加周末 ([edddd9d](https://github.com/xpyjs/gantt/commit/edddd9d128ba6e7f38faf5f3aa06cd262fb74576))
* ✨引入table的列合并功能 ([6f48a20](https://github.com/xpyjs/gantt/commit/6f48a2020dd97af500599269ee5b338aab1c4f07))
* ✨支持深层获取属性的 prop ([d39a98b](https://github.com/xpyjs/gantt/commit/d39a98bfb3c6a90ef550719ff003264e69bdc8d0))
* ✨add  jump to date function ([44f0f9c](https://github.com/xpyjs/gantt/commit/44f0f9c1ae65f906516f22d4a3c8f61eb5f79a7d))
* ✨add a date class and replace all ([be8e167](https://github.com/xpyjs/gantt/commit/be8e167fa2842a9ee1a8a1bf7145c1adfa680a94))
* ✨add checkbox event ([9e33b68](https://github.com/xpyjs/gantt/commit/9e33b6885a6090fe94b04102b5779b9acfa4867a))
* ✨add column props ([c5d5b43](https://github.com/xpyjs/gantt/commit/c5d5b43c94fe54d4a58c926428ee286c39a5abf0))
* ✨add column resize ([6e756df](https://github.com/xpyjs/gantt/commit/6e756df754f2211c1f79810fc8159f0fc4005d79))
* ✨add dark ([a1ad9ac](https://github.com/xpyjs/gantt/commit/a1ad9ac681bf16473ff0dc464627113d558f1ac4))
* ✨add date line in column ([9f1a1e9](https://github.com/xpyjs/gantt/commit/9f1a1e97fc07a8659bbf769bb898cb1680be18b9))
* ✨add dbl click event ([4839744](https://github.com/xpyjs/gantt/commit/48397442fa4642ebd293042a342c19b0d0db4726))
* ✨add expand ([7ad8c81](https://github.com/xpyjs/gantt/commit/7ad8c8196c421d1a60ffb05a27bc2c26d8541cb6))
* ✨add gantt header logic ([c926e9d](https://github.com/xpyjs/gantt/commit/c926e9dfcb460e9e8b03057fe7bbdb6aff76b65e))
* ✨add indent ([33928f6](https://github.com/xpyjs/gantt/commit/33928f6c6cfc812bb3d9236714ae97fe1cb81baf))
* ✨add mid line resizable ([4cd6dec](https://github.com/xpyjs/gantt/commit/4cd6dec2cba931e0a7e78bd9c956ead5bf468d03))
* ✨add progress ([c1e45a1](https://github.com/xpyjs/gantt/commit/c1e45a1d4012600274db5463522f3b79531ec1ae))
* ✨add reactive gantt header by unit and width ([e315b06](https://github.com/xpyjs/gantt/commit/e315b06175eb6c8007f1ebdea3162fd8a4c1c468))
* ✨add selection ([ba22406](https://github.com/xpyjs/gantt/commit/ba224061b346f75ed2582051e28cae290b06fcd2))
* ✨add slider move ([36c32c8](https://github.com/xpyjs/gantt/commit/36c32c8d65dcaa2308e9b114c37c956ff10fe14b))
* ✨add slider's props ([84a13de](https://github.com/xpyjs/gantt/commit/84a13de8c089438ad986b1e67cd7548a26a034d3))
* ✨complete row ([8eac017](https://github.com/xpyjs/gantt/commit/8eac01758d7a6a2e8092f1514ed6c5a45b0fdf6f))
* ✨generate gantt header logic ([145c65a](https://github.com/xpyjs/gantt/commit/145c65adcddf9200c9af721e0b9eeb1d8ccf38f5))
* add style set/get methods ([36d7162](https://github.com/xpyjs/gantt/commit/36d71623985525a6f97d47727fe6a41a8115ff29))
* change gantt header to table element ([f95d8d7](https://github.com/xpyjs/gantt/commit/f95d8d70afa9fe29bd889e16b9cd889ec4ca0fef))


### Bug Fixes

* 🐛表头拖拽后左右高度不一致 ([ddca95c](https://github.com/xpyjs/gantt/commit/ddca95c24da85168774666ef8bd96187dda459aa))
* 🐛调整第一列可以拖动大小 ([35dd5f4](https://github.com/xpyjs/gantt/commit/35dd5f4994aee881f7fd2a6d57b39a8260d5829d))
* 🐛解决展开后 column 错乱以及表头出现异常的问题 ([ab6cced](https://github.com/xpyjs/gantt/commit/ab6cced3fdde0f09ff05d6fc01877ca229a898f2))
* 🐛今天线错位 ([45b15fe](https://github.com/xpyjs/gantt/commit/45b15fefa9eaa99df3b070a5c02f7fba637a9a34))
* 🐛链式移动时日期问题 ([128ca9f](https://github.com/xpyjs/gantt/commit/128ca9f821d2b6535bb8dd5f3007ff9b30f1159d))
* 🐛判断日期相等误差 ([8d29741](https://github.com/xpyjs/gantt/commit/8d2974101d9fc96357e1e1197078e718765661c4))
* 🐛时间比较方法问题 ([dcedfe7](https://github.com/xpyjs/gantt/commit/dcedfe751da9c0f7ffca3d390b380866a84abfa4))
* 🐛修改gap位置 ([c383283](https://github.com/xpyjs/gantt/commit/c3832831c437ba5db01e1057828f88f07b9abaf1))
* 🐛修正 slider 位移后的旧日期 ([85d395d](https://github.com/xpyjs/gantt/commit/85d395d22ad616ebf67d566fb5985908ba28b248))
* 🐛修正表头缺失日期 ([6926dcd](https://github.com/xpyjs/gantt/commit/6926dcdacdc6f6e8cb8c625ade72ee693176bee6))
* 🐛修正滑块宽度 ([a8fcfc0](https://github.com/xpyjs/gantt/commit/a8fcfc01d70f5dd373ca2676f30eae5d395664b6))
* 🐛修正重设时间后 slider 位置不准确 ([5ad9253](https://github.com/xpyjs/gantt/commit/5ad92534029ff07ae6f11bf204ba9b58e9aa474c))
* 🐛border 颜色默认值 ([8e559a5](https://github.com/xpyjs/gantt/commit/8e559a5353ce7357acc333940616fcf4c713d90a))
* 🐛change 事件名称 ([9238946](https://github.com/xpyjs/gantt/commit/9238946078283dace20dd1577f9fe1b134e1e0e5))
* 🐛delete column 1 flex ([ee01ac1](https://github.com/xpyjs/gantt/commit/ee01ac1dc78faac0453df3850970ce02443bc91a))
* 🐛expand can not hide expanded children ([84b37f7](https://github.com/xpyjs/gantt/commit/84b37f793614e17d169da6fd0e460086ba01b893))
* 🐛merge column error ([01e1749](https://github.com/xpyjs/gantt/commit/01e17499394d8f9d68284b743986f37bd8d99ba2))

### [1.0.2](https://github.com/xpyjs/gantt/compare/v1.0.1...v1.0.2) (2022-06-29)

### Features

* **components:** add a silder hover switch about highlight date ([9ab0ebf](https://github.com/xpyjs/gantt/commit/9ab0ebf2329601050210b7142e74baab8b0b16c5)), closes [#29](https://github.com/xpyjs/gantt/issues/29)

### Bug Fixes

* **other:** fix main ([c09427c](https://github.com/xpyjs/gantt/commit/c09427c5775d8714e9bc5486bfc46c819c0013e0))

---

## It's old CHANGELOG for `jz-gantt` down here, maybe links is useless

### [1.3.1](https://github.com/jeremyjone/jz-gantt/compare/v1.3.0...v1.3.1) (2022-03-28)

### Bug Fixes

* **components:** 修改成功条显示时长 ([b26afd4](https://github.com/jeremyjone/jz-gantt/commit/b26afd41769d68fa7679c6ca25da0867cb0f32db))

## [1.3.0](https://github.com/jeremyjone/jz-gantt/compare/v1.2.0...v1.3.0) (2022-01-13)

### Features

* **components:** add deep checked by right click ([261c54d](https://github.com/jeremyjone/jz-gantt/commit/261c54d4e9548a6e2b32e3f849bf5412fe049c1c)), closes [#16](https://github.com/jeremyjone/jz-gantt/issues/16)

## [1.2.0](https://github.com/jeremyjone/jz-gantt/compare/v1.1.12...v1.2.0) (2021-12-31)

### Features

* **components:** add progress-bar in slider ([be0d24b](https://github.com/jeremyjone/jz-gantt/commit/be0d24b74a960437a567d0013cf741ba1c8f4c92))

### Bug Fixes

* **components:** fix successbar position problem ([0655cdf](https://github.com/jeremyjone/jz-gantt/commit/0655cdf19b0ef66dca82be046689c948a07ec926)), closes [#15](https://github.com/jeremyjone/jz-gantt/issues/15)
* **components:** update progress slider not move rule ([5152a8d](https://github.com/jeremyjone/jz-gantt/commit/5152a8d5cc686f443fce1444f57d454d23d58596))
* **components:** update row-height linkage ([7f630ec](https://github.com/jeremyjone/jz-gantt/commit/7f630ec3ad404b015dead55131dd750429674736)), closes [#13](https://github.com/jeremyjone/jz-gantt/issues/13)
* **composables:** update event propagation rule ([2f60af7](https://github.com/jeremyjone/jz-gantt/commit/2f60af7aa0c190b3f2db291b0fdab5e66b2b6791))
* **components:** update silder progress decimal ([2b34436](https://github.com/jeremyjone/jz-gantt/commit/2b344361fdf542bca7b13d8404c0c70bebfa1070))

### [1.1.12](https://github.com/jeremyjone/jz-gantt/compare/v1.1.11...v1.1.12) (2021-12-28)

### Bug Fixes

* **components:** fix multi gantt component in one page problem ([8f1f9db](https://github.com/jeremyjone/jz-gantt/commit/8f1f9dba7087d8e16ac64cc1c8df89e3997fb6ce)), closes [#10](https://github.com/jeremyjone/jz-gantt/issues/10)
* **composables:** fix jump function error ([88c9f71](https://github.com/jeremyjone/jz-gantt/commit/88c9f719ed00d0648b42e6c54bbccac584bae5a2))
* **styles:** adjust setting btn position ([9f123a7](https://github.com/jeremyjone/jz-gantt/commit/9f123a705d9e65ece6ed3a83aeff3e20a99474d5))
* **styles:** fix icon class prefix ([cafae5b](https://github.com/jeremyjone/jz-gantt/commit/cafae5b3a4c7397b4e63c343a3d351bd988ff07d)), closes [#12](https://github.com/jeremyjone/jz-gantt/issues/12)
* **styles:** fix weekend line height ([21e75df](https://github.com/jeremyjone/jz-gantt/commit/21e75df0320ba519efb2ecb1251f1444570b6353))

### [1.1.11](https://github.com/jeremyjone/jz-gantt/compare/v1.1.10...v1.1.11) (2021-12-23)

### Features

* **components:** add a toast when trigger no-date-error event ([efa707e](https://github.com/jeremyjone/jz-gantt/commit/efa707ed1ca8bd429758b092d77be809ce1dc776))

### Bug Fixes

* **components:** fix start-key and end-key invalid ([a501b32](https://github.com/jeremyjone/jz-gantt/commit/a501b329f5dc21fa30249183d473e48f375fdcf6)), closes [#11](https://github.com/jeremyjone/jz-gantt/issues/11)

### [1.1.10](https://github.com/jeremyjone/jz-gantt/compare/v1.1.9...v1.1.10) (2021-12-20)

### Features

* **components:** add a toast ([f618194](https://github.com/jeremyjone/jz-gantt/commit/f61819473963f897f1a1f4930a43c8c2e3faa62b))
* **styles:** add success bar when move slider succeed ([e8c2916](https://github.com/jeremyjone/jz-gantt/commit/e8c2916ef434d2f3b753ca2c6590364a42adc434))

### Bug Fixes

* **components:** optimize header highlight ([e83d3c9](https://github.com/jeremyjone/jz-gantt/commit/e83d3c97c49a0387804b8521490e17218c09a3ec))

### [1.1.9](https://github.com/jeremyjone/jz-gantt/compare/v1.1.8...v1.1.9) (2021-12-16)

### [1.1.8](https://github.com/jeremyjone/jz-gantt/compare/v1.1.7...v1.1.8) (2021-12-16)

### Bug Fixes

* **styles:** added highlight header when hover slider ([0f50c24](https://github.com/jeremyjone/jz-gantt/commit/0f50c248df8f3f815335a189d23a6ddc3702e248))

### [1.1.7](https://github.com/jeremyjone/jz-gantt/compare/v1.1.6...v1.1.7) (2021-12-07)

### Features

* **components:** add column label prop depth read attr ([c9b25f1](https://github.com/jeremyjone/jz-gantt/commit/c9b25f135b52b1a16c96aecce9e72fdef23c8aa4))
* **components:** add two props in column component(class & style) ([edd2bbf](https://github.com/jeremyjone/jz-gantt/commit/edd2bbf74eaffd55230c93debfafaef43fa3667e)), closes [#7](https://github.com/jeremyjone/jz-gantt/issues/7)
* **other:** update typings ([05d3acf](https://github.com/jeremyjone/jz-gantt/commit/05d3acfbd0e717996c266fae934c8b64ba84a095))

### [1.1.6](https://github.com/jeremyjone/jz-gantt/compare/v1.1.5...v1.1.6) (2021-11-24)

### Bug Fixes

* **dependencies:** fix import css bug ([56f1bda](https://github.com/jeremyjone/jz-gantt/commit/56f1bda8edfe64fbfa89faa0e35f9de3dd693b97)), closes [#8](https://github.com/jeremyjone/jz-gantt/issues/8)

### [1.1.5](https://github.com/jeremyjone/jz-gantt/compare/v1.1.4...v1.1.5) (2021-11-24)

### Bug Fixes

* **styles:** fix column chunk style ([dd14eac](https://github.com/jeremyjone/jz-gantt/commit/dd14eacb4fb4c6957e3a98f9e3509fc368893dc5)), closes [#6](https://github.com/jeremyjone/jz-gantt/issues/6)
* **styles:** fix repeated row bottom border ([bfe7e21](https://github.com/jeremyjone/jz-gantt/commit/bfe7e219786cf296cdcf4028843455a4d9ad6915))

### [1.1.4](https://github.com/jeremyjone/jz-gantt/compare/v1.1.3...v1.1.4) (2021-11-15)

### Bug Fixes

* **components:** fix JGanttColumn repeated loading ([8f520bf](https://github.com/jeremyjone/jz-gantt/commit/8f520bfb3940504e6b7c387402ffb1f73248eda3)), closes [#5](https://github.com/jeremyjone/jz-gantt/issues/5)

### [1.1.3](https://github.com/jeremyjone/jz-gantt/compare/v1.1.2...v1.1.3) (2021-11-12)

### ⚠ BREAKING CHANGES

* **components:** the format of the data thrown by move-slider emit changes to Array<any>

### Bug Fixes

* **components:** fix incomplete data thrown by move-slider emit in linkage ([4bec2d1](https://github.com/jeremyjone/jz-gantt/commit/4bec2d1eab429881b601b77383c6d5592b5094c7))

### [1.1.2](https://github.com/jeremyjone/jz-gantt/compare/v1.1.1...v1.1.2) (2021-11-11)

### Bug Fixes

* **style:** fix gantt width too long when changed unit or column size ([0542ea4](https://github.com/jeremyjone/jz-gantt/commit/0542ea4ef6bb6f41f5cce4489a40ae66380e5bcf))
* **style:** fix today line left diff ([25b038f](https://github.com/jeremyjone/jz-gantt/commit/25b038f8068443067ab368c77c904221368cf26a))
* **styles:** fix weekend and today line are above slider ([1d6bb05](https://github.com/jeremyjone/jz-gantt/commit/1d6bb05072e22bcf40b4ca1751bd24a024423d22))

### [1.1.1](https://github.com/jeremyjone/jz-gantt/compare/v1.1.0...v1.1.1) (2021-11-04)

### Features

* **styles:** 新增设置按钮的显示控制，同时外置了设置内容方法 ([02d4eac](https://github.com/jeremyjone/jz-gantt/commit/02d4eace28a9f3907cbe3e0083d14ae51a407491))
