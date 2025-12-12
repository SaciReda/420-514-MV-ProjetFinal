import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  top10ArtistsByPopularity,
  top10ArtistsBySongCount,
  top10SongsByPlaycount,
  top10Genres,
  top10Years,
  top10Albums,
  top10NewestSongs,
  top10OldestSongs,
} from "../controllers/topStatsController";

const router = Router();

router.get("/artists/popularity", protect, top10ArtistsByPopularity);
router.get("/artists/song-count", protect, top10ArtistsBySongCount);

router.get("/songs/playcount", protect, top10SongsByPlaycount);
router.get("/songs/newest", protect, top10NewestSongs);
router.get("/songs/oldest", protect, top10OldestSongs);

router.get("/genres", protect, top10Genres);
router.get("/years", protect, top10Years);
router.get("/albums", protect, top10Albums);

export default router;
