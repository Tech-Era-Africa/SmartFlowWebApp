<template>
  <NuxtLayout name="dashboard">
    <Header name="Clusters"></Header>
    <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0">
      <div class="w-full flex  p-2 gap-4">
        <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
          <div class="flex flex-row justify-between gap-2 items-center">
            <div>
              <h1 class="font-bold text-lg">Clusters</h1>
              <div class="my-2">
                <ClusterTypeFacetedFilter></ClusterTypeFacetedFilter>
              </div>

            </div>
           
            <Button @click="handleOnClusterDialogOpen(true)" variant="outline" class="gap-2">
              Add New Cluster <PlusCircle :size="16"></PlusCircle>
            </Button>
          </div>

          <!-- CLUSTERS -->
          <template v-if="clusters">
            <div class="flex-1 flex-grow grid-cols-2 lg:grid-cols-3 grid gap-2">
              <NuxtLink :to="`/devices/clusters/${cluster.id}`" v-for="cluster in clusters">
                <DeviceClusterCard
                  :option="cluster">
                </DeviceClusterCard>
              </NuxtLink>
            </div>
          </template>
          <!-- end of CLUSTERS -->

          <!-- LOADING -->
          <template v-if="status == 'pending'">
            <div class="grid grid-cols-3 gap-10 p-10">
              <Skeleton class="h-[150px]" v-for="i in 6" />
            </div>
          </template>
          <!-- end of LOADING -->

          <!-- NO CLUSTERS -->
          <template v-if="clusters?.length == 0">
            <div class="flex flex-col items-center justify-center py-10 gap-4">
              <p class="text-gray-500">No clusters found</p>
              <Button @click="handleOnClusterDialogOpen(true)" variant="outline" class="gap-2">
                Create Your First Cluster <PlusCircle :size="16"></PlusCircle>
              </Button>
            </div>
          </template>
          <!-- end of NO CLUSTERS -->
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
import { useClusterStore } from '../../../stores/cluster/cluster.store';
import { useDeviceStore } from '../../../stores/device/device.store';
import { type ICluster } from '~/stores/cluster/model/cluster.model';
import {ClusterTypeFacetedFilter} from '~/components/cluster';

useHead({ title: "Clusters" })

const deviceStore = useDeviceStore()
const clusterStore = useClusterStore()

// Load the devices clusters
const {  error, data:clusters, refresh, status } = await useAsyncData<ICluster[]>('device_clusters', () => clusterStore.getClusters(), {lazy:true})

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
</script>