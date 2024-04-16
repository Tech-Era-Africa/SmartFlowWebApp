<template>
    <div class="w-full h-full bg-white rounded-xl  flex flex-col gap-2">
        <div class="pt-4  bg-white  lg:pt-4">
            <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-4">
                <div class="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-xl font-bold text-gray-900" v-if="option?.title">{{ option?.title }}</p>
                        <p class="mt-1 text-sm font-medium text-gray-500" v-if="option?.subtitle">{{ option?.subtitle }}
                        </p>
                    </div>

                </div>

                <div v-if="option.isLoading" class="w-full h-20 flex justify-center items-center">
                    <span class="loading loading-ball"></span>
                    <span class="loading loading-ball"></span>
                    <span class="loading loading-ball"></span>
                </div>

                <template v-else-if="option.users.length > 0">
                    <DataTable :columns="columns" :data="[]" :is-loading="false" @get-table-data="handleDataTableData"
                        @get-row-data="handleRowClicked">
                        <template #dataTableSearch>

                            <Input v-if="dataTableRef" class="w-1/2" type="search" placeholder="Billing id..."
                                :model-value="(dataTableRef.getColumn('child')?.getFilterValue() as string) ?? ''"
                                @input="dataTableRef.getColumn('child')?.setFilterValue($event.target.value)" />

                        </template>
                        <template #dataTableFacetedFilter>
                            <div class="text-right">
                                <p class="text-muted-foreground text-sm mb-2">Filter By</p>
                                <div class="flex items-center gap-2">

                                    <SchoolDataTableFacetedFilter :table="dataTableRef!">
                                    </SchoolDataTableFacetedFilter>
                                    <DisabilityStatusFacetedFilter :table="dataTableRef!">
                                    </DisabilityStatusFacetedFilter>

                                </div>
                            </div>

                        </template>
                    </DataTable>
                </template>

                <template v-else>
                    <div class="w-full h-20 flex justify-center items-center">
                        <p>No User Found</p>
                    </div>
                </template>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UserTableOptionDTO } from '~/utils/dto/userTable.option.dto';
import type { ColumnDef, Row, Table } from '@tanstack/vue-table'
import type { IBill } from '~/stores/bill/model/bill.model';
import { Checkbox } from '@/components/ui/checkbox'


defineProps({
    option: {
        type: Object as () => UserTableOptionDTO,
        required: true
    },
})

// DATA TABLE STUFF
const selectedRow = ref<Row<IBill>>()
const dataTableRef = ref<Table<IBill>>()

const handleDataTableData = (data: Table<IBill>) => dataTableRef.value = data;
const handleRowClicked = async (row: Row<IBill>) => {
    // Set selected row
    selectedRow.value = row;
}




const columns: ColumnDef<IBill>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected(),
            'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': value => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'objectId',
        header: 'Id',

    },
    {
        header: 'Period',

    },
    {

        header: 'Created By',

    },
    {

        header: 'Total',

    },
    {

        header: 'Status',

    }


]
// end of DATA TABLE STUFF

</script>