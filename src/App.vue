<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <router-link to="/">
      <h1><strong>Search for Movies</strong></h1>
    </router-link>
  </header>

  <RouterView />
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira Sans', sans-serif;

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
}

header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: #3c3d4e;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

  h1 {
    color: white;
  }
}
</style>
