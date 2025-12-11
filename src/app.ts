import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import spotifyRouter from "./routes/spotifyRoutes";
import authRouter from "./routes/authRoutes";
import playlistRouter from "./routes/playlistRoutes";
import autoPlaylistRouter from "./routes/autoPlaylistRoutes";
import { connectDB } from "./config/connectDB";

dotenv.config();
//obliger dutiliser cors

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

connectDB();

app.use("/spotify", spotifyRouter);
app.use("/auth", authRouter);
app.use("/playlists", playlistRouter);
app.use("/autoplaylist", autoPlaylistRouter);

app.get("/", (req, res) => {
  res.send("API fonctionne HTTP sur port " + PORT);
});
//marche pas en https ?????????
app.listen(PORT, () => {
  console.log(`API HTTP lancée sur http://localhost:${PORT}`);
});
