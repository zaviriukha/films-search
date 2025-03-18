<script>
import { ref } from 'vue'
import env from '@/env.js'

export default {
  setup() {
    const search = ref('')
    const movies = ref([])

    const SearchMovies = () => {
      if (search.value !== '') {
        // console.log(search.value);
        fetch(`http://www.omdbapi.com/?apikey=${env.apikey}&s=${search.value}`)
          .then((res) => res.json())
          .then((data) => {
            movies.value = data.Search
            search.value = ''
            console.log(movies.value)
          })
      }
    }

    return {
      search,
      movies,
      SearchMovies,
    }
  },
}
</script>

<template>
  <main>
    <div class="feature-card">
      <router-link to="/movie/tt3896198">
        <img
          src="https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg"
          alt="Guardians of the Galaxy Vol. 2"
          class="featured-image"
        />
        <div class="details">
          <h3>Guardians of the Galaxy Vol. 2</h3>
          <p>
            The Guardians struggle to keep together as a team while dealing with their personal
            family issues, notably Star-Lord's encounter with his father, the ambitious celestial
            being Ego.
          </p>
        </div>
      </router-link>
    </div>

    <form @submit.prevent="SearchMovies()" class="search-box">
      <input type="text" name="search" placeholder="Search..." v-model="search" />
      <input type="submit" value="Search" />
    </form>

    <div class="movies-list">
      <div class="movie" v-for="movie in movies" :key="movie.imdbID">
        <router-link :to="'/movie/' + movie.imdbID" class="movie-link">
          <div class="movie-image">
            <img :src="movie.Poster" :alt="movie.Title" />
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
