import {
  fetchAndSaveSongsByArtist,
  searchSongsByKeyword,
} from "../../services/songService";
import { getArtistDetails, get50Songs } from "../../services/spotifyService";
import { saveArtist, saveSong } from "../../services/SpotifySaveService";
import Song from "../../models/Song";
import Artist from "../../models/Artist";

jest.mock("../../services/spotifyService");
jest.mock("../../services/SpotifySaveService");
jest.mock("../../models/Song");
jest.mock("../../models/Artist");

const mockedGetArtistDetails = getArtistDetails as jest.MockedFunction<
  typeof getArtistDetails
>;
const mockedGet50Songs = get50Songs as jest.MockedFunction<typeof get50Songs>;
const mockedSaveArtist = saveArtist as jest.MockedFunction<typeof saveArtist>;
const mockedSaveSong = saveSong as jest.MockedFunction<typeof saveSong>;
const mockedSongFind = Song.find as jest.MockedFunction<any>;
const mockedSongCountDocuments =
  Song.countDocuments as jest.MockedFunction<any>;
const mockedArtistFind = Artist.find as jest.MockedFunction<any>;

describe("songService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("fetchAndSaveSongsByArtist", () => {
    it("devrait recuperer et sauvegarder un artiste et ses chansons avec succes", async () => {
      const mockArtist = {
        id: "artist123",
        name: "Test Artist",
        genres: ["pop"],
        imageUrl: "image.jpg",
        popularity: 80,
      };

      const mockSongs = [
        {
          id: "song1",
          name: "Song 1",
          artistId: "artist123",
          artistName: "Test Artist",
          album: "Album 1",
          releaseDate: "2023-01-01",
          popularity: 80,
          playCount: 1000,
          isFeaturing: false,
          genres: ["pop"],
        },
        {
          id: "song2",
          name: "Song 2",
          artistId: "artist123",
          artistName: "Test Artist",
          album: "Album 2",
          releaseDate: "2023-02-01",
          popularity: 75,
          playCount: 800,
          isFeaturing: false,
          genres: ["pop"],
        },
      ];

      mockedGetArtistDetails.mockResolvedValue(mockArtist);
      mockedGet50Songs.mockResolvedValue(mockSongs);
      mockedSaveArtist.mockResolvedValue(undefined);
      mockedSaveSong.mockResolvedValue(undefined);

      const result = await fetchAndSaveSongsByArtist("Test Artist");

      expect(mockedGetArtistDetails).toHaveBeenCalledWith("Test Artist");
      expect(mockedGet50Songs).toHaveBeenCalledWith("Test Artist");
      expect(mockedSaveArtist).toHaveBeenCalledWith(mockArtist);
      expect(mockedSaveSong).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ artist: mockArtist, songs: mockSongs });
    });

    it("devrait lancer une erreur quand l'artiste est pas trouver", async () => {
      mockedGetArtistDetails.mockResolvedValue(null);

      await expect(fetchAndSaveSongsByArtist("Unknown Artist")).rejects.toThrow(
        "artiste non trouvé sur spotify"
      );
    });

    it("devrait appeler saveSong pour chaque chanson", async () => {
      const mockArtist = {
        id: "artist123",
        name: "Test Artist",
        genres: ["pop"],
        imageUrl: "image.jpg",
        popularity: 80,
      };

      const mockSongs = [
        {
          id: "song1",
          name: "Song 1",
          artistId: "artist123",
          artistName: "Test Artist",
          album: "Album",
          releaseDate: "2023-01-01",
          popularity: 70,
          playCount: 500,
          isFeaturing: false,
          genres: ["pop"],
        },
        {
          id: "song2",
          name: "Song 2",
          artistId: "artist123",
          artistName: "Test Artist",
          album: "Album",
          releaseDate: "2023-01-01",
          popularity: 70,
          playCount: 500,
          isFeaturing: false,
          genres: ["pop"],
        },
        {
          id: "song3",
          name: "Song 3",
          artistId: "artist123",
          artistName: "Test Artist",
          album: "Album",
          releaseDate: "2023-01-01",
          popularity: 70,
          playCount: 500,
          isFeaturing: false,
          genres: ["pop"],
        },
      ];

      mockedGetArtistDetails.mockResolvedValue(mockArtist);
      mockedGet50Songs.mockResolvedValue(mockSongs);
      mockedSaveArtist.mockResolvedValue(undefined);
      mockedSaveSong.mockResolvedValue(undefined);

      await fetchAndSaveSongsByArtist("Test Artist");

      expect(mockedSaveSong).toHaveBeenCalledTimes(3);
      expect(mockedSaveSong).toHaveBeenCalledWith(mockSongs[0]);
      expect(mockedSaveSong).toHaveBeenCalledWith(mockSongs[1]);
      expect(mockedSaveSong).toHaveBeenCalledWith(mockSongs[2]);
    });
  });

  describe("searchSongsByKeyword", () => {
    it("devrait rechercher des chansons  avec les noms d'artistes", async () => {
      const mockSongs = [
        {
          _id: "song1",
          name: "Love Song",
          artistId: "artist1",
          genres: [],
          isFeaturing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
        {
          _id: "song2",
          name: "Love Story",
          artistId: "artist2",
          genres: [],
          isFeaturing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      ];

      const mockArtists = [
        { _id: "artist1", name: "Artist One" },
        { _id: "artist2", name: "Artist Two" },
      ];

      mockedSongFind.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs),
      } as any);

      mockedSongCountDocuments.mockResolvedValue(2);
      mockedArtistFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockArtists),
      } as any);

      const result = await searchSongsByKeyword("love", 0, 10);

      expect(mockedSongFind).toHaveBeenCalledWith({
        name: { $regex: "love", $options: "i" },
      });

      expect(result.songs).toBeDefined();
      expect(result.songs.length).toBeGreaterThanOrEqual(2);

      expect(result.songs[0]?.artistName).toBe("Artist One");
      expect(result.songs[1]?.artistName).toBe("Artist Two");
      expect(result.totalCount).toBe(2);
    });

    it("devrait retourner artiste inconnu quand l'artiste est pas trouver", async () => {
      const mockSongs = [
        {
          _id: "song1",
          name: "Test Song",
          artistId: "unknown",
          genres: [],
          isFeaturing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      ];

      mockedSongFind.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs),
      } as any);
      mockedSongCountDocuments.mockResolvedValue(1);
      mockedArtistFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await searchSongsByKeyword("test");

      expect(result.songs[0]?.artistName).toBe("Artiste inconnu");
    });

    it("devrait gerer les resultats vides", async () => {
      mockedSongFind.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      } as any);

      mockedSongCountDocuments.mockResolvedValue(0);
      mockedArtistFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await searchSongsByKeyword("nonexistent", 0, 5);

      expect(result.songs).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });

    it("devrait utiliser skip et limit correctement", async () => {
      const mockSongs = [
        {
          _id: "song1",
          name: "Song 1",
          artistId: "artist1",
          genres: [],
          isFeaturing: false,
        },
      ];

      const mockSkip = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockLean = jest.fn().mockResolvedValue(mockSongs);

      mockedSongFind.mockReturnValue({
        skip: mockSkip,
        limit: mockLimit,
        lean: mockLean,
      } as any);

      mockedSongCountDocuments.mockResolvedValue(10);
      mockedArtistFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      } as any);

      await searchSongsByKeyword("test", 5, 10);

      expect(mockSkip).toHaveBeenCalledWith(5);
      expect(mockLimit).toHaveBeenCalledWith(10);
    });

    it("devrait gerer les doublons d'artistids", async () => {
      const mockSongs = [
        {
          _id: "song1",
          name: "Song 1",
          artistId: "artist1",
          genres: [],
          isFeaturing: false,
        },
        {
          _id: "song2",
          name: "Song 2",
          artistId: "artist1",
          genres: [],
          isFeaturing: false,
        },
        {
          _id: "song3",
          name: "Song 3",
          artistId: "artist2",
          genres: [],
          isFeaturing: false,
        },
      ];

      mockedSongFind.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs),
      } as any);

      mockedSongCountDocuments.mockResolvedValue(3);
      mockedArtistFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      } as any);

      await searchSongsByKeyword("song");

      expect(mockedArtistFind).toHaveBeenCalledWith({
        _id: { $in: ["artist1", "artist2"] },
      });
    });
  });
});
