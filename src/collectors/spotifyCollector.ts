import "dotenv/config";
import SpotifyWebApi from "spotify-web-api-node";

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getAllSongs(artistId: string) {
  // Authenticate
  const auth = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(auth.body.access_token);

  console.log("🔑 Access Token received!");

  // 1. Get all albums
  console.log("📀 Fetching albums...");
  const albumsRes = await spotify.getArtistAlbums(artistId, {
    include_groups: "album,single,appears_on,compilation",
    limit: 50,
  });

  const albums = albumsRes.body.items;
  console.log(`📦 Found ${albums.length} albums/singles.`);

  let allTracks: any[] = [];

  // 2. For each album, get tracks
  for (const album of albums) {
    console.log(`🎧 Fetching tracks from album: ${album.name}`);

    const tracksRes = await spotify.getAlbumTracks(album.id, { limit: 50 });

    const tracks = tracksRes.body.items.map((track) => ({
      trackName: track.name,
      trackId: track.id,
      albumName: album.name,
      preview: track.preview_url,
    }));

    allTracks.push(...tracks);
  }

  return allTracks;
}

async function test() {
  console.log("CLIENT ID:", process.env.SPOTIFY_CLIENT_ID);
  console.log("CLIENT SECRET:", process.env.SPOTIFY_CLIENT_SECRET);

  const drakeId = "3TVXtAsR1Inumwj472S9r4";

  console.log("🎵 Fetching ALL Drake songs...");
  const songs = await getAllSongs(drakeId);

  console.log(`\n🎶 TOTAL SONGS FOUND: ${songs.length}`);
  console.log("Here are the first 20:");
  console.log(songs.slice(0, 20));
}

test();
