import { ref } from "vue"
import * as seedrandom from "seedrandom"


export default function wordSelection() {
    const word = ref('')

    async function selectNewWord(
        minLength = 6,
        maxLength = 10,
        lettersFilter = ['K', 'Q', 'W', 'X', 'Y', 'Z']) {

        word.value = ''
        if (minLength < 1 || minLength > 25 || maxLength < 1 || maxLength > 25 || minLength > maxLength)
            throw new Error('Invalid parameters.')

        const wordLength = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength)
        // init dict 
        const dictImport = await import(`../dicts/fr/guess_${wordLength}.ts`)
        const guessDict = dictImport.dict
        let tmpWord = ''
        do {
            tmpWord = guessDict[Math.floor(Math.random() * (guessDict.length))]
        } while (lettersFilter.includes(tmpWord[0]))
        word.value = tmpWord
    }

    async function selectDailyWord() {
        word.value = ''
        const lettersFilter = ['K', 'Q', 'W', 'X', 'Y', 'Z']
        const day = new Date().getUTCDate()
        const month = new Date().getUTCMonth()
        const year = new Date().getUTCFullYear()
        const wordLength = (day % 5) + 6
        // init dict 
        const dictImport = await import(`../dicts/fr/guess_${wordLength}.ts`)
        const guessDict = dictImport.dict
        const seed = day + month * 100 + year * 10000
        const generator = seedrandom.alea(seed.toString())
        let tmpWord = ''
        do {
            let random = generator.int32()
            if (random < 0) random *= -1
            tmpWord = guessDict[random % guessDict.length]
        } while (lettersFilter.includes(tmpWord[0]))
        word.value = tmpWord
    }

    return {
        word,
        selectNewWord,
        selectDailyWord
    }
}
