import * as autoPlaylistService from "../../services/autoPlaylistService";
import {
  buildAutoPlaylistByYear,
  getAutoPlaylistByYear,
  buildAutoPlaylistByGenre,
  getAutoPlaylistByGenre,
  ensureAutoPlaylistFor
} from "../../services/autoPlaylistService";
import AutoPlaylistYear from "../../models/autoPlaylistYear";
import AutoPlaylistGenre from "../../models/autoPlaylistGenre";
import Song from "../../models/Song";

jest.mock("../../models/Song");
jest.mock("../../models/autoPlaylistYear");
jest.mock("../../models/autoPlaylistGenre");

const mockedSongFind = Song.find as jest.MockedFunction<any>;
const mockedAutoPlaylistYearFindOne = AutoPlaylistYear.findOne as jest.MockedFunction<any>;
const mockedAutoPlaylistYearCreate = AutoPlaylistYear.create as jest.MockedFunction<any>;
const mockedAutoPlaylistGenreFindOne = AutoPlaylistGenre.findOne as jest.MockedFunction<any>;
const mockedAutoPlaylistGenreCreate = AutoPlaylistGenre.create as jest.MockedFunction<any>;

describe("autoPlaylistService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buildAutoPlaylistByYear", () => {
    it("devrait creer une playlist quand elle existe pas ", async () => {
      const mockSongs = [
        { _id: "song1", playCount: 100 },
        { _id: "song2", playCount: 90 }
      ];

      const mockPlaylist = {
        _id: "2023",
        year: 2023,
        name: "top musique  2023",
        musics: ["song1", "song2"],
        save: jest.fn()
      };

      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs)
      } as any);

      mockedAutoPlaylistYearFindOne.mockResolvedValue(null);
      mockedAutoPlaylistYearCreate.mockResolvedValue(mockPlaylist);

      const result = await buildAutoPlaylistByYear(2023);

      expect(result).toEqual({
        playlist: mockPlaylist,
        created: true,
        updated: false
      });
      expect(mockedSongFind).toHaveBeenCalledWith({
        releaseDate: /^2023/
      });
      expect(mockedSongFind().sort).toHaveBeenCalledWith({ playCount: -1 });
      expect(mockedSongFind().limit).toHaveBeenCalledWith(50);
    });

    it("devrait mettre a jour une playlist existante", async () => {
      const mockSongs = [
        { _id: "song1", playCount: 100 }
      ];

      const mockPlaylist = {
        _id: "2023",
        musics: [],
        save: jest.fn().mockResolvedValue(true)
      };

      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs)
      } as any);

      mockedAutoPlaylistYearFindOne.mockResolvedValue(mockPlaylist);

      const result = await buildAutoPlaylistByYear(2023);

      expect(result).toEqual({
        playlist: mockPlaylist,
        created: false,
        updated: true
      });
      expect(mockPlaylist.save).toHaveBeenCalled();
      expect(mockPlaylist.musics).toEqual(["song1"]);
    });

    it("devrait retourner null quand aucune chanson est trouvée", async () => {
      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      } as any);

      const result = await buildAutoPlaylistByYear(1900);

      expect(result).toBeNull();
      expect(mockedAutoPlaylistYearFindOne).not.toHaveBeenCalled();
      expect(mockedAutoPlaylistYearCreate).not.toHaveBeenCalled();
    });

    it("devrait convertir les id en string", async () => {
      const mockSongs = [
        { _id: 12345, playCount: 100 },
        { _id: "67890", playCount: 90 }
      ];

      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs)
      } as any);

      mockedAutoPlaylistYearFindOne.mockResolvedValue(null);
      mockedAutoPlaylistYearCreate.mockImplementation(async (data: any) => data);

      await buildAutoPlaylistByYear(2023);

      expect(mockedAutoPlaylistYearCreate).toHaveBeenCalledWith(expect.objectContaining({
        musics: ["12345", "67890"]
      }));
    });
  });

  describe("getAutoPlaylistByYear", () => {
    it("devrait recuperer une playlist par annee", async () => {
      const mockPlaylist = { _id: "2023", year: 2023, name: "test playlist" };
      mockedAutoPlaylistYearFindOne.mockResolvedValue(mockPlaylist);

      const result = await getAutoPlaylistByYear(2023);

      expect(result).toBe(mockPlaylist);
      expect(mockedAutoPlaylistYearFindOne).toHaveBeenCalledWith({ _id: "2023" });
    });

    it("devrait retourner null quand la playlist existe pas", async () => {
      mockedAutoPlaylistYearFindOne.mockResolvedValue(null);

      const result = await getAutoPlaylistByYear(9999);

      expect(result).toBeNull();
    });
  });

  describe("buildAutoPlaylistByGenre", () => {
    it("devrait creer une playlist par genre", async () => {
      const mockSongs = [
        { _id: "song1", playCount: 100 }
      ];

      const mockPlaylist = {
        _id: "pop",
        genre: "pop",
        name: 'top musique du genre pop',
        musics: ["song1"],
        save: jest.fn()
      };

      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs)
      } as any);

      mockedAutoPlaylistGenreFindOne.mockResolvedValue(null);
      mockedAutoPlaylistGenreCreate.mockResolvedValue(mockPlaylist);

      const result = await buildAutoPlaylistByGenre("pop");

      expect(result).toEqual({
        playlist: mockPlaylist,
        created: true,
        updated: false
      });
      expect(mockedSongFind).toHaveBeenCalledWith({
        genres: { $regex: "pop", $options: "i" }
      });
    });

    it("devrait mettre a jour une playlist de genre existante", async () => {
      const mockSongs = [
        { _id: "song1", playCount: 100 }
      ];

      const mockPlaylist = {
        _id: "rock",
        musics: ["oldSong"],
        save: jest.fn().mockResolvedValue(true)
      };

      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSongs)
      } as any);

      mockedAutoPlaylistGenreFindOne.mockResolvedValue(mockPlaylist);

      const result = await buildAutoPlaylistByGenre("rock");

      expect(result).toEqual({
        playlist: mockPlaylist,
        created: false,
        updated: true
      });
      expect(mockPlaylist.musics).toEqual(["song1"]);
    });

    it("devrait utiliser une recherche insensible au ecriture bizzare", async () => {
      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      } as any);

      await buildAutoPlaylistByGenre("RoCk");

      expect(mockedSongFind).toHaveBeenCalledWith({
        genres: { $regex: "RoCk", $options: "i" }
      });
    });

    it("devrait retourner null quand aucun genre n'est trouver", async () => {
      mockedSongFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      } as any);

      const result = await buildAutoPlaylistByGenre("unknown");

      expect(result).toBeNull();
    });
  });

  describe("getAutoPlaylistByGenre", () => {
    it("devrait recuperer une playlist par genre", async () => {
      const mockPlaylist = { _id: "pop", genre: "pop", name: "test genre" };
      mockedAutoPlaylistGenreFindOne.mockResolvedValue(mockPlaylist);

      const result = await getAutoPlaylistByGenre("pop");

      expect(result).toBe(mockPlaylist);
      expect(mockedAutoPlaylistGenreFindOne).toHaveBeenCalledWith({ _id: "pop" });
    });
  });

  describe("ensureAutoPlaylistFor", () => {
    it("devrait s'assurer de l'existence des playlists pour annee et genre", async () => {
      const result = await ensureAutoPlaylistFor(2023, "pop");

      expect(result).toEqual({
        year: null,
        genre: null
      });
    });

    it("devrait gérer les retours null", async () => {
      const buildAutoPlaylistByYearSpy = jest.spyOn(autoPlaylistService, 'buildAutoPlaylistByYear')
        .mockResolvedValue(null);
      const buildAutoPlaylistByGenreSpy = jest.spyOn(autoPlaylistService, 'buildAutoPlaylistByGenre')
        .mockResolvedValue(null);

      const result = await ensureAutoPlaylistFor(1900, "unknown");

      expect(result).toEqual({
        year: null,
        genre: null
      });

      buildAutoPlaylistByYearSpy.mockRestore();
      buildAutoPlaylistByGenreSpy.mockRestore();
    });
  });
});