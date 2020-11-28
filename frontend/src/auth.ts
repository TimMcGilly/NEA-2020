import createAuth0Client, {
  Auth0Client, GetIdTokenClaimsOptions, GetTokenSilentlyOptions, GetTokenWithPopupOptions,
  LogoutOptions, RedirectLoginOptions,
} from '@auth0/auth0-spa-js';
import { computed, reactive } from 'vue';

let client: Auth0Client;
const state = reactive({
  loading: true,
  isAuthenticated: false,
  user: {},
  popupOpen: false,
  error: null,
});

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

export default async (options: any, callbackRedirect: any) => {
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
      // handle the redirect and retrieve tokens
      const appState = await client.handleRedirectCallback();

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
