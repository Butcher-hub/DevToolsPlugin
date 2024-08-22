<script setup lang="ts">
function setPageBackgroundColor () {
  document.body.style.backgroundColor = "red";
  return document.title
}
const onClick = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // 向目标页面里注入js方法
  let result = await chrome.scripting.executeScript({
    target: { tabId: tab.id || 0 },
    func: setPageBackgroundColor
  });
  console.log(result)
}
</script>

<template>
  <div>
    <button @click="onClick">点我让网页变红</button>
  </div>
</template>

<style scoped>

</style>
