<template>
  <div class="max-w-8xl w-3/4 mx-auto py-12 md:max-w-6xl">
    <button
      class="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 shadow"
      @click="$router.push('/trips/new')"
    >
      New Trip
    </button>
    <div class="grid grid-cols-3 gap-4">
      <TripCard
        v-for="trip in trips"
        :key="trip.uuid"
        :trip="trip"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import TripCard from '@/components/TripCard.vue';
import store from '../store';

export default defineComponent({
  name: 'Trips',
  components: {
    TripCard,
  },
  setup() {
    store.dispatch.TripModule.fetchTripsAsync();
    return {
      trips: computed(() => store.getters.TripModule.allTrips),
    };
  },
});
</script>

<style>

</style>
