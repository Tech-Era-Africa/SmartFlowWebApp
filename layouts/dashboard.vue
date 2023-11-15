<template>
  <section class="w-screen h-screen overflow-hidden m-0 p-0 flex ">
    <SideBar></SideBar>
    <section class="absolute z-40 md:hidden">
      <BottomNav></BottomNav>
    </section>
    <section class="flex-1 overflow-y-auto relative bg-pageBg">
      <slot></slot>
    </section>
  </section>
</template>