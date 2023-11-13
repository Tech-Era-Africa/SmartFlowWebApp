<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
        <div class="flex  justify-between items-center">
            <h1 class="font-bold text-lg">Devices</h1>
        </div>
        <div class="flex-1 flex-grow flex gap-2">
            <DeviceCard v-for="i in 3"></DeviceCard>
            <div class="bg-gray-100 flex justify-center items-center px-5 rounded-xl">
                <p class="font-bold text-xl">+3</p>
            </div>
        </div>
        <button class="btn btn-outline mt-5">Add New Device</button>

        <div class="text-right">
            <button class="btn btn-ghost">
                View All
                <Icon name="material-symbols:arrow-forward-rounded"></Icon>
            </button>

        </div>
    </div>
</template>