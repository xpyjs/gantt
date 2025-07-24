import { XGantt } from "@xpyjs/gantt-core";
import dayjs from "dayjs";
// Import the type from the main package entry
// import type { XGanttOptions } from "@xpyjs/gantt-core";
// Import the core library's CSS. Make sure the path matches the export in core's package.json
import "@xpyjs/gantt-core/index.css";

import "dayjs/locale/zh";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import { ILink } from "@xpyjs/gantt-core";

const ganttContainer = document.getElementById("gantt1");

if (ganttContainer) {
  const data = [
    {
      name: "Task 1",
      startDate: "2024-01-03",
      endDate: "2024-01-05",
      field1: "field1",
      field2: "field2",
      field3: "field3",
      progress: 0.5,
      id: "1"
    },
    {
      name: "Task 2",
      startDate: "2024-01-06",
      endDate: "2024-01-20",
      field1: "field1",
      field2: "field2",
      field3: "field3",
      progress: 0.8,
      id: "2",
      children: [
        {
          name: "Subtask 1",
          startDate: "2024-01-06",
          endDate: "2024-01-08",
          field1: "field1",
          field2: "field2",
          field3: "field3",
          progress: 47,
          id: "2-1"
        },
        {
          name: "Subtask 2",
          startDate: "2024-01-08",
          endDate: "2024-01-10",
          field1: "field1",
          field2: "field2",
          field3: "field3",
          progress: 100,
          id: "2-2"
        },
        {
          name: "Subtask 3",
          startDate: "2024-01-10",
          endDate: "2024-01-18",
          field1: "field1",
          field2: "field2",
          field3: "field3",
          progress: 1 / 3,
          children: [
            {
              name: "Subtask 3-1",
              startDate: "2024-01-10",
              endDate: "2024-01-12",
              progress: 0.1,
              id: "3-1"
            },
            {
              name: "Subtask 3-2",
              startDate: "2024-01-12",
              endDate: "2024-01-14",
              field1: "field1",
              field2: "field2",
              field3: "field3",
              id: "3-2"
            },
            {
              name: "Subtask 3-3",
              startDate: "2024-01-14",
              endDate: "2024-01-16",
              field1: "field1",
              field2: "field2",
              field3: "field3",
              id: "3-3"
            }
          ]
        },
        {
          name: "Subtask 4",
          startDate: "2024-01-12",
          endDate: "2024-01-14",
          field1: "field1",
          field2: "field2",
          field3: "field3"
        }
      ]
    },
    {
      id: "3",
      name: "Task 3",
      startDate: "2024-01-11",
      endDate: "2024-01-15",
      field1: "field1",
      field2: "field2",
      field3: "field3"
    },
    {
      id: "4",
      name: "Task 4",
      startDate: "2024-01-16",
      endDate: "2024-01-20",
      field1: "field1",
      field2: "field2",
      field3: "field3",
      children: [
        {
          name: "Subtask 4",
          startDate: "2024-01-16",
          endDate: "2024-01-18",
          field1: "field1",
          field2: "field2",
          field3: "field3"
        },
        {
          name: "Subtask 5",
          startDate: "2024-01-18",
          endDate: "2024-01-20",
          field1: "field1",
          field2: "field2",
          field3: "field3"
        }
      ]
    },
    ...Array.from({ length: 1000 }, (_, i) => ({
      name: `Task ${i + 6}`,
      startDate: dayjs("2024-01-21").add(i, "day").format("YYYY-MM-DD"),
      endDate: dayjs("2024-01-25").add(i, "day").format("YYYY-MM-DD")
    }))
  ];

  const links: ILink[] = [
    { from: "1", to: "2", index: "111" },
    { from: "3", to: "4", index: "222", color: "green", type: "SF" },
    { from: "2-1", to: "2-2", index: "333", color: "red" },
    { from: "3-3", to: "3-1", index: "444", color: "#123" },
    { from: "3-3", to: "3-2", index: "555", type: "SF" },
    { from: "2-1", to: "3-1", index: "666", gap: 10 }
  ];

  try {
    const gantt = new XGantt(ganttContainer, {
      logLevel: "debug",
      data,
      links: {
        show: true,
        data: links,
        key: "index",
        create: {
          enabled: true,
          mode: "always",
          to: (row: any) => {
            return row.level === 1;
          },
          from: (row: any) => {
            return row.level === 1 ? "F" : "S";
          }
        }
      },
      fields: {
        name: "name",
        startTime: "startDate",
        endTime: "endDate"
      },
      // primaryColor: "#406cff",
      highlight: true,
      dateFormat: "YYYY-MM-DD",
      unit: "day",
      locale: "en",
      table: {
        // align: "left",
        // ellipsis: false,
        columns: [
          {
            label: "Name",
            width: 150,
            field: "name",
            merge: (v, r, c, l) => {
              if (v === "Task 1") return { col: 3, row: 1 };
              if (v === "Subtask 1") return { col: 3, row: 2 };
              if (v === "Task 21") return { col: 2, row: 10 };
            },
            align: "left",
            // customStyle: {
            //   display: "flex",
            //   "align-items": "center"
            // },
            render: row => {
              return row.level === 1
                ? row.data.name
                : `<div style="color: red">${row.data.name}</div>`;
            }
          },
          {
            label: "时间",
            children: [
              { label: "Start Date", width: 100, field: "startDate" },
              { label: "End Date", width: 100, field: "endDate" }
            ]
          },
          {
            label: "其他",
            children: [
              { label: "Field1", width: 60, field: "field1" },
              {
                label: "二级菜单",
                children: [
                  {
                    label: "Field2",
                    width: 80,
                    field: "field2",
                    ellipsis: false
                  },
                  {
                    label: "Field3",
                    width: 50,
                    field: "field3",
                    align: "right",
                    headerAlign: "left"
                  }
                ]
              }
            ]
          }
        ]
      },
      chart: {
        // headerCellFormat: (date: Date, unit: string) => {
        //   return date.getDate() + "号";
        // },
        // startTime: "2024-01-05",
        // endTime: "2024-01-15",
        // autoCellWidth: true,
      },
      selection: {
        enabled: true
      },
      expand: {
        show: true,
        enabled: true
      },
      border: {
        show: true
      },
      row: {
        height: 30
        // backgroundColor: ["red", "green"]
      },
      bar: {
        // height: "30%",
        field: "name",
        move: {
          enabled: true,
          // lock: true,
          byUnit: true,
          single: {
            left: true,
            right: true
          },
          link: {
            child: "scale",
            parent: "expand"
          }
        },
        align: "left",
        // color: "pink",
        progress: {
          // show: true,
          radius: [0, 0, 0, 0]
          // textAlign: "top"
          // backgroundColor: "red",
          // opacity: 0.5
        }
      },
      weekend: {
        show: true,
        // pattern: "stripe",
        backgroundColor: "#f0f0f0",
        opacity: 0.2
        // patternOptions: {
        //   width: 1,
        //   angle: 70,
        //   size: 10,
        //   spacing: 20
        // }
      },
      holiday: {
        show: true,
        // pattern: "stripe",
        holidays: [
          {
            date: "2024-01-05"
          },
          {
            date: "2024-01-10",
            backgroundColor: "red"
          },
          {
            date: "2024-01-11",
            backgroundColor: "blue"
          }
        ]
      }
    });
    console.log("XGantt instance created:", gantt);

    // 监听事件
    gantt.on("loaded", () => {
      console.log("Gantt chart loaded successfully!");
    });

    gantt.on("error", error => {
      switch (error) {
        case "LINK_SAME":
          alert("链接不允许连接到自身");
          break;
        case "LINK_NOT_ALLOWED":
          alert("链接不被允许");
        default:
          console.error("An error occurred:", error);
      }
    });

    gantt.on("update:link", link => {
      console.log("link is updated", link);
      const index = links.findIndex(l => l.index === link.index);
      if (index !== -1) {
        links.splice(index, 1, link);
        gantt.update({ links: { data: links } });
      }
    });

    gantt.on("create:link", (link: any) => {
      console.log("link is created", link);
      links.push({ ...link, index: `${Date.now()}` });
      gantt.update({ links: { data: links } });
    });

    gantt.on("select:link", (add, cancel, all) => {
      console.log("link is selected", add, cancel, all);
      if (add?.index === "555") {
        links.splice(
          links.findIndex(l => l.index === add.index),
          1
        );
        gantt.update({ links: { data: links } });
      }
    });

    gantt.on("move", (row: any) => {
      console.log("slider is moved", row);
    });

    gantt.on("select", (data: any[], checked: boolean, all: any[]) => {
      console.log("selected", data, checked, all);
    });

    gantt.on("click:row", (e: MouseEvent, data: any) => {
      console.log("row is clicked", e, data);
    });
    gantt.on("dblclick:row", (e: MouseEvent, data: any) => {
      console.log("row is double clicked", e, data);
    });
    gantt.on("contextmenu:row", (e: MouseEvent, data: any) => {
      console.log("row context menu", e, data);
    });

    gantt.on("click:slider", (e: MouseEvent, data: any) => {
      console.log("slider is clicked", e, data);
    });
    gantt.on("dblclick:slider", (e: MouseEvent, data: any) => {
      console.log("slider is double clicked", e, data);
    });
    gantt.on("contextmenu:slider", (e: MouseEvent, data: any) => {
      console.log("slider context menu", e, data);

      // 阻止默认的右键菜单
      e.preventDefault();

      // 移除已存在的右键菜单
      const existingMenu = document.getElementById("gantt-context-menu");
      if (existingMenu) {
        existingMenu.remove();
      }

      // 创建右键菜单
      const contextMenu = document.createElement("div");
      contextMenu.id = "gantt-context-menu";
      contextMenu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        min-width: 150px;
        padding: 4px 0;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      // 菜单项数据
      const menuItems = [
        {
          text: `编辑任务: ${data.name}`,
          action: () => console.log("编辑任务", data)
        },
        { text: "删除任务", action: () => console.log("删除任务", data) },
        { text: "复制任务", action: () => console.log("复制任务", data) },
        { text: "查看详情", action: () => console.log("查看详情", data) }
      ];

      // 创建菜单项
      menuItems.forEach((item, index) => {
        const menuItem = document.createElement("div");
        menuItem.style.cssText = `
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          ${index > 0 ? "border-top: 1px solid #f0f0f0;" : ""}
        `;
        menuItem.textContent = item.text;

        // 鼠标悬停效果
        menuItem.addEventListener("mouseenter", () => {
          menuItem.style.backgroundColor = "#f5f5f5";
        });

        menuItem.addEventListener("mouseleave", () => {
          menuItem.style.backgroundColor = "transparent";
        });

        // 点击事件
        menuItem.addEventListener("click", () => {
          item.action();
          contextMenu.remove();
        });

        contextMenu.appendChild(menuItem);
      });

      // 将菜单添加到页面
      document.body.appendChild(contextMenu);

      // 检查菜单是否超出视窗边界并调整位置
      const rect = contextMenu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect.right > viewportWidth) {
        contextMenu.style.left = `${e.clientX - rect.width}px`;
      }

      if (rect.bottom > viewportHeight) {
        contextMenu.style.top = `${e.clientY - rect.height}px`;
      }

      // 点击其他地方关闭菜单
      const closeMenu = (event: MouseEvent) => {
        if (!contextMenu.contains(event.target as Node)) {
          contextMenu.remove();
          document.removeEventListener("click", closeMenu);
        }
      };

      // 延迟添加全局点击监听，避免立即触发
      setTimeout(() => {
        document.addEventListener("click", closeMenu);
      }, 100);

      // ESC 键关闭菜单
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          contextMenu.remove();
          document.removeEventListener("keydown", handleKeydown);
        }
      };
      document.addEventListener("keydown", handleKeydown);
    });

    // 添加按钮
    const btnGroup = document.getElementById("btn-group");
    if (gantt) {
      if (btnGroup) {
        /** 跳转日期按钮 */
        {
          const btn1 = document.createElement("button");
          btn1.innerHTML = "跳转到今天";
          btn1.onclick = () => {
            const res = gantt.jumpTo();
            console.log("跳转结果", res);
          };
          btnGroup.appendChild(btn1);
        }

        /** 切换颜色按钮 */
        {
          const btn2 = document.createElement("button");
          btn2.innerHTML = "切换颜色";
          btn2.onclick = () => {
            const colors = [
              "#406cff",
              "#eca710",
              "#3dcf38",
              "#b32cf1",
              "#00bcd4",
              "#8bc34a",
              "#e91e63",
              "#9c27b0",
              "#2196f3",
              "#ffc107",
              "#4caf50",
              "#f44336",
              "#00bfae",
              "#7c4dff",
              "#ff4081",
              "#64dd17",
              "#009688"
            ];
            gantt.update({
              primaryColor: colors[Math.ceil(Math.random() * colors.length) - 1]
            });
          };
          btnGroup.appendChild(btn2);
        }

        /** 切换语言按钮 */
        {
          const btn3 = document.createElement("button");
          btn3.innerHTML = "切换语言";
          let n = 0;
          btn3.onclick = () => {
            const locales = ["en", "zh", "ja", "ko", "de", "az"];
            const locale = locales[n++ % locales.length];
            console.log("切换语言为:", locale);
            gantt.update(
              {
                locale: locale
              },
              { merge: false }
            );
          };
          btnGroup.appendChild(btn3);
        }

        /** 行高 */
        {
          const btn4 = document.createElement("button");
          btn4.innerHTML = "切换行高";
          let h = 30;
          btn4.onclick = () => {
            gantt.update({ row: { height: ((h += 10) % 30) + 30 } });
          };
          btnGroup.appendChild(btn4);
        }

        /** 切换单位 */
        {
          const btn5 = document.createElement("button");
          btn5.innerHTML = "切换单位";
          let n = 0;
          btn5.onclick = () => {
            const u: any = ["hour", "day", "week", "month", "quarter", "year"][
              n++ % 6
            ];
            gantt.update({ unit: u });
          };
          btnGroup.appendChild(btn5);
        }

        /** 是否显示周末 */
        {
          const btn6 = document.createElement("button");
          btn6.innerHTML = "切换显示周末";
          let show = true;
          btn6.onclick = () => {
            gantt.update({
              weekend: {
                show: !show
              }
            });
            show = !show;
          };
          btnGroup.appendChild(btn6);
        }

        /** 切换 border 的展示 */
        {
          const btn7 = document.createElement("button");
          btn7.innerHTML = "切换边框";
          let border = true;
          btn7.onclick = () => {
            gantt.update({
              border: {
                show: !border
              }
            });
            border = !border;
          };
          btnGroup.appendChild(btn7);
        }
      }
    }
  } catch (error) {
    console.error("Failed to initialize XGantt:", error);
  }
} else {
  console.error("Gantt container element not found!");
}

const gantt2Container = document.getElementById("gantt2");
if (gantt2Container) {
  const gantt2 = new XGantt(gantt2Container, {
    data: Array.from({ length: 50 }, (_, i) => ({
      name: `Task ${i}`,
      startTime: dayjs()
        .add(-300 + i, "day")
        .format("YYYY-MM-DD"),
      endTime: dayjs()
        .add(-300 + i + 10, "day")
        .format("YYYY-MM-DD")
    })),
    highlight: true,
    dateFormat: "YYYY-MM-DD",
    unit: "day",
    locale: "zh",
    // table: {
    //   columns: [
    //     { label: "Name", width: 150, field: "name" },
    //     { label: "Start Date", width: 100, field: "startTime" },
    //     { label: "End Date", width: 100, field: "endTime" }
    //   ]
    // },
    chart: {},
    // selection: {
    //   enabled: true
    // },
    // expand: {
    //   show: false,
    //   enabled: true
    // },
    border: {
      show: false
    }
  });

  const btnGroup = document.getElementById("btn-group2");
  if (btnGroup) {
    /** 切换语言按钮 */
    {
      const btn3 = document.createElement("button");
      btn3.innerHTML = "切换语言";
      let n = 0;
      btn3.onclick = () => {
        const locales = ["en", "zh", "ja", "ko"];
        const locale = locales[n++ % locales.length];
        console.log("切换语言为:", locale);
        gantt2.update({
          locale: locale
        });
      };
      btnGroup.appendChild(btn3);
    }
  }
}
