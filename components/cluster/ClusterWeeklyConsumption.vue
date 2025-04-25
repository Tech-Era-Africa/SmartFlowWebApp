<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAsyncData } from '#app';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';
import { ChartLine } from 'lucide-vue-next';
import { useConsumptionStore } from '~/stores/consumption/consumption.store';

const props = defineProps<{
  option: IWaterConsumptionChart;
  clusterId: string;
}>();

const consumptionStore = useConsumptionStore();

// Set date range for current week (Monday to Sunday)
const weekStartDate = ref('');
const weekEndDate = ref('');

const setCurrentWeekDateRange = () => {
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

  // Store dates locally instead of in the global store
  weekStartDate.value = startDate.toISOString().split('T')[0];
  weekEndDate.value = endDate.toISOString().split('T')[0];
};

// Fetch water usage trend data with a unique key that includes the clusterId
const { data: usageChartSeries, refresh: refreshUsage, status: usageStatus, error: usageError } = useAsyncData(
  'clusterWeeklyUsage_' + props.clusterId + '_' + Date.now(), // Add timestamp to ensure uniqueness
  async () => {
    // Set the date range first
    setCurrentWeekDateRange();

    return await consumptionStore.getConsumptionTrend({
      clusterId: props.clusterId,
      consumption_type: 1, // 1 for usage
      startDate: weekStartDate.value,
      endDate: weekEndDate.value
    });
  },
  { immediate: true, lazy: true }
);

// Fetch water collection trend data with a unique key that includes the clusterId
const { data: collectionChartSeries, refresh: refreshCollection, status: collectionStatus, error: collectionError } = useAsyncData(
  'clusterWeeklyCollection_' + props.clusterId + '_' + Date.now(), // Add timestamp to ensure uniqueness
  async () => {
    // Use the same date range as the usage data
    return await consumptionStore.getConsumptionTrend({
      clusterId: props.clusterId,
      consumption_type: 2, // 2 for collection
      startDate: weekStartDate.value,
      endDate: weekEndDate.value
    });
  },
  { immediate: true, lazy: true }
);

// Combined status for loading state
const status = computed(() => {
  if (usageStatus.value === 'pending' || collectionStatus.value === 'pending') {
    return 'pending';
  }
  return 'success';
});

// Combined refresh function
const refresh = () => {
  refreshUsage();
  refreshCollection();
};

// Process the chart data
const processedChartSeries = computed(() => {
  const series = [];

  // Add Water Used series if data is available
  if (usageChartSeries.value && usageChartSeries.value.length > 0) {
    series.push({
      name: 'Water Used',
      data: usageChartSeries.value.map(point => ({
        x: new Date(point.date_bin).getTime(),
        y: point.total_consumption_change
      }))
    });
  }

  // Add Water Collected series if data is available
  if (collectionChartSeries.value && collectionChartSeries.value.length > 0) {
    series.push({
      name: 'Water Collected',
      data: collectionChartSeries.value.map(point => ({
        x: new Date(point.date_bin).getTime(),
        y: point.total_consumption_change
      }))
    });
  }

  return series;
});

const hasData = computed(() => {
  return (usageChartSeries.value && usageChartSeries.value.length > 0) ||
         (collectionChartSeries.value && collectionChartSeries.value.length > 0);
});

// Listen to when the dates change and refresh
consumptionStore.$subscribe((_, state) => {
  if (state.startDate || state.endDate) {
    refresh();
  }
});

// Current week date range for display
const currentWeekRange = computed(() => {
  if (!weekStartDate.value || !weekEndDate.value) {
    setCurrentWeekDateRange();
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return `${formatDate(weekStartDate.value)} - ${formatDate(weekEndDate.value)}`;
});

// Chart options
const chartOptions = computed(() => ({
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
      format: 'dd MMM',
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
      format: 'dd MMM yyyy'
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
  },
  markers: {
    size: 4,
    hover: {
      size: 6
    }
  }
}));

// No need to set the date range on mount as we're doing it in the API calls
</script>

<template>
  <div :class="$attrs.class" class="w-full h-full bg-white rounded-xl p-5 flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="font-bold text-lg">{{ option.title ?? 'Weekly Consumption' }}</h1>
        <p class="text-xs text-muted-foreground">{{ currentWeekRange }}</p>
      </div>
    </div>
    <div v-if="status === 'pending'" class="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg">
      <!-- Placeholder Chart -->
      <div class="relative w-full h-[300px] bg-white rounded-lg overflow-hidden animate-pulse">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>
        <svg class="w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <!-- Placeholder Lines -->
          <path
            d="M0 250 C100 200, 200 150, 400 250"
            stroke="rgba(200, 200, 200, 0.6)"
            stroke-width="2"
            fill="none"
          />
          <path
            d="M0 200 C100 150, 200 200, 400 200"
            stroke="rgba(200, 200, 200, 0.6)"
            stroke-width="2"
            fill="none"
          />
          <!-- X-Axis and Y-Axis -->
          <line x1="50" y1="280" x2="350" y2="280" stroke="rgba(200, 200, 200, 0.6)" stroke-width="1" />
          <line x1="50" y1="280" x2="50" y2="20" stroke="rgba(200, 200, 200, 0.6)" stroke-width="1" />
        </svg>
      </div>

      <!-- Loading Spinner -->
      <div class="mt-4 flex items-center gap-2">
        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        <p class="text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
    <div v-else-if="!hasData" class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div class="text-center">
        <ChartLine class="text-gray-400 text-4xl mb-2 mx-auto" />
        <p class="text-muted-foreground text-sm font-medium">No data available for the current week</p>
        <p class="text-muted-foreground text-xs mt-1">Try checking back later</p>
      </div>
    </div>
    <ClientOnly v-else>
      <apexchart height="100%" width="100%" :options="chartOptions" :series="processedChartSeries">
      </apexchart>
    </ClientOnly>
  </div>
</template>
