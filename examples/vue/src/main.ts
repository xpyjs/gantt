/*
 * @Author: JeremyJone
 * @Date: 2025-06-17
 * @Description: Vue 示例应用入口
 */

import { createApp } from "vue";
import App from "./App2.vue";
// import XGanttVue from "@xpyjs/gantt-vue";
// import "@xpyjs/gantt-vue/style.css";

const app = createApp(App);

// app.use(XGanttVue);
app.mount("#app");
