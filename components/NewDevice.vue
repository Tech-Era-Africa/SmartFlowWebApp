<template>
    <div class="flex  justify-between items-center">
        <h1 class="font-bold text-lg">New Device</h1>
    </div>
    <div class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between transition ease-in-out delay-150">
        <div class="w-40 mx-auto ">
            <img class="w-full h-full object-cover" src="/img/lorawan.png" />
        </div>

        <div class="text-center">
            <h1 class="font-bold text-xl">{{ newDevice.name }}</h1>
        </div>
    </div>
    <form action="#" method="POST" class="mt-4">
        <div class="space-y-4">
            <div>
                <label for="" class="text-sm font-bold text-gray-900"> EUI </label>
                <div class="mt-2">
                    <input v-model="newDevice.eui" type="text" name="" id="" placeholder="00-11-22-33-44-55-66-77"
                        class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600" />
                </div>
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <label for="" class="text-sm font-bold text-gray-900"> Device Id </label>
                </div>
                <div class="mt-2">
                    <input v-model="newDevice.deviceId" type="text" name="" id="" placeholder="DEV12345678"
                        class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600" />
                </div>
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <label for="" class="text-sm font-bold text-gray-900"> Device Name </label>
                </div>
                <div class="mt-2">
                    <Input v-model="newDevice.name" type="text" name="" id="" placeholder="Outdoor Device"
                        class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 sm:text-sm caret-blue-600" />
                </div>
            </div>

            <div>
                <Button  @click="addNewDevice"
                    class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-black border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-black">
                    Add Device <Loader2 v-if="deviceStore.isAddingNewDevice" class="animate-spin"></Loader2>
                </Button>
            </div>
        </div>
    </form>
</template>
<script setup lang="ts">
import type { IDevice } from '~/server/api/device/model/device.model';

import { useDeviceStore } from '~/stores/device/device.store';
import { Loader2 } from 'lucide-vue-next'

const props = defineProps<{clusterId:string}>()

const newDevice = ref<IDevice>({} as IDevice)
const deviceStore = useDeviceStore()

const addNewDevice = async()=>{
    await deviceStore.addNewDevice(newDevice.value, props.clusterId)

    // Handle success
    if(deviceStore.success_AddingNewDevice){
        console.log("Successfully added device")
        return;
    }

    // Handle error
    alert("Could not add device. Something went wrong.")
}
</script>