<script setup>
import { ref, onMounted } from 'vue'
import env from '@/env.js'

const popularMovies = ref([])
const popularPage = ref(1)
const popularTotalResults = ref(0)

const fetchPopularMovies = (isLoadMore = false) => {
  if (!isLoadMore) {
    popularPage.value = 1
    popularMovies.value = []
  }

  const moviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${env.tmdbApiKey}&page=${popularPage.value}`
  const seriesUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${env.tmdbApiKey}&page=${popularPage.value}`

  Promise.all([
    fetch(moviesUrl).then((res) => res.json()),
    fetch(seriesUrl).then((res) => res.json()),
  ])
    .then(([moviesData, seriesData]) => {
      const movies = moviesData.results.map((m) => ({ ...m, media_type: 'movie' })) || []
      const series = seriesData.results.map((s) => ({ ...s, media_type: 'tv' })) || []

      popularMovies.value.push(...movies, ...series)
      popularTotalResults.value = (moviesData.total_results || 0) + (seriesData.total_results || 0)
    })
    .catch((error) => console.error('Ошибка при загрузке популярных фильмов:', error))
}

const loadMorePopular = () => {
  if (popularMovies.value.length < popularTotalResults.value) {
    popularPage.value++
    fetchPopularMovies(true)
  }
}

onMounted(fetchPopularMovies)
</script>

<template>
  <main class="container m-auto p-4">
    <h1 class="text-3xl text-center text-white mb-6">Popular Films</h1>

    <div class="grid md:grid-cols-2 gap-4 mb-5">
      <div class="movie bg-gray-800" v-for="movie in popularMovies" :key="movie.id">
        <router-link :to="`/${movie.media_type}/${movie.id}`">
          <div class="flex md:flex-row flex-col">
            <img
              :src="
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://placehold.co/300x450'
              "
              class="md:w-1/2 w-64 md:m-0 pt-5 md:pt-0 m-auto h-full object-cover"
            />
            <div class="md:w-1/2 w-full text-left p-5 text-white relative">
              <p class="mt-2 mb-2 text-xl uppercase line-clamp-3">
                <b>{{ movie.original_title }}</b>
              </p>
              <p class="capitalize">Rating: ⭐ {{ movie.vote_average || 'N/A' }}</p>
              <p class="capitalize mb-5 hidden xl:flex">
                Release date: {{ movie.release_date || 'N/A' }}
              </p>
              <p class="xl:line-clamp-6 line-clamp-3">{{ movie.overview }}</p>
              <div
                class="capitalize absolute right-0 bottom-0 p-2 text-white"
                :class="movie.media_type === 'tv' ? 'bg-emerald-700' : 'bg-rose-700'"
              >
                {{ movie.media_type === 'tv' ? 'Series' : 'Movie' }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <button
      v-if="popularMovies.length < popularTotalResults"
      @click="loadMorePopular"
      class="bg-rose-700 text-white px-4 py-2 rounded mt-4"
    >
      Load More
    </button>
  </main>
</template>
