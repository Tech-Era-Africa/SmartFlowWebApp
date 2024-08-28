<template>
     <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Consumption Insights' }}</h1>
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
        <div class="grid gap-4 md:grid-cols-2">
            <Card class="shadow-none">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Water Used
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  class="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div class="text-lg font-bold">
                  234L
                </div>
                <p class="text-xs text-muted-foreground">
                  +201 since yesterday
                </p>
              </CardContent>
            </Card>
            <Card class="shadow-none">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Estimated Bill
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  class="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div class="text-lg font-bold">
                  GHC243
                </div>
                <p class="text-xs text-muted-foreground">
                  +Ghc50 since yesterday
                </p>
              </CardContent>
            </Card>
            <Card class="shadow-none">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Peak Usage
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  class="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div class="text-lg font-bold">
                  12th March
                </div>
                <p class="text-xs text-muted-foreground">
                  Date
                </p>
              </CardContent>
            </Card>
            <Card class="shadow-none">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Peak Usage
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  class="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div class="text-lg font-bold">
                  Akonnor
                </div>
                <p class="text-xs text-muted-foreground">
                  Group
                </p>
              </CardContent>
            </Card>
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