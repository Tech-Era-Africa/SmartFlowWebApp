<template>
    <div class="flex justify-end">
                <button @click="controlStore.toggleBillSuccessModal()" type="button" class="p-1 -m-1transition-all duration-200 rounded-md text-gray-900 ">
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="w-full h-40 bg-contain bg-invoiceBg bg-right-top"></div>
            <h1 class="font-bold text-xl text-center">Invoice Successfully Created <Icon class="text-green-500"
                    name="material-symbols:check-circle"></Icon>
            </h1>
            <p class="text-sm text-center text-gray-500">Your water bill invoice <span class="font-bold text-blue-600">{{ billStore.createdBill.objectId }}</span> for
            <span class="font-bold text-blue-600">{{ new Date(billStore.createdBill.createdAt).toLocaleDateString() }}</span> has been created. You can copy and share
                the invoice link below or download.</p>

            <div class="p-5 bg-green-50 rounded-2xl text-center relative cursor-pointer" @click="copyText">
                <a class="link link-success">{{baseUrl}}/billing/invoice/{{ billStore.createdBill.objectId }}</a>
                <Icon class="absolute top-5 right-5 text-gray-500" name="material-symbols:content-copy-outline-rounded">
                </Icon>
            </div>
            <p v-show="isCopied" class="text-xs text-center mx-auto text-gray-500">Copied!</p>
            <div class="flex items-center gap-2 w-full">
                <button class="flex-1 btn btn-outline mt-5 cursor-not-allowed">Download Bill</button>
            </div>
</template>

<script setup lang="ts">
import { useBillStore } from '~/stores/bill/bill.store';
import { useControlStore } from '~/stores/control/control.store';

const controlStore = useControlStore()
const billStore = useBillStore()
const isCopied = ref(false)
const baseUrl = useRuntimeConfig().public.APP_BASE_URL


const copyText = async () => {


    try {
        navigator.clipboard.writeText(`${baseUrl}/billing/invoice/${billStore.createdBill.objectId}`);
        isCopied.value = true;

        setTimeout(() => {
            // RESET
            isCopied.value = false;
        }, 2500);
    }
    catch (e) {
        console.log("Something went wrong: ", e)
    }


}

</script>