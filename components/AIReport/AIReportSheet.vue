<template>
  <Sheet :open="reportStore.isSheetOpen" @update:open="handleSheetClose" class="transition-all delay-75 ease-in-out">
    <SheetContent class="w-full overflow-y-auto" :class="{'min-w-[900px]' : reportStore.isReportSuccess}">
      <SheetHeader>
        <SheetTitle class="flex items-center gap-2">
          <Sparkles class="w-5 h-5 text-blue-600" />
          AI Report
        </SheetTitle>
        <SheetDescription>
          Generate an AI-powered report of your water system insights
        </SheetDescription>
      </SheetHeader>

      <!-- Empty State - Date Range Selection -->
      <div v-if="!reportStore.hasReport" class="py-8">
        <div class="flex flex-col gap-6">
          <!-- Illustration -->
          <div class="flex justify-center">
            <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <BarChart3 class="w-16 h-16 text-blue-600" />
            </div>
          </div>

          <!-- Title and Description -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Generate Your Report
            </h3>
            <p class="text-sm text-gray-600">
              Select a date range to generate a comprehensive AI-powered analysis of your water system
            </p>
          </div>

          <!-- Date Range Selection -->
          <div class="space-y-4">
            <!-- Preset Options -->
            <div class="grid grid-cols-2 gap-2">
              <Button
                v-for="preset in datePresets"
                :key="preset.label"
                variant="outline"
                class="text-sm"
                @click="selectPreset(preset)"
              >
                {{ preset.label }}
              </Button>
            </div>

            <!-- Custom Date Range -->
            <div class="border-t pt-4">
              <p class="text-sm font-medium text-gray-700 mb-3">Custom Date Range</p>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-gray-600 block mb-1">Start Date</label>
                  <input
                    v-model="customStartDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-600 block mb-1">End Date</label>
                  <input
                    v-model="customEndDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <!-- Generate Button -->
            <Button
              class="w-full bg-blue-600 hover:bg-blue-700 text-white"
              :disabled="!isDateRangeValid || reportStore.isGeneratingReport"
              @click="generateReport"
            >
              <Loader2 v-if="reportStore.isGeneratingReport" class="w-4 h-4 mr-2 animate-spin" />
              {{ reportStore.isGeneratingReport ? 'Generating...' : 'Generate Report' }}
            </Button>

            <!-- Error Message -->
            <div v-if="reportStore.reportError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-700">{{ reportStore.reportError }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Display -->
      <div v-else class="py-6">
        <!-- Report Header -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ organizationName }} Report
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ formatDateRange(reportStore.dateRange.startDate, reportStore.dateRange.endDate) }}
            </p>
          </div>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              @click="downloadPDF"
              :disabled="reportStore.isGeneratingReport"
            >
              <Download class="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              @click="resetReport"
            >
              <RotateCcw class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Markdown Content -->
        <div class="prose prose-sm max-w-none">
          <div
            v-html="renderedMarkdown"
            class="text-gray-700 leading-relaxed space-y-4"
          />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';
import {
  Sparkles,
  BarChart3,
  Download,
  RotateCcw,
  Loader2,
} from 'lucide-vue-next';
import { useAIReportStore } from '~/stores/report/ai-report.store';

const reportStore = useAIReportStore();

const customStartDate = ref('');
const customEndDate = ref('');

// Get organization name from the report data or use default
const organizationName = computed(() => {
  // This will be populated from the API response
  return 'Ashesi SmartFlow';
});


// Date presets
const datePresets = [
  {
    label: 'Last 7 Days',
    getValue: () => {
      const end = new Date();
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      return { start, end };
    },
  },
  {
    label: 'Last 30 Days',
    getValue: () => {
      const end = new Date();
      const start = new Date(end);
      start.setDate(start.getDate() - 30);
      return { start, end };
    },
  },
  {
    label: 'This Month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start, end };
    },
  },
  {
    label: 'Last Month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start, end };
    },
  },
];

// Computed properties
const isDateRangeValid = computed(() => {
  if (customStartDate.value && customEndDate.value) {
    const start = new Date(customStartDate.value);
    const end = new Date(customEndDate.value);
    return start < end;
  }
  return false;
});

const renderedMarkdown = computed(() => {
  if (!reportStore.reportMarkdown) return '';
  return marked(reportStore.reportMarkdown);
});

// Methods
const selectPreset = (preset: any) => {
  const { start, end } = preset.getValue();
  customStartDate.value = start.toISOString().split('T')[0];
  customEndDate.value = end.toISOString().split('T')[0];
};

const generateReport = async () => {
  if (!isDateRangeValid.value) return;

  console.log('Generating report...next');

  const start = new Date(customStartDate.value);
  const end = new Date(customEndDate.value);

  console.log('Start:', start, 'End:', end);

  try {
    await reportStore.generateReport(start, end);
  } catch (error) {
    console.error('Failed to generate report:', error);
  }
};

const downloadPDF = () => {
  const element = document.querySelector('.prose') as HTMLElement;
  if (!element) return;

  const filename = `${organizationName.value} SmartFlow Report - ${new Date().toLocaleDateString()}.pdf`;

  const options = {
    margin: 10,
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' },
  };

  html2pdf().set(options).from(element).save();
};

const resetReport = () => {
  reportStore.clearReportData();
  customStartDate.value = '';
  customEndDate.value = '';
};

const handleSheetClose = (isOpen: boolean) => {
  reportStore.toggleSheet(isOpen);
  if (!isOpen) {
    resetReport();
  }
};

const formatDateRange = (start: Date | null, end: Date | null) => {
  if (!start || !end) return '';
  const startStr = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startStr} - ${endStr}`;
};
</script>

<style scoped>
:deep(.prose) {
  @apply text-gray-700;
}

:deep(.prose h1) {
  @apply text-2xl font-bold text-gray-900 mt-6 mb-3;
}

:deep(.prose h2) {
  @apply text-xl font-bold text-gray-900 mt-5 mb-2;
}

:deep(.prose h3) {
  @apply text-lg font-semibold text-gray-800 mt-4 mb-2;
}

:deep(.prose p) {
  @apply text-gray-700 mb-3;
}

:deep(.prose ul),
:deep(.prose ol) {
  @apply ml-4 mb-3;
}

:deep(.prose li) {
  @apply text-gray-700 mb-1;
}

:deep(.prose strong) {
  @apply font-semibold text-gray-900;
}

:deep(.prose code) {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800;
}

:deep(.prose blockquote) {
  @apply border-l-4 border-blue-500 pl-4 italic text-gray-600 my-3;
}

:deep(.prose table) {
  @apply w-full border-collapse my-3;
}

:deep(.prose th),
:deep(.prose td) {
  @apply border border-gray-300 px-3 py-2 text-left;
}

:deep(.prose th) {
  @apply bg-gray-100 font-semibold;
}
</style>

