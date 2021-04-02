<template>
  <p>{{ trip.name }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Trip } from '../../../shared';

export default defineComponent({
  name: 'TripCard',
  props: {
    trip: {
      type: Trip,
      required: true,
    },
  },
});
</script>

<style>

</style>
