<template>
    <DataTableFacetedFilter title="Cluster Type" :options="genderFacetedData" @handle-popover-open="handlePopoverOpen"
        @handle-filter="handleFilter">
    </DataTableFacetedFilter>
</template>
<script setup lang="ts">
import { type Table } from '@tanstack/vue-table'
import type { DataTableFacatedFilterOptions } from '../DataTableFacetedFilter.vue';
import type { ICluster } from '~/stores/cluster/model/cluster.model';


interface TableProps {
    table: Table<ICluster>
}

const props = defineProps<TableProps>()

const genderTypes = [
    {
        label: "Consumption",
        value: "consumption"
    },
    {
        label: "Collection",
        value: "collection"
    }
]

const handlePopoverOpen = (state: boolean) => {

}

const handleFilter = (filteredValues: DataTableFacatedFilterOptions[]) => {

    const columnName = "type"
    if (filteredValues.length == 0) return props.table?.getColumn(columnName)?.setFilterValue(undefined)
    props.table?.getColumn(columnName)?.setFilterValue(filteredValues.map(filterValue => filterValue.value))
}

const genderFacetedData = computed(() => genderTypes)


</script>