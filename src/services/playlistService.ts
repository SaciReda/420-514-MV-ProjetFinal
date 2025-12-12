import mongoose from "mongoose";
import Playlist from "../models/Playlist";
import Song from "../models/Song";

export async function createPlaylist(userId: string, name: string) {
  const _id = new mongoose.Types.ObjectId().toString();

  return Playlist.create({
    _id,
    userId,
    name,
    musics: [],
  });
}

export async function getUserPlaylists(userId: string) {
  return Playlist.find({ userId }).lean();
}

export async function getUserPlaylistById(playlistId: string, userId: string) {
  const playlist = await Playlist.findById(playlistId).lean();
  if (!playlist) return null;
  if (playlist.userId !== userId) return "forbidden";
  return playlist;
}

export async function addSongToPlaylist(
  playlistId: string,
  songId: string,
  userId: string
) {
  const song = await Song.findById(songId).lean();
  if (!song) return "SONG_NOT_FOUND";

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) return null;
  if (playlist.userId !== userId) return "forbidden";

  playlist.musics.push(songId);
  await playlist.save();
  return playlist;
}

export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string,
  userId: string
) {
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) return null;
  if (playlist.userId !== userId) return "forbidden";

  const index = playlist.musics.indexOf(songId);
  if (index === -1) return "NOT_IN_PLAYLIST";

  playlist.musics.splice(index, 1);
  await playlist.save();
  return playlist;
}

export async function deletePlaylist(playlistId: string, userId: string) {
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) return null;
  if (playlist.userId !== userId) return "forbidden";

  await Playlist.findByIdAndDelete(playlistId);
  return true;
}

export async function getSongsFromPlaylist(playlistId: string, userId: string) {
  const playlist = await Playlist.findById(playlistId).lean();
  if (!playlist) return null;
  if (playlist.userId !== userId) return "forbidden";

  const songs = await Song.find({ _id: { $in: playlist.musics } }).lean();
  return songs;
}

export async function getUserPlaylistByName(
  userId: string,
  playlistName: string
) {
  const playlist = await Playlist.findOne({
    userId,
    name: { $regex: `^${playlistName}$`, $options: "i" },
  }).lean();

  return playlist;
}

export async function getPlaylistSongsDetails(
  playlistId: string,
  userId: string
) {
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) return null;
  if (playlist.userId !== userId) return "forbidden";

  const songs = await Song.find({
    _id: { $in: playlist.musics },
  }).lean();

  return songs;
}
