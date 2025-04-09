<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAsyncData } from '#app';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';
import { ChartLine } from 'lucide-vue-next';
import { useConsumptionStore } from '~/stores/consumption/consumption.store';

const props = defineProps<{
    option: IWaterConsumptionChart;
}>();

const consumptionStore = useConsumptionStore();

// Fetch consumption trend data using useAsyncData
const { data: chartSeries, refresh, status, error } = useAsyncData(async () => {
    return await consumptionStore.getConsumptionTrend();
}, { immediate: true, lazy:true });

const processedChartSeries = computed(() => {
    if (!chartSeries.value) return [];
    
    // Create a single series from the flat array
    return [{
        name: 'Water Consumption',
        data: chartSeries.value.map(point => ({
            x: new Date(point.date_bin).getTime(),
            y: point.total_consumption_change,
            // // Keep the downtime coloring if it exists
            // fillColor: point.downtime ? '#FF0000' : undefined,
            // strokeColor: point.downtime ? '#FF0000' : undefined,
        }))
    }];
});

const hasData = computed(() => {
    return chartSeries.value && chartSeries.value.length > 0;
});


// Listen to when the dates change and refresh
// Subscribe to changes in the store's state
consumptionStore.$subscribe((mutation, state) => {
    if (state.startDate || state.endDate) {
        refresh();
    }
});

// Update the start and end once there is a change in period
const handleDateChange = ({ start, end }: { start: Date; end: Date }) => {
    consumptionStore.updatePeriod(start.toISOString(), end.toISOString());

};


const chartOptions = computed(() => ({
    chart: {
        type: 'area',
        height: 300,
        toolbar: { show: true },
        animations: { enabled: true },
    },
    xaxis: { type: 'datetime' },
    yaxis: { labels: { formatter: (value: number) => `${Math.round(value)}` } },
    tooltip: { x: { format: 'dd MMM yyyy' } },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1 } },
    colors: ['#46D5E5', '#C578F8', '#86FC5F'],
    legend: { position: 'bottom' },
}));


</script>
<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Water Consumption' }}</h1>
                <p class="text-xs text-muted-foreground">{{ option.subtitle }}</p>
            </div>
            <div class="flex gap-2 items-center">
                <PeriodFacetedFilter @onDateChanged="handleDateChange"></PeriodFacetedFilter>
            </div>
        </div>
        <div v-if="status === 'pending'" class="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg">
        <!-- Placeholder Chart -->
        <div class="relative w-full h-[300px] bg-white rounded-lg overflow-hidden animate-pulse">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>
            <svg class="w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <!-- Placeholder Lines -->
                <path
                    d="M0 250 C100 200, 200 150, 400 250"
                    stroke="rgba(200, 200, 200, 0.6)"
                    stroke-width="2"
                    fill="none"
                />
                <path
                    d="M0 200 C100 150, 200 200, 400 200"
                    stroke="rgba(200, 200, 200, 0.6)"
                    stroke-width="2"
                    fill="none"
                />
                <!-- X-Axis and Y-Axis -->
                <line x1="50" y1="280" x2="350" y2="280" stroke="rgba(200, 200, 200, 0.6)" stroke-width="1" />
                <line x1="50" y1="280" x2="50" y2="20" stroke="rgba(200, 200, 200, 0.6)" stroke-width="1" />
            </svg>
        </div>

        <!-- Loading Spinner -->
        <div class="mt-4 flex items-center gap-2">
            <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            <p class="text-sm text-muted-foreground">Loading data...</p>
        </div>
    </div>
        <div v-else-if="!hasData" class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
                <ChartLine class="text-gray-400 text-4xl mb-2 mx-auto" />
                <p class="text-muted-foreground text-sm font-medium">No data available for the selected period</p>
                <p class="text-muted-foreground text-xs mt-1">Try adjusting your filters or date range</p>
            </div>
        </div>
        <ClientOnly v-else>
            <apexchart  height="100%" width="100%" :options="chartOptions" :series="processedChartSeries">
            </apexchart>
        </ClientOnly>
    </div>
</template>
