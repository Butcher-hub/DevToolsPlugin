<template>
  <n-config-provider :hljs="hljs">
    <n-message-provider>
      <n-layout has-sider>
        <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
          show-trigger @collapse="collapsed = true" @expand="collapsed = false">
          <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
        </n-layout-sider>
        <n-layout class="content">
          <n-scrollbar style="max-height: 100vh">
            <RouterView />
          </n-scrollbar>
        </n-layout>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import type { MenuOption } from 'naive-ui'
import { NIcon } from 'naive-ui'

import { RouterLink, RouterView } from 'vue-router'
import {
  BuildOutline
} from '@vicons/ionicons5'

import { routes } from '@/router'

import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('json', json)

const collapsed = ref<boolean>(false)
const menuOptions: MenuOption[] = routes.filter(el => el.meta).map(el => {
  return {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: el.name
          }
        },
        { default: () => el.meta?.title }
      ),
    key: el.path,
    icon: () => h(NIcon, null, { default: () => h(el.meta?.icon || BuildOutline) })
  }
})
</script>
<style scoped>
.content {
  height: 100vh;
  padding: 8px;
}
</style>
