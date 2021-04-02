import authPlugin from './auth';

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $auth: typeof authPlugin;
    }
}
