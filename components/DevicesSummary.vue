<template>
    <div class="w-full max-h-[340px] bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
        <div class="flex  justify-between items-center">
            <h1 class="font-bold text-lg">Device Groups</h1>
        </div>
        <div class="flex-1 flex-grow w-full whitespace- flex gap-2 overflow-x-auto">
            <!-- <DeviceCard @click="openDeviceDrawer"  v-for="i in 3"></DeviceCard> -->
            <Card class="overflow-hidden w-full">
                <CardHeader>
                    <CardTitle>Big Ben</CardTitle>
                    <CardDescription>2 Devices</CardDescription>
                </CardHeader>
                <CardContent class="px-0 h-full">
                    <apexchart :key="chart4Options.series" :options="chart4Options"
                        :series="chart4Options.series">
                    </apexchart>
                </CardContent>
            </Card>
            
            <div class="bg-gray-100 flex justify-center items-center px-5 rounded-xl">
                <p class="font-bold text-xl">+3</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">


const openDeviceDrawer = () => {
    const drawer = document.getElementById("deviceDrawer");
    drawer?.click()
}

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
    show:false,
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
function generateRandomData(days:any) {
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

</script>