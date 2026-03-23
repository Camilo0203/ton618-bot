"use strict";

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { validateEnv } = require("../src/utils/env");

function getArg(prefix) {
  return process.argv.find((argument) => argument.startsWith(prefix)) || null;
}

const fileArg = getArg("--file=");
const filePath = fileArg ? path.resolve(process.cwd(), fileArg.slice("--file=".length)) : null;

let env = { ...process.env };
if (filePath) {
  const parsed = dotenv.parse(fs.readFileSync(filePath));
  env = { ...env, ...parsed };
}

const result = validateEnv(env);

for (const warning of result.warnings) {
  console.warn(`WARN: ${warning}`);
}

if (result.errors.length) {
  for (const error of result.errors) {
    console.error(`ERROR: ${error}`);
  }
  process.exit(1);
}

console.log(`TON618 bot env check passed${filePath ? ` from ${path.basename(filePath)}` : ""}.`);
