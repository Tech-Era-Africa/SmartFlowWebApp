<template>
    <div class="w-screen h-screen bg-pageBg relative">
        <div class="w-full h-full flex flex-col gap-12 justify-center items-center">
            <div class="w-28">
                <Logo></Logo>
            </div>


            <template v-if="paymentStore.success_ProcessingBillPayment">

                <div class="w-1/3 rounded-lg flex flex-col gap-5 mx-auto bg-white p-5">

                    <div class="w-full h-40 bg-contain bg-invoiceBg bg-right-top"></div>
                    <h1 class="font-bold text-xl text-center">Successfully Paid Bill <Icon class="text-green-500"
                            name="material-symbols:check-circle-outline-rounded">
                        </Icon>
                    </h1>
                    <p class="text-sm text-center text-gray-500">You have successfully paid your water bill.</p>

                    <div class="flex items-center gap-2 w-full">
                        <button @click="viewBill" class="flex-1 btn btn-outline">View Bill</button>
                    </div>
                </div>

            </template>

            <div v-else class="  flex flex-col items-center gap-5">
                <div class=" text-gray-500 text-center">
                    <p>Verifying Payment <Icon v-if="paymentStore.success_VerifyingPayment" class="text-green-500"
                            name="material-symbols:check-circle-outline-rounded">
                        </Icon>
                    </p>
                    <p class="mt-5" v-if="paymentStore.success_VerifyingPayment">Validating Bill <Icon
                            v-if="paymentStore.success_ProcessingBillPayment" class="text-green-500"
                            name="material-symbols:check-circle-outline-rounded">
                        </Icon>
                    </p>
                </div>
                <span v-if="!paymentStore.success_VerifyingPayment || !paymentStore.success_ProcessingBillPayment"
                    class="loading loading-infinity text-blue-500"></span>
            </div>




        </div>
    </div>
</template>

<script setup lang="ts">
import { usePaymentStore } from '~/stores/payment/payment.store';


useHead({
    title: `Bill Payment Status - ${useRoute().params.id}`
})

const paymentStore = usePaymentStore();
const billId = ref(useRoute().params.id)
const { reference } = useRoute().query;

onMounted(async () => {

    if (!billId.value) {
        alert("Invalid bill!")
        return;

    }

    if (reference) {
        const ref = await paymentStore.verifyPayment(reference?.toString())

        if (paymentStore.failed_VerifyingPayment) {
            alert("Failed to verify payment")
            useRouter().back();
            return

        }

        // Update the bill when verification is successful
        if (paymentStore.success_VerifyingPayment) {
            await paymentStore.processBillPayment({ billId: billId.value.toString(), paymentRef: reference!.toString() })

        }
        return;
    }

    // Fallback
    alert("Payment reference not found")
    useRouter().back();
})


const viewBill = ()=> useRouter().replace(`/billing/invoice/${billId.value}`)



</script>