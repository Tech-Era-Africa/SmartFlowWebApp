<template>

<div class="w-screen h-screen bg-pageBg relative">
    <div class="h-40 bg-invoiceBg-1 bg-cover"></div>
    <div class="lg:w-1/3 mx-auto p-8 flex flex-col gap-5 bg-white absolute left-0 right-0 top-11 rounded-lg">
        <Bill :option="{device: billOption}"></Bill>
    </div>
</div>
    
 
</template>
<script setup lang="ts">
import { useDeviceStore } from '~/stores/device/device.store';

const deviceStore = useDeviceStore()
const billOption = ref(deviceStore.selectedDevice)
</script>