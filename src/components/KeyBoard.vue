<script setup lang="ts">
import { TileStatus } from '@/types'

defineProps<{
    lettersStatus: Record<string, TileStatus>,
    delay: number
}>()

defineEmits<{
    (event: 'key', key: string): void
}>()

// todo more layout and vuex
const rows = [
    'AZERTYUIOP'.split(''),
    'QSDFGHJKLM'.split(''),
    [...'WXCVBN'.split(''), 'Backspace', 'Enter']
]

function classTile(status: TileStatus) {
    return {
        'kb-red': status === TileStatus.CORRECT,
        'kb-yellow': status === TileStatus.PRESENT,
        'kb-gray': status === TileStatus.ABSENT,
        'text-white': status !== TileStatus.ABSENT,
    }
}
</script>

<template>
    <div id="keyboard" class="flex flex-col w-full items-center">
        <div
            class="flex justify-center items-start w-1/2 mb-3"
            v-for="(row, index) in rows"
            :key="index"
        >
            <button
                :class="classTile(lettersStatus[key])"
                :style="{ transitionDelay: `${delay}ms`, transitionProperty: 'background-color, color, border-color' }"
                class="key"
                v-for="key in row"
                @click="$emit('key', key)"
                :key="key"
            >
                <span
                    class="text-2xl lg:text-3xl"
                    v-if="key !== 'Backspace' && key !== 'Enter'"
                >{{ key }}</span>
                <span class="text-xl lg:text-3xl" v-if="key === 'Backspace'">{{ '\u232B' }}</span>
                <span class="text-xl lg:text-3xl" v-if="key === 'Enter'">{{ '\u23CE' }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
#keyboard {
    user-select: none;
}

.key {
    @apply mr-1;
    @apply border rounded-sm;
    width: 3rem;
    height: 3rem;
    min-width: 1.9rem;
    min-height: 1.9rem;
}
</style>
