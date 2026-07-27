import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const testFile = fileURLToPath(new URL("../tests/rendered-html.test.mjs", import.meta.url));
const customCanonicalUrl = "https://ag-enterprises-painting.test";
const vercelProjectUrl = "https://ag-enterprises-painting-bitblur.vercel.app";
const vercelDeploymentUrl = "ag-enterprises-painting-build-123-bitblur.vercel.app";

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

async function verifyDeployment({
  label,
  mode,
  siteUrl,
  projectProductionUrl,
  deploymentUrl,
  indexingEnabled,
  expectedCanonicalUrl,
  expectedIndexable,
  urlSource,
}) {
  const env = {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    SEO_INDEXING_ENABLED: indexingEnabled ? "true" : "false",
    VERCEL: "1",
    VERCEL_ENV: mode,
  };

  delete env.SITE_URL;
  delete env.VERCEL_PROJECT_PRODUCTION_URL;
  delete env.VERCEL_URL;

  if (siteUrl) env.SITE_URL = siteUrl;
  if (projectProductionUrl) env.VERCEL_PROJECT_PRODUCTION_URL = projectProductionUrl;
  if (deploymentUrl) env.VERCEL_URL = deploymentUrl;

  console.log(`\nBuilding native Next.js for ${label}...`);
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
        TEST_CANONICAL_URL: expectedCanonicalUrl,
        TEST_INDEXABLE: expectedIndexable ? "true" : "false",
        TEST_URL_SOURCE: urlSource,
      },
    });
  } finally {
    await stopServer(server);
  }
}

await verifyDeployment({
  label: "custom-domain production",
  mode: "production",
  siteUrl: customCanonicalUrl,
  projectProductionUrl: new URL(vercelProjectUrl).hostname,
  deploymentUrl: vercelDeploymentUrl,
  indexingEnabled: true,
  expectedCanonicalUrl: customCanonicalUrl,
  expectedIndexable: true,
  urlSource: "custom",
});

await verifyDeployment({
  label: "temporary Vercel-domain production",
  mode: "production",
  projectProductionUrl: new URL(vercelProjectUrl).hostname,
  deploymentUrl: vercelDeploymentUrl,
  indexingEnabled: false,
  expectedCanonicalUrl: vercelProjectUrl,
  expectedIndexable: false,
  urlSource: "vercel",
});

await verifyDeployment({
  label: "Vercel preview",
  mode: "preview",
  deploymentUrl: "ag-enterprises-painting-preview-456-bitblur.vercel.app",
  indexingEnabled: false,
  expectedCanonicalUrl: "https://ag-enterprises-painting-preview-456-bitblur.vercel.app",
  expectedIndexable: false,
  urlSource: "vercel",
});

console.log("\nCustom-domain, temporary production, and preview behavior verified.");
