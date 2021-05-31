<!-- Dashboard of all trip -->
<template>
  <SimpleNavbar />

  <div class="wide-page">
    <h1>Trips</h1>
    <button
      class="button-primary"
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
import SimpleNavbar from '@/components/NavBars/SimpleNavbar.vue';
import store from '../store';

export default defineComponent({
  name: 'TripsDashboard',
  components: {
    TripCard,
    SimpleNavbar,

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
