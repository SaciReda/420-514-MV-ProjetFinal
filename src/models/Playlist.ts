import { Schema, model } from "mongoose";
import Song from "./Song";

const PlaylistSchema = new Schema(
  {
    _id: { type: String }, 
    name: { type: String, required: true },
    musics: [{ type: Song.schema }],    
  },
  { timestamps: true }
);

export default model("Playlist", PlaylistSchema);
