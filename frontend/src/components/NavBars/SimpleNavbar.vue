<template>
  <!-- Check that the SDK client is not currently loading before accessing is methods -->
  <div v-if="!$auth.loading.value">
    <div class="flex px-40 bg-blue-500 text-white">
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

      <ProfileLogin />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProfileLogin from '@/components/NavBars/ProfileLogin.vue';

export default defineComponent({
  name: 'SimpleNavbar',
  components: {
    ProfileLogin,
  },
});
</script>

  <style>
</style>
