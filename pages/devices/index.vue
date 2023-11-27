<template>
    <NuxtLayout name="dashboard">
        <Header name="Devices"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0">
            <div class="w-full flex  p-2 gap-4">
                <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
                    <div class="flex flex-col lg:flex-row justify-between gap-2 lg:items-center">
                        <h1 class="font-bold text-lg">Devices</h1>
                        <div class="flex items-center gap-4">
                            <form class="w-full" v-if="!deviceStore.isGettingDevices">
                                <label for="default-search"
                                    class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div v-if="deviceStore.hasDevices" class="relative">
                                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input type="search" id="default-search"
                                        class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Search Device Id, Name..." required>

                                </div>
                            </form>

                            <button type="button"
                                class="items-center hidden px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm sm:inline-flex hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                <svg class="w-4 h-4 mr-1 -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add New Device
                            </button>
                        </div>

                    </div>

                    <!-- DEVICES -->
                    <template v-if="deviceStore.hasDevices">
                        <div class="flex-1 flex-grow grid-cols-2 lg:grid-cols-5 grid gap-2">
                            <DeviceCard :option="{ device }" @click="openDeviceDrawer(device)"
                                v-for="device in deviceStore.devices"></DeviceCard>
                        </div>


                        <div v-if="false" class="text-center mt-10">
                            <div class="join">
                                <button class="join-item btn btn-sm">1</button>
                                <button class="join-item btn btn-sm btn-active">2</button>
                                <button class="join-item btn btn-sm">3</button>
                                <button class="join-item btn btn-sm">4</button>
                            </div>

                        </div>

                    </template>
                    <!-- end of DEVICES -->

                    <!-- LOADING -->
                    <template v-if="deviceStore.isGettingDevices">
                        <div class="w-full h-[50vh] flex flex-col justify-center items-center gap-36">
                            <div class="flex justify-between gap-10">
                                <div class="flex flex-col gap-4 w-52" v-for="i in 4">
                                    <div class="skeleton h-32 w-full"></div>
                                    <div class="skeleton h-4 w-28"></div>

                                </div>
                            </div>

                            <p class="text-gray-600">Getting devices</p>
                        </div>
                    </template>
                    <!-- end of LOADING -->




                </div>
            </div>

        </section>

        <Drawer drawerId="deviceDrawer">

            <SingleDeviceMonitoring :option="{ device: deviceStore.selectedDevice }"></SingleDeviceMonitoring>
            <WaterConsumptionChart :option="waterConsumptionChartOptions"></WaterConsumptionChart>
            <MonthlyConsumptionStats></MonthlyConsumptionStats>
            <TotalPayableBillWidget :option="{ amount: getBill().waterCharge, currency: 'GHC',device: deviceStore.selectedDevice }">
            <div class="text-right">
                <p class="text-xs text-gray-500">Consumption</p>
                <p class="font-bold flex justify-end items-center gap-2"><span v-if="deviceStore.isGettingDeviceConsumption" class="loading loading-spinner loading-xs text-gray-400"></span><span>{{deviceStore.consumption}}L</span></p>
            </div>
            </TotalPayableBillWidget>
            <!-- <UsersTable :option="usersDataTableOption"></UsersTable>
            <BillingTable :option="billingDataTableOption"></BillingTable> -->

        

        </Drawer>

        <!-- MODALS -->
        <Modal modal-id="billModal">
            <BillPreview :option="{ device: deviceStore.selectedDevice }"></BillPreview>
        </Modal>

        <Modal modal-id="billSuccessModal">
            <BillSuccess></BillSuccess>
        </Modal>
       
        <!-- end of MODALS -->
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { IDevice } from '~/server/api/device/model/device.model';
import { UserModel, type User } from '~/server/api/user/model/user.model';
import { useAuthStore } from '~/stores/auth/auth.store';
import { useControlStore } from '~/stores/control/control.store';
import { useDeviceStore } from '~/stores/device/device.store';
import type { UserTableOptionDTO } from '~/utils/dto/userTable.option.dto';


useHead({ title: "Devices" })

const deviceStore = useDeviceStore()
const authStore = useAuthStore()
const controlStore = useControlStore()

await deviceStore.getDevicesByUser(authStore.currentUser.objectId);

const openDeviceDrawer = async (device: IDevice) => {
    // Update the device store
    deviceStore.selectDevice(device)
    controlStore.toggleDeviceDrawer()

}

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

watch(deviceStore, state => {
   
    if(state.isGettingConsumptionTrend) waterConsumptionChartOptions.isLoading = true;
    if(state.success_ConsumptionTrend) waterConsumptionChartOptions.series[0].data = state.deviceConsumptionTrend;
    if(state.success_DeviceUsers) usersDataTableOption.value.users = state.deviceUsers

})





</script>