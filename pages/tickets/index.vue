<template>
  <div class="w-full">
    <h1 class="text-xl">Tickets</h1>

    <UTable :loading="pending" :rows="tickets || []" :columns="ticketColumns" @select="selectTicket"> </UTable>
  </div>
</template>

<script lang="ts" setup>
import type { Ticket } from 'server/schemas';

const router = useRouter();

const ticketColumns = [
  {
    key: 'id',
    label: '#',
  },
  {
    key: 'title',
    label: 'Title',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: 'priority',
    label: 'Priority',
    sortable: true,
  },
];

async function selectTicket(row: Ticket) {
  await router.push(`/tickets/${row.id}`);
}

const { data: tickets, pending } = useFetch('/api/tickets');
</script>
