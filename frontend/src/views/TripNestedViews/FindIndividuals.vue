<template>
  <div class="wide-page">
    <h1>Search test</h1>
    <SearchResultCard
      v-for="(searchResult, index) in searchResults"
      :key="index"
      :search-result="searchResult"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import { useRoute } from 'vue-router';
import SearchResultCard from '@/components/SearchResultCard.vue';

export default defineComponent({
  name: 'FindIndividuals',
  components: {
    SearchResultCard,
  },
  async setup() {
    return {
      searchResults: await store.dispatch.SearchModule.search(useRoute().params.id as string),
    };
  },
});
</script>
