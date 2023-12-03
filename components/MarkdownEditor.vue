<template>
  <div>
    <UTextarea
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :rows="5"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
  placeholder?: string;
}>();

defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();
</script>
