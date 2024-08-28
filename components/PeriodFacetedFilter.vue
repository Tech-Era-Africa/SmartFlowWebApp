<template>
    <Popover @update:open="handlePopoverOpen">
        <PopoverTrigger>
            <Button variant="outline" size="sm" class="h-8 border-dashed border-violet-400">
                <CalendarIcon class="mr-2 h-4 w-4" />
                <p class="mr-2">{{ title }}</p>
                <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                    {{ getPeriodLabel(selectedPeriod) }}
                </Badge>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[200px]">
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandGroup :heading="title">
                        <CommandItem 
                            v-for="period in periods" 
                            :key="period.value" 
                            :value="period.label"
                            class="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-gray-100"
                            @click="handleCommandSelection(period.value)">
                            <span>{{ period.label }}</span>
                            <CheckIcon v-if="selectedPeriod === period.value" class="h-4 w-4 text-blue-500" />
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { CalendarIcon, CheckIcon } from 'lucide-vue-next'
import { ref, watch } from 'vue'

const props = defineProps<{
    title?: string;
}>()

const emits = defineEmits(['handlePopoverOpen', 'onDateChanged'])

const selectedPeriod = ref('year')

const periods = ref([
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
])

const getPeriodLabel = (value: string) => {
    return periods.value.find(period => period.value === value)?.label || 'Select Period'
}

const handlePopoverOpen = (state: boolean) =>
    emits('handlePopoverOpen', state)

const handleCommandSelection = (period: string) => {
    selectedPeriod.value = period
    const currentDate = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
        case 'month':
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            break;
        case 'week':
            const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDayOfWeek);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDayOfWeek + 6);
            break;
        case 'year':
            startDate = new Date(currentDate.getFullYear(), 0, 1);
            endDate = new Date(currentDate.getFullYear(), 11, 31);
            break;
        default:
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }

    emits('onDateChanged', {
        start: startDate,
        end: endDate
    });
}

watch(selectedPeriod, (newPeriod) => {
    handleCommandSelection(newPeriod)
})
</script>