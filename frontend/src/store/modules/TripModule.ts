/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-cycle */

import { ResponseHandler } from '@/utils/response';
import axios from 'axios';
import { defineModule } from 'direct-vuex';
import { reactive } from 'vue';
import { Trip, PartialTrip } from '../../../../shared';

import { moduleActionContext, moduleGetterContext } from '../index';

export interface TripModuleState {
     trips: Map<string, Trip>;
}

const TripModule = defineModule({
  namespaced: true as true,
  state: {
    trips: reactive(new Map<string, Trip>()),
  } as TripModuleState,
  getters: {
    allTrips(...args): Trip[] {
      const {
        state,
      } = TripModuleGetterContext(args);

      return Array.from(state.trips.values());
    },
    findTrip(...args) {
      const {
        state,
      } = TripModuleGetterContext(args);
      // Returns a function for user to use
      return (uuid: string): Trip => {
        const trip = state.trips.get(uuid);
        if (!trip) { throw Error('Bad trip id'); }
        return trip;
      };
    },
  },
  mutations: {
    addTrip(state, trip: Trip) {
      console.log(trip);
      state.trips.set(trip.uuid, trip);
    },
    clearTrips(state) {
      state.trips = new Map<string, Trip>();
    },
    deleteTrip(state, uuid: string) {
      state.trips.delete(uuid);
    },
  },
  actions: {
    /**
     * Adds new trip to backend and vuex store
     * @param context Vuex context
     * @param partialTrip Partial Trip object to be added
     * @returns Array of errors
     */
    async newTripAsync(context, partialTrip: PartialTrip): Promise<string[]> {
      const { commit, rootGetters } = TripModuleActionContext(context);
      const { token } = rootGetters;

      try {
        const res = new ResponseHandler(await axios.post('/api/trip', {
          partialTrip,
        }, {
          headers: {
            Authorization: `Bearer ${await token}`, // send the access token through the 'Authorization' header
          },
        }));

        // If error return error array to form
        if (!res.isSuccess) { return res.failArray; }

        console.log(res.data.trip);
        commit.addTrip(new Trip(res.data.trip));
        return [];
      } catch (error) {
        console.error(error);
        return ['Internal error'];
      }
    },
    async fetchTripsAsync(context) {
      const { commit, rootGetters } = TripModuleActionContext(context);

      const { token } = rootGetters;

      // Use Axios to make a call to the /api/trips
      try {
        const res = new ResponseHandler(await axios.get('/api/trip', {
          headers: {
            Authorization: `Bearer ${await token}`, // send the access token through the 'Authorization' header
          },
        }));
        if (!res.isSuccess) { throw res.failArray; }

        // eslint-disable-next-line prefer-destructuring
        const trips: Trip[] = res.data.trips;
        trips.forEach((trip) => commit.addTrip(new Trip(trip)));
      } catch (error) {
        console.error(error);
      }
    },
    async fetchTripWithIDAsync(context, uuid: string) {
      const { commit, rootGetters } = TripModuleActionContext(context);

      const { token } = rootGetters;
      // Use Axios to make a call to the /api/trips
      try {
        const res = new ResponseHandler(await axios.get(`/api/trip/${uuid}`, {
          headers: {
            Authorization: `Bearer ${await token}`, // send the access token through the 'Authorization' header
          },
        }));
        if (!res.isSuccess) { throw res.failArray; }

        // eslint-disable-next-line prefer-destructuring
        const trip: Trip = res.data.trip;
        commit.addTrip(new Trip(trip));
      } catch (error) {
        console.error(error);
      }
    },
    async deleteTrip(context, uuid: string) {
      const { commit, rootGetters } = TripModuleActionContext(context);

      const { token } = rootGetters;
      // Use Axios to make a call to the /api/trips
      try {
        const res = new ResponseHandler(await axios.delete(`/api/trip/${uuid}`, {
          headers: {
            Authorization: `Bearer ${await token}`, // send the access token through the 'Authorization' header
          },
        }));

        if (!res.isSuccess) { throw res.failArray; }

        commit.deleteTrip(uuid);
      } catch (error) {
        console.error(error);
      }
    },
  },
});

export default TripModule;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TripModuleActionContext = (context: any) => moduleActionContext(context, TripModule);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TripModuleGetterContext = (args: [any, any, any, any]) => moduleGetterContext(args, TripModule);
