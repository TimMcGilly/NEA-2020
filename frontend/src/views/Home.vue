<template>
  <BlankNavbar />
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
import BlankNavbar from '@/components/NavBars/BlankNavbar.vue';

export default defineComponent({
  name: 'Home',
  components: {
    BlankNavbar,
  },
  methods: {
    async login() {
      await store.dispatch.UserModule.login({});
    },
  },
});
</script>
