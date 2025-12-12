import cron from "node-cron";
import { ensureAutoPlaylistFor } from "../services/autoPlaylistService";

const YEARS = [
  2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];
const GENRES = [
  "rap",
  "french rap",
  "pop",
  "hyperpop",
  "r&b",
  "pop urbaine",
  "bedroom pop",
];

export function startAutoPlaylistCron() {
  cron.schedule("0  * * * *", async () => {
    console.log(" Auto-playlist job commencer");

    for (const year of YEARS) {
      for (const genre of GENRES) {
        try {
          await ensureAutoPlaylistFor(year, genre);
        } catch (err) {
          console.error(` erreur de ${year} - ${genre}`, err);
        }
      }
    }

    console.log("auto playlist job terminé");
  });
}
