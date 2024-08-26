<template>
    <n-input type="textarea" placeholder="请输入..." v-model:value="text" />
    <n-switch v-model:value="mode">
        <template #checked>
            文本
        </template>
        <template #unchecked>
            树
        </template>
    </n-switch>
    <n-scrollbar>
        <div v-if="mode" v-html="html"></div>
        <n-tree v-else block-line :data="treeData" expand-on-click :default-expand-all="true" />
    </n-scrollbar>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { TreeOption } from 'naive-ui'

interface TreeNode {
    id: string
    pid: string | null
    level: number
    children: TreeNode[]
}

const text = ref<string>('')

const mode = ref<boolean>(true)

const treeData = computed<TreeOption[]>(() => {
    if (text.value) {
        return processText2TreeOptions(text.value)
    }
    return []
})

const html = computed<string>(() => {
    return replaceCrlfToHtml(text.value)
})

const replaceCrlfToHtml = (text: string) => {
    return text.replace(/\\t/g, '    ').replace(/(\\r\\n|\\r|\\n)/g, '<br>')
}

const processText2TreeOptions = (text: string) => {
    // 将制表符替换为空格
    const replaced = replaceCrlfToHtml(text)
    // 分割每一行并处理缩进
    let lines = replaced.split('<br>')
    let nodes: TreeNode[] = []
    lines.forEach((line, i) => {
        const indentCount = (line.match(/^\s+/) || [''])[0].length / 4;
        if (indentCount === 0) {
            nodes.push({
                id: line,
                pid: null,
                level: indentCount,
                children: []
            })
        } else {
            let preNode = nodes[i - 1]
            if (preNode.level < indentCount) {
                nodes.push({
                    id: line,
                    pid: preNode.id,
                    level: indentCount,
                    children: []
                })
            } else if (preNode.level === indentCount) {
                nodes.push({
                    id: line,
                    pid: preNode.pid,
                    level: indentCount,
                    children: []
                })
            } else if (preNode.level > indentCount) {
                preNode = nodes[findLastMatchIndex(nodes, (n: TreeNode) => n.level === indentCount)]
                if (preNode) {
                    nodes.push({
                        id: line,
                        pid: preNode.pid,
                        level: indentCount,
                        children: []
                    })
                }
            }
        }
    });
    return buildTree(nodes)
}

const buildTree = (nodes: TreeNode[]) => {
    let roots: TreeOption[] = nodes.filter(el => !el.pid).map(el => {
        let option: TreeOption = {
            key: el.id,
            label: el.id,
            children: []
        }
        return option
    })
    roots.forEach((node: TreeOption) => {
        buildTreeInner(node, nodes)
    })
    console.log(roots)
    return roots
}

const buildTreeInner = (pNode: TreeOption, nodes: TreeNode[]) => {
    pNode.children = nodes.filter(el => el.pid === pNode.key).map(el => {
        let option: TreeOption = {
            key: el.id,
            label: el.id,
            children: []
        }
        buildTreeInner(option, nodes)
        return option
    })
}

function findLastMatchIndex(array: any[], condition: Function) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (condition(array[i])) {
            return i;
        }
    }
    return -1;
}

</script>

<style scoped>
.indent {
    display: none;
    padding-left: 20px;
    margin-bottom: 10px;
}

.indent.active {
    display: block;
}

.toggle {
    cursor: pointer;
    color: blue;
}
</style>