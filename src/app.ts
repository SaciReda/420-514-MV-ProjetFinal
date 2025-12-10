import express, { Application } from "express";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import spotifyRouter from "./routes/spotifyRoutes";
import authRouter from "./routes/authRoutes";
import topStatsRoutes from "./routes/topStatsRoute";
import playlistRouter from "./routes/playlistRoutes";
import autoPlaylistRouter from "./routes/autoPlaylistRoutes";
import { connectDB } from "./config/connectDB";

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.API_PORT);
const HOST = process.env.API_HOST;

app.use(express.json());
connectDB();

app.use("/spotify", spotifyRouter);
app.use("/auth", authRouter);
app.use("/playlists", playlistRouter);
app.use("/autoplaylist", autoPlaylistRouter);
app.use("/topstats", topStatsRoutes);

app.get("/", (req, res) => {
  res.send("api spotifew marche");
});

if (fs.existsSync("./certs/key.pem") && fs.existsSync("./certs/cert.pem")) {
  const httpsOptions = {
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
  };

  https.createServer(httpsOptions, app).listen(PORT, "0.0.0.0", () => {
    console.log(`API HTTPS lancée sur ${HOST}:${PORT}`);
  });
} else {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API HTTP lancée sur ${HOST}:${PORT}`);
  });
}
