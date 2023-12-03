<template>
  <div>
    <UTextarea :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :rows="5" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
}>();

defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();
</script>
