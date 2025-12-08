import { Request, Response } from "express";
import Song from "../models/Song";
import Artist from "../models/Artist";

// -------------------------------------------
// 1) TOP 10 artistes par popularité Spotify
// -------------------------------------------
export async function top10ArtistsByPopularity(req: Request, res: Response) {
  try {
    const artists = await Artist.find()
      .sort({ popularity: -1 })
      .limit(10);

    res.json({ success: true, top10: artists });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// -------------------------------------------
// 2) TOP 10 musiques par playcount
// -------------------------------------------
export async function top10SongsByPlaycount(req: Request, res: Response) {
  try {
    const songs = await Song.find()
      .sort({ playCount: -1 })
      .limit(10);

    res.json({ success: true, top10: songs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// -------------------------------------------
// 3) TOP 10 genres les plus fréquents
// -------------------------------------------
export async function top10Genres(req: Request, res: Response) {
  try {
    const genreStats = await Song.aggregate([
      { $unwind: "$genres" },
      { $group: { _id: "$genres", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, top10: genreStats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// -------------------------------------------
// 4) TOP 10 artistes avec le plus de chansons
// ------------------------------------------
export async function top10ArtistsBySongCount(req: Request, res: Response) {
  try {
    const top10 = await Song.aggregate([
      {
        $match: {
          artistId: { $exists: true, $type: "string", $ne: "" }
        }
      },
      {
        $group: {
          _id: "$artistId",
          songs: { $sum: 1 }
        }
      },
      { $sort: { songs: -1 } },
      { $limit: 10 },

   
      {
        $lookup: {
          from: "artists",          
          localField: "_id",      
          foreignField: "_id",      
          as: "artist"
        }
      },


      {
        $unwind: {
          path: "$artist",
          preserveNullAndEmptyArrays: true
        }
      },


      {
        $project: {
          _id: 1,
          songs: 1,
          "artist._id": 1,
          "artist.name": 1
        }
      }
    ]);

    return res.json({ success: true, top10 });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// -------------------------------------------
// 5) TOP 10 années les plus musicales
// -------------------------------------------
export async function top10Years(req: Request, res: Response) {
  try {
    const stats = await Song.aggregate([
      {
        $group: {
          _id: { $substr: ["$releaseDate", 0, 4] },
          songs: { $sum: 1 }
        }
      },
      { $sort: { songs: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, top10: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// -------------------------------------------
// 6) TOP 10 albums les plus populaires
// -------------------------------------------
export async function top10Albums(req: Request, res: Response) {
  try {
    const stats = await Song.aggregate([
      { $group: { _id: "$album", popularityAvg: { $avg: "$popularity" } } },
      { $sort: { popularityAvg: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, top10: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// -------------------------------------------
// 7) TOP 10 musiques les plus récentes
// -------------------------------------------
export async function top10NewestSongs(req: Request, res: Response) {
  try {
    const songs = await Song.find()
      .sort({ releaseDate: -1 })
      .limit(10);

    res.json({ success: true, top10: songs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// -------------------------------------------
// 8) TOP 10 musiques les plus vieilles
// -------------------------------------------
export async function top10OldestSongs(req: Request, res: Response) {
  try {
    const songs = await Song.find()
      .sort({ releaseDate: 1 })
      .limit(10);

    res.json({ success: true, top10: songs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
