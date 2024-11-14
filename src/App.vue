<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => {
  // Установка высоты viewport для мобильных браузеров
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  setViewportHeight()
  window.addEventListener('resize', setViewportHeight)
})
</script>

<template>
  <v-app class="fill-height">
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style src="./app/styles/app.css"></style>
