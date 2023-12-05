<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
        <div class="flex  justify-between items-center">
            <h1 class="font-bold text-lg">Devices</h1>
        </div>
        <div class="flex-1 flex-grow w-full whitespace- flex gap-2 overflow-x-auto">
            <!-- <DeviceCard @click="openDeviceDrawer"  v-for="i in 3"></DeviceCard> -->
            <div class="bg-gray-100 flex justify-center items-center px-5 rounded-xl">
                <p class="font-bold text-xl">+3</p>
            </div>
        </div>
        <button class="btn btn-outline mt-5">Add New Device</button>

        <div class="text-right">
            <NuxtLink to="/devices" class="btn btn-ghost">
                View All
                <Icon name="material-symbols:arrow-forward-rounded"></Icon>
            </NuxtLink>

        </div>
    </div>
</template>
<script setup lang="ts">

const openDeviceDrawer = ()=>{
    const drawer = document.getElementById("deviceDrawer");
    drawer?.click()
}


</script>