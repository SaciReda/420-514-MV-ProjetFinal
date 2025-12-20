import "dotenv/config";

const mockInstance = {
  clientCredentialsGrant: jest.fn(),
  searchArtists: jest.fn(),
  searchTracks: jest.fn(),
  getArtist: jest.fn(),
  setAccessToken: jest.fn(),
};

jest.mock("spotify-web-api-node", () => {
  return jest.fn().mockImplementation(() => mockInstance);
});

import { getArtistDetails, get50Songs } from "../../services/spotifyService";

global.fetch = jest.fn() as jest.Mock;

describe("spotifyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe("getArtistDetails", () => {
    it("devrait retourner les details d'un artiste avec succes", async () => {
      const mockAuth = { body: { access_token: "token123" } };
      const mockArtist = {
        id: "artist123",
        name: "test artist",
        genres: ["pop", "rock"],
        images: [{ url: "image.jpg" }],
        popularity: 85,
      };

      mockInstance.clientCredentialsGrant.mockResolvedValue(mockAuth);
      mockInstance.searchArtists.mockResolvedValue({
        body: { artists: { items: [mockArtist] } },
      });

      const result = await getArtistDetails("test artist");

      expect(mockInstance.clientCredentialsGrant).toHaveBeenCalled();
      expect(mockInstance.setAccessToken).toHaveBeenCalledWith("token123");
      expect(mockInstance.searchArtists).toHaveBeenCalledWith("test artist");
      expect(result).toEqual({
        id: "artist123",
        name: "test artist",
        genres: ["pop", "rock"],
        imageUrl: "image.jpg",
        popularity: 85,
      });
    });

    it("devrait retourner null quand l'artiste n'est pas trouver", async () => {
      mockInstance.clientCredentialsGrant.mockResolvedValue({
        body: { access_token: "token123" },
      });
      mockInstance.searchArtists.mockResolvedValue({
        body: { artists: { items: [] } },
      });

      const result = await getArtistDetails("Unknown Artist");

      expect(result).toBeNull();
    });

    it("devrait gerer l'absence d'image", async () => {
      const mockAuth = { body: { access_token: "token123" } };
      const mockArtist = {
        id: "artist123",
        name: "test artist",
        genres: ["pop"],
        images: [],
        popularity: 70,
      };

      mockInstance.clientCredentialsGrant.mockResolvedValue(mockAuth);
      mockInstance.searchArtists.mockResolvedValue({
        body: { artists: { items: [mockArtist] } },
      });

      const result = await getArtistDetails("test artist");

      expect(result?.imageUrl).toBeNull();
    });

    it("devrait gerer les images null", async () => {
      const mockAuth = { body: { access_token: "token123" } };
      const mockArtist = {
        id: "artist123",
        name: "test artist",
        genres: ["pop"],
        images: null,
        popularity: 70,
      };

      mockInstance.clientCredentialsGrant.mockResolvedValue(mockAuth);
      mockInstance.searchArtists.mockResolvedValue({
        body: { artists: { items: [mockArtist] } },
      });

      const result = await getArtistDetails("test artist");

      expect(result?.imageUrl).toBeNull();
    });
  });

  describe("get50Songs", () => {
    it("devrait retourner des chansons avec les comptes ", async () => {
      const mockAuth = { body: { access_token: "token123" } };
      const mockTrack = {
        id: "track123",
        name: "test song",
        artists: [{ id: "artist123", name: "test artist" }],
        album: { name: "test album", release_date: "2023-01-01" },
        popularity: 80,
      };

      mockInstance.clientCredentialsGrant.mockResolvedValue(mockAuth);
      mockInstance.searchTracks.mockResolvedValue({
        body: { tracks: { items: [mockTrack] } },
      });
      mockInstance.getArtist.mockResolvedValue({
        body: { genres: ["pop"] },
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({ track: { playcount: 1000 } }),
      });

      const result = await get50Songs("test artist");

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "track123",
        name: "test song",
        artistId: "artist123",
        artistName: "test artist",
        album: "test album",
        releaseDate: "2023-01-01",
        popularity: 80,
        playCount: 1000,
        isFeaturing: false,
        genres: ["pop"],
      });
    });

    it("devrait identifier les feats", async () => {
      const mockAuth = { body: { access_token: "token123" } };
      const mockTrack = {
        id: "track123",
        name: "feat song",
        artists: [{ id: "artist456", name: "featuring artist" }],
        album: { name: "album", release_date: "2023-01-01" },
        popularity: 70,
      };

      mockInstance.clientCredentialsGrant.mockResolvedValue(mockAuth);
      mockInstance.searchTracks.mockResolvedValue({
        body: { tracks: { items: [mockTrack] } },
      });
      mockInstance.getArtist.mockResolvedValue({
        body: { genres: ["rap"] },
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({ track: { playcount: 500 } }),
      });

      const result = await get50Songs("main artist");

      expect(result[0]!.isFeaturing).toBe(true);
      expect(result[0]!.artistName).toBe("featuring artist");
    });

    it("devrait gérer les erreurs de last fm", async () => {
      const mockAuth = { body: { access_token: "token123" } };
      const mockTrack = {
        id: "track123",
        name: "test song",
        artists: [{ id: "artist123", name: "test artist" }],
        album: { name: "album", release_date: "2023-01-01" },
        popularity: 80,
      };

      mockInstance.clientCredentialsGrant.mockResolvedValue(mockAuth);
      mockInstance.searchTracks.mockResolvedValue({
        body: { tracks: { items: [mockTrack] } },
      });
      mockInstance.getArtist.mockResolvedValue({
        body: { genres: [] },
      });

      (global.fetch as jest.Mock).mockRejectedValue(new Error("api erreur"));

      const result = await get50Songs("test artist");

      expect(result[0]!.playCount).toBe(0);
    });

    it("devrait gérer l'absence d'artiste", async () => {
      const mockAuth = { body: { access_token: "token123" } };
      const mockTrack = {
        id: "track123",
        name: "test song",
        artists: [],
        album: { name: "album", release_date: "2023-01-01" },
        popularity: 80,
      };

      mockInstance.clientCredentialsGrant.mockResolvedValue(mockAuth);
      mockInstance.searchTracks.mockResolvedValue({
        body: { tracks: { items: [mockTrack] } },
      });

      const result = await get50Songs("test artist");

      expect(result[0]!.artistId).toBe("inconnu");
      expect(result[0]!.artistName).toBe("inconnu");
      expect(result[0]!.isFeaturing).toBe(true);
    });

    it("devrait gérer l'absence de genres", async () => {
      const mockAuth = { body: { access_token: "token123" } };
      const mockTrack = {
        id: "track123",
        name: "test song",
        artists: [{ id: "artist123", name: "test artist" }],
        album: { name: "album", release_date: "2023-01-01" },
        popularity: 80,
      };

      mockInstance.clientCredentialsGrant.mockResolvedValue(mockAuth);
      mockInstance.searchTracks.mockResolvedValue({
        body: { tracks: { items: [mockTrack] } },
      });
      mockInstance.getArtist.mockResolvedValue({
        body: { genres: null },
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({}),
      });

      const result = await get50Songs("test artist");

      expect(result[0]!.genres).toEqual([]);
      expect(result[0]!.playCount).toBe(0);
    });

    it("devrait utiliser la limite de 50 chansons", async () => {
      const mockAuth = { body: { access_token: "token123" } };
      const mockTracks = Array(50).fill({
        id: "track",
        name: "song",
        artists: [{ id: "artist", name: "artist" }],
        album: { name: "album", release_date: "2023-01-01" },
        popularity: 80,
      });

      mockInstance.clientCredentialsGrant.mockResolvedValue(mockAuth);
      mockInstance.searchTracks.mockResolvedValue({
        body: { tracks: { items: mockTracks } },
      });
      mockInstance.getArtist.mockResolvedValue({
        body: { genres: [] },
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({}),
      });

      const result = await get50Songs("test artist");

      expect(result).toHaveLength(50);
      expect(mockInstance.searchTracks).toHaveBeenCalledWith(
        "artist:test artist",
        { limit: 50 }
      );
    });
  });
});
