<template>
    <section v-if="userStore.loading_UserOrganisations" class="w-screen h-screen overflow-hidden p-6 bg-gray-100">
        <div class="flex flex-col gap-6 h-full animate-pulse">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="i in 3" :key="i" class="h-32 bg-white rounded-lg shadow-sm"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="h-96 bg-white rounded-lg shadow-sm"></div>
                <div class="h-96 bg-white rounded-lg shadow-sm"></div>
            </div>
        </div>
    </section>
    <NuxtLayout name="dashboard" v-else>
        <Header name="Water Insights">
            <template #description>
                Monitor and optimize your water consumption patterns
            </template>
        </Header>
        <section class="flex flex-col gap-6 absolute top-16 z-10 p-4 lg:p-8 left-0 right-0">
            <!-- Key Metrics Section -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ConsumptionStats 
                    @on-date-changed="handleWaterConsumptionStatsDateChanged"
                    :option="consumptionStatOption" 
                    class="h-full">
                </ConsumptionStats>
            </div>
            
            <!-- Main Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WaterConsumptionChart 
                    :option="consumptionChart"
                    @on-date-changed="handleWaterConsumptionChartDateChanged"
                    class="h-[500px]">
                </WaterConsumptionChart>
                
                <ClusterConsumptionCompare 
                    :option="consumptionChart"
                    class="h-[500px]">
                </ClusterConsumptionCompare>
            </div>

            <!-- Device Monitoring Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    <DeviceMonitoring title="Active Devices"></DeviceMonitoring>
                </div>
                <div>
                    <DevicesSummary></DevicesSummary>
                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useDeviceStore } from '~/stores/device/device.store';
import { useUserStore } from '~/stores/auth/user/user.store';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';

useHead({ title: "Overview" })

const deviceStore = useDeviceStore()
const userStore = useUserStore()


const currentDate = new Date();
const startDate = new Date(currentDate.getFullYear(), 0, 1);
const endDate = new Date(currentDate.getFullYear(), 11, 31);


useAsyncData<any>('deviceConsumptionTrendM', () => Promise.all([
    deviceStore.getAllDevicesConsumptionTrend(startDate.toISOString(), endDate.toISOString()),
    // deviceStore.getMinMaxConsumption(startDate.toISOString(), endDate.toISOString())
]), { lazy: true })




const handleWaterConsumptionChartDateChanged = (date: { start: Date, end: Date }) => {
    deviceStore.getAllDevicesConsumptionTrend(date.start.toISOString(), date.end.toISOString())
}

const handleWaterConsumptionStatsDateChanged = (date: { start: Date, end: Date }) => {
    deviceStore.getMinMaxConsumption(date.start.toISOString(), date.end.toISOString())
}

const consumptionStatOption = ref<{ title?: string, isLoading?: boolean, min: number, max: number, sum: number, subtitle?: string }>({} as any) //!TODO:IMPELEMENT THIS PROPERLY

const consumptionChart = ref<IWaterConsumptionChart>({
    title: "Total Water Usage",
    subtitle: "* Over Time",
    chartSeries: deviceStore.deviceConsumptionTrend,
    isLoading: deviceStore.isGettingConsumptionTrend,
    success: true,
})

// Watch and update consumption chart trend
watchEffect(() => {
    if (deviceStore.success_ConsumptionTrend) {
        consumptionChart.value.chartSeries = deviceStore.deviceConsumptionTrend
    }

    consumptionChart.value.isLoading = deviceStore.isGettingConsumptionTrend
    consumptionStatOption.value = {
        subtitle: "* For all devices",
        isLoading: deviceStore.isGettingDeviceMinMaxConsumption,
        min: deviceStore.minMaxconsumption.min,
        max: deviceStore.minMaxconsumption.max,
        sum: deviceStore.minMaxconsumption.sum,

    }
})

</script>