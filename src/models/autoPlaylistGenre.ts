import { Schema, model } from "mongoose";

const AutoPlaylistGenreSchema = new Schema(
  {
    _id: { type: String, required: true },
    genre: { type: String, required: true },
    name: { type: String, required: true },
    musics: [{ type: String, ref: "Song" }],
  },
  { timestamps: true, _id: false }
);

export default model("AutoPlaylistGenre", AutoPlaylistGenreSchema);
