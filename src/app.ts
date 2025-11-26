import express, { Application } from "express";
import dotenv from "dotenv";
import spotifyRouter from "./routes/spotifyRoutes";
import { connectDB } from "./config/connectDB";

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB();

app.use("/spotify", spotifyRouter);

app.get("/", (req, res) => {
  res.send("api spotifew marche");
});

app.listen(PORT, () => {
  console.log(`api run sur 3000`);
});
