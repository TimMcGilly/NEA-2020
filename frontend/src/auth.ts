/*
The code here is from https://github.com/lstyles/vue3-auth0-sample with minor modifications.
I am using this boilerplate code for setup of auth0 libary with vue3 as there is current proper support.
It setup Auth0Client from auth0 spa libabry and the create reactive vue objects with it and several useful
utilites functions for login.
Also register as a new vue plugin.
*/

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import createAuth0Client, {
  Auth0Client, GetIdTokenClaimsOptions, GetTokenSilentlyOptions, GetTokenWithPopupOptions,
  LogoutOptions, RedirectLoginOptions,
} from '@auth0/auth0-spa-js';
import { computed, reactive, watchEffect } from 'vue';

let client: Auth0Client;
// Reactive state which vue tracks
const state = reactive({
  loading: true,
  isAuthenticated: false,
  user: {},
  popupOpen: false,
  error: null,
});

// Opens popup with login box
async function loginWithPopup() {
  state.popupOpen = true;

  try {
    await client.loginWithPopup();
  } catch (e) {
    console.error(e);
  } finally {
    state.popupOpen = false;
  }

  state.user = await client.getUser();
  state.isAuthenticated = true;
}

// Called after login
async function handleRedirectCallback() {
  state.loading = true;

  try {
    await client.handleRedirectCallback();
    state.user = await client.getUser();
    state.isAuthenticated = true;
  } catch (e) {
    state.error = e;
  } finally {
    state.loading = false;
  }
}

function loginWithRedirect(o: RedirectLoginOptions) {
  return client.loginWithRedirect(o);
}

function getIdTokenClaims(o: GetIdTokenClaimsOptions) {
  return client.getIdTokenClaims(o);
}

function getTokenSilently(o: GetTokenSilentlyOptions) {
  return client.getTokenSilently(o);
}

function getTokenWithPopup(o: GetTokenWithPopupOptions) {
  return client.getTokenWithPopup(o);
}

function logout(o: LogoutOptions) {
  return client.logout(o);
}

// Exposed to vue so function can be called.
const authPlugin = {
  isAuthenticated: computed(() => state.isAuthenticated),
  loading: computed(() => state.loading),
  user: computed(() => state.user),
  getIdTokenClaims,
  getTokenSilently,
  getTokenWithPopup,
  handleRedirectCallback,
  loginWithRedirect,
  loginWithPopup,
  logout,
};

export const routeGuard = (to: any, from: any, next: Function) => {
  const { isAuthenticated, loading } = authPlugin;

  const verify = () => {
    // If the user is authenticated, continue with the route
    if (isAuthenticated.value) {
      return next();
    }

    // Otherwise, log in
    loginWithRedirect({ appState: { targetUrl: to.fullPath } });
  };

  // If loading has already finished, check our auth state using `fn()`
  if (!loading.value) {
    return verify();
  }

  // Watch for the loading property to change before we check isAuthenticated
  watchEffect(() => {
    if (loading.value === false) {
      return verify();
    }
  });
};

// Create vue plugin
export const setupAuth = async (options: any, callbackRedirect: any) => {
  client = await createAuth0Client({
    // eslint-disable-next-line @typescript-eslint/camelcase
    redirect_uri: window.location.origin,
    ...options,
  });

  try {
    // If the user is returning to the app after authentication

    if (
      window.location.search.includes('code=')
      && window.location.search.includes('state=')
    ) {
      // Handles the redirect and retrieve tokens.
      // Need to get appState component out of RedirectLoginResult.
      const { appState } = await client.handleRedirectCallback();

      // Notify subscribers that the redirect callback has happened, passing the appState
      // (useful for retrieving any pre-authentication state)
      callbackRedirect(appState);
    }
  } catch (e) {
    state.error = e;
  } finally {
    // Initialize our internal authentication state
    state.isAuthenticated = await client.isAuthenticated();
    state.user = await client.getUser();
    state.loading = false;
  }

  return {
    install: (app: any) => {
      // eslint-disable-next-line no-param-reassign
      app.config.globalProperties.$auth = authPlugin;
    },
  };
};
