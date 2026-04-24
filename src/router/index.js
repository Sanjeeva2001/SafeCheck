import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import UrlVerifierView from '../views/UrlVerifierView.vue'
import TncSimplifierView from '../views/TncSimplifierView.vue'
import ScamQuizView from '../views/ScamQuizView.vue'
import { DEFAULT_ITERATION, ITERATIONS, PAGE_PATHS } from './iteration'

const pageRoutes = [
  { key: 'home', component: HomeView, title: 'Home' },
  { key: 'url-verifier', component: UrlVerifierView, title: 'URL Verifier' },
  { key: 'tnc-simplifier', component: TncSimplifierView, title: 'T&C Simplifier' },
  { key: 'scam-quiz', component: ScamQuizView, title: 'Scam Quiz' },
]

const versionedRoutes = ITERATIONS.flatMap((iteration) =>
  pageRoutes.map(({ key, component, title }) => ({
    path: PAGE_PATHS[key] ? `/${iteration}/${PAGE_PATHS[key]}` : `/${iteration}`,
    name: `${iteration}-${key}`,
    component,
    meta: {
      title,
      page: key,
      iteration,
    },
  })),
)

const legacyRoutes = pageRoutes
  .filter(({ key }) => key !== 'home')
  .map(({ key }) => ({
    path: `/${PAGE_PATHS[key]}`,
    redirect: `/${DEFAULT_ITERATION}/${PAGE_PATHS[key]}`,
  }))

const routes = [{ path: '/', redirect: `/${DEFAULT_ITERATION}` }, ...legacyRoutes, ...versionedRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'SafeCheck'} | SafeCheck`
})

export default router