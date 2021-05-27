<template>
  <!-- Check that the SDK client is not currently loading before accessing is methods -->
  <div
    v-if="!$auth.loading.value"
  >
    <div class="flex px-40 bg-blue-600 text-white">
      <div
        v-if="$auth.isAuthenticated.value"
        class="hover:bg-blue-700 cursor-pointer p-5"
        @click="$router.push('/trips/')"
      >
        <i class="fas fa-plane fa-2x" />
        <p class="mx-auto">
          Trips
        </p>
      </div>

      <div class="flex-1" />

      <div
        v-if="$auth.isAuthenticated.value"
        class="hover:bg-blue-700 cursor-pointer p-5"
        @click="$router.push('/profile/')"
      >
        <img
          v-if="user"
          class="w-10 h-10 rounded-full items-center"
          :src="'/api/avatars/' + user.avatar"
        >
        <p class="mx-auto">
          Profile
        </p>
      </div>

      <!-- show logout when authenticated -->
      <button
        v-if="!$auth.isAuthenticated.value"
        class="button-primary text-black my-5"
        @click="login"
      >
        Sign Up / Log in
      </button>

      <button
        v-if="$auth.isAuthenticated.value"
        class="button-primary text-black my-5 my-auto"
        @click="logout"
      >
        Log out
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'SimpleNavbar',

  setup() {
    store.dispatch.UserModule.fetchUserAsync();

    return {
      user: computed(() => (store.state.UserModule.ownerDetails)),
    };
  },
  methods: {
    // Log the user in
    async login() {
      await store.dispatch.UserModule.login({});
    },
    // Log the user out
    logout() {
      store.dispatch.UserModule.logout(window.location.origin);
    },
  },
});
</script>

  <style>
</style>
