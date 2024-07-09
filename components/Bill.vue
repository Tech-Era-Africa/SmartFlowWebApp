<template>
    <div class="flex justify-between items-center">

        <div class="flex flex-col gap-4 w-full">

            <div class="flex justify-between items-center ">

                <p class="text-muted-foreground text-xs">INVOICE</p>
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline" size="icon">
                            <Share2 class="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-56 border-none mr-8">
                        <DropdownMenuLabel>Share</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Copy class="mr-2 h-4 w-4" />
                                <span>Copy Link</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <File class="mr-2 h-4 w-4" />
                                <span>Export as PDF</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>


            </div>
            <NuxtLink to="/" class="mx-auto">
                    <Logo class="h-12"></Logo>
                </NuxtLink>


            <div class="flex gap-4 items-center justify-between">
                <div>
                    <p class="text-black font-bold text-xs">Cluster</p>

                    <h1 class="text-3xl font-extrabold">{{ option.cluster.name }}</h1>
                </div>
                <div class="flex gap-2">
                    <Badge class="border-dashed rounded-sm border-primary text-primary" variant="outline">{{
                    option.billType.name
                }}

                    </Badge>
                    <Badge class=" border-primary text-primary" variant="outline">{{ option.status.name }}</Badge>
                </div>
            </div>

            <div class="flex gap-4 items-center justify-between">

                <div>
                    <p class="text-black font-bold text-xs">Bill ID</p>
                    <p class="text-gray-500 font-bold text-xs">#{{ option.objectId }}</p>
                </div>
                <div>
                    <p class="text-black font-bold text-xs">Period</p>
                    <p class="text-gray-500 font-bold text-xs">Nov 2023 - Dec 2023</p>
                </div>

            </div>




        </div>

        <!-- <div>
            <p class="text-xs text-right">Month</p>
            <h3 class="font-bold text-gray-600">{{ useFormatDateHuman(new Date(option.createdAt)) }}</h3>
        </div> -->

    </div>
    <Separator class="space-y-20" />
    <section class="rounded-xl h-[250px] bg-lime-50 mb-10">
        <WaterConsumptionChart :option="clusterConsumptionChart"></WaterConsumptionChart>
    </section>
    <!-- <div v-for="device in option.devices" class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between">
        <div class="w-40 mx-auto ">
            <img class="w-full h-full object-cover" src="/img/lorawan.png" />
        </div>

        <div class="flex justify-between items-center">
            <div>
                <p class="text-sm text-gray-500">Name</p>
                <h1 class="font-bold text-xl">{{ device.name }}</h1>
            </div>
            <div>
                <p class="text-sm text-gray-500">Total Consumption</p>
                <h1 class="font-bold text-xl text-right"><span>{{ useUseCubicToLitre(device.consumption) 
                }}L</span>
                </h1>
            </div>
        </div>

    </div> -->
    <template v-if="!option">
        <span class="loading loading-spinner"></span>
    </template>
    <template v-else>
        <div class="flex flex-col gap-4">

            <div class="flex justify-between items-center text-xs">
                <p>Organisation</p>
                <div class="flex items-center gap-2">
                    <Avatar size="sm" style="width:20px; height: 20px">
                        <AvatarImage :src="option.organisation.avatarUrl ?? ''" alt="organisation avatar" />
                        <AvatarFallback>DD</AvatarFallback>
                    </Avatar>

                    <p class="text-xs font-bold">{{ option.organisation.name }}</p>

                </div>

            </div>

            <div class="flex justify-between items-center text-xs">
                <p>Created By</p>
                <div class="flex items-center gap-2">
                    <Avatar size="sm" style="width:20px; height: 20px">
                        <AvatarImage :src="option.createdBy.avatarUrl ?? ''" alt="created by avatar" />
                        <AvatarFallback>DD</AvatarFallback>
                    </Avatar>

                    <p class="text-xs font-bold">{{ option.createdBy.firstName }} {{ option.createdBy.lastName }}</p>

                </div>
            </div>

            <div class="flex justify-between items-center text-xs">
                <p>Bill Date</p>
                <p>{{ useFormatDateHuman(new Date(option.createdAt ?? '')) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Consumption</p>
                <p>{{ Math.ceil(option.totalConsumption ?? 0) }}k L</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Water Charge</p>
                <p>{{ useUseFormatCurrency(option.waterCharge ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>1% Fire Fighting</p>
                <p>{{ useUseFormatCurrency(option.fireCharge ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>2% Rural Water</p>
                <p>{{ useUseFormatCurrency(option.ruralCharge ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Service Charge</p>
                <p>{{ useUseFormatCurrency(option.serviceCharge ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Current Charges</p>
                <p>{{ useUseFormatCurrency(option.amount ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Previous Balance</p>
                <p>GHC0</p>
            </div>

            <div class="flex justify-between items-center text-lg font-bold">
                <h1>Total Bill</h1>
                <h1>{{ useUseFormatCurrency(option.amount) }}</h1>
            </div>

        </div>
        <Button v-if="!isPaid" @click="payBill">Pay Bill <span v-if="paymentStore.isInitPayment"
                class="ml-2 loading loading-spinner"></span></Button>
    </template>
</template>

<script setup lang="ts">

import { BillType } from '~/utils/class/billType.class';
import { usePaymentStore } from '~/stores/payment/payment.store';
import type { IBill, IBillOption } from '~/stores/bill/model/bill.model';
import { Copy, Download, File, Share2 } from 'lucide-vue-next';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';
import { useDeviceStore } from '~/stores/device/device.store';


const paymentStore = usePaymentStore()
const deviceStore = useDeviceStore()

const props = defineProps({
    option: {
        type: Object as () => IBill,
        required: true
    },
})

const clusterConsumptionChart = ref<IWaterConsumptionChart>({
    title: "Consumption Trend",
    chartSeries: deviceStore.selectedDeviceConsumptionTrend,
    isLoading: deviceStore.loading_SelectedDeviceConsumptionTrend,
    success: deviceStore.success_SelectedDeviceConsumptionTrend,
})

const currentDate = new Date();
const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
clusterConsumptionChart.value.chartSeries = await deviceStore.getClusterConsumptionTrend(props.option.cluster.objectId, startOfMonth.toISOString(), endOfMonth.toISOString())

const payBill = async () => {
    //Fistt check if another bill has been created latest to this and prompt the user to go for that one instead
    const res = await paymentStore.initPayment({
        amount: 1 * 100,
        email: "ronaldnettey360@gmail.com",
        billId: props.option.objectId
    })

    // // Open the new page in a new tab/window
    navigateTo(res.data.authorization_url, { external: true })


}

const isPaid = computed(() => props.option.status.objectId == 'vcDFmQoFkD')



</script>