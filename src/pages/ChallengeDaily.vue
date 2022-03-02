<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import wordSelection from '@/compositions/wordSelection'
import { computed, ref } from 'vue'

const showModal = ref(false)
const btnLabel = ref('Retour\n[Espace]')
const message = ref('')
const { word, selectDailyWord } = wordSelection();
selectDailyWord()

const defLink = ref<HTMLInputElement | null>(null)
const defURL = computed(() => {
    return `https://www.google.fr/search?q=définition+${word.value}`
})

function winRecap(triesMade: number) {
    window.addEventListener("keyup", onSpace)
    message.value = `Bravo !\nTu as trouvé le mot en ${triesMade} essai`
    message.value += triesMade > 1 ? 's' : ''
    showModal.value = true
}

function loseRecap() {
    window.addEventListener("keyup", onSpace)
    message.value = `Dommage !\nLe mot à trouver était : `
    showModal.value = true
}

function onSpace({ key }: { key: string }) {
    if (key === ' ') {
        closeModal()
    }
    if (key === 'Enter' && defLink.value) {
        defLink.value.click()
    }
}

function closeModal() {
    window.removeEventListener("keyup", onSpace)
    showModal.value = false
}

</script>

<template>
    <div
        class="flex justify-center items-center fixed inset-0 bg-gray-600 bg-opacity-95 overflow-y-auto h-full w-full"
        id="modal"
        v-if="showModal"
    >
        <div class="flex flex-col">
            <p class="message">{{ message }}</p>
            <a
                ref="defLink"
                class="definition"
                :href="defURL"
                hreflang="fr"
                target="_blank"
                rel="external"
            >{{ word }}</a>
            <span class="notice">(definition [Entrée])</span>
            <button class="btn" @click="closeModal">{{ btnLabel }}</button>
        </div>
    </div>
    <GameBoard v-if="word !== ''" :correctWord="word" @win="winRecap" @lose="loseRecap" />
</template>

<style scoped>
.message {
    @apply whitespace-pre-line;
    @apply text-white text-2xl lg:text-4xl text-center;
}

.btn {
    @apply whitespace-pre-line;
    @apply mt-10 py-3;
    @apply outline-double outline-white;
    outline-offset: -5px;
    outline-width: 3px;
    @apply flex justify-center items-center;
    @apply text-2xl lg:text-4xl font-semibold;
    @apply text-white bg-blue-500;
    @apply leading-7 lg:leading-10;
}

.notice {
    @apply text-white text-xs lg:text-sm text-center;
}

.definition {
    @apply flex justify-center mt-4;
    @apply text-white text-xl lg:text-2xl italic underline;
}
</style>