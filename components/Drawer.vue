<template>
      <!-- DRAWER -->
  <div class="absolute z-50 w-screen h-screen overflow-hidden top-0 left-0 pointer-events-none">
    <div class="drawer drawer-end pointer-events-auto">
      <input :id="drawerId" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <label :for="drawerId" class="drawer-button hidden" :ref="drawerId"></label>
      </div>
      <div class="drawer-side drawer-open">
        <label :for="drawerId" aria-label="close sidebar" class="drawer-overlay"></label>
        <div class="max-w-lg w-full h-full bg-white overflow-y-auto">
          <div class=" bg-white divide-y divide-gray-200">
            <div class="px-4 py-5 sm:p-6 lg:p-8">
              <div class="flex items-center justify-between">
                <p class="text-sm font-bold tracking-widest text-gray-500 uppercase">Child</p>

                <button type="button"
                  class="p-1 -m-1 text-gray-400 transition-all duration-200 rounded-md hover:text-gray-900 hover:bg-gray-100">
                  <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

    



          </div>

        </div>
      </div>
    </div>
  </div>
  <!-- end of DRAWER -->
</template>
<script setup lang="ts">

 defineProps({
    drawerId: {
        type: String,
        required: true
    }})

</script>