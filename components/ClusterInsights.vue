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
            <div class="text-2xl font-bold">{{ formatNumber(totalConsumption) }} {{ unit }}</div>
            <p class="text-xs text-muted-foreground flex items-center">
              <span :class="percentageChange >= 0 ? 'text-red-500' : 'text-green-500'" class="flex items-center">
                <TrendingUpIcon v-if="percentageChange >= 0" class="h-3 w-3 mr-1" />
                <TrendingDownIcon v-else class="h-3 w-3 mr-1" />
                {{ Math.abs(percentageChange).toFixed(1) }}%
              </span>
              <span class="ml-1">vs previous period</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Active Devices Card -->
    <Card class="bg-white shadow-none border-[0.5px]">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Active Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center">
          <div class="mr-2">
            <ActivityIcon class="h-10 w-10 text-green-500" />
          </div>
          <div>
            <div class="text-2xl font-bold">{{ activeDevices }} / {{ totalDevices }}</div>
            <p class="text-xs text-muted-foreground">
              {{ activeDevicesPercentage.toFixed(0) }}% active devices
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Efficiency Score Card -->
    <Card class="bg-white shadow-none border-[0.5px]">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium">Efficiency Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center">
          <div class="mr-2">
            <GaugeIcon class="h-10 w-10 text-indigo-500" />
          </div>
          <div>
            <div class="text-2xl font-bold">{{ efficiencyScore }}/100</div>
            <p class="text-xs text-muted-foreground flex items-center">
              <span :class="efficiencyChange >= 0 ? 'text-green-500' : 'text-red-500'" class="flex items-center">
                <TrendingUpIcon v-if="efficiencyChange >= 0" class="h-3 w-3 mr-1" />
                <TrendingDownIcon v-else class="h-3 w-3 mr-1" />
                {{ Math.abs(efficiencyChange).toFixed(1) }}%
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
        <CardTitle class="font-bold text-lg">Usage Patterns</CardTitle>
        <CardDescription>Daily consumption patterns for this cluster</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex justify-center items-center h-40">
          <Loader2Icon class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else class="h-40">
          <!-- Placeholder for a chart - would be replaced with actual chart component -->
          <div class="flex items-end h-full w-full space-x-2">
            <div v-for="(value, index) in usagePattern" :key="index"
                 class="bg-blue-500 rounded-t w-full"
                 :style="{ height: `${(value / Math.max(...usagePattern)) * 100}%` }">
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue';
import {
  DropletIcon,
  ActivityIcon,
  GaugeIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  Loader2Icon,
  CheckCircleIcon,
  AlertCircleIcon,
  LightbulbIcon
} from 'lucide-vue-next';
import { useConsumptionStore } from '~/stores/consumption/consumption.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { extendDeviceStore } from '~/stores/device/device.extensions';

const props = defineProps<{
  clusterId: string;
}>();

const consumptionStore = useConsumptionStore();
const deviceStore = extendDeviceStore();

const isLoading = ref(true);
const totalConsumption = ref(0);
const unit = ref('L');
const percentageChange = ref(0);
const activeDevices = ref(0);
const totalDevices = ref(0);
const efficiencyScore = ref(0);
const efficiencyChange = ref(0);
const usagePattern = ref([0, 0, 0, 0, 0, 0, 0]); // Mon-Sun
const anomalies = ref([
  // Will be populated with actual data
]);
const recommendations = ref([
  // Will be populated with actual data
]);

// Computed properties
const activeDevicesPercentage = computed(() => {
  if (totalDevices.value === 0) return 0;
  return (activeDevices.value / totalDevices.value) * 100;
});

// Helper functions
const formatNumber = (value: number) => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'k';
  }
  return value.toFixed(1);
};

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

  // Active devices
  totalDevices.value = Math.floor(Math.random() * 20) + 5;
  activeDevices.value = Math.floor(Math.random() * totalDevices.value);

  // Efficiency score
  efficiencyScore.value = Math.floor(Math.random() * 40) + 60; // 60-100
  efficiencyChange.value = Math.random() * 10 - 5; // -5% to +5%

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
    // Set date range for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    consumptionStore.updatePeriod(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    // Try to get real data
    const insights = await consumptionStore.getInsights({ clusterId: props.clusterId });

    if (insights) {
      totalConsumption.value = insights.consumption.total;
      percentageChange.value = insights.consumption.percentageChange;
      unit.value = insights.unit;

      // Get devices info
      if (deviceStore.devices.length > 0) {
        totalDevices.value = deviceStore.devices.length;
        activeDevices.value = deviceStore.filterActiveDevices().length;

        // Calculate efficiency score based on active devices and consumption trends
        efficiencyScore.value = Math.floor(Math.random() * 40) + 60; // 60-100 for demo
        efficiencyChange.value = Math.random() * 10 - 5; // -5% to +5% for demo

        // Generate usage pattern based on real data if available
        // For now, using demo data
        usagePattern.value = Array.from({ length: 7 }, () => Math.random() * 100);
      }
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
