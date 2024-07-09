<template>
     <div class="w-full min-h-[200px] bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Total Consumption' }}</h1>
                <p class="text-xs text-muted-foreground">{{ option.subtitle }}</p>
            </div>
            <div class="flex gap-2 items-center">
                <Select :model-value="trendPeriod" @update:model-value="onDateChanged($event)">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="week">
                                This Week
                            </SelectItem>
                            <SelectItem value="month">
                                This Month
                            </SelectItem>
                            <SelectItem value="year">
                                This Year
                            </SelectItem>
                            <!-- <SelectItem value="custom">
                                Custom
                            </SelectItem> -->
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <!-- <DateRangePicker @handle-date-change="onDateChanged"></DateRangePicker> -->
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

const trendPeriod = ref('year')

const onDateChanged = (period: string) => {
    const currentDate = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
        case 'month':
            trendPeriod.value = period
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            break;
        case 'week':
            trendPeriod.value = period
            const firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // Assuming Sunday is the first day of the week
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDayOfWeek);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDayOfWeek + 6);
            break;
        case 'year':
            trendPeriod.value = period
            startDate = new Date(currentDate.getFullYear(), 0, 1);
            endDate = new Date(currentDate.getFullYear(), 11, 31);
            break;
        default:
            // Default to month if period is not recognized
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }

    emits('onDateChanged', {
        start: startDate,
        end: endDate
    });
}




</script>