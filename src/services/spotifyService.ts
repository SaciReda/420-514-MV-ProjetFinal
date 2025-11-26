import "dotenv/config";
import SpotifyWebApi from "spotify-web-api-node";

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getLastFmPlayCount(artist: string, song: string) {
  try {
    const url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${artist}&track=${song}&api_key=${process.env.LASTFM_API_KEY}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.track?.playcount || 0;
  } catch {
    return 0;
  }
}

export async function getArtistDetails(artistName: string) {
  const auth = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(auth.body.access_token);

  const res = await spotify.searchArtists(artistName);
  const artist = res.body.artists?.items[0];

  if (!artist) return null;

  return {
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    imageUrl: artist.images?.[0]?.url || null,
    popularity: artist.popularity,
  };
}

export async function get50Songs(artistName: string) {
  const auth = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(auth.body.access_token);

  const res = await spotify.searchTracks(`artist:${artistName}`, { limit: 50 });
  const tracks = res.body.tracks?.items || [];

  return Promise.all(
    tracks.map(async (track) => {
      const firstArtist = track.artists?.[0];
      const firstArtistName = firstArtist?.name || "inconnu";
      const isFeaturing =firstArtistName.toLowerCase() !== artistName.toLowerCase();
      let genres: string[] = [];
      if (firstArtist?.id) {
        const artistInfo = await spotify.getArtist(firstArtist.id);
        genres = artistInfo.body.genres || [];
      }

      return {
        id: track.id,
        name: track.name,
        artistId: firstArtist?.id || "inconnu",
        artistName: firstArtistName,
        album: track.album.name,
        releaseDate: track.album.release_date,
        popularity: track.popularity,
        playCount: await getLastFmPlayCount(firstArtistName, track.name),
        isFeaturing,
        genres
      };
    })
  );
}
