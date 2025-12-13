import { Request, Response, NextFunction } from "express";
import { findArtistByName, findSongsByArtistId } from "../services/spotifyDbQueryService";

export async function checkArtistDb(req: Request, res: Response, next: NextFunction) {
  const artistName: string = req.params.artistName || ""; // oblige type string 
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!artistName) {
    return res.status(400).json({
      success: false,
      message: "manque le nom de l'artiste"
    });
  }

  const artist = await findArtistByName(artistName);

  if (!artist) {
    console.log("pas d'artiste trouve en db info en appel sur spotify");
    return next(); 
  }

  console.log("artiste trouve en db info");

  const { songs, totalCount } = await findSongsByArtistId(artist._id as string, skip, limit);
  const totalPages = Math.ceil(totalCount / limit);

  return res.json({
    success: true,
    cached: true,
    artist,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    count: songs.length,
    data: songs
  });
}
