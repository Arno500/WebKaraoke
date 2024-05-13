import { Mutex } from 'async-mutex';
import { romanize as koreanRomanize } from "@romanize/korean"

import Kuroshiro from "@sglkc/kuroshiro";
// Initialize kuroshiro with an instance of analyzer (You could check the [apidoc](#initanalyzer) for more information):
// For this example, you should npm install and import the kuromoji analyzer first
import KuromojiAnalyzer from "@sglkc/kuroshiro-analyzer-kuromoji";

const kuroshiro = new Kuroshiro();
const initializationMutex = new Mutex();
let initialized = false

export async function romanizeIfNeeded(line: string): Promise<string | undefined> {
    if (line.match(/[가-힣]/)) {
        // Hangul detected, romanize
        try {
            return koreanRomanize(line)
        } catch {
            return undefined
        }
    } else if (line.match(/[一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤]/u)) {
        // Hiragana or Katakana detected, romanize
        const release = await initializationMutex.acquire()
        if (!initialized) {
            await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/japanese-dicts" }));
            initialized = true
        }
        release()
        try {
            return (await kuroshiro.convert(line, {
                to: "romaji",
                mode: "spaced",
                delimiter_end: "",
                delimiter_start: ""
            })).replace(/ +(?= )/g, '').replace(/(?<=\() | (?=\))/g, '')
        } catch {
            return undefined
        }
    }
    return undefined
}