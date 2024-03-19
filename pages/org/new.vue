<template>
    <section class="w-screen h-screen bg-cyan-50 flex flex-col gap-5 justify-center items-center">
        <p>Loading orgs...</p>
        <Button @click="useRouter().replace('/')">Go Home</Button>
    </section>
</template>
<script setup lang="ts">
useHead({ title: "Setup" })

</script>