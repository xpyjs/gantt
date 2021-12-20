<template>
  <transition name="fade">
    <div v-if="isShowToast" class="gt-toast gt-noselect">
      {{ toastMessage }}
    </div>
  </transition>
</template>

<script lang="ts" setup>
import useToast from '@/composables/useToast';

const { isShowToast, toastMessage } = useToast();
</script>

<style scoped lang="scss">
.gt-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 0.3rem;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  z-index: 9999;
}
</style>
