<template>
  <div class="wide-page">
    <h1>NEA 2020/2021</h1>
    <p>Please Signup or login</p>
    <button
      class="button-primary"
      @click="login"
    >
      Sign Up / Log in
    </button>
  </div>
</template>

<script lang="ts">
import store from '@/store';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  methods: {
    login() {
      store.dispatch.UserModule.login();
    },
  },
});
</script>
