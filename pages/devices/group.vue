<template>
    <NuxtLayout name="dashboard">
        <Header name="Devices"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0">
            <div class="w-full flex  p-2 gap-4">
                <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
                    <div class="flex flex-row justify-between gap-2items-center">
                        <h1 class="font-bold text-lg">Devices</h1>
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

                            <Dialog>

                            </Dialog>
                            <Dialog>
                                <DialogTrigger>
                                    <Button variant="outline" class="gap-2">Add New Device <Plus :size="16"></Plus>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent class="sm:max-h-[95vh] overflow-y-auto">
                                    <NewDevice></NewDevice>
                                </DialogContent>
                            </Dialog>
                        </div>

                    </div>

                    <!-- DEVICES -->
                    <template v-if="deviceStore.hasGroupDevices">
                        <div class="flex-1 flex-grow grid-cols-2 lg:grid-cols-3 grid gap-2">
                                <Card class="w-full flex justify-between items-center cursor-pointer transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-[1.005]  duration-300 shadow-none" v-for="group in deviceStore.devicesGroups">
                                    <CardHeader>
                                        <CardTitle>{{ group.name }}</CardTitle>
                                        <CardDescription>{{ group.devicesCount }} Devices</CardDescription>
                                    </CardHeader>
                                    <CardContent >
                                        <apexchart :key="chart4Options.series" :options="chart4Options"
                                            :series="chart4Options.series">
                                        </apexchart>
                                    </CardContent>
                                </Card>
                                <Card class="outline-dashed border-none outline-blue-300 cursor-pointer">
                                    <CardContent class="flex justify-center items-center w-full h-full p-0">
                                        <PlusCircle :size="30" class="text-blue-500"></PlusCircle>
                                    </CardContent>
                                </Card>
                            </div>

                    </template>
                    <!-- end of DEVICES -->

                    <!-- LOADING -->

                    <template v-if="deviceStore.loading_DevicesGroup">
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
import { Plus, PlusCircle } from 'lucide-vue-next'
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';


useHead({ title: "Devices" })
definePageMeta({ middleware: 'auth' })

const deviceStore = useDeviceStore()
const billStore = useBillStore()
const authStore = useAuthStore()
const controlStore = useControlStore()
const userStore = useUserStore()


onBeforeMount(() => {
    deviceStore.getDevicesByUser(userStore.currentUser!.objectId);
    deviceStore.getUserDeviceGroup();
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
    // deviceStore.getMonthlyMinMaxConsumption(device.objectId)
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

const consumptionChart = ref<IWaterConsumptionChart>({
    title: "Total Water Consumption",
    chartSeries: deviceStore.deviceConsumptionTrend,
    isLoading: false,
    success: true,
})

watch(deviceStore, async state => {

    // if (state.isGettingConsumptionTrend) waterConsumptionChartOptions.isLoading = true;
    // if (state.success_ConsumptionTrend) waterConsumptionChartOptions.series[0].data = state.deviceConsumptionTrend;
    // if (state.success_DeviceUsers) usersDataTableOption.value.users = state.deviceUsers


})

// CHART SETTTINGS
const chart4Options = ref({

chart: {
  type: 'area',
  toolbar: {
    show: false,
  },
  zoom: {
    enabled: false,
  },
},
series: [
  {
    name: 'Consumption',
    data: generateRandomData(30), // Generate random data for the last 30 days
  },
],
dataLabels: {
  enabled: false,
},
stroke: {
  show: true,
  curve: 'smooth',
  lineCap: 'butt',
  colors: undefined,
  width: 2,
},

grid: {
  show:false,
  row: {
    opacity: 0,
  },
},
xaxis: {
  type: 'datetime',
},
yaxis: {
  show: false, // Hide the y-axis
},
tooltip: {
  x: {
    format: 'dd MMM yyyy',
  },
},
fill: {
  type: 'gradient',
  gradient: {
    shadeIntensity: 1,
    opacityFrom: 0.7,
    opacityTo: 0.9,
    stops: [0, 100],
  },
},
colors: ['#46DAE5'],
legend: {
  show: false, // Hide the legend
},
});

// Function to generate random data for the last n days
function generateRandomData(days:any) {
const currentDate = new Date();
const data = [];

for (let i = days - 1; i >= 0; i--) {
  const date = new Date(currentDate);
  date.setDate(currentDate.getDate() - i);
  const consumption = Math.random() * 5; // Random consumption between 0 and 5
  data.push({ x: date.getTime(), y: consumption });
}

return data;
}


// end of CHART SETTING




</script>