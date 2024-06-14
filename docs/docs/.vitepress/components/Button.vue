<template>
  <div
    class="x-button"
    :class="{ [`x-button--${type}`]: type, 'x-button--default': !type }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  type: String // 'primary' | 'danger' | 'warning' | 'success'
});
</script>

<style scoped lang="scss">
.x-button {
  display: inline-block;
  background-color: transparent;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  border: 1px solid #d9d9d9;

  & + & {
    margin-left: 8px;
  }

  &--default {
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;

    &:hover {
      color: #eca710;
      border-color: #eca710;
    }

    &:active {
      background-color: #eca7103a;
    }
  }

  &--primary {
    background-color: #eca710;
    color: #fff;

    &:hover {
      background-color: #f0b429;
    }

    &:active {
      background-color: #d89e0e;
    }
  }

  &--danger {
    background-color: #f5222d;
    color: #fff;

    &:hover {
      background-color: #f44c4c;
    }

    &:active {
      background-color: #d93636;
    }
  }

  &--warning {
    background-color: #fd6e0f;
    color: #fff;

    &:hover {
      background-color: #ff7b2f;
    }

    &:active {
      background-color: #e65c0f;
    }
  }

  &--success {
    background-color: #52c41a;
    color: #fff;

    &:hover {
      background-color: #73d13d;
    }

    &:active {
      background-color: #3baa1e;
    }
  }
}
</style>
