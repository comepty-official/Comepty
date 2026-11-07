const fs = require("fs");
const path = require("path");

/* ---------- 1. brand.css: img mark sizing + a swappable asset note ---------- */

const brandAbs = path.join(__dirname, "css", "brand.css");
let brand = fs.readFileSync(brandAbs, "utf8");

const addBrand = `

/* --------------------------------------------------------------------------
   Logo images
   The mark is a replaceable file in assets/. Drop a new logo.svg and a
   logo-light.svg in that folder to rebrand the whole site at once.
   -------------------------------------------------------------------------- */

img.brand__mark {
  object-fit: contain;
  border-radius: 4px;
  color: inherit;
}

.site-footer img.brand__mark,
.menu-panel img.brand__mark {
  border-radius: 4px;
}
`;

if (brand.indexOf("img.brand__mark") === -1) {
  brand += addBrand;
  fs.writeFileSync(brandAbs, brand, "utf8");
  console.log("brand.css + " + (brand.length - brand.indexOf("img.brand__mark")));
} else {
  console.log("brand.css already patched");
}

/* ---------- 2. pages.css: project shot overlay ---------- */

const pagesAbs = path.join(__dirname, "css", "pages.css");
let pages = fs.readFileSync(pagesAbs, "utf8");

const addShot = `

/* --------------------------------------------------------------------------
   Project shot overlay
   Each project card has a canvas preview by default. If a real screenshot is
   placed at assets/projects/<name>.jpg (or .png / .webp), it covers the canvas
   automatically. Nothing else needs to change.
   -------------------------------------------------------------------------- */

.project-shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity var(--dur-mid) var(--ease-out),
    transform var(--dur-slow) var(--ease-out);
  pointer-events: none;
}

.project-shot.is-loaded {
  opacity: 1;
}

.project-card:hover .project-shot.is-loaded {
  transform: scale(1.035);
}
`;

if (pages.indexOf(".project-shot") === -1) {
  pages += addShot;
  fs.writeFileSync(pagesAbs, pages, "utf8");
  console.log("pages.css patched");
} else {
  console.log("pages.css already patched");
}

/* ---------- 3. verify ---------- */

["base", "layout", "components", "animations", "pages", "brand"].forEach(function (name) {
  const src = fs.readFileSync(path.join(__dirname, "css", name + ".css"), "utf8");
  const clean = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/"(?:[^"\\]|\\.)*"/g, '""');
  const o = (clean.match(/{/g) || []).length;
  const c = (clean.match(/}/g) || []).length;
  console.log(name + ".css " + o + "/" + c + (o === c ? " OK" : " MISMATCH"));
});