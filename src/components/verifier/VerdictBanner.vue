<script setup>
const props = defineProps({
  result:       { type: Object, required: true },
  vc:           { type: Object, required: true },
  verdictLabel: { type: String, required: true },
})

// Bold colour schemes keyed by verdict — red, amber, green only for risk output
const boldTheme = {
  safe:    { bg: '#f0fdf4', border: '#16a34a', icon: '#16a34a', iconBg: '#dcfce7', text: '#14532d', badge: '#16a34a' },
  warning: { bg: '#fffbeb', border: '#d97706', icon: '#d97706', iconBg: '#fef3c7', text: '#78350f', badge: '#d97706' },
  unsafe:  { bg: '#fef2f2', border: '#dc2626', icon: '#dc2626', iconBg: '#fee2e2', text: '#7f1d1d', badge: '#dc2626' },
}

const theme = props.result?.verdict ? boldTheme[props.result.verdict] : boldTheme.safe
</script>

<template>
  <!-- Full-width verdict — designed to be the FIRST thing eyes land on after submitting -->
  <div
    class="rounded-2xl border-4 p-6 animate-slide-in-right"
    :style="{
      background: theme.bg,
      borderColor: theme.border,
    }"
  >

    <!-- Top row: icon + verdict label pill -->
    <div class="flex items-center justify-between mb-4">
      <!-- Large icon -->
      <div
        class="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
        :style="{ background: theme.iconBg }"
      >
        <svg class="w-9 h-9" :style="{ color: theme.icon }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="props.result.verdict === 'safe'"
            stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          <path v-else-if="props.result.verdict === 'unsafe'"
            stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
          <path v-else
            stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01" />
        </svg>
      </div>

      <!-- Verdict badge — large and clear -->
      <span
        class="text-lg font-bold px-5 py-2 rounded-full text-white uppercase tracking-wide"
        :style="{ background: theme.badge }"
      >
        {{ props.verdictLabel }}
      </span>
    </div>

    <!-- Headline — this is the primary message, must be unmissable -->
    <p class="text-3xl font-bold leading-tight mb-2" :style="{ color: theme.text }">
      <span v-if="props.result.verdict === 'safe'">This website looks safe to visit</span>
      <span v-else-if="props.result.verdict === 'unsafe'">Do not visit this website</span>
      <span v-else>Proceed with caution</span>
    </p>

    <p class="text-xl mb-4" :style="{ color: theme.text, opacity: 0.85 }">
      Website checked: <strong>{{ props.result.hostname }}</strong>
    </p>

    <!-- Risk factors — shown prominently if any exist -->
    <div v-if="props.result.riskFactors.length" class="mt-3 rounded-xl p-4" :style="{ background: 'rgba(0,0,0,0.04)' }">
      <p class="text-base font-semibold mb-2" :style="{ color: theme.text }">Warning signs found:</p>
      <ul class="space-y-1.5">
        <li
          v-for="rf in props.result.riskFactors"
          :key="rf"
          class="flex items-start gap-2 text-lg"
          :style="{ color: theme.text }"
        >
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {{ rf }}
        </li>
      </ul>
    </div>

    <!-- Safe advice -->
    <div v-if="props.result.verdict === 'safe'" class="mt-4 text-lg" :style="{ color: theme.text, opacity: 0.8 }">
      Our checks found no known threats. See the details below for the full picture.
    </div>

  </div>
</template>
