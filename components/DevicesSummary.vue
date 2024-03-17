<template>
  <div class="w-full max-h-[340px] bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
    <div class="flex  justify-between items-center">
      <h1 class="font-bold text-lg">Device Clusters</h1>
    </div>
    <div class="flex-1 flex-grow w-full whitespace- flex gap-2 overflow-x-auto">
      <template v-if="deviceStore.hasGroupDevices">
        <NuxtLink :to="`/devices/group/${deviceStore.devicesGroups[0].objectId}`">
          <Card class="overflow-hidden w-full cursor-pointer">
            <CardHeader>
              <CardTitle>{{ deviceStore.devicesGroups[0].name }}</CardTitle>
              <CardDescription>{{ deviceStore.devicesGroups[0].devicesCount }} Device{{
        deviceStore.devicesGroups[0].devicesCount! >= 2 ? 's' : '' }}</CardDescription>
            </CardHeader>
            <CardContent class="px-0 h-full">
              <div v-if="deviceStore.loading_TotalConsumptionByCluster">Loading...</div>
              <template v-else>
                <apexchart :key="chart4Options.series" :options="chart4Options" :series="chart4Options.series">
                </apexchart>
              </template>
            </CardContent>
          </Card>
        </NuxtLink>


        <NuxtLink to="/devices/group">
          <div class="bg-gray-100 flex justify-center items-center px-5 rounded-xl cursor-pointer h-full">
            <p class="font-bold text-xl">+{{ deviceStore.devicesGroups.length - 1 }}</p>
          </div>
        </NuxtLink>

      </template>

      <template v-else-if="deviceStore.loading_DevicesGroup">
        <p>Loading Clusters...</p>
      </template>

      <template v-else>
        <div>
          <p>No Cluster</p>
        </div>
      </template>



    </div>
  </div>
</template>

<script setup lang="ts">
import { any } from 'zod';
import { useDeviceStore } from '~/stores/device/device.store';


const deviceStore = useDeviceStore()
const clusterSummaryChartData = ref([])

onBeforeMount(() => {
  // TODO!: THIS MUST BE THE ORGANISATION GROUP INSTEAD OF USER GROUP
  deviceStore.getUserDeviceGroup();
  deviceStore.getDeviceSummaryConsumptionTrend("2024-03-01T00:00:00.000Z", "2024-03-31T23:59:00.000Z");

})


// CHART SETTTINGS
const chart4Options = ref({

  chart: {
    type: 'area',
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
    show: false,
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
  colors: ['#46DAE5'],
  legend: {
    show: false, // Hide the legend
  },
});

// Function to generate random data for the last n days
function generateRandomData(days: any) {
  const currentDate = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const consumption = Math.random() * 5; // Random consumption between 0 and 5
    data.push({ x: date.getTime(), y: consumption });
  }

  return data;
}
// end of CHART SETTING


// Used to watch for changes and update the charts 
watchEffect(() => {
  if (deviceStore.success_TotalConsumptionByCluster) {
    chart4Options.value.series = deviceStore.summaryClusterConsumptionTrend
  }

})


</script>