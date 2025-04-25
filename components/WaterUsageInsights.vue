<template>
    <div class="w-full h-full bg-white  rounded-xl p-5 flex flex-col gap-4">
        <!-- Header with Period Selector -->
        <div class="flex justify-between items-center mb-4">
            <div>
                <h2 class="text-lg font-bold">Your Water Story</h2>
                <p class="text-xs text-muted-foreground">How your buildings are using and saving water</p>
            </div>
            <PeriodFacetedFilter  />
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center h-64">
            <div class="flex flex-col items-center">
                <div class="h-8 w-8 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-2"></div>
                <p class="text-sm text-muted-foreground">Loading your water data...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
            <div class="h-12 w-12 text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 class="text-lg font-semibold text-red-700">Unable to load your water data</h3>
            <p class="text-sm text-red-600 mb-4">{{ error.message || 'An error occurred while fetching data' }}</p>
            <button @click="refreshData" class="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded">Try Again</button>
        </div>

        <!-- No Data State -->
        <div v-else-if="!hasData" class="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div class="h-12 w-12 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-700">No water data available</h3>
            <p class="text-sm text-gray-600 mb-4">Try selecting a different time period or check your devices.</p>
            <button @click="refreshData" class="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded">Refresh Data</button>
        </div>

        <!-- Content -->
        <div v-else>
            <!-- Water Usage Visualization -->
            <!-- <WaterUsageVisualization /> -->

            <!-- Building Comparison -->
            <BuildingComparison />

            <!-- Water System Health -->
            <!-- <WaterSystemHealth /> -->

            <!-- Ways to Save Water -->
            <!-- <WaterSavingOpportunities /> -->

            <!-- Anomaly Detection -->
            <!-- <SystemAlerts /> -->
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Mock data for the dashboard
const isLoading = ref(false);
const error = ref(null);
const hasData = ref(true);

// Tank level data
const tankLevel = ref(78);

// Water savings percentage
const waterSavingsPercentage = ref(65);



// Water saving ideas
const waterSavingTips = ref([
    {
        title: 'Fix Those Dripping Taps',
        description: 'Those small drips in North Campus add up to a bathtub of water every day! A simple maintenance visit can stop the waste.',
        potentialSavings: '18,000L/month (GHC 2,700)'
    },
    {
        title: 'Catch More Rain',
        description: 'Building C has a huge roof that is perfect for collecting rainwater. Adding more collection tanks would be like adding a small reservoir!',
        potentialSavings: '25,000L/month (GHC 3,750)'
    },
    {
        title: 'Slow the Flow',
        description: 'Some areas have water pressure that is too high, causing splashing and waste. Simple flow regulators can fix this without anyone noticing.',
        potentialSavings: '15,000L/month (GHC 2,250)'
    },
    {
        title: 'Water the Plants Smarter',
        description: 'We can use the water from sinks to water the campus gardens instead of letting it go down the drain. It is better for plants too!',
        potentialSavings: '20,000L/month (GHC 3,000)'
    }
]);

// Cluster comparison data
const clusterData = ref({
    highestConsumption: {
        name: 'North Campus',
        value: 3250
    },
    lowestConsumption: {
        name: 'Admin Building',
        value: 450
    },
    highestCollection: {
        name: 'Main Residence',
        value: 4800
    },
    lowestCollection: {
        name: 'Science Block',
        value: 780
    }
});




// Methods
const handleDateChange = () => {
    refreshData();
};





const refreshData = () => {
    isLoading.value = true;

    // Simulate API call
    setTimeout(() => {
        isLoading.value = false;

        // Randomly update some values to simulate data refresh
        tankLevel.value = Math.min(100, Math.max(10, tankLevel.value + (Math.random() * 20 - 10)));
        waterSavingsPercentage.value = Math.min(100, Math.max(10, waterSavingsPercentage.value + (Math.random() * 10 - 5)));

        waterData.value = {
            ...waterData.value,
            waterSaved: Math.round(waterData.value.waterSaved + (Math.random() * 200 - 100)),
            moneySaved: Math.round((waterData.value.waterSaved * 0.15) * 100) / 100,
            morningUsage: Math.round(waterData.value.morningUsage + (Math.random() * 20 - 10)),
            afternoonUsage: Math.round(waterData.value.afternoonUsage + (Math.random() * 20 - 10)),
            eveningUsage: Math.round(waterData.value.eveningUsage + (Math.random() * 20 - 10))
        };

        // Update cluster comparison data
        clusterData.value = {
            highestConsumption: {
                name: clusterData.value.highestConsumption.name,
                value: Math.round(clusterData.value.highestConsumption.value + (Math.random() * 300 - 150))
            },
            lowestConsumption: {
                name: clusterData.value.lowestConsumption.name,
                value: Math.round(clusterData.value.lowestConsumption.value + (Math.random() * 100 - 50))
            },
            highestCollection: {
                name: clusterData.value.highestCollection.name,
                value: Math.round(clusterData.value.highestCollection.value + (Math.random() * 400 - 200))
            },
            lowestCollection: {
                name: clusterData.value.lowestCollection.name,
                value: Math.round(clusterData.value.lowestCollection.value + (Math.random() * 150 - 75))
            }
        };

        // Ensure values don't go below reasonable minimums
        clusterData.value.lowestConsumption.value = Math.max(100, clusterData.value.lowestConsumption.value);
        clusterData.value.lowestCollection.value = Math.max(200, clusterData.value.lowestCollection.value);
        clusterData.value.highestConsumption.value = Math.max(1000, clusterData.value.highestConsumption.value);
        clusterData.value.highestCollection.value = Math.max(2000, clusterData.value.highestCollection.value);

        // Update system metrics
        systemMetrics.value = {
            distributionEfficiency: Math.min(99, Math.max(80, systemMetrics.value.distributionEfficiency + (Math.random() * 4 - 2))),
            collectionEfficiency: Math.min(95, Math.max(75, systemMetrics.value.collectionEfficiency + (Math.random() * 5 - 2.5))),
            leakageRate: Math.min(15, Math.max(1, systemMetrics.value.leakageRate + (Math.random() * 2 - 1)))
        };

        // Round values for display
        systemMetrics.value.distributionEfficiency = Math.round(systemMetrics.value.distributionEfficiency);
        systemMetrics.value.collectionEfficiency = Math.round(systemMetrics.value.collectionEfficiency);
        systemMetrics.value.leakageRate = Math.round(systemMetrics.value.leakageRate * 10) / 10;

        // Randomly show or hide anomalies
        if (Math.random() > 0.7) {
            anomalies.value = [];
        }
    }, 1500);
};

// Initialize data on component mount
onMounted(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we're using the mock data defined above
});
</script>
