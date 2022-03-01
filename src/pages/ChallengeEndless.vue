<template>
    <GameBoard v-if="word !== ''" :correctWord="word" @win="selectNewWord(6, 10)" />
</template>
<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import wordSelection from '@/compositions/wordSelection'

const { word, selectNewWord } = wordSelection();
selectNewWord(6, 10)


</script>