import "@vue/runtime-core";

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    XGanttVue: typeof import("./index")["XGanttVue"];
  }
}
