<template>
  <div>
    <router-link
      to="/trips/new"
      tag="button"
    >
      New Trip
    </router-link>
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
      trips: computed(() => store.state.TripModule.trips),
    };
  },
});
</script>

<style>

</style>
