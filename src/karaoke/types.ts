
export interface SongInfo {
    title?: string
    artist?: string
    album?: string
    cover?: {
        sizes: string
        src: string
        type: string
    }
    progress?: number
    duration?: number
    state?: MediaSessionPlaybackState
}

export interface LyricEntry {
    // Offset from beginning of song in milliseconds
    time: number
    text: string
    romanized?: string
}

export interface Lyrics {
    title: string
    artist: string
    album: string
    instrumental: boolean
    // Duration in milliseconds
    duration: number
    entries: LyricEntry[]
}