import Song from "../models/Song";
import Artist from "../models/Artist";
import { get50Songs, getArtistDetails } from "./spotifyService";
import { saveArtist, saveSong } from "./SpotifySaveService";

export async function fetchAndSaveSongsByArtist(artistName: string) {
  const artist = await getArtistDetails(artistName);
  if (!artist) {
    throw new Error("artiste non trouvé sur spotify");
  }

  await saveArtist(artist);

  const songs = await get50Songs(artistName);
  for (const song of songs) {
    await saveSong(song);
  }

  return {
    artist,
    songs,
  };
}

export async function searchSongsByKeyword(keyword: string, skip: number = 0, limit: number = 10) {
  const query = {
    name: { $regex: keyword, $options: "i" },
  };
  
  const [songs, totalCount] = await Promise.all([
    Song.find(query).skip(skip).limit(limit).lean(),
    Song.countDocuments(query)
  ]);

  // Get unique artist IDs from songs
  const artistIds = [...new Set(songs.map(song => song.artistId))];
  
  // Fetch all artists in one query
  const artists = await Artist.find({
    _id: { $in: artistIds }
  }).lean();

  // Create a map of artistId to artist name
  const artistMap = new Map(artists.map((artist: { _id: any; name: string }) => [artist._id.toString(), artist.name]));

  // Add artistName to each song
  const songsWithArtists = songs.map(song => ({
    ...song,
    artistName: artistMap.get(song.artistId) || 'Unknown Artist'
  }));
  
  return {
    songs: songsWithArtists,
    totalCount
  };
}
