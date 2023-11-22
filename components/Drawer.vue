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
        <div class="max-w-xl w-full h-full  overflow-y-auto">
          <div class="flex flex-col gap-4 py-5 sm:p-6 ">
              <div class="flex items-center justify-between">
                <p class="text-sm font-bold tracking-widest text-gray-500 uppercase"></p>

                <button type="button" @click="closeDrawer"
                  class="p-1 -m-1transition-all duration-200 rounded-md text-gray-900 bg-gray-100">
                  <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <slot/>
            </div>

        </div>
      </div>
    </div>
  </div>
  <!-- end of DRAWER -->
</template>
<script setup lang="ts">

 const props = defineProps({
    drawerId: {
        type: String,
        required: true
    }})

    const closeDrawer = () => {
  const drawer = document.getElementById(props.drawerId);
  drawer?.click()
}

</script>