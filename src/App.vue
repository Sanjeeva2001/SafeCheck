<script setup>
import BHeader from './components/BHeader.vue'
import BFooter from './components/BFooter.vue'
<<<<<<< HEAD

const route = useRoute()
const isHome = computed(() => route.meta.page === 'home')
=======
>>>>>>> 4457c1696649f9bf9c10db932e8139734323827d
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
    <BHeader />
    <main class="flex-1 flex flex-col">
      <RouterView />
    </main>
    <BFooter />
  </div>
</template>