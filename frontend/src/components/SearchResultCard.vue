<template>
  <div class="max-w-xs rounded overflow-hidden shadow-lg m-2 px-3 py-2 flex">
    <i
      class="m-3"
      :class="searchResult.name"
    />
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
