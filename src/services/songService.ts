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

export async function searchSongsByKeyword(keyword: string) {
  return Song.find({
    name: { $regex: keyword, $options: "i" },
  }).lean();
}
