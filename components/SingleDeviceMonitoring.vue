<template>
    <div class="w-full bg-white rounded-xl p-5 flex flex-col gap-2">
        <div class="flex  justify-between items-center">
            <h1 class="font-bold text-lg">Device Monitoring</h1>
            <!-- <button class="btn">
                Device A
                <Icon name="ion:caret-down-outline" />
            </button> -->
        </div>
        <div class="flex-1 flex flex-col lg:flex-row gap-2">
            <div class="w-full flex flex-col gap-2">
                <div class="flex gap-2">
                    <Stat :option="{ title: 'Status', value: `${useUseStatusName(option.device.status)}` }"></Stat>
                    <Stat :option="{ title: 'Users', value: '0' }"></Stat>
                </div>
                <div class="flex gap-2">
                    <Stat :option="{ title: 'Battery', value: `${option.device.battery}` }"></Stat>
                    <Stat :option="{ title: 'Valve', value: option.device.valveIsOpen ? 'Open' : 'Closed' }"></Stat>
                </div>
                <div class="flex gap-2">
                    <Stat :option="{ title: 'Total Consumption', value: `${useUseCubicToLitre(option.device.consumption)}L` }">
                    </Stat>
                </div>

            </div>
            <div class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between">
                <div class="w-40 mx-auto ">
                    <img class="w-full h-full object-cover" src="/img/lorawan.png"/>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Name</p>
                    <h1 class="font-bold text-xl">{{ option.device.name }}</h1>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { DeviceCardOptionDTO } from '~/utils/dto/deviceCard.option.dto';

defineProps({
    option: {
        type: Object as () => DeviceCardOptionDTO,
        required: true
    }
})

</script>