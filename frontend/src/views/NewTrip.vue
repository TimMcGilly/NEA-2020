<template>
  <div>
    <h1>New Trip</h1>
    <form
      id="OnboardingForm"
      class="max-w-xl mx-auto py-12 md:max-w-4xl"
    >
      <div class="p-4">
        <label
          for="name"
          class="block text-gray-700"
        >Name: </label>
        <input
          v-model="name"
          class="block form-simple"
          type="text"
          name="name"
          required
        >
      </div>

      <div class="p-4">
        <label
          for="start_date"
          class="block text-gray-700"
        >Trip start date: </label>
        <input
          id="start_date"
          v-model="start_date"
          class="block form-simple"
          type="date"
          min="1850-01-01"
        >
      </div>
      <div class="p-4">
        <label
          for="end_date"
          class="block text-gray-700"
        >Trip end date: </label>
        <input
          id="end_date"
          v-model="end_date"
          class="block form-simple"
          type="date"
          :min="tomorrowsDate"
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DateToYMDString, AddDaysToDate } from '../../../shared/Utils/Date';

export default defineComponent({
  name: 'NewTrip',
  data() {
    return {
      name: '',
      dob: '1970-01-01',
      bio: '',
    };
  },
  computed: {
    tomorrowsDate: () => DateToYMDString(AddDaysToDate(new Date(), 1)),
  },
});
</script>

<style>

</style>
