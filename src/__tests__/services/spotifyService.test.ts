import * as spotifyService from "../../services/spotifyService";

describe("spotifyService", () => {
  it("getArtistDetails retourne l'artiste", async () => {
    jest.spyOn(spotifyService, "getArtistDetails").mockResolvedValue({
      id: "a1",
      name: "Drake",
    } as any);

    const artist = await spotifyService.getArtistDetails("Drake");
    expect(artist!.name).toBe("Drake");
  });

  it("get50Songs retourne les musiques", async () => {
    jest.spyOn(spotifyService, "get50Songs").mockResolvedValue([
      { id: "s1" },
      { id: "s2" },
    ] as any);

    const songs = await spotifyService.get50Songs("Drake");
    expect(songs.length).toBe(2);
  });
});
