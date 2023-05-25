<template>
  <input v-model="dateString" type="date" @input="updateDate" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Date,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const dateString = computed(() => props.modelValue.toISOString().substr(0, 10));

function updateDate(event: Event) {
  const target = event.target as HTMLInputElement;
  const newDate = new Date(target.value);
  if (!isNaN(newDate.getTime())) {
    emit('update:modelValue', newDate);
  }
}
</script>
