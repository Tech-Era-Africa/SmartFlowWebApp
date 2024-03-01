<template>
    <div class="w-full min-h-[300px] bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <h1 class="font-bold text-lg">{{ option.title ?? 'Water Consumption' }}</h1>
            <!-- <button class="btn">
                This Year
                <Icon name="material-symbols:calendar-month-outline" />
            </button> -->
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
    height: 50,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  series: [
    {
      name: 'Consumption',
      data: generateRandomData(30), // Generate random data for the last 30 days
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
    type: 'datetime',
  },
  yaxis: {
    show: false, // Hide the y-axis
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100],
    },
  },
  colors: ['#0080F0'],
  legend: {
    show: false, // Hide the legend
  },
});

// Function to generate random data for the last n days
function generateRandomData(days:any) {
  const currentDate = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const consumption = Math.random() * 10; // Random consumption between 0 and 5
    data.push({ x: date.getTime(), y: consumption });
  }

  return data;
}




</script>