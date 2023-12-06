<template>
  <div v-if="customer" class="flex flex-col w-full max-w-2xl mx-auto items-center">
    <div class="flex items-center w-full mb-8">
      <h1 class="text-2xl">{{ customer.name }}</h1>

      <UButton label="Delete" icon="i-ion-trash" color="rose" size="xs" class="ml-auto" @click="deleteCustomer" />
    </div>

    <UForm :schema="schema" :state="editCustomer" @submit="submit" class="flex flex-col gap-2 w-full max-w-2xl">
      <UFormGroup label="Name" name="name">
        <UInput v-model="editCustomer.name" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput v-model="editCustomer.email" />
      </UFormGroup>

      <UFormGroup label="Phone" name="phone">
        <UInput v-model="editCustomer.phone" />
      </UFormGroup>

      <UFormGroup label="Avatar Url" name="avatarUrl">
        <UInput v-model="editCustomer.avatarUrl" />
      </UFormGroup>

      <UButton type="submit" label="Save" icon="i-ion-save" class="mt-2 mx-auto" />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const schema = z.object({
  name: z.string().nonempty(),
  email: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const editCustomer = ref<Partial<z.infer<typeof schema>>>({
  name: '',
  email: '',
  phone: '',
  avatarUrl: '',
});

const customerId = route.params.customerId as string;
const { data: customer } = useFetch(`/api/customers/${customerId}`, {});
watch(customer, () => {
  editCustomer.value = {
    ...editCustomer.value,
    name: customer.value?.name,
    email: customer.value?.email || undefined,
    phone: customer.value?.phone || undefined,
    avatarUrl: customer.value?.avatarUrl || undefined,
  };
});

async function submit() {
  const customer = await $fetch(`/api/customers/${customerId}`, {
    method: 'PATCH',
    body: editCustomer.value,
  });

  await navigateTo(`/customers/${customer.id}`);

  toast.add({
    title: 'Customer saved',
    description: `Customer ${customer.id} saved successfully`,
    color: 'green',
  });
}

async function deleteCustomer() {
  if (!confirm(`Are you sure you want to delete customer "${customer.value?.name}"?`)) {
    return;
  }

  await $fetch(`/api/customers/${customerId}`, {
    method: 'DELETE',
  });

  await navigateTo(`/customers`);

  toast.add({
    title: 'Customer deleted',
    description: `Customer ${customerId} deleted successfully`,
    color: 'green',
  });

  router.back();
}
</script>
