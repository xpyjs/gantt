#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 复制 src/types 到 types/types 脚本
 */

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const projectRoot = path.resolve(__dirname, '..');
const srcTypesDir = path.join(projectRoot, 'src', 'types');
const targetTypesDir = path.join(projectRoot, 'types', 'types');

/**
 * 创建目录
 * @param {string} dirPath 目录路径
 */
function createDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✓ 已创建目录: ${dirPath}`);
    }
}

/**
 * 复制文件
 * @param {string} srcFile 源文件路径
 * @param {string} targetFile 目标文件路径
 */
function copyFile(srcFile, targetFile) {
    try {
        fs.copyFileSync(srcFile, targetFile);
        console.log(`✓ 已复制: ${path.basename(srcFile)}`);
    } catch (error) {
        console.error(`✗ 复制失败: ${path.basename(srcFile)} - ${error.message}`);
        process.exit(1);
    }
}

/**
 * 主执行函数
 */
function main() {
    console.log('🚀 开始复制类型定义文件...\n');

    // 1. 检查源目录是否存在
    if (!fs.existsSync(srcTypesDir)) {
        console.error(`✗ 源目录不存在: ${srcTypesDir}`);
        process.exit(1);
    }

    // 2. 创建目标目录
    console.log('📁 创建目标目录...');
    createDir(targetTypesDir);
    console.log();

    // 3. 复制所有文件
    console.log('📋 复制类型定义文件...');
    const files = fs.readdirSync(srcTypesDir);
    let successCount = 0;

    files.forEach(fileName => {
        const srcFile = path.join(srcTypesDir, fileName);
        const targetFile = path.join(targetTypesDir, fileName);

        // 检查是否是文件
        if (fs.statSync(srcFile).isFile()) {
            copyFile(srcFile, targetFile);
            successCount++;
        }
    });

    console.log();
    console.log(`✅ 类型定义文件复制完成!`);
    console.log(`📊 成功复制 ${successCount}/${files.length} 个文件`);
    console.log(`📂 目标目录: ${targetTypesDir}`);
}

// 错误处理
process.on('uncaughtException', (error) => {
    console.error('✗ 脚本执行出错:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('✗ 脚本执行出错:', error.message);
    process.exit(1);
});

// 执行主函数
main();
