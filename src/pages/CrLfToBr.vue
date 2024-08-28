<template>
    <n-input type="textarea" placeholder="请输入..." v-model:value="text" />
    <n-scrollbar>
        <div v-html="html" class="content"></div>
    </n-scrollbar>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

import useStorage from '@/hooks/useStorage'

const text = ref<string>('')

const html = computed<string>(() => {
    useStorage('crlf-to-br-storage', text.value)
    return replaceCrlfToHtml(text.value)
})

const replaceCrlfToHtml = (text: string) => {
    return text.replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/(\\r\\n|\\r|\\n)/g, '<br>')
}

onMounted(async () => {
    let val = await useStorage('crlf-to-br-storage')
    if (val) {
        text.value = <string>val
    }
})

</script>

<style scoped>
.content {
    text-wrap: nowrap;
}
</style>