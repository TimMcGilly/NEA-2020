<template>
  <div>
    <button @click="callApi">
      Call
    </button>
    <p>{{ apiMessage }}</p>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExternalApi',
  data() {
    return {
      apiMessage: '',
    };
  },
  methods: {
    async callApi() {
      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently();

      // Use Axios to make a call to the API
      const { data } = await axios.get('/api/external', {
        headers: {
          Authorization: `Bearer ${token}`, // send the access token through the 'Authorization' header
        },
      });

      this.apiMessage = data;
    },
  },
});
</script>
