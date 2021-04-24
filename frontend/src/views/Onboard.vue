<template>
  <div class="max-w-xl mx-auto py-12 md:max-w-4xl">
    <h1 class="text-2xl font-semibold m-4">
      Account details
    </h1>
    <form
      id="OnboardingForm"
    >
      <div class="p-4">
        <label
          for="name"
          class="block text-gray-700"
        >Name: </label>
        <input
          id="name"
          v-model="name"
          class="block form-simple"
          type="text"
          name="name"
          required
        >
      </div>
      <div class="p-4">
        <label
          for="dob"
          class="block text-gray-700"
        >Date Of Birth: </label>
        <input
          id="dob"
          v-model="dob"
          class="block form-simple"
          type="date"
          name="date-of-birth"
          min="1850-01-01"
          :max="maxDOB"
        >
      </div>
      <div class="p-4">
        <label
          for="bio"
          class="block text-gray-700"
        >Bio Description: </label>
        <textarea
          id="bio"
          v-model="bio"
          class="block form-simple resize-none"
          :rows="4"
          :cols="50"
          :maxlength="400"
        />
      </div>
      <div class="p-4">
        <label
          for="avatar"
          class="block text-gray-700"
        >Upload Avatar: </label>
        <input
          id="avatar"
          type="file"
          name="avatar"
          accept="image/png, image/jpeg"
        >
        <textarea
          id="bio"
          v-model="bio"
          class="block form-simple resize-none"
          :rows="4"
          :cols="50"
          :maxlength="400"
        />
      </div>

      <div class="px-4">
        <button
          type="button"
          class="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300"
          @click="submitForm()"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { Date13YearAgo, DateToYMDString } from '../../../shared/Utils/Date';
import formData from 'form-data';
export default defineComponent({
  name: 'Onboard',
  data() {
    return {
      name: '',
      dob: '1970-01-01',
      bio: '',
      avatar: 
    };
  },
  computed: {
    maxDOB: () => DateToYMDString(Date13YearAgo()),
  },
  methods: {
    async submitForm() {
      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently();

      // Use Axios to make a call to the onboard API
      try {
        await axios.post('/api/onboard', {
          name: this.name,
          dob: this.dob,
          bio: this.bio,
          avatar: this.avatar,
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // send the access token through the 'Authorization' header
          },
        });
        this.$router.push('trips');
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<style>
</style>
