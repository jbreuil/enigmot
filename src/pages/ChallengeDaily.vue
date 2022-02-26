<template>
    <GameBoard :correctWord="word" @win="selectNewWord" />
</template>
<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import { dict } from '@/dicts/fr/9'
import { ref } from 'vue';

const word = ref('')
selectNewWord()


function selectNewWord() {
    word.value = dict[Math.floor(Math.random() * (dict.length + 1))]
}
</script>