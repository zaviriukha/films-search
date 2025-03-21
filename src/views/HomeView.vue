<script>
import { ref, watch, onMounted } from 'vue'
import env from '@/env.js'

export default {
  setup() {
    const activeTab = ref('popular')

    // Popular
    const popularMovies = ref([])
    const popularPage = ref(1)
    const popularTotalResults = ref(0)

    // Filters
    const selectedYear = ref('')
    const selectedGenre = ref('')
    const selectedAdult = ref(false)
    const selectedType = ref('')
    const sortByRating = ref('desc')

    const movies = ref([])
    const currentPage = ref(1)
    const totalResults = ref(0)
    const genres = ref([])

    // Upload Popular
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
          popularTotalResults.value =
            (moviesData.total_results || 0) + (seriesData.total_results || 0)
        })
        .catch((error) => console.error('Ошибка при загрузке популярных фильмов:', error))
    }

    const loadMorePopular = () => {
      if (popularMovies.value.length < popularTotalResults.value) {
        popularPage.value++
        fetchPopularMovies(true)
      }
    }

    // Upload genres
    const fetchGenres = async () => {
      const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${env.tmdbApiKey}&language=en-US`
      const res = await fetch(url)
      const data = await res.json()
      genres.value = data.genres || []
    }

    // Search filters
    const fetchMovies = async (isLoadMore = false) => {
      if (!isLoadMore) {
        currentPage.value = 1
        movies.value = []
      }

      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${env.tmdbApiKey}&language=en-US&page=${currentPage.value}`

      if (selectedYear.value) url += `&primary_release_year=${selectedYear.value}`
      if (selectedGenre.value) url += `&with_genres=${selectedGenre.value}`
      if (selectedAdult.value) url += `&include_adult=true`
      if (selectedType.value) url += `&with_keywords=${selectedType.value}`
      url += `&sort_by=vote_average.${sortByRating.value}`

      const res = await fetch(url)
      const data = await res.json()

      if (data.results) {
        movies.value = isLoadMore ? [...movies.value, ...data.results] : data.results
        totalResults.value = data.total_results || 0
      }
    }

    const loadMore = async () => {
      if (movies.value.length < totalResults.value) {
        currentPage.value++
        await fetchMovies(true)
      }
    }

    watch([selectedYear, selectedGenre, selectedAdult, selectedType, sortByRating], () => {
      fetchMovies(false)
    })

    onMounted(() => {
      fetchPopularMovies()
      fetchGenres()
    })

    return {
      activeTab,
      popularMovies,
      popularTotalResults,
      loadMorePopular,
      movies,
      totalResults,
      loadMore,
      selectedYear,
      selectedGenre,
      selectedAdult,
      selectedType,
      sortByRating,
      genres,
    }
  },
}
</script>

<template>
  <main class="container m-auto p-4">
    <div class="mt-10">
      <!-- Tabs -->
      <div class="tabs flex gap-4 mb-6 flex-row justify-center">
        <button
          class="text-3xl capitalize cursor-pointer"
          @click="activeTab = 'popular'"
          :class="{ 'text-blue-500 border-b-2 border-blue-500': activeTab === 'popular' }"
        >
          Films
        </button>
        <button
          class="text-3xl capitalize cursor-pointer"
          @click="activeTab = 'search'"
          :class="{ 'text-blue-500 border-b-2 border-blue-500': activeTab === 'search' }"
        >
          Search
        </button>
      </div>

      <!-- Popular -->
      <div v-if="activeTab === 'popular'">
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
                  :alt="movie.original_title"
                  class="md:w-1/2 w-64 md:m-0 pt-5 md:pt-0 m-auto h-full object-cover"
                />
                <div class="md:w-1/2 w-full text-left p-5 text-white relative">
                  <p class="mt-2 mb-2 text-xl uppercase line-clamp-3">
                    <b>{{ movie.original_title }}</b>
                  </p>
                  <p class="capitalize">Rating: ⭐ {{ movie.vote_average || 'N/A' }}</p>
                  <p class="capitalize mb-5 hidden xl:flex">
                    Release date - {{ movie.release_date || 'N/A' }}
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
      </div>

      <!-- Search -->
      <div v-if="activeTab === 'search'">
        <div class="flex flex-wrap gap-4 mb-4">
          <input
            v-model="selectedYear"
            type="number"
            min="1900"
            max="2025"
            placeholder="Год"
            class="p-2 border rounded"
          />

          <select v-model="selectedGenre" class="p-2 border rounded">
            <option value="">Ganre</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre.id">
              {{ genre.name }}
            </option>
          </select>

          <select v-model="selectedType" class="p-2 border rounded">
            <option value="">Type</option>
            <option value="movie">Movie</option>
            <option value="tv">TV</option>
          </select>

          <select v-model="sortByRating" class="p-2 border rounded">
            <option value="desc">Rating: down</option>
            <option value="asc">Rating: up</option>
          </select>

          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="selectedAdult" />
            Adult
          </label>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="movie bg-gray-800 p-2 rounded-lg" v-for="movie in movies" :key="movie.id">
            <router-link :to="'/movie/' + movie.id">
              <img
                :src="
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://placehold.co/300x450'
                "
                class="w-full h-64 object-cover rounded-lg"
              />
              <p class="text-white mt-2">
                {{ movie.title }} ({{
                  movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'
                }})
              </p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
