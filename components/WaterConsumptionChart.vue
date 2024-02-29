<template>
    <div class="w-full min-h-[300px] bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <h1 class="font-bold text-lg">Water Consumption</h1>
            <button class="btn">
                This Year
                <Icon name="material-symbols:calendar-month-outline" />
            </button>
        </div>

        <apexchart :key="chart4Options.series" height="100%" width="100%" :options="chart4Options"
            :series="chart4Options.series">
        </apexchart>

    </div>
</template>

<script setup lang="ts">
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';


const props = defineProps({
    option: {
        type: Object as () => IWaterConsumptionChart,
        required: true
    },
})

// CHART SETTTINGS
const chart4Options = ref({
    chart: {
        type: 'area',
        height: 250,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
    },
    series: props.option.series,
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 2,
    },
    grid: {
        row: {
            opacity: 0,
        },
    },
    xaxis: {
        categories: props.option.xAxisCategories,
    },
    yaxis: {
        show: true,
    },
    fill: {
        type: 'solid',
        opacity: [0.05, 0],
    },
    colors: ['#4285F4', '#1AB044'],
    legend: {
        position: 'bottom',
        markers: {
            radius: 12,
            offsetX: -4,
        },
        itemMargin: {
            horizontal: 12,
            vertical: 20,
        },
    },
})

// end of CHART SETTING


</script>