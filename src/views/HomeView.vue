<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HomeForm from '../components/HomeForm.vue'
import { buildIterationPath, getIterationFromPath, PAGE_PATHS } from '../router/iteration'

const route = useRoute()
const router = useRouter()
const iteration = computed(() => getIterationFromPath(route.path))

function go(page) {
  const safePage = Object.prototype.hasOwnProperty.call(PAGE_PATHS, page) ? page : 'home'
  router.push(buildIterationPath(iteration.value, safePage))
}
</script>

<template>
  <HomeForm @navigate="go" />
</template>