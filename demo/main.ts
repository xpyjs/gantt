import { createApp } from 'vue';
import App from './App.vue';
// import App from './demo.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import Gantt from '../src/index';

dayjs.locale('zh-cn');

console.log('main', dayjs.locale());

// import Gantt from '../dist/index.es';
// import '../dist/style.css';

createApp(App).use(Gantt).mount('#app');
