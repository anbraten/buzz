<template>
  <UBadge v-if="ticket.status === 'open'" size="xs" label="Open" color="primary" variant="subtle" />
  <UBadge
    v-else-if="ticket.status === 'pending-customer'"
    size="xs"
    label="Waiting for customer"
    color="amber"
    variant="subtle"
  />
  <UBadge
    v-else-if="ticket.status === 'pending-agent'"
    size="xs"
    label="New message from customer"
    color="amber"
    variant="subtle"
  />
  <UBadge v-else-if="ticket.status === 'overdue'" size="xs" label="Overdue" color="rose" variant="subtle" />
  <UBadge v-else-if="ticket.status === 'closed'" size="xs" label="Closed" color="gray" variant="subtle" />
</template>

<script lang="ts" setup>
import type { Ticket } from '~/server/schemas';

defineProps<{
  ticket: Ticket;
}>();
</script>
