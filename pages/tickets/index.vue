<template>
  <div class="w-full">
    <h1 class="text-xl">Tickets</h1>

    <UTable :loading="pending" :rows="tickets || []" :columns="ticketColumns" @select="selectTicket">
      <template #status-data="{ row }">
        <TicketStatus :ticket="row" />
      </template>

      <template #priority-data="{ row }">
        <TicketPriority :ticket="row" />
      </template>

      <template #assigneeId-data="{ row }">
        <TicketAssignee :assigneeId="row.assigneeId" />
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
import type { Ticket } from 'server/schemas';

const route = useRoute();
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
  {
    key: 'assigneeId',
    label: 'Assignee',
    sortable: true,
  },
];

async function selectTicket(row: Ticket) {
  await router.push(`/tickets/${row.id}`);
}

const { data: tickets, pending } = useFetch('/api/tickets', {
  query: computed(() => ({
    filter: route.query.filter as string,
  })),
});
</script>
