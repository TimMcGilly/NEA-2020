<template>
  <div>
    <div class="bg-blue-500 px-20 text-white">
      <div class="flex content-center ">
        <div
          class="inline-block back mr-10 cursor-pointer"
          @click="$router.push('/trips/')"
        >
          <span
            class="fas fa-chevron-left  fa-2x align-middle leading-10"
          />
        </div>
        <div class="flex flex-col pr-10">
          <h1>{{ trip.name }}</h1>
          <h2>{{ trip.start_date.toLocaleDateString() }} - {{ trip.end_date.toLocaleDateString() }}</h2>
        </div>
        <ActivityCard
          v-for="(activity, index) in trip.activites"
          :key="index.toString()+activity.activityCategory.type_id.toString()"
          :activity="activity"
          class="bg-white text-black"
        />
        <div class="flex-1" />

        <ProfileLogin />
      </div>
      <div class="flex">
        <router-link
          v-slot="{ isActive }"
          :to="{ path: ('/trips/' + $route.params.id+'/findindividuals') }"
          class="text-center relative w-24"
        >
          <i class="fas fa-user text-2xl" />
          <span
            class="block font-semibold my-auto"
          >
            Find Individuals
          </span>
          <hr
            v-show="isActive"
            class="mt-1 absolute bottom-0 border-2 w-24"
          >
        </router-link>
        <router-link
          v-slot="{ isActive }"

          :to="{ path: ('/trips/' + $route.params.id+'/messaging') }"
          class="text-center relative w-24"
        >
          <i class="fas fa-envelope text-2xl" />
          <span
            class="block font-semibold my-auto"
          >
            Messaging
          </span>
          <hr
            v-show="isActive"
            class="absolute bottom-0 border-2 w-24"
          >
        </router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import ActivityCard from '@/components/ActivityCard.vue';
import ProfileLogin from '@/components/NavBars/ProfileLogin.vue';

export default defineComponent({
  name: 'TripRoot',
  components: {
    ActivityCard,
    ProfileLogin,
  },
  async setup() {
    const router = useRoute();
    await store.dispatch.TripModule.fetchTripWithIDAsync(router.params.id as string);
    return {
      tripUUID: router.params.id,
      trip: computed(() => store.getters.TripModule.findTrip(router.params.id as string)),
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

<style>
.back{
  line-height: 100px;
}
</style>
