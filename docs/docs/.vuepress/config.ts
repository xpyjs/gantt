import { defaultTheme, defineUserConfig } from 'vuepress';
// import type { DefaultThemeOptions } from 'vuepress';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { path } from '@vuepress/utils';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'XGantt Docuemnt',
  description: 'XGantt document site',
  base: '/gantt/docs/',

  head: [
    [
      'link',
      { rel: 'icon', href: 'https://res.xiaopangying.com/logo/jz-gantt.png' }
    ]
  ],

  theme: defaultTheme({
    logo: 'https://res.xiaopangying.com/logo/jz-gantt.png',

    navbar: [
      {
        text: '更多版本',
        children: [
          { text: 'vue3-v2', link: '/' },
          { text: 'vue3-v1', link: '/vue3-v1/' },
          { text: 'vue2', link: '/vue2/' }
        ]
      },
      {
        text: 'CHANGELOG',
        link: 'https://github.com/xpyjs/gantt/blob/master/CHANGELOG.md'
      },
      {
        text: 'github',
        children: [
          { text: 'vue3', link: 'https://github.com/xpyjs/gantt' },
          { text: 'vue2', link: 'https://github.com/xpyjs/gantt-vue2' }
        ]
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
      '/vue3-v1/': [
        '/vue3-v1/README.md',
        '/vue3-v1/root.md',
        '/vue3-v1/column.md',
        '/vue3-v1/slider.md',
        '/vue3-v1/common.md'
      ],
      '/vue2/': [
        '/vue2/README.md',
        '/vue2/root.md',
        '/vue2/column.md',
        '/vue2/slider.md',
        '/vue2/common.md'
      ]
    }

    // themePlugins: {
    //   activeHeaderLinks: true
    // }
  }),

  plugins: [
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components')
    })
    // [
    //   '@vuepress/register-components',
    //   { componentsDir: path.resolve(__dirname, './components') }
    // ]
  ]
});
