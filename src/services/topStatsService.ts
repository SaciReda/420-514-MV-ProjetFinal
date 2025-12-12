import Song from "../models/Song";
import Artist from "../models/Artist";

export async function getTop10ArtistsByPopularity() {
  return Artist.find().sort({ popularity: -1 }).limit(10).lean();
}

export async function getTop10ArtistsBySongCount() {
  return Song.aggregate([
    {
      $match: {
        artistId: { $exists: true, $type: "string", $ne: "" },
      },
    },
    {
      $group: {
        _id: "$artistId",
        songs: { $sum: 1 },
      },
    },
    { $sort: { songs: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "artists",
        localField: "_id",
        foreignField: "_id",
        as: "artist",
      },
    },
    { $unwind: "$artist" },
    {
      $project: {
        artistId: "$_id",
        songs: 1,
        "artist.name": 1,
      },
    },
  ]);
}

export async function getTop10SongsByPlaycount() {
  return Song.find().sort({ playCount: -1 }).limit(10).lean();
}

export async function getTop10NewestSongs() {
  return Song.find().sort({ releaseDate: -1 }).limit(10).lean();
}

export async function getTop10OldestSongs() {
  return Song.find().sort({ releaseDate: 1 }).limit(10).lean();
}

export async function getTop10Genres() {
  return Song.aggregate([
    { $unwind: "$genres" },
    { $group: { _id: "$genres", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
}

export async function getTop10Years() {
  return Song.aggregate([
    {
      $group: {
        _id: { $substr: ["$releaseDate", 0, 4] },
        songs: { $sum: 1 },
      },
    },
    { $sort: { songs: -1 } },
    { $limit: 10 },
  ]);
}

export async function getTop10Albums() {
  return Song.aggregate([
    {
      $group: {
        _id: "$album",
        popularityAvg: { $avg: "$popularity" },
      },
    },
    { $sort: { popularityAvg: -1 } },
    { $limit: 10 },
  ]);
}
