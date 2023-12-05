<template>
    <div class="flex  justify-between items-center">
        <h1 class="font-bold text-lg">New Device</h1>
        <button type="button" @click="closeNewDeviceModal"
            class="p-1 -m-1transition-all duration-200 rounded-md text-gray-900 bg-gray-100">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
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
                    <input v-model="newDevice.name" type="text" name="" id="" placeholder="DEV12345678"
                        class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 sm:text-sm caret-blue-600" />
                </div>
            </div>

            <div>
                <button type="button" @click="addNewDevice"
                    class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-black border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-black">
                    Add Device <span v-if="deviceStore.isAddingNewDevice" class="ml-2 loading loading-spinner"></span>
                </button>
            </div>
        </div>
    </form>
</template>
<script setup lang="ts">
import type { IDevice } from '~/server/api/device/model/device.model';
import { useAuthStore } from '~/stores/auth/auth.store';
import { useControlStore } from '~/stores/control/control.store';
import { useDeviceStore } from '~/stores/device/device.store';

const newDevice = ref<IDevice>({} as IDevice)
const deviceStore = useDeviceStore()
const controlStore = useControlStore()
const authStore = useAuthStore()

const closeNewDeviceModal = () => controlStore.closeModal("addNewDeviceModal")

watch(deviceStore, async state => {

if(state.success_AddingNewDevice){
    closeNewDeviceModal();
    newDevice.value = {} as IDevice;
    await deviceStore.getDevicesByUser(authStore.currentUser.objectId);
    return;
}

if(state.failed_AddingNewDevice){
    alert(state.newDeviceApiFailure.message);
    return;
}

})

const addNewDevice = async()=>{
    await deviceStore.addNewDevice(newDevice.value)
}
</script>