import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ScreenSizeMixin from './mixins/ScreenSizeMixin';
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const pinia = createPinia()
const app = createApp(App)
app.mixin(ScreenSizeMixin);
app.use(router)
app.use(pinia)
app.mount('#app')

import "bootstrap/dist/js/bootstrap.js"
