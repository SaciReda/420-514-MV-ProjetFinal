import AutoPlaylistYear from "../models/autoPlaylistYear";
import AutoPlaylistGenre from "../models/autoPlaylistGenre";
import Song from "../models/Song";

//note pour l'equipe : .lean sa donne du js simple comme sa c'est plus simple a utiliser
export async function buildAutoPlaylistByYear(year: number) {
  const songs = await Song.find({
    releaseDate: new RegExp(`^${year}`),
  })
    .sort({ playCount: -1 })
    .limit(50)
    .lean();

  if (songs.length === 0) return null;

  const selectedSongs = songs.map((s) => String(s._id));

  let playlist = await AutoPlaylistYear.findOne({ _id: year.toString() });

  if (playlist) {
    playlist.musics = selectedSongs;
    await playlist.save();
    return { playlist, created: false, updated: true };
  }

  playlist = await AutoPlaylistYear.create({
    _id: year.toString(),
    year,
    name: `top musique de l'année ${year}`,
    musics: selectedSongs,
  });

  return { playlist, created: true, updated: false };
}

export async function getAutoPlaylistByYear(year: number) {
  return AutoPlaylistYear.findOne({ _id: year.toString() });
}

export async function buildAutoPlaylistByGenre(genre: string) {
  const songs = await Song.find({
    genres: { $regex: genre, $options: "i" },
  })
    .sort({ playCount: -1 })
    .limit(50)
    .lean();

  if (songs.length === 0) return null;

  const selectedSongs = songs.map((s) => String(s._id));

  let playlist = await AutoPlaylistGenre.findOne({ _id: genre });

  if (playlist) {
    playlist.musics = selectedSongs;
    await playlist.save();
    return { playlist, created: false, updated: true };
  }

  playlist = await AutoPlaylistGenre.create({
    _id: genre,
    genre,
    name: `top musique du genre "${genre}"`,
    musics: selectedSongs,
  });

  return { playlist, created: true, updated: false };
}

export async function getAutoPlaylistByGenre(genre: string) {
  return AutoPlaylistGenre.findOne({ _id: genre });
}

//pour le job auto playlist
export async function ensureAutoPlaylistFor(year: number, genre: string) {
  const yearResult = await buildAutoPlaylistByYear(year);
  const genreResult = await buildAutoPlaylistByGenre(genre);

  return {
    year: yearResult,
    genre: genreResult,
  };
}
