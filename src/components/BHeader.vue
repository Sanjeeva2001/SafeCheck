<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const logoSrc = `${import.meta.env.BASE_URL}logo.png`

// Each tool link carries its brand colour — Home stays neutral slate
const links = [
  { label: 'Home',           to: '/',               color: 'slate'  },
  { label: 'URL Verifier',   to: '/url-verifier',   color: 'green'  },
  { label: 'T&C Simplifier', to: '/tnc-simplifier', color: 'purple' },
  { label: 'Scam Quiz',      to: '/scam-quiz',      color: 'amber'  },
]

</script>

<template>
  <!-- Sticky header — stays at the top while you scroll -->
  <header class="sticky top-0 z-50 shadow-sm">

    <!-- Main nav bar -->
    <nav class="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-24 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <!-- Logo + site name -->
        <RouterLink to="/" class="flex items-center gap-4" @click="menuOpen = false">
          <img :src="logoSrc" alt="SafeCheck logo" class="h-14 w-14 rounded-2xl object-contain" />
          <span class="text-2xl font-bold tracking-wide text-slate-900">SafeCheck</span>
        </RouterLink>

        <!-- Desktop nav links — each tool uses its own brand colour when active -->
        <div class="hidden items-center gap-2 md:flex">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-6 py-3 text-xl font-medium transition"
            :class="{
              'text-slate-600  hover:bg-slate-100  hover:text-slate-900':  link.color === 'slate',
              'text-green-700  hover:bg-green-50   hover:text-green-900':  link.color === 'green',
              'text-purple-700 hover:bg-purple-50  hover:text-purple-900': link.color === 'purple',
              'text-amber-600  hover:bg-amber-50   hover:text-amber-900':  link.color === 'amber',
            }"
            :active-class="
              link.color === 'green'  ? 'bg-green-700  text-white hover:bg-green-700  hover:text-white' :
              link.color === 'purple' ? 'bg-purple-700 text-white hover:bg-purple-700 hover:text-white' :
              link.color === 'amber'  ? 'bg-amber-500  text-white hover:bg-amber-500  hover:text-white' :
                                        'bg-slate-900  text-white hover:bg-slate-900  hover:text-white'
            "
            :exact-active-class="
              link.color === 'green'  ? 'bg-green-700  text-white hover:bg-green-700  hover:text-white' :
              link.color === 'purple' ? 'bg-purple-700 text-white hover:bg-purple-700 hover:text-white' :
              link.color === 'amber'  ? 'bg-amber-500  text-white hover:bg-amber-500  hover:text-white' :
                                        'bg-slate-900  text-white hover:bg-slate-900  hover:text-white'
            "
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- Hamburger — only shows on small screens -->
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-100 md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
          @click="menuOpen = !menuOpen"
        >
          <svg v-if="!menuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile dropdown menu -->
      <div v-if="menuOpen" id="mobile-nav" class="border-t border-slate-200 bg-white md:hidden">
        <div class="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div class="grid gap-2">
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="rounded-xl px-4 py-3 text-xl font-medium transition"
              :class="{
                'text-slate-700  hover:bg-slate-100':  link.color === 'slate',
                'text-green-700  hover:bg-green-50':   link.color === 'green',
                'text-purple-700 hover:bg-purple-50':  link.color === 'purple',
                'text-amber-600  hover:bg-amber-50':   link.color === 'amber',
              }"
              :active-class="
                link.color === 'green'  ? 'bg-green-50  text-green-900' :
                link.color === 'purple' ? 'bg-purple-50 text-purple-900' :
                link.color === 'amber'  ? 'bg-amber-50  text-amber-900' :
                                          'bg-slate-100 text-slate-900'
              "
              :exact-active-class="
                link.color === 'green'  ? 'bg-green-50  text-green-900' :
                link.color === 'purple' ? 'bg-purple-50 text-purple-900' :
                link.color === 'amber'  ? 'bg-amber-50  text-amber-900' :
                                          'bg-slate-100 text-slate-900'
              "
              @click="menuOpen = false"
            >
              {{ link.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

  </header>
</template>
