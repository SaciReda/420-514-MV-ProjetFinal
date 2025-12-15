import { Request, Response } from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getUserPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
  getSongsFromPlaylist,
  getUserPlaylistByName,
  getPlaylistSongsDetails
} from "../services/playlistService";

export async function createPlaylistController(req: Request, res: Response) {
  const { name } = req.body;
  const userId = req.user?.id;

  if (!name) {
    return res.status(400).json({ success: false, message: "nom manquant" });
  }
  if (!userId) {
    return res.status(401).json({ success: false, message: "non autorisé" });
  }

  const playlist = await createPlaylist(userId, name);
  return res.status(201).json({ success: true, playlist });
}


export async function getAllPlaylistsController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "non autorisé" });
  }

  const playlists = await getUserPlaylists(userId);
  return res.json({ success: true, count: playlists.length, data: playlists });
}


export async function getPlaylistController(req: Request, res: Response) {
  const playlistId = req.params.id;
  const userId = req.user?.id;

  if (!playlistId) {
    return res.status(400).json({ success: false, message: "id manquant" });
  }
  if (!userId) {
    return res.status(401).json({ success: false, message: "non autorisé" });
  }

  const result = await getUserPlaylistById(playlistId, userId);

  if (result === null)
    return res
      .status(404)
      .json({ success: false, message: "playlist introuvable" });
  if (result === "forbidden")
    return res.status(403).json({ success: false, message: "accès refusé" });

  return res.json({ success: true, data: result });
}


export async function addSongToPlaylistController(req: Request, res: Response) {
  const playlistId = req.params.id;
  const { songId } = req.body;
  const userId = req.user?.id;

  if (!playlistId || !songId) {
    return res
      .status(400)
      .json({ success: false, message: "données manquantes" });
  }
  if (!userId) {
    return res.status(401).json({ success: false, message: "non autorisé" });
  }

  const result = await addSongToPlaylist(playlistId, songId, userId);

  if (result === "SONG_NOT_FOUND")
    return res
      .status(404)
      .json({ success: false, message: "musique introuvable" });
  if (result === null)
    return res
      .status(404)
      .json({ success: false, message: "playlist introuvable" });
  if (result === "forbidden")
    return res.status(403).json({ success: false, message: "accès refusé" });

  return res.json({ success: true, playlist: result });
}


export async function removeSongFromPlaylistController(
  req: Request,
  res: Response
) {
  const playlistId = req.params.id;
  const songId = req.params.songId;
  const userId = req.user?.id;

  if (!playlistId || !songId) {
    return res
      .status(400)
      .json({ success: false, message: "données manquantes" });
  }
  if (!userId) {
    return res.status(401).json({ success: false, message: "non autorisé" });
  }

  const result = await removeSongFromPlaylist(playlistId, songId, userId);

  if (result === null)
    return res
      .status(404)
      .json({ success: false, message: "playlist introuvable" });
  if (result === "forbidden")
    return res.status(403).json({ success: false, message: "accès refusé" });
  if (result === "NOT_IN_PLAYLIST")
    return res
      .status(404)
      .json({ success: false, message: "musique absente de la playlist" });

  return res.json({ success: true, playlist: result });
}


export async function deletePlaylistController(req: Request, res: Response) {
  const playlistId = req.params.id;
  const userId = req.user?.id;

  if (!playlistId) {
    return res.status(400).json({ success: false, message: "id manquant" });
  }
  if (!userId) {
    return res.status(401).json({ success: false, message: "non autorisé" });
  }

  const result = await deletePlaylist(playlistId, userId);

  if (result === null)
    return res
      .status(404)
      .json({ success: false, message: "playlist introuvable" });
  if (result === "forbidden")
    return res.status(403).json({ success: false, message: "accès refusé" });

  return res.json({ success: true, message: "playlist supprimée" });
}


export async function getSongsFromPlaylistController(
  req: Request,
  res: Response
) {
  const playlistId = req.params.id;
  const userId = req.user?.id;

  if (!playlistId) {
    return res.status(400).json({ success: false, message: "id manquant" });
  }
  if (!userId) {
    return res.status(401).json({ success: false, message: "non autorisé" });
  }

  const result = await getSongsFromPlaylist(playlistId, userId);

  if (result === null)
    return res
      .status(404)
      .json({ success: false, message: "playlist introuvable" });
  if (result === "forbidden")
    return res.status(403).json({ success: false, message: "accès refusé" });

  return res.json({ success: true, count: result.length, songs: result });
}

export async function getPlaylistByNameController(req: Request, res: Response) {
  const playlistName = req.params.name;
  const userId = req.user?.id;

  if (!playlistName) {
    return res.status(400).json({
      success: false,
      message: "nom de playlist manquant",
    });
  }

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "non autorisé",
    });
  }

  const playlist = await getUserPlaylistByName(userId, playlistName);

  if (!playlist) {
    return res.status(404).json({
      success: false,
      message: `playlist "${playlistName}" introuvable`,
    });
  }

  return res.json({
    success: true,
    data: playlist,
  });
}

export async function getPlaylistSongsDetailsController(req:Request, res:Response) {
  const playlistId = req.params.id;
  const userId = req.user?.id;

  if (!playlistId || !userId) {
    return res.status(400).json({
      message: "paramètres invalides",
    });
  }

  const result = await getPlaylistSongsDetails(
    playlistId,
    userId
  );

  if (result === null)
    return res.status(404).json({ message: "playlist introuvable" });

  if (result === "forbidden")
    return res.status(403).json({ message: "accès refusé" });

  res.json({
    success: true,
    count: result.length,
    songs: result,
  });
}
