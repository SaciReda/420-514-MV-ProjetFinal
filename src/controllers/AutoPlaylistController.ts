import { Request, Response } from "express";
import AutoPlaylistYear from "../models/autoPlaylistYear";
import AutoPlaylistGenre from "../models/autoPlaylistGenre";
import Song from "../models/Song";

export async function autoPlaylistByYearController(
  req: Request,
  res: Response
) {
  try {
    const year = Number(req.body.year);

    if (!year || isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: `mauvaise annee. exemple: { "year": 2020 }`,
      });
    }

    const songs = await Song.find({
      releaseDate: new RegExp(`^${year}`),
    })
      .sort({ playCount: -1 })
      .limit(50)
      .lean();

    if (songs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `aucune musique trouvée pour l'année ${year}.`,
      });
    }

    const selectedSongs: string[] = songs.map((s) => String(s._id)).filter(Boolean);

    // Check si playlist existe
    let playlist = await AutoPlaylistYear.findOne({ _id: year.toString() });

    if (playlist) {
      playlist.musics = selectedSongs;
      await playlist.save();

      return res.json({
        success: true,
        created: false,
        updated: true,
        message: `playlist mise à jour pour l'année ${year}.`,
        playlist,
      });
    }

    playlist = await AutoPlaylistYear.create({
      _id: year.toString(),
      year,
      name: `top musique de l'année ${year}`,
      musics: selectedSongs,
    });

    return res.json({
      success: true,
      created: true,
      updated: false,
      message: `playlist créée pour l'année ${year}.`,
      playlist,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "erreur serveur",
    });
  }
}

export async function getAutoPlaylistSongsController(
  req: Request,
  res: Response
) {
  try {
    const year = Number(req.params.year);

    if (!year || isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: "mauvaise annee exemple : /autoplaylist/year/2020",
      });
    }

    const playlist = await AutoPlaylistYear.findOne({ _id: year.toString() });

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
    return res.status(500).json({
      success: false,
      message: err.message,
    });
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
        message: `mauvais genre. exemple: { "genre": "rap" }`,
      });
    }

    // prend les 50 plus populaire du genre
    const songs = await Song.find({ genres: { $regex: genre, $options: "i" } })
      .sort({ playCount: -1 })
      .limit(50)
      .lean();

    if (songs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `aucune musique trouvée pour le genre "${genre}".`,
      });
    }

    const selectedSongs: string[] = songs
      .map((s) => String(s._id))
      .filter(Boolean);

    let playlist = await AutoPlaylistGenre.findOne({ _id: genre });

    if (playlist) {
      playlist.musics = selectedSongs;
      await playlist.save();

      return res.json({
        success: true,
        created: false,
        updated: true,
        message: `playlist du genre "${genre}" mise à jour.`,
        playlist,
      });
    }

    playlist = await AutoPlaylistGenre.create({
      _id: genre,
      genre,
      name: `top musique du genre "${genre}"`,
      musics: selectedSongs,
    });

    return res.json({
      success: true,
      created: true,
      updated: false,
      message: `playlist créée pour le genre "${genre}".`,
      playlist,
    });
  } catch (err: any) {
    console.error("AutoPlaylist GENRE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "erreur serveur",
    });
  }
}


export async function getAutoPlaylistByGenreSongsController(
  req: Request,
  res: Response
) {
  try {
    const genre = (req.params.genre || "").trim().toLowerCase();

    if (!genre) {
      return res.status(400).json({
        success: false,
        message: "mauvais genre. exemple : /autoplaylist/genre/rap",
      });
    }

    const playlist = await AutoPlaylistGenre.findOne({ _id: genre });

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
    console.error("AUTO GENRE GET ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
