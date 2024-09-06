<template>
  <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
    <div class="flex flex-col items-start  justify-between">
      <h1 class="font-bold text-lg">Clusters</h1>
      <p class="text-foreground-muted text-xs text-gray-400 flex items-center gap-2">
        <Info :size="14"></Info> Your grouped devices. Eg. Apartment 1
      </p>

    </div>
    <div class="flex gap-2 flex-grow">
      <template v-if="deviceStore.hasGroupDevices">
        <NuxtLink :to="`/devices/group/${deviceStore.devicesGroups[0].objectId}`" class="w-full">
          <Card class="overflow-hidden h-full cursor-pointer flex-1">
            <CardHeader class="flex flex-row justify-between items-center w-full">
              <div>
                <CardTitle>{{ deviceStore.devicesGroups[0].name }}</CardTitle>
                <CardDescription>
                  <Badge class="mt-2" variant="outline">{{ deviceStore.devicesGroups[0].devicesCount }} Device{{
          deviceStore.devicesGroups[0].devicesCount! >= 2 ? 's' : '' }}</Badge>
                </CardDescription>
              </div>
              <div>
                <PeriodFacetedFilter></PeriodFacetedFilter>
              </div>

            </CardHeader>
            <CardContent class="px-0 h-auto">
              <div v-if="deviceStore.loading_TotalClusterConsumption">
              
                <div class="p-4">
                  <Skeleton class="h-24 w-full" /> 
                  <div class="flex justify-between mt-4">
                    <Skeleton class="h-4 w-1/4" />
                    <Skeleton class="h-4 w-1/4" />
                    <Skeleton class="h-4 w-1/4" />
                  </div>
                  <div class="flex justify-between mt-2">
                    <Skeleton class="h-4 w-1/6" />
                    <Skeleton class="h-4 w-1/6" />
                  </div>
                </div>
              </div>
    
              <template v-else>
                <ClientOnly>
                  <apexchart height="100%"  :key="chartOptions.series" :options="chartOptions" :series="chartOptions.series">
                  </apexchart>
                </ClientOnly>
              </template>
            </CardContent>
          </Card>
        </NuxtLink>


        <NuxtLink to="/devices/group" v-if="deviceStore.devicesGroups.length > 1">
          <div class="bg-gray-100 flex justify-center items-center px-5 rounded-xl cursor-pointer h-full">
            <p class="font-bold text-xl">+{{ deviceStore.devicesGroups.length - 1 }}</p>
          </div>
        </NuxtLink>

      </template>

      <template v-else-if="deviceStore.loading_DevicesGroup">
        <Skeleton class="h-auto" />
      </template>

      <template v-else>
        <div class="flex flex-grow bg-blue-50 items-center justify-center">
          <p>No Cluster</p>
        </div>
      </template>



    </div>
  </div>
</template>

<script setup lang="ts">
import { useDeviceStore } from '~/stores/device/device.store';
import { Info } from 'lucide-vue-next'


const deviceStore = useDeviceStore()
const chartOptions = ref({

  chart: {
    type: 'area',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  series: [],
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
    show: false,
    labels: {
      show: false,
    },
  },
  yaxis: {
    show: false, // Hide the y-axis
    labels: {
      show: false,
      formatter: function (value: number) {
        // Round the value to two decimal places
        return `${value.toFixed(2)} L`;
      }
    }
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
    y: {
      formatter: function (value: any) {
        // Round the value to two decimal places
        return `${value.toFixed(2)} L`;
      }
    }
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
})

const chartIsReady = ref(false)

// Load the devices from the organisation
useAsyncData<any>('deviceGroup', () => deviceStore.getOrgDeviceGroup(), { lazy: true })

onMounted(() => {
  if (deviceStore.devicesGroups.length > 0) {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const endDate = new Date();
    deviceStore.getClusterConsumptionTrend(
      deviceStore.devicesGroups[0].objectId, 
      startDate.toISOString(), 
      endDate.toISOString()
    );
  }
}),



// Handle the response and update the chart
watchEffect(() => {
  if (deviceStore.success_TotalClusterConsumption) {
    chartIsReady.value = true;
    chartOptions.value.series = deviceStore.clusterConsumptionTrend;
  }
});






</script>