import { createApp } from 'vue';
import App from './App.vue';
// import App from './demo.vue';
import Gantt from '../dist/index.es';
// import Gantt from '../src/index';
import '../dist/style.css';

createApp(App).use(Gantt).mount('#app');
