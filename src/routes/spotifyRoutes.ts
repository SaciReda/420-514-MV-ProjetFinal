import { Router } from "express";
import {
  getAllSongsController,
  searchSongsByKeywordController,
} from "../controllers/spotifyController";
import { checkArtistDb } from "../middleware/checkArtistDbMiddleWare";

const router = Router();

router.get("/songs/:artistName", checkArtistDb, getAllSongsController);
router.get("/search", searchSongsByKeywordController);

export default router;
