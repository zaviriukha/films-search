<script>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import env from '@/env.js'

export default {
  name: 'MovieDetail',
  setup() {
    const movie = ref({})
    const route = useRoute()

    onBeforeMount(() => {
      fetch(`http://www.omdbapi.com/?apikey=${env.apikey}&i=${route.params.id}&plot=full`)
        .then((respons) => respons.json())
        .then((data) => {
          movie.value = data
          // search.value = ''
          console.log(data)
        })
    })

    return {
      movie,
      route,
    }
  },
}
</script>

<template>
  <div class="movie-detail">
    <h2>{{ movie.Title }}</h2>
    <p>{{ movie.Year }}</p>
    <div>
      <img :src="movie.Poster" :alt="movie.Title" />
    </div>
  </div>
</template>
