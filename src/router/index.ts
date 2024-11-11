import { createRouter, createWebHistory } from 'vue-router'
export const routes = [
  {
    path: '/',
    name: 'Restaurantes',
    component: () => import('../views/List/ListView.vue'),
  },
  {
    path: '/guides',
    name: 'Guias',
    component: () => import('../views/Guides/Guides.vue'),
  },
  {
    path: '/search',
    name: 'Busca',
    component: () => import('../views/Search/SearchView.vue'),
  },
  {
    path: '/nearby',
    name: 'Por perto',
    component: () => import('../views/ByLocation/ByLocationView.vue'),
  },
  {
    path: '/about',
    name: 'Sobre',
    component: () => import('../views/About/AboutView.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
