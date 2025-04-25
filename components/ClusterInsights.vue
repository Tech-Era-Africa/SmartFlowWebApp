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
          <div>

            <div class="text-2xl font-bold">{{ clusterConsumption?.total }} {{ clusterConsumption?.unit }}</div>
            <p class="text-xs text-muted-foreground flex items-center">
              <span :class="clusterConsumption?.percentageChange ?? 0 >= 0 ? 'text-red-500' : 'text-green-500'" class="flex items-center">
                <TrendingUpIcon v-if="percentageChange >= 0" class="h-3 w-3 mr-1" />
                <TrendingDownIcon v-else class="h-3 w-3 mr-1" />
                {{ clusterConsumption?.percentageChange ?? 0}}%
              </span>
              <span class="ml-1">saved vs yesterday</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Leakage Risk Card -->
    <Card class="bg-white shadow-none border-[0.5px] opacity-45">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">
          <div class="flex justify-between">
            <p>Leakage Risk</p>
            <Badge variant="outline">Coming Soon</Badge>
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
          <div>
            <div class="text-2xl font-bold">{{ averageConsumption?.averageDailyConsumption }} {{ averageConsumption?.unit }}/day</div>
            <p class="text-xs text-muted-foreground flex items-center">
              <span :class="avgDailyChange >= 0 ? 'text-red-500' : 'text-green-500'" class="flex items-center">
                <TrendingUpIcon v-if="avgDailyChange >= 0" class="h-3 w-3 mr-1" />
                <TrendingDownIcon v-else class="h-3 w-3 mr-1" />
                {{ Math.abs(avgDailyChange).toFixed(1) }}%
              </span>
              <span class="ml-1">vs previous period</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Detailed Insights -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

    <!-- Anomaly Detection -->
    <Card class="bg-white shadow-none border-[0.5px]">
      <CardHeader>
        <CardTitle class="font-bold text-lg">Anomaly Detection</CardTitle>
        <CardDescription>Unusual consumption patterns detected</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex justify-center items-center h-40">
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
                <p class="text-xs text-muted-foreground">{{ formatDate(anomaly.date) }}</p>
              </div>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Recommendations -->
  <Card class="bg-white shadow-none border-[0.5px]">
    <CardHeader>
      <CardTitle class="font-bold text-lg">Recommendations</CardTitle>
      <CardDescription>Suggestions to improve efficiency</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading" class="flex justify-center items-center h-20">
        <Loader2Icon class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <div v-else>
        <ul class="space-y-2">
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import {
  DropletIcon,
  AlertTriangle as AlertTriangleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  Loader2Icon,
  CheckCircleIcon,
  AlertCircleIcon,
  LightbulbIcon,
  ChartLine as ChartLineIcon
} from 'lucide-vue-next';
import { useConsumptionStore } from '~/stores/consumption/consumption.store';
import { useClusterStore } from '~/stores/cluster/cluster.store';

const props = defineProps<{
  clusterId: string;
}>();

const consumptionStore = useConsumptionStore();
const clusterStore = useClusterStore();

//Get total cluster consumption
const {data:clusterConsumption, refresh:clusterConsumptionRefresh,status:statusClusterConsumption} = await useAsyncData('clusterConsumption', () => consumptionStore.getTotalWaterConsumption({clusterId : props.clusterId}), { lazy: true, immediate: true })

//Get the average daily consumption
const {data:averageConsumption, refresh:averageRefresh,status:averageStatus} = await useAsyncData('clusterAverageDailyConsumption', () => consumptionStore.getAverageDailyConsumption({clusterId : props.clusterId}), { lazy: true, immediate: true })

// Fetch daily consumption data for the chart
const { data: dailyConsumptionData, refresh: refreshDailyData, status: dailyChartStatus } = await useAsyncData('dailyConsumptionTrend', () =>
  consumptionStore.getConsumptionTrend({
    clusterId: props.clusterId,
  }),
  { lazy: true, immediate: true }
);

const isLoading = ref(true);
const totalConsumption = ref(0);
const unit = ref('L');
const percentageChange = ref(0);

// Watch for changes in clusterConsumption and update the store
watch(() => clusterConsumption.value, (newValue) => {
  if(newValue) {
    clusterStore.updateSelectedClusterTotalConsumption(newValue.total)
  }
}, { immediate: true })

// Leakage risk variables
const leakageRisk = ref('Medium'); // 'Low', 'Medium', 'High'
const leakageRiskReason = ref('unusual nighttime flow');
const leakageRiskChange = ref(1.5); // Percentage change from last check

// Average daily consumption variables
const avgDailyConsumption = ref(0);
const avgDailyChange = ref(0);

// Keeping for backward compatibility
const activeDevices = ref(0);
const totalDevices = ref(0);
const usagePattern = ref([0, 0, 0, 0, 0, 0, 0]); // Mon-Sun

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

// Helper function for date formatting

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Generate random data for demo purposes
const generateDemoData = () => {
  // Total consumption
  totalConsumption.value = Math.random() * 5000 + 1000;
  percentageChange.value = Math.random() * 20 - 10; // -10% to +10%

  // Leakage risk data
  const riskLevel = Math.random();
  if (riskLevel < 0.3) {
    leakageRisk.value = 'Low';
  } else if (riskLevel < 0.7) {
    leakageRisk.value = 'Medium';
  } else {
    leakageRisk.value = 'High';
  }

  // Leakage risk reason
  const reasons = ['unusual nighttime flow', 'continuous flow detected', 'pressure fluctuations'];
  leakageRiskReason.value = reasons[Math.floor(Math.random() * reasons.length)];

  // Leakage risk change
  leakageRiskChange.value = Math.round((Math.random() * 4 - 1) * 10) / 10; // -1.0% to +3.0%

  // Legacy device data (keeping for backward compatibility)
  totalDevices.value = Math.floor(Math.random() * 20) + 5;
  activeDevices.value = Math.floor(Math.random() * totalDevices.value);

  // Average daily consumption
  avgDailyConsumption.value = totalConsumption.value / 30; // Assuming 30 days in a month
  avgDailyChange.value = Math.random() * 20 - 10; // -10% to +10%

  // Usage pattern (Mon-Sun)
  usagePattern.value = Array.from({ length: 7 }, () => Math.random() * 100);

  // Anomalies
  if (Math.random() > 0.5) {
    anomalies.value = [
      {
        title: 'Unusual consumption spike',
        description: 'Consumption increased by 45% on Tuesday',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    if (Math.random() > 0.7) {
      anomalies.value.push({
        title: 'Potential leak detected',
        description: 'Continuous flow detected during non-usage hours',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  } else {
    anomalies.value = [];
  }

  // Recommendations
  recommendations.value = [
    {
      title: 'Optimize usage times',
      description: 'Shift non-essential water usage to off-peak hours (10 PM - 6 AM)'
    }
  ];

  if (Math.random() > 0.3) {
    recommendations.value.push({
      title: 'Check for leaks',
      description: 'Several devices show continuous low-level consumption'
    });
  }

  if (Math.random() > 0.6) {
    recommendations.value.push({
      title: 'Reduce weekend consumption',
      description: 'Weekend usage is 35% higher than weekday usage'
    });
  }
};

// Fetch real data or use demo data
const fetchInsights = async () => {
  isLoading.value = true;

  try {
    // Set date range for current week (Monday to Sunday)
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate days to subtract to get to Monday (if today is Sunday, go back 6 days)
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;

    const startDate = new Date(now);
    startDate.setDate(now.getDate() - daysToMonday);
    startDate.setHours(0, 0, 0, 0); // Start of Monday

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999); // End of Sunday

    consumptionStore.updatePeriod(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    // Refresh the daily chart data
    refreshDailyData();

    // Try to get real data
    const insights = await consumptionStore.getInsights({ clusterId: props.clusterId });

    if (insights) {
      totalConsumption.value = insights.consumption.total;
      percentageChange.value = insights.consumption.percentageChange;
      unit.value = insights.unit;

      // Calculate leakage risk based on consumption patterns
      const nighttimeUsage = insights.consumption.total * 0.15; // Assume 15% of usage is at night

      // Determine risk level based on nighttime usage
      if (nighttimeUsage < 100) {
        leakageRisk.value = 'Low';
      } else if (nighttimeUsage < 300) {
        leakageRisk.value = 'Medium';
      } else {
        leakageRisk.value = 'High';
      }

      // Set reason based on risk level
      if (leakageRisk.value === 'High') {
        leakageRiskReason.value = 'continuous flow detected';
      } else {
        leakageRiskReason.value = 'unusual nighttime flow';
      }

      // Calculate change from last check (random for demo)
      leakageRiskChange.value = Math.round((Math.random() * 4 - 1) * 10) / 10; // -1.0% to +3.0%

      // Calculate average daily consumption
      // Get the number of days in the selected period
      const startDate = new Date(consumptionStore.startDate || '');
      const endDate = new Date(consumptionStore.endDate || '');
      const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

      // Calculate average daily consumption
      avgDailyConsumption.value = totalConsumption.value / daysDiff;
      avgDailyChange.value = Math.random() * 20 - 10; // -10% to +10% for demo

      // Generate usage pattern based on real data if available
      usagePattern.value = Array.from({ length: 7 }, () => Math.random() * 100);
    }

    // For now, still use demo data for the rest
    generateDemoData();

  } catch (error) {
    console.error('Failed to fetch insights:', error);
    // Fallback to demo data
    generateDemoData();
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchInsights();
});
</script>
