import * as songService from "../../services/songService";
import Song from "../../models/Song";
import * as spotifyService from "../../services/spotifyService";
import * as saveService from "../../services/SpotifySaveService";

jest.mock("../../models/Song");
jest.mock("../../services/spotifyService");
jest.mock("../../services/SpotifySaveService");

describe("SongService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetchAndSaveSongsByArtist success", async () => {
    (spotifyService.getArtistDetails as jest.Mock).mockResolvedValue({ id: "a1", name: "Drake" });
    (spotifyService.get50Songs as jest.Mock).mockResolvedValue([{ id: "s1" }, { id: "s2" }]);
    (saveService.saveArtist as jest.Mock).mockResolvedValue(true);
    (saveService.saveSong as jest.Mock).mockResolvedValue(true);

    const result = await songService.fetchAndSaveSongsByArtist("Drake");

    expect(result.artist.name).toBe("Drake");
    expect(result.songs.length).toBe(2);
    expect(saveService.saveSong).toHaveBeenCalledTimes(2);
  });

  it("va fetch artiste et musiques si pas trouver", async () => {
    (spotifyService.getArtistDetails as jest.Mock).mockResolvedValue(null);

    await expect(
      songService.fetchAndSaveSongsByArtist("Unknown")
    ).rejects.toThrow("artiste introuvable sur spotify");
  });

  it("retrouve musique par keyword", async () => {
    (Song.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([{ name: "Love Song" }]),
    });

    const result = await songService.searchSongsByKeyword("love");

    expect(result.length).toBe(1);
    expect(result[0]!.name).toContain("Love");
  });
});
