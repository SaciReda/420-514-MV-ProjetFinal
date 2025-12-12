import * as queryService from "../../services/spotifyDbQueryService";
import Artist from "../../models/Artist";

jest.mock("../../models/Artist");

describe("spotifyDbQueryService", () => {
  it("findArtistByName returns chanteur", async () => {
    (Artist.findOne as jest.Mock).mockResolvedValue({ name: "Drake" });

    const artist = await queryService.findArtistByName("Drake");
    expect(artist!.name).toBe("Drake");
  });
});
