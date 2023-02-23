import { createRouter, createWebHistory } from 'vue-router'
import { pages as pagesVitePlay } from '@viteplay/vue/client'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dev/',
      children: pagesVitePlay,
    },
    {
      path: '/:all(.*)*',
      component: () => import('./404.vue'),
    },
  ],
})
