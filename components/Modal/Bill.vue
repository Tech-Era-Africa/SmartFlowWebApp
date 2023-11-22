<template>
    <dialog id="billModal" class="modal">
        <div class="modal-box flex flex-col gap-5">
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-2xl">Water Bill</h3>
                    <div class="badge badge-accent">Preview</div>
                    <!-- <p class="text-sm text-gray-400">#223dssd</p> -->
                </div>

                <div>
                    <p class="text-xs text-right">Month</p>
                    <h3 class="font-bold text-gray-600">{{ useFormatDateHuman(new Date(Date.now()))}}</h3>
                </div>

            </div>

            <div class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between">
                <div class="w-40 mx-auto ">
                    <img class="w-full h-full object-cover" src="/img/lorawan.png" />
                </div>

                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-500">Name</p>
                        <h1 class="font-bold text-xl">{{ option.device.name }}</h1>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Total Consumption</p>
                        <h1 class="font-bold text-xl text-right"><span v-if="deviceStore.isGettingDeviceConsumption" class="loading loading-spinner loading-xs text-gray-400"></span><span>{{deviceStore.consumption}}L</span></h1>
                    </div>
                </div>

            </div>
            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center text-lg font-bold">
                    <h1>Total Bill</h1>
                    <h1>{{ formatAmount(totalCurrentCharge) }}</h1>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <p>Bill Type</p>
                    <div class="dropdown dropdown-end dropdown-bottom">
                        <label tabindex="" class="btn btn-outline">Domestic
                            <Icon name="ion:caret-down-outline" />
                        </label>
                        <ul tabindex="" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>Domestic</a></li>
                            <li><a>Commercial</a></li>
                            <li><a>Industrial</a></li>
                        </ul>
                    </div>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Bill Date</p>
                    <p>{{ useFormatDateHuman(new Date(Date.now()))}}</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Water Charge</p>
                    <p>{{ formatAmount(getBill().waterCharge) }}</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>1% Fire Fighting</p>
                    <p>{{formatAmount(getBill().firefighting)}}</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>2% Rural Water</p>
                    <p>{{ formatAmount(getBill().ruralWater) }}</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Service Charge</p>
                    <p>{{ formatAmount(getBill().serviceCharge) }}</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Current Charges</p>
                    <p>{{ formatAmount(totalCurrentCharge) }}</p>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <p>Previous Balance</p>
                    <p>GHC0</p>
                </div>

            </div>
            <div class="modal-action">
                <form method="dialog" class="flex gap-4">
                    <span v-if="deviceStore.isGettingDeviceConsumption" class="loading loading-bars"></span>
                    <template v-else>
                        <div class="btn bg-black text-white hover:bg-black hover:text-white" >Create Invoice</div>
                    </template>
                    
                    <button class="btn" >Close</button>
                </form>
            </div>
        </div>
    </dialog>
</template>
<script setup lang="ts">
import type { IDevice } from '~/server/api/device/model/device.model';
import { useDeviceStore } from '~/stores/device/device.store';

const props = defineProps({
    option: {
        type: Object as () => { device:IDevice },
        required: true
    },
})

const deviceStore = useDeviceStore()

const getBill = () => useWaterBillAlgo({ consumption: deviceStore.consumption })

const formatAmount = (number: number, currency?:string) => new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency ?? 'GHS'
}).format(number)


const totalCurrentCharge = computed(()=>getBill().firefighting + getBill().ruralWater + getBill().serviceCharge + getBill().waterCharge)

</script>