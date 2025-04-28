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

// Fetch water usage trend data
const { data: usageChartSeries, refresh: refreshUsage, status: usageStatus, error: usageError } = useAsyncData('usageTrend', async () => {
    return await consumptionStore.getConsumptionTrend({ consumption_type: 1 }); // 1 for usage
}, { immediate: true, lazy: true });

// Fetch water collection trend data
const { data: collectionChartSeries, refresh: refreshCollection, status: collectionStatus, error: collectionError } = useAsyncData('collectionTrend', async () => {
    return await consumptionStore.getConsumptionTrend({ consumption_type: 2 }); // 2 for collection
}, { immediate: true, lazy: true });

// Combined status for loading state
const status = computed(() => {
    if (usageStatus.value === 'pending' || collectionStatus.value === 'pending') {
        return 'pending';
    }
    return 'success';
});

// Combined refresh function
const refresh = () => {
    refreshUsage();
    refreshCollection();
};

const processedChartSeries = computed(() => {
    const series = [];

    // Add Water Used series if data is available
    if (usageChartSeries.value && usageChartSeries.value.length > 0) {
        series.push({
            name: 'Water Used',
            data: usageChartSeries.value.map(point => ({
                x: new Date(point.date_bin).getTime(),
                y: point.total_consumption_change
            }))
        });
    }

    // Add Water Collected series if data is available
    if (collectionChartSeries.value && collectionChartSeries.value.length > 0) {
        series.push({
            name: 'Water Collected',
            data: collectionChartSeries.value.map(point => ({
                x: new Date(point.date_bin).getTime(),
                y: point.total_consumption_change
            }))
        });
    }

    return series;
});

const hasData = computed(() => {
    return (usageChartSeries.value && usageChartSeries.value.length > 0) ||
           (collectionChartSeries.value && collectionChartSeries.value.length > 0);
});


// Listen to when the dates change and refresh
// Subscribe to changes in the store's state
consumptionStore.$subscribe((_, state) => {
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
        stacked: false
    },
    xaxis: {
        type: 'datetime',
        title: {
            text: 'Date'
        }
    },
    yaxis: {
        labels: { formatter: (value: number) => `${Math.round(value)}` },
        title: {
            text: 'Volume (kL)'
        }
    },
    tooltip: {
        x: { format: 'dd MMM yyyy' },
        y: {
            formatter: (value: number) => `${Math.round(value)} kL`
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3
        }
    },
    // Blue for Water Collected, Red for Water Used
    colors: ['#52DAFFFF', '#21F39CFF'],
    legend: {
        position: 'bottom',
        horizontalAlign: 'center'
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    grid: {
        borderColor: '#e0e0e0',
        row: {
            colors: ['#f8f9fa', 'transparent'],
            opacity: 0.5
        }
    },
    markers: {
        size: 4,
        hover: {
            size: 6
        }
    }
}));


</script>
<template>
    <div :class="$attrs.class" class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
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
