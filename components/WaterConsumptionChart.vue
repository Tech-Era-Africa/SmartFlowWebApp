<template>
    <div class="w-full max-h-[340px] h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="font-bold text-lg">{{ option.title ?? 'Water Consumption' }}</h1>
                <p class="text-xs text-muted-foreground">{{ option.subtitle }}</p>
            </div>
            <div class="flex gap-2 items-center">
                <Select :model-value="trendPeriod" @update:model-value="onDateChanged($event)">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="week">
                                This Week
                            </SelectItem>
                            <SelectItem value="month">
                                This Month
                            </SelectItem>
                            <SelectItem value="year">
                                This Year
                            </SelectItem>
                            <SelectItem value="custom">
                                Custom
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <!-- <DateRangePicker @handle-date-change="onDateChanged"></DateRangePicker> -->

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

const trendPeriod = ref('month')

const onDateChanged = (period: string) => {
    const currentDate = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
        case 'month':
            trendPeriod.value = period
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            break;
        case 'week':
            trendPeriod.value = period
            const firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // Assuming Sunday is the first day of the week
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDayOfWeek);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDayOfWeek + 6);
            break;
        case 'year':
            trendPeriod.value = period
            startDate = new Date(currentDate.getFullYear(), 0, 1);
            endDate = new Date(currentDate.getFullYear(), 11, 31);
            break;
        default:
            // Default to month if period is not recognized
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }

    emits('onDateChanged', {
        start: startDate,
        end: endDate
    });
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