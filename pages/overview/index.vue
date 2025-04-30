<template>

    <NuxtLayout name="dashboard" >
        <Header name="Overview"></Header>
        <section class="flex flex-col gap-4 absolute top-16 z-10 mx-2  lg:mx-8 left-0 right-0">
            <div class="w-full  flex flex-col lg:flex-row  p-2 gap-4">
                <div class="w-full h-auto  md:w-3/5">
                    <WaterConsumptionChart :option="consumptionChart">
                    </WaterConsumptionChart>

                </div>
                <div class="flex flex-col gap-2 flex-1 flex-grow">
                    <pre></pre>
                    <ConsumptionStats class="h-full">
                    </ConsumptionStats>
                    <!-- <SmartCredit></SmartCredit> -->
                </div>

            </div>
            <div class="h-auto">
                <!-- <ClusterConsumptionCompare :option="consumptionChart"></ClusterConsumptionCompare> -->
                 <WaterUsageInsights></WaterUsageInsights>
            </div>
            <!-- <div class="w-full max-h-96 flex flex-col lg:flex-row   p-2 gap-4">

                <div class="w-full lg:w-3/5 h-auto">
                    <DeviceMonitoring title="All Devices"></DeviceMonitoring>
                </div>
                <div class="flex-1 h-full">
                    <DevicesSummary></DevicesSummary>
                </div>

            </div> -->
          

        </section>

        <!-- Tutorial Popup
        <TutorialPopup
            ref="tutorialPopupRef"
            :tutorial-steps="tutorialSteps"
            @close="handleTutorialClose"
        /> -->
    </NuxtLayout>
</template>

<script setup lang="ts">
import WaterUsageInsights from '~/components/WaterUsageInsights.vue';
import TutorialPopup from '~/components/TutorialPopup.vue';
import type { IWaterConsumptionChart } from '~/utils/dto/waterChart.option.dto';

useHead({ title: "Overview" })

const tutorialPopupRef = ref<InstanceType<typeof TutorialPopup> | null>(null);

// Tutorial steps configuration
const tutorialSteps = ref([
  {
    title: 'Welcome to SmartFlow',
    description: 'Learn how to monitor and optimize your water usage',
    videoUrl: 'https://example.com/videos/intro.mp4'
  },
  {
    title: 'Dashboard Overview',
    description: 'Understand your water consumption at a glance',
    videoUrl: 'https://example.com/videos/dashboard.mp4'
  },
  {
    title: 'Water Usage Insights',
    description: 'Discover how to interpret your water usage data',
    videoUrl: 'https://example.com/videos/insights.mp4'
  },
  {
    title: 'Saving Opportunities',
    description: 'Learn how to identify water-saving opportunities',
    videoUrl: 'https://example.com/videos/savings.mp4'
  }
]);

// Handle tutorial popup close event
const handleTutorialClose = () => {
  console.log('Tutorial closed');
  // You can add any additional logic here when the tutorial is closed
};

// Show tutorial popup manually if needed
const showTutorial = () => {
  if (tutorialPopupRef.value) {
    tutorialPopupRef.value.show();
  }
};



const consumptionChart = ref<IWaterConsumptionChart>({
    title: "Water Management Insights",
    subtitle: "Track your collection, consumption, and savings",
})

// You can uncomment this if you want to manually trigger the tutorial
// onMounted(() => {
//   // Check if we should show the tutorial (e.g., first-time users)
//   if (localStorage.getItem('smartflow_tutorial_seen') !== 'true') {
//     showTutorial();
//   }
// });

</script>