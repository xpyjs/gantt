import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue';
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue';
import DataParameter from '../components/DataParameter.vue';
import Description from '../components/Description.vue';
import Button from '../components/Button.vue';

export function useComponents(app) {
  app.component('Demo', Demo);
  app.component('DemoBlock', DemoBlock);
  app.component('DataParameter', DataParameter);
  app.component('Description', Description);
  app.component('XButton', Button);
}
