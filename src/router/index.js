import { createRouter, createWebHistory } from 'vue-router'
import FilmsView from '../views/FilmsView.vue'
import SearchView from '../views/SearchView.vue'
import MovieDetail from '../views/MovieDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'films',
      component: FilmsView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/movie/:id',
      name: 'Movie Detail',
      component: MovieDetail,
    },
    {
      path: '/tv/:id',
      name: 'TV Detail',
      component: MovieDetail,
    },
  ],
})

export default router
