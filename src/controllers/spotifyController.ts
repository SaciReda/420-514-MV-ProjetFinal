import { Request, Response } from "express";
import { get50Songs, getArtistDetails } from "../services/spotifyService";
import { saveArtist, saveSong } from "../services/SpotifySaveService";
import {
  findArtistByName,
  findSongsByArtistId,
} from "../services/spotifyDbQueryService";
import Song from "../models/Song";

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

// ---------------------------------- @YANIS26X ---------------------------------------
// VERIFIER SI LA MUSIQUE EXISTE DANS LA BD SINNON ON LAJOUTE AVEC CES 50 MUSIQUES
// 80mg in my blood
export async function chercherZikController(req: Request, res: Response) {
  const nom2laZik = req.query.name as string;
  const artisteNom = req.query.artist as string;

  if (!nom2laZik || !artisteNom) {
    return res.status(400).json({
      success: false,
      message: "IL MANQUE LE NOM DE LARTISTE, T'ES SERIEUX ?!",
    });
  }
  const zikExiste = await Song.findOne({
    name: { $regex: nom2laZik, $options: "i" },
  }).catch(() => null);

  if (!zikExiste) {
    let artist = await findArtistByName(artisteNom).catch(() => null);

    if (!artist) {
      const Artist2spotify = await getArtistDetails(artisteNom).catch(
        () => null
      );

      if (!Artist2spotify) {
        return res.status(404).json({
          success: false,
          message: "ON TROUVE PAS TON ARTISTE SUR SPOTIFY !",
        });
      }

      await saveArtist(Artist2spotify);
      artist = Artist2spotify;

      const songs = await get50Songs(artisteNom).catch(() => null);

      if (Array.isArray(songs)) {
        for (const s of songs) {
          await saveSong(s);
        }
      }
    }
  }

  const zikFinalDuUser = await Song.findOne({
    name: { $regex: nom2laZik, $options: "i" },
  });

  if (!zikFinalDuUser) {
    return res.status(404).json({
      success: false,
      message: "TA MUSIQUE EXISTE PAS DANS NOTRE BASE DE DONNEE ! ",
    });
  }

  return res.json({
    success: true,
    source: zikExiste ? "db" : "spotify+db",
    data: zikFinalDuUser,
  });
}
