<template>
  <div class="max-w-xl mx-auto py-12 md:max-w-4xl">
    <h1 class="text-2xl font-semibold m-4">
      Account details
    </h1>
    <form
      id="OnboardingForm"
      @submit="submitForm"
    >
      <div
        v-if="errors.length"
        class="m-4"
      >
        <b>Please correct the following error(s):</b>
        <ul>
          <li
            v-for="error in errors"
            :key="error"
          >
            {{ error }}
          </li>
        </ul>
      </div>
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
          @change="onUpload"
        >
        <img
          v-if="url"
          :src="url"
          class="h-40"
        >
      </div>

      <div class="px-4">
        <button
          class="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300"
          type="submit"
          value="Submit"
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

export default defineComponent({
  name: 'Onboard',
  data() {
    return {
      name: '',
      dob: '1970-01-01',
      bio: '',
      avatar: null as File|null,
      errors: [] as string[],
      url: null as string|null,
    };
  },
  computed: {
    maxDOB: () => DateToYMDString(Date13YearAgo()),
  },
  methods: {
    async onUpload(event: Event) {
      const target = event.target as HTMLInputElement;
      // eslint-disable-next-line prefer-destructuring
      this.avatar = (target.files as FileList)[0];

      // Setups preview image
      this.url = URL.createObjectURL(this.avatar);
    },
    async submitForm(e: Event) {
      e.preventDefault();
      this.errors = [];

      if (this.avatar == null) {
        this.errors.push('Avatar is required');
      }

      // Create new form data which is used for multi-part form as uploading image file
      const form = new FormData();
      form.append('name', this.name);
      form.append('dob', this.dob);
      form.append('bio', this.bio);
      form.append('avatar', this.avatar as File);

      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently();

      // Use Axios to make a call to the onboard API
      try {
        await axios.post('/api/onboard', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
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
