<template>
     <div class="w-full min-h-[200px] bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">Monthly Consumption</h1>
                <!-- <p class="text-xs text-gray-400">Updated 10mins ago</p> -->
            </div>
            <div class="dropdown dropdown-end dropdown-bottom">
                <label tabindex="0" class="btn btn-ghost m-1">This Month
                    <!-- <Icon name="ion:caret-down-outline" /> -->
                </label>
                <!-- <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>This Month</a></li>
                    <li><a>This Year</a></li>
                </ul> -->
            </div>
        </div>
        <div class="mt-5 flex flex-col flex-1 justify-between">
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Maximal Used</p>
                <p class="text-xl font-bold">{{useUseCubicToLitre(deviceStore.minMaxconsumption.max)}}L</p>
            </div>
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Minimal Used</p>

                <p class="text-xl font-bold">{{useUseCubicToLitre(deviceStore.minMaxconsumption.min)}}L</p>
            </div>
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Total Used</p>
                <p class="text-xl font-bold">{{useUseCubicToLitre(option.consumption)}}L</p>
            </div>
        </div>
     </div>
</template>
<script setup lang="ts">
import { useDeviceStore } from '~/stores/device/device.store';

const props = defineProps({
    option: {
        type: Object as () => { deviceId:string, consumption:number },
        required: true
    },
})

const deviceStore = useDeviceStore()






</script>