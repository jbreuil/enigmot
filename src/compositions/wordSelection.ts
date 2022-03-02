import { ref } from "vue"

export default function wordSelection() {
    const word = ref('')

    async function selectNewWord(
        minLength = 6,
        maxLength = 10,
        lettersFilter = ['K', 'Q', 'W', 'X', 'Y', 'Z']) {

        if (minLength < 1 || minLength > 25 || maxLength < 1 || maxLength > 25 || minLength > maxLength)
            throw new Error('Invalid parameters.')

        const wordLength = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength)
        // init dict 
        const dictImport = await import(`../dicts/fr/guess_${wordLength}.ts`)
        const guessDict = dictImport.dict
        do {
            word.value = guessDict[Math.floor(Math.random() * (guessDict.length))]
        } while (lettersFilter.includes(word.value[0]))
    }

    return {
        word,
        selectNewWord
    }
}
