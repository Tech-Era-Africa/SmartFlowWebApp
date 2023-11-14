<template>
    <NuxtLayout  name="dashboard">
        <Header name="Devices"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-8 left-0 right-0">
            <div class="w-full flex  p-2 gap-4">
                <UsersTable></UsersTable>
            </div>
       
        </section>
    </NuxtLayout>
</template>
<script setup>

</script>