<template>
    <div class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between max-h-[225px]">
        <div>
            <Badge class="bg-green-100"><span class="text-xs text-green-400">Primary</span></Badge>
        </div>
        <div class="w-20 mx-auto ">
            <img class="w-full h-full object-cover" src="/img/lorawan.png"/>
        </div>

        <div>
            <p class="text-sm text-gray-500">{{ option.device.name }}</p>
            <h1 class="font-bold text-xl">{{ option.device.lastTotalConsumption.toFixed(2)}}k L</h1>
            <div class="flex gap-2 justify-start items-center mt-2" v-if="!option.hideUpdateDate">
                <Icon name="ic:baseline-update" class="text-blue-500"></Icon>
                <p class="text-xs text-gray-500">{{useRelativeDateHuman(new Date(option.device.updatedAt))}}</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
/* __placeholder__ */
import { useRelativeDateHuman } from '~/composables/use_format_date';
import type { DeviceCardOptionDTO } from '~/utils/dto/deviceCard.option.dto';
const props = defineProps({
    option: {
        type: Object as () => DeviceCardOptionDTO,
        required: true
    }
})
</script>