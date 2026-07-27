import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const testFile = fileURLToPath(new URL("../tests/rendered-html.test.mjs", import.meta.url));
const canonicalUrl = "https://ag-enterprises-painting.test";

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: "inherit",
      ...options,
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(
        `${command} ${args.join(" ")} exited with ${signal ? `signal ${signal}` : `code ${code}`}`,
      ));
    });
  });
}

async function findOpenPort() {
  const server = createServer();
  server.unref();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : null;
  server.close();
  await once(server, "close");

  if (!port) {
    throw new Error("Could not reserve a local test port.");
  }

  return port;
}

async function waitForServer(url, child) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(`Next.js server exited early (${child.exitCode ?? child.signalCode}).`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Timed out waiting for ${url}.`);
}

async function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;

  const gracefulExit = once(child, "exit");
  child.kill("SIGTERM");
  await Promise.race([
    gracefulExit,
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);

  if (child.exitCode === null && child.signalCode === null) {
    const forcedExit = once(child, "exit");
    child.kill("SIGKILL");
    await forcedExit;
  }
}

async function verifyMode(mode, indexingEnabled) {
  const env = {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    SITE_URL: canonicalUrl,
    SEO_INDEXING_ENABLED: indexingEnabled ? "true" : "false",
    VERCEL: "1",
    VERCEL_ENV: mode,
  };

  console.log(`\nBuilding native Next.js in ${mode} mode...`);
  await run(process.execPath, [nextBin, "build"], { env });

  const port = await findOpenPort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: projectRoot,
    env,
    stdio: "inherit",
  });

  try {
    await waitForServer(baseUrl, server);
    await run(process.execPath, ["--test", testFile], {
      env: {
        ...env,
        TEST_BASE_URL: baseUrl,
        TEST_CANONICAL_URL: canonicalUrl,
        TEST_MODE: mode,
      },
    });
  } finally {
    await stopServer(server);
  }
}

await verifyMode("production", true);
await verifyMode("preview", false);
console.log("\nProduction and preview deployment behavior verified.");
