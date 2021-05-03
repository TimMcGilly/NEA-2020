<template>
  <div id="nav">
    <router-link to="/">
      Home
    </router-link> |
    <router-link to="/about">
      About
    </router-link>
    <router-link
      v-if="$auth.isAuthenticated.value"
      to="/profile"
    >
      Profile
    </router-link>

    <!-- Check that the SDK client is not currently loading before accessing is methods -->
    <div v-if="!$auth.loading.value">
      <!-- show login when not authenticated -->
      <button
        v-if="!$auth.isAuthenticated.value"
        @click="login"
      >
        Log in
      </button>
      <!-- show logout when authenticated -->
      <button
        v-if="$auth.isAuthenticated.value"
        @click="logout"
      >
        Log out
      </button>
    </div>
  </div>
  <router-view />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { PrivateUserDetails } from '../../shared';
import store from './store';

export default defineComponent({
  setup() {
    console.log('here2');

    store.dispatch.UserModule.fetchUserAsync();
    return {
      user: computed(() => (store.state.UserModule.ownerDetails as PrivateUserDetails)),
    };
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
      store.dispatch.UserModule.fetchUserAsync();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },
});
</script>
<style lang="scss">

</style>
