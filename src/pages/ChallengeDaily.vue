<template>
    <div class="flex gap-x-3">
        <div class="tile">{{ board[0] }}</div>
        <div class="tile">{{ board[1] }}</div>
        <div class="tile">{{ board[2] }}</div>
        <div class="tile">{{ board[3] }}</div>
        <div class="tile">{{ board[4] }}</div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';


const board = ref(['', '', '', '', ''])

</script>
<style scoped>
.tile {
    width: 50px;
    height: 50px;
    @apply border-solid border-2 border-black;
}
</style>