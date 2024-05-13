import { SongMeta } from "@/karaoke/dbMultiplexer"
import { SongInfo } from "@/karaoke/types"
import { SpotifyLyrics, parseSpotifyLyrics } from "@/parsers/spotify"

interface SpotifySearchResults {
    tracks: {
        items: {
            album: {
                images: {
                    url: string
                }[]
            }
            id: string
        }[]
    }
}

async function searchSpotify(songInfo: SongInfo) {
    const searchResultsResponse = await fetch(`/api/spotify/search?q=track:${songInfo.title} artist:${songInfo.artist?.split(" et ")[0]}`)
    if (searchResultsResponse.ok === false) return
    const firstResults = await searchResultsResponse.json() as SpotifySearchResults
    if (firstResults.tracks.items.length !== 0) return firstResults
    const searchResultsResponseWOArtist = await fetch(`/api/spotify/search?q=track:${songInfo.title}`)
    if (searchResultsResponseWOArtist.ok === false) return
    const secondResults = await searchResultsResponseWOArtist.json() as SpotifySearchResults
    return secondResults
}

async function callSpotify(results: SpotifySearchResults) {
    if (results.tracks.items.length === 0) return
    const lyricResponses = await fetch(`/api/spotify/lyrics/${results.tracks.items[0].id}`)
    if (lyricResponses.ok === false) return
    return await lyricResponses.json() as SpotifyLyrics
}

export async function fetchFromSpotify(songInfo: SongInfo): Promise<SongMeta | undefined> {
    if (!songInfo.artist || !songInfo.title) return
    const searchResults = await searchSpotify(songInfo)
    if (!searchResults) return
    const lyrics = await callSpotify(searchResults)
    if (!lyrics || lyrics.lyrics.syncType === "UNSYNCED") return {
        metadata: {
            cover: searchResults.tracks.items[0]?.album.images[0].url
        }
    }
    return {
        metadata: {
            cover: searchResults.tracks.items[0]?.album.images[0].url
        },
        lyrics: parseSpotifyLyrics(songInfo, lyrics)
    }
}