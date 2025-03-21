<script>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import env from '@/env.js'

export default {
  name: 'MovieDetail',
  setup() {
    const movie = ref(null)
    const route = useRoute()
    const loading = ref(true)
    const error = ref(null)

    onBeforeMount(async () => {
      try {
        const type = route.path.includes('/tv/') ? 'tv' : 'movie'
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${route.params.id}?api_key=${env.tmdbApiKey}&language=en-US`,
        )
        if (!response.ok) throw new Error('Failed to fetch data')
        movie.value = await response.json()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
      console.log(movie.value)
    })

    return {
      movie,
      loading,
      error,
    }
  },
}
</script>

<template>
  <div class="lg:w-7xl container movie-detail p-4 text-white lg:m-auto">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="movie">
      <div class="flex gap-4 xl:flex-row flex-col">
        <img
          :src="
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://placehold.co/300x450'
          "
          :alt="movie.original_title"
          class="w-64 h-full rounded m-auto xl:m-0"
        />
        <div class="text-lg">
          <h2 class="text-3xl font-bold mb-4">{{ movie.original_title || movie.name }}</h2>
          <p class="mb-4 italic text-xl">{{ movie.tagline }}</p>

          <!-- Обертка для скролла -->
          <div class="max-w-full overflow-x-auto lg:overflow-visible">
            <table class="border-collapse text-lg min-w-[500px]">
              <tbody>
                <tr v-if="movie.genres && movie.genres.length" class="border-b border-gray-600">
                  <td class="w-1/4 pr-4 py-2 text-left font-bold align-top">Genres:</td>
                  <td class="py-2 text-left">
                    <span v-for="(genre, index) in movie.genres" :key="genre.id">
                      {{ genre.name }}<span v-if="index < movie.genres.length - 1">, </span>
                    </span>
                  </td>
                </tr>
                <tr class="border-b border-gray-600">
                  <td class="w-1/4 pr-4 py-2 text-left font-bold align-top">Rating:</td>
                  <td class="py-2 text-left">⭐ {{ movie.vote_average || 'N/A' }}</td>
                </tr>
                <tr class="border-b border-gray-600">
                  <td class="w-1/4 pr-4 py-2 text-left font-bold align-top">Release Date:</td>
                  <td class="py-2 text-left">{{ movie.release_date || 'N/A' }}</td>
                </tr>
                <tr v-if="movie.homepage" class="border-b border-gray-600">
                  <td class="w-1/4 pr-4 py-2 text-left font-bold align-top">Homepage:</td>
                  <td class="py-2 text-left">
                    <a :href="movie.homepage" target="_blank" class="text-blue-400 underline">{{
                      movie.homepage
                    }}</a>
                  </td>
                </tr>
                <tr class="border-b border-gray-600">
                  <td class="w-1/4 pr-4 py-2 text-left font-bold align-top">Original Language:</td>
                  <td class="py-2 text-left">{{ movie.original_language }}</td>
                </tr>
                <tr
                  v-if="movie.origin_country && movie.origin_country.length"
                  class="border-b border-gray-600"
                >
                  <td class="w-1/4 pr-4 py-2 text-left font-bold align-top">Origin Country:</td>
                  <td class="py-2 text-left">{{ movie.origin_country.join(', ') }}</td>
                </tr>
                <tr v-if="movie.production_companies && movie.production_companies.length">
                  <td class="w-1/4 pr-4 py-2 text-left font-bold align-top">
                    Production Companies:
                  </td>
                  <td class="py-2 text-left">
                    {{ movie.production_companies.map((companie) => companie.name).join(', ') }}.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="mt-2">{{ movie.overview || 'No description available.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
