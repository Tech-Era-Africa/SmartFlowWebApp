import type { ColumnDef } from "@tanstack/vue-table"
import { Checkbox } from "~/components/ui/checkbox"
import type { User } from "~/server/api/auth/user/model/user.model"
import UserFullAvatar from "~/components/UserFullAvatar.vue"

export const userColumns: ColumnDef<User>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected(),
            'onUpdate:checked': (value:boolean) => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': (value:boolean) => row.toggleSelected(!!value),
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
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => useFormatDateHuman(new Date(row.original.createdAt)),
    },
    {
        header: 'Name',
        cell: ({ row }) => h(UserFullAvatar, {
            firstname: row.original.firstName,
            lastname: row.original.lastName,
            avatarUrl: row.original.avatarUrl,
        }),
        filterFn: (row, id, value) => {
            let fullName = `${row.original.firstName} ${row.original.lastName}`.toLowerCase()
            return fullName.includes(value.toLowerCase())
        },

    },
  

]