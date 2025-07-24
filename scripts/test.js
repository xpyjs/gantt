import { spawn } from 'node:child_process'
import { join, resolve, dirname } from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * 映射配置：定义参数到包目录的映射关系
 */
const PACKAGE_MAPPINGS = {
    'core': 'packages/core',
    'vue': 'packages/vue',
    'react': 'packages/react'
};

/**
 * 获取命令行参数
 */
function getArgs() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('❌ 请指定要测试的包名');
        console.log('📖 使用方法: node test.js <package-name>');
        console.log('📖 可用的包名:', Object.keys(PACKAGE_MAPPINGS).join(', '));
        console.log('📖 示例: node test.js core');
        process.exit(1);
    }
    return args[0];
}

/**
 * 根据包名获取对应的目录路径
 */
function getPackagePath(packageName) {
    const packageDir = PACKAGE_MAPPINGS[packageName.toLowerCase()];

    if (!packageDir) {
        console.error(`❌ 未找到包 "${packageName}"`);
        console.log('✅ 可用的包名:', Object.keys(PACKAGE_MAPPINGS).join(', '));
        process.exit(1);
    }

    const packagePath = resolve(__dirname, '..', packageDir);

    // 检查目录是否存在
    if (!fs.existsSync(packagePath)) {
        console.error(`❌ 包目录不存在: ${packagePath}`);
        process.exit(1);
    }

    console.log(`🧪 当前测试的包名: \x1b[42m\x1b[37m ${packageName} \x1b[0m\n`);
    return packagePath;
}

/**
 * 检查 package.json 是否存在并获取 test 脚本
 */
function getTestScript(packagePath) {
    const packageJsonPath = join(packagePath, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
        console.error(`❌ 在 ${packagePath} 中未找到 package.json`);
        process.exit(1);
    }

    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const testScript = packageJson.scripts?.test;

        if (!testScript) {
            console.error(`❌ 在 ${packagePath}/package.json 中未找到 test 脚本`);
            console.log('💡 请确保在 package.json 的 scripts 中定义了 test 命令');
            process.exit(1);
        }

        return testScript;
    } catch (error) {
        console.error(`❌ 解析 package.json 失败: ${error.message}`);
        process.exit(1);
    }
}

/**
 * 执行测试命令
 */
function runTestCommand(packagePath, script, packageName) {
    console.log(`🚀 启动 ${packageName} 包测试...`);
    console.log(`📁 工作目录: ${packagePath}`);
    console.log(`📋 执行命令: ${script}\n`);

    // 解析命令和参数
    const [command, ...args] = script.split(' ');

    // 使用 spawn 执行命令
    const child = spawn(command, args, {
        cwd: packagePath,
        stdio: 'inherit',
        shell: true
    });

    return new Promise((resolve, reject) => {
        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`\n❌ 测试失败，退出码: ${code}`);
                reject(new Error(`测试进程退出，退出码: ${code}`));
            } else {
                console.log(`\n✅ ${packageName} 包测试通过！`);
                resolve();
            }
        });

        child.on('error', (error) => {
            console.error(`\n❌ 执行测试命令时出错: ${error.message}`);
            reject(new Error(`执行测试命令时出错: ${error.message}`));
        });
    });
}

/**
 * 主函数
 */
async function main() {
    try {
        const packageName = getArgs();
        const packagePath = getPackagePath(packageName);
        const testScript = getTestScript(packagePath);

        await runTestCommand(packagePath, testScript, packageName);

    } catch (error) {
        console.error(`❌ 测试执行失败: ${error.message}`);
        process.exit(1);
    }
}

// 处理退出信号
process.on('SIGINT', () => {
    console.log('\n🛑 测试被用户中断');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 测试被终止');
    process.exit(0);
});

// 执行主函数
main();