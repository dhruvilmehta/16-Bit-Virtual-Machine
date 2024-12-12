// we are creating an output screen of 16*16

import { ScreenDevice } from "./MemoryMapper"

const moveto = (x: number, y: number) => {
    process.stdout.write(`\x1b[${y};${x}H`)
}

const eraseScreen = () => {
    process.stdout.write(`\x1b[2J`)
}

const setBold = () => {
    process.stderr.write(`\x1b[1m`)
}

const setRegular = () => {
    process.stdout.write(`\x1b[0m`)
}

const CreateScreenDevice = (): ScreenDevice => {
    return {
        getUint16: (address: number) => 0,
        getUint8: (address: number) => 0,
        setUint16: (address: number, data: number) => {
            const command = (data & 0xff00) >> 8
            const characterValue = data & 0x00ff

            if (command === 0xff) eraseScreen()
            else if (command === 0x01) setBold()
            else if (command === 0x02) setRegular()

            const x = (address % 16) + 1 // 16 is the width of our grid
            const y = Math.floor(address / 16) + 1 // +1 because coordinate system in terminal start from 1
            moveto(x * 2, y); // *2 to spread x to look better

            const character = String.fromCharCode(characterValue)
            process.stdout.write(character)
        },
        setUint8: (address: number, data: number) => 0
    }
}

export default CreateScreenDevice;