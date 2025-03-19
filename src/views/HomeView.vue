<script>
import { ref, onMounted, computed } from 'vue'
import env from '@/env.js'

export default {
  setup() {
    const search = ref('')
    const movies = ref([])

    // Фильтры
    const selectedYear = ref('')
    const selectedType = ref('')

    // Список доступных значений для фильтрации
    const years = computed(() => {
      const currentYear = new Date().getFullYear()
      return Array.from({ length: 25 }, (_, i) => currentYear - i) // Последние 25 лет
    })
    const types = ['movie', 'series']

    const fetchMovies = () => {
      let url = `http://www.omdbapi.com/?apikey=${env.apikey}&s=${search.value || 'movie'}`

      if (selectedYear.value) url += `&y=${selectedYear.value}`
      if (selectedType.value) url += `&type=${selectedType.value}`

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          movies.value = data.Search || []
        })
        .catch((error) => console.error('Error fetching movies:', error))
    }

    const SearchMovies = () => {
      if (search.value.trim() !== '') {
        fetchMovies()
        search.value = ''
      }
    }

    onMounted(fetchMovies)

    return {
      search,
      movies,
      selectedYear,
      selectedType,
      years,
      types,
      SearchMovies,
      fetchMovies
    }
  },
}
</script>

<template>
  <main>
    <!-- Форма поиска -->
    <form @submit.prevent="SearchMovies()" class="search-box">
      <input type="text" placeholder="Search..." v-model="search" />
      <input type="submit" value="Search" />
    </form>

    <!-- Фильтры -->
    <div class="filters">
      <select v-model="selectedYear" @change="fetchMovies">
        <option value="">All Years</option>
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>

      <select v-model="selectedType" @change="fetchMovies">
        <option value="">All Types</option>
        <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <!-- Список фильмов -->
    <div class="movies-list">
      <div class="movie" v-for="movie in movies" :key="movie.imdbID">
        <router-link :to="'/movie/' + movie.imdbID" class="movie-link">
          <div class="movie-image">
            <img :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'"
                 :alt="movie.Title" />
            <div class="type">{{ movie.Type }}</div>
          </div>
          <div class="movie-details">
            <p class="year">{{ movie.Year }}</p>
            <h3>{{ movie.Title }}</h3>
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>


<style lang="scss">
main {
  .feature-card {
    position: relative;

    .featured-image {
      display: block;
      height: 300px;
      width: 100%;
      object-fit: cover;
      position: relative;
      z-index: 0;
    }
  }

  .details {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: pink;
    padding: 16px;
    z-index: 1;
    color: black;
    opacity: 0.7;

    h3 {
      font-size: 24px;
      margin-bottom: 10px;
      text-align: center;
    }
  }

  .search-box {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 16px;

    input {
      display: block;
      appearance: none;
      border: none;
      outline: none;
      background-color: transparent;

      &[type='text'] {
        width: 100%;
        color: white;
        background-color: brown;
        padding: 10px 16px;
        margin-bottom: 16px;
        font-size: 18px;

        &::placeholder {
          color: blue;
        }

        &:focus {
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        }
      }

      &[type='submit'] {
        width: 100%;
        max-width: 300px;
        background-color: red;
        color: white;
        font-size: 18px;
        padding: 14px;
        text-transform: uppercase;

        &:active {
          background-color: crimson;
        }
      }
    }
  }

  .movies-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 8px;

    .movie {
      max-width: 50%;
      flex: 1 1 50%;
      padding: 16px 8px;

      .movie-link {
        display: flex;
        flex-direction: column;
        height: 100%;

        .movie-image {
          position: relative;
          display: block;

          img {
            display: block;
            width: 100%;
            height: 275px;
            object-fit: cover;
          }

          .type {
            position: absolute;
            padding: 8px 16px;
            background-color: aquamarine;
            color: white;
            bottom: 16px;
            left: 0;
            text-transform: capitalize;
          }
        }

        .movie-details {
          background-color: gray;
          padding: 16px 8px;
          flex: 1 1 100%;
          border-radius: 0 0 8px 8px;

          .year {
            color: #aaaaaa;
            font-size: 14px;
          }

          h3 {
            color: white;
            font-weight: 600;
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
