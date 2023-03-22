import { createRouter, createWebHistory } from 'vue-router'
import Home from "../components/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/user/:username',
      name: 'UserByUsername',
      component: () => import('../components/User.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../components/NotFound.vue')
    }
  ]
})

export default router
