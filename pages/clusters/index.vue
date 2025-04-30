<template>
  <NuxtLayout name="dashboard">
    <Header name=""></Header>
    <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0">
      <div class="w-full flex  p-2 gap-4">
        <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
          <div class="flex flex-row justify-between gap-2 items-center">
            <div>
              <h1 class="font-bold text-lg">Clusters</h1>

            </div>

            <Button @click="handleOnClusterDialogOpen(true)" variant="outline" class="gap-2">
              Add New Cluster <PlusCircle :size="16"></PlusCircle>
            </Button>
          </div>

          <Suspense>
            <template #default>
              <template v-if="clusters?.length === 0">
                <div class="flex flex-col items-center justify-center py-10 gap-4">
                  <p class="text-gray-500">No clusters found</p>
                  <Button @click="handleOnClusterDialogOpen(true)" variant="outline" class="gap-2">
                    Create Your First Cluster
                    <PlusCircle :size="16" />
                  </Button>
                </div>
              </template>

              <template v-else>
                <ClusterDataGrid :columns="columns" :data="clusters ?? []" @get-table-data="handleDataTableData">
                  <template #dataTableSearch>
                    <div class="bg-white rounded-xl p-4 w-1/2">

                      <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1">
                          <Input v-if="dataTableRef" type="search" placeholder="Search name..."
                            :model-value="(dataTableRef.getColumn('name')?.getFilterValue() as string) ?? ''"
                            @input="dataTableRef.getColumn('name')?.setFilterValue($event.target.value)" />
                        </div>
                      </div>
                    </div>
                  </template>
                  <template #dataTableFacetedFilter>
                    <ClusterTypeFacetedFilter :table="dataTableRef!"></ClusterTypeFacetedFilter>
                  </template>
                </ClusterDataGrid>
              </template>
            </template>

            <template #fallback>
              <div class="grid grid-cols-2 lg:grid-cols-3 gap-10 p-10">
                <Skeleton class="h-[150px]" v-for="i in 6" :key="i" />
              </div>
            </template>
          </Suspense>




        </div>
      </div>
    </section>

    <!-- CREATE CLUSTER DIALOG -->
    <Dialog :open="isClusterDialogueOpen" @update:open="handleOnClusterDialogOpen">
      <DialogContent>
        <DialogTitle>
          <p>Create New Cluster</p>
        </DialogTitle>
        <DialogDescription>
          <p>Clusters keeps track of groups of your devices for easier management. You can place all devices
            in a facility in one cluster.</p>
        </DialogDescription>
        <form class="w-full space-y-6" @submit="onFormSubmit">
          <FormField v-slot="{ componentField }" name="clusterName">
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="Eg. Apartment 1" v-bind="componentField"
                  :disabled="clusterStore.isAddingNewCluster" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full"
            :disabled="!isFieldValid('clusterName') || clusterStore.isAddingNewCluster">
            <template v-if="clusterStore.isAddingNewCluster">
              <Loader2 class="animate-spin"></Loader2>
            </template>
            <span v-else>Create New Cluster</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  </NuxtLayout>
</template>

<script setup lang="ts">

import { PlusCircle, Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useClusterStore } from '../../stores/cluster/cluster.store';
import { type ICluster } from '~/stores/cluster/model/cluster.model';
import { ClusterTypeFacetedFilter } from '~/components/cluster';
import type { ColumnDef, Table } from '@tanstack/vue-table';

useHead({ title: "Clusters" })

const clusterStore = useClusterStore()

// Load the devices clusters
const { error, data: clusters, refresh, status } = await useAsyncData<ICluster[]>('device_clusters', () => clusterStore.getClusters(), { lazy: true })

// NEW CLUSTER DIALOG CONTROL
const isClusterDialogueOpen = ref(false)
const handleOnClusterDialogOpen = (isOpen: boolean) => {
  isClusterDialogueOpen.value = isOpen
}

// FORM SETTINGS
const formSchema = toTypedSchema(z.object({
  clusterName: z.string().min(2, "Cluster name should be more than 2 characters").max(20, "Cluster name should not be more than 20 characters"),
}))

const { handleSubmit, isFieldValid } = useForm({
  validationSchema: formSchema,
})

const onFormSubmit = handleSubmit(async (values) => {
  try {
    await clusterStore.createNewCluster(values.clusterName);
    isClusterDialogueOpen.value = false;
    await refresh();
  } catch (e) {
    alert("Could not create cluster. Something went wrong.");
  }
})

// DATA GRID DATA
const dataTableRef = ref<Table<ICluster>>()
const handleDataTableData = (data: Table<ICluster>) => dataTableRef.value = data;
const columns: ColumnDef<ICluster>[] = [

  {
    accessorKey: 'name',
    filterFn: (row, id, value) => {
      return row.original.name.toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: 'description',
  },
  {
    accessorKey: 'type',
    filterFn: (row, id, value) => {

      if (value.includes('consumption') && value.includes('collection')) return true;

      if (value == 'consumption' && row.original.type.id == 2) return true

      return value == 'collection' && row.original.type.id == 1;
    },
  }



]
</script>