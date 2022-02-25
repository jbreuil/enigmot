<template>
    <input type="text" name="test" id="test" v-model="test" />
    <GameBoard :correctWord="test" />
</template>
<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import { ref } from 'vue';

const test = ref('MAINTENANT')
</script>