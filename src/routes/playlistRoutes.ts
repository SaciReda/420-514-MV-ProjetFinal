import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createPlaylistController,
  getAllPlaylistsController,
  getPlaylistController,
  addSongToPlaylistController,
  getSongsFromPlaylistController,
} from "../controllers/playlistController";

const router = Router();

router.post("/", protect, createPlaylistController);

router.get("/", protect, getAllPlaylistsController);


router.get("/:id", protect, getPlaylistController);

router.get("/:id/songs", protect, getSongsFromPlaylistController);

router.post("/:id/songs", protect, addSongToPlaylistController);

export default router;
