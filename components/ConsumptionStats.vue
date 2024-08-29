<template>
     <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Consumption Insights' }}</h1>
                <!-- <p class="text-xs text-muted-foreground">{{ option.subtitle }}</p> -->
            </div>
            <div class="flex gap-2 items-center">
                <PeriodFacetedFilter @onDateChanged="onDateChanged"></PeriodFacetedFilter>
            </div>
            <!-- <DateRangePicker @handle-date-change="onDateChanged"></DateRangePicker> -->
        </div>
        <div v-if="isLoading" class="grid gap-4 md:grid-cols-2">
            <Card v-for="i in 4" :key="i" class="shadow-none">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                        <Skeleton class="h-4 w-24" />
                    </CardTitle>
                    <Skeleton class="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                    <Skeleton class="h-6 w-16 mb-2" />
                    <Skeleton class="h-4 w-32" />
                </CardContent>
            </Card>
        </div>
        <div v-else class="grid gap-4 md:grid-cols-2">
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
                  {{ stats.waterUsed }}L
                </div>
                <p class="text-xs text-muted-foreground">
                  {{ stats.waterUsedChange }} since yesterday
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
                  GHC{{ stats.estimatedBill }}
                </div>
                <p class="text-xs text-muted-foreground">
                  {{ stats.estimatedBillChange }} since yesterday
                </p>
              </CardContent>
            </Card>
            <Card class="shadow-none">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Peak Usage Date
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
                  {{ stats.peakUsageDate }}
                </div>
                <p class="text-xs text-muted-foreground">
                  Date
                </p>
              </CardContent>
            </Card>
            <Card class="shadow-none">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  Peak Usage Group
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
                  {{ stats.peakUsageGroup }}
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
import { ref, onMounted } from 'vue';

const emits = defineEmits(['onDateChanged'])

defineProps({
    option: {
        type: Object as PropType<{ title?:string, subtitle?:string, isLoading?:boolean, max:number, min:number, sum:number }>,
        required: true
    },
})

const validStatNumber = (num:number)=> num > 0 ? num : 0

const trendPeriod = ref('year')
const isLoading = ref(true)
const stats = ref({
    waterUsed: '0',
    waterUsedChange: '+0',
    estimatedBill: '0',
    estimatedBillChange: '+0',
    peakUsageDate: '',
    peakUsageGroup: ''
})

const fetchStats = () => {
    isLoading.value = true
    // Simulating API call
    setTimeout(() => {
        stats.value = {
            waterUsed: '234',
            waterUsedChange: '+201',
            estimatedBill: '243',
            estimatedBillChange: '+50',
            peakUsageDate: '12th March',
            peakUsageGroup: 'Akonnor'
        }
        isLoading.value = false
    }, 1500)
}

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

    fetchStats()
}

onMounted(() => {
    fetchStats()
})

</script>