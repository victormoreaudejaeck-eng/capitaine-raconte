
// ===================== MARY CELESTE : assets =====================
const plankTex = (base, line, w = 512, h = 512, n = 16) => { const t = canvasTex(w, h, (c) => { c.fillStyle = base; c.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++){ const y = i * h / n; c.fillStyle = `rgba(0,0,0,${.05 + Math.random() * .08})`; c.fillRect(0, y, w, h / n); c.fillStyle = line; c.fillRect(0, y, w, 2);
    for (let k = 0; k < 3; k++){ c.fillRect(Math.random() * w, y, 2, h / n); } for (let k = 0; k < 40; k++){ c.fillStyle = `rgba(60,35,15,${Math.random() * .12})`; c.fillRect(Math.random() * w, y + Math.random() * h / n, 30 + Math.random() * 60, 1); } } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
const deckTex = plankTex('#b08a5c', 'rgba(40,25,10,.6)'); deckTex.repeat.set(1, 6);
const hullWoodTex = plankTex('#2a2522', 'rgba(0,0,0,.6)', 512, 512, 12); hullWoodTex.repeat.set(8, 1);
const darkWoodTex = plankTex('#5a3c22', 'rgba(20,10,0,.6)', 512, 512, 10); darkWoodTex.repeat.set(3, 2);
const canvasMat = new THREE.MeshStandardMaterial({color: 0xcfc4a8, roughness: 1, side: THREE.DoubleSide});
const ropeMat = std(0x8a7350, {roughness: 1});
const woodMat = std(0xffffff, {map: darkWoodTex, roughness: .8});

function loft(st, L = 40, ringPts){
  const sample = z => { for (let i = 0; i < st.length - 1; i++){ const a = st[i], c = st[i+1]; if (z <= c[0]){ const p = (z - a[0]) / (c[0] - a[0]), s = p*p*(3-2*p); return a.map((v, k) => v + (c[k] - v) * (k === 0 ? p : s)); } } return st[st.length-1]; };
  const z0 = st[0][0], z1 = st[st.length-1][0], pos = [], uv = [], idx = []; let ring = 0;
  for (let j = 0; j <= L; j++){ const z = z0 + (z1 - z0) * j / L; const s = sample(z); const pr = ringPts(...s.slice(1)); ring = pr.length;
    pr.forEach(([x, y], i) => { pos.push(x, y, z); uv.push(j / L, i / (pr.length - 1)); }); }
  for (let j = 0; j < L; j++) for (let i = 0; i < ring - 1; i++){ const a = j*ring+i, c = a + ring; idx.push(a, c, a+1, c, c+1, a+1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
function squareSail(w1, w2, h, belly){ const g = new THREE.PlaneGeometry(1, 1, 12, 10); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++){ const u = p.getX(i), v = p.getY(i) + .5; const w = lerp(w2, w1, v); p.setXYZ(i, u * w, v * h - h, Math.sin(Math.PI * (u + .5)) * Math.sin(Math.PI * v) * belly); }
  g.computeVertexNormals(); const m = new THREE.Mesh(g, canvasMat); m.castShadow = true; return m; }
function triSail(a, b, c, belly){ const g = new THREE.BufferGeometry(); const N = 10, pos = [], idx = [];
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N - i; j++){ const u = i / N, v = j / N, w = 1 - u - v; const pt = V(0, 0, 0).addScaledVector(a, w).addScaledVector(b, u).addScaledVector(c, v); pt.x += u * w * v * 27 * belly / 4 + Math.sin(Math.PI * u) * Math.sin(Math.PI * (1 - v)) * belly * .5; pos.push(pt.x, pt.y, pt.z); }
  let k = 0; const id = []; for (let i = 0; i <= N; i++){ id.push([]); for (let j = 0; j <= N - i; j++) id[i].push(k++); }
  for (let i = 0; i < N; i++) for (let j = 0; j < N - i; j++){ idx.push(id[i][j], id[i+1][j], id[i][j+1]); if (j < N - i - 1) idx.push(id[i+1][j], id[i+1][j+1], id[i][j+1]); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); const m = new THREE.Mesh(g, canvasMat); m.castShadow = true; return m; }
function spar(r1, r2, len, m = woodMat){ const s = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, len, 8), m); s.castShadow = true; return s; }
function line3(group, a, b, r = .02){ const v = new THREE.Vector3().subVectors(b, a); const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, v.length(), 4), ropeMat); m.position.copy(a).addScaledVector(v, .5); m.quaternion.setFromUnitVectors(V(0, 1, 0), v.clone().normalize()); group.add(m); }

function makeBrig(o = {}){
  const B = new THREE.Group();
  // traditional hull: sheer rising to the bow, round bilge, keel. stations [z, halfBeam, draft, freeboard]
  const st = [[-15, 3.2, 2.2, 2.2], [-12, 3.8, 2.8, 2.0], [-6, 4.1, 3.0, 1.9], [0, 4.1, 3.0, 1.9], [6, 3.8, 2.9, 2.1], [10, 2.8, 2.6, 2.5], [13, 1.2, 2.2, 2.9], [14.4, .06, 1.8, 3.1]];
  const ringPts = (hb, dr, fb) => { const pts = []; const half = [[hb * .97, fb], [hb, fb * .4], [hb * .98, -dr * .2], [hb * .88, -dr * .55], [hb * .62, -dr * .85], [hb * .3, -dr * .97], [.15, -dr]];
    for (const q of half) pts.push(q); for (let i = half.length - 2; i >= 0; i--) pts.push([-half[i][0], half[i][1]]); return pts; };
  const hg = loft(st, 48, ringPts);
  { const p = hg.attributes.position, col = []; const cH = new THREE.Color(o.hull ?? 0x2b2522), cS = new THREE.Color(o.stripe ?? 0xd8cfb8), cB = new THREE.Color(0x6e3a26);
    for (let i = 0; i < p.count; i++){ const y = p.getY(i); const c = y < -.15 ? cB : (y > 1.15 && y < 1.45 ? cS : cH); col.push(c.r, c.g, c.b); } hg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); }
  const hull = new THREE.Mesh(hg, std(0xffffff, {vertexColors: true, map: hullWoodTex, roughness: .7, side: THREE.DoubleSide})); hull.castShadow = hull.receiveShadow = true; B.add(hull);
  // deck
  const ds = new THREE.Shape(); ds.moveTo(-3.1, -15); ds.bezierCurveTo(-4.2, -6, -4.2, 6, -2.8, 10); ds.quadraticCurveTo(-1, 13.6, 0, 14.3); ds.quadraticCurveTo(1, 13.6, 2.8, 10); ds.bezierCurveTo(4.2, 6, 4.2, -6, 3.1, -15); ds.closePath();
  const deck = new THREE.Mesh(new THREE.ShapeGeometry(ds, 20), std(0xffffff, {map: deckTex, roughness: .85})); deck.rotation.x = -Math.PI / 2; deck.position.y = 1.85; deck.receiveShadow = true; B.add(deck);
  // bulwark rail
  const railPts = []; for (let i = 0; i <= 40; i++){ const a = i / 40; railPts.push(V(lerp(-3.15, 0, 0), 0, 0)); }
  const rail = new THREE.Mesh(new THREE.TorusGeometry(1, .07, 6, 64), woodMat); rail.scale.set(4.05, 14.6, 1); rail.rotation.x = Math.PI / 2; rail.position.set(0, 2.85, -.4); B.add(rail);
  // deckhouse (cabin) aft, main hatch, wheel
  const house = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.6, 5.5), std(0xd9cfb8, {roughness: .7})); house.position.set(0, 2.65, -9.2); house.castShadow = true; B.add(house);
  const roofH = new THREE.Mesh(new THREE.BoxGeometry(4.5, .15, 5.8), woodMat); roofH.position.set(0, 3.5, -9.2); B.add(roofH);
  for (const sx of [-1, 1]) for (const z of [-10.4, -8]){ const w = new THREE.Mesh(new THREE.BoxGeometry(.05, .45, .6), phys(0x1a2430, {roughness: .1})); w.position.set(sx * 2.11, 2.8, z); B.add(w); }
  const door = new THREE.Mesh(new THREE.BoxGeometry(.9, 1.3, .06), woodMat); door.position.set(0, 2.55, -6.43); B.add(door);
  const hatch = new THREE.Mesh(new THREE.BoxGeometry(2.6, .5, 3.6), woodMat); hatch.position.set(0, 2.1, 1); hatch.castShadow = true; B.add(hatch);
  const chocks = new THREE.Group(); for (const z of [-.6, 2.6]){ const ch = new THREE.Mesh(new THREE.BoxGeometry(2, .25, .25), woodMat); ch.position.set(0, 2.45, z - 1 + .6); chocks.add(ch); } B.add(chocks);
  const yawl = makeYawl(); yawl.position.set(0, 2.85, 1); yawl.rotation.y = 0; B.add(yawl);
  const wheel = new THREE.Group(); { const ring = new THREE.Mesh(new THREE.TorusGeometry(.55, .045, 8, 24), woodMat); wheel.add(ring);
    for (let i = 0; i < 8; i++){ const sp = spar(.03, .03, 1.5); sp.rotation.z = i * Math.PI / 8; wheel.add(sp); } const hub = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .15, 10), phys(0xb08d3a, {metalness: .9, roughness: .3})); hub.rotation.x = Math.PI / 2; wheel.add(hub); }
  wheel.position.set(0, 3.0, -12.8); B.add(wheel);
  const binn = new THREE.Mesh(new THREE.BoxGeometry(.5, 1.1, .4), woodMat); binn.position.set(0, 2.4, -13.2); B.add(binn);
  // bowsprit + jib boom
  const bs = spar(.25, .14, 9); bs.rotation.x = Math.PI / 2 - .22; bs.position.set(0, 3.6, 17.8); B.add(bs);
  // masts
  const fore = new THREE.Group(); fore.position.set(0, 1.9, 6.5); B.add(fore);
  const main = new THREE.Group(); main.position.set(0, 1.9, -3.5); B.add(main);
  for (const [mg, h] of [[fore, 25], [main, 27]]){ const m = spar(.32, .16, h); m.position.y = h / 2; mg.add(m); const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, .15, 1.2), woodMat); top.position.y = h * .55; mg.add(top); }
  // foremast square sails on yards (course, topsail, topgallant)
  const sails = [];
  const yards = [[8.5, 13, 11, 6.0], [14.2, 11, 9.2, 5.2], [19.4, 9, 7.4, 4.2]];
  for (const [y, w1, w2, h] of yards){ const yd = spar(.13, .13, w1 + .8); yd.rotation.z = Math.PI / 2; yd.position.set(0, y, .3); fore.add(yd);
    const s = squareSail(w1, w2, h * .92, .9); s.position.set(0, y, .55); s.rotation.y = Math.PI; fore.add(s); sails.push(s); }
  // main gaff sail + boom
  const boom = spar(.14, .12, 11); boom.rotation.x = Math.PI / 2; boom.position.set(0, 2.6, -5.4); main.add(boom);
  const gaff = spar(.12, .1, 7); gaff.rotation.x = Math.PI / 2 - .45; gaff.position.set(0, 17.5, -3); main.add(gaff);
  const gs = new THREE.BufferGeometry(); { const pts = [V(0, 3, -.4), V(0, 17, -.3), V(0, 20.4, -6.1), V(0, 3, -10.6)]; const N = 10, pos = [], idx = [];
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++){ const u = i / N, v = j / N; const a = new THREE.Vector3().lerpVectors(pts[0], pts[1], v), b = new THREE.Vector3().lerpVectors(pts[3], pts[2], v); const p = new THREE.Vector3().lerpVectors(a, b, u); p.x += Math.sin(Math.PI * u) * 1.1 * (1 - v * .5); pos.push(p.x, p.y, p.z); }
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++){ const a = i * (N + 1) + j; idx.push(a, a + N + 1, a + 1, a + 1, a + N + 1, a + N + 2); }
    gs.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); gs.setIndex(idx); gs.computeVertexNormals(); }
  const gsail = new THREE.Mesh(gs, canvasMat); gsail.castShadow = true; main.add(gsail); sails.push(gsail);
  // jibs from bowsprit to foremast
  const j1 = triSail(V(0, 3.2, 13.6), V(0, 17.5, 7.2), V(0, 3.6, 20.5), .9); B.add(j1); sails.push(j1);
  const j2 = triSail(V(0, 4.0, 12.0), V(0, 13, 7.0), V(0, 3.4, 17.0), .7); B.add(j2); sails.push(j2);
  // standing rigging
  const ft = V(0, 26.5, 6.5), mt = V(0, 28.5, -3.5);
  line3(B, ft, V(0, 3.7, 22)); line3(B, mt, ft); line3(B, mt, V(0, 3.2, -14.8));
  for (const sx of [-1, 1]){ for (const dz of [-1, 0, 1]){ line3(B, V(0, 18, 6.5), V(sx * 3.9, 2.9, 6.5 + dz * .9), .015); line3(B, V(0, 19, -3.5), V(sx * 4.0, 2.9, -3.5 + dz * .9), .015); } }
  B.userData = {sails, wheel, yawl, chocks, fore, main};
  return B;
}
function makeYawl(){ const Y = new THREE.Group();
  const st = [[-2.4, .7, .45, .35], [-1.6, .95, .6, .3], [0, 1.0, .65, .3], [1.6, .8, .55, .35], [2.6, .05, .35, .45]];
  const rp = (hb, dr, fb) => { const pts = []; const half = [[hb, fb], [hb * .95, 0], [hb * .7, -dr * .7], [hb * .3, -dr * .95], [.05, -dr]]; for (const q of half) pts.push(q); for (let i = half.length - 2; i >= 0; i--) pts.push([-half[i][0], half[i][1]]); return pts; };
  const g = loft(st, 24, rp); const hullY = new THREE.Mesh(g, std(0xf0ebe0, {roughness: .7, side: THREE.DoubleSide})); hullY.castShadow = true; Y.add(hullY);
  const gunw = new THREE.Mesh(new THREE.TorusGeometry(1, .04, 4, 40), woodMat); gunw.scale.set(.98, 2.5, 1); gunw.rotation.x = Math.PI / 2; gunw.position.set(0, .34, .1); Y.add(gunw);
  for (const z of [-1, 0, 1]){ const th = new THREE.Mesh(new THREE.BoxGeometry(1.8, .06, .25), woodMat); th.position.set(0, .05, z); Y.add(th); }
  return Y; }
const brig = makeBrig(); scene.add(brig);
const deiGratia = makeBrig({hull: 0x3a2f28, stripe: 0x8a2a20}); scene.add(deiGratia);
const yawlFree = makeYawl(); scene.add(yawlFree);
const ghostYawl = makeYawl(); { const gm = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true, transparent: true, opacity: .4, depthWrite: false}); ghostYawl.traverse(o => { if (o.isMesh) o.material = gm; }); } scene.add(ghostYawl);

// ---- the hold with barrels ----
const hold = new THREE.Group(); scene.add(hold);
const barrelGeo = (() => { const pts = []; for (let i = 0; i <= 12; i++){ const v = i / 12; pts.push(new THREE.Vector2(.36 + Math.sin(Math.PI * v) * .07, v * 1.0 - .5)); } return new THREE.LatheGeometry(pts, 16); })();
const barrelMat = std(0xffffff, {map: plankTex('#7a5230', 'rgba(20,10,0,.7)', 256, 256, 1), roughness: .75});
const hoopMat = phys(0x3a3a3a, {metalness: .8, roughness: .45});
const barrels = [];
{ const room = new THREE.Mesh(new THREE.BoxGeometry(8, 3.6, 16), std(0xffffff, {map: darkWoodTex, roughness: .85, side: THREE.BackSide})); room.position.y = 1.3; room.receiveShadow = true; hold.add(room);
  for (let i = 0; i < 7; i++){ const beam = new THREE.Mesh(new THREE.BoxGeometry(8, .25, .3), woodMat); beam.position.set(0, 2.95, -6.5 + i * 2.2); hold.add(beam); }
  for (let row = 0; row < 2; row++) for (let x = -3; x <= 3; x++) for (let z = -6; z <= 6; z++){ if (Math.abs(x) < 1 && z > 3) continue;
    const b = new THREE.Group(); const body = new THREE.Mesh(barrelGeo, barrelMat); body.castShadow = body.receiveShadow = true; b.add(body);
    for (const y of [-.38, -.15, .15, .38]){ const h = new THREE.Mesh(new THREE.TorusGeometry(.4 + (Math.abs(y) < .2 ? .03 : 0), .015, 4, 18), hoopMat); h.rotation.x = Math.PI / 2; h.position.y = y; b.add(h); }
    b.rotation.z = Math.PI / 2; b.position.set(x * .95, -.1 + row * .82, z * 1.05); hold.add(b); barrels.push(b); } }
const holdWaterG = new THREE.PlaneGeometry(8, 16, 30, 60); holdWaterG.rotateX(-Math.PI / 2); const holdWB = holdWaterG.attributes.position.array.slice();
const holdWater = new THREE.Mesh(holdWaterG, phys(0x1a2a24, {roughness: .05, transparent: true, opacity: .85})); hold.add(holdWater);
function holdWaterAt(t, lvl){ holdWater.visible = lvl > -2; const p = holdWaterG.attributes.position.array; for (let i = 0; i < p.length; i += 3) p[i+1] = lvl + Math.sin(holdWB[i] * 1.5 + t * 1.2) * .03 + Math.sin(holdWB[i+2] * .8 - t) * .04; holdWaterG.attributes.position.needsUpdate = true; holdWaterG.computeVertexNormals(); }
const vapor = new THREE.Group(); hold.add(vapor);
{ const tex = canvasTex(64, 64, (c) => { const g = c.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(200,230,170,.7)'); g.addColorStop(1, 'rgba(200,230,170,0)'); c.fillStyle = g; c.fillRect(0, 0, 64, 64); });
  const r = rng(17); for (let i = 0; i < 60; i++){ const s = new THREE.Sprite(new THREE.SpriteMaterial({map: tex, transparent: true, depthWrite: false, opacity: .4})); s.userData = [r() * 6 - 3, r() * 12 - 6, r(), .5 + r()]; vapor.add(s); } }
const lantern = new THREE.Group(); { const cage = new THREE.Mesh(new THREE.CylinderGeometry(.12, .14, .3, 8, 1, true), phys(0x2a2a2a, {metalness: .7, roughness: .4, side: THREE.DoubleSide})); lantern.add(cage);
  const flame = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), new THREE.MeshBasicMaterial({color: 0xffc860})); lantern.add(flame); const top = new THREE.Mesh(new THREE.ConeGeometry(.15, .12, 8), phys(0x2a2a2a, {metalness: .7})); top.position.y = .21; lantern.add(top); } scene.add(lantern);

// ---- captain's cabin ----
const cabin = new THREE.Group(); scene.add(cabin);
const logTex = canvasTex(1024, 640, (c, w, h) => { c.fillStyle = '#efe3c2'; c.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++){ c.fillStyle = `rgba(120,90,50,${Math.random() * .05})`; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  c.fillStyle = 'rgba(80,60,30,.25)'; c.fillRect(w / 2 - 6, 0, 12, h); c.strokeStyle = 'rgba(100,120,160,.35)'; c.lineWidth = 2; for (let y = 90; y < h; y += 38){ c.beginPath(); c.moveTo(30, y); c.lineTo(w - 30, y); c.stroke(); }
  c.font = 'italic 34px serif'; c.fillStyle = '#2a1e12';
  const L = ['Nov. 21 — Wind S.W., light airs', 'Nov. 22 — Fresh breeze, all well', 'Nov. 23 — Strong winds, rough sea', 'Nov. 24 — Heavy weather, reefed'];
  L.forEach((s, i) => c.fillText(s, 50, 130 + i * 76));
  c.fillText('Nov. 24 — Wind moderating', 540, 130); c.fillStyle = '#4a1010'; c.font = 'italic 700 38px serif'; c.fillText('Nov. 25 — 8 a.m. Eastern point', 540, 206); c.fillText('of Sᵗ Mary’s, Azores, S.S.W.', 540, 252);
  c.fillStyle = '#2a1e12'; c.font = 'italic 30px serif'; c.fillText('Mary Celeste — Capt. B. S. Briggs', 50, 60); });
const logbook = new THREE.Group(); { const cover = new THREE.Mesh(new THREE.BoxGeometry(.62, .03, .42), std(0x4a2a18)); logbook.add(cover); const pages = new THREE.Mesh(new THREE.PlaneGeometry(.6, .4), std(0xffffff, {map: logTex, roughness: .95})); pages.rotation.x = -Math.PI / 2; pages.position.y = .017; logbook.add(pages); }
{ const room = new THREE.Mesh(new THREE.BoxGeometry(4, 2.4, 5), std(0xffffff, {map: darkWoodTex, roughness: .8, side: THREE.BackSide})); room.position.y = 1.2; room.receiveShadow = true; cabin.add(room);
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.6, .06, 1.0), woodMat); table.position.set(0, .8, 0); table.castShadow = table.receiveShadow = true; cabin.add(table);
  for (const [x, z] of [[-.7, -.4], [.7, -.4], [-.7, .4], [.7, .4]]){ const l = spar(.04, .04, .8); l.position.set(x, .4, z); cabin.add(l); }
  logbook.position.set(-.2, .845, .05); logbook.rotation.y = .15; cabin.add(logbook);
  const ink = new THREE.Mesh(new THREE.CylinderGeometry(.04, .05, .07, 10), phys(0x101015, {roughness: .1})); ink.position.set(.35, .87, -.2); cabin.add(ink);
  const quill = new THREE.Mesh(new THREE.ConeGeometry(.012, .3, 6), std(0xeeeeee)); quill.rotation.z = .9; quill.position.set(.42, .93, -.2); cabin.add(quill);
  for (const [x, z, c] of [[-1.5, -2, 0x3b5f7f], [1.4, -2, 0x6b4a2b], [1.5, 1.6, 0x7f3b2b]]){ const ch = new THREE.Mesh(new THREE.BoxGeometry(.9, .55, .55), std(c, {roughness: .8})); ch.position.set(x, .28, z); ch.castShadow = true; cabin.add(ch); }
  const bunk = new THREE.Mesh(new THREE.BoxGeometry(1.0, .5, 2.2), std(0x8c7a5a)); bunk.position.set(-1.45, .45, 1.2); cabin.add(bunk);
  const port = new THREE.Mesh(new THREE.CircleGeometry(.22, 20), new THREE.MeshBasicMaterial({color: 0x9fb3c2})); port.position.set(1.99, 1.5, 0); port.rotation.y = -Math.PI / 2; cabin.add(port);
  const portRim = new THREE.Mesh(new THREE.TorusGeometry(.23, .03, 6, 20), phys(0xb08d3a, {metalness: .9, roughness: .3})); portRim.position.copy(port.position); portRim.rotation.y = -Math.PI / 2; cabin.add(portRim);
  const hang = new THREE.Group(); hang.position.set(0, 2.35, 0); cabin.add(hang); cabin.userData = {hang}; }
const soundRod = new THREE.Group(); { const rod = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 1.4, 8), phys(0x8a8f96, {metalness: .9, roughness: .35})); rod.rotation.z = Math.PI / 2; soundRod.add(rod);
  for (let i = 0; i < 6; i++){ const mk = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .02, 8), std(0x111111)); mk.rotation.z = Math.PI / 2; mk.position.x = -.6 + i * .22; soundRod.add(mk); }
  const coil = new THREE.Mesh(new THREE.TorusGeometry(.18, .025, 6, 20), ropeMat); coil.rotation.x = Math.PI / 2; coil.position.set(.85, 0, .05); soundRod.add(coil); } scene.add(soundRod);

// ---- New York harbour ----
const harbor = new THREE.Group(); scene.add(harbor);
{ const r = rng(23); const pier = new THREE.Mesh(new THREE.BoxGeometry(60, 1.5, 14), woodMat); pier.position.set(-20, .5, -30); pier.receiveShadow = true; harbor.add(pier);
  for (let i = 0; i < 14; i++){ const h = 6 + r() * 14, w = 6 + r() * 6; const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 8), std([0x8a4a3a, 0x9a7a5a, 0x6a5a4a, 0xa89878][i % 4], {roughness: .9})); b.position.set(-60 + i * 8.5, h / 2 + 1, -45 - r() * 6); b.castShadow = true; harbor.add(b);
    for (let k = 0; k < 6; k++){ const wnd = new THREE.Mesh(new THREE.PlaneGeometry(.9, 1.3), std(0x1a2228)); wnd.position.set(b.position.x - w / 3 + (k % 3) * w / 3, 3 + Math.floor(k / 3) * 3.5, b.position.z + 4.01); harbor.add(wnd); } }
  for (let i = 0; i < 9; i++){ const pl = spar(.25, .25, 4); pl.position.set(-46 + i * 6, 0, -23); harbor.add(pl); } }
const people = [];

// ---- period characters ----
const captain = makePerson({jacket: 0x1c2333, pants: 0x1c1f26, beard: true, hairCss: '#4a3020', brow: '#3a2416'}); scene.add(captain);
const sarah = makePerson({jacket: 0x5a2c3a, pants: 0x3a1c26, beard: false, hairCss: '#5a3822', brow: '#4a2e18'}); scene.add(sarah);
{ const skirt = new THREE.Mesh(new THREE.ConeGeometry(.42, .95, 20, 1, true), std(0x4a2230, {roughness: .9, side: THREE.DoubleSide})); skirt.position.y = -.42; sarah.userData.hips.add(skirt);
  const bun = new THREE.Mesh(new THREE.SphereGeometry(.06, 12, 10), std(0x5a3822, {roughness: 1})); bun.position.set(0, .2, -.11); sarah.userData.neck.add(bun); }
const sophia = makePerson({jacket: 0xd8c8a8, pants: 0xd8c8a8, beard: false, hairCss: '#a07040', brow: '#7a5030'}); sophia.scale.setScalar(.5); scene.add(sophia);
{ const dress = new THREE.Mesh(new THREE.ConeGeometry(.36, .8, 16, 1, true), std(0xd8c8a8, {side: THREE.DoubleSide})); dress.position.y = -.35; sophia.userData.hips.add(dress); }
const crew = [0xd9d2c0, 0x2c4a7a, 0xd9d2c0, 0x6a4a3a].map((c, i) => { const p = makePerson({jacket: c, pants: 0x2a2e36, beard: i === 3, hairCss: ['#2a1d14', '#5a3a1a', '#8a6a3a', '#3a2a1a'][i], brow: '#2a1d14'}); scene.add(p); return p; });
const doyle = makePerson({jacket: 0x6b5233, pants: 0x3a3026, beard: false, hairCss: '#5a3a20', brow: '#4a2e18'}); scene.add(doyle);
{ const mus = new THREE.Mesh(new THREE.CapsuleGeometry(.008, .06, 4, 8), std(0x8a6a48, {roughness: 1})); mus.rotation.z = Math.PI / 2; mus.position.set(0, .1, .121); doyle.userData.neck.add(mus); }
const spyglass = new THREE.Group(); { const tb = new THREE.Mesh(new THREE.CylinderGeometry(.03, .045, .55, 12), phys(0xb08d3a, {metalness: .9, roughness: .3})); tb.rotation.x = Math.PI / 2; spyglass.add(tb); } scene.add(spyglass);
const desk = new THREE.Group(); scene.add(desk);
const magTex = canvasTex(768, 1024, (c, w, h) => { c.fillStyle = '#efe6cf'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2018'; c.textAlign = 'center';
  c.font = '700 44px serif'; c.fillText('THE CORNHILL MAGAZINE', w / 2, 90); c.fillRect(60, 110, w - 120, 4); c.font = 'italic 28px serif'; c.fillText('January 1884', w / 2, 150);
  c.font = '700 40px serif'; c.fillText('J. HABAKUK JEPHSON’S', w / 2, 240); c.fillText('STATEMENT', w / 2, 290);
  c.font = '24px serif'; for (let i = 0; i < 18; i++){ c.fillStyle = 'rgba(42,32,24,.55)'; c.fillRect(80, 350 + i * 34, w - 160 - (i % 4) * 30, 10); }
  c.fillStyle = '#8a1a10'; c.font = '700 46px serif'; c.fillText('« MARIE CELESTE »', w / 2, 1000 - 60); });
{ const top = new THREE.Mesh(new THREE.BoxGeometry(1.8, .06, 1.0), woodMat); top.position.y = .76; top.receiveShadow = true; desk.add(top);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(.42, .56), std(0xffffff, {map: magTex, roughness: .95})); paper.rotation.x = -Math.PI / 2; paper.position.set(.1, .795, .1); desk.add(paper); desk.userData = {paper};
  const lampB = new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, .3, 10), phys(0xb08d3a, {metalness: .9, roughness: .3})); lampB.position.set(-.6, .94, -.25); desk.add(lampB);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(.11, 14, 10), new THREE.MeshBasicMaterial({color: 0xffd890})); glass.position.set(-.6, 1.17, -.25); desk.add(glass);
  const chair = new THREE.Mesh(new THREE.BoxGeometry(.5, .08, .5), woodMat); chair.position.set(0, .48, .75); desk.add(chair);
  const room = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 6), std(0x3a2a20, {roughness: .9, side: THREE.BackSide})); room.position.y = 1.5; desk.add(room); }
ALL.push(brig, deiGratia, yawlFree, ghostYawl, hold, lantern, cabin, soundRod, harbor, captain, sarah, sophia, ...crew, doyle, spyglass, desk);
function seat(p){ const u = p.userData; u.legs.forEach(l => { l.hip.rotation.x = -1.45; l.knee.rotation.x = 1.45; }); }
function sailsFlap(b, t, k = 1){ b.userData.sails.forEach((s, i) => { s.rotation.x = Math.sin(t * 1.3 + i) * .03 * k; }); }
