import { NextRequest } from "next/server";

const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

let token: {
    accessToken: string;
    expiresAt: Date;
};

async function getToken() {
  if (token && token.expiresAt < new Date()) return token
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)}`,
    }),
    body: "grant_type=client_credentials",
  })
  const data = await res.json()
  token = {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + (data.expires_in * 1000)),
  }
  return token
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    if (!query) return new Response(null, { status: 400 })
    const token = await getToken()
    const querySearchParams = new URLSearchParams({
        q: query,
        type: "track",
        limit: "1",
        offset: "0",
        locale: "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    })
    const res = await fetch(`${SEARCH_ENDPOINT}?${querySearchParams.toString()}`, {
        headers: new Headers({
            "Authorization": `Bearer ${token.accessToken}`,
        }),
    })
    if (!res.ok) return Response.json({ error: res.statusText, body: (await res.text())}, { status: res.status })
    return Response.json(await res.json())
}