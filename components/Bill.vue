<template>
    <div class="flex justify-between items-center">
        <div class="flex flex-col gap-4 w-full">
            <div class="flex gap-4 items-center justify-between">
                <Logo class="h-7"></Logo>
                <div>
                    <p class="text-black font-bold text-xs">Bill ID</p>
                    <p class="text-gray-500 font-bold text-xs">{{ option.bill.objectId }}</p>
                </div>
                <div>
                    <p class="text-black font-bold text-xs">Period</p>
                    <p class="text-gray-500 font-bold text-xs">Nov 2023 - Dec 2023</p>
                </div>

            </div>



            <div class="flex gap-2">
                <div class="badge" :class="Status.getColor(option.bill.status.objectId)">{{
                    Status.getName(option.bill.status.objectId) }}</div>
                <div class="badge badge-default">{{ BillType.getName(option.bill.billType.objectId) }}</div>
            </div>
        </div>

        <!-- <div>
            <p class="text-xs text-right">Month</p>
            <h3 class="font-bold text-gray-600">{{ useFormatDateHuman(new Date(option.bill.createdAt)) }}</h3>
        </div> -->

    </div>

    <div v-for="device in option.devices" class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between">
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

    </div>
    <template v-if="!option">
        <span class="loading loading-spinner"></span>
    </template>
    <template v-else>
        <div class="flex flex-col gap-4">

            <div class="flex justify-between items-center text-xs">
                <p>Bill Date</p>
                <p>{{ useFormatDateHuman(new Date(option.bill.createdAt)) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Consumption</p>
                <p>{{  useUseCubicToLitre(0) }}L</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Water Charge</p>
                <p>{{ useUseFormatCurrency(option.bill.waterCharge ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>1% Fire Fighting</p>
                <p>{{ useUseFormatCurrency(option.bill.fireCharge ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>2% Rural Water</p>
                <p>{{ useUseFormatCurrency(option.bill.ruralCharge ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Service Charge</p>
                <p>{{ useUseFormatCurrency(option.bill.serviceCharge ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Current Charges</p>
                <p>{{ useUseFormatCurrency(option.bill.amount ?? 0) }}</p>
            </div>
            <div class="flex justify-between items-center text-xs">
                <p>Previous Balance</p>
                <p>GHC0</p>
            </div>

            <div class="flex justify-between items-center text-lg font-bold">
            <h1>Total Bill</h1>
            <h1>{{ useUseFormatCurrency(option.bill.amount ) }}</h1>
        </div>

        </div>
        <div v-if="!isPaid" @click="payBill" class="btn bg-green-600 text-white hover:bg-green-600 hover:text-white">Pay Bill <span v-if="paymentStore.isInitPayment"
                class="ml-2 loading loading-spinner"></span></div>
    </template>
</template>

<script setup lang="ts">

import type { IBillOption } from '~/server/api/bill/model/bill.model';
import { Status } from '~/utils/class/status.class';
import { BillType } from '~/utils/class/billType.class';
import { usePaymentStore } from '~/stores/payment/payment.store';


const paymentStore = usePaymentStore()

const props = defineProps({
    option: {
        type: Object as () => IBillOption,
        required: true
    },
})

const payBill = async() => {
    //Fistt check if another bill has been created latest to this and prompt the user to go for that one instead
   const res =  await paymentStore.initPayment({
        amount : 1 * 100,
        email : "ronaldnettey360@gmail.com",
        billId : props.option.bill.objectId
    })

    // // Open the new page in a new tab/window
    window.location.href = res.data.authorization_url

}

const isPaid = computed(()=> props.option.bill.status.objectId == 'vcDFmQoFkD')



</script>~/stores/bill/model/bill.model