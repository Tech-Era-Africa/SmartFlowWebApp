<template>
  <NuxtLoadingIndicator :height="5"></NuxtLoadingIndicator>
  <NuxtPage></NuxtPage>
</template>
<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - SmartFlow` : 'SmartFlow';
  },
  meta: [
    { hid: 'description', name: 'description', content: "Monitor your water consumption with ease." },
    // Add more meta tags as needed
    { hid: 'og:title', property: 'og:title', content: "Smart Flow | Dashboard" },
    { hid: 'og:description', property: 'og:description', content: "Monitor your water consumption and devices with ease." },
    { hid: 'og:image', property: 'og:image', content: '/logo.png' },
  ]
})
</script>