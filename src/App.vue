<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
    <router-link to="/" class="text-xl font-bold">Search for Movies</router-link>

    <nav class="flex gap-4">
      <router-link to="/" class="hover:text-blue-400">Films</router-link>
      <router-link to="/search" class="hover:text-blue-400">Search</router-link>
    </nav>
  </header>

  <RouterView />
</template>

<style lang="scss">
* {
  font-family: 'Arial', sans-serif;

  &::selection {
    background-color: #42b883;
    opacity: 0.5;
  }
}

body {
  background-color: #35495e;
}

a {
  text-decoration: none;
  color: white;
}

p {
  word-break: break-word;
  overflow-wrap: break-word;
}

header {
  background-color: #3c3d4e;
}
</style>
