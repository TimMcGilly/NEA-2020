<template>
  <div class="max-w-xl mx-auto py-12 md:max-w-4xl">
    <h1 class="text-2xl font-semibold m-4">
      New Trip
    </h1>
    <form
      id="OnboardingForm"
      @submit="submitForm"
    >
      <div
        v-if="errors.length"
        class="m-4"
      >
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

      <div class="m-4">
        <label
          for="name"
          class="block text-gray-700"
        >Name:</label>
        <input
          v-model="name"
          class="block form-simple"
          type="text"
          name="name"
          required
        >
      </div>

      <div class="m-4">
        <label
          for="startDate"
          class="block text-gray-700"
        >Trip start date:</label>
        <input
          id="startDate"
          v-model="startDate"
          class="block form-simple"
          type="date"
          min="1850-01-01"
        >
      </div>
      <div class="m-4">
        <label
          for="endDate"
          class="block text-gray-700"
        >Trip end date:</label>
        <input
          id="endDate"
          v-model="endDate"
          class="block form-simple"
          type="date"
          :min="todaysDate"
        >
      </div>
      <div
        id="map"
        ref="map"
        class="m-4 w-3/4 h-80"
      />

      <div class="m-4">
        <label
          for="address"
          class="block text-gray-700"
        >Address:</label>
        <input
          v-model="address"
          class="block form-simple w-3/4"
          type="text"
          name="address"
          required
        >
      </div>

      <div class="m-4">
        <input
          class="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300"
          type="submit"
          value="Submit"
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import L, { LeafletEvent } from 'leaflet';

// Needed for typing of SearchResult
import { SearchResult } from '../../node_modules/leaflet-geosearch/src/providers/provider';
import iconUrl from '../../node_modules/leaflet/dist/images/marker-icon.png';
import shadowUrl from '../../node_modules/leaflet/dist/images/marker-shadow.png';
import iconRetinaUrl from '../../node_modules/leaflet/dist/images/marker-icon-2x.png';
import { PartialTrip } from '../../../shared';
import { DateToYMDString } from '../../../shared/Utils/Date';

interface ShowLocationEvent extends LeafletEvent {
  // Called location because that is data in
  // https://github.com/smeijer/leaflet-geosearch/blob/bb4945915d1564206ce46e677453b8a6e4705f17/src/SearchControl.ts#L375
  // even though it is a search result
  location: SearchResult;
  marker: L.Marker;
}

export default defineComponent({
  name: 'NewTrip',
  setup() {
    // Custom marker to be used by search and drag. Created here as used in computed
    const marker = ref(L.marker([50.5, 30.5]));
    const startDate = ref(DateToYMDString(new Date()));
    const endDate = ref(DateToYMDString(new Date()));

    return {
      marker,
      startDate,
      endDate,
    };
  },

  data() {
    return {
      name: '',
      address: '',
      errors: [] as string[],
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
  },
});
</script>

<style>
</style>
