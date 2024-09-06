<template>
    <Popover @update:open="handlePopoverOpen">
        <PopoverTrigger>
            <Button variant="outline" size="sm" class="h-8 border-dashed border-violet-400">
                <PlusCircleIcon class="mr-2 h-4 w-4" />
                <p class="mr-2">Clusters</p>
                <template v-if="selectedValues.size === 0">
                    <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                        All
                    </Badge>
                </template>
                <template v-else-if="selectedValues.size <= 2">
                    <Badge v-for="clusterId in selectedValues" :key="clusterId" variant="secondary" class="mx-1 rounded-sm px-1 font-normal">
                        {{ getClusterName(clusterId) }}
                    </Badge>
                </template>
                <template v-else>
                    <div class="hidden space-x-2 lg:flex">
                        <Badge variant="secondary" class="rounded-sm px-2 font-normal">
                            {{ selectedValues.size }} selected
                        </Badge>
                    </div>
                </template>
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <div v-if="isLoading">
                        <p class="text-muted-foreground text-xs m-5">Loading clusters...</p>
                    </div>
                    <template v-else>
                        <CommandGroup :heading="title" class="space-y-4">
                            <CommandItem value="all" class="flex gap-3 items-center cursor-pointer" @click="handleAllSelection">
                                <Checkbox :checked="isAllSelected" @update:checked="handleAllSelection" class="h-4 w-4" />
                                <p>All Groups</p>
                            </CommandItem>
                            <CommandItem v-for="cluster in clusters" :key="cluster.id" :value="cluster.name"
                                class="flex gap-3 items-center cursor-pointer" @click="handleCommandSelection(cluster)">
                                <Checkbox :checked="isClusterSelected(cluster.id)" @update:checked="(value) => handleClusterSelection(cluster.id, value)" class="h-4 w-4" />
                                <p>{{ cluster.name }}</p>
                            </CommandItem>
                        </CommandGroup>
                    </template>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { PlusCircleIcon } from 'lucide-vue-next'
import { useDeviceStore } from '~/stores/device/device.store'

interface Cluster {
    id: string;
    name: string;
}

interface ClusterFacetedFilterProps {
    title?: string;
    maxSelections?: number;
}

const props = withDefaults(defineProps<ClusterFacetedFilterProps>(), {
    maxSelections: Infinity
})
const emits = defineEmits(['handlePopoverOpen', 'handleFilter'])

const deviceStore = useDeviceStore()
const clusters = ref<Cluster[]>([])
const isLoading = ref(true)
const selectedValues = ref(new Set<string>())

const isAllSelected = computed(() => selectedValues.value.size === 0)

const isClusterSelected = (clusterId: string) => selectedValues.value.has(clusterId)

const getClusterName = (clusterId: string) => {
    const cluster = clusters.value.find(c => c.id === clusterId)
    return cluster ? cluster.name : ''
}

const handlePopoverOpen = (state: boolean) =>
    emits('handlePopoverOpen', state)

const handleAllSelection = () => {
    selectedValues.value.clear()
    emitFilterChange()
}

const handleClusterSelection = (clusterId: string, value: boolean) => {
    if (value && selectedValues.value.size < props.maxSelections) {
        selectedValues.value.add(clusterId)
    } else if (!value) {
        selectedValues.value.delete(clusterId)
    }
    emitFilterChange()
}

const handleCommandSelection = (cluster: Cluster) => {
    console.log('handleCommandSelection called with:', cluster)
    if (selectedValues.value.has(cluster.id)) {
        selectedValues.value.delete(cluster.id)
    } else if (selectedValues.value.size < props.maxSelections) {
        selectedValues.value.add(cluster.id)
    }
    emitFilterChange()
}

const emitFilterChange = () => {
    emits('handleFilter', Array.from(selectedValues.value))
}

onMounted(async () => {
    try {
        const deviceGroups = await deviceStore.getOrgDeviceGroup()
        clusters.value = deviceGroups.map(group => ({
            id: group.objectId,
            name: group.name
        }))
    } catch (error) {
        console.error('Failed to load clusters:', error)
    } finally {
        isLoading.value = false
    }
})

watch(() => props.maxSelections, (newMax) => {
    if (selectedValues.value.size > newMax) {
        const valuesToKeep = Array.from(selectedValues.value).slice(0, newMax)
        selectedValues.value = new Set(valuesToKeep)
        emitFilterChange()
    }
})
</script>