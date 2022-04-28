<template>
    <div class="flex flex-col justify-center items-center h-screen">
        <router-link :to="{ name: 'daily' }" class="btn my-2">Mot du jour</router-link>
        <router-link :to="{ name: 'endless' }" class="btn my-2">Infini</router-link>
    </div>
</template>
<script setup lang="ts">
</script>

<style scoped>
.btn {
    @apply outline-double outline-white;
    outline-offset: -5px;
    outline-width: 3px;
    @apply flex justify-center items-center;
    @apply text-lg font-semibold;
    @apply text-white bg-blue-500;
    width: 200px;
    height: 100px;
}

.btn:hover {
    @apply outline-double outline-teal-300;
    @apply text-white text-xl;
}
</style>
