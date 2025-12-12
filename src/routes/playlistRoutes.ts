import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createPlaylistController,
  getAllPlaylistsController,
  getPlaylistController,
  getPlaylistByNameController,
  addSongToPlaylistController,
  getSongsFromPlaylistController,
  removeSongFromPlaylistController,
  deletePlaylistController,
  getPlaylistSongsDetailsController,
} from "../controllers/playlistController";

const router = Router();

router.post("/", protect, createPlaylistController);

router.get("/", protect, getAllPlaylistsController);

router.get("/by-name/:name", protect, getPlaylistByNameController);
router.get("/:id/songs/details", protect, getPlaylistSongsDetailsController);

router.post("/:id/songs", protect, addSongToPlaylistController);
router.delete("/:id/song", protect, removeSongFromPlaylistController);
router.get("/:id/songs", protect, getSongsFromPlaylistController);

router.get("/:id", protect, getPlaylistController);
router.delete("/:id", protect, deletePlaylistController);

export default router;
