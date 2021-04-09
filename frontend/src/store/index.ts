/* eslint-disable import/no-cycle */
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
