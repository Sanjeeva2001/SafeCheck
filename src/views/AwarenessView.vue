<script setup>
import {
  awarenessInsights,
  scamAwarenessCards,
  supportLinks,
} from '../data/scamAwarenessData.js'
</script>

<template>
  <section style="background: linear-gradient(135deg, var(--navy) 0%, #1d4ed8 100%);">
    <div class="px-8 sm:px-16 py-12 sm:py-16">
      <div class="text-center max-w-3xl mx-auto animate-fade-in-up">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 bg-white/15">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3l7 4v5c0 4.5-2.9 8.5-7 9.8-4.1-1.3-7-5.3-7-9.8V7l7-4z" />
          </svg>
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          Scam Awareness
        </h1>
        <p class="text-xl text-white leading-relaxed" style="opacity: 0.92;">
          Learn common scam warning signs before you click, pay, or share personal details.
        </p>
      </div>
    </div>
  </section>

  <section class="py-12 px-8 sm:px-16" style="background-color: var(--bg);">
    <div class="max-w-6xl mx-auto space-y-10">
      <div class="animate-fade-in-up">
        <h2 class="text-3xl font-bold text-slate-900 mb-3">Common scam types</h2>
        <p class="text-lg text-slate-600 leading-relaxed mb-6">
          These examples show how common scams work and what you can do to stay safer.
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <article
            v-for="card in scamAwarenessCards"
            :key="card.title"
            class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <h3 class="text-2xl font-bold text-slate-900 mb-5">{{ card.title }}</h3>

            <div class="space-y-5">
              <div>
                <p class="text-base font-semibold text-slate-500 uppercase tracking-wide mb-1">How it works</p>
                <p class="text-lg text-slate-700 leading-relaxed">{{ card.description }}</p>
              </div>

              <div class="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p class="text-base font-bold text-amber-900 uppercase tracking-wide mb-1">Warning sign</p>
                <p class="text-lg text-amber-900 leading-relaxed">{{ card.warningSign }}</p>
              </div>

              <div class="rounded-xl border border-green-200 bg-green-50 p-4">
                <p class="text-base font-bold text-green-900 uppercase tracking-wide mb-1">What to do</p>
                <p class="text-lg text-green-900 leading-relaxed">{{ card.safeAction }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="animate-fade-in-up">
        <h2 class="text-3xl font-bold text-slate-900 mb-6">Simple safety reminders</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <article
            v-for="insight in awarenessInsights"
            :key="insight.title"
            class="rounded-2xl border border-blue-100 p-6 shadow-sm"
            style="background-color: var(--navy-tint);"
          >
            <h3 class="text-2xl font-bold mb-3" style="color: var(--navy);">{{ insight.title }}</h3>
            <p class="text-lg text-slate-700 leading-relaxed">{{ insight.text }}</p>
          </article>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in-up">
        <h2 class="text-3xl font-bold text-slate-900 mb-3">Trusted Australian help and information</h2>
        <p class="text-lg text-slate-600 leading-relaxed mb-6">
          These Australian services can help you learn more or find support if you are worried about a scam.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            v-for="link in supportLinks"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-xl border border-slate-200 p-5 transition hover:border-blue-900 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            <p class="text-xl font-bold mb-2" style="color: var(--navy);">{{ link.label }}</p>
            <p class="text-lg text-slate-700 leading-relaxed">{{ link.description }}</p>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
