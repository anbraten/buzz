<template>
  <div v-if="ticket" class="w-full flex flex-col gap-4 max-w-4xl mx-auto">
    <div class="border-b flex pb-1">
      <div>
        <div class="flex items-center gap-4">
          <h1 class="text-xl">
            {{ ticket.title }} <span class="text-zinc-400">#{{ ticket.id }}</span>
          </h1>
          <TicketStatus :ticket="ticket" />
        </div>

        <div class="flex gap-2 text-zinc-500">
          <span class="text-sm">Priority: <TicketPriority :ticket="ticket" /></span>
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
      <UForm :schema="commentSchema" :state="newComment" @submit="submit" class="flex flex-col gap-2 w-full">
        <h2 class="mb-4">{{ newComment.type === 'internal-note' ? 'Add new comment' : 'Reply to customer' }}</h2>

        <UFormGroup :label="newComment.type === 'internal-note' ? 'Comment' : 'Message'" name="content" required>
          <MarkdownEditor
            v-model="newComment.content"
            :placeholder="
              newComment.type === 'internal-note'
                ? 'Write some comment about a call, research you have done or ask one of your colleagues for help.'
                : 'The customer will receive this message as an email'
            "
          />
        </UFormGroup>

        <UCheckbox
          :model-value="newComment.type === 'internal-note'"
          name="internal"
          label="Make this an internal comment"
          @update:model-value="newComment.type = $event ? 'internal-note' : 'agent-reply'"
        />

        <UButton
          type="submit"
          :color="newComment.type === 'internal-note' ? 'primary' : 'blue'"
          :label="newComment.type === 'internal-note' ? 'Add comment' : 'Reply to customer'"
          class="mx-auto"
        />
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

const route = useRoute();
const toast = useToast();

const ticketId = route.params.ticketId as string;
const { data: ticket } = await useFetch(`/api/tickets/${ticketId}`);

const { data: comments, refresh: refreshComments } = await useFetch(`/api/tickets/${ticketId}/comments`);

const { data: assignee } = await useFetch(`/api/users/${ticket.value?.assigneeId}`);

const commentSchema = z.object({
  type: z.string().nonempty(),
  content: z.string().nonempty(),
});

const newComment = ref<Partial<z.infer<typeof commentSchema>>>({
  type: 'internal-note',
  content: '',
});

async function submit() {
  await $fetch(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: newComment.value,
  });

  newComment.value = {
    type: 'internal-note',
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
