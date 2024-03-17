<template>
     <div class="w-full min-h-[200px] bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Total Consumption' }}</h1>
                <!-- <p class="text-xs text-gray-400">Updated 10mins ago</p> -->
            </div>
            <DateRangePicker @handle-date-change="onDateChanged"></DateRangePicker>
        </div>
        <div class="mt-5 flex flex-col flex-1 justify-between">
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Maximal Used</p>
                <Loader2 class="animate-spin" v-if="option.isLoading" :size="15" ></Loader2>
                <template v-else>
                    <p class="text-xl font-bold">{{useUseCubicToLitre(deviceStore.minMaxconsumption.max)}}L</p>
                </template>
            </div>
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Minimal Used</p>
                <Loader2 class="animate-spin" v-if="option.isLoading" :size="15" ></Loader2>
                <template v-else>
                    <p class="text-xl font-bold">{{useUseCubicToLitre(deviceStore.minMaxconsumption.min)}}L</p>
                </template>
            </div>
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Total Used</p>
                <Loader2 class="animate-spin" v-if="option.isLoading" :size="15" ></Loader2>
                <template v-else>
                    <p class="text-xl font-bold">{{useUseCubicToLitre(deviceStore.minMaxconsumption.sum)}}L</p>
                </template>

            </div>
        </div>
     </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { useDeviceStore } from '~/stores/device/device.store';
import { Loader2 } from 'lucide-vue-next'

const emits = defineEmits(['onDateChanged'])

const props = defineProps({
    option: {
        type: Object as PropType<{ deviceId:string, consumption:number, title?:string, isLoading?:boolean }>,
        required: true
    },
})

const deviceStore = useDeviceStore()

const onDateChanged = (date: any) => {
    emits('onDateChanged', date)
}





</script>