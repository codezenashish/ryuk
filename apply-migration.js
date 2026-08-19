/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await sql`ALTER TABLE "category" ADD COLUMN "isShared" boolean DEFAULT false NOT NULL`;
    console.log("Added isShared");
  } catch(e) { console.log("isShared:", e.message) }

  try {
    await sql`ALTER TABLE "category" ADD COLUMN "shareToken" text`;
    console.log("Added shareToken");
  } catch(e) { console.log("shareToken:", e.message) }

  try {
    await sql`CREATE INDEX "category_share_token_idx" ON "category" USING btree ("shareToken")`;
    console.log("Added index");
  } catch(e) { console.log("index:", e.message) }

  try {
    await sql`ALTER TABLE "category" ADD CONSTRAINT "category_shareToken_unique" UNIQUE("shareToken")`;
    console.log("Added unique constraint");
  } catch(e) { console.log("unique:", e.message) }
  
  console.log("Done");
  process.exit(0);
}
main();
