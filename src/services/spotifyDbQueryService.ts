import Artist from "../models/Artist";
import Song from "../models/Song";


export async function findArtistByName(name: string) {
  return Artist.findOne({
    name: { $regex: `^${name}$`, $options: "i" }
  });
}


export async function findSongsByArtistId(artistId: string) {
  return Song.find({ artistId });
}
