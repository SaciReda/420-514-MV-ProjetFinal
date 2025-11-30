import { Router } from "express";
import { getAllSongsController, chercherZikController } from "../controllers/spotifyController";
import { checkArtistDb } from "../middleware/checkArtistDbMiddleWare";

const router = Router();


router.get("/songs/:artistName", checkArtistDb, getAllSongsController);
router.get("/search-song", chercherZikController)

export default router;
