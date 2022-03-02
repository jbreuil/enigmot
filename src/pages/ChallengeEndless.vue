<template>
    <div
        class="flex justify-center items-center fixed inset-0 bg-gray-600 bg-opacity-90 overflow-y-auto h-full w-full"
        id="modal"
        v-if="showModal"
    >
        <div class="flex flex-col">
            <p class="message">{{ message }}</p>
            <button class="btn" @click="nextWord">{{ btnLabel }}</button>
        </div>
    </div>
    <div v-if="streak > 0" class="score">
        <div>Série en cours : {{ streak }}</div>
        <div>Essais moyen : {{ average.toFixed(2) }}</div>
    </div>
    <GameBoard v-if="word !== ''" :correctWord="word" @win="winRecap" @lose="loseRecap" />
</template>
<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import wordSelection from '@/compositions/wordSelection'
import { computed, ref } from 'vue';

const showModal = ref(false)
const btnLabel = ref('Nouveau mot [\u23CE]')
const message = ref('')
const { word, selectNewWord } = wordSelection();
selectNewWord(6, 10)

const streak = ref(0)
const tries = ref(0)
const average = computed(() => {
    return streak.value === 0 ? 0 : tries.value / streak.value
})

function winRecap(triesMade: number) {
    streak.value++
    tries.value += triesMade
    window.addEventListener("keyup", onEnter)
    message.value = `Bravo !\nTu as trouvé le mot en ${triesMade} essai`
    message.value += triesMade > 1 ? 's' : ''
    showModal.value = true
}

function loseRecap() {
    streak.value = 0
    tries.value = 0
    window.addEventListener("keyup", onEnter)
    message.value = `Dommage !\nLe mot à trouver était ${word.value}`
    showModal.value = true
}

function onEnter({ key }: { key: string }) {
    if (key === 'Enter') {
        window.removeEventListener("keyup", onEnter)
        nextWord()
    }
}

function nextWord() {
    showModal.value = false
    selectNewWord(6, 10)
}

</script>

<style scoped>
.message {
    @apply whitespace-pre-line;
    @apply text-white text-2xl lg:text-4xl text-center;
}

.btn {
    @apply mt-14 py-3;
    @apply outline-double outline-white;
    outline-offset: -5px;
    outline-width: 3px;
    @apply flex justify-center items-center;
    @apply text-2xl lg:text-4xl font-semibold;
    @apply text-white bg-blue-500;
}

.score {
    @apply flex justify-around  px-2 mt-1;
    @apply text-white text-xl lg:text-2xl;
}
</style>