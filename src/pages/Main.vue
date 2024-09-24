<template>
    <n-result class="hello" title="Hello" description="欢迎使用web开发工具集">
        <template #icon>
            <n-icon size="80" color="#0e7a0d">
                <BuildOutline />
            </n-icon>
        </template>
    </n-result>
    <n-flex justify="center">
        <n-button @click="openInNewTab">新Tab打开</n-button>
    </n-flex>
</template>
<script lang="ts" setup>
import { BuildOutline } from '@vicons/ionicons5'
import { MODE } from '@/util/emun.ts'
const openInNewTab = () => {
    chrome.tabs.create({
        url: `/index.html?mode=${MODE.tab}`
    })
}

</script>
<style scoped>
.hello {
    margin-top: 80px;
}
</style>