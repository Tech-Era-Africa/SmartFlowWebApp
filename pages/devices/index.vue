<template>
    <NuxtLayout name="dashboard">
        <Header name="Devices"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0">
            <div class="w-full flex  p-2 gap-4">
                <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
                    <div class="flex flex-row justify-between gap-2items-center">
                        <h1 class="font-bold text-lg">Devices</h1>
                        <div class="flex items-center gap-4">
                            <Dialog>
                                <DialogTrigger>
                                    <Button variant="outline" class="gap-2">Generate
                                        Bill <Star :size="16"></Star> </Button>
                                </DialogTrigger>
                                <DialogContent class="sm:max-h-[95vh] overflow-y-auto">
                                    <DynamicBillPreview></DynamicBillPreview>
                                </DialogContent>
                            </Dialog>

                            <button class="btn btn-outline" @click="openNewDeviceModal()">Add New Device <Icon
                                    name="material-symbols-light:add-rounded"></Icon></button>
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
                                    <WaterConsumptionChart :option="waterConsumptionChartOptions"></WaterConsumptionChart>
                                    <MonthlyConsumptionStats
                                        :option="{ consumption: deviceStore.consumption, deviceId: deviceStore.selectedDevice.objectId }">
                                    </MonthlyConsumptionStats>
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
import type { IDevice } from '~/server/api/device/model/device.model';
import { UserModel, type User } from '~/server/api/auth/user/model/user.model';
import { useAuthStore } from '~/stores/auth/auth.store';
import { useBillStore } from '~/stores/bill/bill.store';
import { useControlStore } from '~/stores/control/control.store';
import { useDeviceStore } from '~/stores/device/device.store';
import type { UserTableOptionDTO } from '~/utils/dto/userTable.option.dto';
import { useUserStore } from '~/stores/auth/user/user.store';
import { Star } from 'lucide-vue-next'


useHead({ title: "Devices" })
definePageMeta({ middleware: 'auth' })

const deviceStore = useDeviceStore()
const billStore = useBillStore()
const authStore = useAuthStore()
const controlStore = useControlStore()
const userStore = useUserStore()


onBeforeMount(() => {
    deviceStore.getDevicesByUser(userStore.currentUser!.objectId);
})


// SHEET CONTROL
const isSheetDialogueOpen = ref(false)
const handleOnSheetDialogOpen = (isOpen: boolean) => {
    isSheetDialogueOpen.value = isOpen
}
// end of SHEET CONTROL

const openSheetDrawer = async (device: IDevice) => {
    isSheetDialogueOpen.value = true
    // Update the device store
    deviceStore.selectDevice(device)
    deviceStore.getMonthlyMinMaxConsumption(device.objectId)
    billStore.getCurrentPaidBills(device.objectId)
    // controlStore.toggleDeviceDrawer()
}

const openNewDeviceModal = () => controlStore.openModal("addNewDeviceModal")


const getBill = () => useWaterBillAlgo({ consumption: deviceStore.consumption })

const usersDataTableOption = ref<UserTableOptionDTO>({
    title: 'Users',
    users: [
        new UserModel({ firstName: "Ronald", lastName: "Nettey", email: "ronaldnettey360@gmail.com", objectId: "1", phoneNumber: "+233558474469", role: "Admin" }).user
    ] as User[],
    columns: ["Id", "Name", "Email", "Phone Number", "Role", "Devices"]
} as UserTableOptionDTO);

const billingDataTableOption = ref<UserTableOptionDTO>({
    title: 'Billing History',
    users: [
        new UserModel({ firstName: "Ronald", lastName: "Nettey", email: "ronaldnettey360@gmail.com", objectId: "1", phoneNumber: "+233558474469", role: "Admin" }).user
    ] as User[],
    columns: ["Invoice #", "User", "Date Issued", "Date Paid", "Devices", "Status"]
} as UserTableOptionDTO);

const waterConsumptionChartOptions = reactive(
    {
        series: [
            {
                name: 'Water Consumption',
                data: deviceStore.deviceConsumptionTrend,
            },
            {
                name: 'Water Bill',
                data: [],
            },
        ],
        xAxisCategories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        isLoading: deviceStore.isGettingConsumptionTrend,
        success: deviceStore.success_ConsumptionTrend
    }
)

watch(deviceStore, async state => {

    if (state.isGettingConsumptionTrend) waterConsumptionChartOptions.isLoading = true;
    if (state.success_ConsumptionTrend) waterConsumptionChartOptions.series[0].data = state.deviceConsumptionTrend;
    if (state.success_DeviceUsers) usersDataTableOption.value.users = state.deviceUsers


})






</script>~/server/api/auth/user/model/user.model