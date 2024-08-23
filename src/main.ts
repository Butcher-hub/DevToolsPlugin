import { createApp } from 'vue'
import naive from 'naive-ui'
import './style.css'
import App from './App.vue'
import router from '@/router'

createApp(App).use(naive).use(router).mount('#app')