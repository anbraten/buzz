export async function useAuth() {
  const router = useRouter();
  const { data: user, refresh: updateSession } = await useFetch('/api/user');

  const isAuthenticated = computed(() => !!user.value?.id);

  async function login(email: string, password: string) {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email,
        password,
      },
    });

    if (res.ok) {
      await updateSession();
      router.replace('/');
    }
  }

  async function logout() {
    const res = await $fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (res.ok) {
      await updateSession();
      router.replace('/');
    }
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    updateSession,
  };
}
