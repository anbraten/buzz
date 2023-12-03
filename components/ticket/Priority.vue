<template>
  <UBadge v-if="ticket.priority === 0" size="xs" label="Low - 0" color="primary" variant="subtle" />
  <UBadge v-else-if="ticket.priority === 1" size="xs" label="Normal - 1" color="primary" variant="subtle" />
  <UBadge v-else-if="ticket.priority === 2" size="xs" label="Medium - 2" color="amber" variant="subtle" />
  <UBadge v-else-if="ticket.priority === 3" size="xs" label="High - 3" color="rose" variant="subtle" />
  <UBadge v-else-if="ticket.priority === 4" size="xs" label="Escalated - 4" color="rose" variant="subtle" />
</template>

<script lang="ts" setup>
import type { Ticket } from '~/server/schemas';

defineProps<{
  ticket: Ticket;
}>();
</script>
