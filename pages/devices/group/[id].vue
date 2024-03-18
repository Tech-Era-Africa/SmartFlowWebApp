<template>
    <NuxtLayout name="dashboard">
        <Header name="Devices"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0 h-[400px]">
            <div class="w-full flex h-full p-2 gap-4">
                <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-5">
                    <div class="flex flex-row justify-between gap-2 items-center">
                        <div class="flex gap-2 items-center">
                            <Button variant="outline" @click="useRouter().back()">
                                <ArrowLeftCircle></ArrowLeftCircle>
                            </Button>
                            <h1 class="font-bold text-lg">Clusters/{{ !deviceStore.isGettingDevices ?
                                deviceStore.deviceGroupName : '' }}</h1>
                        </div>

                        <div class="flex items-center gap-4">
                            <!-- <Dialog>
                                <DialogTrigger>
                                    <Button variant="outline" class="gap-2">Generate
                                        Bill <Star :size="16"></Star> </Button>
                                </DialogTrigger>
                                <DialogContent class="sm:max-h-[95vh] overflow-y-auto">
                                    <DynamicBillPreview></DynamicBillPreview>
                                </DialogContent>
                            </Dialog> -->
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
                        <Sheet :open="isSheetDialogueOpen" @update:open="handleOnSheetDialogOpen">
                            <div class="flex-1 flex-grow grid-cols-2 lg:grid-cols-5 grid gap-2">
                                <DeviceCard :option="{ device }" @click="openSheetDrawer(device)"
                                    v-for="device in deviceStore.devices"></DeviceCard>
                            </div>
                            <SheetContent class=" bg-white overflow-y-auto md:max-w-[600px]">
                                <template v-if="deviceStore.selectedDevice.objectId">
                                    <SingleDeviceMonitoring :option="{ device: deviceStore.selectedDevice }">
                                    </SingleDeviceMonitoring>
                                    <WaterConsumptionChart :option="consumptionChart"></WaterConsumptionChart>
                                    <ConsumptionStats :option="consumptionStatOption">
                                    </ConsumptionStats>
                                    <TotalPayableBillWidget
                                        :option="{ consumption: deviceStore.consumption, currency: 'GHC', device: deviceStore.selectedDevice }">
                                        <div class="text-right">
                                            <p class="text-xs text-gray-500">Consumption</p>
                                            <p class="font-bold flex justify-end items-center gap-2"><span
                                                    v-if="deviceStore.isGettingDeviceConsumption"
                                                    class="loading loading-spinner loading-xs text-gray-400"></span><span>{{
                                useUseCubicToLitre(deviceStore.consumption)
                            }}L</span>
                                            </p>
                                        </div>
                                    </TotalPayableBillWidget>
                                    <!-- <UsersTable :option="usersDataTableOption"></UsersTable>
            <BillingTable :option="billingDataTableOption"></BillingTable> -->
                                </template>

                            </SheetContent>

                        </Sheet>


                    </template>

                    <template v-if="!deviceStore.hasDevices && !deviceStore.isGettingDevices">
                        <div class="w-full h-full flex justify-center items-center">
                            <p>No Devices Found In This Group</p>
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


useHead({ title: "Devices" })
definePageMeta({ middleware: 'auth' })

const deviceStore = useDeviceStore()
const billStore = useBillStore()
const groupId = useRoute().params.id

const consumptionStatOption = ref<{ deviceId: string, title?: string, isLoading?: boolean, min: number, max: number, sum: number }>({} as any) //!TODO:IMPELEMENT THIS PROPERLY

onBeforeMount(() => {
    deviceStore.getDevicesByGroup(groupId.toString());
})



// SHEET CONTROL
const isSheetDialogueOpen = ref(false)
const handleOnSheetDialogOpen = (isOpen: boolean) => {
    isSheetDialogueOpen.value = isOpen

    // Clear the selected device when the modal closes
    if (!isOpen) {
        deviceStore.selectedDevice = {} as IDevice //!TODO: MIGHT NEED TO IMPLEMENT THIS PROPERLY
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
    title: "Total Water Consumption",
    chartSeries: deviceStore.selectedDeviceConsumptionTrend,
    isLoading: deviceStore.loading_SelectedDeviceConsumptionTrend,
    success: deviceStore.success_SelectedDeviceConsumptionTrend,
})

// Watch and load seleted device trends
watchEffect(async () => {
    // Update the device store
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    if (deviceStore.selectedDevice.objectId) {

        // Get chart data and update
        consumptionChart.value.chartSeries = await deviceStore.getDeviceConsumptionTrend(deviceStore.selectedDevice.objectId, startOfMonth.toISOString(), endOfMonth.toISOString())

        // Get consumption stats
        await deviceStore.getDeviceMinMaxConsumption(deviceStore.selectedDevice.objectId, startOfMonth.toISOString(), endOfMonth.toISOString())
        if (deviceStore.success_SelectedDeviceMinMaxConsumption) {
            consumptionStatOption.value = {
                isLoading: deviceStore.isGettingDeviceMinMaxConsumption,
                deviceId: deviceStore.selectedDevice.objectId,
                min: deviceStore.selectedDeviceMinMaxConsumption.min,
                max: deviceStore.selectedDeviceMinMaxConsumption.max,
                sum: deviceStore.selectedDeviceMinMaxConsumption.sum,

            }
        }
    }

})







</script>