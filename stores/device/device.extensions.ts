import { useDeviceStore } from './device.store';

// Extend the device store with additional methods
export function extendDeviceStore() {
  const deviceStore = useDeviceStore();
  
  // Add the filterActiveDevices method to the store
  deviceStore.$patch({
    filterActiveDevices: () => {
      return deviceStore.devices.filter(device => {
        // Check if the device has a lastReportedAt property and it's within the last 24 hours
        if (device.lastReportedAt) {
          const lastReported = new Date(device.lastReportedAt);
          const now = new Date();
          const diffInHours = (now.getTime() - lastReported.getTime()) / (1000 * 60 * 60);
          return diffInHours <= 24;
        }
        return false;
      });
    }
  });
  
  return deviceStore;
}
