import { fetchBookmarksAction } from "./src/features/bookmarks/actions/bookmark-actions";

async function main() {
  console.log("Fetching...");
  try {
    const res = await fetchBookmarksAction("test_user");
    console.log("Done", res);
  } catch (e) {
    console.error(e);
  }
}
main();
