<template>

    <div>
        <div class="max-w-1/2 my-2 flex justify-between items-center">
            <!-- SEACRCH BAR AREA -->
            <slot name="dataTableSearch"></slot>

            <!-- ACTIONS AREA -->
            <slot name="dataTableActions"></slot>

            <!-- FILTER FACETS AREA -->
            <slot name="dataTableFacetedFilter"></slot>

        </div>
        <div v-if="table.getRowModel().rows?.length" class="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <NuxtLink :to="`/clusters/${row.original.id}`" v-for="(row, index) in table.getRowModel().rows" :key="row.id">
                <DeviceClusterCard :option="row.original" />
            </NuxtLink>
        </div>
    </div>


</template>

<script setup lang="ts" generic="TData, TValue">
import { getCoreRowModel, useVueTable, FlexRender, getPaginationRowModel, getFilteredRowModel, type ColumnFiltersState, type Updater, getFacetedRowModel, getFacetedUniqueValues, type Row, type ColumnDef } from '@tanstack/vue-table';
import type { ICluster } from '~/stores/cluster/model/cluster.model';


const emit = defineEmits(['getTableData', 'getRowData'])

const props = defineProps<{
    columns: ColumnDef<ICluster, TValue>[]
    data: ICluster[],
}>()

const columnFilters = ref<ColumnFiltersState>([])
const rowSelection = ref({})

function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
    ref.value
        = typeof updaterOrValue === 'function'
            ? updaterOrValue(ref.value)
            : updaterOrValue
}

const table = useVueTable({
    get data() { return props.data },
    get columns() { return props.columns },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
    state: {
        get columnFilters() {
            return columnFilters.value
        },
        get rowSelection() { return rowSelection.value },
    }
})

// Emit table data
emit('getTableData', table)

// Handles the row data out put when an entry is clicked
const handleSelectedRows = (row: Row<ICluster>) => {
    emit('getRowData', row)
}


</script>