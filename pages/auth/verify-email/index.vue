<template>
    <Suspense>
      <template #default>
        <div> <!-- wrap with ONE div or section -->
          <p>This is the default</p>
          <p>{{ posts }}</p>
          <p>{{ status }}</p>
        </div>
      </template>
  
      <template #fallback>
        <p>This is the fallback</p>
      </template>
    </Suspense>
  </template>
  
  <script setup lang="ts">
  const { data: posts, status } = await useAsyncData('posts', () =>
    $fetch('https://jsonplaceholder.typicode.com/todos/1'), {lazy:true}
  )
  </script>
  