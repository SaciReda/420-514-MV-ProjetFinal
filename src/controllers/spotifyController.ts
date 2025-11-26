import { Request, Response } from "express";
import { get50Songs, getArtistDetails } from "../services/spotifyService";
import { saveArtist, saveSong } from "../services/SpotifySaveService";

export async function getAllSongsController(req: Request, res: Response) {
  try {
    const artistName = req.params.artistName;

    if (!artistName) {
      return res.status(400).json({
        success: false,
        message: "manque le nom de l'artiste",
      });
    }

    const artist = await getArtistDetails(artistName);
    await saveArtist(artist);

    const songs = await get50Songs(artistName);
    for (const song of songs) {
      await saveSong(song);
    }

    return res.json({
      success: true,
      cached: false,
      artist,
      count: songs.length,
      data: songs,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "appel spotify a echoue",
      error: error.message,
    });
  }
}
