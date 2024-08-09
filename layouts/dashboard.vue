<template>
  <section class="w-screen h-screen relative overflow-hidden m-0 p-0 flex ">
    <SideBar></SideBar>
    <section class="absolute z-40 md:hidden">
      <BottomNav></BottomNav>
    </section>
    <section class="flex-1 overflow-y-auto relative bg-blue-100 bg-opacity-10">
      <div class="p-5 bg-orange-100 text-xs text-muted-foreground">
        <p>Sytem currently undergoing maintenance. Some features may appear broken but do bare with us, these will be resolved very soon. Estimated Completion Date: 31st Aug, 2024 </p>
      </div>
      <slot></slot>
    </section>
  </section>
</template>
