<template>
  
    <NuxtLayout name="dashboard" >
        <Header name="Overview"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10 mx-2  lg:mx-8 left-0 right-0">
            <div class="w-full  flex flex-col lg:flex-row  p-2 gap-4">
                <div class="w-full h-auto  md:w-3/5">
                    <WaterConsumptionChart :option="consumptionChart">
                    </WaterConsumptionChart>
                    
                </div>
                <div class="flex flex-col gap-2 flex-1 flex-grow">
                    <pre></pre>
                    <ConsumptionStats @on-date-changed="handleWaterConsumptionStatsDateChanged"class="h-full">
                    </ConsumptionStats>
                    <SmartCredit></SmartCredit>
                </div>

            </div>
            <div class="h-auto">
                <ClusterConsumptionCompare :option="consumptionChart"></ClusterConsumptionCompare>
            </div>
            <div class="w-full max-h-96 flex flex-col lg:flex-row   p-2 gap-4">

                <div class="w-full lg:w-3/5 h-auto">
                    <DeviceMonitoring title="All Devices"></DeviceMonitoring>
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
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';

useHead({ title: "Overview" })

const deviceStore = useDeviceStore()


const handleWaterConsumptionStatsDateChanged = (date: { start: Date, end: Date }) => {
    deviceStore.getMinMaxConsumption(date.start.toISOString(), date.end.toISOString())
}

const consumptionChart = ref<IWaterConsumptionChart>({
    title: "Water Management Insights",
    subtitle: "Track your collection, consumption, and savings",
 
})



</script>