/* Shared script for every page of the wedding site. Edit CONFIG to change names, times and links. */
/* =====================================================================
   EDIT YOUR DETAILS HERE. Everything on the page reads from CONFIG.
   ===================================================================== */
const CONFIG = {
  names: ["Shravya Chepa", "Vishal Kumar"], // full names; first names are used where space is tight
  ceremony: "2026-12-18T16:00:00-08:00",    // ceremony start, Laguna (Pacific) time
  ceremonyWords: "at four o'clock in the afternoon",
  ceremonyLabel: "4:00 PM",
  venue: {
    name: "The Woman's Club of Laguna Beach",
    address: "286 St. Ann's Drive, Laguna Beach, CA 92651",
    maps: "https://www.google.com/maps/search/?api=1&query=Woman%27s+Club+of+Laguna+Beach%2C+286+St+Ann%27s+Dr%2C+Laguna+Beach%2C+CA+92651",
    apple: "https://maps.apple.com/place?place-id=IE404C5C8E5A4F54&address=286+St+Ann%27s+Dr%2C+Laguna+Beach%2C+CA++92651%2C+United+States&coordinate=33.537449%2C-117.778404&name=Woman%27s+Club+of+Laguna+Beach&_provider=9902"
  },
  zola: "https://www.zola.com/wedding/shravyaandvishal/rsvp",   // the Zola RSVP page
  rsvpBy: "November 15, 2026",
  dressCode: "Indian or Western formal",
  dressNote: "Evenings get cool once the sun sets, about 50°F, so bring a layer.",
  guests: "About 50",
  schedule: [
    { t: "3:30 PM", h: "Arrival",           p: "Come in, find your seat, and say hello." },
    { t: "4:00 PM", h: "Ceremony",          p: "Vows, rings, and a few happy tears." },
    { t: "4:30 PM", h: "Golden hour",       p: "Photos and chilled drinks as the sun goes down. Settle in and wander through the many little corners we've set up for you." },
    { t: "5:30 PM", h: "Dinner party",      p: "Good food, great company, and a few planned activities as you dine." },
    { t: "7:30 PM", h: "Dessert & dancing", p: "Cake, music, and the dance floor." },
    { t: "8:30 PM", h: "Goodnight",         p: "Send-off under the stars." }
  ],
  storySteps: [
    { k: "Before",  h: "Two separate maps",  p: "Two cities, two families, two daily routines that had never crossed. [Add a line about where each of you grew up.]" },
    { k: "Then",    h: "The paths bend",     p: "[A sentence about the year or place your lives started moving toward each other.]" },
    { k: "Now",     h: "One line from here", p: "[A sentence about the moment you knew.] The two lines meet on December 18 in Laguna." }
  ],
  chapters: [
    { k: "Chapter one",   y: "20XX", h: "The first hello",  place: "Where it started",   p: "[How you met: the place, the season, the first thing you noticed.]", art: "cups" },
    { k: "Chapter two",   y: "20XX", h: "First adventure",  place: "Somewhere new",      p: "[A first trip or first date that became a story you still tell.]", art: "waves" },
    { k: "Chapter three", y: "20XX", h: "The question",     place: "A yes",              p: "[The proposal, in a sentence or two.]", art: "rings" },
    { k: "Chapter four",  y: "2026", h: "Laguna",           place: "Laguna Beach, CA",   p: "On December 18 we say yes in front of the people who got us here. We're so glad you're one of them.", art: "sunset" }
  ]
};

/* ---------------- helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------------- bind config text ---------------- */
const [N1, N2] = CONFIG.names, F1 = N1.split(" ")[0], F2 = N2.split(" ")[0];
const binds = {
  "names-short": `${F1} & ${F2}`,
  "monogram": `${N1[0]}&${N2[0]}`,
  "name-1": F1, "name-2": F2,
  "ceremony-words": CONFIG.ceremonyWords,
  "venue-name": CONFIG.venue.name,
  "venue-address": CONFIG.venue.address,
  "rsvp-by": CONFIG.rsvpBy
};
$$("[data-bind]").forEach(el => { const v = binds[el.dataset.bind]; if (v != null) el.textContent = v; });
$$("[data-href=maps]").forEach(a => a.href = CONFIG.venue.maps);
$$("[data-href=apple]").forEach(a => a.href = CONFIG.venue.apple);
$$("[data-href=zola]").forEach(a => a.href = CONFIG.zola);


/* ---------------- confetti ---------------- */
const confetti = (() => {
  document.body.insertAdjacentHTML("beforeend", '<canvas id="confetti" aria-hidden="true"></canvas>');
  const cv = $("#confetti"), ctx = cv.getContext("2d"); let parts = [], running = false;
  const cols = ["#D9BC86", "#B7C1A5", "#F6DDCF", "#F2C7BC", "#E6AAA2", "#D3958F"];   // the invitation's florals, softly: pale gold and sage ribbons, blush and dusty-rose petals
  function size() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
  addEventListener("resize", size); size();
  function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.vy += 0.12 * devicePixelRatio; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.c;
      if (p.petal) { ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .55, 0, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (parts.length) requestAnimationFrame(loop); else { running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
  }
  return (x = innerWidth / 2, y = innerHeight / 2, n = 140) => {
    n = Math.round(n * .55);
    if (REDUCED) return;
    const d = devicePixelRatio;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - .5) * 1.9, v = (4 + Math.random() * 7) * d;
      parts.push({ x: x * d, y: y * d, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * 6, vr: (Math.random() - .5) * .3, s: (3 + Math.random() * 5) * d, c: cols[i % cols.length], life: 110 + Math.random() * 70, petal: i % cols.length > 2 });
    }
    if (!running) { running = true; loop(); }
  };
})();

/* ---------------- paintings (procedural, palette-only) ---------------- */
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const PAL = { rose: "#F0BDB2", peach: "#F2C6B4", cream: "#F3E8CB", sea: "#AAD4C9", ink: "#24393B", wax: "#8B2C3A", seaDeep: "#386B65", paper: "#FFFBF2" };
const ART = {
  sunset(c, w, h, r) {
    let g = c.createLinearGradient(0, 0, 0, h * .6); g.addColorStop(0, "#F59FA4"); g.addColorStop(.55, PAL.peach); g.addColorStop(1, "#FBE6C8");
    c.fillStyle = g; c.fillRect(0, 0, w, h * .62);
    const sx = w * .62, sy = h * .6, sr = w * .1;
    const sg = c.createRadialGradient(sx, sy, 0, sx, sy, sr * 3); sg.addColorStop(0, "rgba(255,247,226,1)"); sg.addColorStop(.4, "rgba(255,232,206,.6)"); sg.addColorStop(1, "rgba(255,232,206,0)");
    c.fillStyle = sg; c.fillRect(0, 0, w, h * .62);
    c.fillStyle = "#FFF5E0"; c.beginPath(); c.arc(sx, sy, sr, 0, Math.PI * 2); c.fill();
    for (let i = 0; i < 5; i++) { c.fillStyle = `rgba(255,236,226,${.25 + r() * .3})`; const y = h * (.12 + r() * .3), x = w * r(); c.beginPath(); c.ellipse(x, y, w * (.12 + r() * .14), h * .012, 0, 0, Math.PI * 2); c.fill(); }
    g = c.createLinearGradient(0, h * .6, 0, h); g.addColorStop(0, "#C6DFD8"); g.addColorStop(1, "#5B9086");
    c.fillStyle = g; c.fillRect(0, h * .6, w, h * .4);
    for (let i = 0; i < 110; i++) {
      const k = Math.pow(r(), 1.5), y = h * .61 + k * h * .39, spread = w * (.05 + k * .45);
      const x = sx + (r() - .5) * spread * 2 * (r() < .7 ? .35 : 1), len = w * (.01 + r() * .07) * (1 - k * .5);
      c.fillStyle = `rgba(255,243,226,${.25 + r() * .55})`; c.fillRect(x - len / 2, y, len, h * (.003 + r() * .004));
    }
    c.fillStyle = "#8C5A60"; c.beginPath(); c.moveTo(0, h * .38);
    for (let x = 0; x <= w * .32; x += w * .02) c.lineTo(x, h * (.38 + (x / w) * .7) + (r() - .5) * h * .03);
    c.lineTo(w * .34, h * .62); c.lineTo(0, h * .62); c.closePath(); c.fill();
    c.fillStyle = "#6F474E"; c.beginPath(); c.ellipse(w * .4, h * .63, w * .03, h * .02, 0, Math.PI, 0); c.fill();
  },
  kolam(c, w, h, r) {
    c.fillStyle = "#415351"; c.fillRect(0, 0, w, h);
    const n = 5, s = Math.min(w, h) / (n + 1.6), ox = w / 2 - s * (n - 1) / 2, oy = h / 2 - s * (n - 1) / 2;
    c.lineWidth = Math.max(2, s * .06); c.lineCap = "round"; c.lineJoin = "round";
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = ox + i * s, y = oy + j * s, k = s * .5;
      c.strokeStyle = (i + j) % 2 ? "#FFF6E8" : PAL.rose;
      c.beginPath(); c.moveTo(x, y - k); c.quadraticCurveTo(x + k * 1.05, y - k * 1.05, x + k, y); c.quadraticCurveTo(x + k * 1.05, y + k * 1.05, x, y + k); c.quadraticCurveTo(x - k * 1.05, y + k * 1.05, x - k, y); c.quadraticCurveTo(x - k * 1.05, y - k * 1.05, x, y - k); c.stroke();
    }
    c.strokeStyle = PAL.sea; c.beginPath(); c.arc(w / 2, h / 2, s * (n / 2 + .25), 0, Math.PI * 2); c.stroke();
    for (let a = 0; a < 16; a++) { const ang = a / 16 * Math.PI * 2, R = s * (n / 2 + .25); c.beginPath(); c.arc(w / 2 + Math.cos(ang) * R, h / 2 + Math.sin(ang) * R, s * .22, ang + Math.PI * .5, ang + Math.PI * 1.5, true); c.stroke(); }
    c.fillStyle = "#FFF6E8";
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.beginPath(); c.arc(ox + i * s, oy + j * s, Math.max(2, s * .06), 0, Math.PI * 2); c.fill(); }
  },
  jasmine(c, w, h, r) {
    let g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#386B65"); g.addColorStop(1, "#284C48"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let k = 0; k < 3; k++) {
      const y0 = h * (.2 + k * .3), amp = h * (.08 + r() * .06);
      for (let i = 0; i < 26; i++) {
        const t = i / 25, x = w * (-.05 + t * 1.1), y = y0 + Math.sin(t * Math.PI * 1.6 + k) * amp;
        if (i % 4 === 0) { c.fillStyle = "rgba(170,212,201,.55)"; c.beginPath(); c.ellipse(x, y + h * .03, w * .025, h * .012, .6, 0, Math.PI * 2); c.fill(); }
        const fr = w * (.018 + r() * .01);
        c.save(); c.translate(x, y); c.rotate(r() * 6);
        for (let p = 0; p < 5; p++) { c.rotate(Math.PI * 2 / 5); c.fillStyle = p % 2 ? "#FFFDF6" : "#F6EEDD"; c.beginPath(); c.ellipse(fr * .9, 0, fr, fr * .48, 0, 0, Math.PI * 2); c.fill(); }
        c.fillStyle = "#F7D88A"; c.beginPath(); c.arc(0, 0, fr * .25, 0, Math.PI * 2); c.fill(); c.restore();
      }
    }
  },
  cups(c, w, h, r) {
    c.fillStyle = PAL.peach; c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(255,255,255,.25)"; c.lineWidth = 2; for (let y = h * .05; y < h; y += h * .07) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + h * .02); c.stroke(); }
    const s = Math.min(w, h);
    const cup = (x, y, R, rim, liquid, foam) => {
      c.fillStyle = "rgba(120,70,60,.18)"; c.beginPath(); c.ellipse(x + R * .12, y + R * .14, R * 1.04, R * 1.04, 0, 0, Math.PI * 2); c.fill();
      const g = c.createRadialGradient(x - R * .3, y - R * .3, R * .1, x, y, R); g.addColorStop(0, "#FFFFFF"); g.addColorStop(1, rim);
      c.fillStyle = g; c.beginPath(); c.arc(x, y, R, 0, Math.PI * 2); c.fill();
      c.fillStyle = liquid; c.beginPath(); c.arc(x, y, R * .8, 0, Math.PI * 2); c.fill();
      c.strokeStyle = foam; c.lineWidth = R * .05;
      for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(x + (r() - .5) * R * .2, y + (r() - .5) * R * .2, R * (.2 + i * .17), r() * 6, r() * 6 + 3.5); c.stroke(); }
    };
    cup(w * .36, h * .5, s * .23, "#AEBBBC", "#9C6B48", "rgba(240,215,185,.85)");
    cup(w * .66, h * .44, s * .17, "#EBD8C6", "#D6955F", "rgba(255,230,200,.8)");
    c.fillStyle = "#F7E3B8"; c.beginPath(); c.arc(w * .7, h * .78, s * .07, 0, Math.PI * 2); c.fill();
    c.fillStyle = "rgba(160,110,70,.4)"; for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(w * .7 + (r() - .5) * s * .09, h * .78 + (r() - .5) * s * .09, s * .005, 0, 7); c.fill(); }
    c.strokeStyle = "rgba(255,255,255,.65)"; c.lineWidth = s * .012; c.lineCap = "round";
    for (const [x, y] of [[w * .36, h * .2], [w * .66, h * .18]]) for (let k = -1; k <= 1; k++) { c.beginPath(); for (let t = 0; t <= 1; t += .05) { const yy = y - t * h * .14, xx = x + k * s * .05 + Math.sin(t * 7 + k) * s * .02; t ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); }
  },
  tidepool(c, w, h, r) {
    let g = c.createRadialGradient(w * .5, h * .5, 10, w * .5, h * .5, Math.max(w, h) * .7); g.addColorStop(0, "#CAE6DE"); g.addColorStop(1, "#4D8680"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    const blob = (x, y, R, col) => { c.fillStyle = col; c.beginPath(); for (let a = 0; a <= 24; a++) { const ang = a / 24 * Math.PI * 2, rr = R * (.75 + r() * .35); a ? c.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr) : c.moveTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } c.closePath(); c.fill(); };
    for (let i = 0; i < 9; i++) blob(w * r(), h * r(), Math.min(w, h) * (.08 + r() * .12), `rgba(57,77,75,${.35 + r() * .3})`);
    for (let i = 0; i < 7; i++) { const x = w * (.1 + r() * .8), y = h * (.1 + r() * .8), R = Math.min(w, h) * (.03 + r() * .04); c.strokeStyle = r() < .5 ? PAL.rose : "#CEE8E1"; c.lineWidth = 3; for (let a = 0; a < 18; a++) { const ang = a / 18 * Math.PI * 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(ang) * R, y + Math.sin(ang) * R); c.stroke(); } c.fillStyle = PAL.wax; c.beginPath(); c.arc(x, y, R * .3, 0, 7); c.fill(); }
    const star = (x, y, R, rot, col) => { c.fillStyle = col; c.beginPath(); for (let k = 0; k < 10; k++) { const ang = rot + k * Math.PI / 5, rr = k % 2 ? R * .4 : R; c.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } c.closePath(); c.fill(); };
    star(w * .68, h * .62, Math.min(w, h) * .1, .3, "#E88E78"); star(w * .25, h * .3, Math.min(w, h) * .06, 1, PAL.wax);
    c.fillStyle = "rgba(255,255,255,.5)"; for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(w * r(), h * r(), 1 + r() * 4, 0, 7); c.fill(); }
  },
  palms(c, w, h, r) {
    let g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#F6A9A9"); g.addColorStop(.5, "#F7CDB8"); g.addColorStop(.72, "#FBE8C8"); g.addColorStop(.72, "#9FC4BA"); g.addColorStop(1, "#6E9F96"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#FFF4DD"; c.beginPath(); c.arc(w * .5, h * .72, w * .12, Math.PI, 0); c.fill();
    const palm = (bx, by, hh, lean) => {
      c.strokeStyle = "#374745"; c.lineCap = "round";
      const tx = bx + lean, ty = by - hh;
      c.lineWidth = w * .016; c.beginPath(); c.moveTo(bx, by); c.quadraticCurveTo(bx + lean * .2, by - hh * .6, tx, ty); c.stroke();
      c.lineWidth = w * .005;
      for (let f = 0; f < 9; f++) { const a = -Math.PI + f / 8 * Math.PI + (r() - .5) * .3, L = hh * (.32 + r() * .14); const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * .55 + L * .35; c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(tx + Math.cos(a) * L * .5, ty - L * .25, ex, ey); c.stroke(); for (let k = 1; k < 9; k++) { const t = k / 9, px = lerp(tx, ex, t), py = lerp(ty, ey, t) - Math.sin(t * Math.PI) * L * .2; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(a + 1.3) * L * .12, py + L * .1); c.stroke(); } }
    };
    palm(w * .2, h * .74, h * .62, w * .06); palm(w * .3, h * .74, h * .44, -w * .04); palm(w * .82, h * .74, h * .54, -w * .07);
  },
  moon(c, w, h, r) {
    let g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1F3E46"); g.addColorStop(.62, "#487570"); g.addColorStop(.62, "#2B4945"); g.addColorStop(1, "#16313A"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "rgba(255,250,235,.85)"; for (let i = 0; i < 90; i++) { c.beginPath(); c.arc(w * r(), h * .58 * r(), r() * 1.8 + .3, 0, 7); c.fill(); }
    const mx = w * .32, my = h * .28, mr = Math.min(w, h) * .09;
    const mg = c.createRadialGradient(mx, my, mr * .5, mx, my, mr * 3.2); mg.addColorStop(0, "rgba(243,232,203,.45)"); mg.addColorStop(1, "rgba(243,232,203,0)"); c.fillStyle = mg; c.fillRect(0, 0, w, h);
    c.fillStyle = "#F7EED6"; c.beginPath(); c.arc(mx, my, mr, 0, 7); c.fill();
    for (let i = 0; i < 50; i++) { const y = h * .63 + r() * h * .36, len = w * (.02 + r() * .08); c.fillStyle = `rgba(243,232,203,${.2 + r() * .5})`; c.fillRect(mx + (r() - .5) * w * .18 - len / 2, y, len, 2 + r() * 2); }
    c.fillStyle = "#13282E"; c.beginPath(); c.moveTo(w * .55, h * .62); c.quadraticCurveTo(w * .75, h * .48, w * .88, h * .55); c.quadraticCurveTo(w * .95, h * .5, w, h * .52); c.lineTo(w, h * .62); c.fill();
  },
  rings(c, w, h, r) {
    let g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#FCC3C1"); g.addColorStop(1, "#F2A9A6"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    const s = Math.min(w, h);
    c.fillStyle = "rgba(150,70,70,.18)"; c.beginPath(); c.ellipse(w * .5, h * .72, s * .38, s * .06, 0, 0, 7); c.fill();
    const ring = (x, y, R, rot) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, .55); const gg = c.createLinearGradient(-R, -R, R, R); gg.addColorStop(0, "#FFF0C6"); gg.addColorStop(.5, "#D6A85C"); gg.addColorStop(1, "#F8DE9E"); c.strokeStyle = gg; c.lineWidth = s * .045; c.beginPath(); c.arc(0, 0, R, 0, 7); c.stroke(); c.restore(); };
    ring(w * .42, h * .55, s * .2, -.3); ring(w * .6, h * .52, s * .17, .35);
    c.fillStyle = "#FFFFFF"; c.save(); c.translate(w * .42, h * .55 - s * .13); c.beginPath(); c.moveTo(0, -s * .05); c.lineTo(s * .035, 0); c.lineTo(0, s * .03); c.lineTo(-s * .035, 0); c.closePath(); c.fill(); c.restore();
    c.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 9; i++) { const x = w * r(), y = h * r() * .6, k = s * (.008 + r() * .014); c.beginPath(); c.moveTo(x, y - k * 2); c.lineTo(x + k * .4, y - k * .4); c.lineTo(x + k * 2, y); c.lineTo(x + k * .4, y + k * .4); c.lineTo(x, y + k * 2); c.lineTo(x - k * .4, y + k * .4); c.lineTo(x - k * 2, y); c.lineTo(x - k * .4, y - k * .4); c.fill(); }
  },
  letters(c, w, h, r) {
    c.fillStyle = PAL.sea; c.fillRect(0, 0, w, h);
    const s = Math.min(w, h);
    for (let i = 0; i < 6; i++) {
      const x = w * (.2 + r() * .6), y = h * (.2 + r() * .6), ew = s * (.36 + r() * .1), eh = ew * .64;
      c.save(); c.translate(x, y); c.rotate((r() - .5) * .9);
      c.fillStyle = "rgba(36,57,59,.15)"; c.fillRect(-ew / 2 + 6, -eh / 2 + 8, ew, eh);
      c.fillStyle = i % 2 ? "#FFFBF2" : "#FBE7DD"; c.fillRect(-ew / 2, -eh / 2, ew, eh);
      c.strokeStyle = "rgba(36,57,59,.18)"; c.lineWidth = 2; c.beginPath(); c.moveTo(-ew / 2, -eh / 2); c.lineTo(0, eh * .08); c.lineTo(ew / 2, -eh / 2); c.stroke();
      c.fillStyle = PAL.wax; c.beginPath(); c.arc(0, eh * .08, s * .035, 0, 7); c.fill();
      c.strokeStyle = PAL.rose; c.setLineDash([3, 3]); c.strokeRect(ew / 2 - s * .1, -eh / 2 + s * .03, s * .07, s * .085); c.setLineDash([]);
      c.restore();
    }
  },
  petals(c, w, h, r) {
    c.fillStyle = "#FFF6E8"; c.fillRect(0, 0, w, h);
    const cols = [PAL.rose, PAL.peach, "#F59FA4", PAL.wax, PAL.sea];
    for (let i = 0; i < 160; i++) { const x = w * r(), y = h * r(), s = Math.min(w, h) * (.015 + r() * .035); c.save(); c.translate(x, y); c.rotate(r() * 6); c.globalAlpha = .5 + r() * .5; c.fillStyle = cols[(r() * cols.length) | 0]; c.beginPath(); c.moveTo(0, -s); c.quadraticCurveTo(s * .9, -s * .2, 0, s); c.quadraticCurveTo(-s * .9, -s * .2, 0, -s); c.fill(); c.restore(); }
    c.globalAlpha = 1;
  },
  waves(c, w, h, r) {
    c.fillStyle = "#FBE6CE"; c.fillRect(0, 0, w, h);
    const cols = ["#D2E8E2", "#AAD4C9", "#7DB6AB", "#4E8B85", "#386B65"];
    for (let k = 0; k < 5; k++) {
      const y0 = h * (.32 + k * .14), A = h * (.04 + r() * .03), f = 2 + r() * 2.5, ph = r() * 6;
      c.fillStyle = cols[k]; c.beginPath(); c.moveTo(0, h);
      for (let x = 0; x <= w; x += 6) c.lineTo(x, y0 + Math.sin(x / w * Math.PI * f + ph) * A);
      c.lineTo(w, h); c.fill();
      c.fillStyle = "rgba(255,255,255,.75)";
      for (let x = 0; x <= w; x += 10) { const y = y0 + Math.sin(x / w * Math.PI * f + ph) * A; if (Math.cos(x / w * Math.PI * f + ph) > .4 && r() < .6) { c.beginPath(); c.arc(x, y - 2, 1.5 + r() * 3, 0, 7); c.fill(); } }
    }
    c.fillStyle = "#FFF3DD"; c.beginPath(); c.arc(w * .78, h * .17, Math.min(w, h) * .07, 0, 7); c.fill();
  },
  coast(c, w, h, r) {
    c.fillStyle = "#F4DDBF"; c.fillRect(0, 0, w, h);
    const edge = y => w * (.35 + Math.sin(y / h * 5) * .05 + y / h * .2);
    let g = c.createLinearGradient(w * .3, 0, w, 0); g.addColorStop(0, "#AED6CB"); g.addColorStop(1, "#3E7771");
    c.fillStyle = g; c.beginPath(); c.moveTo(w, 0); for (let y = 0; y <= h; y += 4) c.lineTo(edge(y), y); c.lineTo(w, h); c.fill();
    c.strokeStyle = "rgba(255,255,255,.8)"; c.lineWidth = 3;
    for (let k = 0; k < 5; k++) { c.beginPath(); for (let y = 0; y <= h; y += 4) { const x = edge(y) + k * w * .035 + Math.sin(y * .05 + k) * 3; y ? c.lineTo(x, y) : c.moveTo(x, y); } c.globalAlpha = 1 - k * .18; c.stroke(); }
    c.globalAlpha = 1;
    for (let i = 0; i < 14; i++) { const y = h * r(), x = edge(y) - w * (.04 + r() * .15); c.fillStyle = [PAL.rose, PAL.sea, PAL.wax, "#FFFFFF"][i % 4]; c.beginPath(); c.arc(x, y, Math.min(w, h) * .014, 0, 7); c.fill(); c.fillStyle = "rgba(36,57,59,.25)"; c.fillRect(x - 1, y, 2, Math.min(w, h) * .02); }
  }
};
const WORKS = [
  // the gallery: our own photographs, in order. Titles and notes are simple placeholders until we write our own.
  { src: "photo-1.webp", t: "Hand in Hand",        m: "Sunset by the water",       n: "", ar: 4 / 3 },
  { src: "photo-2.webp", t: "A Little Flower",     m: "An evening walk",           n: "", ar: 1 },
  { src: "photo-3.webp", t: "Side by Side",        m: "A sunny afternoon",         n: "", ar: 3 / 4 },
  { src: "photo-4.webp", t: "By the Fountain",     m: "A sunny afternoon",         n: "", ar: 3 / 4 },
  { src: "photo-5.webp", t: "Golden Hour",         m: "In the park",               n: "", ar: 3 / 4 },
  { src: "photo-6.webp", t: "Train Window",        m: "Somewhere along the way",   n: "", ar: 1 },
  { src: "photo-7.webp", t: "At the Museum",       m: "Lost in color", n: "", ar: 4 / 3 },
  { src: "photo-8.webp", t: "City Lights",         m: "Across the bay at night",   n: "", ar: 1 }
];
// photos load once; paint() draws them (or a painted illustration for works that have no photo)
const PHOTOS = {};
const photosReady = Promise.all(WORKS.filter(w => w.src).map(w => new Promise(res => {
  const im = new Image(); im.decoding = "async"; im.onload = () => { PHOTOS[w.src] = im; res(); }; im.onerror = res; im.src = w.src;
})));
function paint(work, width) {
  const cv = document.createElement("canvas");
  cv.width = width; cv.height = Math.round(width / work.ar);
  if (work.src) {
    const im = PHOTOS[work.src], x = cv.getContext("2d");
    x.fillStyle = "#EFE6D6"; x.fillRect(0, 0, cv.width, cv.height);
    if (im) { const s = Math.max(cv.width / im.naturalWidth, cv.height / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
      x.imageSmoothingQuality = "high"; x.drawImage(im, (cv.width - w) / 2, (cv.height - h) / 2, w, h); }
    cv.classList.add("photo");
    return cv;
  }
  ART[work.art](cv.getContext("2d"), cv.width, cv.height, rng(work.seed || (work.t.length * 7919)));
  printFinish(cv);
  return cv;
}
/* turn the flat illustrations into something closer to a fine-art print:
   softened edges, a quieter palette, a warm paper tone and a fine grain */
function printFinish(cv) {
  const w = cv.width, h = cv.height, x = cv.getContext("2d");
  try {
    const t = document.createElement("canvas"); t.width = w; t.height = h; const tx = t.getContext("2d");
    if ("filter" in tx) { tx.filter = `blur(${Math.max(1.2, w / 240).toFixed(1)}px)`; tx.drawImage(cv, 0, 0); x.globalAlpha = .5; x.drawImage(t, 0, 0); x.globalAlpha = 1; }
    const im = x.getImageData(0, 0, w, h), d = im.data, R = rng(w * 31 + h);
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], g = d[i + 1], b = d[i + 2];
      const L = .3 * r + .59 * g + .11 * b;
      r += (L - r) * .4; g += (L - g) * .4; b += (L - b) * .4;              // quieter colour
      r = r * .9 + 250 * .1; g = g * .9 + 243 * .1; b = b * .9 + 230 * .1;  // warm paper lift
      const n = (R() - .5) * 13;                                            // grain
      d[i] = r + n; d[i + 1] = g + n; d[i + 2] = b + n * .9;
    }
    x.putImageData(im, 0, 0);
    const v = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .35, w / 2, h / 2, Math.hypot(w, h) * .6);
    v.addColorStop(0, "rgba(120,90,70,0)"); v.addColorStop(1, "rgba(120,90,70,.14)");
    x.fillStyle = v; x.fillRect(0, 0, w, h);
  } catch (e) {}
}


/* ---------------- every page opens at its top ----------------
   The viewer can carry the previous page's scroll position over; reset it until the visitor scrolls themselves. */
(function startAtTop() {
  if (location.hash) return;
  let touched = false;
  const stop = () => { touched = true; };
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach(ev => addEventListener(ev, stop, { once: true, passive: true }));
  // instant, never the page's smooth scrolling: arriving should land at the top, not glide up to it
  const top = () => { if (!touched && scrollY !== 0) scrollTo({ top: 0, left: 0, behavior: "instant" }); };
  top(); addEventListener("DOMContentLoaded", top); addEventListener("load", top);
  [60, 200, 450, 900].forEach(ms => setTimeout(top, ms));
  // the loader only opens once the new page is sitting at its top
  requestAnimationFrame(() => { top(); document.documentElement.classList.add("vt-ready"); });
})();

/* ---------------- shared chrome: dock, progress, transitions ---------------- */
const PAGES = [
  ["index.html", "Welcome", '<circle cx="12" cy="12" r="8"/>'],
  ["invitation.html", "Invitation", '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 7l9 7 9-7"/>'],
  ["rsvp.html", "RSVP", '<circle cx="12" cy="12" r="8"/><path d="M8.5 12.5l2.3 2.3 4.7-5"/>'],
  ["the-day.html", "The Day", '<circle cx="12" cy="13" r="4"/><path d="M2 19h20M12 3v3M4.9 6.9l2 2M19.1 6.9l-2 2M2 13h2M20 13h2"/>'],
  ["countdown.html", "Countdown", '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/>'],
  ["faq.html", "FAQ", '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6v.6M12 17h.01"/>'],
  ["things-to-do.html", "Things to Do", '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'],
  ["story.html", "Our Story", '<path d="M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5z"/><path d="M12 6v13.5"/>'],
  ["gallery.html", "Gallery", '<rect x="3" y="4" width="18" height="16" rx="1"/><rect x="6.5" y="7.5" width="11" height="9"/><path d="M6.5 14l3-3 3 3 2-2 3 3"/>']
];
const PAGE = document.body.dataset.page || "index.html";
(function chrome() {
  const i = PAGES.findIndex(p => p[0] === PAGE);
  document.body.insertAdjacentHTML("beforeend",
    `<div class="grain" aria-hidden="true"></div><div class="progress" aria-hidden="true"><i id="prog"></i></div>` +
    `<header class="mast"><a class="mono" href="index.html" aria-label="Welcome">S<i>&amp;</i>V</a>` +
    `<nav class="mast-links" aria-label="Pages">${PAGES.slice(1).map(([h, l]) => `<a href="${h}"${h === PAGE ? ' class="on" aria-current="page"' : ""}>${l}</a>`).join("")}</nav></header>` +
    `<button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="menu"><span class="mb-l">Menu</span><span class="mb-x" aria-hidden="true"><i></i><i></i></span></button>` +
    `<div class="menu" id="menu" aria-hidden="true"><div class="menu-in"><span class="menu-mono">S<i>&amp;</i>V</span><ol>${PAGES.map(([h, l], k) => `<li style="--d:${k}"><a href="${h}"${h === PAGE ? ' class="on" aria-current="page"' : ""}><span class="mn">${["I","II","III","IV","V","VI","VII","VIII","IX"][k]}</span>${l === "Invitation" ? "The Invitation" : l}</a></li>`).join("")}</ol></div></div>`);
  /* the menu: a quiet full-screen index of pages */
  (function () {
    const btn = $("#menuBtn"), menu = $("#menu");
    const set = on => { document.documentElement.classList.toggle("menu-open", on); btn.setAttribute("aria-expanded", on); menu.setAttribute("aria-hidden", !on); btn.querySelector(".mb-l").textContent = on ? "Close" : "Menu"; };
    btn.addEventListener("click", () => set(!document.documentElement.classList.contains("menu-open")));
    addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
    const mast = $(".mast");
    const upd = () => document.documentElement.classList.toggle("past-mast", scrollY > (mast ? mast.offsetHeight + 40 : 80));
    upd(); addEventListener("scroll", upd, { passive: true });
  })();
  const slot = $("#nextSlot");
  if (slot && i >= 0) {
    const name = p => p[1] === "Invitation" ? "The Invitation" : p[1];
    const pv = i > 0 ? PAGES[i - 1] : null, last = i === PAGES.length - 1, nx = last ? PAGES[0] : PAGES[i + 1];
    slot.outerHTML =
      `<nav class="pager" aria-label="More pages">` +
        `<a class="pg-btn nextp" href="${nx[0]}"><span class="pg-dir">${last ? "Back to the beginning" : "Next"} <i>→</i></span><span class="pg-name">${last ? "Welcome" : name(nx)}</span></a>` +
      `</nav>` +
      `<footer class="foot"><div class="foot-in">` +
        `<span class="foot-names">${esc(F1)} <i>&amp;</i> ${esc(F2)}</span>` +
        `<svg class="foot-orn" viewBox="0 0 120 12" aria-hidden="true"><path d="M2 6h44M74 6h44"/><path d="M60 1.5l4.5 4.5L60 10.5 55.5 6z"/><circle cx="50" cy="6" r="1.2"/><circle cx="70" cy="6" r="1.2"/></svg>` +
        `<span class="foot-meta"><span>Friday, December 18, 2026</span><b>·</b><span>Laguna Beach, California</span></span>` +
        `<span class="foot-small">Thank you for being part of our day</span>` +
      `</div></footer>`;
  }
  const v = $(".veil");
  if (v) v.innerHTML = `<svg class="fish" viewBox="-58 -58 116 116" aria-hidden="true">
      <g class="hearts">${[[-4, -46, 1.15], [5, -43, .9], [0, -41, .75], [-1, -48, .85]].map(([x, y, k]) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 2.4C-2.6.6-3.8-.8-3.8-2.1c0-1.2.9-2 1.9-2 .9 0 1.5.5 1.9 1.2.4-.7 1-1.2 1.9-1.2 1 0 1.9.8 1.9 2 0 1.3-1.2 2.7-3.8 4.5z"/></g>`).join("")}</g>
      <defs>
        <radialGradient id="fgP" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#C98A90"/><stop offset=".55" stop-color="#8B2C3A"/><stop offset="1" stop-color="#5E1A26"/></radialGradient>
        <radialGradient id="fgB" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#A3C9C2"/><stop offset=".55" stop-color="#557773"/><stop offset="1" stop-color="#294845"/></radialGradient>
      </defs>
      <g id="fishSpin">${[0, 1].map(k => `<g class="fish-${k ? "blue" : "pink"}"><path class="f-fin" id="fFin${k}"/><path class="f-body" id="fBody${k}"/><path class="f-line" id="fLine${k}"/><g id="fEyes${k}"></g></g>`).join("")}</g>
    </svg>`;
  /* matsya yugma: two fish chasing each other in a circle, bodies rippling as they swim */
  const FISH = (function () {
    if (!v) return { start() {} };
    const body = [0, 1].map(k => $("#fBody" + k, v)), fin = [0, 1].map(k => $("#fFin" + k, v)), line = [0, 1].map(k => $("#fLine" + k, v)), eyes = [0, 1].map(k => $("#fEyes" + k, v)), spin = $("#fishSpin", v);
    const RO = 20, RB = 46, NOSE = 34, BASE = -16, MID = -3;   // fish sit on a small orbit (RO) and bend gently (RB) so they curl around each other
    // a slim almond body, long forked tail: proportions after Madhubani fish
    const w = x => { const u = clamp((x - BASE) / (NOSE - BASE), 0, 1); return 1.8 * (1 - u) + 7.2 * Math.pow(Math.sin(Math.PI * Math.pow(u, .8)), .75); };
    let T = 0, epoch = Date.now();
    try { const e = +sessionStorage.getItem("fishEpoch"); if (e && Date.now() - e < 8000) epoch = e; } catch (_) {}
    const wave = x => 2 * Math.pow((NOSE - x) / 72, 2) * Math.sin(.11 * x - T * 8);
    const P = (x, y, ph) => { const yy = y + wave(x), th = (x - MID) / RB, r = RB + yy, bx = r * Math.cos(th) - RB + RO, by = r * Math.sin(th), c = Math.cos(ph), sn = Math.sin(ph); return [bx * c - by * sn, bx * sn + by * c]; };
    const f = n => n.toFixed(2);
    const poly = (pts, ph, close) => pts.map(([x, y], i) => { const [a, b] = P(x, y, ph); return (i ? "L" : "M") + f(a) + " " + f(b); }).join("") + (close ? "Z" : "");
    const tail = [[-16, -1.8], [-22, -4], [-30, -7.5], [-40, -11], [-36, -5], [-31, -1.5], [-29.5, 0], [-31, 1.5], [-36, 5], [-40, 11], [-30, 7.5], [-22, 4], [-16, 1.8]];
    function outline() {
      const pts = [];
      for (let x = NOSE; x >= BASE; x -= .8) pts.push([x, -w(x)]);
      pts.push(...tail);
      for (let x = BASE; x <= NOSE; x += .8) pts.push([x, w(x)]);
      return pts;
    }
    const fins = () => [
      [[13, -w(13) + .4], [7, -w(7) - 3.2], [0, -w(0) - 4.2], [-5, -w(-5) - 1.6], [-6, -w(-6) + .4]],
      [[-2, w(-2)], [-8, w(-8) + 4], [-11, w(-11) + .8], [-10, w(-10)]]
    ];
    function details() {
      const lines = [], gw = w(20) * .78, G = [];
      for (let k = 0; k <= 10; k++) { const yy = -gw + k * gw / 5; G.push([20 + 2.6 * Math.cos(yy / gw * Math.PI / 2), yy]); }
      lines.push(G);
      for (const x0 of [13, 7, 1, -5, -10]) {
        const lim = w(x0) - 2.2; for (let y0 = -lim + .6; y0 <= lim; y0 += 3.3) {
          const sc = []; for (let k = 0; k <= 6; k++) { const a = Math.PI * k / 6; sc.push([x0 - 1.8 * Math.cos(a), y0 + 1.3 * Math.sin(a) - .5]); } lines.push(sc); }
      }
      for (const tip of [[-38, -9], [-35, -4], [-35, 4], [-38, 9]]) lines.push([[-18, 0], tip]);
      lines.push([[12, 2.2], [7, 4.6]]);       // a fine pectoral stroke
      return lines;
    }
    let raf = 0, until = 0;
    function frame(now) {
      T = (Date.now() - epoch) / 1000;
      spin.setAttribute("transform", `rotate(${(T * 100) % 360})`);
      [0, Math.PI].forEach((ph, k) => {      // one blush fish, one aqua fish
        let dB = poly(outline(), ph, true), dF = "", dL = "";
        for (const fp of fins()) dF += poly(fp, ph, true);
        for (const l of details()) dL += poly(l, ph, false);
        const [ex, ey] = P(26, -1.8, ph);
        body[k].setAttribute("d", dB); fin[k].setAttribute("d", dF); line[k].setAttribute("d", dL);
        eyes[k].innerHTML = `<circle class="f-eye" cx="${f(ex)}" cy="${f(ey)}" r="2.1"/><circle class="f-pupil" cx="${f(ex)}" cy="${f(ey)}" r="1"/>`;
      });
      if (now < until) raf = requestAnimationFrame(frame); else raf = 0;
    }
    return {
      start(ms, fresh) {
        if (fresh) { epoch = Date.now(); try { sessionStorage.setItem("fishEpoch", String(epoch)); } catch (_) {} }
        until = performance.now() + ms; if (!raf) raf = requestAnimationFrame(frame);
      }
    };
  })();
  if (document.documentElement.classList.contains("vt-in")) FISH.start(1400);
  // animated page transitions between pages of this site
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]"); if (!a) return;
    const href = a.getAttribute("href");
    if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || !/^[\w-]+\.html(#[\w.~-]*)?$/.test(href)) return;
    e.preventDefault();
    if (href.split("#")[0] === PAGE && href.includes("#")) { location.hash = href.split("#")[1]; return; }
    try { sessionStorage.setItem("vt", "1"); } catch (_) {}
    if (REDUCED || !v) { location.href = href; return; }
    v.style.setProperty("--vx", e.clientX + "px"); v.style.setProperty("--vy", e.clientY + "px");
    document.documentElement.classList.remove("vt-in"); v.classList.add("out"); FISH.start(4000, true);
    // once the loader covers the screen, quietly return this page to its top so nothing carries over
    setTimeout(() => { scrollTo({ top: 0, left: 0, behavior: "instant" }); }, 650);
    setTimeout(() => { location.href = href; }, 900);
  });
  addEventListener("pageshow", e => { if (e.persisted && v) v.classList.remove("out"); });
})();

/* ---------------- pastel wash (home, countdown, RSVP): a soft colour field that drifts, wobbles and parts around the cursor ---------------- */
/* ---------------- the painted page ----------------
   Soft pools of colour laid onto the whole length of the page, like watercolour on paper: each pool lives at a
   place on the page and scrolls with it. The paint is computed coarse, only around what's on screen, and the
   browser smooths it up; it breathes very slowly and stirs a little under the cursor. */
function paintPage(cv, seed, opts = {}) {
  const ctx = cv.getContext("2d", { alpha: false });
  const CELL = 10, PAPER = [251, 246, 234];
  const BLUSH = [240, 189, 178], PEACH = [242, 198, 180], SEA = [176, 216, 204], ROSE = [242, 196, 186], CREAM = [243, 232, 203], LIGHT = [252, 247, 236];
  let W = 1, H = 1, VH = 1, gw = 1, gh = 1, pools = [], t = 0, last = performance.now(), dirty = true;
  // a small seeded random, so each page always gets the same painting
  let st = 2166136261; for (const ch of String(seed || "home")) st = Math.imul(st ^ ch.charCodeAt(0), 16777619);
  const rand = () => { st = (st + 0x6D2B79F5) | 0; let x = Math.imul(st ^ (st >>> 15), 1 | st); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  function layout() {
    const R0 = rand; st ^= 0x9E37; pools = [];
    const step = VH * .46, n = Math.ceil((H + VH * .4) / step) + 1;
    const tints = [[BLUSH, .27], [SEA, .40], [PEACH, .36], [ROSE, .24], [SEA, .38], [PEACH, .32]];
    let side = rand() < .5 ? -1 : 1, k = Math.floor(rand() * tints.length);
    for (let i = 0; i < n; i++) {
      const y = -VH * .15 + i * step + (rand() - .5) * step * .5;
      const [c, a] = tints[k++ % tints.length];
      // a coloured pool towards one edge…
      pools.push({ c, a, x: .5 + side * (.22 + rand() * .2), y, r: .30 + rand() * .14, ph: rand() * 6.28, f: .1 + rand() * .1 });
      // …now and then a second, smaller one tucked in the other side
      if (rand() < .45) { const [c2, a2] = tints[(k + 2) % tints.length]; pools.push({ c: c2, a: a2 * .85, x: .5 - side * (.3 + rand() * .15), y: y + step * (.3 + rand() * .3), r: .2 + rand() * .1, ph: rand() * 6.28, f: .12 + rand() * .1 }); }
      // and the reading column stays light: soft cream and paper laid over the middle
      pools.push({ c: i % 2 ? CREAM : LIGHT, a: .7, x: .5 + (rand() - .5) * .16, y: y + step * .5, r: .36 + rand() * .1, ph: rand() * 6.28, f: .08 });
      side = -side;
    }
    if (opts.sky) {
      // Our Story: the sea green becomes the sky above the park, deeper at the top and paling toward the horizon,
      // where the page's own blush and peach take over. No other sea green floats in the first screen.
      const top = VH * .62;
      pools = pools.filter(p => !(p.y < top && (p.c === SEA || p.c === CREAM || p.c === LIGHT)));
      const SKY = [184, 219, 209], SKY2 = [200, 228, 219], HAZE = [230, 239, 231];
      for (let k = 0; k < 5; k++) pools.push({ c: SKY, a: .5, x: -.04 + k * .27 + (rand() - .5) * .06, y: VH * (.02 + rand() * .06), r: .36 + rand() * .06, ph: rand() * 6.28, f: .06 + rand() * .04 });
      for (let k = 0; k < 4; k++) pools.push({ c: SKY2, a: .38, x: .1 + k * .27 + (rand() - .5) * .06, y: VH * (.24 + rand() * .06), r: .32 + rand() * .06, ph: rand() * 6.28, f: .06 + rand() * .04 });
      for (let k = 0; k < 3; k++) pools.push({ c: HAZE, a: .3, x: .2 + k * .3 + (rand() - .5) * .08, y: VH * (.42 + rand() * .05), r: .3 + rand() * .05, ph: rand() * 6.28, f: .05 });
    }
  }
  function size() {
    cv.style.height = "0px";                                   // measure the page without the painting itself
    W = document.documentElement.clientWidth; VH = innerHeight;
    H = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, VH);
    gw = Math.ceil(W / CELL) + 1; gh = Math.ceil(H / CELL) + 1;
    cv.width = gw; cv.height = gh; cv.style.width = W + "px"; cv.style.height = H + "px";
    st = 2166136261; for (const ch of String(seed || "home")) st = Math.imul(st ^ ch.charCodeAt(0), 16777619);
    layout(); paint(0, gh); dirty = false;
  }
  const m = { x: -1e4, y: -1e4, on: false }, e = { x: -1e4, y: -1e4, p: 0, en: 0 };
  addEventListener("pointermove", ev => {
    const x = ev.clientX, y = ev.clientY + scrollY;
    if (!m.on) { e.x = x; e.y = y; }
    e.en = Math.min(1, e.en + Math.hypot(x - m.x, y - m.y) / 260); m.x = x; m.y = y; m.on = true;
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { m.on = false; });
  // paint rows [r0, r1) of the coarse field, in page coordinates
  function paint(r0, r1) {
    r0 = Math.max(0, r0); r1 = Math.min(gh, r1); if (r1 <= r0) return;
    const S = Math.min(W, VH), Rs = Math.max(W, VH) * .62, y0 = r0 * CELL, y1 = r1 * CELL;
    const B = [];
    for (const p of pools) {
      const r = p.r * Rs * (1 + .05 * Math.sin(t * p.f * 1.7 + p.ph));
      const y = p.y + Math.cos(t * p.f * .9 + p.ph) * VH * .03;
      if (y + r * 2.6 < y0 || y - r * 2.6 > y1) continue;
      B.push({ c: p.c, a: p.a, x: (p.x + Math.sin(t * p.f + p.ph) * .035) * W, y, r2: r * r });
    }
    const img = ctx.createImageData(gw, r1 - r0), d = img.data;
    const cx = e.x, cy = e.y, sig = S * .34, sig2 = 2 * sig * sig, push = e.p * S * .1, rip = e.en * S * .024;
    for (let j = r0; j < r1; j++) {
      const py = j * CELL;
      for (let i = 0; i < gw; i++) {
        const px = i * CELL;
        // the paper's slow, wet wobble, fixed to the page
        let x = px + Math.sin(py * .0052 + t * .4) * 26 + Math.sin((px + py) * .0027 - t * .28) * 18;
        let y = py + Math.cos(px * .0049 - t * .34) * 24 + Math.sin((px - py) * .0031 + t * .22) * 16;
        const dx = px - cx, dy = py - cy, dd = dx * dx + dy * dy;
        if (dd < sig2 * 4) { const dist = Math.sqrt(dd) + .001, fall = Math.exp(-dd / sig2), k = (push * fall + rip * Math.sin(dist * .045 - t * 7) * fall) / dist; x -= dx * k; y -= dy * k; }
        let R = 0, G = 0, Bc = 0, Wt = 0;
        for (let n = 0; n < B.length; n++) { const b = B[n], ex = x - b.x, ey = y - b.y, wt = b.a * Math.exp(-(ex * ex + ey * ey) / b.r2); R += b.c[0] * wt; G += b.c[1] * wt; Bc += b.c[2] * wt; Wt += wt; }
        const keep = Math.max(0, 1 - Wt), norm = Wt > 1 ? 1 / Wt : 1, glow = e.p * .14 * Math.exp(-dd / (sig2 * .45));
        const o = ((j - r0) * gw + i) * 4;
        d[o] = Math.min(255, PAPER[0] * keep + R * norm + (255 - PAPER[0]) * glow);
        d[o + 1] = Math.min(255, PAPER[1] * keep + G * norm + (252 - PAPER[1]) * glow);
        d[o + 2] = Math.min(255, PAPER[2] * keep + Bc * norm + (246 - PAPER[2]) * glow);
        d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, r0);
  }
  function frame(now) {
    if (document.hidden) { last = now; return requestAnimationFrame(frame); }
    const dt = Math.min(50, now - last); last = now; t += dt / 1000;
    e.x += (m.x - e.x) * .1; e.y += (m.y - e.y) * .1; e.p += ((m.on ? 1 : 0) - e.p) * .05; e.en *= .965;
    if (dirty) size();
    // only the part of the page near the screen is repainted each frame; the rest keeps its paint
    const top = Math.floor((scrollY - VH * .35) / CELL), bot = Math.ceil((scrollY + VH * 1.35) / CELL);
    paint(top, bot);
    requestAnimationFrame(frame);
  }
  let rt = 0; const resized = () => { clearTimeout(rt); rt = setTimeout(() => { dirty = true; if (REDUCED) { size(); } }, 120); };
  addEventListener("resize", resized);
  if (window.ResizeObserver) new ResizeObserver(resized).observe(document.body);
  size();
  if (!REDUCED) requestAnimationFrame(frame);
}

/* ---------------- one painted wash behind every page (same colours everywhere, laid out differently per page) ---------------- */
(function () {
  const cv = document.createElement("canvas"); cv.id = "bgWash"; cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);
  paintPage(cv, PAGE === "index.html" ? null : PAGE, { sky: PAGE === "story.html" });
})();

/* ---------------- shared scroll loop ---------------- */
const SCROLL = [];
const onScroll = fn => { SCROLL.push(fn); };
(function () {
  const prog = $("#prog"); let ticking = false;
  function run() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    SCROLL.forEach(f => f());
  }
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
  addEventListener("scroll", queue, { passive: true }); addEventListener("resize", queue);
  window.refreshScroll = queue;
  addEventListener("load", queue); queue();
})();

/* ---------------- reveals ---------------- */
addEventListener("DOMContentLoaded", function () {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(el => io.observe(el));
});

/* ---------------- cursor glitter: fine, warm, softly glowing ---------------- */
(function glitter() {
  if (REDUCED) return;
  const cv = document.createElement("canvas"); cv.id = "glitter"; cv.setAttribute("aria-hidden", "true");
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  let W, H, D;
  function size() { D = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; ctx.setTransform(D, 0, 0, D, 0, 0); }
  size(); addEventListener("resize", size);
  function sprite(stops, s = 64) {
    const c = document.createElement("canvas"); c.width = c.height = s; const g = c.getContext("2d");
    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); stops.forEach(([o, col]) => gr.addColorStop(o, col));
    g.fillStyle = gr; g.fillRect(0, 0, s, s); return c;
  }
  // soft halos: warm gold and blush
  const HALO = [sprite([[0, "rgba(236,190,110,.5)"], [.35, "rgba(224,168,86,.12)"], [1, "rgba(224,168,86,0)"]])];
  const CORE = ["#F8DC98", "#EFC46E", "#E2AB52", "#D69B40", "#FBE6B2"];
  const P = [];
  let mx = -1, my = -1, lx = -1, ly = -1, hover = false, running = false, last = 0;
  function spawn(x, y, n, spread, burst) {
    for (let i = 0; i < n && P.length < 450; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.random() * spread, sp = (burst ? .4 : .04) + Math.random() * (burst ? .9 : .3);
      P.push({
        x: x + Math.cos(a) * r, y: y + Math.sin(a) * r,
        vx: Math.cos(a) * sp + (Math.random() - .5) * .15, vy: Math.sin(a) * sp - .08 - Math.random() * .18,
        s: .16 + Math.pow(Math.random(), 3) * .5,               // mostly tiny, a few slightly larger
        life: 0, max: 650 + Math.random() * 1400,
        tw: Math.random() * 6.283, tws: .006 + Math.random() * .022,
        c: CORE[(Math.random() * CORE.length) | 0],
        h: 0,
        star: Math.random() < .07
      });
    }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); }
  }
  addEventListener("pointermove", e => {
    mx = e.clientX; my = e.clientY;
    if (e.pointerType === "mouse") hover = true;
    if (lx < 0) { lx = mx; ly = my; }
    const d = Math.hypot(mx - lx, my - ly), n = Math.min(24, Math.round(d / 2.6));
    for (let k = 0; k < n; k++) { const t = k / n; spawn(lerp(lx, mx, t), lerp(ly, my, t), Math.random() < .5 ? 2 : 1, 7); }
    lx = mx; ly = my;
  }, { passive: true });
  addEventListener("pointerdown", e => { spawn(e.clientX, e.clientY, 30, 8, true); if (e.pointerType !== "mouse") { lx = e.clientX; ly = e.clientY; } }, { passive: true });
  addEventListener("pointerup", e => { if (e.pointerType !== "mouse") lx = ly = -1; });
  document.documentElement.addEventListener("mouseleave", () => { hover = false; lx = ly = -1; });
  function loop(now) {
    const dt = Math.min(50, now - last); last = now;
    ctx.clearRect(0, 0, W, H);
    if (hover && Math.random() < .55) spawn(mx, my, 1, 12);          // a quiet aura while the cursor rests
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i]; p.life += dt;
      if (p.life > p.max) { P.splice(i, 1); continue; }
      const f = dt * .06;
      p.x += p.vx * f; p.y += p.vy * f;
      p.vx *= Math.pow(.975, f); p.vy = p.vy * Math.pow(.975, f) - .004 * f;   // drift and float upward
      const k = p.life / p.max, fade = k < .12 ? k / .12 : 1 - (k - .12) / .88;
      p.tw += p.tws * dt;
      const tw = .5 + .5 * Math.sin(p.tw), a = fade * (.35 + .65 * tw);
      const hs = p.s * 3.5 + 1.2;
      ctx.globalAlpha = a * .7; ctx.drawImage(HALO[p.h], p.x - hs, p.y - hs, hs * 2, hs * 2);
      ctx.globalAlpha = a; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill();
      if (p.star && tw > .75) {                                     // occasional fine four-point glint
        const L = p.s * 7 * tw; ctx.strokeStyle = p.c; ctx.lineWidth = .3;
        ctx.beginPath(); ctx.moveTo(p.x - L, p.y); ctx.lineTo(p.x + L, p.y); ctx.moveTo(p.x, p.y - L); ctx.lineTo(p.x, p.y + L); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    if (P.length || hover) requestAnimationFrame(loop); else { running = false; ctx.clearRect(0, 0, W, H); }
  }
})();
