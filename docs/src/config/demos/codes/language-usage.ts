import { toStr } from "@/utils/common";

const data = [
  {
    id: "1",
    name: "项目规划",
    startTime: "2025-01-01",
    endTime: "2025-01-10",
    progress: 80
  },
  {
    id: "2",
    name: "开发阶段",
    startTime: "2025-01-11",
    endTime: "2025-01-20",
    progress: 45
  },
  {
    id: "3",
    name: "测试发布",
    startTime: "2025-01-21",
    endTime: "2025-02-03",
    progress: 10
  }
];

const options = {
  data,
  table: {
    columns: [{ field: "name", label: "任务名称", width: 100 }]
  },
  locale: "zh"
};

const jsCode = `import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

// 引入需要的语言，可能需要单独安装 dayjs。 (\`npm install dayjs\`)
// import "dayjs/locale/zh"; // zh 不需要引入，默认引入了 en 和 zh
import "dayjs/locale/ja";
import "dayjs/locale/ko";

const ganttContainer = document.getElementById("gantt-container");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

const gantt = new XGantt(ganttContainer, ${toStr(options)});

const btnContainer = document.getElementById("btn-container");
if (btnContainer) {
  const btn = document.createElement("button");
  btn.innerText = "切换语言";
  let n = 0;
  btn.onclick = () => {
    const locales = ["en", "zh", "ja", "ko", "de", "az"];
    const locale = locales[n++ % locales.length];
    console.log("切换语言为:", locale);
    gantt.update({ locale: locale });
  };
  btnContainer.appendChild(btn);
}
`;

export default {
  jsCode
};
