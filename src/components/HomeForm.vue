<script setup>
const emit = defineEmits(['navigate'])

const features = [
  {
    page: 'url-verifier',
    icon: 'link',
    color: 'green',
    title: 'URL Verifier',
    desc: 'Check if a website is safe before you visit it.',
    cta: 'Check a link',
  },
  {
    page: 'tnc-simplifier',
    icon: 'doc',
    color: 'purple',
    title: 'T&C Simplifier',
    desc: 'Understand Terms & Conditions in plain English.',
    cta: 'Simplify T&Cs',
  },
  {
    page: 'scam-quiz',
    icon: 'bulb',
    color: 'amber',
    title: 'Scam Quiz',
    desc: 'Test yourself with real-world scam scenarios.',
    cta: 'Take the quiz',
  },
]
</script>

<template>
  <section class="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-4">
    <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
      <svg class="w-10 h-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    </div>

    <h1 class="text-3xl font-bold text-gray-900 mb-3 text-center">Welcome to SafeCheck</h1>
    <p class="text-gray-500 text-sm text-center max-w-sm mb-10">
      A free tool to help you stay safe online - no sign-up required.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
      <button
        v-for="f in features"
        :key="f.page"
        @click="emit('navigate', f.page)"
        class="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-md hover:border-green-300 transition-all group"
      >
        <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          :class="{
            'bg-green-100': f.color === 'green',
            'bg-purple-100': f.color === 'purple',
            'bg-amber-100': f.color === 'amber',
          }">
          <svg v-if="f.icon === 'link'" class="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <svg v-else-if="f.icon === 'doc'" class="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        <p class="text-sm font-semibold text-gray-900 mb-1">{{ f.title }}</p>
        <p class="text-xs text-gray-500 leading-relaxed">{{ f.desc }}</p>

        <div class="mt-4 flex items-center gap-1 text-xs text-green-700 font-medium group-hover:gap-2 transition-all">
          {{ f.cta }}
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  </section>
</template>