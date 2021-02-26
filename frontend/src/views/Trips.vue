<template>
  <p>Trips</p>
</template>

<script>
import store from '../store';

export default {
  setup() {
    store.dispatch.TripModule.fetchTripsAsync();
    console.log(store.state.TripModule.trips);
  },
};
</script>

<style>

</style>
