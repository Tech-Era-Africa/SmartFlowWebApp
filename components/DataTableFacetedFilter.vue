<template>
    <Popover @update:open="handlePopoverOpen">
        <PopoverTrigger>
            <Button variant="outline" size="sm" class="h-8 border-dashed border-violet-400">
                <PlusCircleIcon class="mr-2 h-4 w-4" />
                <p class="mr-2">{{ title }}</p>
                <template v-if="filteredValues.length == 0">
                    <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
                        All
                    </Badge>
                </template>
                <template v-else-if="filteredValues.length <= 2">
                    <Badge v-for="data in filteredValues" variant="secondary" class="mx-1 rounded-sm px-1 font-normal">
                        {{ data.label }}
                    </Badge>
                </template>
                <template v-else-if="filteredValues.length > 2">
                    <div class="hidden space-x-2 lg:flex">
                        <Badge variant="secondary" class="rounded-sm px-2 font-normal">
                            {{ filteredValues.length }} selected
                        </Badge>
                    </div>
                </template>

            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-full max-w-full">
            <Command>
                <!-- <CommandInput placeholder="Search..." /> -->
                <CommandList>
                    <div v-if="isLoading">
                        <p class="text-muted-foreground text-xs m-5">Loading {{ title }}..</p>
                    </div>
                    <template v-else>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup :heading="title" class="space-y-4">
                            <CommandItem v-for="data in options" :value="data.label"
                                class="flex gap-3 items-center cursor-pointer" @select="handleCommandSelection(data)">
                                <Checkbox :checked="selectedValues.has(data)" class="h-4 w-4" />
                                <p>{{ data.label }}</p>

                            </CommandItem>
                        </CommandGroup>
                    </template>

                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts" generic="TData">
import { PlusCircleIcon } from 'lucide-vue-next'


export interface DataTableFacatedFilterOptions {
    label: string
    value: any
    icon?: Component
}
export interface DataTableFacetedFilter {
    title?: string,
    isLoading?: boolean,
    options: DataTableFacatedFilterOptions[]
}

const props = defineProps<DataTableFacetedFilter>()
const emits = defineEmits(['handlePopoverOpen', 'handleFilter'])

const selectedValues = reactive(new Set([] as DataTableFacatedFilterOptions[])) //Non repeating set

const filteredValues = computed(() => Array.from(selectedValues));

const handlePopoverOpen = (state: boolean) =>
    emits('handlePopoverOpen', state)



const handleCommandSelection = (data: DataTableFacatedFilterOptions) => {

    const isSelected = selectedValues.has(data);

    if (isSelected) {
        selectedValues.delete(data)
    }
    else {
        selectedValues.add(data)
    }

    emits('handleFilter', filteredValues.value)

}
</script>