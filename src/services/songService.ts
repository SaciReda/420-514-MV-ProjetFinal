import Song from "../models/Song";
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
  
  return {
    songs,
    totalCount
  };
}
