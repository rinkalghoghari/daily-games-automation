import fs from "fs";
import path from "path";
import Game from "./models/game.model.ts";
import Category from "./models/category.model.ts";

const FILE = path.join(process.cwd(), "data/games.json");
const DAILY_LIMIT = 7;

export async function insertDailyGames() {
  const games = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  const todayGames = games.slice(0, DAILY_LIMIT);

  if (!todayGames.length) {
    console.log("⚠️ No games left to insert");
    return;
  }

  const validGames: any[] = [];

  for (const game of todayGames) {
    // 🔒 Unique ID validation
    if (game.id) {
      const exists = await Game.findOne({ id: game.id });
      if (exists) {
        console.log(`⏭️ Skipping duplicate game id: ${game.id}`);
        continue;
      }
    }

    // Parse gameControls
    if (typeof game.gameControls === "string") {
      try {
        game.gameControls = JSON.parse(game.gameControls);
      } catch {
        console.log(`❌ Invalid gameControls JSON for: ${game.title}`);
        continue;
      }
    }

    // Category validation
    if (game.categoryId) {
      const category = await Category.findOne({ slug: game.categoryId });
      if (!category) {
        console.log(`❌ Category not found: ${game.categoryId}`);
        continue;
      }
    }

    validGames.push(game);
  }

  if (!validGames.length) {
    console.log("⚠️ No valid games to insert today");
    return;
  }

  const newGames = await Game.insertMany(validGames);

  await Category.bulkWrite(
    newGames
      .filter(g => g.categoryId)
      .map(g => ({
        updateOne: {
          filter: { slug: g.categoryId },
          update: { $inc: { gamesCount: 1 } }
        }
      }))
  );

  // Remove processed games from JSON (even skipped ones)
 const remainingGames = games.filter((g:any) => !validGames.some((v:any) => v.id === g.id));

fs.writeFileSync(
  FILE,
  JSON.stringify(remainingGames, null, 2)
);


  console.log(`✅ ${newGames.length} games inserted`);
}
