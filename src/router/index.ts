import { createMemoryHistory, createRouter } from 'vue-router'
import {
  GlobeOutline, SwapHorizontalSharp
} from '@vicons/ionicons5'

import Index from '@/pages/Main.vue'
import RIM from '@/pages/RMI.vue'
import CrLfToBr from '@/pages/CrLfToBr.vue'



const routes = [
  { path: '/', component: Index },
  { path: '/RIM', name: 'RIM', meta: { title: 'RMI', icon: GlobeOutline }, component: RIM },
  { path: '/CrLfToBr', name: 'CrLfToBr', meta: { title: 'CrLf转Br', icon: SwapHorizontalSharp }, component: CrLfToBr },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
export { routes }
export default router