<template>
    <section class="w-screen h-screen bg-cyan-50 flex justify-center items-center">
        <p>Loading orgs...</p>
    </section>
</template>
<script setup lang="ts">
useHead({ title: "Setup" })
definePageMeta({ middleware: 'auth' })
</script>