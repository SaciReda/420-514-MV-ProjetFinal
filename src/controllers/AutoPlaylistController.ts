import { Request, Response } from "express";
import Song from "../models/Song";
import {
  buildAutoPlaylistByYear,
  getAutoPlaylistByYear,
  buildAutoPlaylistByGenre,
  getAutoPlaylistByGenre,
} from "../services/autoPlaylistService";

export async function autoPlaylistByYearController(
  req: Request,
  res: Response
) {
  try {
    const year = Number(req.body.year);

    if (!year || isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: 'mauvaise annee. exemple: { "year": 2020 }',
      });
    }

    const result = await buildAutoPlaylistByYear(year);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `aucune musique trouvée pour l'année ${year}`,
      });
    }

    return res.json({
      success: true,
      ...result,
      message: result.created
        ? `playlist créée pour l'année ${year}`
        : `playlist mise à jour pour l'année ${year}`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAutoPlaylistSongsController(
  req: Request,
  res: Response
) {
  try {
    const year = Number(req.params.year);

    const playlist = await getAutoPlaylistByYear(year);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: `pas de playlist trouvée pour l'année ${year}`,
      });
    }

    const songs = await Song.find({ _id: { $in: playlist.musics } });

    return res.json({
      success: true,
      year,
      count: songs.length,
      songs,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function autoPlaylistByGenreController(
  req: Request,
  res: Response
) {
  try {
    const genre = (req.body.genre || "").trim().toLowerCase();

    if (!genre) {
      return res.status(400).json({
        success: false,
        message: 'mauvais genre. exemple: { "genre": "rap" }',
      });
    }

    const result = await buildAutoPlaylistByGenre(genre);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `aucune musique trouvée pour le genre "${genre}"`,
      });
    }

    return res.json({
      success: true,
      ...result,
      message: result.created
        ? `playlist créée pour le genre "${genre}"`
        : `playlist mise à jour pour le genre "${genre}"`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAutoPlaylistByGenreSongsController(
  req: Request,
  res: Response
) {
  try {
    const genre = (req.params.genre || "").trim().toLowerCase();

    const playlist = await getAutoPlaylistByGenre(genre);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: `pas de playlist trouvée pour le genre "${genre}"`,
      });
    }

    const songs = await Song.find({ _id: { $in: playlist.musics } });

    return res.json({
      success: true,
      genre,
      count: songs.length,
      songs,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
