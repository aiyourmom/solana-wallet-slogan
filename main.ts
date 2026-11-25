import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SLOGAN =
  "I hold your SOL like it is my own rent money — and I check the address twice.";

function checkSlogan(text) {
  const problems = [];
  if (typeof text !== "string" || text.trim().length === 0)
    problems.push("slogan is empty");
  if (text.length < 1 || text.length > 140)
    problems.push("slogan must be 1-140 characters");
  if (text.trim().split(/\n/).length !== 1)
    problems.push("slogan must be a single line");
  if (text.trim().split(/\s+/).length > 20)
    problems.push("slogan must be at most 20 words");
  return problems;
}

function main() {
  const problems = checkSlogan(SLOGAN);
  if (problems.length > 0) {
    throw new Error("gate failed: " + problems.join("; "));
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = join(outDir, "entry.txt");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, SLOGAN, "utf8");
  // Read-back integrity check: the file on disk must be exactly the slogan.
  if (readFileSync(target, "utf8") !== SLOGAN) {
    throw new Error("read-back mismatch: entry.txt differs from slogan");
  }
  console.log(`saved ${SLOGAN.length} characters to ${target}`);
}

main();
