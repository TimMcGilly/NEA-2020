<template>
  <div class="max-w-xs rounded overflow-hidden shadow-lg m-2 px-3 py-2 flex w-64">
    <i
      class="m-3"
      :class="activity.activityCategory.faicon"
    />
    <div class="py-1">
      <p class="font-semibold pr-2">
        {{ activity.activityCategory.name }}
      </p>
      <p>
        Experience - {{ activity.ExperienceStr }}
      </p>
      <p>
        Style - {{ activity.StyleStr }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Activity } from '../../../shared';

export default defineComponent({
  name: 'ActivityCard',
  props: {
    activity: {
      type: Activity,
      required: true,
    },
  },
});
</script>

  <style>

  </style>
