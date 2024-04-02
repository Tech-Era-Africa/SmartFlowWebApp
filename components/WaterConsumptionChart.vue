<template>
    <div class="w-full max-h-[340px] h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Water Consumption' }}</h1>
                <p class="text-xs text-muted-foreground">{{ option.subtitle }}</p>
            </div>
            <DateRangePicker @handle-date-change="onDateChanged"></DateRangePicker>

        </div>
        <div v-if="option.isLoading" class="w-full h-full">
            <Skeleton class="h-full" />
        </div>
        <template v-else>
            <apexchart :key="chart4Options.series" height="100%" width="100%" :options="chart4Options"
                :series="chart4Options.series">
            </apexchart>
        </template>

    </div>
</template>

<script setup lang="ts">
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';

const emits = defineEmits(['onDateChanged'])

const props = defineProps({
    option: {
        type: Object as PropType<IWaterConsumptionChart>,
        required: true
    },
})

const onDateChanged = (date: any) => {
    emits('onDateChanged', date)
}


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
        labels: {
            formatter: function (value: number) {
                // Round the value to two decimal places
                return `${value.toFixed(2)}k L`;
            }
        }
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
    colors: ['#46D5E5', '#C578F8', '#86FC5F', '#F729C0'],
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
watchEffect(() => {
    chart4Options.value.series = props.option.chartSeries
})


</script>