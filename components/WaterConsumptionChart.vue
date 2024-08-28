<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Water Consumption' }}</h1>
                <p class="text-xs text-muted-foreground">{{ option.subtitle }}</p>
            </div>
            <div class="flex gap-2 items-center">
                <ClusterFacetedFilter :clusters="clusters" @handleFilter="handleClusterFilter"></ClusterFacetedFilter>
                <PeriodFacetedFilter @onDateChanged="handleDateChange"></PeriodFacetedFilter>
            </div>
        </div>
        <div v-if="isLoading" class="w-full h-full">
            <Skeleton class="h-full" />
        </div>
        <ClientOnly>
            <apexchart  :key="chartKey" height="85%" width="100%" :options="chartOptions" :series="chartSeries">
            </apexchart>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';

const props = defineProps<{
    option: IWaterConsumptionChart
}>();

const emits = defineEmits(['onDateChanged', 'onClusterChanged']);

const isLoading = ref(true);
const chartKey = ref(0);

const clusters = [
    { id: '1', name: 'Cluster A' },
    { id: '2', name: 'Cluster B' },
    { id: '3', name: 'Cluster C' }
];

const chartSeries = computed(() => props.option.chartSeries || []);

const chartOptions = computed(() => ({
    chart: {
        type: 'area',
        height: 250,
        toolbar: { show: false },
        zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        width: 2,
    },
    grid: { row: { opacity: 0 } },
    xaxis: { type: 'datetime' },
    yaxis: {
        labels: {
            formatter: (value: number) => `${value.toFixed(2)}k L`
        }
    },
    tooltip: { x: { format: 'dd MMM yyyy' } },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
        }
    },
    colors: ['#46D5E5', '#C578F8', '#86FC5F', '#F729C0'],
    legend: {
        position: 'bottom',
        markers: { radius: 12, offsetX: -4 },
        itemMargin: { horizontal: 12, vertical: 20 },
    },
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