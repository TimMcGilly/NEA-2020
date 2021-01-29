import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './assets/css/tailwind.css';

// Import the plugin here
import { setupAuth } from './auth';
import authConfig from '../auth_config.json';

const app = createApp(App).use(store).use(router);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callbackRedirect(appState: any) {
  router.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : '/',
  );
}
setupAuth(authConfig, callbackRedirect).then((auth) => {
  app.use(auth).mount('#app');
});
