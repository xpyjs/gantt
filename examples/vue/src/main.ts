/*
 * @Author: JeremyJone
 * @Date: 2025-06-17
 * @Description: Vue 示例应用入口
 */

import { createApp } from "vue";
// import App from "./App.vue";
// import App from "./App2.vue";
// import App from "./App3.vue";
// import App from "./App4/index.vue";
import App from "./App5/index.vue";
// import XGanttVue from "@xpyjs/gantt-vue";
// import "@xpyjs/gantt-vue/style.css";

import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App);

// app.use(XGanttVue);
app.use(ElementPlus, { locale: zhCn });
app.mount("#app");
