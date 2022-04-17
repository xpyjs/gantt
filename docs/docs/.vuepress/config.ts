import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';
import { path } from '@vuepress/utils';

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'zh-CN',
  title: 'XGantt Docuemnt',
  description: 'XGantt document site',
  base: '/gantt/docs/',

  head: [
    [
      'link',
      { rel: 'icon', href: 'https://www.xiaopangying.com/my-logo/jz-gantt.png' }
    ]
  ],

  themeConfig: {
    logo: 'https://www.xiaopangying.com/my-logo/jz-gantt.png',

    navbar: [
      {
        text: '更多版本',
        children: [
          { text: 'vue3', link: '/' },
          { text: 'vue2', link: '/vue2/' }
        ]
      },
      {
        text: 'CHANGELOG',
        link: 'https://github.com/xpyjs/gantt/blob/master/CHANGELOG.md'
      },
      {
        text: 'github',
        link: 'https://github.com/xpyjs/gantt'
      },
      {
        text: '个人站',
        link: 'https://www.xiaopangying.com',
        target: '_blank'
      }
    ],

    // repo: "jeremyjone/docs",
    lastUpdatedText: '最后更新时间',

    notFound: [
      '什么都没有...',
      '你的消息飞到了外太空！',
      '你要访问的页面跑丢啦~'
    ],
    backToHome: '返回首页',

    sidebarDepth: 2,
    sidebar: {
      '/': ['/README.md', '/root.md', '/column.md', '/slider.md', 'common.md'],
      '/vue2/': [
        '/vue2/README.md',
        '/vue2/root.md',
        '/vue2/column.md',
        '/vue2/slider.md',
        '/vue2/common.md'
      ]
    },

    themePlugins: {
      activeHeaderLinks: true
    }
  },

  plugins: [
    [
      '@vuepress/register-components',
      { componentsDir: path.resolve(__dirname, './components') }
    ]
  ]
});
