import { fetchFromLrclib } from "@/fetchers/lrclib";
import { fetchFromSpotify } from "@/fetchers/spotify";
import { Lyrics, SongInfo } from "./types";
import { romanizeIfNeeded } from "./translator";

export interface SongMeta {
    metadata?: {
        cover: string
    }
    lyrics?: Lyrics
}

export async function getLyricsAndMeta(songInfo: SongInfo): Promise<SongMeta | undefined> {
    const results = (await Promise.all([fetchFromSpotify(songInfo), fetchFromLrclib(songInfo)])).filter(res => res)
    if (results.length === 0) return
    const lyrics = results.filter(res => res?.lyrics)[0]?.lyrics
    const metadata = results.filter(res => res?.metadata)[0]?.metadata
    if (!lyrics) return {
        metadata
    }
    lyrics.entries = await Promise.all(lyrics.entries.map(async entry => ({
        ...entry,
        romanized: await romanizeIfNeeded(entry.text),
    })))
    return {
        metadata,
        lyrics
    }
} 