<template>
  <div v-if="ticket" class="w-full flex flex-col gap-4 max-w-4xl mx-auto">
    <UForm :schema="ticketSchema" :state="updatedTicket" @submit="updateTicket" class="border-b flex pb-1 gap-2">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-4">
          <h1 class="flex gap-2 text-xl">
            <UInput v-if="isEditingTicket" name="title" v-model="updatedTicket.title" size="xs" />
            <span v-else>{{ ticket.title }}</span>
            <span class="text-zinc-400">#{{ ticket.id }}</span>
          </h1>
          <TicketStatus :ticket="ticket" />
        </div>

        <div class="flex gap-2 text-zinc-500 items-center">
          <div class="flex text-sm gap-1 items-center">
            <span>Priority:</span>
            <USelectMenu
              v-if="isEditingTicket"
              v-model="updatedTicket.priority"
              :options="priorities"
              value-attribute="value"
              option-attribute="label"
              size="xs"
            >
              <template #label>
                {{ priorities.find((p) => p.value === updatedTicket.priority)?.label }}
              </template>
            </USelectMenu>
            <TicketPriority v-else :ticket="ticket" />
          </div>
          <span class="text-sm text-zinc-500">-</span>
          <span class="text-sm text-zinc-500">Opened: {{ timeAgo(ticket.createdAt) }}</span>
        </div>
      </div>

      <div class="flex ml-auto items-center">
        <div :title="assignee?.name || ''" class="flex gap-2 items-center">
          <span class="text-sm text-zinc-500">Assigned to:</span>

          <USelectMenu
            v-if="isEditingTicket"
            v-model="updatedTicket.assigneeId"
            :searchable="searchAssignee"
            option-attribute="name"
            value-attribute="id"
            size="xs"
          >
            <template #label>
              <UAvatar :src="assignee?.avatarUrl || ''" size="3xs" class="mr-2" />
              {{ assignee?.name || 'Unassigned' }}
            </template>
          </USelectMenu>
          <template v-else-if="assignee">
            <UAvatar :src="assignee.avatarUrl || ''" size="xs" />
            <span class="text-sm text-zinc-500">{{ assignee.name || 'Unassigned' }}</span>
          </template>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <template v-if="isEditingTicket">
          <UButton type="button" color="gray" label="Cancel" size="xs" @click="isEditingTicket = false" />
          <UButton type="submit" color="green" label="Save" size="xs" />
        </template>
        <template v-else-if="ticket.status === 'closed'">
          <UButton type="button" color="green" icon="i-ion-ios-undo" size="xs" @click="reopenTicket" />
        </template>
        <template v-else>
          <UButton type="button" color="gray" icon="i-ion-pencil" size="xs" @click="startTicketEditing" />
          <UButton type="button" color="red" icon="i-ion-close" size="xs" @click="closeTicket" />
        </template>
      </div>
    </UForm>

    <TicketComment v-for="comment in comments" :key="comment.id" :comment="comment" :ticket="ticket" />

    <UCard>
      <UForm :schema="commentSchema" :state="newComment" @submit="createComment" class="flex flex-col gap-2 w-full">
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
const router = useRouter();
const toast = useToast();

const ticketId = route.params.ticketId as string;
const { data: ticket, refresh: refreshTicket } = await useFetch(`/api/tickets/${ticketId}`);

const { data: comments, refresh: refreshComments } = await useFetch(`/api/tickets/${ticketId}/comments`);

const ticketSchema = z.object({
  title: z.string().nonempty(),
  assigneeId: z.number(),
  priority: z.number(),
  status: z.string().nonempty(),
});
const updatedTicket = ref<Partial<z.infer<typeof ticketSchema>>>({});
const isEditingTicket = ref(false);
function startTicketEditing() {
  updatedTicket.value = {
    title: ticket.value?.title,
    assigneeId: ticket.value?.assigneeId ?? undefined,
    priority: ticket.value?.priority ?? undefined,
    status: ticket.value?.status,
  };

  isEditingTicket.value = true;
}
async function updateTicket() {
  await $fetch(`/api/tickets/${ticketId}`, {
    method: 'PATCH',
    body: updatedTicket.value,
  });

  await refreshTicket();

  isEditingTicket.value = false;

  toast.add({
    title: 'Ticket updated',
    description: `Ticket #${ticket.value!.id} updated successfully`,
    color: 'green',
  });
}

const { data: assignee } = await useFetch(
  computed(() =>
    updatedTicket.value.assigneeId
      ? `/api/users/${updatedTicket.value?.assigneeId}`
      : `/api/users/${ticket.value?.assigneeId}`,
  ),
);

async function searchAssignee(query: string) {
  const users = await $fetch('/api/users');

  return users.filter((u) => u.name?.toLowerCase().includes(query.toLowerCase())).filter(Boolean);
}
const priorities = [
  { label: 'Low - 0', value: 0 },
  { label: 'Normal - 1', value: 1 },
  { label: 'Medium - 2', value: 2 },
  { label: 'High - 3', value: 3 },
  { label: 'Escalated - 4', value: 4 },
];

const commentSchema = z.object({
  type: z.string().nonempty(),
  content: z.string().nonempty(),
});
const newComment = ref<Partial<z.infer<typeof commentSchema>>>({
  type: 'internal-note',
  content: '',
});
async function createComment() {
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

async function closeTicket() {
  if (!confirm('Are you sure you want to close this ticket?')) {
    return;
  }

  await $fetch(`/api/tickets/${ticketId}`, {
    method: 'PATCH',
    body: {
      status: 'closed',
    },
  });

  toast.add({
    title: 'Ticket closed',
    description: `Ticket #${ticket.value!.id} closed successfully`,
    color: 'green',
  });

  router.back();
}

async function reopenTicket() {
  if (!confirm('Are you sure you want to reopen this ticket?')) {
    return;
  }

  await $fetch(`/api/tickets/${ticketId}`, {
    method: 'PATCH',
    body: {
      status: 'open',
    },
  });

  await refreshTicket();

  toast.add({
    title: 'Ticket reopened',
    description: `Ticket #${ticket.value!.id} reopen successfully`,
    color: 'green',
  });
}
</script>
