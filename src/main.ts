import { createApp } from 'vue';
import App from './App.vue';
// import Gantt from './index';

// @ts-ignore
import Gantt from '../dist/index.es';
import '../dist/style.css';

createApp(App).use(Gantt).mount('#app');
