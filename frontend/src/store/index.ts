/* eslint-disable import/no-cycle */
// import Vuex, { createStore, useStore as baseUseStore, Store } from 'vuex';
// import Vue, { InjectionKey } from 'vue';

// import { createDirectStore } from 'direct-vuex';
// import TripModule, { TripModule } from './modules/TripModule';

// import { State } from './models/Root';

// // define injection key
// export const key: InjectionKey<Store<State>> = Symbol('Store Symbol');

// export const store = createStore<State>({
//   state: {
//   },
//   getters: {
//     vue() {
//       // eslint-disable-next-line no-underscore-dangle
//       return this._vm;
//     },
//     token(_, getters) {
//       // Get the access token from the auth wrapper
//       return getters.vue.$auth.getTokenSilently();
//     },
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//     trip: TripModule,
//   },
// });

// export function useStore() {
//   return baseUseStore(key);
// }

import { createDirectStore } from 'direct-vuex';
import TripModule from './modules/TripModule';

export interface RootState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vue: any;
}

const {
  store,
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext,
} = createDirectStore({
  state: {
    vue: null,
  } as RootState,
  getters: {
    token(...args): string {
      const state = args[0];
      console.log(state.vue);
      return state.vue.$auth.getTokenSilently();
    },
  },
  mutations: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setVueInstance(state, vue: any) {
      state.vue = vue;
    },
  },
  modules: {
    TripModule,
  },
});

// Export the direct-store instead of the classic Vuex store.
export default store;

// The following exports will be used to enable types in the
// implementation of actions.
export {
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext,
};

// The following lines enable types in the injected store '$store'.
export type AppStore = typeof store
declare module 'vuex' {
  interface Store<S> {
    direct: AppStore;
  }
}
