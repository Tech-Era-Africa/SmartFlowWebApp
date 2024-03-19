<template>
  <section class="w-screen h-screen relative overflow-hidden m-0 p-0 flex ">
    <SideBar></SideBar>
    <section class="absolute z-40 md:hidden">
      <BottomNav></BottomNav>
    </section>
    <section class="flex-1 overflow-y-auto relative bg-blue-100 bg-opacity-10">
      <slot></slot>
    </section>
  </section>
</template>
<script setup lang="ts">
useHead({
  meta: [
    { hid: 'description', name: 'description', content: "Monitor your water consumption with ease." },
    // Add more meta tags as needed
    { hid: 'og:title', property: 'og:title', content: "Smart Flow | Dashboard" },
    { hid: 'og:description', property: 'og:description', content: "Monitor your water consumption and devices with ease." },
    { hid: 'og:image', property: 'og:image', content: '/logo.png' },
  ]
})
</script>
