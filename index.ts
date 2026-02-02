import { connectDB } from "./db.js";
import { insertDailyGames } from "./insertDailyGames.ts";

await connectDB();
console.log("🚀 Daily Game Inserter running");

await insertDailyGames();

console.log("✅ Job finished");
process.exit(0);
