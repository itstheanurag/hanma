import { spawn } from "node:child_process";
import fs from "fs-extra";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { ROOT_DIR, PUBLIC_DIR } from "../utils";

const TEST_OUTPUT_DIR = path.join(ROOT_DIR, "examples");
const CLI_PATH = path.join(ROOT_DIR, "apps/cli/src/index.ts");

const TEST_PORT = 3000;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

const testCases = [
  {
    name: "express-drizzle-jwt",
    framework: "express",
    template: "express",
    db: "drizzle-postgres",
    auth: "jwt-auth",
    features: "logging-winston",
  },
  {
    name: "hono-prisma-betterauth",
    framework: "hono",
    template: "hono",
    db: "prisma-postgres",
    auth: "better-auth",
    features: "cache-redis",
  },
  {
    name: "elysia-mongodb",
    framework: "elysia",
    template: "elysia",
    db: "mongodb",
  },
  {
    name: "express-graphql-passport",
    framework: "express",
    template: "express-graphql",
    db: "none",
    auth: "passport-local",
  },
  {
    name: "hono-biome",
    framework: "hono",
    template: "hono",
    db: "none",
    auth: "none",
    features: "tooling-biome",
  },
];

async function serveRegistry() {
  const server = http.createServer((req, res) => {
    console.log(`[Server] Request: ${req.url}`);
    let filePath = path.join(PUBLIC_DIR, req.url || "");
    if (fs.statSync(filePath, { throwIfNoEntry: false })?.isDirectory()) {
      filePath = path.join(filePath, "index.json");
    }

    if (fs.existsSync(filePath)) {
      console.log(`[Server] Serving: ${filePath}`);
      res.writeHead(200, { "Content-Type": "application/json" });
      fs.createReadStream(filePath).pipe(res);
    } else {
      console.log(`[Server] Not Found: ${filePath}`);
      res.writeHead(404);
      res.end();
    }
  });

  return new Promise<http.Server>((resolve) => {
    server.listen(TEST_PORT, "127.0.0.1", () => {
      console.log(`Test registry server running at ${BASE_URL}`);
      resolve(server);
    });
  });
}

async function runTest(testCase: (typeof testCases)[0]) {
  console.log(`\nTesting: ${testCase.name}`);
  const projectPath = path.join(TEST_OUTPUT_DIR, testCase.name);

  if (fs.existsSync(projectPath)) {
    fs.removeSync(projectPath);
  }

  const args = [
    CLI_PATH,
    "create",
    testCase.name,
    "--skip-install",
    "--pm",
    "npm",
    "--framework",
    testCase.framework,
    "--template",
    testCase.template,
    "--db",
    testCase.db,
    "--auth",
    testCase.auth || "none",
  ];

  if (testCase.features) {
    args.push("--features", testCase.features);
  }

  args.push(
    "--mailer",
    "none",
    "--upload",
    "none",
    "--cache",
    "none",
    "--tooling",
    "none",
  );

  return new Promise<boolean>((resolve) => {
    const child = spawn("npx", ["tsx", ...args], {
      cwd: TEST_OUTPUT_DIR,
      env: {
        ...process.env,
        HANMA_BASE_URL: BASE_URL,
        HANMA_NO_CACHE: "true",
      },
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`FAIL: ${testCase.name}: CLI exited with code ${code}`);
        return resolve(false);
      }

      try {
        // Verifications
        const hanmaJsonPath = path.join(projectPath, "hanma.json");
        const packageJsonPath = path.join(projectPath, "package.json");
        const srcPath = path.join(projectPath, "src");

        if (!fs.existsSync(projectPath))
          throw new Error("Project directory not created");
        if (!fs.existsSync(hanmaJsonPath))
          throw new Error("hanma.json not created");
        if (!fs.existsSync(packageJsonPath))
          throw new Error("package.json not created");

        if (
          testCase.framework !== "hono" ||
          !testCase.name.includes("vercel")
        ) {
          if (
            !fs.existsSync(srcPath) &&
            !fs.existsSync(path.join(projectPath, "api"))
          ) {
            throw new Error("Source directory (src or api) not created");
          }
        }

        const hanmaJson = fs.readJSONSync(hanmaJsonPath);
        if (testCase.framework && hanmaJson.framework !== testCase.framework) {
          throw new Error(
            `Framework mismatch in hanma.json: expected ${testCase.framework}, got ${hanmaJson.framework}`,
          );
        }

        console.log(`PASS: ${testCase.name}`);
        resolve(true);
      } catch (error: any) {
        console.error(`FAIL: ${testCase.name}: ${error.message}`);
        resolve(false);
      }
    });
  });
}

async function main() {
  await fs.ensureDir(TEST_OUTPUT_DIR);
  const server = await serveRegistry();

  let passedCount = 0;
  for (const testCase of testCases) {
    const success = await runTest(testCase);
    if (success) passedCount++;
  }

  console.log(`\nTests finished: ${passedCount}/${testCases.length} passed`);

  server.close();

  if (passedCount === testCases.length) {
    console.log("All CLI tests passed!");
    // fs.removeSync(TEST_OUTPUT_DIR);
    process.exit(0);
  } else {
    console.log("Some tests failed.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
