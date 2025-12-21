import {
  getTop10ArtistsByPopularity,
  getTop10ArtistsBySongCount,
  getTop10SongsByPlaycount,
  getTop10NewestSongs,
  getTop10OldestSongs,
  getTop10Genres,
  getTop10Years,
  getTop10Albums,
} from "../../services/topStatsService";
import Artist from "../../models/Artist";
import Song from "../../models/Song";

jest.mock("../../models/Artist");
jest.mock("../../models/Song");

const mockedArtistFind = Artist.find as jest.MockedFunction<any>;
const mockedSongFind = Song.find as jest.MockedFunction<any>;
const mockedSongAggregate = Song.aggregate as jest.MockedFunction<any>;

describe("topstatservice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("top 10 artiste par populariter", () => {
    it("devrait retourner les 10 artistes les plus populaire", async () => {
      const mockartists = [
        { _id: "artist1", name: "artist 1", popularity: 100 },
        { _id: "artist2", name: "artist 2", popularity: 90 },
      ];

      mockedArtistFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockartists),
      } as any);

      const result = await getTop10ArtistsByPopularity();

      expect(result).toEqual(mockartists);
      expect(mockedArtistFind).toHaveBeenCalled();
      expect(mockedArtistFind().sort).toHaveBeenCalledWith({ popularity: -1 });
      expect(mockedArtistFind().limit).toHaveBeenCalledWith(10);
    });
  });

  describe("top 10 artistes par nombre de chanson", () => {
    it("devrait retourner les artistes avec le plus de chanson", async () => {
      const mockAggregateResult = [
        {
          _id: "artist1",
          songs: 50,
          artist: { name: "artist one" },
        },
        {
          _id: "artist2",
          songs: 30,
          artist: { name: "artist two" },
        },
      ];

      mockedSongAggregate.mockResolvedValue(mockAggregateResult);

      const result = await getTop10ArtistsBySongCount();

      expect(result).toEqual(mockAggregateResult);
      expect(mockedSongAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: { artistId: { $exists: true, $type: "string", $ne: "" } },
          }),
          expect.objectContaining({
            $group: { _id: "$artistId", songs: { $sum: 1 } },
          }),
          expect.objectContaining({ $sort: { songs: -1 } }),
          expect.objectContaining({ $limit: 10 }),
        ])
      );
    });
  });

  describe("top 10 chansons par nombre de lecture", () => {
    it("devrait retourner les 10 chansons avec le plus de lecture", async () => {
      const mockSongs = [
        { _id: "song1", name: "song 1", playCount: 1000000 },
        { _id: "song2", name: "song 2", playCount: 900000 },
      ];

      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs),
      } as any);

      const result = await getTop10SongsByPlaycount();

      expect(result).toEqual(mockSongs);
      expect(mockedSongFind).toHaveBeenCalled();
      expect(mockedSongFind().sort).toHaveBeenCalledWith({ playCount: -1 });
      expect(mockedSongFind().limit).toHaveBeenCalledWith(10);
    });
  });

  describe("top 10 chansons les plus recentes", () => {
    it("devrait retourner les 10 chansons les plus recente", async () => {
      const mockSongs = [
        { _id: "song1", name: "new song 1", releaseDate: "2024-01-01" },
        { _id: "song2", name: "new song 2", releaseDate: "2023-12-01" },
      ];

      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs),
      } as any);

      const result = await getTop10NewestSongs();

      expect(result).toEqual(mockSongs);
      expect(mockedSongFind().sort).toHaveBeenCalledWith({ releaseDate: -1 });
    });
  });

  describe("top 10 chansons les plus ancienne", () => {
    it("devrait retourner les 10 chansons les plus ancienne", async () => {
      const mockSongs = [
        { _id: "song1", name: "old song 1", releaseDate: "1990-01-01" },
        { _id: "song2", name: "old song 2", releaseDate: "1995-01-01" },
      ];

      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs),
      } as any);

      const result = await getTop10OldestSongs();

      expect(result).toEqual(mockSongs);
      expect(mockedSongFind().sort).toHaveBeenCalledWith({ releaseDate: 1 });
    });
  });

  describe("top 10 genres les plus populaire", () => {
    it("devrait retourner les 10 genre les plus populaires", async () => {
      const mockGenres = [
        { _id: "pop", count: 100 },
        { _id: "rock", count: 80 },
      ];

      mockedSongAggregate.mockResolvedValue(mockGenres);

      const result = await getTop10Genres();

      expect(result).toEqual(mockGenres);
      expect(mockedSongAggregate).toHaveBeenCalledWith([
        { $unwind: "$genres" },
        { $group: { _id: "$genres", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
    });
  });

  describe("top 10 annee avec le plus de chanson", () => {
    it("devrait retourner les 10 annee avec le plus de chanson", async () => {
      const mockYears = [
        { _id: "2023", songs: 50 },
        { _id: "2022", songs: 40 },
      ];

      mockedSongAggregate.mockResolvedValue(mockYears);

      const result = await getTop10Years();

      expect(result).toEqual(mockYears);
      expect(mockedSongAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $group: {
              _id: { $substr: ["$releaseDate", 0, 4] },
              songs: { $sum: 1 },
            },
          }),
          expect.objectContaining({ $sort: { songs: -1 } }),
          expect.objectContaining({ $limit: 10 }),
        ])
      );
    });
  });

  describe("top 10 albums les plus populaires", () => {
    it("devrait retourner les 10 albums les plus populaires", async () => {
      const mockAlbums = [
        { _id: "album 1", popularityAvg: 90 },
        { _id: "album 2", popularityAvg: 85 },
      ];

      mockedSongAggregate.mockResolvedValue(mockAlbums);

      const result = await getTop10Albums();

      expect(result).toEqual(mockAlbums);
      expect(mockedSongAggregate).toHaveBeenCalledWith([
        {
          $group: {
            _id: "$album",
            popularityAvg: { $avg: "$popularity" },
          },
        },
        { $sort: { popularityAvg: -1 } },
        { $limit: 10 },
      ]);
    });
  });
});
