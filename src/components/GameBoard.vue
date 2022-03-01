<script setup lang="ts">
import { computed, onUnmounted, PropType, ref, watchEffect } from 'vue'
import { Tile, TileStatus } from '@/types'
import messageDisplay from '@/compositions/messageDisplay'
import KeyBoard from '@/components/KeyBoard.vue'

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
    inputOnEmpty: {
        type: Boolean,
        required: false,
        default: true,
    },
    hardMode: {
        type: Boolean,
        required: false,
        default: false,
    },
})

const emit = defineEmits<{
    (e: 'win', tries: number): void
    (e: 'lost'): void
}>()

let allowedWords: string[] = []
const currentGuessed = ref(Array.from(props.hints))
const allowInput = ref(true)
const board = ref<Tile[][]>([])
const tileIndex = ref(0)
const rowIndex = ref(0)
const lettersStatus = ref<Record<string, TileStatus>>({})
const { message, showMessage } = messageDisplay()
// wordLength
const wordLength = computed(() => {
    return props.correctWord.length
})
// empty tiles
const emptyTilesCount = computed(() => {
    return currentRow.value.filter(tile => tile.letter === '.').length
})
// min index to be erased by backspace
const minTileIndex = computed(() => {
    return props.motusMode ? 1 : 0
})
// first index to be completed when typing on new line
const startTileIndex = computed(() => {
    if (!props.inputOnEmpty) {
        if (props.motusMode) {
            return 1
        } else {
            return 0
        }
    }
    for (let findIndex = 0; findIndex < currentGuessed.value.length; findIndex++) {
        if (currentGuessed.value[findIndex] !== findIndex) return findIndex
    }
    return currentGuessed.value.length

})

const currentRow = computed(() => {
    return board.value[rowIndex.value]
})

function classTile(tile: Tile) {
    return {
        'tile-red': tile.status === TileStatus.CORRECT,
        'tile-yellow': tile.status === TileStatus.PRESENT,
        'tile-blue': tile.status === TileStatus.ABSENT || tile.status === TileStatus.INITIAL,
    }
}

function addGuessedLetter(index: number) {
    if (!currentGuessed.value.includes(index)) {
        currentGuessed.value.push(index)
        currentGuessed.value.sort((a, b) => {
            return a - b
        })
    }
}

watchEffect(async () => {
    // init empty rows
    board.value = []
    lettersStatus.value = {}
    rowIndex.value = 0
    tileIndex.value = 0
    currentGuessed.value = Array.from(props.hints)
    for (let emptyRowIndex = 0; emptyRowIndex < props.maxTries; emptyRowIndex++) {
        board.value.push(new Array<Tile>(wordLength.value).fill({
            letter: '',
            status: TileStatus.INITIAL
        }))
    }

    // init dict 
    const dictImport = await import(`../dicts/fr/${props.correctWord.length}`)
    allowedWords = dictImport.dict

    initRow()
    allowInput.value = true
})


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
    if (tileIndex.value < wordLength.value) {
        currentRow.value[tileIndex.value].letter = key.toUpperCase()
        tileIndex.value++
    }
}

function removeLetter() {
    if (tileIndex.value > minTileIndex.value) {
        currentRow.value[tileIndex.value - 1].letter = '.'
        tileIndex.value--
    } else {
        initRow()
    }
}

function guessWord() {
    allowInput.value = false
    if (emptyTilesCount.value === 0) {
        // so backspace start from end of row if needed
        tileIndex.value = props.correctWord.length
        if (allowedWords.includes(currentRow.value.map((tile) => tile.letter).join(''))) {
            parseRow()
            setTimeout(() => {
                if (currentRow.value.every((tile) => tile.status === TileStatus.CORRECT)) {
                    emit('win', rowIndex.value + 1)
                } else {
                    if ((rowIndex.value + 1) === props.maxTries) {
                        emit('lost')
                    } else {
                        rowIndex.value++
                        tileIndex.value = 0
                        initRow()
                        allowInput.value = true

                    }
                }
            }, props.correctWord.length * 300)
        } else {
            // todo animation shake
            if (props.hardMode) {
                rowIndex.value++
                tileIndex.value = 0
                initRow()
            }
            showMessage("Ce mot n'existe pas dans notre dictionnaire")
            allowInput.value = true
        }
    } else {
        // todo animation shake
        showMessage('Mot trop court !')
        allowInput.value = true
    }
}

function parseRow() {
    // we need to check only the correct one first in order to avoid flagging 
    // present on letter that are a duplicate of a correct one
    const lettersFromCorrectWord: (string | null)[] = props.correctWord.split('')
    currentRow.value.forEach((tile, parseIndex) => {
        if (tile.letter === lettersFromCorrectWord[parseIndex]) {
            tile.status = TileStatus.CORRECT
            lettersStatus.value[tile.letter] = TileStatus.CORRECT
            lettersFromCorrectWord[parseIndex] = null
            addGuessedLetter(parseIndex)
        }
    })
    // now check for present with the remaining letters
    currentRow.value.forEach((tile) => {
        if (tile.status === TileStatus.INITIAL && lettersFromCorrectWord.includes(tile.letter)) {
            tile.status = TileStatus.PRESENT
            lettersFromCorrectWord[lettersFromCorrectWord.indexOf(tile.letter)] = null
            if (lettersStatus.value[tile.letter] !== TileStatus.CORRECT) {
                lettersStatus.value[tile.letter] = TileStatus.PRESENT
            }
        }
    })
    // now mark as absent tiles that were neither correct or present so the
    // the keyboard can be updated visually
    currentRow.value.forEach((tile) => {
        if (tile.status !== TileStatus.CORRECT && tile.status !== TileStatus.PRESENT) {
            tile.status = TileStatus.ABSENT
            if (lettersStatus.value[tile.letter] !== TileStatus.CORRECT
                && lettersStatus.value[tile.letter] !== TileStatus.PRESENT) {
                lettersStatus.value[tile.letter] = TileStatus.ABSENT
            }
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

<template>
    <div class="message flex justify-center my-8">
        <Transition name="fade">
            <div class="flex text-white text-3xl" v-show="message">{{ message }}</div>
        </Transition>
    </div>
    <div class="flex flex-col my-5">
        <div class="flex justify-center" v-for="(row, rowIndex) in board" :key="rowIndex">
            <div
                class="tile"
                :class="classTile(tile)"
                :style="{ transitionDelay: `${tileIndex * 300}ms`, transitionProperty: 'background-color' }"
                v-for="(tile, tileIndex) in row"
                :key="'tile' + tileIndex + correctWord"
            >{{ tile.letter }}</div>
        </div>
    </div>
    <KeyBoard
        :delay="props.correctWord.length * 300"
        @key="onKeyUp({ 'key': $event })"
        :lettersStatus="lettersStatus"
    ></KeyBoard>
</template>

<style scoped>
.tile {
    width: 50px;
    height: 50px;
    @apply border-solid border border-white;
    @apply text-white text-4xl;
    @apply flex justify-center items-center;
    @apply pb-1;
    user-select: none;
}

.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    transition: opacity 0.5s ease-out;
}

.fade-leave-to {
    opacity: 0;
}

.fade-leave-active {
    transition: opacity 0.5s ease-in;
}

.message {
    min-height: 2.25rem;
}
</style>