/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-cycle */

import axios from 'axios';
import { defineModule } from 'direct-vuex';
import { Trip } from '../../../../shared';

import { moduleActionContext, moduleGetterContext } from '../index';

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
    async newTripAsync(context, trip: Trip) {
      const { commit, rootGetters } = TripModuleActionContext(context);
      const { token } = rootGetters;

      try {
        await axios.post('/api/trips', {
          trip,
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // send the access token through the 'Authorization' header
          },
        });
        commit.addTrip(trip);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchTripsAsync(context) {
      const { rootGetters } = TripModuleActionContext(context);

      const { token } = rootGetters;
      // Use Axios to make a call to the /api/trips
      try {
        const trips: Trip[] = await axios.get('/api/trips', {
          headers: {
            Authorization: `Bearer ${token}`, // send the access token through the 'Authorization' header
          },
        });
        trips.forEach((trip) => context.commit('addTrip', trip));
      } catch (error) {
        console.error(error);
      }
    },
  },
});

export default TripModule;
const TripModuleGetterContext = (args: [any, any, any, any]) => moduleGetterContext(args, TripModule);
const TripModuleActionContext = (context: any) => moduleActionContext(context, TripModule);
