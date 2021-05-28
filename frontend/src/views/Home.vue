<template>
  <SimpleNavbar />
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
import SimpleNavbar from '@/components/NavBars/SimpleNavbar.vue';

export default defineComponent({
  name: 'Home',
  components: {
    SimpleNavbar,
  },
  methods: {
    async login() {
      await store.dispatch.UserModule.login({});
    },
  },
});
</script>
