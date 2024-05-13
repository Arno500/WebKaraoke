import { NextRequest } from "next/server"

const SEARCH_ENDPOINT = "https://lrclib.net/api/search";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    if (!searchParams) return new Response(null, { status: 400 })
    const res = await fetch(`${SEARCH_ENDPOINT}?${searchParams.toString()}`, {
        headers: {
            "User-Agent": "WebKaraoke (unpublished app, currently in development)",
        }
    })
    if (!res.ok) return Response.json({ error: res.statusText, body: (await res.text()) }, { status: res.status })
    return Response.json(await res.json())
}