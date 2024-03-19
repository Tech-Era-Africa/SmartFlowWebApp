<template>
    <div class="flex  justify-between items-center">
        <h1 class="font-bold text-lg">New Device</h1>
    </div>
    <div class="w-full relative bg-blue-50 rounded-xl p-5 flex flex-col justify-between transition ease-in-out delay-150">
        <div class="absolute left-5 top-5 flex flex-col gap-5">
            <div>
                <p class="text-xs font-bold text-black">EUI</p> 
            <p class="text-muted-foreground text-xs">{{ values.eui }}</p>
            </div>
            <div>
                <p class="text-xs font-bold text-black">Device Id</p> 
            <p class="text-muted-foreground text-xs">{{ values.deviceId }}</p>
            </div>
          
        </div>
        <div class="w-40 mx-auto ">
            <img class="w-full h-full object-cover" src="/img/lorawan.png" />
        </div>

        <div class="text-center">
            <h1 class="font-bold text-xl">{{values.deviceName }}</h1>
        </div>
    </div>
    <form class="w-full space-y-6" @submit="onFormSubmit">
        <FormField v-slot="{ componentField }" name="eui">
            <FormItem>
                <FormControl>
                    <FormLabel class="text-sm font-bold text-gray-900">
                        EUI
                    </FormLabel>
                    <Input class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"  type="text" placeholder="00-11-22-33-44-55-66-77" v-bind="componentField"
                        :disabled="deviceStore.isAddingNewDevice" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="deviceId">
            <FormItem>
                <FormControl>
                    <FormLabel class="text-sm font-bold text-gray-900">
                        Device Id
                    </FormLabel>
                    <Input class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"  type="text" placeholder="DEV12345678" v-bind="componentField"
                        :disabled="deviceStore.isAddingNewDevice" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="deviceName">
            <FormItem>
                <FormControl>
                    <FormLabel class="text-sm font-bold text-gray-900">
                        Device Name
                    </FormLabel>
                    <Input class="border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"  type="text" placeholder="Outdoor Device" v-bind="componentField"
                        :disabled="deviceStore.isAddingNewDevice" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <Button type="submit" class="w-full"
            >
            <template v-if="deviceStore.isAddingNewDevice">
                <Loader2 class="animate-spin"></Loader2>
            </template>
            <span v-else>Create New Device</span>
        </Button>
    </form>
    <!-- <form class="mt-4">
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
                <Button type="button" @click="addNewDevice"
                    class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-black border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-black">
                    Add Device <Loader2 v-if="deviceStore.isAddingNewDevice" class="animate-spin"></Loader2>
                </Button>
            </div>
        </div>
    </form> -->
</template>

<script setup lang="ts">

import { useDeviceStore } from '~/stores/device/device.store';
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'
import type { IDevice } from '~/stores/device/model/device.model';

const props = defineProps<{ clusterId: string }>()
const emits = defineEmits(['update:open'])

const newDevice = ref<IDevice>({} as IDevice)
const deviceStore = useDeviceStore()

const addNewDevice = async (deviceData:{eui:string, deviceId:string, deviceName:string}) => {
    // Update the new device ref
    newDevice.value = {...newDevice.value, ...deviceData, name:deviceData.deviceName}

    await deviceStore.addNewDevice(newDevice.value, props.clusterId)

    // Handle success
    if (deviceStore.success_AddingNewDevice) {
        emits('update:open',false)
        useRouter().go(0); //TODO!: GIVE THIS A BETTER EXPERIENCE
        return;
    }

    // Handle error
    alert("Could not add device. Something went wrong.")
}

// FORM SETTINGS
const formSchema = toTypedSchema(z.object({
    eui: z.string().min(2, "EUI should be more than 2 characters").max(20, "EUI should not be more than 20 characters"),
    deviceId: z.string().min(2, "Device Id should be more than 2 characters").max(20, "Device Id should not be more than 20 characters"),
    deviceName: z.string().min(2, "Device name should be more than 2 characters").max(20, "Device name should not be more than 20 characters"),

}))

const { handleSubmit, values } = useForm({
    validationSchema: formSchema,
})

const onFormSubmit = handleSubmit(async (values) => addNewDevice(values))
//  end of FORM SETTINGS
</script>