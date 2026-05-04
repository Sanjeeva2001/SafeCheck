<script setup>
const props = defineProps({
  scamStats:     { type: Object,  default: null  },
  maxReports:    { type: Number,  default: 1     },
  withTopMargin: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up"
    :class="props.withTopMargin ? 'mt-4' : ''"
  >

    <p class="text-base font-semibold uppercase tracking-widest text-slate-400 mb-1">
      Real data from Australia
    </p>
    <h3 class="text-2xl font-bold text-slate-900 mb-3">
      Why checking links matters for people over 65
    </h3>
    <p class="text-lg text-slate-500 mb-6 leading-relaxed">
      These numbers come from real scam reports filed with Scamwatch and the
      National Anti-Scam Centre.
    </p>

    <div v-if="props.scamStats">

      <!-- Two headline numbers -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="rounded-xl p-5" style="background-color: var(--bg);">
          <p class="text-3xl font-bold text-red-700">
            ${{ (Number(props.scamStats.summary.total_lost) / 1_000_000).toFixed(1) }}M+
          </p>
          <p class="text-base text-slate-500 mt-1 leading-snug">
            lost by Australians 65+ to online scams
          </p>
        </div>
        <div class="rounded-xl p-5" style="background-color: var(--bg);">
          <p class="text-3xl font-bold" style="color: var(--navy);">
            {{ Number(props.scamStats.summary.total_reports).toLocaleString() }}
          </p>
          <p class="text-base text-slate-500 mt-1 leading-snug">
            online scam reports from seniors on record
          </p>
        </div>
      </div>

      <p class="text-base font-semibold uppercase tracking-widest text-slate-400 mb-4">
        Most common scams targeting seniors
      </p>

      <!-- Bar chart -->
      <div
        v-for="row in props.scamStats.topScamTypes"
        :key="row.scam_type"
        class="flex items-center gap-3 mb-3"
      >
        <span class="text-base text-slate-500 w-44 text-right shrink-0">{{ row.scam_type }}</span>
        <div class="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700"
            style="background-color: var(--navy);"
            :style="{ width: (Number(row.total_reports) / props.maxReports * 100) + '%' }"
          />
        </div>
        <span class="text-base text-slate-400 w-8 text-right shrink-0">{{ row.total_reports }}</span>
      </div>

      <p class="text-sm text-slate-300 mt-4">
        Source: Scamwatch &amp; NASC, 65+ age group, online contact method only
      </p>
    </div>

    <!-- Loading skeleton -->
    <div v-else class="space-y-3">
      <div v-for="i in 5" :key="i" class="flex gap-3 items-center">
        <div class="w-44 h-4 bg-slate-100 rounded animate-pulse shrink-0" />
        <div class="flex-1 h-4 bg-slate-100 rounded animate-pulse" />
      </div>
    </div>

  </div>
</template>
