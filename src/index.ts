import "dotenv/config";
import SpotifyWebApi from "spotify-web-api-node";

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

async function getLastFmPlayCount(artist: string, trackName: string) {
  try {
    const url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(trackName)}&api_key=${process.env.LASTFM_API_KEY}&format=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.track?.playcount || 0;
  } catch (error) {
    return 0;
  }
}

async function get50Songs(artistName: string) {
  const auth = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(auth.body.access_token);

  console.log("Access Token Received");

  const result = await spotify.searchTracks(`artist:${artistName}`, {
    limit: 50
  });

  const tracks = result.body.tracks?.items || [];

  const tracksWithGenres = await Promise.all(
    tracks.map(async (t) => {
      const artistIds = t.artists.map(a => a.id).filter(Boolean);
      const artistDetails = await spotify.getArtists(artistIds);
      const genres = artistDetails.body.artists
        .flatMap(a => a.genres)
        .filter((g, i, arr) => arr.indexOf(g) === i);

      const playCount = await getLastFmPlayCount(
        t.artists[0]?.name || "Unknown",
        t.name
      );

      return {
        name: t.name,
        id: t.id,
        album: t.album.name,
        releaseDate: t.album.release_date,
        popularity: t.popularity,
        playCount: playCount,
        genres: genres
      };
    })
  );

  return tracksWithGenres;
}

