// Embeds guides/*.json and validation/*.json into artifact/index.html as <script type="application/json" id="bundled">.
// Usage, from the repository root: node artifact/bundle.mjs .
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
const load = (dir) => Object.fromEntries(readdirSync(join(root, dir)).filter((f) => f.endsWith(".json")).sort()
  .map((f) => [f.slice(0, -5), JSON.parse(readFileSync(join(root, dir, f), "utf8"))]));
const data = { guides: load("guides"), validation: load("validation") };
const json = JSON.stringify(data).replace(/</g, "\\u003c");
const file = join(root, "artifact", "index.html");
let html = readFileSync(file, "utf8");
const block = `<script type="application/json" id="bundled">${json}</script>\n`;
const old = /<script type="application\/json" id="bundled">[\s\S]*?<\/script>\n/;
if (old.test(html)) html = html.replace(old, () => block);
else {
  const at = html.indexOf("<script>\n(() => {");
  if (at < 0) throw new Error("page script not found");
  html = html.slice(0, at) + block + html.slice(at);
}
writeFileSync(file, html);
console.log(`bundled ${Object.keys(data.guides).length} guides, ${Object.keys(data.validation).length} validation docs, ${json.length} chars`);
