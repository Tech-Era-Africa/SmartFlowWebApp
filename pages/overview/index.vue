<template>
    <section v-if="userStore.loading_UserOrganisations" class="w-screen h-screen overflow-hidden p-10 ">
        <div class="flex gap-5 h-full">
            <div class="w-1/4 h-full flex flex-col gap-5 p-10 bg-gray-50">
                <Skeleton class="w-full h-full  bg-blue-50"></Skeleton>
                <Skeleton class="w-full h-full  bg-blue-50"></Skeleton>
                <Skeleton class="w-full h-full  bg-blue-50"></Skeleton>
                <Skeleton class="w-full h-full  bg-blue-50"></Skeleton>
                <Skeleton class="w-full h-full  bg-blue-50"></Skeleton>
                <Skeleton class="w-full h-full  bg-blue-50"></Skeleton>
                <Skeleton class="w-full h-full  bg-blue-50"></Skeleton>
            </div>
            <div class="flex flex-col gap-5 w-full">
                <div class="flex gap-5 w-full h-full">
                    <div class="w-full h-full flex flex-col gap-5 bg-gray-50 p-10">
                        <Skeleton class="w-full h-full bg-blue-50"></Skeleton>
                        <Skeleton class="w-full h-full bg-blue-50"></Skeleton>
                    </div>
                    <Skeleton class="w-full h-full bg-blue-50"></Skeleton>
                </div>
                
                <Skeleton class="w-full h-full bg-blue-50"></Skeleton>
            </div>
        </div>
        
    </section>
    <NuxtLayout name="dashboard" v-else>
        <Header name="Overview"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10 mx-2  lg:mx-8 left-0 right-0">
            <div class="w-full flex flex-col lg:flex-row  p-2 gap-4">
                <div class="w-full  lg:w-3/5 h-full">
                    <DeviceMonitoring title="All Devices"></DeviceMonitoring>
                </div>
                <div class="flex flex-col gap-2 flex-1 flex-grow">
                    <ConsumptionStats @on-date-changed="handleWaterConsumptionStatsDateChanged"
                        :option="consumptionStatOption" class="h-full">
                    </ConsumptionStats>
                    <!-- <SmartCredit></SmartCredit> -->
                </div>

            </div>
            <div class="w-full h-96 flex flex-col lg:flex-row   p-2 gap-4">

                <div class="w-full lg:w-3/5 h-full">
                    <WaterConsumptionChart :option="consumptionChart"
                        @on-date-changed="handleWaterConsumptionChartDateChanged">
                    </WaterConsumptionChart>
                </div>
                <div class="flex-1 h-full">
                    <DevicesSummary></DevicesSummary>
                </div>

            </div>
            <div class="h-20">

            </div>

        </section>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useDeviceStore } from '~/stores/device/device.store';
import { useUserStore } from '~/stores/auth/user/user.store';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';

useHead({ title: "Overview" })
definePageMeta({ middleware: 'check-org' })

const deviceStore = useDeviceStore()
const userStore = useUserStore()


// onBeforeMount(() => {
//     // TODO!: MOVE THIS TO THE STORE
//     const currentDate = new Date();
//     const startDate = new Date(currentDate.getFullYear(), 0, 1);
//     const endDate = new Date(currentDate.getFullYear(), 11, 31);

//     deviceStore.getAllDevicesConsumptionTrend(startDate.toISOString(), endDate.toISOString())
//     deviceStore.getMinMaxConsumption(startDate.toISOString(), endDate.toISOString())

// })

const handleWaterConsumptionChartDateChanged = (date: { start: Date, end: Date }) => {
    deviceStore.getAllDevicesConsumptionTrend(date.start.toISOString(), date.end.toISOString())
}

const handleWaterConsumptionStatsDateChanged = (date: { start: Date, end: Date }) => {
    deviceStore.getMinMaxConsumption(date.start.toISOString(), date.end.toISOString())
}

const consumptionStatOption = ref<{ title?: string, isLoading?: boolean, min: number, max: number, sum: number, subtitle?: string }>({} as any) //!TODO:IMPELEMENT THIS PROPERLY

const consumptionChart = ref<IWaterConsumptionChart>({
    title: "Total Water Consumption",
    subtitle: "* For all devices",
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