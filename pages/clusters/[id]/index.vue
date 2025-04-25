 <script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import { useDeviceStore } from '~/stores/device/device.store';
import { ArrowLeftCircle, Plus } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import type { IBillOptionDTO } from '~/stores/bill/dto/billOption.dto';
import { useClusterStore } from '~/stores/cluster/cluster.store';
import ClusterInsights from '~/components/ClusterInsights.vue';
import type { ICluster } from '~/stores/cluster/model/cluster.model';
import type { ClusterDeviceResponse } from '~/stores/device/device.store';

useHead({ title: "Cluster" })

const deviceStore = useDeviceStore()
const clusterStore = useClusterStore()

const billStore = useBillStore()
const clusterId = useRoute().params.id

// Load cluster details
const { data: clusterData, refresh: refreshClusterDetails, status: statusClusterDetails } = await useAsyncData<ICluster>('clusterDetails', () => clusterStore.getClusterDetails(clusterId.toString()), { lazy: true, immediate: true })

//Load cluster devices
const { data: clusterDevices, refresh: refreshDevices, status } = await useAsyncData<ClusterDeviceResponse[]>('clusterDevices', () => deviceStore.getClusterDevices(clusterId.toString()), { lazy: true, immediate: true })


const billWidgetOption = ref<IBillOptionDTO>({ billTypeId: billStore.billTypes[0].id, totalConsumption: clusterStore.selectedClusterTotalConsumption } as IBillOptionDTO)

// Handle adding a new device to the cluster
const isAddDeviceDialogOpen = ref(false)

const handleAddDevice = () => {
  isAddDeviceDialogOpen.value = true
  // You can implement the actual device addition logic here or in a separate component
  console.log('Adding device to cluster:', clusterId)
}

// Function to refresh data
const refreshData = async () => {
  await Promise.all([
    refreshClusterDetails(),
    refreshDevices()
  ])
}


</script>

<template>
    <NuxtLayout name="dashboard">
        <Header name=""></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0 min-h-[400px]">
            <div class="w-full flex h-full p-2 gap-4">
                <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-5">
                    <div class="flex flex-row justify-between gap-2 items-center">
                        <div class="flex gap-5 items-center">
                            <Button variant="outline" @click="useRouter().back()">
                                <ArrowLeftCircle></ArrowLeftCircle>
                            </Button>
                            <div>
                                <Skeleton v-if="statusClusterDetails == 'pending'" class="w-500 h-10 rounded-lg">
                                </Skeleton>
                                <template v-else>
                                    <Badge v-if="clusterData?.type"
                                        :class="clusterData?.type.id == 1 ? 'hover:bg-transparent bg-green-100 text-green-600' : 'hover:bg-transparent bg-blue-100 text-blue-600'"
                                        class="rounded-sm border-none outline-none my-3 text-xs inline-flex w-fit">
                                        {{ clusterData?.type.name }}
                                    </Badge>
                                    <h1 class="text-3xl font-extrabold">{{ clusterData?.name || 'Cluster' }}</h1>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- LOADING -->
                    <template v-if="statusClusterDetails == 'pending'">
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

                    <div v-if="statusClusterDetails == 'success' && clusterData?.device_count == 0" class="w-full h-[400px] flex flex-col justify-center items-center bg-gray-50 rounded-lg">
                        <p class="text-xl font-semibold text-gray-600">No Devices Found In This Cluster</p>
                        <p class="text-gray-400 mt-2">Add a new device to get started</p>
                        <Button @click="handleAddDevice" class="mt-6" variant="outline">
                            Add New Device <Plus class="ml-2" :size="16"></Plus>
                        </Button>
                    </div>

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
                                <ClusterConsumptionTrend class="border-[0.5px]" :cluster-id="clusterId.toString()"
                                :option="{ title: 'Consumption Trend', subtitle: 'Track your consumption' }"/>

                            </div>

                            <TotalPayableBillWidget class="flex-1" :option="billWidgetOption">
                                <div class="text-right">
                                    <p class="text-xs text-gray-500">Consumption</p>
                                    <p class="font-bold flex justify-end items-center gap-2">
                                        <span v-if="statusClusterDetails === 'pending'"
                                            class="loading loading-spinner loading-xs text-gray-400"></span>
                                        <span>{{ clusterStore.selectedClusterTotalConsumption }}k L</span>
                                    </p>
                                </div>
                            </TotalPayableBillWidget>
                        </section>
                        <!-- end of TREND -->

                        <!-- DEVICES -->
                        <section class="mb-6 rounded-xl p-5 border-[0.5px]">
                            <div class="flex justify-between items-center mb-5 ml-5">
                                <h1 class="font-bold text-lg">Devices in this Cluster</h1>
                                <Button @click="handleAddDevice" variant="outline" class="gap-2">
                                    Add Device <Plus class="ml-1" :size="16"></Plus>
                                </Button>
                            </div>

                            <!-- Loading state -->
                            <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
                                <Skeleton v-for="i in 8" :key="i" class="h-[225px] w-full rounded-xl" />
                            </div>

                            <!-- Empty state -->
                            <div v-else-if="!clusterDevices || clusterDevices.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
                                <div class="flex flex-col items-center justify-center py-6">
                                    <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                                            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                                            <path d="M6 12h4"></path>
                                            <path d="M14 12h4"></path>
                                        </svg>
                                    </div>
                                    <p class="text-lg font-medium text-gray-700 mb-2">No Devices Found</p>
                                    <p class="text-sm text-gray-500 mb-6 max-w-md">This cluster doesn't have any devices yet. Add a device to start monitoring water usage.</p>
                                    <Button @click="handleAddDevice" variant="outline" class="gap-2">
                                        Add First Device <Plus class="ml-1" :size="16"></Plus>
                                    </Button>
                                </div>
                            </div>

                            <!-- Device grid -->
                            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
                                <NuxtLink
                                    v-for="device in clusterDevices"
                                    :key="device.deviceId"
                                    :to="`/devices/${device.deviceId}`"
                                    class="transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
                                >
                                    <DeviceCard
                                        :option="{
                                            priority: device.priority || 'Normal',
                                            description: device.description || device.name,
                                            consumption_reading: device.consumptionReading || 0,
                                            last_active_at: device.lastAt || device.updatedAt
                                        }"
                                    />
                                </NuxtLink>
                            </div>

                            <!-- Pagination (if needed) -->
                            <div v-if="clusterDevices && clusterDevices.length > 0" class="flex justify-center mt-6">
                                <div class="flex space-x-1">
                                    <Button variant="outline" size="sm" class="h-8 w-8 p-0">
                                        <span class="sr-only">Go to previous page</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </Button>
                                    <Button variant="outline" size="sm" class="h-8 w-8 p-0 bg-blue-50 text-blue-600 border-blue-200">
                                        1
                                    </Button>
                                    <Button variant="outline" size="sm" class="h-8 w-8 p-0">
                                        <span class="sr-only">Go to next page</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </section>
                        <!-- end of DEVICES -->


                    </template>

                </div>
            </div>
        </section>
        <!-- Add Device Dialog -->
        <Dialog :open="isAddDeviceDialogOpen" @update:open="isAddDeviceDialogOpen = $event">
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Device</DialogTitle>
                    <DialogDescription>
                        Add a new device to this cluster. Fill in the device details below.
                    </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="name" class="text-right">Name</Label>
                        <Input id="name" placeholder="Device name" class="col-span-3" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="deviceId" class="text-right">Device ID</Label>
                        <Input id="deviceId" placeholder="Unique device identifier" class="col-span-3" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="description" class="text-right">Description</Label>
                        <Input id="description" placeholder="Brief description" class="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="isAddDeviceDialogOpen = false">Cancel</Button>
                    <Button @click="isAddDeviceDialogOpen = false; refreshData()">Add Device</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </NuxtLayout>
</template>
