<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="w-full flex p-4 bg-slate-700 text-white shadow-md">
    <div class="container m-auto flex flex-row justify-between">
      <router-link to="/" class="text-xl font-bold">Search for Movies</router-link>

      <nav class="flex gap-4">
        <router-link
          to="/"
          active-class="text-blue-400 font-bold"
          class="font-bold hover:text-blue-400"
        >
          Films
        </router-link>
        <router-link
          to="/search"
          active-class="text-blue-400 font-bold"
          class="font-bold hover:text-blue-400"
        >
          Search
        </router-link>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style lang="scss">
* {
  font-family: 'Arial', sans-serif;
}
</style>
