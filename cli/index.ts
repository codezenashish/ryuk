#!/usr/bin/env tsx

import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import os from "os";

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

interface BookmarkSaveResponse {
  bookmark?: {
    id: string;
    title: string;
    url: string;
    description?: string;
    favicon?: string;
  };
  user?: {
    name: string;
    email: string;
  };
  error?: string;
}

interface BookmarkListResponse {
  count: number;
  user?: {
    name: string;
    email: string;
  };
  bookmarks: Array<{
    id: string;
    title: string;
    url: string;
    description?: string | null;
    category?: { name: string } | null;
    createdAt: string;
  }>;
  error?: string;
}

const CONFIG_FILE = path.join(os.homedir(), ".ryukrc");
const DEFAULT_HOST = process.env.RYUK_SERVER_URL || "http://localhost:3000";

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
    console.error(chalk.red("✖ Failed to save configuration to ~/.ryukrc:"), errorMsg);
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

function printHeader(): void {
  const config = getConfig();
  const userDisplay = config.email ? chalk.cyan(config.email) : chalk.dim("Not signed in");
  console.log("");
  console.log(chalk.bold("ryuk CLI ") + chalk.dim("1.0.0"));
  console.log(`  ${chalk.cyan("▲ ryuk")}        ${userDisplay}\n`);
}

program
  .name("ryuk")
  .description("Official CLI tool to manage bookmarks & save web resources to Ryuk")
  .version("1.0.0");

/**
 * Command: ryuk login
 */
program
  .command("login")
  .description("Authenticate using your Ryuk API Key")
  .action(async () => {
    printHeader();
    console.log(chalk.dim("Get your API Key from your Ryuk Settings page (/setting).\n"));

    try {
      const answers = await inquirer.prompt<{ apiKey: string; serverUrl: string }>([
        {
          type: "password",
          name: "apiKey",
          message: "Enter your Ryuk API Key (ryuk_sk_...):",
          mask: "*",
          validate: (input: string) => {
            if (!input || !input.trim()) {
              return "API Key cannot be empty.";
            }
            if (!input.startsWith("ryuk_sk_")) {
              return 'Warning: Ryuk API Key usually starts with "ryuk_sk_". Please check your key.';
            }
            return true;
          },
        },
        {
          type: "input",
          name: "serverUrl",
          message: "Ryuk Server URL:",
          default: DEFAULT_HOST,
        },
      ]);

      const apiKey = answers.apiKey.trim();
      const serverUrl = answers.serverUrl.trim().replace(/\/$/, "");

      console.log(chalk.blue("🔍 Validating API Key with Ryuk server..."));

      const valRes = await fetch(`${serverUrl}/api/bookmark/external`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!valRes.ok) {
        const valData = (await valRes.json().catch(() => ({}))) as { error?: string };
        throw new Error(valData.error || "Invalid API Key or server unreachable.");
      }

      const valData = (await valRes.json()) as BookmarkListResponse;
      const userEmail = valData.user?.email || "user@ryuk.dev";
      const userName = valData.user?.name || "User";

      saveConfig({ apiKey, serverUrl, email: userEmail, name: userName });

      console.log(
        chalk.green.bold(`\n✔ Successfully authenticated as ${chalk.cyan(userEmail)}!\n`)
      );
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
    printHeader();
    const config = getConfig();
    if (config.apiKey && config.email) {
      console.log(chalk.bold("Authenticated User: ") + chalk.cyan(config.email));
      if (config.name) console.log(chalk.bold("Display Name:       ") + config.name);
      console.log(chalk.bold("Server URL:         ") + (config.serverUrl || DEFAULT_HOST));
      console.log(chalk.bold("Config File:        ") + CONFIG_FILE + "\n");
    } else {
      console.log(chalk.yellow("Welcome to the Ryuk CLI. You are currently not signed in."));
      console.log(chalk.dim("Run 'ryuk login' to authenticate.\n"));
    }
  });

/**
 * Command: ryuk add [url]
 */
program
  .command("add [url]")
  .description("Extract metadata & add a new bookmark to Ryuk")
  .action(async (urlArg?: string) => {
    try {
      const config = getConfig();

      if (!config.apiKey) {
        printHeader();
        console.log(chalk.yellow("Welcome to the Ryuk CLI. You are currently not signed in."));
        console.log(chalk.dim("Run 'ryuk login' to authenticate.\n"));
        process.exit(1);
      }

      let targetUrl = urlArg;

      if (!targetUrl) {
        printHeader();
        const answers = await inquirer.prompt<{ url: string }>([
          {
            type: "input",
            name: "url",
            message: "Enter the webpage URL to bookmark:",
            validate: (input: string) => (input.trim() ? true : "URL is required."),
          },
        ]);
        targetUrl = answers.url;
      } else {
        printHeader();
      }

      targetUrl = targetUrl.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`;
      }

      const host = config.serverUrl || DEFAULT_HOST;

      console.log(chalk.blue(`🔍 Fetching metadata for ${chalk.underline(targetUrl)}...`));

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
        console.log(chalk.yellow("⚠️  Could not auto-fetch metadata. You can enter title manually."));
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

      console.log(chalk.blue("💾 Saving bookmark to your Ryuk account..."));

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

      console.log(chalk.green.bold("\n✨ Bookmark successfully saved to Ryuk!"));
      console.log(chalk.dim(`   Title: ${result.bookmark?.title || finalTitle}`));
      console.log(chalk.dim(`   URL:   ${result.bookmark?.url || targetUrl}\n`));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red.bold("\n✖ Failed to add bookmark:"), chalk.red(errorMsg), "\n");
      process.exit(1);
    }
  });

/**
 * Command: ryuk list / ryuk ls
 */
program
  .command("list")
  .alias("ls")
  .description("List all saved bookmarks in your Ryuk account")
  .action(async () => {
    try {
      const config = getConfig();

      if (!config.apiKey) {
        printHeader();
        console.log(chalk.yellow("Welcome to the Ryuk CLI. You are currently not signed in."));
        console.log(chalk.dim("Run 'ryuk login' to authenticate.\n"));
        process.exit(1);
      }

      printHeader();
      const host = config.serverUrl || DEFAULT_HOST;

      console.log(chalk.blue("📚 Fetching your Ryuk bookmarks..."));

      const res = await fetch(`${host}/api/bookmark/external`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      });

      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const data = (await res.json()) as BookmarkListResponse;

      console.log(chalk.bold.green(`\n📌 Total Bookmarks: ${data.count || 0}\n`));

      if (!data.bookmarks || data.bookmarks.length === 0) {
        console.log(chalk.dim("   No bookmarks saved yet. Use 'ryuk add [url]' to save your first link!\n"));
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

/**
 * Command: ryuk uninstall
 */
program
  .command("uninstall")
  .description("Remove Ryuk CLI configuration and links from your system")
  .action(async () => {
    printHeader();

    const answers = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to uninstall Ryuk CLI and delete saved credentials?",
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

      console.log(chalk.green.bold("✔ Ryuk CLI configuration and binaries uninstalled successfully.\n"));
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
    console.log(chalk.yellow("Welcome to the Ryuk CLI. You are currently not signed in."));
    console.log(chalk.dim("Run 'ryuk login' to authenticate.\n"));
  }
}

program.parse(process.argv);
