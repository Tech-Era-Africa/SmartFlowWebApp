import { defineStore } from 'pinia'

export const useControlStore = defineStore({
  id: 'controlStore',
  state: () => ({
    isBillModalOpen: false,
    isBillSuccessModalOpen: false
  }),
  actions: {
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
    }
  }
})
