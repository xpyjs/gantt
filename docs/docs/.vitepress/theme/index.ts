// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { useComponents } from './useComponents';
import 'vitepress-theme-demoblock/dist/theme/styles/index.css';
import './style.css';

import XGantt from '@xpyjs/gantt';
import '@xpyjs/gantt/dist/index.css';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.use(XGantt);

    useComponents(app);
  }
} satisfies Theme;
