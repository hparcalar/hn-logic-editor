import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import VueResizable from 'vue-resizable';
import 'virtual:windi.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import 'font-awesome/css/font-awesome.min.css';
import './styles/layout-pages.css';

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App)
    .component('vue-resizable', VueResizable)
    .use(router)
    .mount('#app')