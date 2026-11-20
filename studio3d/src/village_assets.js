
// ===================== « DANS CETTE VILLE… ET C'EST VRAI » : village documentaire (Béarn) =====================
const vstd = (c, o = {}) => new THREE.MeshStandardMaterial({color: c, roughness: .85, ...o});
const VG = new THREE.Group(); scene.add(VG);
function noiseTex(w, h, base, spots, n = 3000, sz = 2){ return canvasTex(w, h, (c) => { c.fillStyle = base; c.fillRect(0, 0, w, h); for (let i = 0; i < n; i++){ const s = spots[i % spots.length]; c.fillStyle = s; c.globalAlpha = Math.random() * .25; c.fillRect(Math.random() * w, Math.random() * h, sz + Math.random() * sz, sz + Math.random() * sz); } c.globalAlpha = 1; }); }
// ---- terrain : collines + champs en patchwork ----
const fieldTex = canvasTex(1024, 1024, (c) => { const cols = ['#7fa548', '#8db552', '#a7b85a', '#6f9a42', '#c2b464', '#93ad4e', '#7b9e3f']; const r = rng(11);
  for (let i = 0; i < 60; i++){ c.fillStyle = cols[Math.floor(r() * cols.length)]; c.save(); c.translate(r() * 1024, r() * 1024); c.rotate((r() - .5) * .6); c.fillRect(-120, -80, 140 + r() * 200, 100 + r() * 160); c.restore(); }
  c.strokeStyle = 'rgba(60,80,30,.35)'; c.lineWidth = 3; for (let i = 0; i < 40; i++){ c.beginPath(); c.moveTo(r() * 1024, r() * 1024); c.lineTo(r() * 1024, r() * 1024); c.stroke(); }
  for (let i = 0; i < 9000; i++){ c.fillStyle = `rgba(${r() < .5 ? '30,50,10' : '220,230,160'},${r() * .12})`; c.fillRect(r() * 1024, r() * 1024, 2, 2); } });
fieldTex.wrapS = fieldTex.wrapT = THREE.RepeatWrapping; fieldTex.repeat.set(3, 3);
function hillH(x, z){ const d = Math.hypot(x, z); const flat = Math.min(1, Math.max(0, (d - 40) / 60)); return flat * (Math.sin(x * .021) * 6 + Math.cos(z * .017 + 1) * 7 + Math.sin((x + z) * .011) * 9 + 6); }
{ const g = new THREE.PlaneGeometry(900, 900, 160, 160); g.rotateX(-Math.PI / 2); const pa = g.attributes.position; for (let i = 0; i < pa.count; i++) pa.setY(i, hillH(pa.getX(i), pa.getZ(i)) - .05); g.computeVertexNormals();
  const ground = new THREE.Mesh(g, vstd(0xffffff, {map: fieldTex})); ground.receiveShadow = true; VG.add(ground); }
// ---- les Pyrénées au fond ----
{ const r = rng(5); for (let i = 0; i < 16; i++){ const h = 90 + r() * 120, w = 120 + r() * 120; const g = new THREE.ConeGeometry(w, h, 7, 6); const pa = g.attributes.position; const col = [];
    for (let k = 0; k < pa.count; k++){ const y = pa.getY(k); pa.setX(k, pa.getX(k) * (1 + (r() - .5) * .25)); pa.setZ(k, pa.getZ(k) * (1 + (r() - .5) * .25)); const snow = (y + h / 2) / h > .62; const c2 = snow ? new THREE.Color(0xf4f6fa) : new THREE.Color(0x5d6f86).lerp(new THREE.Color(0x7d8f6a), r() * .3); col.push(c2.r, c2.g, c2.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({vertexColors: true, roughness: .95, flatShading: true})); m.position.set(-700 + i * 95 + r() * 40, h / 2 - 10, -520 - r() * 160); VG.add(m); } }
// ---- route sinueuse ----
const roadCurve = new THREE.CatmullRomCurve3([V(-160, 0, 140), V(-80, 0, 70), V(-30, 0, 30), V(0, 0, 4), V(28, 0, -18), V(70, 0, -60), V(150, 0, -120)]);
{ const pts = roadCurve.getSpacedPoints(160); const pos = [], uv = [], idx = []; const wR = 3.4;
  pts.forEach((p, i) => { const t = roadCurve.getTangentAt(i / 160); const n = V(-t.z, 0, t.x).normalize(); for (const s of [-1, 1]){ const q = p.clone().addScaledVector(n, s * wR); q.y = hillH(q.x, q.z) + .06; pos.push(q.x, q.y, q.z); uv.push(s < 0 ? 0 : 1, i * .5); } if (i){ const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  const rt2 = canvasTex(128, 256, (c) => { c.fillStyle = '#5b5a58'; c.fillRect(0, 0, 128, 256); for (let i = 0; i < 1500; i++){ c.fillStyle = `rgba(${Math.random() < .5 ? '0,0,0' : '255,255,255'},${Math.random() * .1})`; c.fillRect(Math.random() * 128, Math.random() * 256, 2, 2); } c.fillStyle = '#d8d4c8'; c.fillRect(4, 0, 4, 256); c.fillRect(120, 0, 4, 256); });
  rt2.wrapT = THREE.RepeatWrapping; const road = new THREE.Mesh(g, vstd(0xffffff, {map: rt2, polygonOffset: true, polygonOffsetFactor: -2})); road.receiveShadow = true; VG.add(road); }
// ---- maisons béarnaises : murs blancs, toits d'ardoise très pentus, volets ----
const plaster = noiseTex(256, 256, '#efe9dc', ['#d8cfbe', '#ffffff', '#cfc5b0'], 2500, 3);
const slate = canvasTex(256, 256, (c) => { c.fillStyle = '#3d4450'; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 16) for (let x = (y / 16) % 2 ? -10 : 0; x < 256; x += 20){ c.fillStyle = `hsl(215,${8 + Math.random() * 8}%,${22 + Math.random() * 10}%)`; c.fillRect(x + 1, y + 1, 18, 14); } });
slate.wrapS = slate.wrapT = THREE.RepeatWrapping; slate.repeat.set(2, 2);
const MAT = {wall: vstd(0xffffff, {map: plaster}), roof: vstd(0xffffff, {map: slate, roughness: .6}), shutter: [vstd(0x7a2a22), vstd(0x2f5a3a), vstd(0x6b4a2a)], win: vstd(0x1e2630, {roughness: .2}), stone: vstd(0xb9ad96), wood: vstd(0x6a4a30)};
function roofGeo(w, d, h){ const g = new THREE.BufferGeometry(); const x = w / 2 + .4, z = d / 2 + .4; const v = [-x, 0, z, x, 0, z, 0, h, z, -x, 0, -z, x, 0, -z, 0, h, -z];
  const idx = [0, 1, 2, 4, 3, 5, 0, 2, 5, 0, 5, 3, 1, 4, 5, 1, 5, 2]; g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.setIndex(idx); g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, .5, 1, 0, 0, 1, 0, .5, 1], 2)); g.computeVertexNormals(); return g; }
function maison(x, z, rot = 0, w = 7, d = 9, h = 5.5, k = 0){ const g = new THREE.Group(); g.position.set(x, hillH(x, z), z); g.rotation.y = rot;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MAT.wall); body.position.y = h / 2; body.castShadow = body.receiveShadow = true; g.add(body);
  const roof = new THREE.Mesh(roofGeo(w, d, w * .85), MAT.roof); roof.position.y = h; roof.castShadow = true; g.add(roof);
  const ch = new THREE.Mesh(new THREE.BoxGeometry(.8, 2.2, .8), MAT.wall); ch.position.set(w * .25, h + w * .55, d * .2); g.add(ch);
  for (let i = 0; i < 2; i++) for (const fy of [1.6, 3.9]){ const wx = (i ? 1 : -1) * w * .26; const wn = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.3, .1), MAT.win); wn.position.set(wx, fy, d / 2 + .02); g.add(wn);
    for (const s of [-1, 1]){ const sh = new THREE.Mesh(new THREE.BoxGeometry(.55, 1.35, .08), MAT.shutter[k % 3]); sh.position.set(wx + s * .8, fy, d / 2 + .06); sh.rotation.y = s * .25; g.add(sh); } }
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.3, .12), MAT.wood); door.position.set(0, 1.15, d / 2 + .03); g.add(door);
  VG.add(g); return g; }
{ const r = rng(23); const spots = [[-22, 14], [-12, 26], [14, 22], [24, 10], [-28, -4], [-14, -16], [18, -14], [30, -26], [-34, 18], [6, 34], [-6, -30], [40, 4], [-42, -14], [36, 30], [-20, 40], [22, 44], [-48, 6], [48, -16]];
  spots.forEach(([x, z], i) => { const rs = Math.atan2(-x, -z) + (r() - .5) * .5; maison(x, z, rs, 6 + r() * 3, 8 + r() * 3, 4.8 + r() * 1.6, i); }); }
// ---- église romane : nef + clocher carré + flèche d'ardoise ----
const church = new THREE.Group(); VG.add(church); church.position.set(-4, 0, -6); church.rotation.y = .35;
{ const stoneT = noiseTex(256, 256, '#cdbf9f', ['#a8997a', '#e2d6bb', '#9b8c70'], 4000, 4); const sm = vstd(0xffffff, {map: stoneT});
  const nave = new THREE.Mesh(new THREE.BoxGeometry(8, 7, 16), sm); nave.position.set(0, 3.5, 4); nave.castShadow = true; church.add(nave);
  const nr = new THREE.Mesh(roofGeo(8, 16, 5), MAT.roof); nr.position.set(0, 7, 4); church.add(nr);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(5.5, 16, 5.5), sm); tower.position.set(0, 8, -5.5); tower.castShadow = true; church.add(tower);
  const spire = new THREE.Mesh(new THREE.ConeGeometry(4.3, 12, 4), MAT.roof); spire.rotation.y = Math.PI / 4; spire.position.set(0, 22, -5.5); spire.castShadow = true; church.add(spire);
  const cross = new THREE.Group(); cross.position.set(0, 29, -5.5); church.add(cross); const cv = new THREE.Mesh(new THREE.BoxGeometry(.15, 1.6, .15), vstd(0x2a2a2a, {metalness: .6})); cross.add(cv); const chh = new THREE.Mesh(new THREE.BoxGeometry(.9, .15, .15), vstd(0x2a2a2a, {metalness: .6})); chh.position.y = .3; cross.add(chh);
  const clock = new THREE.Mesh(new THREE.CircleGeometry(1.1, 32), vstd(0xffffff, {map: canvasTex(256, 256, (c) => { c.fillStyle = '#f5efe0'; c.beginPath(); c.arc(128, 128, 126, 0, 7); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 8; c.stroke(); c.lineWidth = 10; c.beginPath(); c.moveTo(128, 128); c.lineTo(128, 50); c.moveTo(128, 128); c.lineTo(185, 150); c.stroke(); })}));
  clock.position.set(0, 12.5, -2.7); church.add(clock);
  for (const z of [-2.7]){ const ab = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, .1), vstd(0x1a1a1a)); ab.position.set(0, 14.8, z - .02); church.add(ab); } }
// ---- cimetière plein ----
const cemetery = new THREE.Group(); VG.add(cemetery); cemetery.position.set(-30, 0, -40); cemetery.rotation.y = .3;
{ const gravel = noiseTex(256, 256, '#cfc6b3', ['#a89f8c', '#e8e0cf', '#8f8775'], 6000, 2); gravel.wrapS = gravel.wrapT = THREE.RepeatWrapping; gravel.repeat.set(3, 3);
  const base = new THREE.Mesh(new THREE.BoxGeometry(30, .3, 22), vstd(0xffffff, {map: gravel})); base.position.y = hillH(-30, -40) + .1; base.receiveShadow = true; cemetery.add(base); const by = base.position.y + .15;
  for (const [w, d, x, z] of [[30.6, .6, 0, 11], [30.6, .6, 0, -11], [.6, 22, 15, 0], [.6, 22, -15, 0]]){ const wall = new THREE.Mesh(new THREE.BoxGeometry(w, 1.6, d), MAT.stone); wall.position.set(x, by + .8, z); wall.castShadow = true; cemetery.add(wall); }
  const gate = new THREE.Mesh(new THREE.BoxGeometry(3, 2.4, .2), vstd(0x222222, {metalness: .6})); gate.position.set(0, by + 1.2, 11.05); cemetery.add(gate);
  const r = rng(77); const greys = [0x9a958c, 0xb8b2a6, 0x7d7a74, 0x5b5f66, 0xd6d0c4];
  cemetery.userData.graves = [];
  for (let row = 0; row < 8; row++) for (let col = 0; col < 13; col++){ const g = new THREE.Group(); g.position.set(-13 + col * 2.15, by, -9 + row * 2.4); const gm = vstd(greys[Math.floor(r() * greys.length)], {roughness: .55});
    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.2, .35, 2.0), gm); slab.position.y = .18; slab.castShadow = true; g.add(slab);
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0 + r() * .5, .2), gm); head.position.set(0, .7, -.95); head.castShadow = true; g.add(head);
    if (r() < .55){ const cv = new THREE.Mesh(new THREE.BoxGeometry(.12, .9, .12), gm); cv.position.set(0, 1.55, -.95); g.add(cv); const chh = new THREE.Mesh(new THREE.BoxGeometry(.6, .12, .12), gm); chh.position.set(0, 1.7, -.95); g.add(chh); }
    if (r() < .4){ const fl = new THREE.Mesh(new THREE.SphereGeometry(.22, 8, 6), vstd([0xd43a4a, 0xf2c94c, 0xffffff, 0x9b5de5][Math.floor(r() * 4)])); fl.position.set(.3, .45, .4); g.add(fl); }
    cemetery.add(g); cemetery.userData.graves.push(g); }
  for (const [x, z] of [[-16.5, -9], [-16.5, 0], [-16.5, 9], [16.5, -9], [16.5, 9]]){ const cy = new THREE.Mesh(new THREE.ConeGeometry(.9, 7, 10), vstd(0x2d4a2a)); cy.position.set(x, by + 3.5, z); cy.castShadow = true; cemetery.add(cy); } }
// ---- arbres : chênes + peupliers + haies ----
{ const r = rng(41); const greens = [0x4c7a32, 0x5d8a3a, 0x3f6b2c, 0x6a943f];
  for (let i = 0; i < 70; i++){ const a = r() * Math.PI * 2, d = 30 + r() * 120; const x = Math.cos(a) * d, z = Math.sin(a) * d; if (Math.abs(x + 30) < 18 && Math.abs(z + 40) < 14) continue; const t = new THREE.Group(); t.position.set(x, hillH(x, z), z);
    if (r() < .3){ const p = new THREE.Mesh(new THREE.ConeGeometry(1.4, 12, 8), vstd(0x557d34)); p.position.y = 7; p.castShadow = true; t.add(p); }
    else { const tr = new THREE.Mesh(new THREE.CylinderGeometry(.35, .5, 3), MAT.wood); tr.position.y = 1.5; t.add(tr); for (let k = 0; k < 5; k++){ const s = new THREE.Mesh(new THREE.IcosahedronGeometry(2 + r() * 1.4, 1), vstd(greens[Math.floor(r() * 4)], {flatShading: true})); s.position.set((r() - .5) * 2.6, 3.8 + r() * 2, (r() - .5) * 2.6); s.castShadow = true; t.add(s); } }
    VG.add(t); } }
// ---- mairie + panneau d'affichage + drapeau ----
const mairie = new THREE.Group(); VG.add(mairie); mairie.position.set(10, hillH(10, 4), 2); mairie.rotation.y = -.9;
{ const b = new THREE.Mesh(new THREE.BoxGeometry(10, 7, 8), MAT.wall); b.position.y = 3.5; b.castShadow = true; mairie.add(b); const rf = new THREE.Mesh(roofGeo(10, 8, 6), MAT.roof); rf.position.y = 7; mairie.add(rf);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(4.4, .9), vstd(0xffffff, {map: canvasTex(512, 104, (c) => { c.fillStyle = '#f3ecdc'; c.fillRect(0, 0, 512, 104); c.fillStyle = '#2a2a2a'; c.font = '700 70px "DejaVu Serif", serif'; c.textAlign = 'center'; c.fillText('MAIRIE', 256, 78); })}));
  sg.position.set(0, 5.6, 4.02); mairie.add(sg);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3, .12), MAT.wood); door.position.set(0, 1.5, 4.04); mairie.add(door);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 4), vstd(0xdddddd)); pole.position.set(2.2, 6.2, 4.3); pole.rotation.x = .7; mairie.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2, 8, 4), vstd(0xffffff, {side: THREE.DoubleSide, map: canvasTex(96, 64, (c) => { c.fillStyle = '#0055a4'; c.fillRect(0, 0, 32, 64); c.fillStyle = '#fff'; c.fillRect(32, 0, 32, 64); c.fillStyle = '#ef4135'; c.fillRect(64, 0, 32, 64); })})); flag.position.set(3.0, 7.4, 5.4); mairie.add(flag); mairie.userData.flag = flag;
  const board = new THREE.Group(); board.position.set(5, hillH(5, 13), 13); board.rotation.y = .3; VG.add(board); mairie.userData.board = board; for (const sx of [-1.05, 1.05]){ const post = new THREE.Mesh(new THREE.BoxGeometry(.14, 3.2, .14), MAT.wood); post.position.set(sx, 1.6, -.1); board.add(post); }
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, .14), MAT.wood); frame.position.y = 2.1; board.add(frame); const cork = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), vstd(0xb88a58)); cork.position.set(0, 2.1, .075); board.add(cork);
  const bt = new THREE.Mesh(new THREE.PlaneGeometry(2.3, .3), vstd(0xffffff, {map: canvasTex(512, 64, (c) => { c.fillStyle = '#2a2a2a'; c.fillRect(0, 0, 512, 64); c.fillStyle = '#f3ecdc'; c.font = '700 40px "DejaVu Serif", serif'; c.textAlign = 'center'; c.fillText('AFFICHAGE MUNICIPAL', 256, 46); })})); bt.position.set(0, 3.15, .08); board.add(bt); }
// ---- documents (reconstitution) ----
const PAPER = (draw) => canvasTex(820, 1160, (c) => { c.fillStyle = '#f6f0e1'; c.fillRect(0, 0, 820, 1160); for (let i = 0; i < 2500; i++){ c.fillStyle = `rgba(120,100,60,${Math.random() * .05})`; c.fillRect(Math.random() * 820, Math.random() * 1160, 3, 3); } c.fillStyle = '#1e1e1e'; c.textAlign = 'center'; draw(c); });
function wrapText(c, text, x, y, maxw, lh){ const words = text.split(' '); let line = ''; for (const w of words){ const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxw && line){ c.fillText(line, x, y); line = w; y += lh; } else line = t; } c.fillText(line, x, y); return y; }
const arreteTex = PAPER((c) => { c.font = '700 40px "DejaVu Serif", serif'; c.fillText('RÉPUBLIQUE FRANÇAISE', 410, 110); c.font = '400 30px "DejaVu Serif", serif'; c.fillText('Commune de Sarpourenx', 410, 160);
  c.font = '700 64px "DejaVu Serif", serif'; c.fillText('ARRÊTÉ MUNICIPAL', 410, 290); c.fillRect(160, 320, 500, 3); c.font = '400 38px "DejaVu Serif", serif';
  let y = wrapText(c, 'Il est interdit à toute personne ne disposant pas d\'une place au cimetière de mourir sur le territoire de la commune.', 410, 420, 680, 56);
  c.font = '700 40px "DejaVu Serif", serif'; wrapText(c, 'Les contrevenants seront sévèrement punis.', 410, y + 110, 680, 56);
  c.font = 'italic 32px "DejaVu Serif", serif'; c.fillText('Le Maire', 600, 980); c.strokeStyle = '#1b2a6b'; c.lineWidth = 4; c.beginPath(); c.moveTo(520, 1040); c.bezierCurveTo(580, 990, 610, 1080, 680, 1020); c.stroke();
  c.strokeStyle = 'rgba(30,60,140,.55)'; c.lineWidth = 6; c.beginPath(); c.arc(220, 1010, 85, 0, 7); c.stroke(); c.fillStyle = 'rgba(30,60,140,.55)'; c.font = '700 22px "DejaVu Serif", serif'; c.fillText('MAIRIE DE', 220, 1000); c.fillText('SARPOURENX', 220, 1030); });
const tribunalTex = PAPER((c) => { c.font = '700 36px "DejaVu Serif", serif'; c.fillText('TRIBUNAL ADMINISTRATIF', 410, 120); c.font = '400 30px "DejaVu Serif", serif'; c.fillText('Décision', 410, 170);
  c.font = '400 34px "DejaVu Serif", serif'; wrapText(c, 'Objet : acquisition d\'un terrain privé en vue de l\'agrandissement du cimetière communal.', 410, 290, 660, 50);
  c.fillStyle = '#888'; for (let i = 0; i < 9; i++) c.fillRect(110, 470 + i * 46, 600 - (i % 3) * 70, 12); });
const deskGroup = new THREE.Group(); scene.add(deskGroup);
{ const woodT = canvasTex(512, 512, (c) => { c.fillStyle = '#5a3a22'; c.fillRect(0, 0, 512, 512); for (let i = 0; i < 90; i++){ c.strokeStyle = `rgba(${Math.random() < .5 ? '30,15,5' : '120,80,45'},${.15 + Math.random() * .2})`; c.lineWidth = 1 + Math.random() * 3; c.beginPath(); const y = Math.random() * 512; c.moveTo(0, y); c.bezierCurveTo(170, y + 20 * (Math.random() - .5), 340, y + 20 * (Math.random() - .5), 512, y); c.stroke(); } });
  const top = new THREE.Mesh(new THREE.BoxGeometry(14, .5, 9), vstd(0xffffff, {map: woodT, roughness: .45})); top.receiveShadow = true; deskGroup.add(top);
  const trib = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.97), vstd(0xffffff, {map: tribunalTex, roughness: .9})); trib.rotation.x = -Math.PI / 2; trib.rotation.z = .12; trib.position.set(-1.3, .26, .2); trib.receiveShadow = true; deskGroup.add(trib); deskGroup.userData.trib = trib;
  const arr = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.97), vstd(0xffffff, {map: arreteTex, roughness: .9})); arr.rotation.x = -Math.PI / 2; arr.rotation.z = -.06; arr.position.set(1.4, .27, .1); arr.receiveShadow = true; deskGroup.add(arr); deskGroup.userData.arr = arr;
  const pen = new THREE.Group(); const body = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1.3, 16), vstd(0x111111, {roughness: .2, metalness: .3})); body.rotation.z = Math.PI / 2; pen.add(body); const nib = new THREE.Mesh(new THREE.ConeGeometry(.06, .25, 12), vstd(0xd4af37, {metalness: .9, roughness: .2})); nib.rotation.z = Math.PI / 2; nib.position.x = .77; pen.add(nib);
  deskGroup.add(pen); deskGroup.userData.pen = pen;
  const lampL = new THREE.PointLight(0xffd6a0, 9, 12, 1.6); lampL.position.set(-2, 4, -1.5); deskGroup.add(lampL); deskGroup.userData.lamp = lampL;
  const hand = new THREE.Group(); const palm = new THREE.Mesh(new THREE.SphereGeometry(.32, 16, 12), vstd(0xe2b48f, {roughness: .7})); palm.scale.set(1.1, .55, 1.3); hand.add(palm);
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(.3, .34, 2.4, 16), vstd(0x2a3242)); sleeve.rotation.x = Math.PI / 2; sleeve.position.z = 1.5; hand.add(sleeve);
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(.31, .31, .18, 16), vstd(0xf2f2f2)); cuff.rotation.x = Math.PI / 2; cuff.position.z = .38; hand.add(cuff);
  for (let i = 0; i < 4; i++){ const f = new THREE.Mesh(new THREE.CapsuleGeometry(.065, .32, 4, 8), vstd(0xe2b48f, {roughness: .7})); f.rotation.x = Math.PI / 2 - .3; f.position.set(-.2 + i * .13, -.05, -.42); hand.add(f); }
  deskGroup.add(hand); deskGroup.userData.hand = hand;
  const stamp = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .45), new THREE.MeshBasicMaterial({transparent: true, map: canvasTex(512, 192, (c) => { c.strokeStyle = '#b3121b'; c.lineWidth = 12; c.strokeRect(10, 10, 492, 172); c.fillStyle = '#b3121b'; c.font = '900 110px "DejaVu Serif", serif'; c.textAlign = 'center'; c.fillText('REJETÉ', 256, 135); })}));
  stamp.rotation.x = -Math.PI / 2; stamp.rotation.z = .35; stamp.position.set(-1.25, .29, .5); deskGroup.add(stamp); deskGroup.userData.stamp = stamp; }
// arrêté épinglé sur le panneau
const pinned = new THREE.Mesh(new THREE.PlaneGeometry(.95, 1.34), vstd(0xffffff, {map: arreteTex, roughness: .9})); scene.add(pinned);
const pins = [0, 1].map(() => { const p = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), vstd(0xc0102a)); scene.add(p); return p; });
// ---- habitants âgés (figurines) ----
const OFACE = {}; function oldFace(mood, skin = '#e8c3a0'){ const k = mood + skin; if (OFACE[k]) return OFACE[k]; return OFACE[k] = canvasTex(256, 256, (c) => { c.fillStyle = skin; c.fillRect(0, 0, 256, 256);
  const big = mood !== 'calm'; for (const ex of [92, 164]){ c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, 118, big ? 17 : 14, big ? 19 : 9, 0, 0, 7); c.fill(); c.fillStyle = '#2a1e18'; c.beginPath(); c.arc(ex + (mood === 'side' ? 7 : mood === 'side2' ? -7 : 0), 120, 7, 0, 7); c.fill(); }
  c.strokeStyle = '#d0d0d0'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(66, 88 - (big ? 8 : 0)); c.lineTo(114, 96); c.moveTo(142, 96); c.lineTo(190, 88 - (big ? 8 : 0)); c.stroke();
  c.strokeStyle = 'rgba(120,70,50,.35)'; c.lineWidth = 3; for (const ex of [92, 164]){ c.beginPath(); c.arc(ex, 132, 20, .3, Math.PI - .3); c.stroke(); }
  c.strokeStyle = '#6a2a24'; c.lineWidth = 6; c.beginPath(); if (big){ c.ellipse(128, 186, 12, 9, 0, 0, 7); } else { c.moveTo(108, 184); c.quadraticCurveTo(128, 194, 148, 184); } c.stroke(); }); }
function ancien(o = {}){ const g = new THREE.Group(); const coat = vstd(o.coat ?? 0x5a5f6a);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(.42, .9, 6, 12), coat); body.position.y = 1.15; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.36, 24, 18), [vstd(0xe8c3a0)]); head.position.y = 2.15; g.add(head);
  const faceM = new THREE.MeshStandardMaterial({map: oldFace('calm'), roughness: .7, transparent: true}); const face = new THREE.Mesh(new THREE.CircleGeometry(.3, 24), faceM); face.position.set(0, 2.15, .35); g.add(face);
  if (o.beret){ const b = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .1, 20), vstd(0x1b1f2a)); b.position.set(.05, 2.47, -.02); b.rotation.z = .15; g.add(b); }
  else { const hair = new THREE.Mesh(new THREE.SphereGeometry(.37, 20, 14, 0, Math.PI * 2, 0, 1.2), vstd(0xd8d8d8)); hair.position.y = 2.17; g.add(hair); const bun = new THREE.Mesh(new THREE.SphereGeometry(.16, 12, 10), vstd(0xd8d8d8)); bun.position.set(0, 2.42, -.22); g.add(bun); }
  for (const s of [-1, 1]){ const leg = new THREE.Mesh(new THREE.CapsuleGeometry(.13, .5, 4, 8), vstd(0x2a2a30)); leg.position.set(s * .17, .4, 0); g.add(leg); }
  g.userData = {faceM, head}; scene.add(g); return g; }
function oldMood(p, m){ p.userData.faceM.map = oldFace(m); p.userData.faceM.needsUpdate = true; }
const papy = ancien({coat: 0x4a5568, beret: true}), mamie = ancien({coat: 0x8a4a5a});
const bench = new THREE.Group(); scene.add(bench); { const seat = new THREE.Mesh(new THREE.BoxGeometry(3.2, .12, .8), MAT.wood); seat.position.y = .9; bench.add(seat); const back = new THREE.Mesh(new THREE.BoxGeometry(3.2, .7, .1), MAT.wood); back.position.set(0, 1.4, -.38); back.rotation.x = -.15; bench.add(back);
  for (const x of [-1.4, 1.4]) for (const z of [-.3, .3]){ const l = new THREE.Mesh(new THREE.BoxGeometry(.1, .9, .1), vstd(0x2a2a2a, {metalness: .5})); l.position.set(x, .45, z); bench.add(l); } }
ALL.push(VG, deskGroup, pinned, ...pins, papy, mamie, bench);
// ---- look « fin d'après-midi » ----
function vLook(){ look('day'); setSky('golden', 9, 250, 3.2, 1.4, .005); renderer.toneMappingExposure = .62; sunLight.intensity = 3.0; sunLight.color.set(0xffc58a); hemi.intensity = 1.1; hemi.color.set(0xdfe8ff); hemi.groundColor.set(0x6a7a40);
  scene.fog = new THREE.Fog(0xe8c9a0, 140, 900); bloom.strength = .18; sunLight.shadow.radius = 3; scene.environment = null; }
// ---- post-production : tilt-shift, étalonnage chaud, grain, titres de documentaire ----
const tc = document.createElement('canvas'); tc.width = W; tc.height = H; const tctx = tc.getContext('2d');
const grains = [0, 1, 2, 3, 4, 5].map(() => { const g = document.createElement('canvas'); g.width = 270; g.height = 480; const x = g.getContext('2d'); const im = x.createImageData(270, 480); for (let i = 0; i < im.data.length; i += 4){ const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } x.putImageData(im, 0, 0); return g; });
window.postFX = (t, fx) => {
  const tilt = fx.tilt ?? 10; if (tilt > 0){ const fy = (fx.focusY ?? .5) * H, band = (fx.band ?? .16) * H;
    tctx.clearRect(0, 0, W, H); tctx.globalCompositeOperation = 'source-over'; tctx.filter = `blur(${tilt}px)`; tctx.drawImage(renderer.domElement, 0, 0); tctx.filter = 'none';
    const g = tctx.createLinearGradient(0, 0, 0, H); const a = Math.max(0, (fy - band * 2.2) / H), b = Math.max(0, (fy - band * .5) / H), c2 = Math.min(1, (fy + band * .5) / H), d = Math.min(1, (fy + band * 2.2) / H);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(a, 'rgba(0,0,0,1)'); g.addColorStop(b, 'rgba(0,0,0,0)'); g.addColorStop(c2, 'rgba(0,0,0,0)'); g.addColorStop(d, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,1)');
    tctx.globalCompositeOperation = 'destination-in'; tctx.fillStyle = g; tctx.fillRect(0, 0, W, H); tctx.globalCompositeOperation = 'source-over'; octx.drawImage(tc, 0, 0); }
  octx.save(); octx.globalCompositeOperation = 'soft-light'; octx.fillStyle = fx.grade || 'rgba(255,170,90,.28)'; octx.fillRect(0, 0, W, H); octx.restore();
  octx.save(); octx.globalCompositeOperation = 'overlay'; octx.globalAlpha = .09; octx.imageSmoothingEnabled = false; octx.drawImage(grains[Math.floor(t * 24) % 6], 0, 0, W, H); octx.restore(); };
function serif(txt, x, y, size, col = '#fff', weight = '700', align = 'left', spacing = 0){ octx.save(); octx.font = `${weight} ${size}px "DejaVu Serif", "Liberation Serif", serif`; octx.textAlign = align; octx.textBaseline = 'alphabetic';
  if (spacing) octx.letterSpacing = spacing + 'px'; octx.shadowColor = 'rgba(0,0,0,.55)'; octx.shadowBlur = 18; octx.fillStyle = col; octx.fillText(txt, x, y); octx.restore(); }
window.postFX2 = (t, fx, lt) => {
  if (fx.lower){ const k = easeOut(clamp((lt - .25) / .5, 0, 1)); octx.save(); octx.globalAlpha = k; octx.fillStyle = '#f2c94c'; octx.fillRect(80, 250, 8, 150); serif(fx.lower[0], 115 - (1 - k) * 30, 318, 76, '#ffffff', '700', 'left', 4); serif(fx.lower[1], 117 - (1 - k) * 30, 380, 38, '#f1e6cf', '400', 'left', 2); octx.restore(); }
  if (fx.date){ const k = easeOut(clamp((lt - .1) / .5, 0, 1)); octx.save(); octx.globalAlpha = k; serif(fx.date, W / 2, 470, 130, '#ffffff', '700', 'center', 12); octx.fillStyle = '#f2c94c'; octx.fillRect(W / 2 - 160 * k, 505, 320 * k, 5); octx.restore(); }
  if (fx.recon){ octx.save(); octx.globalAlpha = .85; serif('RECONSTITUTION', W - 70, 150, 30, '#ffffff', '400', 'right', 6); octx.restore(); }
  if (fx.vrai){ const k = easeOut(clamp((lt - .15) / .3, 0, 1)); octx.save(); octx.translate(W / 2, 520); octx.scale(1.6 - .6 * k, 1.6 - .6 * k); octx.globalAlpha = k; octx.fillStyle = 'rgba(0,0,0,.55)'; octx.fillRect(-330, -95, 660, 150); serif('C\'EST VRAI.', 0, 25, 108, '#f2c94c', '700', 'center', 6); octx.restore(); }
  if (fx.brand){ const k = easeOut(clamp((lt - .2) / .6, 0, 1)); octx.save(); octx.globalAlpha = k; octx.fillStyle = 'rgba(0,0,0,.45)'; octx.fillRect(0, 560, W, 330);
    serif('LE CAPITAINE RACONTE', W / 2, 700, 56, '#ffffff', '700', 'center', 4); serif('Des histoires vraies. Incroyables.', W / 2, 780, 40, '#f2c94c', '400', 'center', 2); serif('Abonne-toi', W / 2, 850, 40, '#ffffff', '700', 'center', 2); octx.restore(); } };
