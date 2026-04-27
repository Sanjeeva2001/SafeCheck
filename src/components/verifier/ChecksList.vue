<script setup>
import StatusIcon from '../StatusIcon.vue'

const props = defineProps({
  checks: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6 animate-slide-in-right">
    <p class="text-base font-semibold text-slate-400 uppercase tracking-wide mb-5">What we checked</p>
    <div class="space-y-5">
      <div v-for="check in props.checks" :key="check.label" class="flex items-start gap-4">
        <StatusIcon :status="check.status" class="mt-1 flex-shrink-0" />
        <div>
          <p class="text-xl font-semibold text-slate-800">{{ check.label }}</p>
          <p class="text-lg text-slate-500 mt-0.5 leading-relaxed">{{ check.detail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
