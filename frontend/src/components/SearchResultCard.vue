<template>
  <div class="rounded-md overflow-hidden shadow-lg m-2 px-3 py-4 flex items-center content-center space-x-4">
    <img
      class="w-16 h-16 rounded-full "
      :src="'/api/avatars/' + searchResult.avatar"
    >
    <h1>{{ searchResult.name }}</h1>
    <i
      v-for="(activity, index) in searchResult.activites"
      :key="index"
      :class="activity.activityCategory.faicon"
      class="m-1 text-2xl"
    />
    <h2 class="text-2xl">
      {{ searchResult.distance }} km
    </h2>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SearchResult } from '../../../shared';

export default defineComponent({
  name: 'SearchResultCard',
  props: {
    searchResult: {
      type: SearchResult,
      required: true,
    },
  },
});
</script>

<style>

</style>
