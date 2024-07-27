import { defineStore } from 'pinia'

export const useChartStore = defineStore({
  id: 'chartStore',
  state: () => ({
    allDeviceConsumptionChart: {
      chart: {
        type: 'area',
        height: 250,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      series: [],
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
        row: {
          opacity: 0,
        },
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        show: true,
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
      colors: ['#4F46E5', '#F87878'],
      legend: {
        position: 'bottom',
        markers: {
          radius: 12,
          offsetX: -4,
        },
        itemMargin: {
          horizontal: 12,
          vertical: 20,
        },
      },
    }
  }),
  actions: {}
})
