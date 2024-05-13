import { SongMeta } from "@/karaoke/dbMultiplexer"
import { SongInfo } from "@/karaoke/types"
import { LrclibSearchResult, parseLrcLibLyrics } from "@/parsers/lrclib"

type LrclibSearchResults = LrclibSearchResult[]

async function callLrclib(songInfo: SongInfo) {
    const searchResultsResponse = await fetch(`/api/lrclib/search?track_name=${songInfo.title}&artist_name=${songInfo.artist?.split(" et ")[0]}`)
    if (searchResultsResponse.ok === false) return
    const firstResults = await searchResultsResponse.json() as LrclibSearchResults
    if (firstResults.length !== 0) return firstResults
    const searchResultsResponseWOArtist = await fetch(`/api/lrclib/search?track_name=${songInfo.title}`)
    if (searchResultsResponseWOArtist.ok === false) return
    const secondResults = await searchResultsResponseWOArtist.json() as LrclibSearchResults
    return secondResults
}

export async function fetchFromLrclib(songInfo: SongInfo): Promise<SongMeta | undefined> {
    if (!songInfo.artist || !songInfo.title) return
    const lyrics = await callLrclib(songInfo)
    if (!lyrics || lyrics.length === 0) return
    let goodLyricsSelection = lyrics.filter(lyrics => lyrics.syncedLyrics || lyrics.instrumental)
    if (goodLyricsSelection.length === 0) return
    const goodLyrics = goodLyricsSelection.find(lyrics => Math.abs(((songInfo.duration ?? 0) / 1000) - lyrics.duration) < 3)
    if (!goodLyrics) return
    return {
        lyrics: parseLrcLibLyrics(songInfo, goodLyrics)
    }
}