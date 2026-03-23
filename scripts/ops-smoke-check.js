"use strict";

function resolveHealthUrl() {
  const explicit = process.argv[2] || process.env.BOT_HEALTHCHECK_URL;
  if (explicit) return explicit;

  const port = process.env.SERVER_PORT || process.env.PORT || "8080";
  return `http://127.0.0.1:${port}/health`;
}

async function main() {
  const url = resolveHealthUrl();
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (!payload || typeof payload !== "object") {
    throw new Error("Health payload is not a valid JSON object.");
  }

  if (!payload.fingerprint) {
    throw new Error("Health payload did not include fingerprint.");
  }

  if (!["ok", "degraded"].includes(payload.status)) {
    throw new Error(`Unexpected health status: ${payload.status}`);
  }

  console.log(`TON618 health ok: ${payload.status} | fingerprint=${payload.fingerprint}`);
}

main().catch((error) => {
  console.error(`Smoke check failed: ${error.message}`);
  process.exit(1);
});
