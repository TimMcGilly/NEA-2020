/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-cycle */

import axios from 'axios';
import { defineModule } from 'direct-vuex';
import { Trip, PartialTrip } from '../../../../shared';

import { moduleActionContext } from '../index';

export interface TripModuleState {
     trips: Trip[];
}

const TripModule = defineModule({
  namespaced: true as true,
  state: {
    trips: [],
  } as TripModuleState,
  getters: {
  },
  mutations: {
    addTrip(state, trip: Trip) {
      state.trips.push(trip);
    },
  },
  actions: {
    async newTripAsync(context, partialTrip: PartialTrip): Promise<string[]> {
      const { commit, rootGetters } = TripModuleActionContext(context);
      const { token } = rootGetters;

      try {
        const res = await axios.post('/api/trip', {
          partialTrip,
        }, {
          headers: {
            Authorization: `Bearer ${await token}`, // send the access token through the 'Authorization' header
          },
        });
        if (res.status === 201) {
          commit.addTrip(new Trip(res.data.trip));
          return [];
        }
        return res.data.error;
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
        const response = await axios.get('/api/trip', {
          headers: {
            Authorization: `Bearer ${await token}`, // send the access token through the 'Authorization' header
          },
        });

        // eslint-disable-next-line prefer-destructuring
        const trips: Trip[] = response.data.trips;
        trips.forEach((trip) => commit.addTrip(new Trip(trip)));
      } catch (error) {
        console.error(error);
      }
    },
  },
});

export default TripModule;
// const TripModuleGetterContext = (args: [any, any, any, any]) => moduleGetterContext(args, TripModule);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TripModuleActionContext = (context: any) => moduleActionContext(context, TripModule);
