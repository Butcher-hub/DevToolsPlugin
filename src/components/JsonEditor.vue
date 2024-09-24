<template>
  <div class="json-editor">
    <div ref="jsonEditorRef" class="jsoneditor"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import JSONEditor from 'jsoneditor';
import { defineProps, defineEmits } from 'vue';

interface JsonEditorProps {
  value: object | string | Array<any>;
}

const props = defineProps<JsonEditorProps>();
const emit = defineEmits(['update:value']);

const jsonEditorRef = ref<HTMLElement | null>(null);
let editor: JSONEditor | null = null;

const initEditor = () => {
  if (jsonEditorRef.value) {
    editor = new JSONEditor(jsonEditorRef.value, {
      modes: ['tree', 'view', 'form', 'code', 'text','preview'],
      onChangeText: (json: any) => {
        emit('update:value', json);
      }
    });
    editor.set(props.value);
  }
};

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  if (editor) {
    editor.destroy();
  }
});

watch(
  () => props.value,
  (newValue: any) => {
    if (editor && newValue !== editor.get()) {
      editor.update(newValue);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.json-editor {
  height: calc(100vh - 55px);;
  width: 100%;
}

.jsoneditor {
  height: 100%;
  width: 100%;
}
</style>