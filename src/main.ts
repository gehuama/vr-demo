import { createApp } from 'vue'
import './style.css'
import {router} from './router/router';
import {store} from './store';
import app from './App.vue'

createApp(app).use(router).use(store).mount('#app');
