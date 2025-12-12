import {
  getUserPlaylists,
  addSongToPlaylist
} from "../../services/playlistService";
import Playlist from "../../models/Playlist";


jest.mock("../../models/Playlist", () => ({
  find: jest.fn(() => ({
    lean: jest.fn().mockResolvedValue([
      { _id: "p1", userId: "u1", name: "Playlist" }
    ])
  })),
  findById: jest.fn()
}));

jest.mock("../../models/Song", () => ({
  findById: jest.fn(() => ({
    lean: jest.fn().mockResolvedValue({ _id: "s1" })
  }))
}));

describe("PlaylistService", () => {
  it("getUserPlaylists", async () => {
    const playlists = await getUserPlaylists("u1");
    expect(playlists.length).toBe(1);
  });

  it("addSongToPlaylist", async () => {
    (Playlist.findById as jest.Mock).mockResolvedValue({
      userId: "u1",
      musics: [],
      save: jest.fn()
    });

    const result = await addSongToPlaylist("p1", "s1", "u1");
    expect(result).toBeDefined();
  });
});
