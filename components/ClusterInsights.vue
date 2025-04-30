<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <!-- Total Consumption Card -->
    <Card class="bg-white shadow-none border-[0.5px]">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Total Consumption</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center">
          <div class="mr-2">
            <DropletIcon class="h-10 w-10 text-blue-500" />
          </div>
          <div class="flex flex-col gap-2" v-if="statusClusterConsumption === 'pending'" >
             <Skeleton class="h-2 w-20" />
             <Skeleton class="h-5 w-30" />
             <Skeleton class="h-2 w-50" />
            </div>
          <div v-else>

            <div class="text-2xl font-bold">{{ clusterConsumption?.total }} {{ clusterConsumption?.unit }}</div>
            <p class="text-xs text-muted-foreground flex items-center">
              <span :class="clusterConsumption?.percentageChange ?? 0 >= 0 ? 'text-red-500' : 'text-green-500'" class="flex items-center">
                <TrendingUpIcon v-if="1 >= 0" class="h-3 w-3 mr-1" />
                <TrendingDownIcon v-else class="h-3 w-3 mr-1" />
                {{ clusterConsumption?.percentageChange ?? 0}}%
              </span>
              <span class="ml-1">saved vs previous period</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

      <!-- Average Daily Consumption Card -->
      <Card class="bg-white shadow-none border-[0.5px]">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Average Daily Consumption</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center">
          <div class="mr-2">
            <DropletIcon class="h-10 w-10 text-blue-500" />
          </div>
          <div class="flex flex-col gap-2" v-if="averageStatus === 'pending'" >
             <Skeleton class="h-2 w-20" />
             <Skeleton class="h-5 w-30" />
             <Skeleton class="h-2 w-50" />
            </div>
          <div v-else>
            <div class="text-2xl font-bold">{{ averageConsumption?.averageDailyConsumption }} {{ averageConsumption?.unit }}/day</div>
            <p class="text-xs text-muted-foreground flex items-center">
              <span :class="1 >= 0 ? 'text-red-500' : 'text-green-500'" class="flex items-center">
                <TrendingUpIcon v-if="1 >= 0" class="h-3 w-3 mr-1" />
                <TrendingDownIcon v-else class="h-3 w-3 mr-1" />
                {{ Math.abs(0).toFixed(1) }}%
              </span>
              <span class="ml-1">vs previous period</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Leakage Risk Card -->
    <Card class="bg-white shadow-none border-[0.5px]">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">
          <div class="flex justify-between">
            <p>Leakage Risk</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" class="flex items-center gap-1 border-orange-500 border-[0.5px]">
                    <FlaskConicalIcon class="h-3 w-3" />
                    Experimental
                  </Badge>
                </TooltipTrigger>
                <TooltipContent class="max-w-xs">
                  <p>This feature is experimental and the values shown may not be accurate. Please do not use this data in any official reports until the feature is fully released and stable.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col">
          <div class="flex items-center mb-2">
            <div class="mr-2">
              <AlertTriangleIcon class="h-10 w-10" :class="{
                'text-green-500': leakageRisk === 'Low',
                'text-orange-500': leakageRisk === 'Medium',
                'text-red-500': leakageRisk === 'High'
              }" />
            </div>
            <div class="text-2xl font-bold" :class="{
              'text-green-500': leakageRisk === 'Low',
              'text-orange-500': leakageRisk === 'Medium',
              'text-red-500': leakageRisk === 'High'
            }">{{ leakageRisk }}</div>
          </div>
          <p class="text-sm text-gray-600">Based on {{ leakageRiskReason }}</p>
          <p class="text-sm font-medium mt-1" :class="{
            'text-green-600': leakageRiskChange <= 0,
            'text-red-600': leakageRiskChange > 0
          }">
            {{ leakageRiskChange > 0 ? '+' : '' }}{{ leakageRiskChange }}% from last check
          </p>
        </div>
      </CardContent>
    </Card>


  </div>

  <!-- Detailed Insights -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">


    <!-- Anomaly Detection -->
    <Card class="bg-white shadow-none border-[0.5px]">
      <CardHeader>
        <CardTitle class="font-bold text-lg">
          <div class="flex justify-between">
            <p> Anomaly Detection</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" class="flex items-center gap-1 border-orange-500 border-[0.5px]">
                    <FlaskConicalIcon class="h-3 w-3" />
                    Experimental
                  </Badge>
                </TooltipTrigger>
                <TooltipContent class="max-w-xs">
                  <p>This feature is experimental and the values shown may not be accurate. Please do not use this data in any official reports until the feature is fully released and stable.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
         </CardTitle>
        <CardDescription>Unusual consumption patterns detected</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="false" class="flex justify-center items-center h-40">
          <Loader2Icon class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else>
          <div v-if="anomalies.length === 0" class="flex flex-col items-center justify-center h-40 text-center">
            <CheckCircleIcon class="h-12 w-12 text-green-500 mb-2" />
            <p class="text-sm text-muted-foreground">No anomalies detected in this period</p>
          </div>
          <ul v-else class="space-y-2">
            <li v-for="(anomaly, index) in anomalies" :key="index" class="flex items-start space-x-2 p-2 rounded bg-red-50">
              <AlertCircleIcon class="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p class="text-sm font-medium">{{ anomaly.title }}</p>
                <p class="text-xs text-muted-foreground">{{ anomaly.description }}</p>
                <p class="text-xs text-muted-foreground">{{ useRelativeDateHuman(new Date(anomaly.date)) }}</p>
              </div>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <!-- Recommendations -->
  <Card class="bg-white shadow-none border-[0.5px]">
    <CardHeader>
      <CardTitle class="font-bold text-lg">
        <div class="flex justify-between">
            <p> Recommendations</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" class="flex items-center gap-1 border-orange-500 border-[0.5px]">
                    <FlaskConicalIcon class="h-3 w-3" />
                    Experimental
                  </Badge>
                </TooltipTrigger>
                <TooltipContent class="max-w-xs">
                  <p>This feature is experimental and the values shown may not be accurate. Please do not use this data in any official reports until the feature is fully released and stable.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div></CardTitle>
      <CardDescription>Suggestions to improve efficiency</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="false" class="flex justify-center items-center h-20">
        <Loader2Icon class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <div v-else>
        <div v-if="recommendations.length === 0" class="flex flex-col items-center justify-center h-40 text-center">
            <CheckCircleIcon class="h-12 w-12 text-green-500 mb-2" />
            <p class="text-sm text-muted-foreground">No recommendations available for this period</p>
          </div>
        <ul v-else class="space-y-2">
          <li v-for="(recommendation, index) in recommendations" :key="index" class="flex items-start space-x-2 p-2 rounded bg-blue-50">
            <LightbulbIcon class="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p class="text-sm font-medium">{{ recommendation.title }}</p>
              <p class="text-xs text-muted-foreground">{{ recommendation.description }}</p>
            </div>
          </li>
        </ul>
      </div>
    </CardContent>
  </Card>
  </div>

   <!-- Usage Patterns -->
   <Card class="bg-white shadow-none border-[0.5px]">
      <CardHeader>
        <CardTitle class="font-bold text-lg">Daily Consumption</CardTitle>
        <CardDescription>Water usage and collection for the current week</CardDescription>
      </CardHeader>
      <CardContent class="h-[300px]">
        <div v-if="dailyChartStatus === 'pending'" class="flex justify-center items-center h-full">
          <Loader2Icon class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else-if="!hasDailyData" class="flex flex-col items-center justify-center h-full text-center">
          <ChartLineIcon class="h-12 w-12 text-gray-300 mb-2" />
          <p class="text-sm text-muted-foreground">No usage data available for this period</p>
          <p class="text-xs text-muted-foreground mt-1">Try adjusting your date range</p>
        </div>
        <ClientOnly v-else>
          <apexchart height="100%" width="100%" :options="dailyChartOptions" :series="dailyChartSeries" />
        </ClientOnly>
      </CardContent>
    </Card>


</template>

<script setup lang="ts">
import {
  DropletIcon,
  AlertTriangle as AlertTriangleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  Loader2Icon,
  CheckCircleIcon,
  AlertCircleIcon,
  LightbulbIcon,
  ChartLine as ChartLineIcon,
  FlaskConical as FlaskConicalIcon
} from 'lucide-vue-next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useConsumptionStore } from '~/stores/consumption/consumption.store';

const props = defineProps<{
  clusterId: string;
}>();

const consumptionStore = useConsumptionStore();

//Get total cluster consumption
const {data:clusterConsumption, refresh:clusterConsumptionRefresh,status:statusClusterConsumption} = await useAsyncData('clusterConsumption', () => consumptionStore.getTotalWaterConsumption(consumptionStore.insightsPeriod,{clusterId : props.clusterId}), { lazy: true, immediate: true })

//Get the average daily consumption
const {data:averageConsumption, refresh:averageRefresh,status:averageStatus} = await useAsyncData('clusterAverageDailyConsumption', () => consumptionStore.getAverageDailyConsumption( consumptionStore.insightsPeriod,{clusterId : props.clusterId}), { lazy: true, immediate: true })

// Fetch daily consumption data for the chart
const { data: dailyConsumptionData, refresh: refreshDailyData, status: dailyChartStatus } = await useAsyncData('dailyConsumptionTrend', () =>
  consumptionStore.getConsumptionTrend(
    consumptionStore.dailyPeriod,{
    clusterId: props.clusterId,
  }),
  { lazy: true, immediate: true }
);


// Define types for anomalies and recommendations
interface Anomaly {
  title: string;
  description: string;
  date: string;
}

interface Recommendation {
  title: string;
  description: string;
}

const anomalies = ref<Anomaly[]>([]);
const recommendations = ref<Recommendation[]>([]);
const leakageRisk = ref('Medium');
const leakageRiskReason = ref('Increased usage in the last week');
const leakageRiskChange = ref(10);

// Computed properties for the daily chart
const hasDailyData = computed(() => {
  return (dailyConsumptionData.value && dailyConsumptionData.value.length > 0)
});

// Process the daily chart data
const dailyChartSeries = computed(() => {
  const series = [];

  // Add Water Used series if data is available
  if (dailyConsumptionData.value && dailyConsumptionData.value.length > 0) {
    series.push({
      name: 'Water Used',
      type: 'column',
      data: dailyConsumptionData.value.map(point => ({
        x: new Date(point.date_bin).getTime(),
        y: point.total_consumption_change
      }))
    });
  }

  return series;
});

// Chart options for the daily chart
const dailyChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: { show: true },
    animations: { enabled: true },
    stacked: false
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4,
      distributed: false
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    title: {
      text: 'Date'
    },
    labels: {
      format: 'dd MMM', // Simple day and month format
      rotateAlways: false
    },
    tickAmount: 7 // Ensure we show all 7 days
  },
  yaxis: {
    title: {
      text: 'Volume (L)'
    },
    labels: {
      formatter: (value: number) => `${Math.round(value)}`
    }
  },
  tooltip: {
    shared: true,
    intersect: false,
    x: {
      format: 'dd MMM yyyy' // Simple day, month, and year format
    },
    y: {
      formatter: (value: number) => `${Math.round(value)} L`
    }
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center'
  },
  colors: ['#FF5252', '#2196F3'], // Red for Water Used, Blue for Water Collected
  grid: {
    borderColor: '#e0e0e0',
    row: {
      colors: ['#f8f9fa', 'transparent'],
      opacity: 0.5
    }
  }
}));


// Listen to when the dates change and refresh
watch(
  () =>  
    consumptionStore.insightsPeriod,
  
  async () => {
    clusterConsumptionRefresh();
    averageRefresh();
  },
  { immediate: true, deep:true }
);




</script>
