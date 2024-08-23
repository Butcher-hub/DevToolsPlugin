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
              <n-input v-model:value="model.params[i - 1]" :placeholder="`param${i}`" />
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
        </tbody>
      </n-table>
    </n-form-item>
    <n-space justify="end" align="center" style="margin-bottom: 8px;">
      <n-tag type="success" v-for="operation in quickOperations" @click="selectQuickOperation(operation)">
        {{ operation.name }}
      </n-tag>
      <n-button type="primary" @click="submit">提交</n-button>
    </n-space>
    <n-card title="结果" size="small" :segmented="{
      content: true
    }">
      <n-code :code="model.result" language="json" :show-line-numbers="true" />
    </n-card>
  </n-form>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { AddCircleOutline, TrashBinOutline } from '@vicons/ionicons5'
import type { FormRules } from 'naive-ui'


interface ModelType {
  className?: string
  methodName?: string
  params: any[],
  result?: string
}

interface QuickOperation extends ModelType {
  name: string
}

const model = reactive<ModelType>({
  params: ['']
})

const rules: FormRules[] = []

const quickOperations: QuickOperation[] = [
  {
    name: '获取资源树节点',
    className: 'CatalogService',
    methodName: 'getCatalogElementById',
    params: []
  },
  {
    name: '删除资源树节点',
    className: 'CatalogService',
    methodName: 'getCatalogElementById',
    params: []
  }
]

const addParam = (index: number) => {
  model.params.splice(index, 0, '')
}

const removeParam = (index: number) => {
  if (model.params.length == 1) {
    model.params[0] = ''
  } else {
    model.params.splice(index, 1)
  }
}

const submit = async () => {
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
    args: [JSON.parse(JSON.stringify(model))]
  });
  if (result && result[0] && result[0].result) {
    let ret = result[0].result
    if (typeof ret === 'object') {
      model.result = JSON.stringify(ret, null, 2)
    } else {
      try {
        model.result = JSON.stringify(JSON.parse(result[0].result), null, 2)
      } catch (e) {
        model.result = result[0].result
      }
    }
  }
}

const selectQuickOperation = (operation: QuickOperation) => {
  model.className = operation.className
  model.methodName = operation.methodName
}
</script>