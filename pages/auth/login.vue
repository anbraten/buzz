<template>
  <div class="flex flex-col space-y-2 text-center justify-center items-center">
    <img src="/logo_light.svg" alt="Buzz logo" class="w-32 dark:hidden" />
    <img src="/logo_dark.svg" alt="Buzz dark logo" class="w-32 hidden dark:block" />

    <h1 class="text-3xl font-semibold tracking-tight">Sign In to Your Account</h1>
  </div>
  <div class="grid gap-6">
    <form class="flex flex-col gap-4" @submit.prevent="login(email, password)">
      <UFormGroup label="Email" required>
        <UInput v-model="email" placeholder="you@example.com" icon="i-heroicons-envelope" />
      </UFormGroup>

      <UFormGroup label="Password" required>
        <UInput v-model="password" type="password" icon="i-heroicons-key" />
      </UFormGroup>

      <UButton type="submit" class="w-full" label="Sign In" />
    </form>
  </div>
</template>

<script lang="ts" setup>
const { login } = await useAuth();

const email = ref('');
const password = ref('');

definePageMeta({ layout: 'auth' });
</script>
