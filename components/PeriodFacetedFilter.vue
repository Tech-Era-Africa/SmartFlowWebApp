<template>
    <Popover v-model:open="isOpen" @update:open="handlePopoverOpen">
        <PopoverTrigger>
            <Button variant="outline" size="sm" class="h-8 border-dashed border-violet-400">
                <CalendarIcon class="mr-2 h-4 w-4" />
                <p class="mr-2">{{ title }}</p>
                <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                    {{ getPeriodLabel(selectedPeriod) }}
                </Badge>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[300px]">
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
                        <CommandItem 
                            value="custom"
                            class="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-gray-100"
                            @click="handleCommandSelection('custom')">
                            <span>Custom Range</span>
                            <CheckIcon v-if="selectedPeriod === 'custom'" class="h-4 w-4 text-blue-500" />
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
            <div v-if="selectedPeriod === 'custom'" class="mt-4">
                <DateRangePicker @handleDateChange="handleCustomRangeChange"></DateRangePicker>
                <Button @click="applyCustomRange" class="mt-2 w-full">Apply</Button>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { CalendarIcon, CheckIcon } from 'lucide-vue-next'

const props = defineProps<{
    title?: string;
}>()

const emits = defineEmits(['handlePopoverOpen', 'onDateChanged'])

const selectedPeriod = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')
const isOpen = ref(false)
const tempCustomRange = ref<{ start: Date, end: Date } | null>(null)

const periods = ref([
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
])

const getPeriodLabel = (value: string) => {
    if (value === 'custom') {
        return `${customStartDate.value} - ${customEndDate.value}`
    }
    return periods.value.find(period => period.value === value)?.label || 'Select Period'
}

const handlePopoverOpen = (state: boolean) => {
    emits('handlePopoverOpen', state)
}

const handleCommandSelection = (period: string) => {
    selectedPeriod.value = period
    if (period !== 'custom') {
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
            end: endDate,
            period : period ?? 'period'
        });
        isOpen.value = false;
    }
}

const handleCustomRangeChange = (range: { start: Date, end: Date }) => {
    tempCustomRange.value = range;
}

const applyCustomRange = () => {
    if (tempCustomRange.value) {
        customStartDate.value = tempCustomRange.value.start.toISOString().split('T')[0];
        customEndDate.value = tempCustomRange.value.end.toISOString().split('T')[0];
        emits('onDateChanged', tempCustomRange.value);
        isOpen.value = false;
    }
}

watch(selectedPeriod, (newPeriod) => {
    if (newPeriod !== 'custom') {
        handleCommandSelection(newPeriod)
    }
})

onMounted(() => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    customStartDate.value = startOfMonth.toISOString().split('T')[0];
    customEndDate.value = endOfMonth.toISOString().split('T')[0];
    
    handleCommandSelection('month');
})
</script>