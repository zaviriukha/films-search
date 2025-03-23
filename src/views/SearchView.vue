<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import env from '@/env.js'

const selectedYear = ref('')
const selectedGenre = ref('')
const selectedAdult = ref(false)
const selectedType = ref('movie')
const sortByRating = ref('desc')

const movies = ref([])
const currentPage = ref(1)
const totalResults = ref(0)
const genres = ref([])
const isLoading = ref(false) // Флаг загрузки данных

const years = ref([])
const generateYears = () => {
  const currentYear = new Date().getFullYear()
  years.value = Array.from({ length: 51 }, (_, i) => currentYear - i)
}

const fetchGenres = async () => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${env.tmdbApiKey}&language=en-US`
  const res = await fetch(url)
  const data = await res.json()
  genres.value = data.genres || []
}

const fetchMovies = async (isLoadMore = false) => {
  if (isLoading.value) return // Если уже загружается, выходим
  isLoading.value = true

  const apiType = selectedType.value === 'tv' ? 'discover/tv' : 'discover/movie'

  let url = `https://api.themoviedb.org/3/${apiType}?api_key=${env.tmdbApiKey}&language=en-US&page=${currentPage.value}`

  if (selectedYear.value) url += `&primary_release_year=${selectedYear.value}`
  if (selectedGenre.value) url += `&with_genres=${selectedGenre.value}`
  if (selectedAdult.value) url += `&include_adult=true`
  url += `&sort_by=vote_average.${sortByRating.value}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.results) {
      movies.value = isLoadMore ? [...movies.value, ...data.results] : data.results
      totalResults.value = data.total_results || 0
      currentPage.value++ // Увеличиваем страницу для следующего запроса
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
  } finally {
    isLoading.value = false
  }
}

// Функция для подгрузки при прокрутке
const handleScroll = () => {
  if (isLoading.value || movies.value.length >= totalResults.value) return

  const scrollPosition = window.innerHeight + window.scrollY
  const pageHeight = document.documentElement.offsetHeight

  if (scrollPosition >= pageHeight - 100) {
    fetchMovies(true) // Загружаем следующую страницу
  }
}

watch(
  () => ({
    year: selectedYear.value,
    genre: selectedGenre.value,
    adult: selectedAdult.value,
    type: selectedType.value,
    rating: sortByRating.value,
  }),
  () => {
    currentPage.value = 1 // Сброс страницы при изменении фильтров
    fetchMovies()
  },
  { deep: true }
)

onMounted(() => {
  fetchGenres()
  generateYears()
  fetchMovies()
  window.addEventListener('scroll', handleScroll) // Следим за скроллом
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll) // Очищаем обработчик
})
</script>

<template>
  <main class="container m-auto p-4">
    <h1 class="text-3xl text-center text-white mb-6">Search Movies</h1>

    <div class="flex flex-wrap gap-4 mb-4">
      <!-- Выбор года -->
      <select v-model="selectedYear" class="p-2 border rounded text-white">
        <option value="">Year</option>
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>

      <!-- Выбор жанра -->
      <select v-model="selectedGenre" class="p-2 border rounded text-white">
        <option value="">Genre</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
      </select>

      <!-- Выбор типа контента -->
      <select v-model="selectedType" class="p-2 border rounded text-white">
        <option value="movie">Movie</option>
        <option value="tv">TV Show</option>
      </select>

      <!-- Сортировка по рейтингу -->
      <select v-model="sortByRating" class="p-2 border rounded text-white">
        <option value="desc">Rating: down</option>
        <option value="asc">Rating: up</option>
      </select>

      <label class="flex items-center gap-2 text-white">
        <input type="checkbox" v-model="selectedAdult" />
        Adult
      </label>
    </div>

    <div class="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
      <div class="movie bg-gray-800" v-for="movie in movies" :key="movie.id">
        <router-link :to="'/movie/' + movie.id">
          <img
            :src="
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://placehold.co/300x450'
            "
            :alt="movie.original_title"
            class="w-full h-96 object-cover"
          />
          <div class="text-white mt-2 p-3">
            <p class="text-xl uppercase mb-2 line-clamp-2">
              <b>{{ movie.title || movie.name }}</b>
            </p>
            <p class="capitalize">Release date: {{ movie.release_date || 'N/A' }}</p>
            <p class="capitalize">Rating: ⭐ {{ movie.vote_average || 'N/A' }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>
