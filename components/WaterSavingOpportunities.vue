<template>
  <div class="bg-white  rounded-lg mb-6 overflow-hidden shadow-sm">
                <div class="bg-gradient-to-r from-green-50 to-blue-50 p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M12 22c4.97 0 9-4.03 9-9-.09-4.14-3.13-9.13-9-12.77-5.87 3.64-8.91 8.63-9 12.77 0 4.97 4.03 9 9 9Z"></path></svg>
                            </div>
                            <div>
                                <h3 class="text-base font-medium text-gray-800">Water-Saving Opportunities</h3>
                                <p class="text-xs text-gray-500">Simple changes with big impact</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Saving Opportunity -->
                <div class="p-4 border-b border-gray-100">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-sm font-medium text-gray-700">Top Opportunity</h4>
                        <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Saves {{ waterSavingTips[0].potentialSavings }}</span>
                    </div>

                    <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-blue-100">
                        <div class="flex items-start">
                            <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M12 22c4.97 0 9-4.03 9-9-.09-4.14-3.13-9.13-9-12.77-5.87 3.64-8.91 8.63-9 12.77 0 4.97 4.03 9 9 9Z"></path></svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-base font-semibold text-gray-800">{{ waterSavingTips[0].title }}</h3>
                                <p class="text-sm text-gray-600 mt-1">{{ waterSavingTips[0].description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Other Opportunities -->
                <div class="p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-medium text-gray-700">More Ways to Save</h4>
                        <button class="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                            View All
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div v-for="(tip, index) in waterSavingTips.slice(1, 4)" :key="index" class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow transition-shadow">
                            <div class="flex items-center mb-2">
                                <div class="h-6 w-6 rounded-full flex items-center justify-center mr-2" :class="`bg-${['blue', 'green', 'indigo'][index % 3]}-100`">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="`text-${['blue', 'green', 'indigo'][index % 3]}-600`"><path d="M12 22c4.97 0 9-4.03 9-9-.09-4.14-3.13-9.13-9-12.77-5.87 3.64-8.91 8.63-9 12.77 0 4.97 4.03 9 9 9Z"></path></svg>
                                </div>
                                <h3 class="text-sm font-medium text-gray-800 truncate">{{ tip.title }}</h3>
                            </div>
                            <div class="text-xs text-gray-500 line-clamp-2 mb-2">{{ tip.description }}</div>
                            <div class="text-xs font-medium text-green-700">Saves {{ tip.potentialSavings }}</div>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script setup>
const props = defineProps({
  waterSavingTips: {
    type: Array,
    required: true,
    default: () => [
      {
        title: 'Fix Those Dripping Taps',
        description: 'Those small drips in North Campus add up to a bathtub of water every day! A simple maintenance visit can stop the waste.',
        potentialSavings: '18,000L/month (GHC 2,700)'
      },
      {
        title: 'Catch More Rain',
        description: 'Building C has a huge roof that is perfect for collecting rainwater. Adding more collection tanks would be like adding a small reservoir!',
        potentialSavings: '25,000L/month (GHC 3,750)'
      },
      {
        title: 'Slow the Flow',
        description: 'Some areas have water pressure that is too high, causing splashing and waste. Simple flow regulators can fix this without anyone noticing.',
        potentialSavings: '15,000L/month (GHC 2,250)'
      },
      {
        title: 'Water the Plants Smarter',
        description: 'We can use the water from sinks to water the campus gardens instead of letting it go down the drain. It is better for plants too!',
        potentialSavings: '20,000L/month (GHC 3,000)'
      }
    ]
  }
});

// Format savings to be more concise
const formatSavings = (savingsText) => {
  // If it already has a short format, return as is
  if (savingsText.length < 15) return savingsText;

  // Extract numbers and units for a more concise display
  const match = savingsText.match(/(\d+),(\d+)\s*(liters|L|gallons|gal)/i);
  if (match) {
    return `${match[1]}${match[2]}${match[3].charAt(0)}`;
  }

  return savingsText;
};
</script>
