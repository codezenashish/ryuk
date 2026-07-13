interface BuildCommandResult {
  full: string;
  packageCount: number;
}

export function buildCommand(
  frameworkId: string,
  pmId: string,
  selectedFeatures: Set<string>,
  featureItems: Record<string, { pkg: string[]; dev?: boolean }>
): BuildCommandResult {
  const fw = frameworkId;
  const pm = pmId.toLowerCase();
  const hasTailwind = selectedFeatures.has("tailwind");
  const appName = "my-app";

  const creators: Record<string, Record<string, string>> = {
    "react-vite": {
      npm: `npm create vite@latest ${appName} -- --template react-ts`,
      yarn: `yarn create vite ${appName} --template react-ts`,
      pnpm: `pnpm create vite ${appName} --template react-ts`,
      bun: `bun create vite ${appName} --template react-ts`,
    },
    nextjs: {
      npm: `npx create-next-app@latest ${appName} --typescript --eslint${hasTailwind ? " --tailwind" : " --no-tailwind"}`,
      yarn: `yarn create next-app ${appName} --typescript --eslint${hasTailwind ? " --tailwind" : " --no-tailwind"}`,
      pnpm: `pnpm create next-app ${appName} --typescript --eslint${hasTailwind ? " --tailwind" : " --no-tailwind"}`,
      bun: `bunx create-next-app ${appName} --typescript --eslint${hasTailwind ? " --tailwind" : " --no-tailwind"}`,
    },
    vue: {
      npm: `npm create vue@latest ${appName}`,
      yarn: `yarn create vue ${appName}`,
      pnpm: `pnpm create vue ${appName}`,
      bun: `bun create vue ${appName}`,
    },
    svelte: {
      npm: `npx sv create ${appName}`,
      yarn: `yarn dlx sv create ${appName}`,
      pnpm: `pnpm dlx sv create ${appName}`,
      bun: `bunx sv create ${appName}`,
    },
  };

  const normalPkgs: string[] = [];
  const devPkgs: string[] = [];

  selectedFeatures.forEach((id) => {
    const item = featureItems[id];
    if (!item) return;
    if (fw === "nextjs" && id === "tailwind") return; // Handled by Next.js --tailwind flag
    if (item.dev) {
      devPkgs.push(...item.pkg);
    } else {
      normalPkgs.push(...item.pkg);
    }
  });

  const addCmd = (pkgs: string[], isDev: boolean) => {
    if (!pkgs.length) return null;
    const list = pkgs.join(" ");
    if (pm === "npm") return isDev ? `npm install -D ${list}` : `npm install ${list}`;
    if (pm === "yarn") return isDev ? `yarn add -D ${list}` : `yarn add ${list}`;
    if (pm === "pnpm") return isDev ? `pnpm add -D ${list}` : `pnpm add ${list}`;
    if (pm === "bun") return isDev ? `bun add -d ${list}` : `bun add ${list}`;
    return null;
  };

  const installParts = [
    addCmd(normalPkgs, false),
    addCmd(devPkgs, true),
  ].filter(Boolean);

  let full = "";
  if (fw === "none") {
    if (installParts.length) {
      full = installParts.join(" && ");
    } else {
      if (pm === "npm") full = "npm init -y";
      if (pm === "yarn") full = "yarn init -y";
      if (pm === "pnpm") full = "pnpm init";
      if (pm === "bun") full = "bun init -y";
    }
  } else {
    const createCmd = creators[fw]?.[pm] || creators["react-vite"][pm];
    full = createCmd;
    if (installParts.length) {
      full += ` && cd ${appName} && ` + installParts.join(" && ");
    }
  }

  return {
    full,
    packageCount: normalPkgs.length + devPkgs.length,
  };
}
