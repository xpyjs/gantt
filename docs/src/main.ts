import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Home from "./views/Home.vue";
import Demo from "./views/Demo.vue";
import "./styles/main.scss";

// 路由配置
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（例如浏览器后退/前进），使用保存的位置
    if (savedPosition) {
      return savedPosition;
    }
    // 如果有锚点，滚动到锚点位置
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 80 // 为页面头部预留空间
      };
    }
    // 否则滚动到页面顶部
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/demos",
      name: "Demos",
      component: () => import("./views/Demos.vue")
    },
    {
      path: "/demo/:category/:name",
      name: "Demo",
      component: Demo,
      props: true
    },
    {
      path: "/tutorials",
      name: "Tutorials",
      component: () => import("./views/Tutorials.vue")
    },
    {
      path: "/api",
      name: "API",
      component: () => import("./views/API.vue")
    },
    {
      path: "/api/options",
      name: "APIOptions",
      component: () => import("./views/APIOptions.vue")
    },
    {
      path: "/api/events",
      name: "APIEvents",
      component: () => import("./views/APIEvents.vue")
    },
    {
      path: "/api/methods",
      name: "APIMethods",
      component: () => import("./views/APIMethods.vue")
    },
    {
      // 重定向旧路径到新路径
      path: "/demo/:pathMatch(.*)*",
      redirect: "/demos"
    }
  ]
});

const app = createApp(App);
app.use(router);
app.mount("#app");
