<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Water Consumption' }}</h1>
                <p class="text-xs text-muted-foreground">{{ option.subtitle }}</p>
            </div>
            <div class="flex gap-2 items-center">
                <!-- <ClusterFacetedFilter :clusters="clusters" @handleFilter="handleClusterFilter"></ClusterFacetedFilter> -->
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
            <apexchart :key="chartKey" height="100%" width="100%" :options="chartOptions" :series="processedChartSeries">
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

const chartSeries = computed(() => props.option.chartSeries || []);

const hasData = computed(() => chartSeries.value.length > 0 && chartSeries.value.some(series => series.data.length > 0));

const chartOptions = computed(() => ({
    chart: {
        type: 'area',
        height: 250,
        toolbar: {
            show: true,
            tools: {
                download: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true
            },
            export: {
                csv: {
                    filename: 'Water Consumption Chart',
                    columnDelimiter: ',',
                    headerCategory: 'Date',
                    headerValue: 'Value'
                },
                svg: {
                    filename: 'Water Consumption Chart'
                },
                png: {
                    filename: 'Water Consumption Chart'
                }
            }
        },
        zoom: { 
            enabled: true,
            type: 'x',
            autoScaleYaxis: true
        },
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
        title: {
            text: 'Consumption (kL)'
        },
        labels: {
            formatter: (value: number) => `${Math.round(value)}`
        }
    },
    tooltip: {
        x: { format: 'dd MMM yyyy' },
        y: {
            formatter: (value: number) => `${value.toFixed(2)} kL`
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
        }
    },
    colors: ['#46D5E5', '#C578F8', '#86FC5F', '#F729C0', '#FFD700'],
    legend: {
        position: 'bottom',
        markers: { radius: 12, offsetX: -4 },
        itemMargin: { horizontal: 12, vertical: 20 },
    },
    // annotations: {
    //     yaxis: [{
    //         y: 3.5, // Adjust this value to set the recommended consumption threshold
    //         borderColor: '#4CAF50', // A more readable green color
    //         label: {
    //             borderColor: '#4CAF50',
    //             style: {
    //                 color: '#fff',
    //                 background: '#4CAF50'
    //             },
    //             text: 'Recommended Consumption Threshold'
    //         }
    //     }]
    // },
    markers: {
        size: 2,
        colors: undefined,
        strokeColors: '#fff',
        strokeWidth: 0.05,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 0.5,
        discrete: [],
        shape: "circle",
        radius: 0.01,
        offsetX: 0,
        offsetY: 0,
        onClick: undefined,
        onDblClick: undefined,
        showNullDataPoints: true,
        hover: {
            size: 7,
            sizeOffset: 3
        }
    },
    states: {
        hover: {
            filter: {
                type: 'none',
            }
        },
        active: {
            filter: {
                type: 'none',
            }
        },
    },
}));

// Add this computed property to process the series data
const processedChartSeries = computed(() => {
    return chartSeries.value.map(series => ({
        ...series,
        data: series.data.map((point: any) => ({
            x: new Date(point.x).getTime(),
            y: point.y,
            fillColor: point.downtime ? '#FF0000' : undefined,
            strokeColor: point.downtime ? '#FF0000' : undefined,
        }))
    }));
});

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