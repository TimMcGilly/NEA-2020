<!-- New trip form view -->
<template>
  <div class="max-w-xl mx-auto py-12 px-4 md:max-w-4xl">
    <h1 class="text-2xl font-semibold">
      New Trip
    </h1>
    <form
      id="NewTripForm"
      class="space-y-6"
      @submit="submitForm"
    >
      <div v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li
            v-for="error in errors"
            :key="error"
          >
            {{ error }}
          </li>
        </ul>
      </div>
      <div>
        <label
          class="block text-gray-700"
          for="name"
        >Name:</label>
        <input
          v-model="name"
          class="block form-simple"
          type="text"
          name="name"
          required
        >
      </div>
      <div class="inline-block">
        <div class="inline-block">
          <label
            class="block text-gray-700"
            for="startDate"
          >Trip start date:</label>
          <input
            id="startDate"
            v-model="startDate"
            class="block form-simple"
            type="date"
            min="1850-01-01"
          >
        </div>
        <div class="inline-block mx-5 mb-2">
          <label
            class="block text-gray-700"
            for="endDate"
          >Trip end date:</label>
          <input
            id="endDate"
            v-model="endDate"
            class="block form-simple"
            type="date"
            :min="todaysDate"
          >
        </div>
      </div>
      <div
        id="map"
        ref="map"
        class="w-3/4 h-80"
      />
      <div>
        <label
          class="block text-gray-700"
          for="address"
        >Address:</label>
        <input
          v-model="address"
          class="block form-simple w-3/4"
          type="text"
          name="address"
          required
        >
      </div>
      <div class="w-3/4">
        <label class="text-gray-700">Activites:</label>
        <div class="flex flex-wrap border p-1 pb-5">
          <div
            class="flex flex-col"
            :class="{ 'w-1/2': selectedActivity != null}"
          >
            <ActivityCard
              v-for="(activity, index) in activites"
              :key="index.toString()+activity.activityCategory.type_id.toString()"
              :activity="activity"
              :class="{ 'bg-gray-300': selectedActivityIndex == index}"
              @click="selectActivity(activity, index)"
            />
            <button
              class="button-primary text-sm h-10 mx-5 my-2"
              @click="createActivity"
            >
              + New Activity
            </button>
          </div>
          <div
            v-if="selectedActivity"
            class="w-1/2 border-l pl-2 space-y-2"
          >
            <p>Activity Type</p>
            <select
              v-model="selectedActivityCatergory"
              @change="setActivityCatergory"
            >
              <option
                disabled
              >
                Please select one
              </option>
              <option
                v-for="cat in activityCategories"
                :key="cat.type_id"
                :value="cat.type_id"
              >
                {{ cat.name }}
              </option>
            </select>
            <p>Experience</p>
            <select v-model="selectedActivity.experience">
              <option
                disabled
                value=""
              >
                Please select one
              </option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>

            <p>Style</p>
            <select v-model="selectedActivity.style">
              <option
                disabled
                value=""
              >
                Please select one
              </option>
              <option>Casual</option>
              <option>Serious</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <input
          class="button-primary"
          type="submit"
          value="Submit"
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import ActivityCard from '@/components/ActivityCard.vue';

import { computed, defineComponent, ref } from 'vue';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import L, { LeafletEvent } from 'leaflet';

// Needed for typing of SearchResult
import { SearchResult } from '../../node_modules/leaflet-geosearch/src/providers/provider';
import iconUrl from '../../node_modules/leaflet/dist/images/marker-icon.png';
import shadowUrl from '../../node_modules/leaflet/dist/images/marker-shadow.png';
import iconRetinaUrl from '../../node_modules/leaflet/dist/images/marker-icon-2x.png';
import { Activity, ActivityCategory, PartialTrip } from '../../../shared';
import { DateToYMDString } from '../../../shared/Utils/Date';

import store from '../store';

interface ShowLocationEvent extends LeafletEvent {
  // Called location because that is data in
  // https://github.com/smeijer/leaflet-geosearch/blob/bb4945915d1564206ce46e677453b8a6e4705f17/src/SearchControl.ts#L375
  // even though it is a search result
  location: SearchResult;
  marker: L.Marker;
}

export default defineComponent({
  name: 'NewTrip',
  components: {
    ActivityCard,
  },
  setup() {
    // Custom marker to be used by search and drag. Created here as used in computed
    const marker = ref(L.marker([50.5, 30.5]));
    const startDate = ref(DateToYMDString(new Date()));
    const endDate = ref(DateToYMDString(new Date()));

    // Fetch activity catergories
    store.dispatch.ActivityModule.fetchActivityCategoriesAsync();

    return {
      marker,
      startDate,
      endDate,
      activityCategories: computed(() => store.state.ActivityModule.activityCategories),

    };
  },

  data() {
    return {
      name: '',
      address: '',
      errors: [] as string[],
      activites: [] as Activity[],
      selectedActivity: null as Activity|null,
      selectedActivityIndex: -1,
      selectedActivityCatergory: -1,
    };
  },
  computed: {
    todaysDate: () => DateToYMDString(new Date()),
  },
  mounted() {
    this.setupMap();
  },
  methods: {

    async submitForm(e: Event) {
      e.preventDefault();
      this.errors = [];

      if (!this.name) {
        this.errors.push('Name is required');
      }

      const startDateObj = new Date(this.startDate);
      const endDateObj = new Date(this.endDate);

      if (startDateObj > endDateObj) {
        this.errors.push('Start date must be before end date.');
      }

      if (this.errors.length) {
        return false;
      }

      // No errors so far so call backend api

      // Create partial trip to send to vuex

      const latlng = this.marker.getLatLng();
      /* eslint-disable @typescript-eslint/camelcase */
      const newPartialTrip = new PartialTrip({
        name: this.name,
        start_date: startDateObj,
        end_date: endDateObj,
        lat: latlng.lat,
        lng: latlng.lng,
        text_loc: this.address,
        activites: this.activites,
      });
      /* eslint-enable @typescript-eslint/camelcase */

      // Call vuex and recived any errors returned
      this.errors = await this.$store.direct.dispatch.TripModule.newTripAsync(newPartialTrip);

      if (this.errors.length === 0) {
        this.$router.push('/trips');
      }
      return false;
    },
    setupMap() {
      // Fixes bug in Leaflet where icons for markers is incorrect. https://github.com/Leaflet/Leaflet/issues/4968

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
      });

      // Create Leaflet map
      const map = L.map(this.$refs.map as HTMLElement).setView([51.505, -0.09], 13);
      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Adds custom marker to map
      this.marker.addTo(map);

      // Create search bar for map
      const searchControl = GeoSearchControl({
        provider: new OpenStreetMapProvider({
          params: {
            addressdetails: 1, // include additional address detail parts
          },
        }),
        style: 'bar',
        showMarker: false,
      });

      map.addControl(searchControl);

      map.on('click', this.onMapClick);

      map.on('geosearch/showlocation', this.onSearch);
    },
    onMapClick(e: L.LeafletMouseEvent) {
      this.marker.setLatLng(e.latlng);
    },
    onSearch(e: LeafletEvent) {
      const result = (e as ShowLocationEvent).location;
      const lng = result.x;
      const lat = result.y;
      this.marker.setLatLng(L.latLng(lat, lng));

      // Updates address textbox
      this.address = result.label;
    },
    createActivity() {
      const newActivity = new Activity();
      this.activites.push(newActivity);
      this.selectActivity(newActivity, this.activites.length - 1);
    },
    selectActivity(activity: Activity, index: number) {
      this.selectedActivity = activity;
      this.selectedActivityIndex = index;
      this.selectedActivityCatergory = activity.activityCategory.type_id;
    },
    setActivityCatergory() {
      if (this.selectedActivity) {
        (this.selectedActivity as Activity).activityCategory = this.activityCategories.find((e) => e.type_id === this.selectedActivityCatergory) as ActivityCategory;
      }
    },
  },
});
</script>

<style>
</style>
