<script setup lang="ts">
import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

import { ref } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const emits = defineEmits(['handleDateChange'])
const currentDate = new Date();
const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

const date = ref({
  start: startOfMonth,
  end: endOfMonth
})

const isOpen = ref(false)

const handleDateChange = (newDate: any) => {
  date.value = newDate
  emits('handleDateChange', newDate)
  if (newDate.start && newDate.end) {
    isOpen.value = false
  }
}
</script>

<template>
  <div :class="cn('grid gap-2', $attrs.class ?? '')">
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <Button
          id="date"
          :variant="'outline'"
          :class="[
            'w-full justify-center text-left text-xs font-bold',
            !date && 'text-muted-foreground',
      ]"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />

          <span>
            {{ date.start ? (
              date.end ? `${format(date.start, 'LLL dd, y')} - ${format(date.end, 'LLL dd, y')}`
              : format(date.start, 'LLL dd, y')
            ) : 'Pick a date' }}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar
        @update:model-value="handleDateChange"
          v-model.range="date"
          :columns="2"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
