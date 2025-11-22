import { Schema, model } from "mongoose";

const trackSchema = new Schema(
  {
    spotifyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },

    artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true },

    durationMs: { type: Number, required: true },
    popularity: { type: Number, min: 0, max: 100 },

    previewUrl: { type: String },
    albumName: { type: String },

    audioFeatures: {
      energy: Number,
      danceability: Number,
      tempo: Number,
      valence: Number
    }
  },
  { timestamps: true }
);

export default model("Track", trackSchema);
