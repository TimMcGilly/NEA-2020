import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Callback from '../views/Callback.vue';
import { authRouteGuard, onboardingRouteGuard } from '../auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    beforeEnter: authRouteGuard,
  },
  {
    path: '/external-api',
    name: 'external-api',
    component: () => import('../views/ExternalApi.vue'),
    beforeEnter: authRouteGuard,
  },
  {
    path: '/onboard',
    name: 'onboard',
    component: () => import('../views/Onboard.vue'),
    beforeEnter: authRouteGuard,
  },
  {
    path: '/trips',
    name: 'trips',
    component: () => import('../views/Trips.vue'),
    beforeEnter: authRouteGuard,
  },
  {
    path: '/trips/new',
    component: () => import('../views/NewTrip.vue'),
    beforeEnter: authRouteGuard,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(onboardingRouteGuard);

export default router;
