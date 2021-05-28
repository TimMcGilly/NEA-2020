<template>
  <!-- Check that the SDK client is not currently loading before accessing is methods -->
  <div v-if="!$auth.loading.value">
    <div class="flex px-40 bg-blue-600 text-white">
      <div
        class="inline-block back mr-10 cursor-pointer"
        @click="$router.go(-1)"
      >
        <span class="fas fa-chevron-left text-white fa-2x align-middle" />
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
  name: 'BackNavbar',
  components: {
    ProfileLogin,
  },
});
</script>
<style>
.back {
  line-height: 100px;
}
</style>
