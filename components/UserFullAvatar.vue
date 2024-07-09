<script setup lang="ts">

 defineProps({
    firstname:{
      required : true,
      type : String,
    },
    lastname:{
      required : true,
      type : String,
    },
    avatarUrl:{
      required : false,
      type : String,
    }
})
</script>

<template>
  <div class="flex items-center gap-2">
    <Avatar  size="sm" style="width:30px; height: 30px">
      <AvatarImage :src="avatarUrl ?? ''" alt="@radix-vue" />
      <AvatarFallback>DD</AvatarFallback>
    </Avatar>

    <h1>{{ firstname }}</h1>
    <h1>{{ lastname }}</h1>

  </div>
</template>