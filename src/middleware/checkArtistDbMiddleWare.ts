import { Request, Response, NextFunction } from "express";
import { findArtistByName, findSongsByArtistId } from "../services/spotifyDbQueryService";

export async function checkArtistDb(req: Request, res: Response, next: NextFunction) {
  const artistName: string = req.params.artistName || ""; // oblige type string 

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

  const songs = await findSongsByArtistId(artist._id as string); 

  return res.json({
   
    artist,
    count: songs.length,
    data: songs
  });
}
