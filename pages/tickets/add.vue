<template>
  <div class="flex flex-col w-full items-center">
    <h1 class="text-2xl mb-8">Add a new ticket</h1>

    <UForm :schema="schema" :state="newTicket" @submit="submit" class="flex flex-col gap-2 w-full max-w-2xl">
      <UFormGroup label="Title" name="title">
        <UInput v-model="newTicket.title" />
      </UFormGroup>

      <UFormGroup label="Assignee" name="assigneeId">
        <USelectMenu
          v-model="newTicket.assigneeId"
          :searchable="searchAssignee"
          option-attribute="name"
          value-attribute="id"
        >
        </USelectMenu>
      </UFormGroup>

      <UFormGroup label="Customer ID" name="customerId">
        <UInput v-model="newTicket.customerId" type="number" />
      </UFormGroup>

      <UFormGroup label="Priority" name="priority">
        <USelectMenu
          v-model="newTicket.priority"
          :options="priorities"
          value-attribute="value"
          option-attribute="label"
        >
          <template #label>
            {{ priorities.find((p) => p.value === newTicket.priority)?.label }}
          </template>
        </USelectMenu>
      </UFormGroup>

      <UButton type="submit" label="Add ticket" icon="i-heroicons-plus" class="mt-2 mx-auto" />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

const toast = useToast();

const schema = z.object({
  customerId: z.number().int(),
  assigneeId: z.number().int().optional(),
  priority: z.number().int(),
  title: z.string().nonempty(),
});

const priorities = [
  { label: 'Low - 0', value: 0 },
  { label: 'Normal - 1', value: 1 },
  { label: 'Medium - 2', value: 2 },
  { label: 'High - 3', value: 3 },
  { label: 'Escalated - 4', value: 4 },
];

const newTicket = ref<Partial<z.infer<typeof schema>>>({
  customerId: 1,
  assigneeId: undefined,
  title: '',
  priority: 0,
});

async function submit() {
  const ticket = await $fetch('/api/tickets', {
    method: 'POST',
    body: newTicket.value,
  });

  await navigateTo(`/tickets/${ticket.id}`);

  toast.add({
    title: 'Ticket added',
    description: `Ticker ${ticket.id} added successfully`,
    color: 'green',
  });
}

async function searchAssignee(query: string) {
  const users = await $fetch('/api/users');

  return users.filter((u) => u.name?.toLowerCase().includes(query.toLowerCase())).filter(Boolean);
}
</script>
