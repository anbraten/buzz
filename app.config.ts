export default defineAppConfig({
  ui: {
    primary: 'zinc',
    input: {
      default: {
        color: 'primary',
        size: 'lg',
      },
    },
    select: {
      default: {
        size: 'lg',
      },
    },
    selectMenu: {
      default: {
        size: 'lg',
      },
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-700',
      background: 'bg-white dark:bg-zinc-800',
      input:
        'block w-[calc(100%+0.5rem)] focus:ring-transparent text-sm px-3 py-1.5 text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border-0 border-b border-zinc-200 dark:border-zinc-700 focus:border-inherit sticky -top-1 -mt-1 mb-1 -mx-1 z-10 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none',
    },
    button: {
      default: {
        size: 'lg',
      },
    },
    card: {
      background: 'bg-white dark:bg-zinc-900',
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800',
      divide: 'divide-y divide-zinc-200 dark:divide-zinc-800',
    },
    popover: {
      background: 'bg-white dark:bg-zinc-900',
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800',
    },
    table: {
      divide: 'divide-y divide-zinc-300 dark:divide-zinc-700',
      tbody: 'divide-y divide-zinc-200 dark:divide-zinc-800',
      tr: {
        selected: 'bg-zinc-50 dark:bg-zinc-800/50',
        active: 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer',
      },
      th: {
        color: 'text-zinc-900 dark:text-white',
      },
      td: {
        color: 'text-zinc-500 dark:text-zinc-400',
      },
      loadingState: {
        label: 'text-sm text-center text-zinc-900 dark:text-white',
        icon: 'w-6 h-6 mx-auto text-zinc-400 dark:text-zinc-500 mb-4 animate-spin',
      },
      emptyState: {
        label: 'text-sm text-center text-zinc-900 dark:text-white',
        icon: 'w-6 h-6 mx-auto text-zinc-400 dark:text-zinc-500 mb-4',
      },
    },
    dropdown: {
      background: 'bg-white dark:bg-zinc-800',
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-700',
      divide: 'divide-y divide-zinc-200 dark:divide-zinc-700',
      item: {
        active: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white',
        inactive: 'text-zinc-700 dark:text-zinc-200',
        icon: {
          active: 'text-zinc-500 dark:text-zinc-400',
          inactive: 'text-zinc-400 dark:text-zinc-500',
        },
      },
    },
    notification: {
      background: 'bg-white dark:bg-zinc-900',
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800',
    },
  },
});
