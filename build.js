#!/usr/bin/env node
/**
 * build.js — assembles index.html and script.js from /content/*.
 *
 * Edit files in /content/, then run `node build.js`. Never hand-edit the
 * text inside a <!--BUILD:x--> ... <!--/BUILD:x--> (or /* BUILD:x *\/) region
 * directly in index.html / script.js — it gets overwritten on next build.
 * Everything outside those markers (structure, nav, CSS classes, terminal
 * frame, animation logic) is still hand-edited normally.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const CONTENT = path.join(ROOT, "content");

/* ---------------- tiny parsers (no deps) ---------------- */

// "key: value" per line -> { key: value }. Splits on first ':' only.
function parseKV(text) {
  const out = {};
  text.split("\n").forEach((line) => {
    if (!line.trim() || line.trim().startsWith("#")) return;
    const i = line.indexOf(":");
    if (i === -1) return;
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return out;
}

// Minimal RFC4180-ish CSV parser: handles quoted fields, commas/quotes inside quotes.
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const src = lines.join("\n");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const filtered = rows.filter((r) => r.some((f) => f.trim() !== ""));
  const header = filtered.shift();
  return filtered.map((r) => {
    const obj = {};
    // Note: values are NOT trimmed — a leading/trailing space (e.g. suffix
    // " Cr") can be intentional and significant in the rendered output.
    header.forEach((h, idx) => { obj[h.trim()] = r[idx] || ""; });
    return obj;
  });
}

// Custom experience format: "## years" / "### title" / "at:" / "sub:" / "- bullet" lines.
function parseExperience(text) {
  const jobs = [];
  let cur = null;
  text.split("\n").forEach((line) => {
    if (line.startsWith("## ")) {
      cur = { years: line.slice(3).trim(), title: "", at: "", sub: "", bullets: [] };
      jobs.push(cur);
    } else if (line.startsWith("### ") && cur) {
      cur.title = line.slice(4).trim();
    } else if (line.startsWith("at:") && cur) {
      cur.at = line.slice(3).trim();
    } else if (line.startsWith("sub:") && cur) {
      cur.sub = line.slice(4).trim();
    } else if (line.startsWith("- ") && cur) {
      cur.bullets.push(line.slice(2).trim());
    }
  });
  return jobs;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function attrEsc(s) {
  return esc(s).replace(/"/g, "&quot;");
}

// Replace {{token.path}} using a flat lookup map. Two passes so a token's
// own value (e.g. global.open_to_lower) can itself reference another token.
function applyTokens(str, tokens) {
  const sub = (s) => s.replace(/\{\{([\w.]+)\}\}/g, (_, key) => (key in tokens ? tokens[key] : ""));
  return sub(sub(str));
}

/* ---------------- load content ---------------- */

const read = (f) => fs.readFileSync(path.join(CONTENT, f), "utf8");

const global_ = parseKV(read("global.md"));
global_.open_to_lower = global_.open_to.toLowerCase();

const tokens = {};
Object.keys(global_).forEach((k) => { tokens["global." + k] = global_[k]; });

const hero = parseKV(applyTokens(read("hero.md"), tokens));
const about = parseKV(applyTokens(read("about.md"), tokens));
const terminalLines = applyTokens(read("terminal.md"), tokens)
  .split("\n").filter((l) => l.trim());
const highlights = parseCSV(read("highlights.csv"));
const projects = parseCSV(read("projects.csv"));
const skills = parseCSV(read("skills.csv"));
const education = parseCSV(read("education.csv"));
const experience = parseExperience(read("experience.md"));

/* ---------------- render each block to markup ---------------- */

const kpiHtml = highlights.map((k) => `      <div class="kpi">
        <div class="kpi__num" data-prefix="${esc(k.prefix)}" data-num="${esc(k.num)}" data-suffix="${esc(k.suffix)}">0</div>
        <div class="kpi__label">${esc(k.label)}</div>
      </div>`).join("\n");

const experienceHtml = experience.map((job) => `      <li class="commit">
        <div class="commit__meta"><span class="commit__hash">${esc(job.years)}</span></div>
        <div class="commit__body">
          <div class="commit__title">${esc(job.title)} <span class="at">at</span> ${esc(job.at)}</div>
          <div class="commit__sub">${esc(job.sub)}</div>
          <ul class="difflist">
${job.bullets.map((b) => `            <li><span class="plus">+</span> ${esc(b)}</li>`).join("\n")}
          </ul>
        </div>
      </li>`).join("\n\n") + "\n";

const projectsHtml = projects.map((p) => `      <article class="card">
        <div class="card__title">${esc(p.title)}</div>
        <p class="card__desc">${esc(p.desc)}</p>
        <p class="card__impact">${esc(p.impact)}</p>
        <div class="tagrow">${p.tags.split("|").map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      </article>`).join("\n");

const skillsHtml = skills.map((s, i) => {
  const branch = i === skills.length - 1 ? "└──" : "├──";
  return `      <div class="tree__row"><span class="tree__branch">${branch}</span><span class="tree__name">${esc(s.name)}</span><span class="tree__desc">${esc(s.desc)}</span></div>`;
}).join("\n");

const educationHtml = education.map((e) => `        <div class="field"><dt>${esc(e.years)}</dt><dd>${esc(e.degree)}</dd></div>`).join("\n");

const aboutTagsHtml = about.tags.split(",").map((t) => `<span>${esc(t.trim())}</span>`).join("");

const contactHtml = `        <div class="field"><dt>name</dt><dd>${esc(global_.name)}</dd></div>
        <div class="field"><dt>email</dt><dd><a href="mailto:${esc(global_.email)}">${esc(global_.email)}</a></dd></div>
        <div class="field"><dt>phone</dt><dd><a href="tel:${esc(global_.phone.replace(/\s+/g, ""))}">${esc(global_.phone)}</a></dd></div>
        <div class="field"><dt>location</dt><dd>${esc(global_.location)}</dd></div>
        <div class="field"><dt>linkedin</dt><dd><a href="https://linkedin.com/in/${esc(global_.linkedin_handle)}" target="_blank" rel="noopener">linkedin.com/in/${esc(global_.linkedin_handle)}</a></dd></div>
        <div class="field"><dt>status</dt><dd><span class="dot-live"></span> ${esc(global_.status)} &middot; open to ${esc(global_.open_to)}</dd></div>`;

/* ---------------- splice into files between BUILD markers ---------------- */

function spliceBlock(src, name, replacement) {
  const re = new RegExp(`(<!--BUILD:${name}-->)([\\s\\S]*?)(<!--/BUILD:${name}-->)`);
  if (!re.test(src)) throw new Error(`Marker BUILD:${name} not found`);
  return src.replace(re, `$1\n${replacement}\n$3`);
}

function spliceJs(src, name, replacement) {
  const re = new RegExp(`(/\\* BUILD:${name} \\*/)([\\s\\S]*?)(/\\* /BUILD:${name} \\*/)`);
  if (!re.test(src)) throw new Error(`Marker BUILD:${name} not found in script.js`);
  return src.replace(re, `$1\n${replacement}\n  $3`);
}

let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
html = spliceBlock(html, "title", `<title>${esc(global_.name)} \u2014 ${esc(global_.role)}</title>`);
html = spliceBlock(html, "meta-description", `<meta name="description" content="${attrEsc(global_.meta_description)}">`);
html = spliceBlock(html, "hero-headline", esc(hero.headline));
html = spliceBlock(html, "hero-sub", esc(hero.sub));
html = spliceBlock(html, "about-lede", esc(about.lede));
html = spliceBlock(html, "about-body", esc(about.body));
html = spliceBlock(html, "about-tags", aboutTagsHtml);
html = spliceBlock(html, "highlights", kpiHtml);
html = spliceBlock(html, "experience", experienceHtml);
html = spliceBlock(html, "projects", projectsHtml);
html = spliceBlock(html, "skills", skillsHtml);
html = spliceBlock(html, "education", educationHtml);
html = spliceBlock(html, "contact-fields", contactHtml);
fs.writeFileSync(path.join(ROOT, "index.html"), html);

const bootLinesJs = terminalLines.map((line) => {
  const i = line.indexOf(":");
  const kind = line.trim() === "gap" ? "gap" : line.slice(0, i).trim();
  if (kind === "gap") return `    { type: "gap" },`;
  const text = line.slice(i + 1).trim();
  return `    { type: "${kind}", text: "${text.replace(/"/g, '\\"')}" },`;
}).join("\n");

let js = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");
js = spliceJs(js, "bootlines", `  var bootLines = [\n${bootLinesJs}\n  ];`);
fs.writeFileSync(path.join(ROOT, "script.js"), js);

console.log("Built index.html and script.js from /content.");
