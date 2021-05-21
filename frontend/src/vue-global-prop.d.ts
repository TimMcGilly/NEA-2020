import authPlugin from './auth';
import store from './store';

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $auth: typeof authPlugin;
        $store: typeof store.original;
    }
}
