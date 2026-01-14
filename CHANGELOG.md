## [0.0.3](https://github.com/xpyjs/gantt/compare/v0.0.2...v0.0.3) (2026-01-14)


### Bug Fixes

* **core:** Fixes memory leak in link cleanup operations ([f525e00](https://github.com/xpyjs/gantt/commit/f525e00df8b1625c40353540c1b723563ed47f6a))
* **core:** Improves chart slider boundary detection logic ([342508f](https://github.com/xpyjs/gantt/commit/342508fa2b971f2d81a9cc0e964577f6520fdd11))
* **core:** Improves task update diff algorithm for better performance ([cf8e086](https://github.com/xpyjs/gantt/commit/cf8e0861d1f469c8419f59ed7d3dec8b4b080572))
* **core:** listen option changed and update resize line style ([533ef66](https://github.com/xpyjs/gantt/commit/533ef665229a6295b61b2f01fdb8a4059120cc45))
* **core:** Prevents event bubbling on expand button interactions ([be55d0c](https://github.com/xpyjs/gantt/commit/be55d0c794a8ac421b2d0e7fa981bdd74bc71221))
* **core:** table column width reset when options changed ([80825b9](https://github.com/xpyjs/gantt/commit/80825b92672ee9abece9c017ee20af65e458ab53))
* **core:** update collapse button when options changed. ([af45120](https://github.com/xpyjs/gantt/commit/af451207379a62ff2128013a97fb6bad58a296a9))
* **core:** update milestone shape y pos ([eaef0c9](https://github.com/xpyjs/gantt/commit/eaef0c9245198fb39b273999122d2af7ba0b8c4b))
* **core:** update scrollbar style when options changed ([dc147f8](https://github.com/xpyjs/gantt/commit/dc147f87b1c4f072fae31612ffa3e78aaa929998))


### Features

* **core:** Add 'auto' keyword color in HEADER ([cd79ce6](https://github.com/xpyjs/gantt/commit/cd79ce6e2e50af5d1364c0f69821ff428aa9bc87))



## [0.0.2](https://github.com/xpyjs/gantt/compare/v0.0.1...v0.0.2) (2025-12-31)


### Bug Fixes

* **core:** Abnormal slider pos when drag data ([df39023](https://github.com/xpyjs/gantt/commit/df3902375976949f0dfbd7727be851d81de29150)), closes [#167](https://github.com/xpyjs/gantt/issues/167)



## [0.0.1](https://github.com/xpyjs/gantt/compare/v0.0.1-rc.5...v0.0.1) (2025-11-17)


### Features

* **core:** add a time param on click.row / dblclick.row / contextmenu.row. User can create a schedule quickly by event. ([4c8f9dc](https://github.com/xpyjs/gantt/commit/4c8f9dcbf96bec01a4b954620a2373f425b88170))
* **core:** add drag function. User can allow a drag icon at left on table. When dragging, it will be appeared a prompt area/line on gantt. ([2cfc30f](https://github.com/xpyjs/gantt/commit/2cfc30f761b9c30a4f97396b777c19316cfe8b3a))
* **core:** change log default level to warn. ([bcd2394](https://github.com/xpyjs/gantt/commit/bcd23945fb84d03dbe5ffadaea021affc8015d0c))
* **react:** add drag function on react. ([8aa69df](https://github.com/xpyjs/gantt/commit/8aa69dff946cefa6a3deb9506ae5b5dd91ef17d8))
* **react:** update parameters description ([9354030](https://github.com/xpyjs/gantt/commit/935403003ed6e62e956a6f962809f09c91b49d44))
* **vue:** Adaptation parameters ([486ee41](https://github.com/xpyjs/gantt/commit/486ee41bb4c234e5437ed1b773edc486ee856321))
* **vue:** add drag function on vue. ([68bfee0](https://github.com/xpyjs/gantt/commit/68bfee061ce455b0804da9a625e2e177f82f9341))



## [0.0.1-rc.5](https://github.com/xpyjs/gantt/compare/v0.0.1-rc.4...v0.0.1-rc.5) (2025-10-22)


### Bug Fixes

* **core:** click.row event can not be triggered repeatedly ([a9def3f](https://github.com/xpyjs/gantt/commit/a9def3f5b77de9dd38dd3520cde222d917982a13))


### Features

* **core:** Adds auto-resize feature with ResizeObserver support ([1c2c22c](https://github.com/xpyjs/gantt/commit/1c2c22cc623c49b532fe48f197fc4f6c8da561ba))



## [0.0.1-rc.4](https://github.com/xpyjs/gantt/compare/v0.0.1-rc.3...v0.0.1-rc.4) (2025-10-07)


### Bug Fixes

* **core:** chart view selection highlight error when expand changed ([5ebe164](https://github.com/xpyjs/gantt/commit/5ebe164766a1aae6732b3e0c045ae003ac3ffed7))


### Features

* **core:** add remove data func ([8e1d798](https://github.com/xpyjs/gantt/commit/8e1d798fbb042cfb992dbbd6b42dd6a4664e6540))
* **react:** add remove data func ([c3f0813](https://github.com/xpyjs/gantt/commit/c3f0813087e68404be4edb7b4dba219e5bb5391f))
* **vue:** add remove data func ([82f9925](https://github.com/xpyjs/gantt/commit/82f992565cd8acda1de81f1db689c19139cccd39))



## [0.0.1-rc.3](https://github.com/xpyjs/gantt/compare/v0.0.1-rc.2...v0.0.1-rc.3) (2025-09-30)


### Bug Fixes

* **core:** highlight position error ([35fef4e](https://github.com/xpyjs/gantt/commit/35fef4eb434f3ae1ad6aa3bec81ff349d0214ad2))
* **core:** Temporarily resolve the anomalies that occur after data updates at the location of the data update ([697a089](https://github.com/xpyjs/gantt/commit/697a08916a26d496a00d13a06af7a2422b63b8b5))



## [0.0.1-rc.2](https://github.com/xpyjs/gantt/compare/v0.0.1-rc.1...v0.0.1-rc.2) (2025-09-24)


### Bug Fixes

* **core:** fix link visible error when expand some task ([8d16606](https://github.com/xpyjs/gantt/commit/8d16606af9c0bd372037244832f1403afe9d7092))
* **core:** fix selection pos error when expand some task ([2f21b9d](https://github.com/xpyjs/gantt/commit/2f21b9da241b9cd334e8fa9486e45154a4aa5a21))



## [0.0.1-rc.1](https://github.com/xpyjs/gantt/compare/v0.0.1-beta.4...v0.0.1-rc.1) (2025-09-22)


### Features

* **core:** add get task method & get size method & scroll method ([ef6c4fa](https://github.com/xpyjs/gantt/commit/ef6c4fa156dc10a6fea2e9b6755866f5a7217d4b))
* **core:** update slider & baseline events ([228717a](https://github.com/xpyjs/gantt/commit/228717a0a5a558fc9becbb508154e615ace28589))
* **react:** add get task method & get size method & scroll method ([a5288dc](https://github.com/xpyjs/gantt/commit/a5288dcc6228edf6f8773b2619e944c6efd03b38))
* **react:** update slider & baseline events ([d654efa](https://github.com/xpyjs/gantt/commit/d654efad86d2d26e2a82735eea1cf96173ab2789))
* **vue:** add get task method & get size method & scroll method ([b4cead8](https://github.com/xpyjs/gantt/commit/b4cead8cc87be17ccea1f27f80fafbc83f9c55be))
* **vue:** update slider & baseline events ([def7536](https://github.com/xpyjs/gantt/commit/def753653e8e0463e6b6274d108e48bf2c2bbcaf))



## [0.0.1-beta.4](https://github.com/xpyjs/gantt/compare/v0.0.1-beta.3...v0.0.1-beta.4) (2025-09-11)


### Bug Fixes

* **core:** fix baseline render error ([a3d4d81](https://github.com/xpyjs/gantt/commit/a3d4d819af4937233ca23b4aee4665634a075af5))
* **core:** fix link bling when scrolling ([bdca277](https://github.com/xpyjs/gantt/commit/bdca27781f88c8ff56f3923b010b5f1df18faebc))
* **core:** link contextmenu error ([30bcfac](https://github.com/xpyjs/gantt/commit/30bcfac1be464dd3b47b3ea419d4df4265f3879c))
* **core:** links disappeared when update someone task ([84819db](https://github.com/xpyjs/gantt/commit/84819dbbc2b2d840d8179dbbee83edcafff9a207))
* **core:** Optimization of render link ([df790ec](https://github.com/xpyjs/gantt/commit/df790ec5458e4eac543e16112ab1f307c440577a))
* **core:** slider moves abnormally to right after toggle table display ([b2e122d](https://github.com/xpyjs/gantt/commit/b2e122de74c8a5380a19ecfdaa2a477e688bd1c0))
* **core:** table row contextmenu event error ([1c9cfa9](https://github.com/xpyjs/gantt/commit/1c9cfa98e862cca200ef36384f41b7fe671fe2f6))
* **core:** update blink when link has cycle and full tasks-link will be blink. ([49053b5](https://github.com/xpyjs/gantt/commit/49053b52396c4be4a8714ce4edbd876ccd90e403))



## [0.0.1-beta.3](https://github.com/xpyjs/gantt/compare/v0.0.1-beta.2...v0.0.1-beta.3) (2025-09-10)


### Bug Fixes

* **core:** fix the view not update after delete link ([e57b809](https://github.com/xpyjs/gantt/commit/e57b809d19572a7d733766375a801c52dc193719))



## [0.0.1-beta.2](https://github.com/xpyjs/gantt/compare/v0.0.1-beta.1...v0.0.1-beta.2) (2025-09-09)


### Bug Fixes

* **core:** 移动任务条时，可以按照当前时间进行跳转 ([6c94c72](https://github.com/xpyjs/gantt/commit/6c94c7288e3b8ff7bf886e3cb03af98d818ab8e6))
* **core:** 优化拖拽任务条，当任务条在界外时的移动优化 ([463c98b](https://github.com/xpyjs/gantt/commit/463c98b9f2ad108fb7fbb414acf1b30d64bb5921))
* **core:** optimizing the problem of lag when dealing with large amounts of data ([6e3b32b](https://github.com/xpyjs/gantt/commit/6e3b32b3067cfaf24b51fe26fd66f754d0fd0ee4)), closes [#157](https://github.com/xpyjs/gantt/issues/157)
* **core:** when click collapse button, view may not update. ([304fe25](https://github.com/xpyjs/gantt/commit/304fe25dadb4e8e796a75836bb2cf6c1e96867e4))


### Features

* **core:** When links has cycle, it will print one warning message ([a650b18](https://github.com/xpyjs/gantt/commit/a650b1882333ff8bcba92035cc06249265c11209))



## [0.0.1-beta.1](https://github.com/xpyjs/gantt/compare/v0.0.1-beta.0...v0.0.1-beta.1) (2025-09-02)


### Features

* **core:** add a method for link-data chain ([b316636](https://github.com/xpyjs/gantt/commit/b316636c80d0165277a2ae8d22f020c48fd2c9da))
* **react:** add a method for link-data chain ([df949b1](https://github.com/xpyjs/gantt/commit/df949b1ae7b4f52eef972b1f7d5d5889a316c227))
* **vue:** add a method for link-data chain ([f8961e7](https://github.com/xpyjs/gantt/commit/f8961e70ff62578172dfd8ed89fe8091d7dbfdb2))



## [0.0.1-beta.0](https://github.com/xpyjs/gantt/compare/v0.0.1-alpha.5...v0.0.1-beta.0) (2025-08-19)


### Bug Fixes

* **core:** chart.startTime & chart.endTime invalid. ([c4df71c](https://github.com/xpyjs/gantt/commit/c4df71c8796580562b59329bef0bdb7352f48504)), closes [#154](https://github.com/xpyjs/gantt/issues/154)
* **core:** the table is flashing when update options. ([fe5a161](https://github.com/xpyjs/gantt/commit/fe5a1613e3b6399790cbf4aac9aa077314832b1f)), closes [#153](https://github.com/xpyjs/gantt/issues/153)


### Features

* **core:** add a flag for today ([b4371e3](https://github.com/xpyjs/gantt/commit/b4371e3d09348571cf859130f74e20cc4438d7d4))
* **core:** add a text config for holidays ([e609122](https://github.com/xpyjs/gantt/commit/e60912223265bb8181cbdca4337be8a536b96639))
* **core:** add flag config for custom moment. ([9a8cea3](https://github.com/xpyjs/gantt/commit/9a8cea3e6b0feeb0f3947e2f46468a35cfd4eed2))



## [0.0.1-alpha.5](https://github.com/xpyjs/gantt/compare/v0.0.1-alpha.4...v0.0.1-alpha.5) (2025-08-08)


### Bug Fixes

* **core:** table merge problem ([b9b51d9](https://github.com/xpyjs/gantt/commit/b9b51d95fe469f132d1132096172b2434ecc38ad))
* **core:** update bar hover style ([736ae17](https://github.com/xpyjs/gantt/commit/736ae176e360a791c35e71b258353743c16c73ab))


### Features

* **core:** add summary bar ([763c952](https://github.com/xpyjs/gantt/commit/763c9524af0252420af89e33ab29e3c8a6aacf5e))
* **core:** After the link update, there is no longer a need for manual view updates. ([6281002](https://github.com/xpyjs/gantt/commit/628100204b79ef6025f3773339fc5136307dc04a))
* **core:** When create & drag links, can use ESC to cancel ([55d4e1b](https://github.com/xpyjs/gantt/commit/55d4e1b6872554ec3a265af1502a218631d12b29))



## [0.0.1-alpha.4](https://github.com/xpyjs/gantt/compare/v0.0.1-alpha.3...v0.0.1-alpha.4) (2025-08-06)


### Bug Fixes

* **core:** scrollbar continues to scroll after touching the boundary ([5a1aae5](https://github.com/xpyjs/gantt/commit/5a1aae54493514998d64977df1d89efd1eb520f0))
* link dash can not be defined in the data ([7826574](https://github.com/xpyjs/gantt/commit/7826574720c2a08456467f4be67bac251ea268ac))


### Features

* **core:** add a param to control the visibility of the bar ([8ddd550](https://github.com/xpyjs/gantt/commit/8ddd550d5d73e978e7162544210e97bb030e4f48))
* **core:** add bar hover highlight & event ([8a2d2c5](https://github.com/xpyjs/gantt/commit/8a2d2c5a1d3cb831e256cfab3680c2c4247e6dc5))
* **core:** add baseline config. ([476a4ee](https://github.com/xpyjs/gantt/commit/476a4ee194a72d6244c74812007598beb4732dbe))
* **core:** add contextmenu:link event ([7cea0a4](https://github.com/xpyjs/gantt/commit/7cea0a46cbcb4c022fd2efa1a817662d37a606f7))
* **core:** add milestone ([1a1aa0c](https://github.com/xpyjs/gantt/commit/1a1aa0c39ff8f996f3343f137f1c75c1990eab21))
* **core:** add resize handler style config ([9b5d2d7](https://github.com/xpyjs/gantt/commit/9b5d2d7988eb48193de3adbf1e420b3d153cf4c9))
* **core:** add table collapsible btn ([9e5d643](https://github.com/xpyjs/gantt/commit/9e5d6437c60e9ee51fb727f01b271c5f0d610fa2))
* **core:** bar params support func config ([88ea7da](https://github.com/xpyjs/gantt/commit/88ea7da8d48a997c285525862992738752f0fbdf))



## 0.0.1-alpha.3 (2025-07-25)


### Features

* create new vanilla js version ([6cac6e9](https://github.com/xpyjs/gantt/commit/6cac6e968f4ed7aa0c18f10568ec45d56e7b34a1))
* create React framework ([3fa1f20](https://github.com/xpyjs/gantt/commit/3fa1f20ca17131f113a9093e5a276a7e3bce88e9))
* create Vue framework ([b688dc9](https://github.com/xpyjs/gantt/commit/b688dc9e9432089df1ff2665f31fc049c4381036))



