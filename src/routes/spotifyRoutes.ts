import { Router } from "express";
import { getAllSongsController } from "../controllers/spotifyController";
import { checkArtistDb } from "../middleware/checkArtistDbMiddleWare";

const router = Router();


router.get("/songs/:artistName", checkArtistDb, getAllSongsController);

export default router;
