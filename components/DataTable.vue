<template>
    <div v-if="isLoading">
        <div class="space-y-4 mt-5">
            <Skeleton v-for="i in 5" class="h-10 w-full rounded-xl" />
        </div>
    </div>
    <template v-else>
        <div class="max-w-1/2 my-2 flex justify-between items-center">
            <!-- SEACRCH BAR AREA -->
            <slot name="dataTableSearch"></slot>

            <!-- FILTER FACETS AREA -->
            <slot name="dataTableFacetedFilter"></slot>

        </div>
        <div class=" mx-auto max-w-7xl">
            <div class="flex flex-col mt-4">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div class="overflow-hidden ring-1 ring-black ring-opacity-5 md:rounded-xl">

                            <Table>
                                <TableHeader>
                                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                                            <FlexRender v-if="!header.isPlaceholder"
                                                :render="header.column.columnDef.header" :props="header.getContext()" />
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <template v-if="table.getRowModel().rows?.length">
                                        <TableRow class="cursor-pointer" v-for="(row, index) in table.getRowModel().rows"
                                            :key="row.id" :data-state="row.getIsSelected() ? 'selected' : undefined"
                                            @click="handleSelectedRows(row)">
                                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                                <FlexRender :render="cell.column.columnDef.cell"
                                                    :props="cell.getContext()" />
                                            </TableCell>
                                        </TableRow>
                                    </template>
                                    <template v-else>
                                        <TableRow>
                                            <TableCell :colSpan="columns.length" class="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    </template>
                                </TableBody>


                            </Table>
                        </div>
                    </div>
                    <div class="m-5 flex justify-center items-center flex-col gap-10">
                                <div class="text-muted-foreground">
                                    <p>Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }} -
                                        {{ table.getFilteredRowModel().rows.length }} results</p>
                                </div>
                                <Pagination v-slot="{ page }" :total="table.getPageCount()" :sibling-count="0" show-edges
                                    :default-page="1">
                                    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                                        <PaginationFirst @click="table.setPageIndex(0)" />
                                        <PaginationPrev :disabled="!table.getCanPreviousPage()"
                                            @click="table.previousPage()" />

                                        <template v-for="(item, index) in items">
                                            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value"
                                                as-child>
                                                <Button class="w-10 h-10 p-0" @click="table.setPageIndex(item.value - 1)"
                                                    :variant="item.value === page ? 'default' : 'outline'">
                                                    {{ item.value }}
                                                </Button>
                                            </PaginationListItem>
                                            <PaginationEllipsis v-else :key="item.type" :index="index" />
                                        </template>

                                        <PaginationNext :disabled="!table.getCanNextPage()" @click="table.nextPage()" />
                                        <PaginationLast @click="table.setPageIndex(table.getPageCount() - 1)" />
                                    </PaginationList>
                                </Pagination>
                            </div>
                </div>
            </div>
        </div>
    </template>
</template>
<script setup lang="ts" generic="TData, TValue">
import {  getCoreRowModel, useVueTable, FlexRender, getPaginationRowModel, getFilteredRowModel, type ColumnFiltersState,type Updater, getFacetedRowModel, getFacetedUniqueValues, type Row, type ColumnDef } from '@tanstack/vue-table';
import { Skeleton } from '@/components/ui/skeleton'


const emit = defineEmits(['getTableData', 'getRowData'])

const props = defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    isLoading: boolean
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
const handleSelectedRows = (row: Row<TData>) => {
    emit('getRowData', row)
}


</script>