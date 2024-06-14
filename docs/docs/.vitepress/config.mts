import { defineConfig } from 'vitepress';
import {
  demoblockPlugin,
  demoblockVitePlugin
} from 'vitepress-theme-demoblock';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  base: '/gantt/docs/',
  title: 'XGantt Document',
  description: 'XGantt Document website',

  head: [
    [
      'link',
      { rel: 'icon', href: 'https://res.xiaopangying.com/logo/jz-gantt.png' }
    ]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://res.xiaopangying.com/logo/jz-gantt.png',

    nav: [
      {
        text: '更多版本',
        items: [
          { text: 'vue3', link: '/' },
          { text: 'vue3-v1(archive)', link: '/vue3-v1/' },
          { text: 'vue2', link: '/vue2/' }
        ]
      },
      {
        text: 'CHANGELOG',
        link: 'https://github.com/xpyjs/gantt/blob/master/CHANGELOG.md'
      },
      {
        text: 'github',
        items: [
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

    lastUpdated: {
      text: '最后更新时间'
    },
    notFound: {
      title: '你要访问的页面跑丢啦~'
    },

    outline: {
      level: [2, 3],
      label: '目录'
    },

    sidebar: {
      '/': [
        {
          text: 'vue3',
          items: [
            { text: '入门', link: '/' },
            { text: '根组件', link: '/root' },
            { text: '列组件', link: '/column' },
            { text: '滑块组件', link: '/slider' },
            { text: '通用方法', link: '/common' }
          ]
        },
        { text: 'vue3-v1', link: '/vue3-v1/' },
        { text: 'vue2', link: '/vue2/' }
      ],
      '/vue3-v1/': [
        { text: 'vue3', link: '/' },
        {
          text: 'vue3-v1',
          items: [
            { text: '入门', link: '/vue3-v1/' },
            { text: '根组件', link: '/vue3-v1/root' },
            { text: '列组件', link: '/vue3-v1/column' },
            { text: '滑块组件', link: '/vue3-v1/slider' },
            { text: '通用方法', link: '/vue3-v1/common' }
          ]
        },
        { text: 'vue2', link: '/vue2/' }
      ],
      '/vue2/': [
        { text: 'vue3', link: '/' },
        { text: 'vue3-v1', link: '/vue3-v1/' },
        {
          text: 'vue2',
          items: [
            { text: '入门', link: '/vue2/' },
            { text: '根组件', link: '/vue2/root' },
            { text: '列组件', link: '/vue2/column' },
            { text: '滑块组件', link: '/vue2/slider' },
            { text: '通用方法', link: '/vue2/common' }
          ]
        }
      ]
    },

    search: {
      provider: 'local'
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/xpyjs/gantt' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright © 2020-present <a href="https://www.xiaopangying.com">XiaoPangYing.COM</a>'
    }
  },

  // 防止死链失败
  ignoreDeadLinks: true,

  markdown: {
    config: md => {
      md.use(demoblockPlugin);
    }
  },

  vite: {
    plugins: [demoblockVitePlugin()]
  }
});
