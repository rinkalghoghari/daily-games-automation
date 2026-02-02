import { connectDB } from "./db.js";
import { insertDailyGames } from "./insertDailyGames.ts";

await connectDB();
console.log("🚀 Daily Game Inserter running");

if (process.argv.includes('--run-now')) {
  await insertDailyGames();
  process.exit(0);
}