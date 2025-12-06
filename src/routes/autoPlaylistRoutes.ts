import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  autoPlaylistByYearController,
  getAutoPlaylistSongsController,
  autoPlaylistByGenreController,
  getAutoPlaylistByGenreSongsController,
} from "../controllers/AutoPlaylistController";

const router = Router();
router.post("/year", protect, autoPlaylistByYearController);
router.get("/year/:year", protect, getAutoPlaylistSongsController);
router.post("/genre", protect, autoPlaylistByGenreController);
router.get("/genre/:genre", protect, getAutoPlaylistByGenreSongsController);

export default router;
