import { defineStore } from 'pinia'

export const useControlStore = defineStore({
  id: 'controlStore',
  state: () => ({
    isBillModalOpen: false,
    isBillSuccessModalOpen: false,
    isDeviceDrawerOpen: false
  }),
  actions: {
    openModal(id:string){
      const modal = document.getElementById(id);
      (modal as any).showModal();
    },
    closeModal(id:string){
      const modal = document.getElementById(id);
      (modal as any).close();
    },
    toggleBillModal() {
      const billModal = document.getElementById("billModal");

      // Hide
      if (this.isBillModalOpen) {
        (billModal as any).close();
        this.isBillModalOpen = false;
        return;
      }

      // Open
      (billModal as any).showModal();
      this.isBillModalOpen = true;
    },

    toggleBillSuccessModal() {
      const modal = document.getElementById("billSuccessModal");

      // Hide
      if (this.isBillSuccessModalOpen) {
        (modal as any).close();
        this.isBillModalOpen = false;
        return;
      }

      // Open
      (modal as any).showModal();
      this.isBillModalOpen = true;
    },

    toggleDeviceDrawer() {
      const drawer = document.getElementById("deviceDrawer");

      // // Hide
      // if (this.isDeviceDrawerOpen) {
      //   (drawer as any).close();
      //   this.isDeviceDrawerOpen = false;
      //   return;
      // }

      // Open
      (drawer as any).click();
      this.isDeviceDrawerOpen = true;
    }
  }
})
