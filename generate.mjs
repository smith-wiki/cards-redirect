// Writes one redirect page per Card: <id>/index.html, served with 200.
// Each page carries the Card's own title, description, and image, so link
// previews of old cards.smith.wiki URLs still show the Card, and redirects to
// its andy.smith.wiki page (JS keeps query and fragment; meta refresh without JS).
//
// Only Cards created before the move have cards.smith.wiki URLs, so this runs
// once against a checkout of smith-wiki/cards (with node_modules installed):
//
//   node generate.mjs ../cards
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE = "https://andy.smith.wiki";
const cardsRepo = path.resolve(process.argv[2] ?? "../cards");
const { articleDescription, loadCards, plainText } = await import(pathToFileURL(path.join(cardsRepo, "lib/cards.mjs")).href);

const escapeHtml = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function page({ target, title, ogTitle = title, description, type, image, body }) {
  const t = escapeHtml(target);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<script>location.replace(${JSON.stringify(SITE)} + location.pathname + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${t}">
<link rel="canonical" href="${t}">
<meta name="description" content="${escapeHtml(description)}">
<meta property="og:url" content="${t}">
<meta property="og:site_name" content="Smith Wiki">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${escapeHtml(ogTitle)}">
<meta property="og:description" content="${escapeHtml(description)}">
${image ? `<meta property="og:image" content="${escapeHtml(image)}">\n<meta name="twitter:card" content="summary_large_image">` : `<meta name="twitter:card" content="summary">`}
</head>
<body>
<p>${escapeHtml(body)}</p>
<p>Moved to <a href="${t}">${t}</a></p>
</body>
</html>
`;
}

const cards = await loadCards(path.join(cardsRepo, "cards"));
for (const card of cards) {
  const plain = plainText(card.shortText);
  const html = page({
    target: `${SITE}/${card.id}/`,
    title: `${plain} · Smith Wiki`,
    ogTitle: plain,
    description: (card.article && articleDescription(card.article)) || plain,
    type: "article",
    image: card.images?.[0]?.src ?? null,
    body: plain,
  });
  await mkdir(card.id, { recursive: true });
  await writeFile(path.join(card.id, "index.html"), html);
}

const home = {
  title: "Smith Wiki",
  description: "An append-only wiki of short Cards by the Operator and the Agent, published to Bluesky.",
  type: "website",
  image: null,
};
await writeFile("index.html", page({ ...home, target: `${SITE}/`, body: "This wiki moved to andy.smith.wiki." }));
await mkdir("all", { recursive: true });
await writeFile(
  "all/index.html",
  page({ ...home, title: "All Cards · Smith Wiki", description: "Every Card of the Smith Wiki, newest first.", target: `${SITE}/all/`, body: "This wiki moved to andy.smith.wiki." }),
);
console.log(`wrote ${cards.length} Card pages, index.html, all/index.html`);
