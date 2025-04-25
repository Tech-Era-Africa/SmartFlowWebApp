<template>
    <div class="grid gap-6 md:grid-cols-2 mb-6">
        <!-- Water Tank Visualization -->
        <div class="bg-white border  rounded-lg">
            <div class="p-4 pb-0">
                <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 class="text-sm font-medium">Water Collection</h3>
                    <div class="h-4 w-4 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M8 2h8"></path>
                            <path
                                d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <div class="flex flex-col items-center">
                    <div class="relative w-40 h-56 mb-4 border-2 border-gray-300 rounded-lg overflow-hidden">
                        <!-- Water level animation -->
                        <div class="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-1000 ease-in-out"
                            :style="`height: ${tankLevel}%; opacity: 0.8`">
                            <div class="absolute top-0 left-0 right-0 h-2 bg-blue-300 animate-pulse"></div>
                        </div>

                        <!-- Tank level markers -->
                        <div class="absolute top-0 left-0 right-0 bottom-0">
                            <div class="absolute top-1/4 -right-1 w-3 h-0.5 bg-gray-400"></div>
                            <div class="absolute top-1/2 -right-1 w-3 h-0.5 bg-gray-400"></div>
                            <div class="absolute top-3/4 -right-1 w-3 h-0.5 bg-gray-400"></div>
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">{{ tankLevel }}%</div>
                        <p class="text-sm text-gray-600">Total Collected Water</p>
                        <div class="flex items-center gap-2 justify-center">
                            <div class="mt-2 text-xs text-gray-500">
                                <span class="inline-block px-2 py-1 bg-green-50 rounded-full">
                                    Collected {{ data?.collection?.total }} {{ data?.unit }}
                                </span>
                            </div>
                            <div class="mt-2 text-xs text-gray-500">
                                <span class="inline-block px-2 py-1 bg-blue-50 rounded-full">
                                   Target {{ consumptionStore.collectionTarget }} {{ data?.unit }}
                                </span>
                            </div>
                        </div>

                        <p class="mt-2 text-xs text-gray-500">That's enough for about {{
                            Math.round(waterData.tankCapacity * tankLevel / 100 / 10) }} days of normal use</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Water Savings Visualization -->
        <div class="bg-white border  rounded-lg">
            <div class="p-4 pb-0">
                <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 class="text-sm font-medium">Money Saved</h3>
                    <div class="h-4 w-4 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <div class="flex flex-col items-center">
                    <div class="relative w-40 h-40 mb-4">
                        <!-- Circular progress for water savings -->
                        <svg class="w-full h-full" viewBox="0 0 100 100">
                            <!-- Background circle -->
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="8" />

                            <!-- Progress circle with stroke-dasharray animation -->
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" stroke-width="8"
                                stroke-linecap="round" :stroke-dasharray="`${50 * 2.83} 283`"
                                transform="rotate(-90 50 50)" />
                        </svg>

                        <!-- Percentage in the middle -->
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-2xl font-bold text-green-600">{{ percentageSaved }}%</span>
                            <span class="text-xs text-gray-500">less water used</span>
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="text-lg font-medium text-gray-800">{{ currencyFormat(savedBill) }}</div>
                        <p class="text-sm text-gray-600">Saved this month</p>
                        <div class="mt-2 text-xs text-gray-500">
                            <span class="inline-block px-2 py-1 bg-green-50 rounded-full">
                                {{ data?.saved }} {{ data?.unit }} saved
                            </span>
                        </div>
                        <p class="mt-2 text-xs text-gray-500">That's enough to fill {{ Math.round(waterData.waterSaved /
                            150) }} bathtubs!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import { useConsumptionStore } from '~/stores/consumption/consumption.store';
const billStore = useBillStore();

const consumptionStore = useConsumptionStore();

const currencyFormat = (number: number) => new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
}).format(number);

// Fetch water insights
const { data, refresh, status, error } = useAsyncData('waterInsights', async () => {
    return await consumptionStore.getInsights();
}, { immediate: true, lazy: true });


const tankLevel = computed(() => {
    if (!data.value?.collection?.total) return 0;
    return Math.round(data.value?.collection?.total / consumptionStore.collectionTarget * 100);
});

//Saved bill = total consumed
const savedBill = computed(() => {
    if(!data.value?.consumption?.total || !data.value?.saved) return 0;
    return billStore.calculateTotalBill({ consumption: data.value?.saved ?? 0 })
});

const percentageSaved = computed(() => {
    if(!data.value?.saved || !data.value?.consumption?.total) return 0;
    return Math.round((data.value?.saved / data.value?.consumption?.total) * 100);
});

// Water data
const waterData = ref({
    tankCapacity: 5000,
    waterSaved: 3250,
    moneySaved: 487.50,
    morningUsage: 120,
    afternoonUsage: 85,
    eveningUsage: 175
});
</script>
