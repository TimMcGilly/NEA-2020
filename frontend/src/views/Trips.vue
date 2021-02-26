<template>
  <p>Trips</p>
</template>

<script>
import { computed } from 'vue';
import store from '../store';

export default {
  setup() {
    store.dispatch.TripModule.fetchTripsAsync();
    console.log(store.state.TripModule.trips);
    return {
      trips: computed(() => store.state.TripModule.trips),
    };
  },
};
</script>

<style>

</style>
