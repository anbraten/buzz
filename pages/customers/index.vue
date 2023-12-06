<template>
  <div class="w-full">
    <h1 class="text-xl">Customers</h1>

    <UTable :loading="pending" :rows="customers || []" :columns="customerColumns" @select="selectCustomer"></UTable>
  </div>
</template>

<script lang="ts" setup>
import type { Customer } from '~/server/schemas';

const route = useRoute();
const router = useRouter();

const customerColumns = [
  {
    key: 'id',
    label: '#',
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'phone',
    label: 'Phone',
    sortable: true,
  },
];

async function selectCustomer(row: Customer) {
  await router.push(`/customers/${row.id}`);
}

const { data: customers, pending } = useFetch('/api/customers');
</script>
