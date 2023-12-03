<template>
  <div class="flex gap-2 items-start">
    <div class="relative">
      <UAvatar :src="user?.avatarUrl" size="lg" />
      <div
        class="absolute rounded-full ring-1 ring-zinc-200 dark:ring-zinc-800 -bottom-1 -right-1 w-8 h-8 flex items-center justify-center"
        :class="{
          'bg-amber-100 dark:bg-amber-900': comment.type === 'internal-note',
          'bg-zinc-100 dark:bg-zinc-900': comment.type !== 'internal-note',
        }"
      >
        <UIcon v-if="comment.type === 'call'" name="i-ion-call" />
        <UIcon v-else-if="comment.type === 'agent-reply'" name="i-ion-reply" />
        <UIcon v-else-if="comment.type === 'customer-reply'" name="i-ion-ios-mail" />
        <UIcon v-else-if="comment.type === 'internal-note'" name="i-ion-document-text-sharp" />
      </div>
    </div>
    <UCard class="w-full" :class="{ 'bg-amber-100 dark:bg-amber-900': comment.type === 'internal-note' }">
      <div class="flex w-full border-b border-zinc-300 text-zinc-500 text-sm mb-4">
        <span>{{ user.name }}</span>
        <span class="ml-auto">{{ timeAgo(comment.createdAt) }}</span>
      </div>

      <Markdown :source="comment.content" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { TicketComment } from '~/server/schemas';

const props = defineProps<{
  comment: TicketComment;
}>();

const comment = toRef(props, 'comment');

const { data: user } = await useFetch(`/api/users/${comment.value.agentId}`);
</script>
