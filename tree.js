/* A full tree on the right of the park: a broad trunk, several limbs reaching out naturally beneath a large crown,
   and two mourning doves that fly in one after the other and settle on the lower-left limb, facing each other.
   Painted in soft layers, no outlines, to match the rest of the scene. */
function parkTree(R) {
  const K = 1.3, TX = 990, TY = 486;                                     // the whole tree is drawn at 1.3× and planted at (TX, TY)
  const place = `translate(${TX} ${TY}) scale(${K}) translate(-868 -490)`;
  const LS = .82, CM = 1.45;                                             // a bigger tree has more leaves, not bigger ones
  const f = n => (+n).toFixed(1);
  const pick = a => a[Math.floor(R() * a.length)];
  // ---- a limb: a tapering quadratic ribbon from the trunk outward ----
  const limb = (P0, C, P1, w0, w1) => {
    const at = t => { const m = 1 - t; return [m * m * P0[0] + 2 * m * t * C[0] + t * t * P1[0], m * m * P0[1] + 2 * m * t * C[1] + t * t * P1[1]]; };
    const tan = t => { const m = 1 - t; return [2 * m * (C[0] - P0[0]) + 2 * t * (P1[0] - C[0]), 2 * m * (C[1] - P0[1]) + 2 * t * (P1[1] - C[1])]; };
    const wAt = t => (w0 - w1) * Math.pow(1 - t, 1.1) + w1;
    const up = P1[0] < P0[0] ? 1 : -1;                                   // normal that points upward, whichever way the limb runs
    const edge = (t, k) => { const p = at(t), d = tan(t), l = Math.hypot(...d), w = wAt(t) * k; return [p[0] + up * d[1] / l * w, p[1] - up * d[0] / l * w]; };
    const ribbon = (k1, k2, t0 = 0, t1 = 1) => { const A = [], B = [];
      for (let i = 0; i <= 40; i++) { const t = t0 + (t1 - t0) * i / 40; A.push(edge(t, k1)); B.push(edge(t, k2)); }
      return "M" + A.map(p => f(p[0]) + " " + f(p[1])).join("L") + "L" + B.reverse().map(p => f(p[0]) + " " + f(p[1])).join("L") + "Z"; };
    const tAtX = x => { let best = 0, bd = 1e9; for (let i = 0; i <= 300; i++) { const t = i / 300, d = Math.abs(at(t)[0] - x); if (d < bd) { bd = d; best = t; } } return best; };
    const svgOf = () => `<path d="${ribbon(1, -1)}" fill="url(#bark)"/><path d="${ribbon(1, .45, 0, .96)}" fill="#D2BCAB" opacity=".5"/><path d="${ribbon(-.55, -1, 0, .96)}" fill="#86695B" opacity=".33"/>`;
    return { at, tan, edge, tAtX, svg: svgOf() };
  };
  // ---- leaves ----
  const GR = ["#A9C3A0", "#9DB896", "#8FAE8C", "#B7CDA8", "#84A48F", "#C2D3B0"];
  const leaf = (x, y, s, a, c) => (s *= LS, `<path d="M0 0C${f(4 * s)} ${f(-3.4 * s)} ${f(10 * s)} ${f(-3.2 * s)} ${f(15 * s)} 0C${f(10 * s)} ${f(2.8 * s)} ${f(4 * s)} ${f(3 * s)} 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})" fill="${c}"/>`);
  const sway = (g, d = 4.5) => `<g class="rustle" style="--rd:${(d + R() * 3).toFixed(1)}s;--rdl:${(-R() * 6).toFixed(1)}s">${g}</g>`;
  const spray = (x, y, ang, len, s0) => {
    const a = ang * Math.PI / 180, ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len + len * .22, mx = (x + ex) / 2, my = (y + ey) / 2 - len * .12;
    let g = `<path d="M${f(x)} ${f(y)}Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}" stroke="#A48C7C" stroke-width="${f(1.1 * s0)}" fill="none" stroke-linecap="round"/>`;
    const n = Math.round(len / 7);
    for (let i = 1; i <= n; i++) { const t = i / (n + .4), m = 1 - t, px = m * m * x + 2 * m * t * mx + t * t * ex, py = m * m * y + 2 * m * t * my + t * t * ey,
        dir = Math.atan2(2 * m * (my - y) + 2 * t * (ey - my), 2 * m * (mx - x) + 2 * t * (ex - mx)) * 180 / Math.PI, sz = s0 * (.75 + .35 * Math.sin(t * Math.PI));
      g += leaf(px, py, sz, dir - 48 - R() * 14, pick(GR)) + leaf(px, py, sz * .95, dir + 48 + R() * 14, pick(GR)); }
    g += leaf(ex, ey, s0 * .8, Math.atan2(ey - my, ex - mx) * 180 / Math.PI, pick(GR));
    return sway(g); };
  const along = (L, xs) => xs.map(([x, top, ang, len, s0]) => { const e = L.edge(L.tAtX(x), top ? .7 : -.7); return spray(e[0], e[1], ang, len, s0); }).join("");

  // ---- limbs. The doves' limb reaches left beneath the crown; the others spread out naturally ----
  const perchL = limb([880, 300], [820, 238], [610, 224], 17, 2);           // the doves' limb
  const limbs = [
    limb([884, 270], [968, 236], [1060, 238], 15, 2),                       // lower right
    limb([860, 210], [800, 168], [720, 150], 15, 3),                        // upper left, up into the crown
    limb([892, 196], [950, 156], [1022, 120], 14, 3),                       // upper right
    limb([878, 160], [872, 100], [846, 40], 14, 4),                         // the leader, straight up
    limb([862, 338], [828, 318], [792, 318], 8, 1.4)                        // a short low twig
  ];
  const sprays = along(perchL, [[624, 1, -150, 30, 1], [616, 0, 150, 30, .95], [640, 0, 110, 36, 1.05], [672, 0, 80, 40, 1.05], [700, 1, -60, 30, 1], [836, 0, 100, 34, 1.05]])
    + along(limbs[0], [[1010, 0, 70, 40, 1.1], [1052, 1, -20, 30, 1], [960, 0, 110, 36, 1.05], [1046, 0, 30, 32, 1]])
    + along(limbs[4], [[798, 1, -160, 26, .95], [796, 0, 140, 30, .95], [818, 0, 100, 26, .9]]);
  // ---- crown: a large canopy of soft painted masses, lifted on the left so the doves sit in its shade ----
  const blobs = [[906, 84, 150, 94, "#93B091"], [772, 130, 84, 50, "#A2BC9C"], [1042, 110, 98, 78, "#86A68B"], [896, 20, 112, 46, "#B0C8A6"],
    [1004, 200, 110, 46, "#8FAE8C"], [884, 184, 84, 38, "#9AB694"], [1030, 34, 78, 50, "#A6BF9E"], [802, 70, 56, 38, "#B4CBA9"]];
  let masses = blobs.map(([x, y, rx, ry, c]) => `<ellipse class="lobe" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" opacity=".82"/>`).join("")
    + `<ellipse cx="870" cy="28" rx="96" ry="40" fill="#C3D5B2" opacity=".45"/><ellipse cx="940" cy="186" rx="150" ry="42" fill="#7E9C8A" opacity=".3"/>`;
  let crown = "", edgeTufts = "";
  for (const [x, y, rx, ry] of blobs) {
    const n = Math.round((rx + ry) * .38 * CM);
    for (let i = 0; i < n; i++) { const a = R() * Math.PI * 2, r = .84 + R() * .26, lf = leaf(x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r, 1.35 + R() * .55, a * 180 / Math.PI + (R() - .5) * 70, pick(GR));
      if (i % 9 === 0) edgeTufts += sway(lf, 5); else crown += lf; }
    for (let i = 0; i < n * .6; i++) { const a = R() * Math.PI * 2, r = Math.sqrt(R()) * .8;
      crown += leaf(x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r, 1.2 + R() * .45, R() * 360, pick(GR)); }
  }
  const canopy = `<g class="crown"><g filter="url(#brush)">${masses}</g><g class="rustle big" style="--rd:7s;--rdl:-2s">${crown}</g>${edgeTufts}</g>`;
  // ---- trunk: broad at the root, its upper part repeated above the limbs so every join reads cleanly ----
  const trunkD = "M806 492C824 472 830 440 832 400C836 340 840 290 846 250C848 222 846 196 840 172C834 150 826 130 816 112L830 104C842 120 852 140 858 160C864 136 876 112 894 92L906 100C894 124 888 150 886 180C884 216 886 252 888 292C890 342 894 392 900 432C904 458 916 478 936 492Z";
  const bark = `<g transform="translate(868 0) scale(1.3 1) translate(-868 0)"><path d="${trunkD}" fill="url(#trunkG)"/>
    <path d="M852 480C852 420 854 350 858 292C860 250 858 214 852 184M866 300C868 250 866 210 870 170" stroke="#E7D3C2" stroke-width="2.4" opacity=".32" fill="none" stroke-linecap="round"/>
    <path d="M890 476C886 430 884 380 882 330M876 262c-2-16-2-34 2-52M842 440c4-20 6-44 6-70" stroke="#7A6256" stroke-width="2.2" opacity=".24" fill="none" stroke-linecap="round"/>
    <path d="M836 398c6 4 10 4 14 0M872 352c5 3 9 3 12 0" stroke="#7A6256" stroke-width="2" opacity=".28" fill="none" stroke-linecap="round"/></g>`;
  const trunk = `<g filter="url(#brush)">${bark}</g>`;
  const defs = `
    <linearGradient id="trunkG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A48A7A"/><stop offset=".42" stop-color="#C6AF9E"/><stop offset="1" stop-color="#8A7063"/></linearGradient>
    <linearGradient id="bark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9B2A1"/><stop offset=".55" stop-color="#B09684"/><stop offset="1" stop-color="#8F7566"/></linearGradient>
    <clipPath id="trunkTop"><rect x="700" y="-300" width="400" height="640"/></clipPath>
    <linearGradient id="dvBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CDB29C"/><stop offset=".55" stop-color="#D9BFA9"/><stop offset="1" stop-color="#EBD3C3"/></linearGradient>
    <radialGradient id="dvBreast" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#EFC9BE"/><stop offset="1" stop-color="#EFC9BE" stop-opacity="0"/></radialGradient>
    <linearGradient id="dvWing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C4B4A9"/><stop offset=".55" stop-color="#ACA3A3"/><stop offset="1" stop-color="#97A0AA"/></linearGradient>
    <linearGradient id="dvHead" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8BEA8"/><stop offset="1" stop-color="#C3A28B"/></linearGradient>
    <linearGradient id="dvTail" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#B9A595"/><stop offset=".7" stop-color="#A29591"/><stop offset=".86" stop-color="#5E5559"/><stop offset="1" stop-color="#E8DCCD"/></linearGradient>`;
  // ---- a mourning dove facing right; feet at (0,0). Perched and flying poses share one body ----
  const dove = () => `
    <g class="dove">
      <g class="dv-fly" opacity="0"><g class="dv-wing far"><path d="M-4 -17C-10 -36 -2 -54 16 -62C11 -48 10 -32 6 -19Z" fill="#9FA0A8" opacity=".9"/></g></g>
      <path d="M-11 -10C-24 -8 -38 -4 -52 1C-50 4 -44 5 -38 4C-28 2 -18 -1 -9 -4Z" fill="url(#dvTail)"/>
      <path d="M-15 -9C-17 -19 -6 -25 6 -24C15 -23 20 -17 18 -10C15 -3 5 0 -4 -1C-10 -2 -14 -5 -15 -9Z" fill="url(#dvBody)"/>
      <ellipse cx="9" cy="-11" rx="8.5" ry="7" fill="url(#dvBreast)"/>
      <path d="M8 -20C10 -26 12 -30 15 -32C19 -31 20 -27 18 -22C16 -18 13 -16 10 -15Z" fill="url(#dvHead)"/>
      <ellipse cx="16.6" cy="-31.2" rx="5.4" ry="4.8" fill="url(#dvHead)"/>
      <path d="M21.6 -31.6Q24.4 -31 25.4 -30Q23.6 -29.8 21.6 -29.6Z" fill="#4E4144"/>
      <circle cx="18.2" cy="-32" r="1.9" fill="#A9CBCF"/><circle cx="18.3" cy="-32" r="1.15" fill="#2A2224"/>
      <ellipse cx="17" cy="-28.2" rx="1.1" ry=".7" fill="#3E3538" opacity=".55"/>
      <g class="dv-perch"><path d="M-14 -13C-8 -21 4 -22 11 -15C9 -8 -2 -5 -26 -5C-24 -8 -19 -11 -14 -13Z" fill="url(#dvWing)"/>
        <path d="M-22 -6C-12 -7 -2 -8 6 -11" stroke="#8C8C96" stroke-width=".8" opacity=".5" fill="none"/>
        <ellipse cx="-3" cy="-14" rx="1.6" ry="1.1" fill="#45393D" opacity=".8"/><ellipse cx="2.6" cy="-12.4" rx="1.5" ry="1" fill="#45393D" opacity=".8"/>
        <ellipse cx="-8" cy="-11.6" rx="1.4" ry="1" fill="#45393D" opacity=".75"/><ellipse cx="-1.6" cy="-9.6" rx="1.2" ry=".8" fill="#45393D" opacity=".6"/></g>
      <g class="dv-fly" opacity="0"><g class="dv-wing near"><path d="M-8 -14C-20 -32 -14 -56 6 -66C3 -50 6 -30 6 -14Z" fill="url(#dvWing)"/>
        <ellipse cx="-4" cy="-38" rx="1.6" ry="1.1" fill="#45393D" opacity=".6"/><ellipse cx="0" cy="-30" rx="1.5" ry="1" fill="#45393D" opacity=".6"/></g></g>
      <path class="dv-feet" d="M0 -2.5L-.6 0.4M4 -2.5L4.4 0.4" stroke="#D07E86" stroke-width="1.5" stroke-linecap="round"/>
    </g>`;
  const perch = x => { const t = perchL.tAtX(x), e = perchL.edge(t, .92), d = perchL.tan(t); return [e[0], e[1] + 1.2, Math.atan2(-d[1], -d[0]) * 180 / Math.PI]; };
  const A = perch(736), B = perch(784);
  return { K, place, defs, trunk,
    branch: `<g filter="url(#brush)">${limbs.map(l => l.svg).join("")}${perchL.svg}<g clip-path="url(#trunkTop)">${bark}</g></g>`,
    leaves: sprays + canopy,
    doves: [[A, 1, "doveA"], [B, -1, "doveB"]].map(([p, face, id]) => `<g class="dove-wrap" id="${id}" data-x="${f(p[0])}" data-y="${f(p[1])}" data-r="${f(p[2])}" data-face="${face}" opacity="0" aria-hidden="true">${dove()}</g>`).join("") };
}

/* the doves fly in, one after the other, flapping, then fold their wings and settle */
function flyDoves(svg, K = 1) {
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches, S = 1.1 / K;   // the doves keep their size however big the tree is drawn
  // the first sweeps in from the left across the open sky; the second comes from the right, under the crown
  const birds = [["#doveA", [-900, 300], [300, 140], 900, 3000], ["#doveB", [1760, 360], [1180, 330], 2300, 2400]];
  birds.forEach(([sel, from, c, delay, D]) => {
    const g = svg.querySelector(sel), tx = +g.dataset.x, ty = +g.dataset.y, face = +g.dataset.face, tr = +g.dataset.r || 0;
    const put = (x, y, rot) => g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${(face * S).toFixed(2)} ${S})`);
    const far = g.querySelector(".dv-wing.far"), near = g.querySelector(".dv-wing.near");
    // wingbeats, as plain SVG transforms hinged at each wing's root (CSS transform animations inside a moving group glitch in Safari)
    const flap = (now, fast) => { const p = now / (fast ? 180 : 260) * Math.PI, k = a => (1 - 1.55 * (.5 - .5 * Math.cos(a))).toFixed(3);
      far.setAttribute("transform", `translate(0 -18) scale(1 ${k(p + .5)}) translate(0 18)`); near.setAttribute("transform", `translate(0 -14) scale(1 ${k(p)}) translate(0 14)`); };
    // flying and sitting poses switch with opacity attributes
    const flyParts = [...g.querySelectorAll(".dv-fly")], sitParts = [...g.querySelectorAll(".dv-perch, .dv-feet")];
    const pose = fly => { flyParts.forEach(e => e.setAttribute("opacity", fly ? 1 : 0)); sitParts.forEach(e => e.setAttribute("opacity", fly ? 0 : 1)); };
    const land = () => { put(tx, ty, tr); pose(false); g.setAttribute("opacity", 1); };
    if (REDUCE) return land();
    put(from[0], from[1], 0);                          // waits out of sight, and only appears once its flight begins
    setTimeout(() => {
      pose(true); g.setAttribute("opacity", 1);
      const t0 = performance.now();
      const step = now => {
        const t = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - t, 2.4), m = 1 - e;
        const x = m * m * from[0] + 2 * m * e * c[0] + e * e * tx, y = m * m * from[1] + 2 * m * e * c[1] + e * e * ty;
        const dy = 2 * m * (c[1] - from[1]) + 2 * e * (ty - c[1]);
        put(x, y - (1 - t) * 6, Math.max(-14, Math.min(14, dy * .02 * face)) * (1 - e) + tr * e);
        flap(now, t > .88);
        if (t < 1) requestAnimationFrame(step); else land();
      };
      requestAnimationFrame(step);
    }, delay);
  });
}
