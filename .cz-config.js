module.exports = {
  types: [
    { value: "feat", name: "feat:\t\t新增功能" },
    { value: "fix", name: "fix:\t\t修复 bug" },
    { value: "docs", name: "docs:\t\t文档变更" },
    {
      value: "style",
      name: "style:\t代码格式（不影响功能，例如空格、分号等格式修正）"
    },
    {
      value: "refactor",
      name: "refactor:\t代码重构（不包括 bug 修复、功能新增）"
    },
    { value: "perf", name: "perf:\t\t性能优化" },
    { value: "test", name: "test:\t\t添加、修改测试用例" },
    {
      value: "build",
      name: "build:\t构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）"
    },
    { value: "ci", name: "ci:\t\t修改 CI 配置、脚本" },
    {
      value: "chore",
      name: "chore:\t对构建过程或辅助工具和库的更改（不影响源文件、测试用例）"
    },
    { value: "revert", name: "revert:\t回滚 commit" }
  ],

  scopes: [
    { value: "components", name: "components:\t组件相关" },
    { value: "composables", name: "composables:\tcomposables相关" },
    { value: "utils", name: "utils:\tutils相关" },
    { value: "styles", name: "styles:\t样式相关" },
    { value: "dependencies", name: "dependencies:\t依赖相关" },
    // 选中自定义可以自行填写，或者开启 allowCustomScopes 亦可
    { value: "custom", name: "custom:\t自定义" }
  ],

  // allowCustomScopes: true,
  // allowTicketNumber: false,
  // isTicketNumberRequired: false,
  // ticketNumberPrefix: 'TICKET-',
  // ticketNumberRegExp: '\\d{1,5}',

  scopeOverrides: {
    fix: [
      { name: "merge" },
      { name: "style" },
      { name: "e2eTest" },
      { name: "unitTest" }
    ]
  },

  messages: {
    type: "确保本次提交遵循 Angular 规范！\n选择你要提交的类型：",
    scope: "\n选择一个 scope（可选）：",
    // 选择 scope: custom 时会出下面的提示
    customScope: "请输入自定义的 scope：",
    subject: "填写本次提交的主题：\n",
    body: '填写详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: "是否存在非兼容性的变更。如果有，请填写：\n",
    footer: "请填写相应的 ISSUES（可选）。 例如: #1, #2：\n",
    confirmCommit: "确认提交？"
  },

  // 设置只有 type 选择了 feat 或 fix，才询问 breaking message
  allowBreakingChanges: ["feat", "fix"],
  // askForBreakingChangeFirst : true,

  // 跳过要询问的步骤
  skipQuestions: ['body', 'footer'],

  // subject 限制长度
  subjectLimit: 100,
  breaklineChar: "|" // 支持 body 和 footer
  // footerPrefix : 'ISSUES CLOSED:'
};
