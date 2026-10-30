// Builds the local test copy: the page with the stand-ins inlined before its script.
import { readFileSync, writeFileSync } from "node:fs";
const at_ = (p) => new URL(p, import.meta.url);
const s = readFileSync(at_("stub.js"), "utf8") + "\n" + readFileSync(at_("v2-extra.js"), "utf8");
new Function(s);
const page = readFileSync(at_("../index.html"), "utf8");
const at = page.indexOf("<script>\n(() => {");
writeFileSync(at_("test-page.html"), page.slice(0, at) + "<script>" + s + "</script>" + page.slice(at));
console.log("built");
