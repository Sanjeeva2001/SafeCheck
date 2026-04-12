<script setup>
defineProps({
  status: {
    type: String,
    required: true, // 'pass' | 'danger' | 'warn'
  },
  size: {
    type: String,
    default: 'md', // 'sm' | 'md'
  },
})
</script>

<template>
  <div
    class="rounded-full flex-shrink-0 flex items-center justify-center"
    :class="{
      'w-5 h-5': size === 'md',
      'w-4 h-4': size === 'sm',
      'bg-green-100': status === 'pass',
      'bg-red-100': status === 'danger',
      'bg-amber-100': status === 'warn',
    }"
  >
    <svg v-if="status === 'pass'" :class="size === 'md' ? 'w-3 h-3' : 'w-2.5 h-2.5'" class="text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
    </svg>
    <svg v-else-if="status === 'danger'" :class="size === 'md' ? 'w-3 h-3' : 'w-2.5 h-2.5'" class="text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
    </svg>
    <svg v-else :class="size === 'md' ? 'w-3 h-3' : 'w-2.5 h-2.5'" class="text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01" />
    </svg>
  </div>
</template>
