<template>
  <p>here</p>
  <div>
    <h1>{{ trip.name }}</h1>
  </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'TripRoot',
  async setup() {
    const router = useRoute();
    await store.dispatch.TripModule.fetchTripWithIDAsync(router.params.id as string);
    return {
      tripUUID: router.params.id,
      trip: computed(() => {
        console.log('changed');
        return store.getters.TripModule.findTrip(router.params.id as string);
      }),
    };
  },
  data() {
    return {
    };
  },
  methods: {

  },
});
</script>
