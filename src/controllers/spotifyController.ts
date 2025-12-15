import { Request, Response } from "express";
import {
  fetchAndSaveSongsByArtist,
  searchSongsByKeyword,
} from "../services/songService";
import { findSongsByArtistId } from "../services/spotifyDbQueryService";

export async function getAllSongsController(req: Request, res: Response) {
  try {
    const artistName = req.params.artistName;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;

    if (!artistName) {
      return res.status(400).json({
        success: false,
        message: "manque le nom de l'artiste",
      });
    }

    const { artist } = await fetchAndSaveSongsByArtist(artistName);

    const { songs, totalCount } = await findSongsByArtistId(
      artist.id,
      skip,
      limit
    );
    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      success: true,
      cached: false,
      artist,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      count: songs.length,
      data: songs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "appel spotify a échoué",
    });
  }
}

export async function searchSongsByKeywordController(
  req: Request,
  res: Response
) {
  try {
    const keyword = (req.query.keyword as string)?.trim();
    const page = parseInt(req.query.page as string) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "mot-clé manquant. exemple : ?keyword=love",
      });
    }

    const { songs, totalCount } = await searchSongsByKeyword(
      keyword,
      skip,
      limit
    );

    if (totalCount === 0) {
      return res.status(404).json({
        success: false,
        message: `aucune musique trouvée avec le mot "${keyword}"`,
      });
    }

    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      success: true,
      keyword,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      count: songs.length,
      songs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "erreur serveur",
    });
  }
}
