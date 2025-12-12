jest.mock("../../models/Artist", () => ({
  __esModule: true,
  default: {
    updateOne: jest.fn(),
  },
}));

jest.mock("../../models/Song", () => ({
  __esModule: true,
  default: {
    updateOne: jest.fn(),
  },
}));

import { saveArtist, saveSong } from "../../services/SpotifySaveService";

describe("SpotifySaveService", () => {
  it("save artist retourne pas", async () => {
    await expect(
      saveArtist({ id: "a1", name: "Artist" } as any)
    ).resolves.not.toThrow();
  });

  it("save music retourne pas ", async () => {
    await expect(
      saveSong({ id: "s1", name: "Song" } as any)
    ).resolves.not.toThrow();
  });
});
