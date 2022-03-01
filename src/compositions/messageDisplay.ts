import { ref } from "vue"

export default function messageDisplay() {
    const message = ref('')

    function showMessage(msg: string, time = 3000) {
        message.value = msg
        if (time > 0) {
            setTimeout(() => {
                message.value = ''
            }, time)
        }
    }

    return {
        message,
        showMessage
    }
}
