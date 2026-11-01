/* The park: a floating island of grass with a bench, a street lamp and the two of us.
   Painted in soft layers (no outlines), like the swans, butterflies and fish. */
function parkScene(svg, opts = {}) {
  let seed = 4127; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const f = n => n.toFixed(1);
  const GR = ["#A9C3A0", "#9DB896", "#8BAA88", "#7E9C8A", "#B7CDA8", "#6E8F7C", "#C3D5B2", "#93AF8C"];
  const pick = a => a[Math.floor(R() * a.length)];

  const BX = 540, BW = 300, SY = 410;   // the bench (drawn later, scaled up around its feet)
  // ---------- the island ----------
  const CX = 600, CY = 470, RX = 530, RY = 76;
  const pts = [];
  for (let i = 0; i < 90; i++) { const a = i / 90 * Math.PI * 2, n = 1 + Math.sin(a * 3 + .7) * .05 + Math.sin(a * 7 + 2) * .035 + (R() - .5) * .03;
    pts.push([CX + Math.cos(a) * RX * n * (a > 0 && a < Math.PI ? 1 : .97), CY + Math.sin(a) * RY * n * (Math.sin(a) > 0 ? 1.15 : .8)]); }
  const isle = "M" + pts.map(p => f(p[0]) + " " + f(p[1])).join("L") + "Z";
  const inside = (x, y) => ((x - CX) / RX) ** 2 + ((y - CY) / (RY * (y > CY ? 1.1 : .78))) ** 2 < 1;
  // a grass blade: a filled, tapered, slightly curved leaf
  const blade = (x, y, h, lean, w, col, op) => { const tx = x + lean, ty = y - h, c1x = x + lean * .25, c1y = y - h * .6;
    return `<path d="M${f(x - w)} ${f(y)}Q${f(c1x - w * .6)} ${f(c1y)} ${f(tx)} ${f(ty)}Q${f(c1x + w * .7)} ${f(c1y)} ${f(x + w)} ${f(y)}Z" fill="${col}" opacity="${op}"/>`; };
  // wind: every tuft bends from its base, and the phase follows x so each gust rolls across the meadow from left to right
  const wind = (x, amp = 1) => `--sd:${(2.6 + R() * .5).toFixed(2)}s;--sdl:${(-6 + (x - CX + RX) / (2 * RX) * 2.4 + R() * .35).toFixed(2)}s;--sa:${((4 + R() * 4) * amp).toFixed(1)}deg`;
  const clump = (x, y, n, hMin, hMax, spread, cls, op = .92, down = 0) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      const bx = x + (R() - .5) * spread, hh = hMin + R() * (hMax - hMin), h = down ? -hh * .6 : hh, lean = (R() - .5) * hh * .8;
      s += blade(bx, y + (R() - .5) * 3, h, lean, .9 + R() * 1.6, pick(GR), (op * (.7 + R() * .3)).toFixed(2));
    }
    return `<g class="sway ${cls}" style="${wind(x)}">${s}</g>`;
  };
  const flower = (x, y, c, r) => {
    let p = ""; for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + R(); const px = x + Math.cos(a) * r * .8, py = y + Math.sin(a) * r * .6;
      p += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="${f(r * .7)}" ry="${f(r * .5)}" transform="rotate(${f(a * 57.3)} ${f(px)} ${f(py)})" fill="${c}"/>`; }
    return `${p}<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * .42)}" fill="#E9C987"/>`;
  };
  const FLOW = ["#F2C7BE", "#F2C6B4", "#FFF4E4", "#C4E0D8", "#E0959A", "#FFF4E4", "#F7D9C4"];
  let under = "", back = "", beside = "", mid = "", front = "", fringe = "", flowers = "";
  // anything whose tip would rise over the two of us is drawn behind us instead, so our legs and feet stay clear
  const legs = (x, top) => Math.abs(x - BX) < 152 && top < 490;            // 490: just below where our feet rest
  // a mottled ground: soft patches of lighter and darker green
  for (let i = 0; i < 48; i++) { const x = CX + (R() - .5) * RX * 1.7, y = CY + (R() - .5) * RY * 1.2; if (!inside(x, y)) continue;
    under += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(20 + R() * 60)}" ry="${f(6 + R() * 14)}" fill="${pick(GR)}" opacity="${(.25 + R() * .3).toFixed(2)}"/>`; }
  for (let x = CX - RX + 60; x < CX + RX - 60; x += 9 + R() * 10) back += clump(x, CY - RY * .66 + R() * 16, 10, 12, Math.abs(x - BX) < 215 ? 26 : 40, 22, "b", .85);
  for (let i = 0; i < 510; i++) { const x = CX + (R() - .5) * RX * 1.96, y = CY - RY * .62 + R() * RY * 1.6; if (!inside(x, y)) continue; const near = Math.abs(x - BX) < 215 && y < CY + 34, hm = near ? 11 : 22, c = clump(x, y, 7, 5, hm, 16, "m"); if (legs(x, y - hm)) beside += c; else mid += c; }
  for (const [px, py] of pts) { if (py < CY - RY * .4) { const c = clump(px, py + 3, 5, 6, 16, 14, "fr", .8); if (legs(px, py - 13)) beside += c; else fringe += c; continue; }
    fringe += clump(px, py - 3, 7, 6, 18, 16, "fr", .9); fringe += clump(px + (R() - .5) * 10, py - 6, 5, 6, 16, 14, "fr", .85, 1); }
  for (let i = 0; i < 110; i++) { const x = CX + (R() - .5) * RX * 1.8, y = CY - RY * .4 + R() * RY * 1.3; if (!inside(x, y)) continue; const h = 6 + R() * 18;
    const fl = `<g class="sway fl" style="${wind(x, .6)}"><path d="M${f(x)} ${f(y)}q${f((R() - .5) * 6)} ${f(-h * .5)} ${f((R() - .5) * 4)} ${f(-h)}" stroke="#7E9C8A" stroke-width=".9" fill="none"/>${flower(x, y - h, FLOW[i % FLOW.length], 1.8 + R() * 1.6)}</g>`;
    if (legs(x, y - h)) beside += fl; else flowers += fl; }
  for (let x = CX - RX + 20; x < CX + RX - 20; x += 6 + R() * 6) { const y = CY + RY * .5 + R() * RY * .55; if (!inside(x, y)) continue; const c = clump(x, y, 6, 6, 20, 14, "f"); if (legs(x, y - 20)) beside += c; else front += c; }

  // ---------- the lamp: an old iron street lamp with a warm lantern ----------
  const LX = 262, LB = 436, LT = 128;
  const lamp = `
    <g class="lamp">
      <ellipse cx="${LX}" cy="${LB + 3}" rx="26" ry="5" fill="#2E2A2C" opacity=".22"/>
      <path d="M${LX - 15} ${LB}c0-8 4-12 8-16h14c4 4 8 8 8 16z" fill="url(#iron)"/>
      <path d="M${LX - 8} ${LB - 16}c1-10 3-20 4-34h8c1 14 3 24 4 34z" fill="url(#iron)"/>
      <rect x="${LX - 9}" y="${LB - 52}" width="18" height="4" rx="2" fill="#4A4144"/>
      <rect x="${LX - 3}" y="${LT + 52}" width="6" height="${LB - LT - 104}" rx="2" fill="url(#iron)"/>
      <rect x="${LX - 6.5}" y="${LT + 150}" width="13" height="4" rx="2" fill="#4A4144"/>
      <rect x="${LX - 5.5}" y="${LT + 156}" width="11" height="3" rx="1.5" fill="#4A4144"/>
      <path d="M${LX - 6} ${LT + 52}h12l-2-8h-8z" fill="url(#iron)"/>
      <path d="M${LX - 9} ${LT + 44}h18l3-6h-24z" fill="#3B3436"/>
      <path class="glassP" d="M${LX - 12} ${LT + 38}h24l7-46h-38z" fill="url(#glass)"/>
      <path d="M${LX - 12} ${LT + 38}l-7-46M${LX + 12} ${LT + 38}l7-46M${LX} ${LT + 38}v-46M${LX - 15.5} ${LT + 14}h31" stroke="#3B3436" stroke-width="1.5" fill="none"/>
      <path d="M${LX - 26} ${LT - 8}h52c-6-6 -14-12 -26-26c-12 14 -20 20 -26 26z" fill="url(#iron)"/>
      <path d="M${LX - 28} ${LT - 6}c4-1 6-3 8-6M${LX + 28} ${LT - 6}c-4-1 -6-3 -8-6" stroke="#3B3436" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M${LX} ${LT - 34}c-3 0 -4-3 -2-6l2-4 2 4c2 3 1 6 -2 6z" fill="#4A4144"/>
      <ellipse class="flame" cx="${LX}" cy="${LT + 16}" rx="6" ry="10" fill="#FFF8E4"/>
      <ellipse cx="${LX}" cy="${LT + 16}" rx="12" ry="18" fill="#FFF1CC" opacity=".55" filter="url(#blur3)"/>
    </g>`;

  // ---------- the bench ----------
  let slats = ""; for (let i = 0; i < 5; i++) slats += `<rect x="${BX - BW / 2 + 6}" y="${328 + i * 12.5}" width="${BW - 12}" height="8.6" rx="2.2" fill="url(#wood)"/><rect x="${BX - BW / 2 + 6}" y="${328 + i * 12.5}" width="${BW - 12}" height="1.4" rx=".7" fill="#F0D3B6" opacity=".55"/>`;
  const bench = `
    <g class="bench">
      <ellipse cx="${BX}" cy="${SY + 58}" rx="${BW * .6}" ry="10" fill="#3B3436" opacity=".16" filter="url(#blur3)"/>
      <path d="M${BX - BW / 2 + 20} ${SY + 12}l-6 46h10l5-46zM${BX + BW / 2 - 20} ${SY + 12}l6 46h-10l-5-46z" fill="url(#iron)"/>
      ${slats}
      <path d="M${BX - BW / 2 + 22} 322v${SY - 322}h7v${-(SY - 322)}zM${BX + BW / 2 - 29} 322v${SY - 322}h7v${-(SY - 322)}z" fill="url(#iron)"/>
      <path d="M${BX - BW / 2 - 8} ${SY}h${BW + 16}l-9 13h${-(BW - 2)}z" fill="url(#woodSeat)"/>
      <path d="M${BX - BW / 2 - 8} ${SY}h${BW + 16}" stroke="#F0D3B6" stroke-width="1.3" opacity=".7"/>
      <path d="M${BX - BW / 2 + 4} ${SY + 13}h${BW - 8}" stroke="#3B3436" stroke-width="3" stroke-linecap="round"/>
      <path d="M${BX - BW / 2 - 6} ${SY - 1}c-8-2 -9-9 -3-14c3-2 7-2 9 1M${BX + BW / 2 + 6} ${SY - 1}c8-2 9-9 3-14c-3-2 -7-2 -9 1" stroke="#3B3436" stroke-width="4" stroke-linecap="round" fill="none"/>
    </g>`;

  // ---------- the two of us: seated, holding hands, leaning in ----------
  const shade = (d, c, o = .22) => `<path d="${d}" fill="${c}" opacity="${o}"/>`;
  // adult proportions: head ~1/6.5 of seated height
  const her = (x) => `
    <g class="her">
      <path d="M${x - 13} ${SY + 10}c-1 14 0 28 1 40h7c0-12 1-26 1-38zM${x + 4} ${SY + 10}c0 12 1 26 2 38h7c0-12 -1-26 -1-38z" fill="url(#skin)"/>
      ${shade(`M${x - 6} ${SY + 12}c0 12 0 24 0 36h1.5c0-12 1-24 1-36zM${x + 11} ${SY + 12}c0 12 0 24 1 36h1.5c0-12 -1-24 -1-36z`, "#8E5A40", .25)}
      <path d="M${x - 15} ${SY + 50}c0-3 3-4 6-4h3c2 0 3 2 3 5h-12zM${x + 4} ${SY + 49}c0-3 3-4 6-4h3c2 0 3 2 3 5h-12z" fill="#6E1F2C"/>
      <path d="M${x - 21} ${SY - 12}c-4 6 -5 14 -5 22c0 6 4 9 10 9c6 0 9-2 12-3c3 1 6 3 12 3c6 0 10-3 10-9c0-8 -1-16 -5-22z" fill="url(#dress)"/>
      <path d="M${x - 8} ${SY - 6}c-1 6 -2 12 -2 18M${x + 2} ${SY - 6}c0 6 0 12 1 18M${x + 12} ${SY - 6}c1 6 2 12 2 18" stroke="#8B2C3A" stroke-width="1" opacity=".3" fill="none"/>
      <path d="M${x - 16} ${SY - 74}C${x - 22} ${SY - 70} ${x - 21} ${SY - 50} ${x - 15} ${SY - 38}C${x - 12} ${SY - 30} ${x - 18} ${SY - 20} ${x - 21} ${SY - 11}H${x + 21}C${x + 18} ${SY - 20} ${x + 12} ${SY - 30} ${x + 15} ${SY - 38}C${x + 21} ${SY - 50} ${x + 22} ${SY - 70} ${x + 16} ${SY - 74}C${x + 7} ${SY - 78} ${x - 7} ${SY - 78} ${x - 16} ${SY - 74}Z" fill="url(#dress)"/>
      ${shade(`M${x + 10} ${SY - 75}C${x + 20} ${SY - 68} ${x + 20} ${SY - 50} ${x + 14} ${SY - 38}C${x + 11} ${SY - 30} ${x + 17} ${SY - 20} ${x + 20} ${SY - 12}H${x + 12}C${x + 10} ${SY - 30} ${x + 14} ${SY - 55} ${x + 10} ${SY - 75}Z`, "#6E1F2C", .16)}
      <path d="M${x - 14} ${SY - 37}Q${x} ${SY - 34} ${x + 14} ${SY - 37}" stroke="#8B2C3A" stroke-width="1.2" opacity=".35" fill="none"/>
      <path d="M${x - 8} ${SY - 77}q8 6 16 0" stroke="#F8D2D2" stroke-width="1.3" fill="none"/>
      <path d="M${x - 17} ${SY - 68}c-4 10 -6 20 -5 28" stroke="url(#skin)" stroke-width="5.8" stroke-linecap="round" fill="none"/>
      <path d="M${x - 22} ${SY - 40}c2 14 8 26 16 32" stroke="url(#skin)" stroke-width="4.8" stroke-linecap="round" fill="none"/>
      <path d="M${x + 17} ${SY - 68}c4 10 5 20 4 28" stroke="url(#skin)" stroke-width="5.8" stroke-linecap="round" fill="none"/>
      <path d="M${x + 21} ${SY - 40}c4 14 12 26 22 34" stroke="url(#skin)" stroke-width="4.8" stroke-linecap="round" fill="none"/>
      <path d="M${x - 17} ${SY - 73}c-5 2 -7 8 -7 13h10c0-4 1-8 3-12zM${x + 17} ${SY - 73}c5 2 7 8 7 13h-10c0-4 -1-8 -3-12z" fill="url(#dress)"/>
      <ellipse cx="${x - 5}" cy="${SY - 8}" rx="4.4" ry="3.2" fill="url(#skin)"/>
      <path d="M${x - 4} ${SY - 84}h8v9h-8z" fill="url(#skin)"/>
      <g class="head" transform="rotate(10 ${x} ${SY - 92})">
        <path d="M${x - 13} ${SY - 99}c-4 14 -3 30 -8 44c6 4 12 4 18 0l1-30zM${x + 12} ${SY - 99}c4 12 4 28 7 40c-4 4 -9 4 -13 1l-2-26z" fill="url(#hairHer)"/>
        <ellipse cx="${x}" cy="${SY - 95}" rx="11" ry="13.4" fill="url(#face)"/>
        ${shade(`M${x + 5} ${SY - 106}c6 3 7 10 6 17c-2 5 -5 8 -8 10c3-8 4-18 2-27z`, "#A0674C", .24)}
        <path d="M${x - 12} ${SY - 97}c-1-12 6-17 14-16c8 1 12 7 11 15c-3-5 -7-8 -12-8c-3 5 -8 7 -13 9z" fill="url(#hairHer)"/>
        <path d="M${x - 1} ${SY - 107}c3-1.6 8-.8 10 2.6" stroke="#6E5450" stroke-width="1" opacity=".55" fill="none" stroke-linecap="round"/>
        <path d="M${x - 6.8} ${SY - 98.6}q2.2-1 4.2.2M${x + 2.2} ${SY - 98.6}q2.2-1.2 4.2 0" stroke="#3B2B2E" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M${x - 6.6} ${SY - 95}q2.2 2 4.4 0M${x + 2.2} ${SY - 95}q2.2 2 4.4 0" stroke="#2E2224" stroke-width="1.1" fill="none" stroke-linecap="round"/>
        <path d="M${x - .2} ${SY - 93.4}q1.2 2.6 -.4 3.4" stroke="#A0674C" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M${x - 2.8} ${SY - 87.8}q2.8 2.4 5.6 0" stroke="#6E1F2C" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="${x - 7}" cy="${SY - 90.6}" rx="2.5" ry="1.4" fill="#E0959A" opacity=".5"/><ellipse cx="${x + 7}" cy="${SY - 90.6}" rx="2.5" ry="1.4" fill="#E0959A" opacity=".5"/>
        <circle cx="${x - 10.6}" cy="${SY - 91}" r="1.1" fill="#E9C987"/>
      </g>
    </g>`;
  const him = (x) => `
    <g class="him">
      <path d="M${x - 15} ${SY + 10}c-1 14 -1 28 0 40h10c0-12 0-26 1-38zM${x + 4} ${SY + 10}c0 12 1 26 1 40h10c0-14 0-28 -1-40z" fill="url(#pants)"/>
      <path d="M${x - 18} ${SY + 50}c0-3 3-4 6-4h6c2 0 3 2 3 5h-15zM${x + 3} ${SY + 50}c0-3 3-4 6-4h6c2 0 3 2 3 5h-15z" fill="#3B3436"/>
      <path d="M${x - 23} ${SY - 12}c-4 6 -5 14 -5 21c0 6 5 9 12 9c6 0 9-2 13-3c4 1 7 3 13 3c7 0 12-3 12-9c0-7 -1-15 -5-21z" fill="url(#pants)"/>
      <path d="M${x} ${SY - 8}c0 6 0 12 0 16" stroke="#32403F" stroke-width="1" opacity=".5"/>
      <path d="M${x - 20} ${SY - 80}C${x - 27} ${SY - 76} ${x - 26} ${SY - 56} ${x - 20} ${SY - 42}C${x - 17} ${SY - 32} ${x - 22} ${SY - 20} ${x - 24} ${SY - 10}H${x + 24}C${x + 22} ${SY - 20} ${x + 17} ${SY - 32} ${x + 20} ${SY - 42}C${x + 26} ${SY - 56} ${x + 27} ${SY - 76} ${x + 20} ${SY - 80}C${x + 9} ${SY - 85} ${x - 9} ${SY - 85} ${x - 20} ${SY - 80}Z" fill="url(#shirt)"/>
      ${shade(`M${x + 13} ${SY - 81}C${x + 25} ${SY - 74} ${x + 25} ${SY - 56} ${x + 19} ${SY - 42}C${x + 16} ${SY - 32} ${x + 21} ${SY - 20} ${x + 23} ${SY - 11}H${x + 15}C${x + 12} ${SY - 34} ${x + 17} ${SY - 60} ${x + 13} ${SY - 81}Z`, "#3E7973", .2)}
      <path d="M${x - 6} ${SY - 83}l6 8 6-8" stroke="#3E7973" stroke-width="1.2" fill="none" opacity=".55"/>
      <path d="M${x} ${SY - 75}v64" stroke="#3E7973" stroke-width=".8" opacity=".3"/>
      <path d="M${x + 20} ${SY - 72}c5 10 6 22 5 32" stroke="url(#skin)" stroke-width="6.6" stroke-linecap="round" fill="none"/>
      <path d="M${x + 25} ${SY - 40}c-2 14 -8 26 -17 32" stroke="url(#skin)" stroke-width="5.4" stroke-linecap="round" fill="none"/>
      <path d="M${x - 20} ${SY - 72}c-5 10 -6 22 -5 32" stroke="url(#skin)" stroke-width="6.6" stroke-linecap="round" fill="none"/>
      <path d="M${x - 25} ${SY - 40}c-4 14 -10 26 -18 34" stroke="url(#skin)" stroke-width="5.4" stroke-linecap="round" fill="none"/>
      <path d="M${x - 21} ${SY - 77}c-6 3 -8 12 -9 24l12 1c0-8 1-16 3-22zM${x + 21} ${SY - 77}c6 3 8 12 9 24l-12 1c0-8 -1-16 -3-22z" fill="url(#shirt)"/>
      <ellipse cx="${x + 6}" cy="${SY - 8}" rx="5" ry="3.6" fill="url(#skin)"/>
      <path d="M${x - 4.5} ${SY - 90}h9v11h-9z" fill="url(#skin)"/>
      <g class="head" transform="rotate(-8 ${x} ${SY - 102})">
        <ellipse cx="${x - 11.4}" cy="${SY - 101}" rx="2.2" ry="3.4" fill="url(#skin)"/><ellipse cx="${x + 11.4}" cy="${SY - 101}" rx="2.2" ry="3.4" fill="url(#skin)"/>
        <ellipse cx="${x}" cy="${SY - 102}" rx="11.6" ry="14" fill="url(#face)"/>
        ${shade(`M${x + 5.5} ${SY - 113}c6 3 7 10 6 17c-2 5 -5 8 -8 10c3-8 4-18 2-27z`, "#A0674C", .24)}
        <path d="M${x - 12} ${SY - 104}c-3-12 6-19 16-18c8 2 12 8 10 17c-3-5 -7-7 -12-8c-2 3 -7 7 -14 9z" fill="url(#hairHim)"/>
        <path d="M${x - 7} ${SY - 106.4}q2.3-1.2 4.5 0M${x + 2.5} ${SY - 106.4}q2.3-1.2 4.5 0" stroke="#2E2224" stroke-width="1.1" fill="none" stroke-linecap="round"/>
        <path d="M${x - 6.8} ${SY - 102}q2.2 2 4.4 0M${x + 2.4} ${SY - 102}q2.2 2 4.4 0" stroke="#2E2224" stroke-width="1.1" fill="none" stroke-linecap="round"/>
        <path d="M${x} ${SY - 100}q1.3 2.8 -.4 3.8" stroke="#A0674C" stroke-width=".85" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M${x - 3.6} ${SY - 94}q3.6 3 7.2 0" stroke="#7E3E44" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </g>
    </g>`;
  // their hands meet between them, on the bench
  const HX = BX - 2, HY = SY - 5;
  const hands = `<g class="hands"><ellipse cx="${HX - 3}" cy="${HY}" rx="5" ry="3.6" fill="url(#skin)"/><ellipse cx="${HX + 3}" cy="${HY - .6}" rx="5.2" ry="3.8" fill="url(#skin)"/><path d="M${HX - 2} ${HY - 3}q3 2 6 0" stroke="#A0674C" stroke-width=".8" fill="none" opacity=".6"/></g>`;

  // warm light catching everything near the lamp
  const motes = Array.from({ length: 16 }, () => `<circle class="mote" cx="${f(LX + (R() - .4) * 260)}" cy="${f(LT + 30 + R() * 280)}" r="${f(.8 + R() * 1.5)}" style="--md:${(6 + R() * 6).toFixed(1)}s;--mdl:${(-R() * 12).toFixed(1)}s;--mx:${f((R() - .5) * 36)}px;--my:${f(-24 - R() * 40)}px"/>`).join("");
  const SC = .21, IW = 1102 * SC, IH = 1420 * SC, HEM = 880 * SC, SEAT = 386;   // the couple artwork: its shorts hem (knee line) sits on the bench edge
  const T = parkTree(R);
  svg.innerHTML = `
    <defs>${T.defs}
      <radialGradient id="halo" cx="${LX}" cy="${LT + 14}" r="260" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF4D6" stop-opacity="1"/><stop offset=".12" stop-color="#FCE6B8" stop-opacity=".75"/><stop offset=".42" stop-color="#F8DCB0" stop-opacity=".26"/><stop offset="1" stop-color="#F8DCB0" stop-opacity="0"/></radialGradient>
      <radialGradient id="pool" cx="${LX + 70}" cy="${LB + 10}" r="250" gradientTransform="translate(${LX + 70} ${LB + 10}) scale(1 .26) translate(${-(LX + 70)} ${-(LB + 10)})" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFEBB8" stop-opacity=".8"/><stop offset=".6" stop-color="#FFEBB8" stop-opacity=".25"/><stop offset="1" stop-color="#FFEBB8" stop-opacity="0"/></radialGradient>
      <radialGradient id="dusk" cx=".45" cy=".6" r=".5"><stop offset="0" stop-color="#F5D9CB" stop-opacity=".75"/><stop offset=".55" stop-color="#F2E2D4" stop-opacity=".32"/><stop offset="1" stop-color="#F3E8DA" stop-opacity="0"/></radialGradient>
      <linearGradient id="earth" x1="0" y1="${CY - RY}" x2="0" y2="${CY + RY}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#B7CDA8"/><stop offset=".5" stop-color="#9DB896"/><stop offset="1" stop-color="#7A9A86"/></linearGradient>
      <linearGradient id="warm" x1="${LX}" y1="0" x2="${LX + 380}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFE3A8" stop-opacity=".4"/><stop offset="1" stop-color="#FFE3A8" stop-opacity="0"/></linearGradient>
      <linearGradient id="iron" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2E2A2C"/><stop offset=".4" stop-color="#5E5558"/><stop offset="1" stop-color="#2A2628"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8E6"/><stop offset=".6" stop-color="#FCE6B4"/><stop offset="1" stop-color="#F3CF8E"/></linearGradient>
      <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4A27E"/><stop offset=".5" stop-color="#BC8864"/><stop offset="1" stop-color="#9C6A4E"/></linearGradient>
      <linearGradient id="woodSeat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6A27E"/><stop offset="1" stop-color="#946349"/></linearGradient>
      <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8A07C"/><stop offset="1" stop-color="#B07858"/></linearGradient>
      <radialGradient id="face" cx=".38" cy=".36" r=".72"><stop offset="0" stop-color="#E4B392"/><stop offset=".65" stop-color="#CC9372"/><stop offset="1" stop-color="#B07858"/></radialGradient>
      <linearGradient id="hairHer" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5A4442"/><stop offset=".45" stop-color="#2E2224"/><stop offset="1" stop-color="#1C1516"/></linearGradient>
      <linearGradient id="hairHim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A3B3C"/><stop offset="1" stop-color="#1C1516"/></linearGradient>
      <linearGradient id="dress" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8D2D2"/><stop offset=".45" stop-color="#EDA7AB"/><stop offset="1" stop-color="#8B2C3A"/></linearGradient>
      <linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D5E9E4"/><stop offset=".45" stop-color="#A0CBC0"/><stop offset="1" stop-color="#4D8680"/></linearGradient>
      <linearGradient id="pants" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E5C5B"/><stop offset=".5" stop-color="#5E6974"/><stop offset="1" stop-color="#3D4B49"/></linearGradient>
      <filter id="brush" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1"/></filter>
      <filter id="blur3"><feGaussianBlur stdDeviation="3"/></filter>
      <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
    </defs>
    <ellipse cx="640" cy="300" rx="700" ry="340" fill="url(#dusk)"/>
    <circle class="halo" cx="${LX}" cy="${LT + 14}" r="260" fill="url(#halo)"/>
    <ellipse cx="${CX}" cy="${CY + 30}" rx="${RX * .9}" ry="${RY * .55}" fill="#6E8F7C" opacity=".24" filter="url(#blur8)"/>
    <g class="tree-back" transform="${T.place}">${T.trunk}</g>
    <path d="${isle}" fill="url(#earth)"/>
    <g>${under}</g>
    <ellipse cx="${LX + 70}" cy="${LB + 10}" rx="250" ry="66" fill="url(#pool)" class="pool"/>
    <g>${back}</g>
    <g filter="url(#brush)">${lamp}<g transform="translate(${BX} ${SY + 58}) scale(1.5) translate(${-BX} ${-(SY + 58)})">${bench}</g></g>
    <g>${beside}</g>
    <g class="couple">${(opts.images || []).map((src, i) => `<g class="cpl${i ? "" : " on"}"><ellipse cx="${BX}" cy="${SEAT + 99}" rx="105" ry="7" fill="#3B3436" opacity=".16" filter="url(#blur3)"/><g transform="translate(${BX} ${SEAT}) scale(${(opts.scale || [])[i] || 1}) translate(${-BX} ${-SEAT})"><image href="${src}" x="${f(BX - IW / 2)}" y="${f(SEAT - HEM)}" width="${f(IW)}" height="${f(IH)}" preserveAspectRatio="xMidYMax meet"/></g>${(opts.extras || [])[i] || ""}</g>`).join("")}</g>
    <rect x="${LX}" y="250" width="380" height="230" fill="url(#warm)" style="mix-blend-mode:soft-light" pointer-events="none"/>
    <g>${mid}${flowers}${fringe}${front}</g>
    <g class="tree-top" transform="${T.place}">${T.branch}${T.leaves}</g>
    <g class="doves" transform="${T.place}">${T.doves}</g>
    <g class="motes">${motes}</g>`;
  flyDoves(svg, T.K);
  const groups = [...svg.querySelectorAll(".cpl")];
  return { count: groups.length, set(k) { groups.forEach((g, i) => g.classList.toggle("on", i === k)); } };
}
