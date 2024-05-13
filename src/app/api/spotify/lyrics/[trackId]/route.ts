const TOKEN_URL = 'https://open.spotify.com/get_access_token?reason=transport&productType=web_player'
const LYRICS_URL = 'https://spclient.wg.spotify.com/color-lyrics/v2/track'

let token: {
  accessToken: string;
  expiresAt: Date;
};

async function getToken() {
  if (token && token.expiresAt < new Date()) return token
  const res = await fetch(TOKEN_URL, {
    headers: new Headers({
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36",
      "App-platform": "WebPlayer",
      "Content-Type": "text/html; charset=utf-8",
      "Cookie": `sp_dc=${process.env.SPOTIFY_DC}`
    }),
  })
  const data = await res.json()
  token = {
    accessToken: data.accessToken,
    expiresAt: new Date(data.accessTokenExpirationTimestampMs),
  }
  return token
}

export async function GET(request: Request, { params }: { params: { trackId: string } }) {
  const token = await getToken()
  const res = await fetch(`${LYRICS_URL}/${params.trackId}?format=json&market=from_token`, {
    headers: new Headers({
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36",
      "App-platform": "WebPlayer",
      "authorization": `Bearer ${token.accessToken}`,
    }),
  })
  if (!res.ok) {
    if (res.status === 401) {
      token.accessToken = ""
      token.expiresAt = new Date(0)
    }
    return Response.json({ error: res.statusText, body: (await res.text()) }, { status: res.status })
  }
  const data = await res.json()

  return Response.json(data)
}