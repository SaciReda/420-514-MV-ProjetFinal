import { Request, Response } from "express";
import * as TopStatsService from "../services/topStatsService";

/* ARTISTS */
export async function top10ArtistsByPopularity(req: Request, res: Response) {
  res.json({ success: true, top10: await TopStatsService.getTop10ArtistsByPopularity() });
}

export async function top10ArtistsBySongCount(req: Request, res: Response) {
  res.json({ success: true, top10: await TopStatsService.getTop10ArtistsBySongCount() });
}

/* SONGS */
export async function top10SongsByPlaycount(req: Request, res: Response) {
  res.json({ success: true, top10: await TopStatsService.getTop10SongsByPlaycount() });
}

export async function top10NewestSongs(req: Request, res: Response) {
  res.json({ success: true, top10: await TopStatsService.getTop10NewestSongs() });
}

export async function top10OldestSongs(req: Request, res: Response) {
  res.json({ success: true, top10: await TopStatsService.getTop10OldestSongs() });
}

/* GENRES */
export async function top10Genres(req: Request, res: Response) {
  res.json({ success: true, top10: await TopStatsService.getTop10Genres() });
}

/* YEARS */
export async function top10Years(req: Request, res: Response) {
  res.json({ success: true, top10: await TopStatsService.getTop10Years() });
}

/* ALBUMS */
export async function top10Albums(req: Request, res: Response) {
  res.json({ success: true, top10: await TopStatsService.getTop10Albums() });
}
