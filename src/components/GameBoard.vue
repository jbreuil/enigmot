<template>
    <div class="flex flex-col mt-10">
        <div class="flex justify-center" v-for="(row, rowIndex) in board" :key="rowIndex">
            <div
                class="tile"
                :class="classTile(tile)"
                v-for="(tile, tileIndex) in row"
                :key="'tile' + tileIndex"
            >{{ tile.letter }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onUnmounted, PropType, ref } from 'vue';
import { Tile, TileStatus } from '@/types'

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
const board = ref<Tile[][]>([])
const tileIndex = ref(0)
const rowIndex = ref(0)
// wordLength
const wordLength = computed(() => {
    return props.correctWord.length
})
// min index to be erased by backspace
const minTileIndex = computed(() => {
    return props.motusMode ? 1 : 0
})
// first index to be completed when typing on new line
const startTileIndex = computed(() => {
    if (props.motusMode) return 1
    const firstNotGuessed = currentGuessed.value.find((guessedIndex, findIndex) => {
        return guessedIndex !== findIndex
    })
    if (firstNotGuessed) {
        if (firstNotGuessed === 0) {
            return 1
        } else {
            return currentGuessed.value[currentGuessed.value.indexOf(firstNotGuessed) - 1] + 1
        }
    }
    return currentGuessed.value.length

})
// indexes of letters to print on new lines
const currentGuessed = computed(() => {
    if (rowIndex.value === 0) {
        return props.hints
    } else {
        const indexes: number[] = []
        for (let index = 0; index < wordLength.value; index++) {
            if (board.value[rowIndex.value - 1][index].status === TileStatus.CORRECT
                || props.hints.includes(index)) {
                indexes.push(index)
            }
        }
        return indexes
    }
})
const currentRow = computed(() => {
    return board.value[rowIndex.value]
})
function classTile(tile: Tile) {
    return {
        'tile-red': tile.status === TileStatus.CORRECT,
        'tile-yellow': tile.status === TileStatus.PRESENT
    }
}


// init empty rows
for (let emptyRowIndex = 0; emptyRowIndex < props.maxTries; emptyRowIndex++) {
    board.value.push(new Array<Tile>(wordLength.value).fill({
        letter: '',
        status: TileStatus.INITIAL
    }))
}
// init first line
initRow()

function initRow() {
    for (let letterIndex = 0; letterIndex < wordLength.value; letterIndex++) {
        if (currentGuessed.value.includes(letterIndex)) {
            currentRow.value[letterIndex] = {
                letter: props.correctWord[letterIndex],
                status: TileStatus.INITIAL
            }
        } else {
            currentRow.value[letterIndex] = {
                letter: '.',
                status: TileStatus.INITIAL
            }
        }
    }
    tileIndex.value = startTileIndex.value
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
    if (tileIndex.value < wordLength.value) {
        currentRow.value[tileIndex.value].letter = key.toUpperCase()
        tileIndex.value++
    }
}

function removeLetter() {
    console.log("removeLetter")
    if (tileIndex.value > minTileIndex.value) {
        currentRow.value[tileIndex.value - 1].letter = '.'
        tileIndex.value--
    } else {
        initRow()
    }
}

function guessWord() {
    console.log("guessWord")
    if (tileIndex.value === wordLength.value) {
        allowInput.value = false
        parseRow()
        if (currentRow.value.every((tile) => tile.status === TileStatus.CORRECT)) {
            console.log("Bravo")
            emit('win', rowIndex.value + 1)
        } else {
            if ((rowIndex.value + 1) === props.maxTries) {
                console.log("Perdu")
                emit('lost')
            } else {
                rowIndex.value++
                tileIndex.value = 0
                initRow()
                allowInput.value = true
            }
        }
    } else {
        // todo animation shake
    }
}

function parseRow() {
    // we need to check only the correct one first in order to avoid flagging 
    // present on letter that are a duplicate of a correct one
    const lettersFromCorrectWord: (string | null)[] = props.correctWord.split('')
    currentRow.value.forEach((tile, parseIndex) => {
        if (tile.letter === lettersFromCorrectWord[parseIndex]) {
            tile.status = TileStatus.CORRECT
            lettersFromCorrectWord[parseIndex] = null
        }
    })
    // now check for present with the remaining letters
    currentRow.value.forEach((tile) => {
        if (tile.status === TileStatus.INITIAL && lettersFromCorrectWord.includes(tile.letter)) {
            tile.status = TileStatus.PRESENT
            lettersFromCorrectWord[lettersFromCorrectWord.indexOf(tile.letter)] = null
        }
    })
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

.tile-red {
    @apply bg-red-500;
}

.tile-yellow {
    @apply bg-yellow-500;
}
</style>