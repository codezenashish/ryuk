import { db } from "./src/lib/db";
import { noteTable } from "./src/lib/db/schema";
import { eq, ilike } from "drizzle-orm";

async function run() {
  const notes = await db.query.noteTable.findMany({
    where: ilike(noteTable.title, "%Java%"),
  });
  console.log("Found notes:", notes.length);
  if (notes.length > 0) {
    console.log("Raw HTML:");
    console.log(notes[0].content);
  }
}
run();
