import { Router } from "express";
import {
  top10ArtistsByPopularity,
  top10SongsByPlaycount,
  top10Genres,
  top10ArtistsBySongCount,
  top10Years,
  top10Albums,
  top10NewestSongs,
  top10OldestSongs
} from "../controllers/topStatsController";

const router = Router();


router.get("/artists/popularity", top10ArtistsByPopularity);
router.get("/songs/playcount", top10SongsByPlaycount);
router.get("/genres", top10Genres);
router.get("/artists/songcount", top10ArtistsBySongCount);
router.get("/years", top10Years);
router.get("/albums", top10Albums);
router.get("/songs/newest", top10NewestSongs);
router.get("/songs/oldest", top10OldestSongs);

export default router;
