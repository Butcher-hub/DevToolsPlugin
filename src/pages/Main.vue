<template>
    <n-result class="hello" title="Hello" description="欢迎使用web开发工具集">
        <template #icon>
            <n-icon size="80" color="#0e7a0d">
                <BuildOutline />
            </n-icon>
        </template>
    </n-result>
</template>
<script lang="ts" setup>
import { BuildOutline } from '@vicons/ionicons5'

</script>
<style scoped>
.hello {
    margin-top: 80px;
}
</style>