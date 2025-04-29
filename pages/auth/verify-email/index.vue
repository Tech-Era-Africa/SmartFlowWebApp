<template>
    <Suspense>
      <template #default>
        <div> <!-- wrap with ONE div or section -->
          <p>This is the default</p>
        </div>
      </template>
  
      <template #fallback>
        <p>This is the fallback</p>
      </template>
    </Suspense>
  </template>
  
  <script setup lang="ts">
 
  </script>
  