import { spawn } from 'node:child_process'
import { join, resolve, dirname } from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * 映射配置：定义参数到目录的映射关系
 */
const PACKAGE_MAPPINGS = {
  'core': {
    package: 'packages/core',
    example: 'examples/vanilla'
  },
  'vue': {
    package: 'packages/vue',
    example: 'examples/vue'
  },
  'react': {
    package: 'packages/react',
    example: 'examples/react'
  }
};

/**
 * 获取命令行参数
 */
function getArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('❌ 请指定要运行的包名');
    console.log('📖 使用方法: node dev.js <package-name>');
    console.log('📖 可用的包名:', Object.keys(PACKAGE_MAPPINGS).join(', '));
    console.log('📖 示例: node dev.js core');
    process.exit(1);
  }
  return args[0];
}

/**
 * 根据包名获取对应的目录路径
 */
function getPackagePaths(packageName) {
  const mappings = PACKAGE_MAPPINGS[packageName.toLowerCase()];

  if (!mappings) {
    console.error(`❌ 未找到包 "${packageName}"`);
    console.log('✅ 可用的包名:', Object.keys(PACKAGE_MAPPINGS).join(', '));
    process.exit(1);
  }

  const packagePath = resolve(__dirname, '..', mappings.package);
  const examplePath = resolve(__dirname, '..', mappings.example);

  // 检查目录是否存在
  if (!fs.existsSync(packagePath)) {
    console.error(`❌ 包目录不存在: ${packagePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(examplePath)) {
    console.error(`❌ 示例目录不存在: ${examplePath}`);
    process.exit(1);
  }

  console.log(`📦 当前运行的包名: \x1b[42m\x1b[37m ${packageName} \x1b[0m\n`);
  return { packagePath, examplePath };
}

/**
 * 检查 package.json 是否存在并获取 dev 脚本
 */
function getDevScript(targetPath, type) {
  const packageJsonPath = join(targetPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`❌ 在 ${targetPath} 中未找到 package.json`);
    process.exit(1);
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const devScript = packageJson.scripts?.dev;

    if (!devScript) {
      console.error(`❌ 在 ${targetPath}/package.json 中未找到 dev 脚本`);
      process.exit(1);
    }

    return devScript;
  } catch (error) {
    console.error(`❌ 解析 ${type} package.json 失败: ${error.message}`);
    process.exit(1);
  }
}

/**
 * 执行开发命令
 */
function runDevCommand(targetPath, script, name, type) {
  console.log(`🚀 启动 ${name} ${type}...`);
  console.log(`📁 工作目录: ${targetPath}`);
  console.log(`📋 执行命令: ${script}`);

  // 解析命令和参数
  const [command, ...args] = script.split(' ');

  // 使用 spawn 执行命令
  const child = spawn(command, args, {
    cwd: targetPath,
    stdio: 'inherit',
    shell: true
  });

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${type} 进程退出，退出码: ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(new Error(`执行 ${type} 命令时出错: ${error.message}`));
    });
  });
}

/**
 * 并行运行包和示例的开发命令
 */
async function runParallelDev(packageName, packagePath, examplePath) {
  try {
    // 获取开发脚本
    const packageScript = getDevScript(packagePath, '包');
    const exampleScript = getDevScript(examplePath, '示例');

    console.log('🎯 开始并行运行开发环境...\n');

    // 创建两个子进程
    const packageProcess = spawn('npm', ['run', 'dev'], {
      cwd: packagePath,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true
    });

    const exampleProcess = spawn('npm', ['run', 'dev'], {
      cwd: examplePath,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true
    });

    // 处理包进程输出
    packageProcess.stdout.on('data', (data) => {
      console.log(`📦 [${packageName}-package]: ${data.toString().trim()}`);
    });

    packageProcess.stderr.on('data', (data) => {
      console.error(`📦 [${packageName}-package] ERROR: ${data.toString().trim()}`);
    });

    // 处理示例进程输出
    exampleProcess.stdout.on('data', (data) => {
      console.log(`🎮 [${packageName}-example]: ${data.toString().trim()}`);
    });

    exampleProcess.stderr.on('data', (data) => {
      console.error(`🎮 [${packageName}-example] ERROR: ${data.toString().trim()}`);
    });

    // 处理进程退出
    packageProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ 包进程退出，退出码: ${code}`);
      }
    });

    exampleProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ 示例进程退出，退出码: ${code}`);
      }
    });

    // 处理进程错误
    packageProcess.on('error', (error) => {
      console.error(`❌ 包进程错误: ${error.message}`);
    });

    exampleProcess.on('error', (error) => {
      console.error(`❌ 示例进程错误: ${error.message}`);
    });

    // 处理退出信号
    const cleanup = () => {
      console.log('\n🛑 正在停止所有开发服务...');
      packageProcess.kill('SIGTERM');
      exampleProcess.kill('SIGTERM');

      setTimeout(() => {
        packageProcess.kill('SIGKILL');
        exampleProcess.kill('SIGKILL');
        process.exit(0);
      }, 5000);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    console.log('✅ 开发环境已启动！');
    console.log('💡 按 Ctrl+C 停止所有服务\n');

  } catch (error) {
    console.error(`❌ 启动开发环境失败: ${error.message}`);
    process.exit(1);
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    const packageName = getArgs();
    const { packagePath, examplePath } = getPackagePaths(packageName);

    await runParallelDev(packageName, packagePath, examplePath);

  } catch (error) {
    console.error(`❌ 脚本执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 执行主函数
main();