<template>
  <div class="flex gap-2 items-start">
    <UAvatar
      :src="(comment.type === 'customer-reply' ? customer.avatarUrl : agent?.avatarUrl) || config.public.fallbackAvatar"
      size="md"
      class="mt-4"
    />

    <div class="relative w-full">
      <UCard class="w-full relative" :class="{ 'bg-amber-100 dark:bg-amber-900': comment.type === 'internal-note' }">
        <div class="flex w-full border-b border-zinc-300 text-zinc-500 text-sm mb-4">
          <span v-if="comment.type === 'customer-reply'">{{ customer.name }}</span>
          <span v-else>{{ agent?.name }}</span>
          <span class="ml-auto">{{ timeAgo(comment.createdAt) }}</span>
        </div>

        <Markdown :source="comment.content" />
      </UCard>

      <div
        class="absolute rounded-full ring-1 ring-zinc-200 dark:ring-zinc-800 -top-2 -left-2 w-8 h-8 flex items-center justify-center"
        :class="{
          'bg-amber-100 dark:bg-amber-900': comment.type === 'internal-note',
          'bg-white dark:bg-zinc-900': comment.type !== 'internal-note',
        }"
      >
        <UIcon v-if="comment.type === 'call'" name="i-ion-call" />
        <UIcon v-else-if="comment.type === 'agent-reply'" name="i-ion-reply" />
        <UIcon v-else-if="comment.type === 'customer-reply'" name="i-ion-ios-mail" />
        <UIcon v-else-if="comment.type === 'internal-note'" name="i-ion-document-text-sharp" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ticket, TicketComment } from '~/server/schemas';

const props = defineProps<{
  comment: TicketComment;
  ticket: Ticket;
}>();

const comment = toRef(props, 'comment');
const ticket = toRef(props, 'ticket');

const { data: agent } = await useFetch(`/api/users/${comment.value.agentId}`);

const { data: customer } = await useFetch(() => `/api/customers/${ticket.value?.customerId}`);

const config = useRuntimeConfig();
</script>
