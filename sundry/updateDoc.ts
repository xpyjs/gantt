#!/usr/bin/env node
/*
 * @Author: JeremyJone
 * @Date: 2021-11-25 15:10:18
 * @LastEditors: JeremyJone
 * @LastEditTime: 2021-12-16 17:14:14
 * @Description: 自动更新文档更新内容。在每次版本发布时使用
 */

const fs = require('fs');
const path = require('path');

const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');
const docPath = path.resolve(__dirname, '../docs/docs/README.md');
const versionPath = path.resolve(__dirname, '../docs/package.json');

function getContent(file, regex) {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(regex);
  return match ? match[1] : '';
}

const isCi = process.argv[3] === 'true';
const version = process.argv[2];
const regex = new RegExp('#+ \\[?(' + version + '\\]?[\\s\\S]*)');
const changelog = '### [' + getContent(changelogPath, regex);

const currentDate = changelog.match(/.*/)[0].match(/\d{4}-\d{2}-\d{2}/)[0];

const currentLog = changelog
  .replace(/### \[{1-2}\d/g, '### [')
  .split('### [')[1]
  .split('\n')
  .filter(x => x.length > 0)
  .map(x => {
    if (x.startsWith(`${version}`)) {
      return isCi ? '' : `### v${version}`;
    } else if (x.startsWith('###')) {
      x = x.replace('###', '').trim();
      if (x.toLowerCase().match('bug fixes')) {
        x = x.toLowerCase().replace('bug fixes', '修复问题');
      } else if (x.toLowerCase().match('features')) {
        x = x.toLowerCase().replace('features', '新增功能');
      } else if (x.toLowerCase().match('improvements')) {
        x = x.toLowerCase().replace('improvements', '改进');
      } else if (x.toLowerCase().match('breaking changes')) {
        x = x.toLowerCase().replace('breaking changes', '破坏性改变');
      } else if (x.toLowerCase().match('deprecations')) {
        x = x.toLowerCase().replace('deprecations', '废弃');
      } else if (x.toLowerCase().match('security')) {
        x = x.toLowerCase().replace('security', '安全');
      } else if (x.toLowerCase().match('documentation')) {
        x = x.toLowerCase().replace('documentation', '文档');
      } else {
        x = '其他';
      }
      return `**${x}：**`;
    } else if (x.match(/^[-*]{1} \*\*/)) {
      return x.replace(/^[-*]{1} \*\*\S*\*\*[ ]*/, '- ');
    } else {
      return x;
    }
  })
  .filter(x => x.length > 0)
  .join('\n\n');

if (isCi) {
  function writeCurrentLog() {
    fs.writeFileSync(
      path.resolve(__dirname, '../desc.txt'),
      currentLog,
      'utf8'
    );
  }

  writeCurrentLog();
} else {
  function setDocs() {
    const doc = getContent(docPath, /([\s\S]*)/);
    const updateTitle = doc.match(/(## 更新日志[\s\S]*:::\s+)/)[1];
    const newDoc = doc
      .replace(
        /<Description[\s\S]+copyright="jeremyjone" \/>/,
        `<Description author="jeremyjone" version="${version}" date="${currentDate}" copyright="jeremyjone" />`
      )
      .replace(updateTitle, `${updateTitle}${currentLog}\n\n`);

    fs.writeFileSync(docPath, newDoc);
  }

  function setVersion() {
    const versionFile = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    versionFile.version = versionFile.version.replace(/^v/, '');
    versionFile.version = `v${version}`;
    fs.writeFileSync(versionPath, JSON.stringify(versionFile), 'utf8');
  }

  setDocs();
  setVersion();
}

process.exit(0);
