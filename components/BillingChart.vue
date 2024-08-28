<template>
    <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <h1 class="font-bold text-lg">Water Bill Trend</h1>
            <button class="btn">
                Monthly
                <Icon name="material-symbols:calendar-month-outline" />
            </button>
        </div>
        <!-- <ClientOnly>
            <apexchart :key="chart4Options.series" height="100%" width="100%" :options="chart4Options"
                :series="chart4Options.series">
            </apexchart>
        </ClientOnly> -->
    </div>
</template>

<script setup lang="ts">

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
    series: [
        {
            name: 'Water Consumption',
            data: [12, 2, 5 ,6,8],
        },
        {
            name: 'Water Bill',
            data: [0, 5 , 20 ,10, 5],
        },
    ],
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
        labels: {
            formatter: function (value: number) {
                // Round the value to two decimal places
                return `GHC${value.toFixed(2)}`;
            }
        }
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