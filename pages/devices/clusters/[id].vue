<template>
    <NuxtLayout name="dashboard">
        <Header name="Devices"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0 min-h-[400px]">
            <div class="w-full flex h-full p-2 gap-4">
                <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-5">
                    <div class="flex flex-row justify-between gap-2 items-center">
                        <div class="flex gap-5 items-center">
                            <Button variant="outline" @click="useRouter().back()">
                                <ArrowLeftCircle></ArrowLeftCircle>
                            </Button>
                            <div>

                                <Skeleton v-if="deviceStore.isGettingDevices" class="w-500 h-10 rounded-lg"></Skeleton>
                                <template v-else>
                                    <Badge class="rounded-sm border-none outline-none bg-blue-50 text-blue-600">
                                        Block</Badge>
                                    <h1 class="text-3xl font-extrabold">{{
                                deviceStore.deviceGroupName }}</h1>
                                </template>

                            </div>

                        </div>

                        <div class="flex items-center gap-4">
                            <Dialog :open="isNewDeviceDialogOpen" @update:open="handleNewDeviceDialogOpenUpdate">
                                <DialogTrigger>
                                    <Button variant="outline" class="gap-2">Add New Device <Plus :size="16"></Plus>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent class="sm:max-h-[95vh] overflow-y-auto">
                                    <NewDevice :cluster-id="groupId.toString()"
                                        @update:open="handleNewDeviceDialogOpenUpdate"></NewDevice>
                                </DialogContent>
                            </Dialog>
                        </div>

                    </div>

                    <!-- DEVICES -->
                    <template v-if="deviceStore.hasDevices">
                        <!-- TREND -->
                        <section class="flex w-full gap-4 mb-10">
                            <div class="w-2/3">
                                <WaterConsumptionChart :option="clusterConsumptionChart"
                                    @on-date-changed="handleWaterConsumptionChartDateChanged"></WaterConsumptionChart>
                            </div>

                            <TotalPayableBillWidget class="flex-1" :option="billWidgetOption">
                                <div class="text-right">
                                    <p class="text-xs text-gray-500">Consumption</p>
                                    <p class="font-bold flex justify-end items-center gap-2"><span
                                            v-if="deviceStore.loading_SelectedClusterMinMaxConsumption"
                                            class="loading loading-spinner loading-xs text-gray-400"></span><span>{{
                                validStatNumber(deviceStore.selectedClusterMinMaxConsumption.sum).toFixed(2)
                            }}k L</span>
                                    </p>
                                </div>
                            </TotalPayableBillWidget>
                        </section>
                        <!-- end of TREND -->
                        <!-- DEVICES -->
                        <section>
                            <h1 class="font-bold text-lg mb-5 ml-5">{{ 'Devices' }}</h1>
                            <Sheet :open="false" @update:open="handleOnSheetDialogOpen">
                                <div class="flex-1 flex-grow grid-cols-2 lg:grid-cols-5 grid gap-2">
                                    <DeviceCard
                                        class="cursor-pointer transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-[1.005]  duration-300"
                                        :option="{ device }" @click="openSheetDrawer(device)"
                                        v-for="device in deviceStore.devices"></DeviceCard>
                                </div>
                                <SheetContent class=" bg-white overflow-y-auto md:max-w-[600px] flex flex-col">
                                    <template v-if="deviceStore.selectedDevice">
                                        <SingleDeviceMonitoring :option="{ device: deviceStore.selectedDevice }">
                                        </SingleDeviceMonitoring>
                                        <WaterConsumptionChart :option="consumptionChart"></WaterConsumptionChart>
                                        <ConsumptionStats :option="consumptionStatOption">
                                        </ConsumptionStats>
                                    </template>

                                </SheetContent>

                            </Sheet>
                        </section>
                        <!-- end of DEVICES -->



                    </template>

                    <template v-if="!deviceStore.hasDevices && !deviceStore.isGettingDevices">
                        <div class="w-full h-[400px] flex flex-col justify-center items-center bg-gray-50 rounded-lg">
                            <!-- <img src="/images/no-devices.svg" alt="No devices" class="w-48 h-48 mb-4"> -->
                            <p class="text-xl font-semibold text-gray-600">No Devices Found In This Group</p>
                            <p class="text-gray-400 mt-2">Add a new device to get started</p>
                            <Button @click="isNewDeviceDialogOpen = true" class="mt-6" variant="outline">
                                Add New Device <Plus class="ml-2" :size="16"></Plus>
                            </Button>
                        </div>
                    </template>
                    <!-- end of DEVICES -->

                    <!-- LOADING -->

                    <template v-if="deviceStore.isGettingDevices">
                        <div class="grid grid-cols-4 gap-10 p-10">
                            <Skeleton class="h-[150px] w-[180px]" v-for="i in 8" />
                        </div>
                    </template>
                    <!-- end of LOADING -->




                </div>
            </div>

        </section>


    </NuxtLayout>
</template>

<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { ArrowLeftCircle, Plus } from 'lucide-vue-next'
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';
import type { IDevice } from '~/stores/device/model/device.model';
import type { IBillOptionDTO } from '~/stores/bill/dto/billOption.dto';


useHead({ title: "Devices" })


const deviceStore = useDeviceStore()
const billStore = useBillStore()
const groupId = useRoute().params.id

const consumptionStatOption = ref<{ deviceId: string, title?: string, isLoading?: boolean, min: number, max: number, sum: number }>({} as any) //!TODO:IMPELEMENT THIS PROPERLY
const chartData = ref()
const currentDate = new Date();
const startDate = new Date(currentDate.getFullYear(), 0, 1);
const endDate = new Date(currentDate.getFullYear(), 11, 31);



// Load the devices by group
useAsyncData<any>('devicesGroup', () => Promise.all(
    [
        deviceStore.getDevicesByGroup(groupId.toString()),
        deviceStore.getClusterConsumptionTrend(groupId.toString(), startDate.toISOString(), endDate.toISOString()),
        deviceStore.getClusterMinMaxConsumption(groupId.toString(), startDate.toISOString(), endDate.toISOString()),
        billStore.updateBillData({
            billTitle: `${deviceStore.deviceGroupName} Bill`,
            billTypeId: "rxc51QYu7l", //Defaults to commercial TODO!: MAKE DYNAMIC
            devices: deviceStore.devices,
            clusterId: groupId.toString(),
            totalConsumption: deviceStore.selectedClusterMinMaxConsumption.sum,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        })

    ]
), { lazy: true })

const handleWaterConsumptionChartDateChanged = (date: { start: Date, end: Date }) => {
    chartData.value = deviceStore.getClusterConsumptionTrend(groupId.toString(), date.start.toISOString(), date.end.toISOString())

    // Recalculate the bill
    deviceStore.getClusterMinMaxConsumption(groupId.toString(), date.start.toISOString(), date.end.toISOString())

    billStore.updateBillData({
        billTitle: `${deviceStore.deviceGroupName} Bill`,
        billTypeId: "rxc51QYu7l", //Defaults to commercial TODO!: MAKE DYNAMIC
        devices: deviceStore.devices,
        clusterId: groupId.toString(),
        totalConsumption: deviceStore.selectedClusterMinMaxConsumption.sum,
        startDate: date.start.toISOString(),
        endDate: date.end.toISOString()
    })
}


// Handle the prop values for the Bill Widget
const billWidgetOption = ref<IBillOptionDTO>({ billTypeId: "rxc51QYu7l" } as IBillOptionDTO) //TODO!: THIS NEEDS TO BE DONE WELL

const validStatNumber = (num: number) => num > 0 ? num : 0

// SHEET CONTROL
const isSheetDialogueOpen = ref(false)

const handleOnSheetDialogOpen = (isOpen: boolean) => {

    // If there's no seleted user do not open
    if (deviceStore.selectedDevice) return isSheetDialogueOpen.value = false

    // Open/Close sheet
    isSheetDialogueOpen.value = isOpen

    // Clear the selected device when the modal closes
    if (!isOpen) {
        deviceStore.selectedDevice = null!
    }
}
// end of SHEET CONTROL

// NEW DEVICE DIALOG CONTROL
const isNewDeviceDialogOpen = ref(false)
const handleNewDeviceDialogOpenUpdate = (state: boolean) => isNewDeviceDialogOpen.value = state
// end of NEW DEVICE DIALOG CONTROL

const openSheetDrawer = async (device: IDevice) => {
    isSheetDialogueOpen.value = true

    deviceStore.selectDevice(device)

    // deviceStore.getMinMaxConsumption(device.objectId)
    billStore.getCurrentPaidBills(device.objectId)
    // controlStore.toggleDeviceDrawer()
}

const consumptionChart = ref<IWaterConsumptionChart>({
    title: "Consumption Trend",
    chartSeries: deviceStore.selectedDeviceConsumptionTrend,
    isLoading: deviceStore.loading_SelectedDeviceConsumptionTrend,
    success: deviceStore.success_SelectedDeviceConsumptionTrend,
})

const clusterConsumptionChart = ref<IWaterConsumptionChart>({
    title: "Cluster Consumption Trend",
    chartSeries: deviceStore.selectedDeviceConsumptionTrend,
    isLoading: deviceStore.loading_SelectedDeviceConsumptionTrend,
    success: deviceStore.success_SelectedDeviceConsumptionTrend,
})

const prepareDeviceConsumptionData = async () => {
    // Get chart data and update
    consumptionChart.value.chartSeries = await deviceStore.getDeviceConsumptionTrend(deviceStore.selectedDevice.objectId, startDate.toISOString(), endDate.toISOString())

    // Get consumption stats
    await deviceStore.getDeviceMinMaxConsumption(deviceStore.selectedDevice.objectId, startDate.toISOString(), endDate.toISOString())
    if (deviceStore.success_SelectedDeviceMinMaxConsumption) {
        consumptionStatOption.value = {
            title: "Consumption Stats",
            isLoading: deviceStore.isGettingDeviceMinMaxConsumption,
            deviceId: deviceStore.selectedDevice.objectId,
            min: deviceStore.selectedDeviceMinMaxConsumption.min,
            max: deviceStore.selectedDeviceMinMaxConsumption.max,
            sum: deviceStore.selectedDeviceMinMaxConsumption.sum,

        }
    }

}

// Watch and load seleted device trends
watchEffect(async () => {

    if (isSheetDialogueOpen) {
        prepareDeviceConsumptionData()
    }

    // Listen for cluster max min values and update billing widget
    if (deviceStore.success_SelectedClusterMinMaxConsumption) {
        billWidgetOption.value = {
            billTitle: `${deviceStore.deviceGroupName} Bill`,
            billTypeId: "rxc51QYu7l", //Defaults to commercial TODO!: MAKE DYNAMIC
            devices: deviceStore.devices,
            clusterId: groupId.toString(),
            totalConsumption: deviceStore.selectedClusterMinMaxConsumption.sum,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        }
    }

    // Listens for when there is data in the chartData and sends it to the chart
    if (chartData.value) {
        clusterConsumptionChart.value.chartSeries = await chartData.value
    }


})

// Handle the response and update the chart
watchEffect(() => {
  if (deviceStore.success_TotalConsumptionByCluster) {
    clusterConsumptionChart.value.chartSeries = deviceStore.summaryClusterConsumptionTrend;
  }
});







</script>