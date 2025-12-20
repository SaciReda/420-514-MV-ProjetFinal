import { saveArtist, saveSong } from "../../services/SpotifySaveService";
import Artist from "../../models/Artist";
import Song from "../../models/Song";

jest.mock("../../models/Artist");
jest.mock("../../models/Song");

const mockedArtistUpdateOne = Artist.updateOne as jest.MockedFunction<any>;
const mockedSongUpdateOne = Song.updateOne as jest.MockedFunction<any>;

describe("SpotifySaveService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveArtist", () => {
    it("devrait sauvegarder un artiste avec upsert", async () => {
      const mockArtist = {
        id: "artist123",
        name: "Test Artist",
        genres: ["pop"],
        imageUrl: "image.jpg",
        popularity: 80
      };

      mockedArtistUpdateOne.mockResolvedValue({});

      await saveArtist(mockArtist);

      expect(mockedArtistUpdateOne).toHaveBeenCalledWith(
        { _id: "artist123" },
        mockArtist,
        { upsert: true }
      );
    });

    it("devrait utiliser l'id de l'artiste comme _id", async () => {
      const mockArtist = {
        id: "differentId",
        name: "Artist"
      };

      mockedArtistUpdateOne.mockResolvedValue({});

      await saveArtist(mockArtist);

      expect(mockedArtistUpdateOne).toHaveBeenCalledWith(
        { _id: "differentId" },
        mockArtist,
        { upsert: true }
      );
    });
  });

  describe("saveSong", () => {
    it("devrait sauvegarder une chanson avec upsert", async () => {
      const mockSong = {
        id: "song123",
        name: "Test Song",
        artistId: "artist123",
        album: "Test Album",
        popularity: 70
      };

      mockedSongUpdateOne.mockResolvedValue({});

      await saveSong(mockSong);

      expect(mockedSongUpdateOne).toHaveBeenCalledWith(
        { _id: "song123" },
        mockSong,
        { upsert: true }
      );
    });

    it("devrait gerer differentes structures de chansons", async () => {
      const mockSong = {
        id: "song456",
        name: "Another Song",
        artistName: "Artist",
        releaseDate: "2023-01-01",
        playCount: 1000
      };

      mockedSongUpdateOne.mockResolvedValue({});

      await saveSong(mockSong);

      expect(mockedSongUpdateOne).toHaveBeenCalledWith(
        { _id: "song456" },
        mockSong,
        { upsert: true }
      );
    });
  });
});