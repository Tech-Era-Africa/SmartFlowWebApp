<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { ArrowLeftCircle, Plus } from 'lucide-vue-next'
// import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';
import type { IDevice } from '~/stores/device/model/device.model';
import type { IBillOptionDTO } from '~/stores/bill/dto/billOption.dto';
import { useClusterStore } from '~/stores/cluster/cluster.store';
// import { useToast } from '~/components/ui/toast/use-toast';
import ClusterInsights from '~/components/ClusterInsights.vue';

useHead({ title: "Devices" })

const deviceStore = useDeviceStore()
const clusterStore = useClusterStore()

const billStore = useBillStore()
const clusterId = useRoute().params.id

const consumptionStatOption = ref<{ deviceId: string, title?: string, isLoading?: boolean, min: number, max: number, sum: number }>({} as any)

// Define date range for consumption data
const currentDate = new Date()
const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) // First day of current month
const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0) // Last day of current month

// Load cluster devices
const { data:clusterDevices, refresh, status } = await useAsyncData<any>('clusterDevices', () => clusterStore.getClusterDevices(clusterId.toString()), { lazy: true })

// We use refresh in the refreshDevices function

const billWidgetOption = ref<IBillOptionDTO>({ billTypeId: billStore.billTypes[0].id } as IBillOptionDTO)

const validStatNumber = (num: number) => num > 0 ? num : 0

const isSheetDialogueOpen = ref(false)
const isNewDeviceDialogOpen = ref(false)

const handleOnSheetDialogOpen = (isOpen: boolean) => {
    if (!deviceStore.selectedDevice) isSheetDialogueOpen.value = isOpen
    if (!isOpen) deviceStore.selectedDevice = null!
}

const handleNewDeviceDialogOpenUpdate = (state: boolean) => isNewDeviceDialogOpen.value = state

const openSheetDrawer = async (device: IDevice) => {
    isSheetDialogueOpen.value = true
    deviceStore.selectDevice(device)
    billStore.getCurrentPaidBills(device.objectId)
}

// Refresh devices when a new device is added
const refreshDevices = async () => {
    // Refresh the device list
    await refresh()

    // Update chart data
    await deviceStore.getClusterConsumptionTrend(clusterId.toString(), startDate.toISOString(), endDate.toISOString())
    await deviceStore.getClusterTotalConsumption(clusterId.toString(), startDate.toISOString(), endDate.toISOString())
}




</script>

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
                                <Skeleton  v-if="status == 'pending'" class="w-500 h-10 rounded-lg"></Skeleton>
                                <template v-else>
                                    <Badge v-if="clusterStore.clusterDevices?.cluster?.type"
                                           :class="clusterStore.clusterDevices.cluster.type.id == 1 ? 'hover:bg-transparent bg-green-100 text-green-600' : 'hover:bg-transparent bg-blue-100 text-blue-600'"
                                           class="rounded-sm border-none outline-none my-3 text-xs inline-flex w-fit">
                                        {{ clusterStore.clusterDevices.cluster.type.name }}
                                    </Badge>
                                    <h1 class="text-3xl font-extrabold">{{ clusterStore.clusterDevices?.cluster?.name || 'Cluster' }}</h1>
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
                                    <NewDevice :cluster-id="clusterId.toString()"
                                        @update:open="handleNewDeviceDialogOpenUpdate"
                                        @device-added="refreshDevices"></NewDevice>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                     <!-- LOADING -->
                     <template v-if="status == 'pending'">
                        <div class="flex flex-col  gap-4 p-5">
                            <div class="flex  w-full">
                                <div class="w-full md:w-2/3 md:mr-4">
                                    <Skeleton class="h-[300px] w-full rounded-lg" />
                                </div>
                                <div class="w-full md:w-1/3 mt-4 md:mt-0">
                                    <Skeleton class="h-[300px] w-full rounded-lg" />
                                </div>
                            </div>
                            <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                <div v-for="i in 6" :key="i" class="space-y-3">
                                    <Skeleton class="h-[120px] w-full rounded-lg" />
                                    <div class="space-y-2">
                                        <Skeleton class="h-4 w-3/4" />
                                        <Skeleton class="h-3 w-1/2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- end of LOADING -->

                    <!-- DEVICES -->
                    <template v-else-if="clusterDevices?.devices?.length === 0">
                        <div class="w-full h-[400px] flex flex-col justify-center items-center bg-gray-50 rounded-lg">
                            <p class="text-xl font-semibold text-gray-600">No Devices Found In This Group</p>
                            <p class="text-gray-400 mt-2">Add a new device to get started</p>
                            <Button @click="isNewDeviceDialogOpen = true" class="mt-6" variant="outline">
                                Add New Device <Plus class="ml-2" :size="16"></Plus>
                            </Button>
                        </div>
                    </template>

                    <template v-else>
                        <!-- Insights -->
                        <section class="mb-6">
                            <div class="flex gap-5 items-center  mb-5 ml-5">
                                <h1 class="font-bold text-lg">Insights</h1>
                                <PeriodFacetedFilter></PeriodFacetedFilter>
                            </div>
                           
                            <ClusterInsights :cluster-id="clusterId.toString()" />
                        </section>
                        <!-- end of Insights -->

                        <!-- TREND -->
                        <section class="flex w-full gap-4 mb-10">
                            <div class="w-2/3">
                                <WaterConsumptionChart :option="{ title: 'Consumption Trend', subtitle: 'Track your collection, consumption, and savings' }"
                                    ></WaterConsumptionChart>
                            </div>

                            <TotalPayableBillWidget class="flex-1" :option="billWidgetOption">
                                <div class="text-right">
                                    <p class="text-xs text-gray-500">Consumption</p>
                                    <p class="font-bold flex justify-end items-center gap-2">
                                        <span v-if="deviceStore.loading_TotalClusterConsumption"
                                            class="loading loading-spinner loading-xs text-gray-400"></span>
                                        <span>{{ validStatNumber(deviceStore.totalClusterConsumption.sum).toFixed(2) }}k L</span>
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
                                        :option="device" @click="openSheetDrawer(device)"
                                        v-for="device in clusterDevices?.devices || []"></DeviceCard>
                                </div>
                                <SheetContent class=" bg-white overflow-y-auto md:max-w-[600px] flex flex-col">
                                    <template v-if="deviceStore.selectedDevice">
                                        <SingleDeviceMonitoring :option="{ device: deviceStore.selectedDevice }">
                                        </SingleDeviceMonitoring>
                                        <WaterConsumptionChart :option="{ title: 'Consumption Trend', subtitle: 'Track your collection, consumption, and savings'}"></WaterConsumptionChart>
                                        <ConsumptionStats :option="consumptionStatOption">
                                        </ConsumptionStats>
                                    </template>
                                </SheetContent>
                            </Sheet>
                        </section>
                        <!-- end of DEVICES -->
                    </template>


                    <!-- end of DEVICES -->


                </div>
            </div>
        </section>
    </NuxtLayout>
</template>

