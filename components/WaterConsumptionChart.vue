<template>
    <div class="w-full min-h-[300px] bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <h1 class="font-bold text-lg">{{ option.title ?? 'Water Consumption' }}</h1>
            <DateRangePicker></DateRangePicker>
            
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
        type: Object as PropType<IWaterConsumptionChart>,
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
    series: props.option.chartSeries,
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
        type: 'datetime',
    },
    yaxis: {
        show: true,
    },
    tooltip: {
          x: {
            format: 'dd MMM yyyy'
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
    colors: ['#46D5E5', '#C578F8', '#86FC5F','#F729C0'],
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


// Used to watch for changes and update the charts 
watchEffect(()=>{
    chart4Options.value.series = props.option.chartSeries
})


</script>