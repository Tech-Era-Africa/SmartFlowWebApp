<template>
    <Card
        class="w-full h-[150px] flex justify-between items-center cursor-pointer transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-[1.005]  duration-300 shadow-none">
        <CardHeader>
            <CardTitle>{{ option.name }}</CardTitle>
            <CardDescription>
                <Badge variant="outline" class="my-3">{{ option.devicesCount }} Device{{ option.devicesCount! >= 2 ?
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

const props = defineProps<{
    option: {
        id: string,
        name: string,
        devicesCount: number
    }
}>()

const deviceStore = useDeviceStore()

// CHART SETTTINGS
const chart4Options = ref({
    chart: {
        type: 'area',
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
        enabled: true // Hide tooltip
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
            show: false // Hide y-axis labels
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

// Get the chart data
const currentDate = new Date();
const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
const clusterData = await deviceStore.getClusterConsumptionTrend(props.option.id, startOfMonth.toISOString(), endOfMonth.toISOString())

// Update the chart
chart4Options.value.series = clusterData


</script>