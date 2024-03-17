<template>
    <NuxtLayout name="dashboard">
        <Header name="Overview"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10 mx-2  lg:mx-8 left-0 right-0">
            <div class="w-full flex flex-col lg:flex-row  p-2 gap-4">
                <div class="w-full  lg:w-3/5 h-full">
                    <DeviceMonitoring title="All Devices"></DeviceMonitoring>
                </div>
                <div class="flex flex-col gap-2 flex-1 flex-grow">
                    <MonthlyConsumptionStats :option="monthlyConsumptionStatOption" class="h-full">
                    </MonthlyConsumptionStats>
                    <div class="flex gap-2">
                        <Stat :option="{ title: 'Smart Credits', value: `GHC ${billingStore.accountCredit - deviceStore.sumTotalUsageFromDevices()}`, clearBg: true, isLoading: billingStore.loading_AccountCredit || deviceStore.isGettingDevices, hasError:billingStore.failed_AccountCredit }">
                            <div>
                                <p class="text-muted-foreground text-xs">Consumed: {{ deviceStore.sumTotalUsageFromDevices() }}</p>
                            </div>
                            <div class="text-right">
                                <Button class="btn btn-sm btn-outline flex gap-2 items-center">Top Up <Icon
                                        name="material-symbols:arrow-forward-rounded"></Icon></Button>
                            </div>
                        </Stat>
                    </div>
                </div>

            </div>
            <div class="w-full h-96 flex flex-col lg:flex-row   p-2 gap-4">
                <div class="w-full lg:w-3/5 h-full">
                    <WaterConsumptionChart :option="consumptionChart"></WaterConsumptionChart>
                </div>
                <div class="flex-1 h-full">
                    <DevicesSummary></DevicesSummary>
                </div>

            </div>

        </section>
        <!-- <Drawer drawerId = "deviceDrawer">
           <SingleDeviceMonitoring></SingleDeviceMonitoring>
           <WaterConsumptionChart></WaterConsumptionChart>
           <MonthlyConsumptionStats></MonthlyConsumptionStats>
           <TotalPayableBillWidget></TotalPayableBillWidget>
           <UsersTable :option="usersDataTableOption"></UsersTable>

        </Drawer> -->
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import { useDeviceStore } from '~/stores/device/device.store';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';

useHead({ title: "Overview" })
definePageMeta({ middleware: 'auth' })

const deviceStore = useDeviceStore()
const billingStore = useBillStore()

onBeforeMount(() => {
    deviceStore.getAllDevicesConsumptionTrend("2024-03-01T00:00:00.000Z", "2024-03-31T23:59:00.000Z")
    deviceStore.getMonthlyMinMaxConsumption("2024-03-01T00:00:00.000Z", "2024-03-31T23:59:00.000Z")
    billingStore.getAccountCredit()

})

const monthlyConsumptionStatOption: { deviceId: string, consumption: number, title?: string } = {
    consumption: 4,
    deviceId: ""
}

const consumptionChart = ref<IWaterConsumptionChart>({
    title: "Total Water Consumption",
    chartSeries: deviceStore.deviceConsumptionTrend,
    isLoading: false,
    success: true,
})

// Watch and update consumption chart trend
watchEffect(() => {
    if (deviceStore.success_ConsumptionTrend) {
        consumptionChart.value.chartSeries = deviceStore.deviceConsumptionTrend
    }
})

</script>