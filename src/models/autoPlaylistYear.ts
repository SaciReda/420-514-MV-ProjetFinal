import { Schema, model } from "mongoose";

const AutoPlaylistYearSchema = new Schema(
  {
    _id: { type: String, required: true },

    year: { type: Number, required: true },

    name: { type: String, required: true },

    musics: [{ type: String, ref: "Song" }],
  },
  { timestamps: true, _id: false }
);

export default model("AutoPlaylistYear", AutoPlaylistYearSchema);
