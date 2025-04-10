<template>
  <div class="bg-white border rounded-lg">
    <div class="p-4 pb-0">
      <div class="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 class="text-sm font-medium">Money Saved</h3>
        <div class="h-4 w-4 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="flex flex-col items-center">
        <div class="relative w-40 h-40 mb-4">
          <!-- Circular Progress -->
          <svg class="w-full h-full" viewBox="0 0 100 100">
            <!-- Background Circle -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="8" />
            <!-- Progress Circle -->
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
              transform="rotate(-90 50 50)"
            />
            <!-- Text in Center -->
            <text x="50" y="45" text-anchor="middle" class="text-lg font-bold">{{ savingsPercentage }}%</text>
            <text x="50" y="60" text-anchor="middle" class="text-xs">Saved</text>
          </svg>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-800">GHC {{ moneySaved.toFixed(2) }}</p>
          <p class="text-sm text-gray-600">Saved this period</p>
          <p class="mt-2 text-xs text-gray-500">
            By conserving {{ waterSaved }} liters of water
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  moneySaved: {
    type: Number,
    required: true,
    default: 0
  },
  waterSaved: {
    type: Number,
    required: true,
    default: 0
  },
  savingsPercentage: {
    type: Number,
    required: true,
    default: 0
  }
});

// Calculate circle properties for SVG
const circumference = computed(() => 2 * Math.PI * 45);
const dashOffset = computed(() => circumference.value * (1 - props.savingsPercentage / 100));
</script>
