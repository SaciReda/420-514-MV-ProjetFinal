jest.mock("../../models/AutoPlaylistYear", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

import AutoPlaylistYear from "../../models/autoPlaylistYear";
import { getAutoPlaylistByYear } from "../../services/autoPlaylistService";

describe("autoPlaylistService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retourne playlist existante", async () => {
    (AutoPlaylistYear.findOne as jest.Mock).mockResolvedValue({
      _id: 2020,
      year: 2020,
    });

    const result = await getAutoPlaylistByYear(2020);

    expect(AutoPlaylistYear.findOne).toHaveBeenCalledWith({ _id: 2020 });
    expect(result?.year).toBe(2020);
  });

  it("creer playlist si existe pas ", async () => {
    (AutoPlaylistYear.findOne as jest.Mock).mockResolvedValue(null);
    (AutoPlaylistYear.create as jest.Mock).mockResolvedValue({
      _id: 2021,
      year: 2021,
    });

    const result = await getAutoPlaylistByYear(2021);

    expect(AutoPlaylistYear.create).toHaveBeenCalled();
    expect(result?.year).toBe(2021);
  });
});
