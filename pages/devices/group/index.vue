<template>
  <NuxtLayout name="dashboard">
    <Header name="Devices"></Header>
    <section class="flex flex-col gap-4 absolute top-16 z-10  mx-2  lg:mx-8 left-0 right-0">
      <div class="w-full flex  p-2 gap-4">
        <div class="w-full h-full bg-white rounded-xl p-5 flex flex-col justify-between gap-2">
          <div class="flex flex-row justify-between gap-2items-center">
            <h1 class="font-bold text-lg">Clusters</h1>

          </div>

          <!-- DEVICES -->
          <template v-if="deviceStore.hasGroupDevices">
            <div class="flex-1 flex-grow grid-cols-2 lg:grid-cols-3 grid gap-2">
              <NuxtLink :to="`/devices/group/${group.objectId}`" v-for="group in deviceStore.devicesGroups">
                <DeviceClusterCard :option="{devicesCount : group.devicesCount ?? 0, id : group.objectId, name : group.name}"></DeviceClusterCard>
              </NuxtLink>

              <Dialog :open="isClusterDialogueOpen" @update:open="handleOnClusterDialogOpen">
                <DialogTrigger>
                  <Card class="h-[150px] outline-dashed border-none outline-blue-300 cursor-pointer">
                    <CardContent class="flex justify-center items-center w-full h-full p-0">
                      <PlusCircle :size="30" class="text-blue-500"></PlusCircle>
                    </CardContent>
                  </Card>
                </DialogTrigger>

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
                            :disabled="deviceStore.isAddingNewCluster" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                    <Button type="submit" class="w-full"
                      :disabled="!isFieldValid('clusterName') && !deviceStore.isAddingNewCluster">
                      <template v-if="deviceStore.isAddingNewCluster">
                        <Loader2 class="animate-spin"></Loader2>
                      </template>
                      <span v-else>Create New Cluster</span>
                    </Button>
                  </form>

                </DialogContent>
              </Dialog>

            </div>

          </template>
          <!-- end of DEVICES -->

          <!-- LOADING -->

          <template v-if="deviceStore.loading_DevicesGroup">
            <div class="grid grid-cols-3 gap-10 p-10">
              <Skeleton class="h-[150px]" v-for="i in 6" />
            </div>
          </template>
          <!-- end of LOADING -->




        </div>
      </div>

    </section>


  </NuxtLayout>
</template>

<script setup lang="ts">
import { useDeviceStore } from '~/stores/device/device.store';
import { PlusCircle } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'




useHead({ title: "Devices" })
definePageMeta({ middleware: 'auth' })

const deviceStore = useDeviceStore()


onBeforeMount(() => {
  deviceStore.getUserDeviceGroup();
})


// SHEET CONTROL
const isSheetDialogueOpen = ref(false)
const handleOnSheetDialogOpen = (isOpen: boolean) => {
  isSheetDialogueOpen.value = isOpen
}
// end of SHEET CONTROL

// NEW CLUSTER DIALOG CONTROL
const isClusterDialogueOpen = ref(false)
const handleOnClusterDialogOpen = (isOpen: boolean) => {
  isClusterDialogueOpen.value = isOpen
}
// end of SHEET CONTROL

// CHART SETTTINGS
const chart4Options = ref({

  chart: {
    type: 'area',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  series: [
    {
      name: 'Consumption',
      data: generateRandomData(30), // Generate random data for the last 30 days
    },
  ],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
  },

  grid: {
    show: false,
    row: {
      opacity: 0,
    },
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    show: false, // Hide the y-axis
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100],
    },
  },
  colors: ['#46DAE5'],
  legend: {
    show: false, // Hide the legend
  },
});

// Function to generate random data for the last n days
function generateRandomData(days: any) {
  const currentDate = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const consumption = Math.random() * 5; // Random consumption between 0 and 5
    data.push({ x: date.getTime(), y: consumption });
  }

  return data;
}
// end of CHART SETTING

// FORM SETTINGS
const formSchema = toTypedSchema(z.object({
  clusterName: z.string().min(2, "Cluster name should be more than 2 characters").max(20, "Cluster name should not be more than 20 characters"),
}))

const { handleSubmit, isFieldValid } = useForm({
  validationSchema: formSchema,
})

const onFormSubmit = handleSubmit(async (values) => {
  // Add new device cluster
  await deviceStore.addNewDeviceCluster(values.clusterName)

  if (deviceStore.success_DevicesGroup) {
    // Close modal
    isClusterDialogueOpen.value = false;

    return;
  }

  alert("Could not create cluster. Something went wrong.")


})
//  end of FORM SETTINGS

</script>