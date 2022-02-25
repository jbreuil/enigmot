<template>
    <GameBoard correctWord="MAINTENANT" :hints="[0, 1, 5]" :maxTries="5" :motusMode="false" />
</template>
<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
</script>