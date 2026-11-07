const fs = require("fs");
const path = require("path");

const root = __dirname;
const files = [
  "index.html", "about.html", "services.html",
  "work.html", "innovation.html", "contact.html"
];

const MARK_RE = /<svg class="brand__mark"[\s\S]*?<\/svg>/g;

function replaceMarks(str, src) {
  return str.replace(
    MARK_RE,
    '<img class="brand__mark" src="' + src + '" alt="" width="32" height="32">'
  );
}

function countMarks(str) {
  const m = str.match(MARK_RE);
  return m ? m.length : 0;
}

const report = [];

files.forEach(function (file) {
  const abs = path.join(root, file);
  let html = fs.readFileSync(abs, "utf8");
  const before = Buffer.byteLength(html, "utf8");

  /* --- favicon --- */

  const faviconRe = /<link rel="icon"[\s\S]*?>/;
  if (!faviconRe.test(html)) {
    report.push("MISS favicon  " + file);
  } else {
    html = html.replace(
      faviconRe,
      '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">'
    );
  }

  /* --- brand marks: header light, footer dark --- */

  const footerIdx = html.indexOf('<footer class="site-footer">');

  if (footerIdx === -1) {
    report.push("MISS footer   " + file);
  } else {
    const head = html.slice(0, footerIdx);
    const foot = html.slice(footerIdx);

    const headCount = countMarks(head);
    const footCount = countMarks(foot);

    if (headCount !== 1) report.push("HEAD marks " + headCount + "  " + file);
    if (footCount !== 1) report.push("FOOT marks " + footCount + "  " + file);

    html = replaceMarks(head, "assets/logo.svg") +
           replaceMarks(foot, "assets/logo-light.svg");
  }

  /* --- project shot slots in work.html only --- */

  if (file === "work.html") {
    const canvasRe = /<canvas data-project-visual="([^"]+)" aria-hidden="true"><\/canvas>/g;
    const found = (html.match(canvasRe) || []).length;

    if (found !== 5) report.push("PROJECT canvases " + found + "  work.html");

    html = html.replace(canvasRe, function (match, name) {
      return (
        '<canvas data-project-visual="' + name + '" aria-hidden="true"></canvas>\n' +
        '              <img class="project-shot" data-project-shot="' + name + '" alt="">'
      );
    });
  }

  fs.writeFileSync(abs, html, "utf8");

  const dOpen = (html.match(/<div\b/g) || []).length;
  const dClose = (html.match(/<\/div>/g) || []).length;

  report.push(
    file +
    "  " + before + " -> " + Buffer.byteLength(html, "utf8") +
    "  div " + dOpen + "/" + dClose +
    "  oldSVG " + (html.match(/M30\.5 11\.2/g) || []).length +
    "  logoImg " + (html.match(/assets\/logo/g) || []).length
  );
});

console.log(report.join("\n"));