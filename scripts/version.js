import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * 需要忽略的文件夹列表
 */
const IGNORE_LIST = [
    'node_modules',
    'dist',
    'coverage',
    '.git',
    '.vscode',
    'types',
    'scripts',
    'test',
    'src'
]

/**
 * 颜色输出工具
 */
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgGreen: '\x1b[42m',
    bgRed: '\x1b[41m',
    bgYellow: '\x1b[43m'
}



/**
 * 解析版本号为数字数组和后缀
 * @param {string} version - 版本号字符串，如 "1.2.3-alpha.0"
 * @returns {object} - {numbers: [1, 2, 3], suffix: "alpha.0", full: "1.2.3-alpha.0"}
 */
function parseVersion(version) {
    if (!version || typeof version !== 'string') {
        throw new Error(`无效的版本号: ${version}`)
    }

    // 移除前缀字符（如 v1.2.3 -> 1.2.3）
    const cleanVersion = version.replace(/^v/, '')

    // 提取数字部分和后缀部分
    const match = cleanVersion.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/)

    if (!match) {
        throw new Error(`版本号格式不正确: ${version}，期望格式: x.y.z 或 x.y.z-suffix`)
    }

    return {
        numbers: [
            parseInt(match[1], 10),
            parseInt(match[2], 10),
            parseInt(match[3], 10)
        ],
        suffix: match[4] || '',
        full: cleanVersion
    }
}

/**
 * 比较两个版本号
 * @param {string} version1 - 版本号1
 * @param {string} version2 - 版本号2
 * @returns {number} - 返回 1 表示 version1 > version2，-1 表示 version1 < version2，0 表示相等
 */
function compareVersions(version1, version2) {
    const v1 = parseVersion(version1)
    const v2 = parseVersion(version2)

    // 先比较数字部分
    for (let i = 0; i < 3; i++) {
        if (v1.numbers[i] > v2.numbers[i]) return 1
        if (v1.numbers[i] < v2.numbers[i]) return -1
    }

    // 数字部分相等，比较完整版本字符串（包含后缀）
    if (v1.full === v2.full) return 0

    // 简单方案：如果版本不完全相等，认为需要更新
    // 这里我们认为根目录版本总是"更新"的版本
    return 1
}

/**
 * 读取 package.json 文件
 * @param {string} packagePath - package.json 文件路径
 * @returns {object} - package.json 内容
 */
function readPackageJson(packagePath) {
    try {
        const content = readFileSync(packagePath, 'utf8')
        return JSON.parse(content)
    } catch (error) {
        throw new Error(`读取 ${packagePath} 失败: ${error.message}`)
    }
}

/**
 * 写入 package.json 文件
 * @param {string} packagePath - package.json 文件路径
 * @param {object} packageJson - package.json 内容
 */
function writePackageJson(packagePath, packageJson) {
    try {
        const content = JSON.stringify(packageJson, null, 2) + '\n'
        writeFileSync(packagePath, content, 'utf8')
    } catch (error) {
        throw new Error(`写入 ${packagePath} 失败: ${error.message}`)
    }
}

/**
 * 获取根目录版本信息
 */
function getRootVersion() {
    const rootPackagePath = resolve(__dirname, '..', 'package.json')

    if (!existsSync(rootPackagePath)) {
        throw new Error('根目录 package.json 文件不存在')
    }

    const rootPackage = readPackageJson(rootPackagePath)

    if (!rootPackage.version) {
        throw new Error('根目录 package.json 中未找到版本信息')
    }

    console.log(`ℹ️  读取根目录版本: ${colors.cyan}${rootPackage.version}${colors.reset}`)
    return rootPackage.version
}

/**
 * 扫描并获取所有子包信息
 */
function getSubPackages() {
    const packagesDir = resolve(__dirname, '..', 'packages')

    if (!existsSync(packagesDir)) {
        throw new Error('packages 目录不存在')
    }

    const subPackages = []
    const entries = readdirSync(packagesDir)

    console.log('ℹ️  开始扫描子包...')

    for (const entry of entries) {
        // 跳过忽略列表中的文件夹
        if (IGNORE_LIST.includes(entry)) {
            continue
        }

        const entryPath = join(packagesDir, entry)
        const stat = statSync(entryPath)

        // 只处理文件夹
        if (!stat.isDirectory()) {
            continue
        } const packageJsonPath = join(entryPath, 'package.json')

        // 检查是否存在 package.json
        if (!existsSync(packageJsonPath)) {
            console.log(`⚠️  ${colors.yellow}跳过 ${entry}：未找到 package.json${colors.reset}`)
            continue
        }

        try {
            const packageJson = readPackageJson(packageJsonPath)

            if (!packageJson.version) {
                console.log(`⚠️  ${colors.yellow}跳过 ${entry}：package.json 中未找到版本信息${colors.reset}`)
                continue
            }

            subPackages.push({
                name: entry,
                path: packageJsonPath,
                version: packageJson.version,
                packageJson
            })

            console.log(`✅ ${colors.green}发现子包: ${colors.bright}${entry}${colors.reset}${colors.green} (${colors.cyan}${packageJson.version}${colors.reset}${colors.green})${colors.reset}`)
        } catch (error) {
            console.log(`⚠️  ${colors.yellow}跳过 ${entry}：${error.message}${colors.reset}`)
        }
    }

    if (subPackages.length === 0) {
        throw new Error('未找到任何有效的子包')
    }

    return subPackages
}

/**
 * 验证版本兼容性
 */
function validateVersions(rootVersion, subPackages) {
    console.log('\n🔍 开始版本兼容性检查...')

    for (const subPackage of subPackages) {
        const rootParsed = parseVersion(rootVersion)
        const subParsed = parseVersion(subPackage.version)

        // 检查数字版本部分：根目录版本不能小于子包版本
        const numberComparison = compareNumberVersions(rootParsed.numbers, subParsed.numbers)

        if (numberComparison < 0) {
            console.error(`❌ ${colors.red}版本冲突：根目录数字版本 ${rootParsed.numbers.join('.')} 小于子包 ${subPackage.name} 的数字版本 ${subParsed.numbers.join('.')}${colors.reset}`)
            throw new Error(`版本验证失败：根目录数字版本不能小于子包数字版本`)
        }

        // 检查完整版本
        if (rootVersion === subPackage.version) {
            console.log(`ℹ️  ${subPackage.name}: 版本完全一致 (${subPackage.version})`)
        } else if (numberComparison === 0) {
            console.log(`⚠️  ${colors.yellow}${subPackage.name}: 数字版本相同，但后缀不同 ${subPackage.version} → ${rootVersion}${colors.reset}`)
        } else {
            console.log(`⚠️  ${colors.yellow}${subPackage.name}: 需要更新 ${subPackage.version} → ${rootVersion}${colors.reset}`)
        }
    }

    console.log(`✅ ${colors.green}版本兼容性检查通过！${colors.reset}`)
}

/**
 * 比较数字版本部分
 * @param {number[]} numbers1 - 版本号数字数组1
 * @param {number[]} numbers2 - 版本号数字数组2
 * @returns {number} - 返回 1 表示 numbers1 > numbers2，-1 表示 numbers1 < numbers2，0 表示相等
 */
function compareNumberVersions(numbers1, numbers2) {
    for (let i = 0; i < 3; i++) {
        if (numbers1[i] > numbers2[i]) return 1
        if (numbers1[i] < numbers2[i]) return -1
    }
    return 0
}

/**
 * 更新子包版本
 */
function updateSubPackageVersions(rootVersion, subPackages) {
    console.log('\n🚀 开始更新子包版本...')

    let updatedCount = 0

    for (const subPackage of subPackages) {
        // 如果版本完全一致，跳过
        if (rootVersion === subPackage.version) {
            console.log(`ℹ️  跳过 ${subPackage.name}: 版本已是最新 (${subPackage.version})`)
            continue
        }

        // 版本不一致，需要更新
        const oldVersion = subPackage.version
        subPackage.packageJson.version = rootVersion
        writePackageJson(subPackage.path, subPackage.packageJson)

        console.log(`✅ ${colors.green}更新 ${colors.bright}${subPackage.name}${colors.reset}${colors.green}: ${colors.cyan}${oldVersion}${colors.reset}${colors.green} → ${colors.green}${rootVersion}${colors.reset}`)
        updatedCount++
    }

    if (updatedCount > 0) {
        console.log(`✨ ${colors.green}成功更新了 ${updatedCount} 个子包的版本${colors.reset}`)
    } else {
        console.log('ℹ️  所有子包版本都已是最新，无需更新')
    }

    return updatedCount
}

/**
 * 主函数
 */
async function main() {
    try {
        console.log(`${colors.bgGreen}${colors.white} 📦 版本统一更新工具 ${colors.reset}\n`)

        // 1. 读取根目录版本
        const rootVersion = getRootVersion()

        // 2. 扫描子包
        const subPackages = getSubPackages()

        // 3. 验证版本兼容性
        validateVersions(rootVersion, subPackages)

        // 4. 更新子包版本
        const updatedCount = updateSubPackageVersions(rootVersion, subPackages)

        // 5. 更新文档的模板版本
        const templateList = ['./vue/index.ts', './react/index.ts', './vanilla/index.ts']
        const path = resolve(__dirname, '..', 'demo', 'src', 'template');
        templateList.forEach(template => {
            const templatePath = join(path, template);
            if (existsSync(templatePath)) {
                try {
                    const content = readFileSync(templatePath, 'utf8');
                    const updatedContent = content.replace(/const VERSION = ".*?";/, `const VERSION = "${rootVersion}";`);
                    writeFileSync(templatePath, updatedContent, 'utf8');
                    console.log(`✅ ${colors.green}更新模板文件 ${template} 的版本号为 ${rootVersion}${colors.reset}`);
                } catch (error) {
                    console.error(`⚠️  ${colors.yellow}更新模板文件 ${template} 失败: ${error.message}${colors.reset}`);
                }
            } else {
                console.warn(`⚠️  模板文件 ${template} 不存在，跳过更新`);
            }
        });

        // 6. 显示最终结果
        if (updatedCount > 0) {
            console.log('\n' + '='.repeat(50))
            console.log(`${colors.bgGreen}${colors.white} 🎉 版本更新完成！当前统一版本: ${rootVersion} ${colors.reset}`)
            console.log(`✅ ${colors.green}本次更新了 ${updatedCount} 个子包${colors.reset}`)
            subPackages.forEach(pkg => {
                console.log(`  • ${colors.bright}${pkg.name}${colors.reset}: ${colors.green}${rootVersion}${colors.reset}`)
            })
        } else {
            console.log(`\n🎉 当前版本: ${colors.bgGreen}${colors.white} ${rootVersion} ${colors.reset}`)
        }

        console.log('\n' + '='.repeat(50))

    } catch (error) {
        console.error(`❌ ${colors.red}脚本执行失败: ${error.message}${colors.reset}`)
        process.exit(1)
    }
}

// 处理退出信号
process.on('SIGINT', () => {
    console.log('\n🛑 操作被用户中断')
    process.exit(0)
})

process.on('SIGTERM', () => {
    console.log('\n🛑 操作被终止')
    process.exit(0)
})

// 执行主函数
main()