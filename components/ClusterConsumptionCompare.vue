<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ 'Cluster Water Consumption' }}</h1>
                <p class="text-xs text-muted-foreground">{{ '* Comparison over time' }}</p>
            </div>
            <div class="flex gap-2 items-center">
                <ClusterFacetedFilter @handleFilter="handleClusterFilter" :max-selections="3"></ClusterFacetedFilter>
                <PeriodFacetedFilter @onDateChanged="handleDateChange"></PeriodFacetedFilter>
            </div>
        </div>
        <div v-if="isLoading" class="w-full h-full">
            <Skeleton class="h-full" />
        </div>
        <div v-else-if="!hasData" class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
                <ChartLine class="text-gray-400 text-4xl mb-2 mx-auto" />
                <p class="text-muted-foreground text-sm font-medium">No data available for the selected period</p>
                <p class="text-muted-foreground text-xs mt-1">Try adjusting your filters or date range</p>
            </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
                <Card class="shadow-none mb-4">
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Average Consumption</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            class="h-4 w-4 text-muted-foreground">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div class="text-lg font-bold">{{ 0 }}L</div>
                    </CardContent>
                </Card>
                <Card class="shadow-none mb-4">
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Highest Consumption</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            class="h-4 w-4 text-muted-foreground">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div class="text-lg font-bold">{{ 0 }}L</div>
                    </CardContent>
                </Card>
                <Card class="shadow-none">
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle class="text-sm font-medium">Lowest Consumption</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            class="h-4 w-4 text-muted-foreground">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div class="text-lg font-bold">{{ 0 }}L</div>
                    </CardContent>
                </Card>
            </div>
            <div class="col-span-9 h-auto">
                <Card class="shadow-none h-full">
                    <CardContent class="h-full">
                        <ClientOnly>
                            <apexchart :key="chartKey" height="100%" width="100%" :options="chartOptions"
                                :series="chartSeries">
                            </apexchart>
                        </ClientOnly>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';
import { ChartLine } from 'lucide-vue-next'
import { useDeviceStore } from '~/stores/device/device.store';

const props = defineProps<{
    option: IWaterConsumptionChart
}>();

const emits = defineEmits(['onDateChanged', 'onClusterChanged']);

const isLoading = ref(true);
const chartKey = ref(0);

const clusters = [
    { id: '1', name: 'Cluster A' },
];

const deviceStore = useDeviceStore()

const currentDate = new Date();
const startDate = new Date(currentDate.getFullYear(), 0, 1);
const endDate = new Date(currentDate.getFullYear(), 11, 31);
useAsyncData<any>('deviceConsumptionTrendM', () => Promise.all([
    deviceStore.getAllDevicesConsumptionGroupedTrend(startDate.toISOString(), endDate.toISOString()),
]), { lazy: true })

const getDeviceGroupName = (id:string) => {

const group = deviceStore.devicesGroups.find(group => group.objectId === id);
return group ? group.name : 'Unknown Group';

};


const chartSeries = computed(() => deviceStore.consumptionGrouped);

const hasData = computed(() => chartSeries.value.length > 0 && chartSeries.value.some(series => series.data.length > 0));

const chartOptions = computed(() => ({
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: { type: 'datetime' },
    yaxis: {
        title: {
            text: 'Consumption (kL)'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val: any) {
                return val + " kL"
            }
        },
        
    },
    annotations: {
        yaxis: [{
            y: 6, // Adjust this value to set the recommended consumption threshold
            borderColor: '#4CAF50', // A more readable green color
            label: {
                borderColor: '#4CAF50',
                style: {
                    color: '#fff',
                    background: '#4CAF50'
                },
                text: 'Recommended Consumption Threshold'
            }
        }]
    },
    colors: ['#46D5E5', '#1E88E5', '#00BFA5', '#6DD5FA', '#2196F3'], // Varied water-themed colors
    legend: {
        position: 'bottom',
        formatter: function(seriesName:any) {
            return getDeviceGroupName(seriesName)
        }
    }
}));

const handleDateChange = ({ start, end }: { start: Date, end: Date }) => {
    isLoading.value = true;
    emits('onDateChanged', { start, end });
};

const handleClusterFilter = (selectedClusters: string[]) => {
    isLoading.value = true;
    emits('onClusterChanged', selectedClusters);
};

watchEffect(() => {
    if (props.option.chartSeries) {
        isLoading.value = false;
        chartKey.value++; // Force chart re-render
    }
});
</script>