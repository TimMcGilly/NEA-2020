<template>
  <div class="max-w-xs rounded overflow-hidden shadow-lg my-2 p-5">
    <h2 class="font-semibold text-lg">
      Trip to {{ trip.name }}
    </h2>
    <div class="py-1">
      <p class="inline-block font-semibold pr-2">
        Start
      </p>
      <p class="inline-block">
        {{ formattedStartDate }}
      </p>
      <p class="inline-block font-semibold pl-3 pr-2">
        End
      </p>
      <p class="inline-block">
        {{ formattedEndDate }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { Trip } from '../../../shared';
import { DateToYMDString } from '../../../shared/Utils/Date';

export default defineComponent({
  name: 'TripCard',
  props: {
    trip: {
      type: Trip,
      required: true,
    },
  },
  setup(props) {
    return {
      formattedStartDate: computed(() => DateToYMDString(new Date(props.trip.start_date))),
      formattedEndDate: computed(() => DateToYMDString(new Date(props.trip.end_date))),

    };
  },
});
</script>

<style>

</style>
