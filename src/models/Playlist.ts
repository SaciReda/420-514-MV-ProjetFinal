import { Schema, model } from "mongoose";
import Song from "./Song";

const PlaylistSchema = new Schema(
  {
    userId: { type: String, required: true },
    _id: { type: String }, 
    name: { type: String, required: true },
    musics: [{ type: String, ref: "Song" }],  
  },
  { timestamps: true }
);

export default model("Playlist", PlaylistSchema);
