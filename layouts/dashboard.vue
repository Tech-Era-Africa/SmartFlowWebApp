<template>
  <div class="h-[2rem] bg-orange-50 flex items-center justify-center" v-if="false">
    <p class="text-xs text-black text-muted-foreground">🚧 Scheduled Maintenance: Some features may be temporarily unavailable. Thank you for your patience! 🚧</p>
  </div>
  <section class="w-screen h-screen relative overflow-hidden m-0 p-0 flex">
    <SideBar></SideBar>
    <section class="absolute z-40 md:hidden">
      <BottomNav></BottomNav>
    </section>
    <section class="flex-1 overflow-y-auto relative bg-blue-100 bg-opacity-10">
      <div class="md:hidden fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-100 z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl text-center w-11/12">
          <h2 class="text-2xl font-bold mb-4">Best Viewed on PC</h2>
          <p class="mb-4">For the best experience, we recommend using a desktop or laptop computer.</p>
          <p class="text-sm text-gray-600">Mobile optimization is in progress.</p>
        </div>
      </div>
      <slot></slot>
    </section>

    <!-- SmartAI Widget -->
    <SmartAIWidget />
  </section>
  
</template>
