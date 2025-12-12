import { Request, Response } from "express";
import {
  fetchAndSaveSongsByArtist,
  searchSongsByKeyword,
} from "../services/songService";


export async function getAllSongsController(req: Request, res: Response) {
  try {
    const artistName = req.params.artistName;

    if (!artistName) {
      return res.status(400).json({
        success: false,
        message: "manque le nom de l'artiste",
      });
    }

    const { artist, songs } = await fetchAndSaveSongsByArtist(artistName);

    return res.json({
      success: true,
      cached: false,
      artist,
      count: songs.length,
      data: songs,
    });

  } catch (error: any) {
    console.error("GET ALL SONGS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "appel spotify a échoué",
    });
  }
}


export async function searchSongsByKeywordController(req: Request, res: Response) {
  try {
    const keyword = (req.query.keyword as string)?.trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "mot-clé manquant. exemple : ?keyword=love",
      });
    }

    const songs = await searchSongsByKeyword(keyword);

    if (songs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `aucune musique trouvée avec le mot "${keyword}"`,
      });
    }

    return res.json({
      success: true,
      keyword,
      count: songs.length,
      songs,
    });

  } catch (error: any) {
    console.error("SEARCH SONG ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "erreur serveur",
    });
  }
}
