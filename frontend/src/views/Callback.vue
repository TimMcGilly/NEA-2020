<!-- Code from https://github.com/lstyles/vue3-auth0-sample/blob/master/src/views/Callback.vue
which sets up basic callbacks for auth0. Boiler plate code -->

<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Callback',
  created() {
    if (this.$route.query.error) {
      console.log(this.$route.query.error_description);
      this.$auth.logout({
        returnTo: `${window.location.origin}/error?error=${encodeURI(this.$route.query.error as string)}&error_description=${encodeURI(this.$route.query.error_description as string)}`,
      });
    }
  },
});
</script>
