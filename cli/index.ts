import { program } from "commander";
import inquirer from "inquirer";
import autocompletePrompt from "inquirer-autocomplete-prompt";
import fuzzy from "fuzzy";
import chalk from "chalk";
import ora from "ora";
import cliSpinners from "cli-spinners";
import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import * as cheerio from "cheerio";

function renderHtmlToCli(html: string): string {
  const $ = cheerio.load(html);
  
  // Style headers
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    $(el).replaceWith(`\n\n${chalk.bold.blue($(el).text().toUpperCase())}\n`);
  });
  
  // Style code blocks
  $('pre').each((_, el) => {
    $(el).replaceWith(`\n${chalk.bgGray.white(" CODE ")}\n${chalk.gray($(el).text())}\n`);
  });
  $('code').each((_, el) => {
    $(el).replaceWith(chalk.yellow($(el).text()));
  });

  // Blockquotes
  $('blockquote').each((_, el) => {
     $(el).replaceWith(`\n${chalk.italic.dim("> " + $(el).text())}\n`);
  });

  // Lists
  $('li').each((_, el) => {
    $(el).replaceWith(`\n  • ${$(el).text()}`);
  });

  $('p').each((_, el) => {
    $(el).replaceWith(`\n${$(el).text()}\n`);
  });

  return $.text().trim().replace(/\n{3,}/g, '\n\n');
}

inquirer.registerPrompt("autocomplete", autocompletePrompt);

function createSpinner(text: string) {
  return ora({
    text,
    spinner: cliSpinners.dots,
    color: "cyan",
  });
}

interface RyukConfig {
  apiKey?: string;
  serverUrl?: string;
  email?: string;
  name?: string;
}

interface MetadataResponse {
  title?: string;
  description?: string;
  favicon?: string;
  domain?: string;
  error?: string;
}

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  category?: { name: string } | null;
  createdAt: string;
}

interface BookmarkSaveResponse {
  bookmark?: BookmarkItem;
  user?: { name: string; email: string };
  error?: string;
}

interface BookmarkListResponse {
  count: number;
  user?: { name: string; email: string };
  bookmarks: BookmarkItem[];
  error?: string;
}

interface NoteItem {
  id: string;
  title: string;
  content: string;
  language?: string | null;
  isSnippet: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoteListResponse {
  count: number;
  notes: NoteItem[];
  error?: string;
}

const CONFIG_FILE = path.join(os.homedir(), ".ryukrc");
const DEFAULT_HOST = process.env.RYUK_SERVER_URL || "https://ryuk-vert.vercel.app";

function getConfig(): RyukConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf8");
      return JSON.parse(raw) as RyukConfig;
    }
  } catch {
    // Ignore parse errors
  }
  return {};
}

function saveConfig(config: Partial<RyukConfig>): void {
  try {
    const existing = getConfig();
    const updated = { ...existing, ...config };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(chalk.red("✖ Failed to save configuration:"), errorMsg);
    process.exit(1);
  }
}

function clearConfig(): void {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(chalk.red("✖ Failed to clear configuration file:"), errorMsg);
  }
}

const CACHE_FILE = path.join(os.homedir(), ".ryuk_cache.json");
const CACHE_TTL_MS = 60 * 1000;

interface CacheData {
  bookmarks?: { timestamp: number; data: BookmarkListResponse };
  notes?: { timestamp: number; data: NoteListResponse };
}

function getCache(): CacheData {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as CacheData;
    }
  } catch {
    // Ignore parse error
  }
  return {};
}

function saveCache(update: Partial<CacheData>): void {
  try {
    const existing = getCache();
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({ ...existing, ...update }),
      "utf8"
    );
  } catch {
    // Ignore write error
  }
}

function invalidateCache(): void {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
    }
  } catch {
    // Ignore unlink error
  }
}

function printHeader(title?: string): void {
  const config = getConfig();
  const userDisplay = config.email ? chalk.cyan(config.email) : chalk.dim("Not signed in");
  console.log("");
  if (title) {
    console.log(chalk.bold.cyan(`Ryuk ${title}`) + chalk.dim(`  (${userDisplay})`));
  } else {
    console.log(chalk.bold.cyan("Ryuk CLI 1.0.0") + chalk.dim(`  (${userDisplay})`));
  }
  console.log("");
}

function openUrlInBrowser(url: string) {
  const startCmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
      ? "start"
      : "xdg-open";
  exec(`${startCmd} "${url}"`, (err) => {
    if (err) {
      console.log(chalk.yellow(`Could not open browser. URL: ${url}`));
    }
  });
}

function ensureAuth(): RyukConfig {
  const config = getConfig();
  if (!config.apiKey) {
    printHeader();
    console.log(chalk.yellow("You are currently not signed in."));
    console.log(chalk.dim("Run 'ryuk login' to authenticate.\n"));
    process.exit(1);
  }
  return config;
}

// ==========================================
// SEARCH HANDLERS
// ==========================================

async function handleBookmarkSearch(initialQuery?: string) {
  const config = ensureAuth();
  const host = config.serverUrl || DEFAULT_HOST;

  const cache = getCache();
  let data: BookmarkListResponse | null = null;

  if (cache.bookmarks && Date.now() - cache.bookmarks.timestamp < CACHE_TTL_MS) {
    data = cache.bookmarks.data;
  } else {
    const spinner = createSpinner("Fetching bookmarks...").start();
    try {
      const res = await fetch(`${host}/api/bookmark/external`, {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });
      if (res.ok) {
        data = (await res.json()) as BookmarkListResponse;
        saveCache({ bookmarks: { timestamp: Date.now(), data } });
        spinner.stop();
      } else {
        spinner.fail("Failed to fetch bookmarks.");
      }
    } catch {
      spinner.stop();
      data = cache.bookmarks?.data || null;
    }
  }

  const bookmarks = data?.bookmarks || [];

  if (bookmarks.length === 0) {
    console.log(chalk.yellow("No bookmarks found. Use 'ryuk add [url]' to save bookmarks.\n"));
    return;
  }

  const startSearchPrompt = async () => {
    const searchPrompt = [
      {
        type: "autocomplete",
        name: "selectedBookmark",
        message: "Search Bookmarks:",
        suggestOnly: false,
        searchText: "Searching...",
        emptyText: "No matching bookmarks found.",
        pageSize: 10,
        default: initialQuery || "",
        source: async (_: unknown, input = "") => {
          const formattedInput = input.trim();
          const items = !formattedInput
            ? bookmarks
            : fuzzy
                .filter(formattedInput, bookmarks, {
                  extract: (b) =>
                    `${b.title} ${b.url} ${b.description || ""} ${
                      b.category?.name || ""
                    }`,
                })
                .map((res) => res.original);

          return items.map((b) => ({
            name: `${chalk.bold.white(b.title)} ${
              b.category?.name ? chalk.yellow(`[${b.category.name}] `) : ""
            }${chalk.dim(`(${b.url})`)}`,
            value: b,
          }));
        },
      },
    ];

    const { selectedBookmark } = (await inquirer.prompt(
      searchPrompt as unknown as Parameters<typeof inquirer.prompt>[0]
    )) as {
      selectedBookmark: BookmarkItem;
    };

    if (!selectedBookmark) return;

    console.log("");
    console.log(chalk.bold.cyan("Title:       ") + chalk.bold.green(selectedBookmark.title));
    console.log(chalk.bold.cyan("URL:         ") + chalk.underline.blue(selectedBookmark.url));
    if (selectedBookmark.category?.name) {
      console.log(chalk.bold.cyan("Category:    ") + chalk.yellow(selectedBookmark.category.name));
    }
    if (selectedBookmark.description) {
      console.log(chalk.bold.cyan("Description: ") + chalk.dim(selectedBookmark.description));
    }
    console.log("");

    const { action } = await inquirer.prompt<{ action: string }>([
      {
        type: "list",
        name: "action",
        message: "Action:",
        choices: [
          { name: "Open in Browser", value: "open" },
          { name: "Copy URL", value: "copy" },
          { name: "Search Again", value: "again" },
          { name: "Exit", value: "exit" },
        ],
      },
    ]);

    if (action === "open") {
      console.log(chalk.green(`\nOpening ${selectedBookmark.url}...`));
      openUrlInBrowser(selectedBookmark.url);
    } else if (action === "copy") {
      console.log(chalk.green.bold(`\nURL: ${selectedBookmark.url}\n`));
    } else if (action === "again") {
      console.log("");
      await startSearchPrompt();
    }
  };

  await startSearchPrompt();
}

async function handleNotesSearch(initialQuery?: string) {
  const config = ensureAuth();
  const host = config.serverUrl || DEFAULT_HOST;

  const cache = getCache();
  let data: NoteListResponse | null = null;

  if (cache.notes && Date.now() - cache.notes.timestamp < CACHE_TTL_MS) {
    data = cache.notes.data;
  } else {
    const spinner = createSpinner("Fetching notes...").start();
    try {
      const res = await fetch(`${host}/api/note/external`, {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });
      if (res.ok) {
        data = (await res.json()) as NoteListResponse;
        saveCache({ notes: { timestamp: Date.now(), data } });
        spinner.stop();
      } else {
        spinner.fail("Failed to fetch notes.");
      }
    } catch {
      spinner.stop();
      data = cache.notes?.data || null;
    }
  }

  const notes = data?.notes || [];

  if (notes.length === 0) {
    console.log(chalk.yellow("No notes found. Use 'ryuk notes add' to create notes.\n"));
    return;
  }

  const startNotesSearchPrompt = async () => {
    const searchPrompt = [
      {
        type: "autocomplete",
        name: "selectedNote",
        message: "Search Notes:",
        suggestOnly: false,
        searchText: "Searching...",
        emptyText: "No matching notes found.",
        pageSize: 10,
        default: initialQuery || "",
        source: async (_: unknown, input = "") => {
          const formattedInput = input.trim();
          const items = !formattedInput
            ? notes
            : fuzzy
                .filter(formattedInput, notes, {
                  extract: (n) => `${n.title} ${n.content.replace(/<[^>]*>?/gm, '')} ${n.language || ""}`,
                })
                .map((res) => res.original);

          return items.map((n) => {
            const plainContent = n.content.replace(/<[^>]*>?/gm, '').replace(/\n/g, " ").slice(0, 45);
            return {
              name: `${chalk.bold.white(n.title)} ${chalk.yellow(
                n.isSnippet ? `[${n.language || "snippet"}]` : "[note]"
              )} ${chalk.dim(`- ${plainContent}`)}`,
              value: n,
            };
          });
        },
      },
    ];

    const { selectedNote } = (await inquirer.prompt(
      searchPrompt as unknown as Parameters<typeof inquirer.prompt>[0]
    )) as {
      selectedNote: NoteItem;
    };

    if (!selectedNote) return;

    console.log("");
    console.log(chalk.bold.magenta("Title:   ") + chalk.bold.white(selectedNote.title));
    console.log(chalk.bold.magenta("Type:    ") + (selectedNote.isSnippet ? `Snippet (${selectedNote.language})` : "Note"));
    console.log(chalk.bold.magenta("Content: "));
    console.log(chalk.dim("----------------------------------------"));
    console.log(renderHtmlToCli(selectedNote.content));
    console.log(chalk.dim("----------------------------------------\n"));

    const { action } = await inquirer.prompt<{ action: string }>([
      {
        type: "list",
        name: "action",
        message: "Action:",
        choices: [
          { name: "Search Notes Again", value: "again" },
          { name: "Exit", value: "exit" },
        ],
      },
    ]);

    if (action === "again") {
      console.log("");
      await startNotesSearchPrompt();
    }
  };

  await startNotesSearchPrompt();
}

program
  .name("ryuk")
  .description("Official CLI tool to manage bookmarks & notes with live search")
  .version("1.0.0");

/**
 * Command: ryuk login
 */
async function isLocalhostRunning(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500);
    const res = await fetch("http://localhost:3000", { signal: controller.signal });
    clearTimeout(id);
    return res.ok || res.status === 404;
  } catch {
    return false;
  }
}

program
  .command("login")
  .description("Authenticate using your Ryuk API Key")
  .action(async () => {
    printHeader("Login");
    console.log(chalk.dim("Get your API Key from your Ryuk Settings page (/setting).\n"));

    try {
      const spinnerLocal = createSpinner("Checking environments...").start();
      const isLocal = await isLocalhostRunning();
      spinnerLocal.stop();

      let serverUrl = DEFAULT_HOST;

      if (isLocal) {
        const envAnswer = await inquirer.prompt<{ serverUrl: string }>([
          {
            type: "list",
            name: "serverUrl",
            message: "Local server detected! Which environment do you want to connect to?",
            choices: [
              { name: "Live Production (https://ryuk-vert.vercel.app)", value: "https://ryuk-vert.vercel.app" },
              { name: "Local Development (http://localhost:3000)", value: "http://localhost:3000" }
            ],
          }
        ]);
        serverUrl = envAnswer.serverUrl;
      }

      const answers = await inquirer.prompt<{ apiKey: string }>([
        {
          type: "password",
          name: "apiKey",
          message: "Ryuk API Key (ryuk_sk_...):",
          mask: "*",
          validate: (input: string) => {
            if (!input || !input.trim()) {
              return "API Key cannot be empty.";
            }
            return true;
          },
        }
      ]);

      const apiKey = answers.apiKey.trim();
      serverUrl = serverUrl.trim().replace(/\/$/, "");

      const spinner = createSpinner("Validating API key...").start();

      const valRes = await fetch(`${serverUrl}/api/bookmark/external`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!valRes.ok) {
        spinner.fail(chalk.red("Authentication failed"));
        const valData = (await valRes.json().catch(() => ({}))) as { error?: string };
        throw new Error(valData.error || "Invalid API Key or server unreachable.");
      }

      const valData = (await valRes.json()) as BookmarkListResponse;
      const userEmail = valData.user?.email || "user@ryuk.dev";
      const userName = valData.user?.name || "User";

      saveConfig({ apiKey, serverUrl, email: userEmail, name: userName });
      invalidateCache();

      spinner.succeed(chalk.green.bold(`Authenticated as ${chalk.cyan(userEmail)}`));
      console.log("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red("\n✖ Login failed:"), errorMsg, "\n");
      process.exit(1);
    }
  });

/**
 * Command: ryuk logout
 */
program
  .command("logout")
  .description("Sign out and clear stored credentials")
  .action(async () => {
    printHeader();
    clearConfig();
    console.log(chalk.green.bold("✔ Logged out successfully.\n"));
  });

/**
 * Command: ryuk status / ryuk whoami
 */
program
  .command("status")
  .alias("whoami")
  .description("Show current authentication status & user profile")
  .action(async () => {
    printHeader("Status");
    const config = getConfig();
    if (config.apiKey && config.email) {
      console.log(chalk.bold("Authenticated User: ") + chalk.cyan(config.email));
      if (config.name) console.log(chalk.bold("Display Name:       ") + config.name);
      console.log(chalk.bold("Server URL:         ") + (config.serverUrl || DEFAULT_HOST));
      console.log(chalk.bold("Config File:        ") + CONFIG_FILE + "\n");
    } else {
      console.log(chalk.yellow("You are currently not signed in."));
      console.log(chalk.dim("Run 'ryuk login' to authenticate.\n"));
    }
  });

/**
 * Global Top-level Command: ryuk search [query] / ryuk find [query]
 */
program
  .command("search [query]")
  .alias("find")
  .description("Search Bookmarks or Notes")
  .action(async (queryArg?: string) => {
    printHeader("Search");
    ensureAuth();

    const { target } = await inquirer.prompt<{ target: string }>([
      {
        type: "list",
        name: "target",
        message: "Search Category:",
        choices: [
          { name: "Bookmarks", value: "bookmarks" },
          { name: "Notes & Code Snippets", value: "notes" },
        ],
      },
    ]);

    console.log("");
    if (target === "bookmarks") {
      await handleBookmarkSearch(queryArg);
    } else if (target === "notes") {
      await handleNotesSearch(queryArg);
    }
  });

/**
 * Command Group: ryuk bookmark / ryuk bookmarks / ryuk bm
 */
const bookmarkCmd = program
  .command("bookmark")
  .alias("bookmarks")
  .alias("bm")
  .description("Manage and search bookmarks");

bookmarkCmd
  .command("add [url]")
  .description("Extract metadata & add a new bookmark")
  .action(async (urlArg?: string) => {
    try {
      const config = ensureAuth();
      let targetUrl = urlArg;

      if (!targetUrl) {
        printHeader("Add Bookmark");
        const answers = await inquirer.prompt<{ url: string }>([
          {
            type: "input",
            name: "url",
            message: "Webpage URL:",
            validate: (input: string) => (input.trim() ? true : "URL is required."),
          },
        ]);
        targetUrl = answers.url;
      } else {
        printHeader("Add Bookmark");
      }

      targetUrl = targetUrl.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`;
      }

      const host = config.serverUrl || DEFAULT_HOST;
      console.log(chalk.blue(`Fetching metadata for ${chalk.underline(targetUrl)}...`));

      let extractedTitle = "";
      let extractedDesc = "";
      let extractedFavicon = "";

      try {
        const metaRes = await fetch(
          `${host}/api/bookmark/metadata?url=${encodeURIComponent(targetUrl)}`
        );
        if (metaRes.ok) {
          const metaData = (await metaRes.json()) as MetadataResponse;
          extractedTitle = metaData.title || "";
          extractedDesc = metaData.description || "";
          extractedFavicon = metaData.favicon || "";
        }
      } catch {
        // Ignore metadata fetch error
      }

      let defaultTitle = extractedTitle;
      if (!defaultTitle) {
        try {
          defaultTitle = new URL(targetUrl).hostname;
        } catch {
          defaultTitle = "New Bookmark";
        }
      }

      const editAnswers = await inquirer.prompt<{ title: string }>([
        {
          type: "input",
          name: "title",
          message: "Bookmark Title:",
          default: defaultTitle,
          validate: (input: string) => (input.trim() ? true : "Title cannot be empty."),
        },
      ]);

      const finalTitle = editAnswers.title.trim();

      const saveRes = await fetch(`${host}/api/bookmark/external`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          title: finalTitle,
          url: targetUrl,
          description: extractedDesc,
          favicon: extractedFavicon,
        }),
      });

      if (!saveRes.ok) {
        const errJson = (await saveRes.json().catch(() => ({}))) as BookmarkSaveResponse;
        throw new Error(errJson.error || `Server responded with status ${saveRes.status}`);
      }

      const result = (await saveRes.json()) as BookmarkSaveResponse;
      invalidateCache();

      console.log(chalk.green.bold("\n✔ Bookmark saved successfully!"));
      console.log(chalk.dim(`  Title: ${result.bookmark?.title || finalTitle}`));
      console.log(chalk.dim(`  URL:   ${result.bookmark?.url || targetUrl}\n`));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red.bold("\n✖ Failed to add bookmark:"), chalk.red(errorMsg), "\n");
      process.exit(1);
    }
  });

bookmarkCmd
  .command("list")
  .alias("ls")
  .description("List all saved bookmarks")
  .action(async () => {
    try {
      const config = ensureAuth();
      printHeader("Bookmarks");
      const host = config.serverUrl || DEFAULT_HOST;

      const res = await fetch(`${host}/api/bookmark/external`, {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });

      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const data = (await res.json()) as BookmarkListResponse;

      console.log(chalk.bold.green(`Total Bookmarks: ${data.count || 0}\n`));

      if (!data.bookmarks || data.bookmarks.length === 0) {
        console.log(chalk.dim("  No bookmarks saved yet. Use 'ryuk add [url]' to save your first link!\n"));
        return;
      }

      data.bookmarks.forEach((item, index) => {
        const catName = item.category?.name ? ` [${item.category.name}]` : "";
        console.log(
          chalk.cyan(`${index + 1}. `) +
            chalk.bold.white(item.title) +
            chalk.yellow(catName)
        );
        console.log(chalk.dim(`   URL: ${item.url}`));
        console.log("");
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red.bold("\n✖ Failed to fetch bookmarks:"), chalk.red(errorMsg), "\n");
      process.exit(1);
    }
  });

bookmarkCmd
  .command("search [query]")
  .alias("find")
  .description("Search bookmarks")
  .action(async (queryArg?: string) => {
    printHeader("Bookmarks");
    await handleBookmarkSearch(queryArg);
  });

// Top-level aliases for bookmarks
program
  .command("add [url]")
  .description("Alias for 'ryuk bookmark add'")
  .action(async (urlArg?: string) => {
    const config = ensureAuth();
    let targetUrl = urlArg;
    if (!targetUrl) {
      printHeader("Add Bookmark");
      const answers = await inquirer.prompt<{ url: string }>([
        {
          type: "input",
          name: "url",
          message: "Webpage URL:",
          validate: (input: string) => (input.trim() ? true : "URL is required."),
        },
      ]);
      targetUrl = answers.url;
    } else {
      printHeader("Add Bookmark");
    }

    targetUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const host = config.serverUrl || DEFAULT_HOST;
    console.log(chalk.blue(`Fetching metadata for ${chalk.underline(targetUrl)}...`));

    let extractedTitle = "";
    let extractedDesc = "";
    let extractedFavicon = "";

    try {
      const metaRes = await fetch(
        `${host}/api/bookmark/metadata?url=${encodeURIComponent(targetUrl)}`
      );
      if (metaRes.ok) {
        const metaData = (await metaRes.json()) as MetadataResponse;
        extractedTitle = metaData.title || "";
        extractedDesc = metaData.description || "";
        extractedFavicon = metaData.favicon || "";
      }
    } catch {
      // Ignore metadata error
    }

    let defaultTitle = extractedTitle;
    if (!defaultTitle) {
      try {
        defaultTitle = new URL(targetUrl).hostname;
      } catch {
        defaultTitle = "New Bookmark";
      }
    }

    const editAnswers = await inquirer.prompt<{ title: string }>([
      {
        type: "input",
        name: "title",
        message: "Bookmark Title:",
        default: defaultTitle,
        validate: (input: string) => (input.trim() ? true : "Title cannot be empty."),
      },
    ]);

    const finalTitle = editAnswers.title.trim();

    const saveRes = await fetch(`${host}/api/bookmark/external`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        title: finalTitle,
        url: targetUrl,
        description: extractedDesc,
        favicon: extractedFavicon,
      }),
    });

    if (!saveRes.ok) {
      const errJson = (await saveRes.json().catch(() => ({}))) as BookmarkSaveResponse;
      throw new Error(errJson.error || `Server responded with status ${saveRes.status}`);
    }

    const result = (await saveRes.json()) as BookmarkSaveResponse;

    console.log(chalk.green.bold("\n✔ Bookmark saved successfully!"));
    console.log(chalk.dim(`  Title: ${result.bookmark?.title || finalTitle}`));
    console.log(chalk.dim(`  URL:   ${result.bookmark?.url || targetUrl}\n`));
  });

program
  .command("list")
  .alias("ls")
  .description("Alias for 'ryuk bookmark list'")
  .action(async () => {
    const config = ensureAuth();
    printHeader("Bookmarks");
    const host = config.serverUrl || DEFAULT_HOST;

    const res = await fetch(`${host}/api/bookmark/external`, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });

    if (!res.ok) {
      const errJson = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(errJson.error || `Server responded with status ${res.status}`);
    }

    const data = (await res.json()) as BookmarkListResponse;

    console.log(chalk.bold.green(`Total Bookmarks: ${data.count || 0}\n`));

    if (!data.bookmarks || data.bookmarks.length === 0) {
      console.log(chalk.dim("  No bookmarks saved yet. Use 'ryuk add [url]' to save your first link!\n"));
      return;
    }

    data.bookmarks.forEach((item, index) => {
      const catName = item.category?.name ? ` [${item.category.name}]` : "";
      console.log(
        chalk.cyan(`${index + 1}. `) +
          chalk.bold.white(item.title) +
          chalk.yellow(catName)
      );
      console.log(chalk.dim(`   URL: ${item.url}`));
      console.log("");
    });
  });

/**
 * Command Group: ryuk note / ryuk notes
 */
const notesCmd = program
  .command("notes")
  .alias("note")
  .description("Manage notes & code snippets");

notesCmd
  .command("add [title]")
  .description("Create a new note or code snippet")
  .action(async (titleArg?: string) => {
    try {
      const config = ensureAuth();
      printHeader("Add Note");
      const host = config.serverUrl || DEFAULT_HOST;

      const answers = await inquirer.prompt<{
        title: string;
        content: string;
        isSnippet: boolean;
        language: string;
      }>([
        {
          type: "input",
          name: "title",
          message: "Note Title:",
          default: titleArg || "Quick Note",
          validate: (input: string) => (input.trim() ? true : "Title is required."),
        },
        {
          type: "editor",
          name: "content",
          message: "Note Content / Snippet:",
          validate: (input: string) => (input.trim() ? true : "Content cannot be empty."),
        },
        {
          type: "confirm",
          name: "isSnippet",
          message: "Is this a code snippet?",
          default: false,
        },
        {
          type: "input",
          name: "language",
          message: "Language (js, py, bash, etc.):",
          default: "plaintext",
          when: (ans) => ans.isSnippet,
        },
      ]);

      const saveRes = await fetch(`${host}/api/note/external`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          title: answers.title.trim(),
          content: answers.content.trim(),
          isSnippet: answers.isSnippet,
          language: answers.language || "plaintext",
        }),
      });

      if (!saveRes.ok) {
        throw new Error(`Server responded with status ${saveRes.status}`);
      }

      const result = await saveRes.json();
      console.log(chalk.green.bold("\n✔ Note saved successfully!"));
      console.log(chalk.dim(`  ID:    ${result.note?.id}`));
      console.log(chalk.dim(`  Title: ${result.note?.title}\n`));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red.bold("\n✖ Failed to create note:"), chalk.red(errorMsg), "\n");
      process.exit(1);
    }
  });

notesCmd
  .command("list")
  .alias("ls")
  .description("List all saved notes & code snippets")
  .action(async () => {
    try {
      const config = ensureAuth();
      printHeader("Notes");
      const host = config.serverUrl || DEFAULT_HOST;

      const res = await fetch(`${host}/api/note/external`, {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = (await res.json()) as NoteListResponse;
      const notes = data.notes || [];

      console.log(chalk.bold.green(`Total Notes: ${data.count || notes.length}\n`));

      if (notes.length === 0) {
        console.log(chalk.dim("  No notes saved yet. Use 'ryuk notes add' to create your first note!\n"));
        return;
      }

      notes.forEach((item, index) => {
        const langBadge = item.isSnippet ? ` [${item.language || "code"}]` : "";
        console.log(
          chalk.cyan(`${index + 1}. `) +
            chalk.bold.white(item.title) +
            chalk.yellow(langBadge)
        );
        console.log(chalk.dim(`   Content preview: ${item.content.replace(/\n/g, " ").slice(0, 70)}...`));
        console.log("");
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red.bold("\n✖ Failed to fetch notes:"), chalk.red(errorMsg), "\n");
      process.exit(1);
    }
  });

notesCmd
  .command("search [query]")
  .alias("find")
  .description("Search notes")
  .action(async (queryArg?: string) => {
    printHeader("Notes");
    await handleNotesSearch(queryArg);
  });

/**
 * Command: ryuk uninstall
 */
program
  .command("uninstall")
  .description("Remove Ryuk CLI configuration and links")
  .action(async () => {
    printHeader("Uninstall");

    const answers = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to uninstall Ryuk CLI?",
        default: false,
      },
    ]);

    if (!answers.confirm) {
      console.log(chalk.dim("Uninstallation cancelled.\n"));
      return;
    }

    try {
      clearConfig();

      const localBinPath = path.join(os.homedir(), ".local", "bin", "ryuk");
      if (fs.existsSync(localBinPath)) {
        fs.unlinkSync(localBinPath);
      }

      console.log(chalk.green.bold("✔ Ryuk CLI uninstalled successfully.\n"));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red("✖ Failed during uninstallation:"), errorMsg, "\n");
      process.exit(1);
    }
  });

// Handle zero args: Show status & help
if (process.argv.length <= 2) {
  printHeader();
  const config = getConfig();
  if (!config.apiKey) {
    console.log(chalk.yellow("You are currently not signed in."));
    console.log(chalk.dim("Run 'ryuk login' to authenticate.\n"));
  }
}

program.parse(process.argv);
