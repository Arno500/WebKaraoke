import { Lyrics, SongInfo } from "@/karaoke/types"

export interface LrclibSearchResult {
    albumName: string
    artistName: string
    duration: number
    id: number
    instrumental: boolean
    name: string
    plainLyrics: string
    syncedLyrics?: string
    trackName: string
}

function parseTime(time: string): number {
    const matches = time.slice(1).match(/(?<minutes>\d+)\:(?<seconds>\d+)\.(?<milliseconds>\d+)/)
    if (!matches || !matches.groups) return 0
    return (parseInt(matches?.groups["minutes"]) * 60 + parseInt(matches?.groups["seconds"])) * 1000 + (parseInt(matches?.groups["milliseconds"]) * 10)
}

export function parseLrcLibLyrics(songInfo: SongInfo, lyrics: LrclibSearchResult): Lyrics {
    return {
        album: lyrics.albumName,
        artist: lyrics.artistName,
        duration: lyrics.duration,
        instrumental: lyrics.instrumental,
        title: lyrics.trackName,
        entries: lyrics.syncedLyrics?.split("\n").map((line) => {
            const [time, text] = line.split("]")
            return {
                time: parseTime(time),
                text: text.trim(),
            }
        }) || []
    }
}