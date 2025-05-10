import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import Add from '../views/Add.vue';
import StoreList from '../views/StoreList.vue';
import Roulette from '../views/Roulette.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: '/add', component: Add },
    { path: '/stores', component: StoreList},
    { path: '/roulette', component: Roulette },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
