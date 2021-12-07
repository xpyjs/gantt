<template>
  <div>
    <p v-if="author" class="td-text">作者：{{ author }}</p>
    <p v-if="date" class="td-text">日期：{{ date }}</p>
    <p v-if="version" class="td-text">版本：{{ version }}</p>
    <p v-if="copyright" class="td-text">版权：{{ copyright }}</p>

    <hr class="td-hr" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
defineProps({
  author: String,
  date: String,
  version: String,
  copyright: String
});
</script>

<style lang="scss" scoped>
.td-text {
  line-height: 1;
  margin: 5px 0;
  font-weight: bold;
}

.td-hr {
  margin: 20px 0;
}
</style>
