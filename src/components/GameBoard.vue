<template>
    <div class="flex flex-col mt-10">
        <div class="flex justify-center" v-for="(row, rowIndex) in board" :key="rowIndex">
            <div
                class="tile"
                v-for="(letter, letterIndex) in row"
                :key="'letter' + letterIndex"
            >{{ letter }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onUnmounted, PropType, ref } from 'vue';

const props = defineProps({
    correctWord: {
        type: String,
        required: true,
        validator(value: string) {
            const allowed = /^[A-Z]*$/
            return allowed.test(value)
        }
    },
    maxTries: {
        type: Number,
        required: false,
        default: 6,
        validator(value: number) {
            return value > 0
        }
    },
    hints: {
        type: Array as PropType<number[]>,
        required: false,
        default: () => [0],
    },
    motusMode: {
        type: Boolean,
        required: false,
        default: true,
    },
})

const emit = defineEmits<{
    (e: 'win', tries: number): void
    (e: 'lost'): void
}>()

const allowInput = ref(true)
const board = ref<string[][]>([])
const tileIndex = ref(0)
const rowIndex = ref(0)
const minTileIndex = computed(() => {
    return props.motusMode ? 1 : 0
})


// init empty rows
for (let emptyRowIndex = 0; emptyRowIndex < props.maxTries; emptyRowIndex++) {
    board.value.push(new Array<string>(props.correctWord.length))
}
// init first line
initRowWithHints()

function initRowWithHints() {
    for (let letterIndex = 0; letterIndex < props.correctWord.length; letterIndex++) {
        if (props.hints.includes(letterIndex)) {
            board.value[rowIndex.value][letterIndex] = props.correctWord[letterIndex]
            if (letterIndex === tileIndex.value) {
                tileIndex.value++
            }
        } else {
            board.value[rowIndex.value][letterIndex] = '.'
        }
    }
}

function onKeyUp({ key }: { key: string }) {
    // check if input is enable    
    if (!allowInput.value) return
    const allowed = /^[a-zA-Z]$/
    console.log(key)
    if (allowed.test(key)) {
        addLetter(key)
    } else {
        if (key === "Backspace") {
            removeLetter()
            return
        }
        if (key === "Enter") {
            guessWord()
            // eslint-disable-next-line no-useless-return
            return
        }
    }
}

// key action handlers
function addLetter(key: string) {
    console.log("addLetter ", key)
    if (tileIndex.value < props.correctWord.length) {
        board.value[rowIndex.value][tileIndex.value] = key.toUpperCase()
        tileIndex.value++
    }
}

function removeLetter() {
    console.log("removeLetter")
    if (tileIndex.value > minTileIndex.value) {
        board.value[rowIndex.value][tileIndex.value - 1] = '.'
        tileIndex.value--
    } else {
        initRowWithHints()
    }
}

function guessWord() {
    console.log("guessWord")
    if (tileIndex.value === props.correctWord.length) {
        allowInput.value = false
        if (board.value[rowIndex.value].join('') === props.correctWord.toUpperCase()) {
            console.log("Bravo")
            emit('win', rowIndex.value + 1)
        } else {
            if ((rowIndex.value + 1) === props.maxTries) {
                console.log("Perdu")
                emit('lost')
            } else {
                rowIndex.value++
                tileIndex.value = 0
                initRowWithHints()
                allowInput.value = true
            }
        }
    } else {
        // todo animation shake
    }
}

// listen to keyboard
window.addEventListener("keyup", onKeyUp)

// remove listener on unmounted to avoid stacking listeners on refresh
onUnmounted(() => {
    window.removeEventListener("keyup", onKeyUp)
})




</script>
<style scoped>
.tile {
    width: 50px;
    height: 50px;
    @apply border-solid border border-white;
    @apply bg-blue-500 text-white text-4xl;
    @apply flex justify-center items-center;
    @apply pb-1;
}
</style>