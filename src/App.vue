<template>
  <n-config-provider :hljs="hljs">
    <n-message-provider>
      <n-layout has-sider>
        <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
          show-trigger @collapse="collapsed = true" @expand="collapsed = false">
          <n-menu ref="menuInstRef" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" v-model:value="selectedKey" :on-update:value="onMenuSelect" />
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
import { ref, h, onMounted } from 'vue'
import type { MenuOption, MenuInst } from 'naive-ui'
import { NIcon } from 'naive-ui'

import { RouterLink, RouterView } from 'vue-router'
import {
  BuildOutline
} from '@vicons/ionicons5'

import { routes } from '@/router'

import router from '@/router'

import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'

import { MODE } from '@/util/emun.ts'

import useStorage from '@/hooks/useStorage'

let mode = new URLSearchParams(window.location.search).get('mode')

if (mode === MODE.tab) {
    document.body.style.width = '100%'
    document.body.style.height = '100%'
} else if (!mode){
  mode = MODE.popup
}

hljs.registerLanguage('json', json)

const collapsed = ref<boolean>(false)
const menuInstRef = ref<MenuInst | null>(null)

const menuOptions: MenuOption[] = routes.filter(el => el.meta.mode.includes(mode)).map(el => {
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

const selectedKey = ref('')

const onMenuSelect = (key: string) => {
  selectedKey.value = key
  useStorage('key-select-menu', key)
}

onMounted(async () => {
  let selectKey: string = <string> await useStorage('key-select-menu')
  selectedKey.value = selectKey
  menuInstRef.value?.showOption(selectKey)
  router.push(selectKey)
})

</script>
<style scoped>
.content {
  height: 100vh;
  padding: 8px;
}
</style>
