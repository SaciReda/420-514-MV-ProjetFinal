import Artist from "../models/Artist";
import Song from "../models/Song";

export async function saveArtist(artist: any) {
 //upsert sa empeche que de dupliquer les donnees c'Est incroyable au nom
  await Artist.updateOne(
    { _id: artist.id },
    artist,
    { upsert: true }
  );
}

export async function saveSong(song: any) {
  
  await Song.updateOne(
    { _id: song.id },
    song,
    { upsert: true }
  );
}
