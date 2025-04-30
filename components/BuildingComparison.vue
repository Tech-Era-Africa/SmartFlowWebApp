<template>
 <div class="bg-white rounded-lg mb-6">

                <div class="p-4 pb-0">
                    <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div class="flex items-center">
                            <h3 class="text-sm font-medium">How Your Clusters Compare</h3>
                            <div v-if="isLoading" class="ml-2 h-4 w-4 text-blue-500 animate-spin">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <button @click="refreshAllData" class="mr-2 text-xs text-blue-500 hover:text-blue-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                            </button>
                            <div class="h-4 w-4 text-indigo-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading state -->
                <div v-if="isLoading" class="p-8 flex flex-col items-center justify-center text-center">
                    <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 animate-spin">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                        </svg>
                    </div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">Loading Cluster Data</h4>
                    <p class="text-sm text-gray-500 mb-6 max-w-md">Please wait while we fetch the latest information about your clusters.</p>
                </div>

                <!-- Global empty state when no data is available at all -->
                <div v-else-if="!hasRealData && allRequestsCompleted" class="p-8 flex flex-col items-center justify-center text-center">
                    <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                    </div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">No Data Available</h4>
                    <p class="text-sm text-gray-500 mb-6 max-w-md">We don't have enough data to compare your clusters.</p>
                    <button @click="refreshAllData" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Refresh Data
                    </button>
                </div>

                <div v-else class="p-4">
                    <!-- Water Usage Champions -->
                    <div class="mb-6">
                        <div class="flex items-center mb-3">
                            <div class="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-700">Water Usage Champions</h4>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div v-if="!lowestConsumption?.cluster" class="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center justify-center text-center h-full">
                                <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </div>
                                <p class="text-sm font-medium text-blue-700">Lowest Water User</p>
                                <p class="text-xs text-gray-500 mt-1">Connect more buildings to identify water efficiency champions</p>
                            </div>
                            <div v-else class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-sm font-bold text-gray-800">{{ lowestConsumption?.cluster?.name }}</div>
                                    <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Lowest Use</span>
                                </div>
                                <div class="text-2xl font-bold text-blue-600 mb-1">{{ lowestConsumption?.cluster?.total}}</div>
                                <div class="text-xs text-gray-600">kilo liters consumed this {{ consumptionStore.clusterComparePeriod.period }}</div>
                                <div class="mt-2 text-xs text-gray-500 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 mr-1"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    <span>That's only {{ Math.round((lowestConsumption?.cluster?.total ) / 3) }} toilet flushes</span>
                                </div>
                            </div>
                            <div v-if="!highestCollection?.cluster" class="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center justify-center text-center h-full">
                                <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                                        <path d="M12 22c4.97 0 9-4.03 9-9-.09-4.14-3.13-9.13-9-12.77-5.87 3.64-8.91 8.63-9 12.77 0 4.97 4.03 9 9 9Z"></path>
                                    </svg>
                                </div>
                                <p class="text-sm font-medium text-green-700">Top Water Collector</p>
                                <p class="text-xs text-gray-500 mt-1">Install water meters to track collection efficiency</p>
                            </div>
                            <div v-else class="bg-green-50 p-4 rounded-lg border border-green-100">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-sm font-bold text-gray-800">{{ highestCollection?.cluster?.name }}</div>
                                    <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Most Collected</span>
                                </div>
                                <div class="text-2xl font-bold text-green-600 mb-1">{{ highestCollection?.cluster?.total}}</div>
                                <div class="text-xs text-gray-600">kilo liters collected this {{ consumptionStore.clusterComparePeriod.period }}</div>
                                <div class="mt-2 text-xs text-gray-500 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 mr-1"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    <span>Enough for {{ Math.round((highestCollection?.cluster?.total ) / 50) }} showers</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Needs Attention -->
                    <div>
                        <div class="flex items-center mb-3">
                            <div class="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                            <h4 class="text-sm font-medium text-gray-700">Needs Attention</h4>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div v-if="!highestConsumption?.cluster" class="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col items-center justify-center text-center h-full">
                                <div class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                                <p class="text-sm font-medium text-red-700">High Water Usage</p>
                                <p class="text-xs text-gray-500 mt-1">Monitor your buildings to identify excessive consumption</p>
                            </div>
                            <div v-else class="bg-red-50 p-4 rounded-lg border border-red-100">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-sm font-bold text-gray-800">{{ highestConsumption?.cluster?.name }}</div>
                                    <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">High Usage</span>
                                </div>
                                <div class="text-2xl font-bold text-red-600 mb-1">{{ highestConsumption?.cluster?.total }}</div>
                                <div class="text-xs text-gray-600">kilo liters consumed this {{ consumptionStore.clusterComparePeriod.period }}</div>
                                <div class="mt-2 text-xs text-gray-500 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    <span>That's like {{ Math.round((highestConsumption?.cluster?.total ) / 150) }} bathtubs full</span>
                                </div>
                            </div>
                            <div v-if="!lowestCollection?.cluster" class="bg-amber-50 p-4 rounded-lg border border-amber-100 flex flex-col items-center justify-center text-center h-full">
                                <div class="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600">
                                        <path d="M12 22c4.97 0 9-4.03 9-9-.09-4.14-3.13-9.13-9-12.77-5.87 3.64-8.91 8.63-9 12.77 0 4.97 4.03 9 9 9Z"></path>
                                    </svg>
                                </div>
                                <p class="text-sm font-medium text-amber-700">Low Collection Area</p>
                                <p class="text-xs text-gray-500 mt-1">Improve rainwater harvesting in these buildings</p>
                            </div>
                            <div v-else class="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-sm font-bold text-gray-800">{{ lowestCollection?.cluster?.name }}</div>
                                    <span class="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Low Collection</span>
                                </div>
                                <div class="text-2xl font-bold text-amber-600 mb-1">{{ lowestCollection?.cluster?.total}}</div>
                                <div class="text-xs text-gray-600">kilo liters collected this {{ consumptionStore.clusterComparePeriod.period }}</div>
                                <div class="mt-2 text-xs text-gray-500 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500 mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    <span>Only {{ Math.round((lowestCollection?.cluster?.total) / 10) }} water bottles</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useConsumptionStore } from '~/stores/consumption/consumption.store';


const consumptionStore = useConsumptionStore();

// Fetch water insights with better coordination
const isLoading = ref(true);

// Highest consumption
const { data:highestConsumption, refresh:refreshHighestConsumption, status:highestConsumptionStatus } = useAsyncData(
    'highestConsumptionCluster',
    async () => {
        try {
            return await consumptionStore.getHighestConsumptionCluster(consumptionStore.clusterComparePeriod);
        } catch (err) {
            console.error('Error fetching highest consumption:', err);
            return { cluster: null };
        }
    },
    { immediate: true, lazy: false }
);

//Lowest consumption
const { data:lowestConsumption, refresh:refreshLowestConsumption, status:lowestConsumptionStatus } = useAsyncData(
    'lowestConsumptionCluster',
    async () => {
        try {
            return await consumptionStore.getLowestConsumptionCluster(consumptionStore.clusterComparePeriod);
        } catch (err) {
            console.error('Error fetching lowest consumption:', err);
            return { cluster: null };
        }
    },
    { immediate: true, lazy: false }
);

//Highest collection
const { data:highestCollection, refresh:refreshHighestCollection, status:highestCollectionStatus } = useAsyncData(
    'highestCollectionCluster',
    async () => {
        try {
            return await consumptionStore.getHighestCollectionCluster(consumptionStore.clusterComparePeriod);
        } catch (err) {
            console.error('Error fetching highest collection:', err);
            return { cluster: null };
        }
    },
    { immediate: true, lazy: false }
);

//Lowest collection
const { data:lowestCollection, refresh:refreshLowestCollection, status:lowestCollectionStatus } = useAsyncData(
    'lowestCollectionCluster',
    async () => {
        try {
            return await consumptionStore.getLowestCollectionCluster(consumptionStore.clusterComparePeriod);
        } catch (err) {
            console.error('Error fetching lowest collection:', err);
            return { cluster: null };
        }
    },
    { immediate: true, lazy: false }
);

// Check if all requests have completed (success or error)
const allRequestsCompleted = computed(() => {
    return ['success', 'error'].includes(highestConsumptionStatus.value) &&
           ['success', 'error'].includes(lowestConsumptionStatus.value) &&
           ['success', 'error'].includes(highestCollectionStatus.value) &&
           ['success', 'error'].includes(lowestCollectionStatus.value);
});

// Check if we have any real data from the API
const hasRealData = computed(() => {
    return !!(highestConsumption.value?.cluster || lowestConsumption.value?.cluster ||
             highestCollection.value?.cluster || lowestCollection.value?.cluster);
});

// Update loading state when all requests complete
watch(allRequestsCompleted, (completed) => {
    if (completed) {
        // Add a small delay to ensure all data is properly processed
        setTimeout(() => {
            isLoading.value = false;
        }, 300);
    }
}, { immediate: true });

// Function to refresh all data
const refreshAllData = async () => {
    isLoading.value = true;
    await Promise.all([
        refreshHighestConsumption(),
        refreshLowestConsumption(),
        refreshHighestCollection(),
        refreshLowestCollection()
    ]);
    // Add a small delay to ensure all data is properly processed
    setTimeout(() => {
        isLoading.value = false;
    }, 300);
};

// Listen to when the dates change and refresh
watch(
  () =>  
    consumptionStore.clusterComparePeriod,
  
  async () => {
    await refreshAllData();
  },
  { immediate: true, deep:true }
);

</script>
