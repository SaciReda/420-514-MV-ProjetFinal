import { findArtistByName, findSongsByArtistId } from "../../services/spotifyDbQueryService";
import Artist from "../../models/Artist";
import Song from "../../models/Song";

jest.mock("../../models/Artist");
jest.mock("../../models/Song");

const mockedArtistFindOne = Artist.findOne as jest.MockedFunction<any>;
const mockedSongFind = Song.find as jest.MockedFunction<any>;
const mockedSongCountDocuments = Song.countDocuments as jest.MockedFunction<any>;

describe("spotifyDbQueryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findArtistByName", () => {
    it("devrait trouver un artiste par nom avec regex insensible au ecriture bizarre", async () => {
      const mockArtist = {
        _id: "artist123",
        name: "Test Artist",
        genres: ["pop"]
      };

      mockedArtistFindOne.mockResolvedValue(mockArtist);

      const result = await findArtistByName("test artist");

      expect(result).toEqual(mockArtist);
      expect(mockedArtistFindOne).toHaveBeenCalledWith({
        name: { $regex: "^test artist$", $options: "i" }
      });
    });

    it("devrait retourner null quand l'artiste existe pas", async () => {
      mockedArtistFindOne.mockResolvedValue(null);

      const result = await findArtistByName("Unknown Artist");

      expect(result).toBeNull();
    });
  });

  describe("findSongsByArtistId", () => {
    it("devrait trouver des chansons par artiste avec pagination", async () => {
      const mockSongs = [
        { _id: "song1", name: "Song 1", artistId: "artist123" },
        { _id: "song2", name: "Song 2", artistId: "artist123" }
      ];

      const mockSkip = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockLean = jest.fn().mockResolvedValue(mockSongs);

      mockedSongFind.mockReturnValue({
        skip: mockSkip,
        limit: mockLimit,
        lean: mockLean
      } as any);

      mockedSongCountDocuments.mockResolvedValue(10);

      const result = await findSongsByArtistId("artist123", 2, 4);

      expect(result.songs).toEqual(mockSongs);
      expect(result.totalCount).toBe(10);
      expect(mockedSongFind).toHaveBeenCalledWith({ artistId: "artist123" });
      expect(mockSkip).toHaveBeenCalledWith(2);
      expect(mockLimit).toHaveBeenCalledWith(4);
    });

    it("devrait utiliser les valeurs par defaut pour skip et limit", async () => {
      const mockSongs = [{ _id: "song1", name: "Song 1" }];

      mockedSongFind.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs)
      } as any);

      mockedSongCountDocuments.mockResolvedValue(1);

      await findSongsByArtistId("artist123");

      expect(mockedSongFind().skip).toHaveBeenCalledWith(0);
      expect(mockedSongFind().limit).toHaveBeenCalledWith(4);
    });

    it("devrait gerer les resultats vides", async () => {
      mockedSongFind.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      } as any);

      mockedSongCountDocuments.mockResolvedValue(0);

      const result = await findSongsByArtistId("nonexistent");

      expect(result.songs).toEqual([]);
      expect(result.totalCount).toBe(0);
    });
  });
});