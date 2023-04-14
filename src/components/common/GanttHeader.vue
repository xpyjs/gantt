<template>
  <div class="xg-gantt-header">
    <div v-for="i in 100" :key="i" class="xg-gantt-header-cell">
      {{ i }}
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.xg-gantt-header {
  height: 80px;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;

  .xg-gantt-header-cell {
    width: 30px;
    height: 100%;
    overflow: hidden;
    display: inline-block;
    background-color: blueviolet;
  }
}
</style>
