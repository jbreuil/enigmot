<script setup lang="ts">
import { ref } from 'vue';

const showMenu = ref(false)

function toggleMenu() {
    showMenu.value = !showMenu.value
}

</script>

<template>
    <nav class="flex items-center justify-between flex-wrap bg-blue-500 p-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
            <router-link
                class="font-semibold text-xl tracking-tight"
                :to="{ name: 'index' }"
            >Enigmot</router-link>
        </div>
        <div class="block sm:hidden">
            <button
                @click="toggleMenu"
                class="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-400 hover:text-white hover:border-white"
            >
                <svg
                    class="fill-current h-3 w-3"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </button>
        </div>
        <div
            :class="showMenu ? 'flex' : 'hidden'"
            class="w-full block sm:flex sm:items-center sm:w-auto"
        >
            <div class="text-sm">
                <router-link
                    :to="{ name: 'daily' }"
                    class="block mt-4 sm:inline-block sm:mt-0 text-white hover:text-teal-200 mr-4"
                >Mot du jour</router-link>
                <router-link
                    :to="{ name: 'timer' }"
                    class="block mt-4 sm:inline-block sm:mt-0 text-white hover:text-teal-200 mr-4"
                >Chrono</router-link>
                <router-link
                    :to="{ name: 'endless' }"
                    class="block mt-4 sm:inline-block sm:mt-0 text-white hover:text-teal-200"
                >Sans fautes</router-link>
            </div>
        </div>
    </nav>
</template>