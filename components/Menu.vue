<template>
  <aside class="fixed h-screen pb-12 lg:inset-y-0 lg:w-72 lg:flex-col hidden lg:block">
    <NuxtLink
      class="flex items-center px-8 py-6 text-2xl font-semibold tracking-tight duration-200 cursor-pointer stroke-stone-800 dark:text-stone-200 dark:stroke-stone-500 dark:hover:stroke-white hover:stroke-stone-700 hover:text-stone-700 dark:hover:text-white"
      to="/"
    >
      <img v-if="config.public.logo" :src="config.public.logo" alt="Logo" class="w-8" />
      <template v-else>
        <img src="/logo_light.svg" alt="Buzz logo" class="w-8 dark:hidden" />
        <img src="/logo_dark.svg" alt="Buzz dark logo" class="w-8 hidden dark:block" />
      </template>
      <span
        class="ml-2 text-transparent bg-gradient-to-tr from-gray-800 to-gray-400 dark:from-gray-100 dark:to-gray-400 bg-clip-text"
        >{{ config.public.name?.slice(0, 1) }}</span
      >
      <span>{{ config.public.name?.slice(1) }}</span>
    </NuxtLink>
    <div class="space-y-4">
      <div class="px-6 py-2">
        <h2 class="px-2 mb-2 text-lg font-semibold tracking-tight">Tickets</h2>
        <div class="space-y-1">
          <MenuItem to="/" title="Home" icon="i-ion-home" />
          <MenuItem to="/tickets?filter=my" title="My tickets" icon="i-ion-ios-chatboxes">
            <template v-if="myTickets?.length || 0 > 0" #trailing>
              <UBadge :label="myTickets?.length" size="xs" class="ml-auto" :ui="{ rounded: 'rounded-full' }" />
            </template>
          </MenuItem>
          <MenuItem to="/tickets?filter=new" title="New tickets" icon="i-ion-ios-chatboxes">
            <template v-if="newTickets?.length || 0 > 0" #trailing>
              <UBadge
                :label="newTickets?.length"
                size="xs"
                color="amber"
                class="ml-auto"
                :ui="{ rounded: 'rounded-full' }"
              />
            </template>
          </MenuItem>
          <MenuItem to="/tickets" title="All tickets" icon="i-ion-ios-chatboxes" />
          <MenuItem to="/tickets/add" title="Open Ticket" icon="i-ion-plus" />

          <div class="border-b" />

          <MenuItem to="/customers" title="Customers" icon="i-ion-ios-people" />
          <MenuItem to="/customers/add" title="Add customer" icon="i-ion-plus" />
        </div>
      </div>
    </div>

    <div v-if="user" class="absolute inset-x-0 mx-6 bottom-8">
      <UPopover>
        <button
          type="button"
          class="flex items-center justify-between gap-4 px-2 py-1 rounded lg:w-full hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <div class="flex flex-row-reverse items-center justify-start w-full gap-4 lg:flex-row">
            <UAvatar v-if="user.avatarUrl" :src="user.avatarUrl" size="md" alt="Avatar" />

            <div class="flex flex-row-reverse items-center gap-4 lg:gap-1 lg:items-start lg:flex-col">
              <span class="text-ellipsis overflow-hidden whitespace-nowrap max-w-[8rem]">{{ user.name }}</span>
              <span
                class="inline-flex items-center font-medium py-0.5 text-xs uppercase rounded-md text-stone-800 dark:text-stone-300"
                >FREE</span
              >
            </div>
          </div>

          <UIcon name="i-ion-chevron-expand-outline" />
        </button>

        <template #panel>
          <UVerticalNavigation :links="links" class="w-48" />
        </template>
      </UPopover>
    </div>
  </aside>
</template>

<script setup lang="ts">
const router = useRouter();
const { user, logout } = await useAuth();

const config = useRuntimeConfig();

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  },
});

const links = computed(() => [
  {
    label: 'Theme',
    icon: isDark.value ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid',
    click: () => {
      isDark.value = !isDark.value;
    },
  },
  {
    label: 'Logout',
    icon: 'i-ion-log-out-outline',
    click: async () => {
      await logout();
      await router.replace('/auth/login');
    },
  },
]);

const { data: newTickets } = await useFetch('/api/tickets', {
  query: {
    filter: 'new',
  },
});

const { data: myTickets } = await useFetch('/api/tickets', {
  query: {
    filter: 'my',
  },
});
</script>
