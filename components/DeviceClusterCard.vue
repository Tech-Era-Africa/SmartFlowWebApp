<template>
    <Card
        class="w-full h-[150px] flex justify-between items-center cursor-pointer transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-[1.005]  duration-300 shadow-none">
        <CardHeader>
            <Badge :class="option.type.id == 1? 'hover:bg-transparent bg-green-100  text-green-600' : 'hover:bg-transparent bg-blue-100  text-blue-600'"  class="rounded-sm border-none outline-none my-3 text-xs inline-flex w-fit "> {{ option.type.name }}</Badge>
            <CardTitle>{{ option.name }}</CardTitle>
            <CardDescription>
                <Badge variant="outline" class="my-3">{{ option.device_count }} Device{{ option.device_count! >= 2 ?
                's' : '' }}</Badge>
            </CardDescription>
        </CardHeader>
        <CardContent class="p-2 w-[150px]">
            <apexchart :key="chart4Options.series" :options="chart4Options" :series="chart4Options.series">
            </apexchart>
        </CardContent>
       
    </Card>
</template>
<script setup lang="ts">
import { useDeviceStore } from '~/stores/device/device.store';
import Card from './ui/card/Card.vue';
import type { ICluster } from '~/stores/cluster/model/cluster.model';

const props = defineProps<{
    option: ICluster
}>()

const deviceStore = useDeviceStore()
const chartData = ref()

onBeforeMount(() => {
    // Get the chart data
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const endDate = new Date(currentDate.getFullYear(), 11, 31);
    chartData.value = deviceStore.getClusterConsumptionTrend(props.option.id, startDate.toISOString(), endDate.toISOString())
})

// CHART SETTTINGS
const chart4Options = ref({
    chart: {
        animations: {
            enabled: true // Disable animations
        },
        toolbar: {
            show: false // Hide toolbar
        },
        zoom: {
            enabled: false // Disable zooming
        }
    },
    series: [],
    markers: {
        size: 0 // Hide markers
    },
    legend: {
        show: false // Hide legend
    },
    tooltip: {
        enabled: true, // Hide tooltip
        y: {
            formatter: function (value: any) {
                // Round the value to two decimal places
                return `${value.toFixed(2)} L`;
            }
        }
    },
    grid: {
        show: false // Hide grid lines
    },
    xaxis: {
        type: 'datetime',
        labels: {
            show: false // Hide x-axis labels
        }
    },
    yaxis: {
        labels: {
            show: false,
            formatter: function (value: number) {
                // Round the value to two decimal places
                return `${value.toFixed(2)} L`;
            }
        }
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 2,
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
    colors: ['#46D5E5', '#C578F8', '#86FC5F', '#F729C0'],

})
// end of CHART SETTING



watchEffect(async() => {
    // Listens for when there is data in the chartData and sends it to the chart
    if (chartData.value) {
        chart4Options.value.series = await chartData.value
    }
})




</script>