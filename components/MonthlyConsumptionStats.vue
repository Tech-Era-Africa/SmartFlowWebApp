<template>
     <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">Monthly Consumption</h1>
                <p class="text-xs text-gray-400">Updated 10mins ago</p>
            </div>
        </div>
        <div class="mt-5 flex flex-col flex-1 justify-between">
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Maximal Used</p>
                <p class="text-xl font-bold">234L</p>
            </div>
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Minimal Used</p>
                <p class="text-xl font-bold">234L</p>
            </div>
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Total Used <span class="text-xs">This Month</span></p>
                <p class="text-xl font-bold">234L</p>
            </div>
        </div>
     </div>
</template>