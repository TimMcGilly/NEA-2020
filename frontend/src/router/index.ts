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
    component: () => import('../views/TripsDashboard.vue'),
    beforeEnter: authRouteGuard,
  },
  {
    path: '/trips/new',
    component: () => import('../views/NewTrip.vue'),
    beforeEnter: authRouteGuard,
  },
  {
    path: '/trips/:id',
    component: () => import('../views/TripRoot.vue'),
    beforeEnter: authRouteGuard,
    children: [
      {
        path: '',
        redirect: (to) => `/trips/${to.params.id}/findindividuals`
        ,
      },
      {
        path: 'findindividuals',
        component: () => import('../views/TripNestedViews/FindIndividuals.vue'),
        beforeEnter: authRouteGuard,
      },
      {
        path: 'messaging',
        component: () => import('../views/TripNestedViews/Messaging.vue'),
        beforeEnter: authRouteGuard,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(onboardingRouteGuard);

export default router;
