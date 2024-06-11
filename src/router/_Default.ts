import { PageName } from '@/utils/_Constants';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ChatOverview from '../views/ChatOverview.vue';

const routes = [
  {
    path: '/',
    name: PageName.HOME,
    component: Home,
  },
  {
    path: '/ChatOverview',
    name: PageName.CHATOVERVIEW,
    component: ChatOverview,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
