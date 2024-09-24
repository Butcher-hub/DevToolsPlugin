<template>
  <n-space class="head">
    <n-button type="info" :loading="loading" @click="load">加载</n-button>
    <n-button type="warning" @click="remove">移除</n-button>
    <n-button @click="openInNewTab">新tab打开</n-button>
  </n-space>
  <JsonEditor v-model:value="jsonData" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import JsonEditor from '@/components/JsonEditor.vue';
import useStorage from '@/hooks/useStorage'
import { MODE } from '@/util/emun.ts'

const loading = ref<boolean>(false)

const jsonData = ref({});

const load = async () => {
  loading.value = true
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // 向目标页面里注入js方法
  let result = await chrome.scripting.executeScript({
    target: { tabId: tab.id || 0 },
    world: 'MAIN',
    func: () => {
      try {
        // @ts-ignore
        let vo = document.querySelector('.sx-augmenteddataset_body').__vue__.getDataSetVO()
        return vo
      } catch (err) {
        return JSON.parse(JSON.stringify({msg: '没有找到上下文，请在smartbi新窗口编辑模型页面使用！'}))
      }
    },
    args: []
  });
  loading.value = false
  if (result && result[0] && result[0].result) {
    jsonData.value = result[0].result
    useStorage('data-model-define-storage', jsonData.value)
  }
}

const remove = () => {
  jsonData.value = {}
  useStorage('data-model-define-storage', {})
}

const openInNewTab = () => {
    chrome.tabs.create({
        url: `/index.html?mode=${MODE.tab}`
    })
}

onMounted(async () => {
    let val = await useStorage('data-model-define-storage')
    if (val) {
      jsonData.value = val
    }
})

</script>
<style scoped>
.head {
  margin-bottom: 4px;
}
</style>