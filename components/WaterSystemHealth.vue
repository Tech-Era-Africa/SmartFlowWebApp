<template>
  <div class="bg-white  rounded-lg mb-6 overflow-hidden shadow-sm">
    <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="text-blue-600">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-base font-medium text-gray-800">Water System Health</h3>
            <p class="text-xs text-gray-500">How well your water system is performing</p>
          </div>
        </div>
        <div class="flex items-center">
          <div class="text-xs mr-2 text-gray-500">Overall Health:</div>
          <div class="h-10 w-10 rounded-full flex items-center justify-center" :class="getSystemHealthClass().scoreBg">
            <span class="text-sm font-bold" :class="getSystemHealthClass().scoreText">{{ getSystemHealthScore()
              }}/10</span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-5">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Water Flow Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700">Flow Efficiency</h4>
            <div class="flex items-center">
              <span class="text-xs px-2 py-1 rounded-full"
                :class="systemMetrics.distributionEfficiency >= 95 ? 'bg-green-100 text-green-700' : (systemMetrics.distributionEfficiency >= 85 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')">{{
                  systemMetrics.distributionEfficiency }}%</span>
            </div>
          </div>

          <div class="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
            <div class="absolute top-0 left-0 h-full rounded-full"
              :class="systemMetrics.distributionEfficiency >= 95 ? 'bg-green-500' : (systemMetrics.distributionEfficiency >= 85 ? 'bg-blue-500' : 'bg-amber-500')"
              :style="`width: ${systemMetrics.distributionEfficiency}%`"></div>
            <!-- Target marker at 95% -->
            <div class="absolute top-0 bottom-0 w-0.5 bg-gray-800" style="left: 95%; z-index: 10;"></div>
          </div>

          <div class="flex justify-between text-xs text-gray-500">
            <span>Current: {{ systemMetrics.distributionEfficiency }}%</span>
            <span>Target: 95%</span>
          </div>
        </div>

        <!-- Rainwater Collection Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700">Rainwater Collection</h4>
            <div class="flex items-center">
              <span class="text-xs px-2 py-1 rounded-full"
                :class="systemMetrics.collectionEfficiency >= 90 ? 'bg-green-100 text-green-700' : (systemMetrics.collectionEfficiency >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')">{{
                  systemMetrics.collectionEfficiency }}%</span>
            </div>
          </div>

          <div class="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
            <div class="absolute top-0 left-0 h-full rounded-full"
              :class="systemMetrics.collectionEfficiency >= 90 ? 'bg-green-500' : (systemMetrics.collectionEfficiency >= 80 ? 'bg-blue-500' : 'bg-amber-500')"
              :style="`width: ${systemMetrics.collectionEfficiency}%`"></div>
            <!-- Target marker at 90% -->
            <div class="absolute top-0 bottom-0 w-0.5 bg-gray-800" style="left: 90%; z-index: 10;"></div>
          </div>

          <div class="flex justify-between text-xs text-gray-500">
            <span>Current: {{ systemMetrics.collectionEfficiency }}%</span>
            <span>Target: 90%</span>
          </div>
        </div>

        <!-- Water Loss Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700">Water Loss</h4>
            <div class="flex items-center">
              <span class="text-xs px-2 py-1 rounded-full"
                :class="systemMetrics.leakageRate <= 3 ? 'bg-green-100 text-green-700' : (systemMetrics.leakageRate <= 7 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')">{{
                  systemMetrics.leakageRate }}%</span>
            </div>
          </div>

          <div class="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
            <div class="absolute top-0 left-0 h-full rounded-full"
              :class="systemMetrics.leakageRate <= 3 ? 'bg-green-500' : (systemMetrics.leakageRate <= 7 ? 'bg-amber-500' : 'bg-red-500')"
              :style="`width: ${systemMetrics.leakageRate * 5}%`"></div>
            <!-- Target marker at 3% -->
            <div class="absolute top-0 bottom-0 w-0.5 bg-gray-800" style="left: 15%; z-index: 10;"></div>
          </div>

          <div class="flex justify-between text-xs text-gray-500">
            <span>Current: {{ systemMetrics.leakageRate }}%</span>
            <span>Target: ≤ 3%</span>
          </div>
        </div>
      </div>

      <!-- System Status Summary -->
      <div class="mt-4 p-3 rounded-lg" :class="getSystemHealthClass().bg">
        <div class="flex items-center">
          <div class="h-6 w-6 rounded-full flex items-center justify-center mr-2"
            :class="getSystemHealthClass().iconBg">
            <svg v-if="getSystemHealthStatus() === 'excellent'" xmlns="http://www.w3.org/2000/svg" width="14"
              height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" :class="getSystemHealthClass().icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <svg v-else-if="getSystemHealthStatus() === 'good'" xmlns="http://www.w3.org/2000/svg" width="14"
              height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" :class="getSystemHealthClass().icon">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              :class="getSystemHealthClass().icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="15" x2="16" y2="15"></line>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <p class="text-sm" :class="getSystemHealthClass().text">{{ getSystemHealthMessage() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// System metrics data
const systemMetrics = ref({
  distributionEfficiency: 92,
  collectionEfficiency: 87,
  leakageRate: 3.2
});

// Get system health status based on metrics
const getSystemHealthStatus = () => {
    const { distributionEfficiency, collectionEfficiency, leakageRate } = systemMetrics.value;

    if (distributionEfficiency >= 95 && collectionEfficiency >= 90 && leakageRate <= 3) {
        return 'excellent';
    } else if (distributionEfficiency >= 85 && collectionEfficiency >= 80 && leakageRate <= 7) {
        return 'good';
    } else {
        return 'needsAttention';
    }
};

// Get CSS classes for system health status
const getSystemHealthClass = () => {
    const status = getSystemHealthStatus();
    const score = getSystemHealthScore();

    if (status === 'excellent') {
        return {
            bg: 'bg-green-50',
            text: 'text-green-700',
            icon: 'text-green-600',
            iconBg: 'bg-green-100',
            scoreBg: 'bg-green-500',
            scoreText: 'text-white'
        };
    } else if (status === 'good') {
        return {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            icon: 'text-blue-600',
            iconBg: 'bg-blue-100',
            scoreBg: 'bg-blue-500',
            scoreText: 'text-white'
        };
    } else {
        return {
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            icon: 'text-amber-600',
            iconBg: 'bg-amber-100',
            scoreBg: 'bg-amber-500',
            scoreText: 'text-white'
        };
    }
};

// Get system health message based on status
const getSystemHealthMessage = () => {
    const status = getSystemHealthStatus();

    if (status === 'excellent') {
        return 'Your water system is performing excellently! All metrics are meeting or exceeding targets.';
    } else if (status === 'good') {
        return 'Your water system is performing well. Minor improvements could optimize performance.';
    } else {
        return 'Your water system needs attention in one or more areas to improve performance.';
    }
};

// Get system health score based on metrics (out of 10)
const getSystemHealthScore = () => {
    const { distributionEfficiency, collectionEfficiency, leakageRate } = systemMetrics.value;

    // Calculate score components (each out of 10)
    const flowScore = Math.min(10, Math.round((distributionEfficiency / 95) * 10));
    const collectionScore = Math.min(10, Math.round((collectionEfficiency / 90) * 10));

    // For leakage, lower is better (3% or less is perfect)
    const leakageScore = leakageRate <= 3 ? 10 : Math.max(0, Math.round(10 - ((leakageRate - 3) * 1.5)));

    // Calculate weighted average (flow 40%, collection 30%, leakage 30%)
    const overallScore = Math.round((flowScore * 0.4) + (collectionScore * 0.3) + (leakageScore * 0.3));

    return overallScore;
};


</script>
