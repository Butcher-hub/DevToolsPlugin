<template>
  <n-form :model="model" :rules="rules" ref="formRef">
    <n-form-item path="url" label="请求地址">
      <n-input v-model:value="model.url" placeholder="https://example.com/api" />
    </n-form-item>
    <n-form-item path="method" label="请求方法">
      <n-select v-model:value="model.method" :options="methodOptions" />
    </n-form-item>
    <n-form-item path="headersText" label="请求头(JSON)">
      <n-input
        v-model:value="model.headersText"
        type="textarea"
        :autosize="{ minRows: 3 }"
        placeholder='{"Content-Type":"application/json"}' />
    </n-form-item>
    <n-form-item path="body" label="请求体">
      <n-input
        v-model:value="model.body"
        type="textarea"
        :autosize="{ minRows: 6 }"
        placeholder='{"name":"cursor"}' />
    </n-form-item>
    <n-form-item label="携带Cookie">
      <n-switch v-model:value="model.withCredentials" />
    </n-form-item>
    <n-space justify="center" align="center" style="margin-bottom: 24px;">
      <n-button type="primary" @click="onSubmit" :loading="loading">发起请求</n-button>
      <n-button type="warning" @click="onClear">清空结果</n-button>
    </n-space>
    <n-card v-if="model.result" title="结果" size="small" :segmented="{ content: true }">
      <n-code :code="model.result" language="json" :show-line-numbers="true" />
    </n-card>
  </n-form>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'

import useStorage from '@/hooks/useStorage'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

interface ModelType {
  url: string
  method: HttpMethod
  headersText: string
  body: string
  withCredentials: boolean
  result: string
}

interface SubmitPayload {
  url: string
  method: HttpMethod
  headers: Record<string, string>
  body?: string
  withCredentials: boolean
}

const message = useMessage()
const loading = ref(false)
const formRef = ref<FormInst | null>(null)

const model = ref<ModelType>({
  url: '',
  method: 'GET',
  headersText: '',
  body: '',
  withCredentials: false,
  result: ''
})

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTIONS', value: 'OPTIONS' }
]

const rules: FormRules = {
  url: {
    required: true,
    message: '请输入请求地址'
  }
}

watch(model, (value) => {
  useStorage('fetch-value', JSON.parse(JSON.stringify(value)))
}, { deep: true })

const buildSubmitPayload = (): SubmitPayload | null => {
  let headers: Record<string, string> = {}
  if (model.value.headersText.trim()) {
    try {
      headers = JSON.parse(model.value.headersText)
    } catch (err: any) {
      message.warning(`请求头JSON解析失败: ${err.message}`)
      return null
    }
  }
  const payload: SubmitPayload = {
    url: model.value.url,
    method: model.value.method,
    headers,
    withCredentials: model.value.withCredentials
  }
  if (!['GET', 'HEAD'].includes(model.value.method) && model.value.body.trim()) {
    payload.body = model.value.body
  }
  return payload
}

const onSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const payload = buildSubmitPayload()
      if (payload) {
        doSubmit(payload)
      }
    }
  })
}

const doSubmit = async (payload: SubmitPayload) => {
  loading.value = true
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) {
      message.warning('没有找到当前激活标签页')
      return
    }
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: async (requestPayload) => {
        const startedAt = Date.now()
        try {
          const init: RequestInit = {
            method: requestPayload.method,
            headers: requestPayload.headers || {}
          }
          if (requestPayload.withCredentials) {
            init.credentials = 'include'
          }
          if (requestPayload.body !== undefined) {
            init.body = requestPayload.body
          }
          const response = await fetch(requestPayload.url, init)
          const responseText = await response.text()
          let data: any = responseText
          try {
            data = JSON.parse(responseText)
          } catch (err) {
            // Keep original text when not JSON response
          }
          const responseHeaders: Record<string, string> = {}
          response.headers.forEach((value, key) => {
            responseHeaders[key] = value
          })
          return {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers: responseHeaders,
            data,
            durationMs: Date.now() - startedAt
          }
        } catch (err: any) {
          return {
            error: err?.message || String(err),
            durationMs: Date.now() - startedAt
          }
        }
      },
      args: [payload]
    })
    model.value.result = JSON.stringify(result?.[0]?.result || {}, null, 2)
  } catch (err: any) {
    model.value.result = JSON.stringify({ error: err?.message || String(err) }, null, 2)
  } finally {
    loading.value = false
  }
}

const onClear = () => {
  model.value.result = ''
}

onMounted(async () => {
  const storageModel = await useStorage('fetch-value')
  if (storageModel) {
    model.value = <ModelType>storageModel
  }
})
</script>
