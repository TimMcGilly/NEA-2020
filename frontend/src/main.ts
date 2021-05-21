import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './assets/css/tailwind.css';
import '../node_modules/leaflet-geosearch/dist/geosearch.css';

import '../node_modules/leaflet/dist/leaflet.css';

// Import the plugin here
import { setupAuth } from './auth';
import authConfig from '../auth_config.json';

// Import font awesome
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

const app = createApp(App).use(store.original).use(router);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callbackRedirect(appState: any) {
  router.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : '/',
  );
}
setupAuth(authConfig, callbackRedirect).then((auth) => {
  // Creates vue instance
  app.use(auth).mount('#app');
});
