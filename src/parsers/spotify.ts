import { Lyrics, SongInfo } from "@/karaoke/types"

interface SpotifyLyricEntry {
    startTimeMs: string
    endTimeMs: string
    words: string
}

interface SpotifyLyric {
    lines: SpotifyLyricEntry[]
    syncType: "UNSYNCED" | "SYNCED"
}

export interface SpotifyLyrics {
    hasVocalRemoval: boolean
    lyrics: SpotifyLyric
}

export function parseSpotifyLyrics(songInfo: SongInfo, lyrics: SpotifyLyrics): Lyrics {
    return {
        album: songInfo.album || "",
        artist: songInfo.artist || "",
        duration: songInfo.duration || 0,
        title: songInfo.title || "",
        instrumental: lyrics.hasVocalRemoval,
        entries: lyrics.lyrics.lines.map((line) => {
            return {
                time: parseInt(line.startTimeMs),
                text: line.words
            }
        })
    }
}