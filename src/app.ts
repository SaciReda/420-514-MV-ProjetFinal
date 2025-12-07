import express, { Application } from "express";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import spotifyRouter from "./routes/spotifyRoutes";
import authRouter from "./routes/authRoutes";
import playlistRouter from "./routes/playlistRoutes";
import autoPlaylistRouter from "./routes/autoPlaylistRoutes";
import { connectDB } from "./config/connectDB";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
connectDB();


app.use("/spotify", spotifyRouter);
app.use("/auth", authRouter);
app.use("/playlists", playlistRouter);
app.use("/autoplaylist", autoPlaylistRouter);


app.get("/", (req, res) => {
  res.send("api spotifew marche");
});


if (fs.existsSync("./certs/key.pem") && fs.existsSync("./certs/cert.pem")) {
  const httpsOptions = {
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`API HTTPS lancée sur https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`API HTTP lancée sur http://localhost:${PORT}`);
  });
}
