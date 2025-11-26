import { Schema, model } from "mongoose";

const artistSchema = new Schema(
  {
    _id: { type: String }, 
    name: { type: String, required: true },
    genres: [{ type: String }],
    imageUrl: { type: String },
    popularity: { type: Number }
  },
  { timestamps: true }
);

export default model("Artist", artistSchema);
