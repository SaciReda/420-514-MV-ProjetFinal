import { Request, Response } from "express";
import mongoose from "mongoose";
import Playlist from "../models/Playlist";
import Song from "../models/Song";


export async function createPlaylistController(req: Request, res: Response) {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "nom est manquant",
            });
        }

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "id pas trouver dans le token",
            });
        }

        const _id = new mongoose.Types.ObjectId().toString();

        const playlist = await Playlist.create({
            _id,
            userId,
            name,
            musics: [],
        });

        return res.status(201).json({
            success: true,
            message: "Playlist created",
            playlist,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export async function getAllPlaylistsController(req: Request, res: Response) {
    try {
        const playlists = await Playlist.find({ userId: req.user?.id }).lean();

        return res.json({
            success: true,
            count: playlists.length,
            data: playlists,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export async function getPlaylistController(req: Request, res: Response) {
    try {
        const playlist = await Playlist.findById(req.params.id).lean();

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "playlist pas trouver",
            });
        }

        if (playlist.userId !== req.user?.id) {
            return res.status(403).json({
                success: false,
                message: "playlist vous appartient pas",
            });
        }

        return res.json({
            success: true,
            data: playlist,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export async function addSongToPlaylistController(req: Request, res: Response) {
    try {
        const playlistId = req.params.id;
        const { songId } = req.body;

        if (!songId) {
            return res.status(400).json({
                success: false,
                message: "id de la musique necessaire",
            });
        }

        const song = await Song.findById(songId).lean();
        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found",
            });
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "playlist pas trouver",
            });
        }

        if (playlist.userId !== req.user?.id) {
            return res.status(403).json({
                success: false,
                message: "playlist vous appartient pas",
            });
        }

        playlist.musics.push(songId);
        await playlist.save();

        return res.json({
            success: true,
            message: "music dans la playlist mtn",
            playlist,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export async function getSongsFromPlaylistController(req: Request, res: Response) {
    try {
        const playlistId = req.params.id;

        const playlist = await Playlist.findById(playlistId).lean();
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "playlist pas trouver",
            });
        }

        if (playlist.userId !== req.user?.id) {
            return res.status(403).json({
                success: false,
                message: "playlist vous appartient pas ",
            });
        }

        const songs = await Song.find({ _id: { $in: playlist.musics } }).lean();

        return res.json({
            success: true,
            count: songs.length,
            songs,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
