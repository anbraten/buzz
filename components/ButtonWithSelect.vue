<template>
  <UButtonGroup size="sm" type="submit" orientation="horizontal" class="mt-2 mx-auto relative">
    <UButton :label="options.find((o) => o.value === option)?.label" />
    <UDropdown :items="items">
      <UButton trailing-icon="i-heroicons-chevron-down-20-solid" />

      <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>
        <UIcon v-if="item.value === option" name="i-heroicons-check-20-solid" class="ms-auto" />
      </template>
    </UDropdown>
  </UButtonGroup>
</template>

<script setup lang="ts">
const props = defineProps<{
  option?: string;
  options: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  (event: 'update:option', value: string): void;
}>();

const items = computed(() => [
  [
    ...props.options.map((o) => ({
      label: o.label,
      value: o.value,
      click() {
        emit('update:option', o.value);
      },
    })),
  ],
]);
</script>
