<template>
  <div v-if="ticket" class="w-full flex flex-col gap-4 max-w-4xl mx-auto">
    <div class="border-b flex">
      <div>
        <div class="flex items-center gap-4">
          <h1 class="text-xl">
            {{ ticket.title }} <span class="text-zinc-400">#{{ ticket.id }}</span>
          </h1>
          <TicketStatus :ticket="ticket" />
        </div>

        <div class="flex gap-2 text-zinc-500">
          <span class="text-sm">Priority: {{ ticket.priority }}</span>
          <span class="text-sm text-zinc-500">-</span>
          <span class="text-sm text-zinc-500">Opened: {{ timeAgo(ticket.createdAt) }}</span>
        </div>
      </div>

      <div v-if="assignee" :title="assignee.name || ''" class="flex ml-auto gap-2 items-center pb-2">
        <span class="text-sm text-zinc-500">Assigned to:</span>
        <UAvatar :src="assignee.avatarUrl || ''" size="xs" />
        <span class="text-sm text-zinc-500">{{ assignee.name || 'Unassigned' }}</span>
      </div>
    </div>

    <TicketComment v-for="comment in comments" :key="comment.id" :comment="comment" />

    <UCard>
      <USelectMenu v-model="newComment.type" :options="commentTypes" value-attribute="value">
        <template #option="{ option }">
          <span class="truncate">{{ option.label }}</span>
        </template>
      </USelectMenu>

      <h2>Add new {{ commentTypes.find((c) => c.value === newComment.type)?.label }}</h2>
      <UForm :schema="commentSchema" :state="newComment" @submit="submit" class="flex flex-col gap-2 w-full">
        <UFormGroup label="Message" name="content" required>
          <MarkdownEditor v-model="newComment.content" />
        </UFormGroup>

        <UButton type="submit" label="Comment" icon="i-heroicons-plus" class="mt-2 mx-auto" />
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

const route = useRoute();
const toast = useToast();

const commentTypes = [
  { label: 'Reply', value: 'agent-reply' },
  { label: 'Call note', value: 'call' },
  { label: 'Internal note', value: 'internal-note' },
  { label: 'Customer reply', value: 'customer-reply' },
];

const ticketId = route.params.ticketId as string;
const { data: ticket } = await useFetch(`/api/tickets/${ticketId}`);

const { data: comments, refresh: refreshComments } = await useFetch(`/api/tickets/${ticketId}/comments`);

const { data: assignee } = await useFetch(`/api/users/${ticket.value?.assigneeId}`);

const commentSchema = z.object({
  type: z.string().nonempty(),
  content: z.string().nonempty(),
});

const newComment = ref<Partial<z.infer<typeof commentSchema>>>({
  type: 'agent-reply',
  content: '',
});

async function submit() {
  await $fetch(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: newComment.value,
  });

  newComment.value = {
    type: 'agent-reply',
    content: '',
  };

  await refreshComments();
}

async function deleteTicket() {
  if (!ticket.value) {
    return;
  }

  if (!confirm(`Do you want to remove the ticket #${ticket.value.id}`)) {
    return;
  }

  await $fetch(`/api/tickets/${ticketId}`, {
    method: 'DELETE',
  });

  toast.add({
    title: 'Ticket removed',
    description: `Ticket #${ticket.value!.id} removed successfully`,
    color: 'green',
  });

  await navigateTo('/');
}
</script>
