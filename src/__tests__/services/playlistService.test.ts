import mongoose from "mongoose";
import { getPlaylistSongsDetails } from "../../services/playlistService";
import Playlist from "../../models/Playlist";
import Song from "../../models/Song";
import Artist from "../../models/Artist";

jest.mock("../../models/Playlist");
jest.mock("../../models/Song");
jest.mock("../../models/Artist");

const mockedPlaylistFindById = Playlist.findById as jest.MockedFunction<any>;
const mockedSongFind = Song.find as jest.MockedFunction<any>;
const mockedArtistFind = Artist.find as jest.MockedFunction<any>;

describe("playlistService", () => {
  const mockUserId = "user123";
  const mockPlaylistId = "playlist123";

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(mongoose.Types.ObjectId.prototype, "toString")
      .mockReturnValue("mockObjectId123");
  });

  describe("getPlaylistSongsDetails", () => {
    it("devrait retourner les chansons avec les noms d'artistes", async () => {
      const mockPlaylist = {
        _id: mockPlaylistId,
        userId: mockUserId,
        musics: ["song1", "song2"],
      };

      const mockSongs = [
        {
          _id: "song1",
          name: "Song 1",
          artistId: "artist1",
          genres: [],
          isFeaturing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
        {
          _id: "song2",
          name: "Song 2",
          artistId: "artist2",
          genres: [],
          isFeaturing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      ];

      const mockArtists = [
        {
          _id: "artist1",
          name: "Artist One",
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
        {
          _id: "artist2",
          name: "Artist Two",
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      ];

      mockedPlaylistFindById.mockResolvedValue(mockPlaylist);
      mockedSongFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSongs),
      } as any);
      mockedArtistFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockArtists),
      } as any);

      const result = (await getPlaylistSongsDetails(
        mockPlaylistId,
        mockUserId
      )) as any[];

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);

      // verifie avec tomatchobject pour ignorer les dates
      expect(result[0]).toMatchObject({
        name: "Song 1",
        artistId: "artist1",
        artistName: "Artist One",
      });
      expect(result[1]).toMatchObject({
        name: "Song 2",
        artistId: "artist2",
        artistName: "Artist Two",
      });
    });

    it("devrait retourner artiste inconnu quand l'artiste est pas trouver", async () => {
      const mockPlaylist = {
        _id: mockPlaylistId,
        userId: mockUserId,
        musics: ["song1"],
      };

      const mockSongs = [
        {
          _id: "song1",
          name: "Song 1",
          artistId: "unknown",
          genres: [],
          isFeaturing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      ];

      mockedPlaylistFindById.mockResolvedValue(mockPlaylist);
      mockedSongFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSongs),
      } as any);
      mockedArtistFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      } as any);

      const result = (await getPlaylistSongsDetails(
        mockPlaylistId,
        mockUserId
      )) as any[];

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        name: "Song 1",
        artistId: "unknown",
        artistName: "artiste inconnu",
      });
    });

    it("devrait eliminer les doublons d'artistids", async () => {
      const mockPlaylist = {
        _id: mockPlaylistId,
        userId: mockUserId,
        musics: ["song1", "song2", "song3"],
      };

      const mockSongs = [
        {
          _id: "song1",
          name: "Song 1",
          artistId: "artist1",
          genres: [],
          isFeaturing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
        {
          _id: "song2",
          name: "Song 2",
          artistId: "artist1",
          genres: [],
          isFeaturing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
        {
          _id: "song3",
          name: "Song 3",
          artistId: "artist2",
          genres: [],
          isFeaturing: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      ];

      mockedPlaylistFindById.mockResolvedValue(mockPlaylist);
      mockedSongFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSongs),
      } as any);
      mockedArtistFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      } as any);

      await getPlaylistSongsDetails(mockPlaylistId, mockUserId);

      expect(mockedArtistFind).toHaveBeenCalledWith({
        _id: { $in: ["artist1", "artist2"] },
      });
    });

    it("devrait retourner null quand la playlist existe pas", async () => {
      mockedPlaylistFindById.mockResolvedValue(null);

      const result = await getPlaylistSongsDetails("nonexistent", mockUserId);

      expect(result).toBeNull();
    });

    it("devrait retourner forbidden quand l'utilisateur est pas proprietaire", async () => {
      const mockPlaylist = {
        _id: mockPlaylistId,
        userId: "otherUser",
        musics: ["song1"],
      };

      mockedPlaylistFindById.mockResolvedValue(mockPlaylist);

      const result = await getPlaylistSongsDetails(mockPlaylistId, mockUserId);

      expect(result).toBe("forbidden");
    });

    it("devrait gerer une playlist vide", async () => {
      const mockPlaylist = {
        _id: mockPlaylistId,
        userId: mockUserId,
        musics: [],
      };

      mockedPlaylistFindById.mockResolvedValue(mockPlaylist);
      mockedSongFind.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      } as any);

      const result = (await getPlaylistSongsDetails(
        mockPlaylistId,
        mockUserId
      )) as any[];

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });
});
