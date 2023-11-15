<template>
    <div class="flex flex-wrap items-center justify-between w-full  rounded-xl p-5" :class="option.clearBg ? 'bg-white' : 'bg-blue-50'">
        <div>
            <p class="text-sm text-gray-500">{{ option.title }}</p>
            <h1 class="font-bold text-xl">{{ option.value }}</h1>
        </div>
        <slot />
    </div>
</template>
<script setup lang="ts">
/* __placeholder__ */
import type { StatOptionDTO } from '~/utils/dto/stat.option.dto';

const props = defineProps({
    option: {
        type: Object as () => StatOptionDTO,
        default: {
            title: 'Title',
            value: 'Value',

        } as StatOptionDTO,
        required: true
    }
})
</script>
