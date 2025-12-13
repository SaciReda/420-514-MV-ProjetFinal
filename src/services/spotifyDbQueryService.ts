import Artist from "../models/Artist";
import Song from "../models/Song";


export async function findArtistByName(name: string) {
  return Artist.findOne({
    name: { $regex: `^${name}$`, $options: "i" }
  });
}


export async function findSongsByArtistId(artistId: string, skip: number = 0, limit: number = 4) {
  const query = { artistId };
  const [songs, totalCount] = await Promise.all([
    Song.find(query).skip(skip).limit(limit).lean(),
    Song.countDocuments(query)
  ]);
  
  return {
    songs,
    totalCount
  };
}
