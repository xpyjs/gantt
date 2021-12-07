import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';
import { path } from '@vuepress/utils';

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'zh-CN',
  title: 'Jz Gantt Docuemnt',
  description: 'Jz-Gantt document site',
  base: '/jz-gantt/docs/',

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
          { text: 'v1.x', link: '/' },
          { text: 'v0.x', link: '/v0/' }
        ]
      },
      {
        text: '我的博客站',
        link: 'https://www.jeremyjone.com',
        target: '_blank'
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
      '/v0/': [
        '/v0/README.md',
        '/v0/root.md',
        '/v0/column.md',
        '/v0/slider.md',
        '/v0/common.md'
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
