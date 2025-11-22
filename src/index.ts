import "dotenv/config";
import SpotifyWebApi from "spotify-web-api-node";

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

async function get50Songs(artistName: string) {
  // 1. Authenticate
  const auth = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(auth.body.access_token);

  console.log("🔑 Access Token Received");

  // 2. Search tracks by artist name (max = 50)
  const result = await spotify.searchTracks(`artist:${artistName}`, {
    limit: 50
  });

  const tracks = result.body.tracks?.items || [];

  // 3. Format results
  return tracks.map((t) => ({
    name: t.name,
    id: t.id,
    album: t.album.name,
    popularity: t.popularity,
    preview: t.preview_url
  }));
}

async function run() {
  
  const songs = await get50Songs("Booba");

  console.log(`🎶 Found ${songs.length} songs:\n`);
  console.log(songs);

  console.log("\n🎉 Done!");
}

run();
