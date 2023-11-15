<template>
    <div class="w-full bg-blue-50 rounded-xl p-5 flex flex-col justify-between">
                <div class="w-20 mx-auto ">
                    <img class="w-full h-full object-cover" src="/img/lorawan.png"/>
                </div>

                <div>
                    <p class="text-sm text-gray-500">{{ option.name }}</p>
                    <h1 class="font-bold text-xl">{{option.volume}}L</h1>
                </div>
            </div>
</template>
<script setup lang="ts">
/* __placeholder__ */
import type { DeviceCardOptionDTO } from '~/utils/dto/deviceCard.option.dto';
const props = defineProps({
    option: {
        type: Object as () => DeviceCardOptionDTO,
        default: {
            name: 'Device A',
            volume: 0,

        } as DeviceCardOptionDTO,
        required: true
    }
})
</script>