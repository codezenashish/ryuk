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
  error?: string;
}

const CONFIG_FILE = path.join(os.homedir(), ".ryukrc");
const DEFAULT_HOST = process.env.RYUK_SERVER_URL || "http://localhost:3000";

/**
 * Reads local configuration from ~/.ryukrc
 */
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

/**
 * Saves updated configuration to ~/.ryukrc
 */
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

program
  .name("ryuk")
  .description("TypeScript CLI tool to manage bookmarks & save web resources to Ryuk")
  .version("1.0.0");

/**
 * Command: ryuk login
 */
program
  .command("login")
  .description("Authenticate using your Ryuk API Key")
  .action(async () => {
    console.log(chalk.bold.cyan("\n🚀 Ryuk CLI Authentication"));
    console.log(chalk.dim("Get your API Key from your Ryuk Settings page.\n"));

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

      saveConfig({ apiKey, serverUrl });

      console.log(
        chalk.green.bold("\n✔ Successfully authenticated and saved credentials to ~/.ryukrc!\n")
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red("\n✖ Login process interrupted or failed:"), errorMsg);
      process.exit(1);
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
        console.log(chalk.yellow("\n⚠️  No API Key found. Please run 'ryuk login' first."));
        process.exit(1);
      }

      let targetUrl = urlArg;

      if (!targetUrl) {
        const answers = await inquirer.prompt<{ url: string }>([
          {
            type: "input",
            name: "url",
            message: "Enter the webpage URL to bookmark:",
            validate: (input: string) => {
              if (!input || !input.trim()) {
                return "URL is required.";
              }
              return true;
            },
          },
        ]);
        targetUrl = answers.url;
      }

      targetUrl = targetUrl.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`;
      }

      const host = config.serverUrl || DEFAULT_HOST;

      console.log(chalk.blue(`\n🔍 Fetching metadata for ${chalk.underline(targetUrl)}...`));

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
      console.error(chalk.red.bold("\n✖ Failed to add bookmark:"), chalk.red(errorMsg));
      process.exit(1);
    }
  });

program.parse(process.argv);
