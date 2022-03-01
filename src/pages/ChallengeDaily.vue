<template>
    <GameBoard v-if="word !== ''" :correctWord="word" />
</template>
<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import wordSelection from '@/compositions/wordSelection'

const { word, selectNewWord } = wordSelection();

selectNewWord(6, 10)

</script>