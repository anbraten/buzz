<template>
  <div v-if="ticket" class="w-full flex flex-col gap-4 max-w-4xl mx-auto">
    <div class="border-b">
      <h1 class="text-xl">
        {{ ticket.title }} <span class="text-zinc-400">#{{ ticket.id }}</span>
      </h1>
      <div class="flex gap-2">
        <span class="text-sm text-gray-500">Priority {{ ticket.priority }}</span>
        <span class="text-sm text-gray-500">Customer {{ ticket.customerId }}</span>
        <span class="text-sm text-gray-500">Assignee {{ ticket.assigneeId }}</span>
        <span class="text-sm text-gray-500">Status {{ ticket.status }}</span>
        <span class="text-sm text-gray-500">Created at {{ ticket.createdAt }}</span>
        <span class="text-sm text-gray-500">Updated at {{ ticket.updatedAt }}</span>
      </div>
    </div>

    <UCard v-for="comment in comments" :key="comment.id">
      <div class="flex w-full">
        <p class="w-8 h-8 p-1 border rounded-full">{{ comment.agentId }}</p>
        <p class="p-1 ml-4">{{ comment.type }}</p>
        <span class="ml-auto">Created at {{ ticket.createdAt }}</span>
      </div>

      <Markdown :source="comment.content" />
    </UCard>

    <UCard>
      <h2>Add new comment</h2>
      <UForm :schema="commentSchema" :state="newComment" @submit="submit" class="flex flex-col gap-2 w-full">
        <UFormGroup label="Message" name="content" required>
          <!-- <MarkdownEditor v-model="newComment.content" /> -->
          <UTextarea v-model="newComment.content" :rows="5" />
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

const ticketId = route.params.ticketId as string;
const { data: ticket } = await useFetch(`/api/tickets/${ticketId}`);

const { data: comments, refresh: refreshComments } = await useFetch(`/api/tickets/${ticketId}/comments`);

const commentSchema = z.object({
  type: z.string().nonempty(),
  content: z.string().nonempty(),
});

const newComment = ref<Partial<z.infer<typeof commentSchema>>>({
  type: 'text',
  content: '',
});

async function submit() {
  await $fetch(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: newComment.value,
  });

  newComment.value = {
    type: 'text',
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
