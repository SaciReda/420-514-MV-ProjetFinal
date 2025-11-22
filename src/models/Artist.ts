import { Schema, model } from "mongoose";

const artistSchema = new Schema(
  {
    spotifyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    followers: { type: Number, default: 0 },
    genres: [{ type: String }],
    popularity: { type: Number, min: 0, max: 100 },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

export default model("Artist", artistSchema);
