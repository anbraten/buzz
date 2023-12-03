<template>
  <div v-if="assignee" class="flex items-center">
    <UAvatar :src="assignee.avatarUrl" size="xs" />
    <span class="ml-2">{{ assignee.name || 'Unassigned' }}</span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  assigneeId: number | null;
}>();

const assigneeId = toRef(props, 'assigneeId');
const { data: assignee } = useFetch(`/api/users/${assigneeId.value}`);
</script>
