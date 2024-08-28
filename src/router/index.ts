import { createMemoryHistory, createRouter } from 'vue-router'
import {
  GlobeOutline, SwapHorizontalSharp, ServerSharp
} from '@vicons/ionicons5'

import Index from '@/pages/Main.vue'
import RMI from '@/pages/RMI.vue'
import CrLfToBr from '@/pages/CrLfToBr.vue'
import SQL from '@/pages/SQL.vue'



const routes = [
  { path: '/', component: Index },
  { path: '/RMI', name: 'RMI', meta: { title: 'RMI', icon: GlobeOutline }, component: RMI },
  { path: '/CrLfToBr', name: 'CrLfToBr', meta: { title: 'CrLf转Br', icon: SwapHorizontalSharp }, component: CrLfToBr },
  { path: '/SQL', name: 'SQL', meta: { title: 'SQL执行', icon: ServerSharp }, component: SQL },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
export { routes }
export default router