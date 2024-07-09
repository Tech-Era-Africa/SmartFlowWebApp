<template>
    <div class="flex flex-wrap items-center justify-between w-full  rounded-xl p-5"
        :class="option.clearBg ? 'bg-white' : 'bg-blue-50'">
        <div>
            <p class="text-sm text-gray-500">{{ option.title }}</p>
            <Loader2 class="animate-spin" v-if="option.isLoading"></Loader2>
            <template v-else>
                <div>
                    <div class="flex gap-2 items-center">
                        <h1 class="font-bold text-xl">{{ option.value }}</h1>
                        <TriangleAlert :size="16" class="text-muted-foreground" v-if="option.hasError"></TriangleAlert>

                    </div>
                    <slot name="bottom" />
                </div>


            </template>
        </div>
        <slot />
    </div>
</template>
<script setup lang="ts">
/* __placeholder__ */
import type { StatOptionDTO } from '~/utils/dto/stat.option.dto';
import { Loader2, TriangleAlert } from 'lucide-vue-next'

const props = defineProps({
    option: {
        type: Object as () => StatOptionDTO,
        default: {
            title: 'Title',
            value: 'Value',
            isLoading: false

        } as StatOptionDTO,
        required: true
    }
})
</script>
