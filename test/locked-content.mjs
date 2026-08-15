import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const EXPECTED = new Map([
  ["test/cards.json", "9b70fc95bb2eae5aa476faf03e5409cd311e5090bfcbd8c979ad935d8a8418ef"],
  ["js/corpus.js", "4b7ed3d8960b34b10a4b847ced3a5c60445fe41f3f816b6faad769e711a02874"],
  ["js/app.js", "85553a25aa1e09013adab027e78ceb469db570bc7a36998125306a91a0bb4800"],
  ["js/store.js", "099a7fb5997c6e843ff6a0e5a269d4f7b82a65c57db34fb5c4415da81a30dac9"],
  ["js/views.js", "cbb89da9421f3a0258c59900834560e7fa33cecd4cda3827ae17a07e04767361"],
  ["js/versions.js", "b702f2ca36e740deda269eb77ff7a098b2110f8c97c8f97010aced918d60e0bb"],
  ["fonts/amiri-quran-ar.woff2", "636a38f4f98f5ec3b675cf796e605271becc3470bf38b4ca03271cad3a7fc1c0"],
  ["fonts/noto-sans-arabic-regular.woff2", "47ff87c4d1ecf8e5b9e5df41eb8995bdffa3acd1472be1afad66d40d564db354"],
  ["fonts/noto-sans-arabic-bold.woff2", "4fe7882ce4b9f07e6bb98c796f1899271265f613831e5300e6115a3ddf970d7f"]
]);

let failed = 0;
for (const [path, expected] of EXPECTED) {
  const bytes = await readFile(new URL(`../${path}`, import.meta.url));
  const actual = createHash("sha256").update(bytes).digest("hex");
  if (actual !== expected) {
    console.error(`LOCKED CONTENT CHANGED: ${path}\nexpected ${expected}\nactual   ${actual}`);
    failed++;
  }
}

const cards = JSON.parse(await readFile(new URL("./cards.json", import.meta.url), "utf8"));
const h01 = cards.filter(card => card.hizb_id === "H01").length;
const h02 = cards.filter(card => card.hizb_id === "H02").length;
if (cards.length !== 71 || h01 !== 33 || h02 !== 38) {
  console.error(`LOCKED CORPUS COUNT CHANGED: H01=${h01} H02=${h02} total=${cards.length}`);
  failed++;
}

console.log(`\nLOCKED CONTENT · ${EXPECTED.size} files · H01=${h01} · H02=${h02} · TOTAL=${cards.length}`);
if (failed) process.exit(1);
console.log("LOCKED CONTENT VERIFIED\n");
