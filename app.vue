<template>

  <NuxtLoadingIndicator :height="5"></NuxtLoadingIndicator>

  <Toaster />
  <NuxtPage></NuxtPage>
</template>
<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - SmartFlow` : 'SmartFlow';
  }
})

</script> 