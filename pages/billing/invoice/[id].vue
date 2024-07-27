<template>
    <div class="w-screen h-screen bg-pageBg bg-blue-50 relative">

        <template v-if="billStore.isFetchingBill">

            <div class="w-full h-full flex flex-col gap-12 justify-center items-center">
                <div class="w-1/5">
                    <Logo></Logo>
                </div>
                <p class="text-gray-500  flex flex-col items-center gap-5">Fetching the bill <span
                        class="loading loading-infinity text-blue-500"></span></p>
            </div>

        </template>

        <template v-if="billStore.success_FetchingBill">
            <div class="h-72 bg-headerBg bg-cover">


            </div>
            <div class="lg:w-2/5 mx-auto p-8 flex flex-col gap-5 bg-white absolute left-0 right-0 top-11 rounded-lg">
                <template v-if="billStore.hasBill">
                    
                    <Bill :option="billStore.bill"></Bill>
                </template>
                <template v-else>
                    <div class="text-center">
                        <span class="loading loading-infinity text-blue-500 text-center mx-auto"></span>
                    </div>
                   
                </template>

            </div>
        </template>
        <template v-if="billStore.failed_FetchingBill">
            <div class="w-full h-full flex justify-center items-center">
                <div class="w-1/3 rounded-lg flex flex-col gap-5 mx-auto bg-white p-5">

                    <div class="w-full h-40 bg-contain bg-invoiceBg bg-right-top"></div>
                    <h1 class="font-bold text-xl text-center">Invalid Bill <Icon class="text-red-500"
                            name="charm:circle-cross">
                        </Icon>
                    </h1>
                    <p class="text-sm text-center text-gray-500">We're sorry but we've noticed this bill is invalid. Kindly
                        contact the administrator or support to address this issue.</p>


                </div>
            </div>
        </template>


    </div>
</template>

<script setup lang="ts">

import { useBillStore } from '~/stores/bill/bill.store';

// Get the url paramter
const { id } = useRoute().params;

// definePageMeta({ middleware: 'auth' })
useHead({
    title: `Bill Invoice - ${id}`
})


const billStore = useBillStore()

onBeforeMount(async ()=> {
    // Trigger bill fetching
await billStore.getBillInvoice(id.toString())
})






</script>