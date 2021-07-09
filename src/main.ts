import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from 'vue-router'
import routes from 'virtual:generated-pages';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css.map'

import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/js/bootstrap.min.js.map'

const router = createRouter({
    routes,
});

const app = createApp(App).use(router).mount('#app')