// Copies the page's script into page.js so the skill runs the same rules as the page.
// Usage: node sync-page.mjs <path to artifact/index.html>
import { readFileSync, writeFileSync } from "node:fs";
import { loadPage } from "./core.mjs";

const src = process.argv[2];
if (!src) { console.error("Usage: node sync-page.mjs <path to artifact/index.html>"); process.exit(1); }
const html = readFileSync(src, "utf8");
const a = html.indexOf("<script>\n(() => {"), b = html.lastIndexOf("</script>");
if (a < 0 || b < a) { console.error("Couldn't find the page's script in " + src); process.exit(1); }
const out = new URL("./page.js", import.meta.url);
const before = readFileSync(out, "utf8");
writeFileSync(out, "// Copied verbatim from artifact/index.html by sync-page.mjs. Do not edit; edit the page and re-sync.\n" + html.slice(a + 8, b));
try {
  await loadPage();
  console.log("page.js updated; every name the skill uses is still there.");
} catch (e) {
  writeFileSync(out, before);
  console.error("The new page doesn't load in the skill, so page.js was left as it was: " + e.message);
  process.exit(1);
}
