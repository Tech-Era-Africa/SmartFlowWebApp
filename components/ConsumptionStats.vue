<template>
    <div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <!-- Total Water Usage Card -->
            <Card class="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Total Water Usage</CardTitle>
                    <DropletIcon class="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-blue-600">{{ (option.sum ?? 0).toFixed(2) }} kL</div>
                    <p class="text-xs text-muted-foreground mt-2">Total consumption for selected period</p>
                </CardContent>
            </Card>

            <!-- Peak Usage Card -->
            <Card class="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Peak Usage</CardTitle>
                    <ActivityIcon class="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-orange-600">{{ (option.max ?? 0).toFixed(2) }} kL</div>
                    <p class="text-xs text-muted-foreground mt-2">Highest daily consumption</p>
                </CardContent>
            </Card>

            <!-- Average Usage Card -->
            <Card class="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Average Usage</CardTitle>
                    <BarChartIcon class="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold text-green-600">{{ ((option.sum ?? 0) / (option.days ?? 30)).toFixed(2) }} kL</div>
                    <p class="text-xs text-muted-foreground mt-2">Average daily consumption</p>
                </CardContent>
            </Card>
        </div>

        <div v-if="consumptionStore.isLoadingConsumptionInsights" class="grid gap-4 md:grid-cols-2">
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
            <!-- Rest of the cards remain unchanged -->
            <!-- Water Used Card -->
            <Card :class="['shadow-none transition-opacity duration-300', {'opacity-50': +consumptionStore.stats.waterUsed == 0}]">
                <!-- Card content remains the same -->
            </Card>
            <!-- Other cards follow the same pattern -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { useConsumptionStore } from '~/stores/consumption/consumption.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { useBillStore } from '~/stores/bill/bill.store.js';

const props = defineProps({
    option: {
        type: Object as PropType<{ 
            title?: string, 
            subtitle?: string, 
            isLoading?: boolean, 
            max: number, 
            min: number, 
            sum: number,
            days?: number
        }>,
        required: true,
        default: () => ({
            max: 0,
            min: 0,
            sum: 0,
            days: 30
        })
    },
})

const consumptionStore = useConsumptionStore()
const billStore = useBillStore();
const deviceStore = useDeviceStore()

const defaultStats = {
    waterUsed: 0,
    waterUsedChange: 0,
    waterUsedChangeDescription: 'No change',
    estimatedBill: 0,
    peakUsageAmount: 0,
    peakUsageDate: '',
    peakUsageGroup: '',
    averageConsumption: 0,
    cgp: 0
}

const stats = computed(() => ({
    ...defaultStats,
    ...consumptionStore.stats
}))

const getDeviceGroupName = (id: string) => {
    const group = deviceStore.devicesGroups?.find(group => group.objectId === id);
    return group?.name || 'Unknown Group';
};

const onDateChanged = (period: {start: Date, end: Date}) => {
    consumptionStore.getConsumptionInsightsByOrg(period.start.toISOString(), period.end.toISOString())
}

useAsyncData('consumptionInsights', async () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const endDate = new Date(currentDate.getFullYear(), 11, 31);
    await consumptionStore.getConsumptionInsightsByOrg(startDate.toISOString(), endDate.toISOString());
}, {lazy: true});
</script>