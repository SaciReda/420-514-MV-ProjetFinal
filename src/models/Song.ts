import { Schema, model } from "mongoose";

const songSchema = new Schema(
  {
    _id: { type: String }, 
    name: { type: String, required: true },
    artistId: { type: String, ref: "Artist", required: true },
    album: { type: String },
    releaseDate: { type: String },
    popularity: { type: Number },
    playCount: { type: Number },
    genres: [{ type: String }],
    isFeaturing: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default model("Song", songSchema);
