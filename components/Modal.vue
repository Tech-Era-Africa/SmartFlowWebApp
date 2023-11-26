<template>
    <dialog :id="modalId" class="modal">
        <div class="modal-box flex flex-col gap-5">
            <slot/>
        </div>
    </dialog>
</template>
<script setup lang="ts">

const props = defineProps({
    modalId: {
        type: String,
        required: true
    }})

</script>