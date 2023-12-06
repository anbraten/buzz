<template>
  <div class="flex flex-col w-full items-center">
    <h1 class="text-2xl mb-8">Add a new customer</h1>

    <UForm :schema="schema" :state="newCustomer" @submit="submit" class="flex flex-col gap-2 w-full max-w-2xl">
      <UFormGroup label="Name" name="name">
        <UInput v-model="newCustomer.name" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput v-model="newCustomer.email" />
      </UFormGroup>

      <UFormGroup label="Phone" name="phone">
        <UInput v-model="newCustomer.phone" />
      </UFormGroup>

      <UFormGroup label="Avatar Url" name="avatarUrl">
        <UInput v-model="newCustomer.avatarUrl" />
      </UFormGroup>

      <UButton type="submit" label="Add customer" icon="i-heroicons-plus" class="mt-2 mx-auto" />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

const toast = useToast();

const schema = z.object({
  name: z.string().nonempty(),
  email: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const newCustomer = ref<Partial<z.infer<typeof schema>>>({
  name: '',
  email: '',
  phone: '',
  avatarUrl: '',
});

async function submit() {
  const customer = await $fetch('/api/customers', {
    method: 'POST',
    body: newCustomer.value,
  });

  await navigateTo(`/customers/${customer.id}`);

  toast.add({
    title: 'Customer added',
    description: `Customer ${customer.id} added successfully`,
    color: 'green',
  });
}
</script>
