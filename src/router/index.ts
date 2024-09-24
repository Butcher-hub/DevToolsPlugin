import { createMemoryHistory, createRouter } from 'vue-router'
import {
  GlobeOutline, SwapHorizontalSharp, ServerSharp, HomeOutline, CubeOutline
} from '@vicons/ionicons5'

import { MODE } from '@/util/emun'

import Index from '@/pages/Main.vue'
import RMI from '@/pages/RMI.vue'
import CrLfToBr from '@/pages/CrLfToBr.vue'
import SQL from '@/pages/SQL.vue'
import DataModelDefine from '@/pages/DataModelDefine.vue'

const routes = [
  { path: '/', name: 'Index', meta: { title: '主页', icon: HomeOutline , mode: [MODE.popup, MODE.tab]}, component: Index },
  { path: '/RMI', name: 'RMI', meta: { title: 'RMI', icon: GlobeOutline, mode: [MODE.popup] }, component: RMI },
  { path: '/CrLfToBr', name: 'CrLfToBr', meta: { title: 'CrLf转Br', icon: SwapHorizontalSharp, mode: [MODE.popup, MODE.tab] }, component: CrLfToBr },
  { path: '/DataModelDefine', name: 'DataModelDefine', meta: { title: '模型定义', icon: CubeOutline, mode: [MODE.popup, MODE.tab] }, component: DataModelDefine },
  { path: '/SQL', name: 'SQL', meta: { title: 'SQL执行', icon: ServerSharp, mode: [MODE.popup] }, component: SQL },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
export { routes }
export default router