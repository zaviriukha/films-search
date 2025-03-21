<script>
import { ref, onMounted } from 'vue'
import env from '@/env.js'

export default {
  setup() {
    const activeTab = ref('popular')

    // Данные для "Популярных"
    const popularMovies = ref([])
    const popularPage = ref(1)
    const popularTotalResults = ref(0)

    // Загрузка популярных фильмов и сериалов (TMDb API)
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

          console.log(popularMovies.value) // Проверяем, теперь ли есть `media_type`
        })
        .catch((error) =>
          console.error('Ошибка при загрузке популярных фильмов и сериалов:', error),
        )
    }

    const loadMorePopular = () => {
      if (popularMovies.value.length < popularTotalResults.value) {
        popularPage.value++
        fetchPopularMovies(true)
      }
    }

    // Закомментированные функции поиска
    /*
    const search = ref('')
    const movies = ref([])
    const selectedYear = ref('')
    const selectedType = ref('')
    const currentPage = ref(1)
    const totalResults = ref(0)
    const sortByRating = ref(false)

    const fetchMovies = async (isLoadMore = false) => {
      if (!isLoadMore) {
        currentPage.value = 1
        movies.value = []
      }

      let url = `https://api.themoviedb.org/3/search/movie?api_key=${env.tmdbApiKey}&query=${search.value || 'movie'}&language=uk-UA&page=${currentPage.value}`
      if (selectedYear.value) url += `&year=${selectedYear.value}`
      if (selectedType.value) url += `&type=${selectedType.value}`

      const res = await fetch(url)
      const data = await res.json()

      if (data.results) {
        movies.value = isLoadMore ? [...movies.value, ...data.results] : data.results
        totalResults.value = data.total_results || 0
      }
    }

    const SearchMovies = () => {
      if (search.value.trim() !== '') {
        fetchMovies(false)
      }
    }

    const loadMore = async () => {
      if (movies.value.length < totalResults.value) {
        currentPage.value++
        await fetchMovies(true)
      }
    }
    */

    onMounted(() => fetchPopularMovies())

    return {
      activeTab,
      popularMovies,
      popularTotalResults,
      loadMorePopular,
      // Закомментированные функции поиска
      /*
      search,
      movies,
      selectedYear,
      selectedType,
      totalResults,
      SearchMovies,
      loadMore
      */
    }
  },
}
</script>

<template>
  <main class="container m-auto p-4">
    <div class="mt-10">
      <!-- Вкладки -->
      <div class="tabs flex gap-4 mb-6 flex-row justify-center">
        <button
          class="text-3xl capitalize cursor-pointer"
          @click="activeTab = 'popular'"
          :class="{ 'text-blue-500 border-b-2 border-blue-500': activeTab === 'popular' }"
        >
          List of the Films
        </button>
        <!-- <button class="text-3xl uppercase cursor-pointer" @click="activeTab = 'search'"
                :class="{ 'text-blue-500 border-b-2 border-blue-500': activeTab === 'search' }">
          Пошук
        </button> -->
      </div>

      <!-- Вкладка "Популярные" -->
      <div v-if="activeTab === 'popular'">
        <div class="grid md:grid-cols-2 gap-4">
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
                  <p class="capitalize mb-5 hidden xl:flex">Release date - {{ movie.release_date || 'N/A' }}</p>
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
          class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Завантажити більше
        </button>
      </div>

      <!-- Вкладка "Пошук" (закомментирована) -->
      <!--
      <div v-if="activeTab === 'search'">
        <form @submit.prevent="SearchMovies()" class="search-box mb-4 flex gap-2">
          <input type="text" placeholder="Пошук..." v-model="search" class="p-2 rounded border w-full" />
          <input type="submit" value="Пошук" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer" />
        </form>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="movie bg-gray-800 p-2 rounded-lg" v-for="movie in movies" :key="movie.id">
            <router-link :to="'/movie/' + movie.id">
              <img :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/300x450'"
                   class="w-full h-64 object-cover rounded-lg" />
              <p class="text-white mt-2">{{ movie.title || movie.name }} ({{ movie.release_date ? movie.release_date.slice(0, 4) : 'N/A' }})</p>
            </router-link>
          </div>
        </div>
        <button v-if="movies.length < totalResults" @click="loadMore"
                class="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Завантажити більше
        </button>
      </div>
      -->
    </div>
  </main>
</template>
