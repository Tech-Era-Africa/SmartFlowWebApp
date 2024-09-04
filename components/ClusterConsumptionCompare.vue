<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ 'Cluster Water Consumption' }}</h1>
                <p class="text-xs text-muted-foreground">{{ '* Comparison over time' }}</p>
            </div>
            <div class="flex gap-2 items-center">
                <ClusterFacetedFilter :clusters="clusters" @handleFilter="handleClusterFilter"></ClusterFacetedFilter>
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
        <ClientOnly v-else>
            <apexchart :key="chartKey" height="85%" width="100%" :options="chartOptions" :series="chartSeries">
            </apexchart>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';
import { ChartLine } from 'lucide-vue-next'

const props = defineProps<{
    option: IWaterConsumptionChart
}>();

const emits = defineEmits(['onDateChanged', 'onClusterChanged']);

const isLoading = ref(true);
const chartKey = ref(0);

const clusters = [
    { id: '1', name: 'Cluster A' },
];

const chartSeries = computed(() => [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
          }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
          }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
          }]);

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
    xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
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
        }
    },
    colors: ['#46D5E5', '#1E88E5', '#00BFA5', '#6DD5FA', '#2196F3'], // Varied water-themed colors
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