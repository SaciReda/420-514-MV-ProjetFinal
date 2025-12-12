import * as service from "../../services/topStatsService";
import Song from "../../models/Song";

jest.mock("../../models/Song");

describe("topStatsService", () => {
  it("top 10 songs", async () => {
    (Song.find as jest.Mock).mockReturnValue({
      sort: () => ({
        limit: () => ({
          lean: jest.fn().mockResolvedValue([{}, {}]),
        }),
      }),
    });

    const result = await service.getTop10SongsByPlaycount();
    expect(result.length).toBe(2);
  });
});
