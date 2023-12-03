<template>
  <div class="w-full">
    <h1 class="text-xl" v-if="$route.query.filter === 'my'">Tickets I am assigned to</h1>
    <h1 class="text-xl" v-else-if="$route.query.filter === 'new'">Newt tickets</h1>
    <h1 class="text-xl" v-else>Tickets</h1>

    <UTable :loading="pending" :rows="tickets || []" :columns="ticketColumns" @select="selectTicket">
      <template #title-data="{ row }">
        <div class="flex items-center">
          <span>{{ row.title }}</span>
          <UBadge
            v-if="row.unreadCustomerReplies === 1"
            label="New message from customer"
            size="xs"
            color="cyan"
            variant="subtle"
            class="ml-2"
          />
        </div>
      </template>

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
  // {
  //   key: 'status',
  //   label: 'Status',
  //   sortable: true,
  // },
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
