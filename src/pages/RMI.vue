<template>
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item path="className" label="类名">
      <n-input v-model:value="model.className" placeholder="className" />
    </n-form-item>
    <n-form-item path="methodName" label="方法名">
      <n-input v-model:value="model.methodName" placeholder="methodName" />
    </n-form-item>
    <n-form-item path="params" label="参数">
      <n-table :bordered="true" :single-line="false">
        <tbody>
          <tr v-for="i in model.params.length">
            <td>
              <n-input v-model:value="model.params[i - 1].value" :placeholder="`param${i}`" />
            </td>
            <td>
              <n-select v-model:value="model.params[i - 1].dataType" :options="dataTypeOptions" />
            </td>
            <td>
              <n-space>
                <n-button strong secondary circle type="primary" @click="addParam(i)">
                  <template #icon>
                    <n-icon>
                      <AddCircleOutline />
                    </n-icon>
                  </template>
                </n-button>
                <n-button strong secondary circle type="error" @click="removeParam(i - 1)">
                  <template #icon>
                    <n-icon>
                      <TrashBinOutline />
                    </n-icon>
                  </template>
                </n-button>
              </n-space>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <n-space>
                <n-button strong secondary circle type="primary" @click="addParam(model.params.length)">
                  <template #icon>
                    <n-icon>
                      <AddCircleOutline />
                    </n-icon>
                  </template>
                </n-button>
                <n-button strong secondary circle type="info" @click="saveQuickOperation()">
                  <template #icon>
                    <n-icon>
                      <SaveOutline />
                    </n-icon>
                  </template>
                </n-button>
                <n-collapse style="margin-top: 6px;" arrow-placement="right">
                  <n-collapse-item title="快捷方式">
                    <n-space align="center">
                      <n-tag type="success" closable @close="onRemoveQuickOperation(operation)"
                        v-for="operation in quickOperations" @click="selectQuickOperation(operation)">
                        {{ operation.name }}
                      </n-tag>
                    </n-space>
                  </n-collapse-item>
                </n-collapse>
              </n-space>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-form-item>
    <n-space justify="end" align="center" style="margin-bottom: 24px;">
      <n-button type="primary" @click="onSubmit" :loading="loading">提交</n-button>
    </n-space>
    <n-card v-if="model.result" title="结果" size="small" :segmented="{
      content: true
    }">
      <n-code :code="model.result" language="json" :show-line-numbers="true" />
    </n-card>
  </n-form>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { AddCircleOutline, TrashBinOutline, SaveOutline } from '@vicons/ionicons5'
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'

import useStorage from '@/hooks/useStorage'

interface ModelType {
  className?: string
  methodName?: string
  params: Param[],
  result?: string
}

interface Param {
  value: string;
  dataType: 'string' | 'boolean' | 'number' | 'object';
}

interface QuickOperation extends ModelType {
  name: string
}

const message = useMessage()

const loading = ref<boolean>(false)

const formRef = ref<FormInst | null>(null)

const model = ref<ModelType>({
  params: []
})

const rules: FormRules = {
  className: {
    required: true,
    message: '请输入ClassName'
  },
  methodName: {
    required: true,
    message: '请输入methodName'
  }
}

const dataTypeOptions = [{
  label: '字符串',
  value: 'string'
}, {
  label: '布尔',
  value: 'boolean'
}, {
  label: '数值',
  value: 'number'
}, {
  label: '对象',
  value: 'object'
}]

watch(model, (value) => {
  useStorage('rmi-value', JSON.parse(JSON.stringify(value)))
}, { deep: true })

const quickOperations = ref<QuickOperation[]>([])

const addParam = (index: number) => {
  model.value.params.splice(index, 0, { value: '', dataType: 'string' })
}

const removeParam = (index: number) => {
  model.value.params.splice(index, 1)
}

const onSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let args = handleModelValue(model.value)
      doSubmit(args)
    }
  })
}

const handleModelValue = (modelValue: ModelType) => {
  let params = modelValue.params.map(el => {
    try {
      switch (el.dataType) {
        case 'number':
          return Number(el.value)
        case 'boolean':
          return el.value.toLowerCase() === 'true'
        case 'object':
          return JSON.parse(el.value)
        default:
          return el.value
      }
    } catch (error: any) {
      message.warning(error.message)
      return el.value
    }
  })
  return [{
    className: modelValue.className,
    methodName: modelValue.methodName,
    params
  }]
}

const doSubmit = async (args: any) => {
  loading.value = true
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // 向目标页面里注入js方法
  let result = await chrome.scripting.executeScript({
    target: { tabId: tab.id || 0 },
    world: 'MAIN',
    func: (model) => {
      // @ts-ignore
      let util = window.jsloader.resolve('freequery.common.util')
      return util.remoteInvoke(model.className, model.methodName, model.params)
    },
    args
  });
  loading.value = false
  if (result && result[0] && result[0].result) {
    let ret = result[0].result
    if (typeof ret === 'object') {
      model.value.result = JSON.stringify(ret, null, 2)
    } else {
      model.value.result = result[0].result
    }
  }
}

const selectQuickOperation = (operation: QuickOperation) => {
  model.value.className = operation.className
  model.value.methodName = operation.methodName
}

const saveQuickOperation = async () => {
  quickOperations.value.push({
    name: `${model.value.className}.${model.value.methodName}`,
    className: model.value.className,
    methodName: model.value.methodName,
    params: []
  })
  await useStorage('rmi-quick-operation', JSON.parse(JSON.stringify(quickOperations.value)))
}

const onRemoveQuickOperation = async (value: QuickOperation) => {
  quickOperations.value = quickOperations.value.filter(el => el.name !== value.name)
  await saveQuickOperation()
}

onMounted(async () => {
  quickOperations.value = <QuickOperation[]>await useStorage('rmi-quick-operation') || []
  let storageModel = await useStorage('rmi-value')
  if (storageModel) {
    model.value = <ModelType>storageModel
  }
})
</script>