<template>
     <div class="w-full min-h-[200px] bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Total Consumption' }}</h1>
                <p class="text-xs text-muted-foreground">{{ option.subtitle }}</p>
            </div>
            <DateRangePicker @handle-date-change="onDateChanged"></DateRangePicker>
        </div>
        <div class="mt-5 flex flex-col flex-1 justify-between">
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Highest Consumption</p>
                <Loader2 class="animate-spin" v-if="option.isLoading" :size="15" ></Loader2>
                <template v-else>
                    <p class="text-xl font-bold">{{validStatNumber(option.max).toFixed(2)}}k L</p>
                </template>
            </div>
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Lowest Consumption</p>
                <Loader2 class="animate-spin" v-if="option.isLoading" :size="15" ></Loader2>
                <template v-else>
                    <p class="text-xl font-bold">{{validStatNumber(option.min).toFixed(2)}}k L</p>
                </template>
            </div>
            <div class="flex justify-between items-center">
                <p class="text-gray-500 font-medium">Total Used</p>
                <Loader2 class="animate-spin" v-if="option.isLoading" :size="15" ></Loader2>
                <template v-else>
                    <p class="text-xl font-bold">{{validStatNumber(option.sum).toFixed(2)}}k L</p>
                </template>

            </div>
        </div>
     </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { Loader2 } from 'lucide-vue-next'

const emits = defineEmits(['onDateChanged'])

 defineProps({
    option: {
        type: Object as PropType<{ title?:string, subtitle?:string, isLoading?:boolean, max:number, min:number, sum:number }>,
        required: true
    },
})

const validStatNumber = (num:number)=> num > 0 ? num : 0

const onDateChanged = (date: any) => {
    emits('onDateChanged', date)
}





</script>