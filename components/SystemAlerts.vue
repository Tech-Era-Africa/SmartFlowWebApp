<template>
  <div class="bg-white  rounded-lg">
                <div class="p-4 pb-0">
                    <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 class="text-sm font-medium">System Alerts</h3>
                        <div class="h-4 w-4 text-amber-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                    </div>
                </div>
                <div class="p-4">
                    <div v-if="anomalies.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
                        <div class="h-12 w-12 text-green-500 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <h3 class="text-base font-medium text-gray-700">All systems operational</h3>
                        <p class="text-sm text-gray-500 mt-1">No anomalies or maintenance issues detected</p>
                    </div>
                    <div v-else class="grid gap-4 md:grid-cols-2">
                        <div v-for="(anomaly, index) in anomalies" :key="index" class="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <div class="flex items-start">
                                <div class="mr-3 mt-1 p-2 rounded-full bg-amber-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </div>
                                <div>
                                    <h3 class="text-sm font-semibold mb-1">{{ anomaly.title }}</h3>
                                    <p class="text-xs text-gray-600 mb-2">{{ anomaly.description }}</p>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs font-medium text-gray-500">{{ anomaly.date }}</span>
                                        <button class="px-2 py-1 text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 rounded">Maintenance Request</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script setup lang="ts">
// Anomalies
const anomalies = ref([
    {
        id: 'a1',
        title: 'Abnormal flow detected',
        description: 'Continuous flow in North Campus distribution line during off-hours (2am-4am).',
        date: 'May 15, 2024'
    },
    {
        id: 'a2',
        title: 'Pressure drop detected',
        description: 'Pressure drop in main supply line - possible leak in underground piping.',
        date: 'May 17, 2024'
    }
]);
</script>
