<template>
  <SimpleNavbar />
  <div class="wide-page">
    <div>
      <img
        class="w-10 h-10 rounded-full items-center"
        :src="'/api/avatars/' + user.avatar"
      >
      <h2>{{ user.name }}</h2>
      <p>{{ user.bio_description }}</p>
    </div>

    <!-- <div>
      <pre>{{ JSON.stringify($auth.value.user, null, 2) }}</pre>
    </div>-->
  </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent } from 'vue';
import SimpleNavbar from '@/components/NavBars/SimpleNavbar.vue';
import { PrivateUserDetails } from '../../../shared/Models/User';

export default defineComponent({
  name: 'Profile',
  components: {
    SimpleNavbar,
  },
  async setup() {
    return {
      user: computed(() => store.state.UserModule.ownerDetails as PrivateUserDetails),
    };
  },
  data() {
    return {
    };
  },
  methods: {

  },
});
</script>
