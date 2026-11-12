const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

function extractObject(name) {
  const marker = `const ${name} = `;
  const start = src.indexOf(marker) + marker.length;
  const end = src.indexOf("\n};", start) + 2;
  assert.ok(start >= marker.length && end > start, `${name} must be present`);
  return eval("(" + src.slice(start, end) + ")");
}

const GAMES = extractObject("GAMES");
const NEW_CONTENT = extractObject("NEW_CONTENT");
const spanishCards = Object.values(GAMES.spanish.categories).flat();
const bySlug = (cards, slug) => cards.find((card) => card.slug === slug);

const requested = [
  { word: "el lobo", sub: "the wolf", slug: "lobo" },
  { word: "el hipopótamo", sub: "the hippo", slug: "hipopotamo" },
  { word: "la jirafa", sub: "the giraffe", slug: "jirafa" },
  { word: "la cebra", sub: "the zebra", slug: "cebra" },
];

const moreAnimals = [
  { word: "el tigre", sub: "the tiger", slug: "tigre" },
  { word: "el panda", sub: "the panda", slug: "panda" },
  { word: "el koala", sub: "the koala", slug: "koala" },
  { word: "el canguro", sub: "the kangaroo", slug: "canguro" },
  { word: "el gorila", sub: "the gorilla", slug: "gorila" },
  { word: "el zorro", sub: "the fox", slug: "zorro" },
  { word: "el ciervo", sub: "the deer", slug: "ciervo" },
  { word: "la cabra", sub: "the goat", slug: "cabra" },
  { word: "el burro", sub: "the donkey", slug: "burro" },
  { word: "el ratón", sub: "the mouse", slug: "raton" },
  { word: "la ardilla", sub: "the squirrel", slug: "ardilla" },
  { word: "el mapache", sub: "the raccoon", slug: "mapache" },
  { word: "el erizo", sub: "the hedgehog", slug: "erizo" },
  { word: "el murciélago", sub: "the bat", slug: "murcielago" },
  { word: "el castor", sub: "the beaver", slug: "castor" },
  { word: "la nutria", sub: "the otter", slug: "nutria" },
  { word: "el perezoso", sub: "the sloth", slug: "perezoso" },
  { word: "el camello", sub: "the camel", slug: "camello" },
  { word: "la llama", sub: "the llama", slug: "llama" },
  { word: "el rinoceronte", sub: "the rhinoceros", slug: "rinoceronte" },
];

test("requested wolf, hippo, giraffe, and zebra cards exist exactly once", () => {
  const animals = GAMES.spanish.categories.Animals;
  for (const expected of requested) {
    const card = bySlug(animals, expected.slug);
    assert.ok(card, `missing Animals card: ${expected.slug}`);
    assert.equal(card.word, expected.word);
    assert.equal(card.sub, expected.sub);
    assert.equal(spanishCards.filter((item) => item.slug === expected.slug).length, 1);
  }
});

test("More Animals contains exactly the 20 additional translations", () => {
  const cards = GAMES.spanish.categories["More Animals"];
  assert.ok(cards, "More Animals category is missing");
  assert.equal(cards.length, 20);
  for (const expected of moreAnimals) {
    const card = bySlug(cards, expected.slug);
    assert.ok(card, `missing More Animals card: ${expected.slug}`);
    assert.equal(card.word, expected.word);
    assert.equal(card.sub, expected.sub);
    assert.equal(spanishCards.filter((item) => item.slug === expected.slug).length, 1);
  }
});

test("new animal content has 2026-11-07 NEW badges", () => {
  assert.equal(NEW_CONTENT.categories.spanish["More Animals"], "2026-11-07");
  for (const slug of ["lobo", "hipopotamo", "cebra"]) {
    assert.equal(NEW_CONTENT.words.spanish[slug], "2026-11-07");
  }
});

test("every requested and additional animal has built-in Spanish audio", () => {
  for (const { slug } of [...requested, ...moreAnimals]) {
    const file = path.join(ROOT, "audio", `es-${slug}.mp3`);
    assert.ok(fs.existsSync(file), `missing audio: es-${slug}.mp3`);
    assert.ok(fs.statSync(file).size > 1000, `audio is too small: es-${slug}.mp3`);
  }
});

test("Space and Winter categories are complete, stamped, and have audio", () => {
  const space = GAMES.spanish.categories.Space;
  const winter = GAMES.sight.categories.Winter;
  assert.ok(space, "Space category is missing");
  assert.ok(winter, "Winter category is missing");
  assert.equal(space.length, 8);
  assert.equal(winter.length, 12);
  assert.equal(NEW_CONTENT.categories.spanish.Space, "2026-11-12");
  assert.equal(NEW_CONTENT.categories.sight.Winter, "2026-11-12");
  for (const card of space) {
    assert.match(card.word, /^(el|la|los|las) /);
    const file = path.join(ROOT, "audio", `es-${card.slug}.mp3`);
    assert.ok(fs.existsSync(file), `missing audio: es-${card.slug}.mp3`);
    assert.ok(fs.statSync(file).size > 1000, `audio is too small: es-${card.slug}.mp3`);
  }
  for (const card of winter) {
    const file = path.join(ROOT, "audio", `en-${card.slug}.mp3`);
    assert.ok(fs.existsSync(file), `missing audio: en-${card.slug}.mp3`);
    assert.ok(fs.statSync(file).size > 1000, `audio is too small: en-${card.slug}.mp3`);
  }
});

test("HTML cache-busters are bumped for this content release", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.match(html, /styles\.css\?v=20261112/);
  assert.match(html, /app\.js\?v=20261112/);
});
