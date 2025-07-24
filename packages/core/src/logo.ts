/// <reference path="./types/global.d.ts" />

// 版本号从构建时注入，来源于 package.json
export const VERSION = __VERSION__;

// 打印 XGantt LOGO
export function printLogo() {
  const logoColor = "#eca710";
  const welcomeTextColor = "#ffffff";
  const welcomeBgColor = "#e7209e";
  const versionTextColor = "#ffffff";
  const versionBgColor = "#1c42e8";

  // ASCII 艺术字体 LOGO
  const logoLines = [
    " __ __  _____  _____  _____  _____  _____ ",
    "|  |  ||   __||  _  ||   | ||_   _||_   _|",
    "|-   -||  |  ||     || | | |  | |    | |  ",
    "|__|__||_____||__|__||_|___|  |_|    |_|  "
  ];

  // 打印 LOGO
  logoLines.forEach(line => {
    console.log(
      `%c${line}`,
      `color: ${logoColor}; font-weight: bold; font-family: monospace;`
    );
  });

  // 打印欢迎信息 - 左右分离结构
  console.log(
    `%c 🚀 欢迎使用 XGantt %c Version: ${VERSION} `,
    `background-color: ${welcomeBgColor}; color: ${welcomeTextColor}; padding: 2px 4px; border-radius: 6px 0 0 6px; font-weight: bold; margin: 4px 0;`,
    `background-color: ${versionBgColor}; color: ${versionTextColor}; padding: 2px 4px; border-radius: 0 6px 6px 0; font-weight: normal; margin: 4px 0;`
  );
}
