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
            <p class="text-sm text-gray-500">Your water bill invoice <span class="font-bold text-blue-600">#123</span> for
                month <span class="font-bold text-blue-600">November 2023</span> has been created. You can copy and share
                the invoice link below or download.</p>

            <div class="p-5 bg-green-50 rounded-2xl text-center relative cursor-pointer" @click="copyText">
                <a class="link link-success">http://localhost:3000/billing/invoice/#12324</a>
                <Icon class="absolute top-5 right-5 text-gray-500" name="material-symbols:content-copy-outline-rounded">
                </Icon>
            </div>
            <p v-show="isCopied" class="text-xs text-green-500">Copied!</p>
            <div class="flex items-center gap-2 w-full">
                <button class="flex-1 btn btn-outline   mt-5">Download Bill</button>
            </div>
</template>

<script setup lang="ts">
import { useControlStore } from '~/stores/control/control.store';

const controlStore = useControlStore()
const isCopied = ref(false)


const copyText = async () => {


    try {
        navigator.clipboard.writeText(`https://cfc-admin.netlify.app/account/invite?id=`);
        isCopied.value = true;

        useRouter().push('/billing/invoice/sd')
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