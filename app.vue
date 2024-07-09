<template>
  <NuxtLoadingIndicator :height="5"></NuxtLoadingIndicator>
  <NuxtPage></NuxtPage>
</template>
<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - SmartFlow` : 'SmartFlow';
  }
})


</script>