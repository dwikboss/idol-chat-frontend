import { PageName } from '@/utils/_Constants';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ChatOverview from '../views/ChatOverview.vue';
import Chat from '../views/Chat.vue';

const routes = [
  {
    path: '/',
    name: PageName.CHATOVERVIEW,
    component: ChatOverview,
  },
  {
    path: '/chat/:idolName',
    name: PageName.CHAT,
    component: Chat,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
