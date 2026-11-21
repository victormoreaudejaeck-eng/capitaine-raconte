
// ===================== « ET C'EST VRAI » : Whittier (Alaska), une ville dans un immeuble =====================
const WG = new THREE.Group(); scene.add(WG);
const wH = (x, z) => { const d = Math.max(0, z - 100); const side = Math.max(0, Math.abs(x) - 80); return Math.min(120, d * .5 + side * side * .02) + Math.sin(x * .05) * 2; };
// rive : terrain bas + montagnes enneigées autour d'un fjord (eau au sud, z < 0)
{ const g = new THREE.PlaneGeometry(900, 500, 120, 80); g.rotateX(-Math.PI / 2); const pa = g.attributes.position; const col = [];
  for (let i = 0; i < pa.count; i++){ const x = pa.getX(i), z = pa.getZ(i) + 250; pa.setZ(i, z); const h = wH(x, z) + 1.2; pa.setY(i, h); const c = h > 30 ? new THREE.Color(0xf2f5fa) : (h > 8 ? new THREE.Color(0x56604f) : new THREE.Color(0x6f6a5c)); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({vertexColors: true, roughness: .9, flatShading: true})); m.receiveShadow = true; WG.add(m); }
{ const r = rng(6); for (let i = 0; i < 14; i++){ const side = i % 2 ? 1 : -1; const h = 110 + r() * 90; const g = new THREE.ConeGeometry(70 + r() * 40, h, 8, 4); const pa = g.attributes.position; const col = [];
    for (let k = 0; k < pa.count; k++){ const y = pa.getY(k); const c = (y + h / 2) / h > .45 ? new THREE.Color(0xf4f7fb) : new THREE.Color(0x4a5246); col.push(c.r, c.g, c.b); pa.setX(k, pa.getX(k) * (1 + (r() - .5) * .3)); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({vertexColors: true, roughness: .9, flatShading: true})); m.position.set(side * (110 + r() * 60), h / 2 - 10, -200 + Math.floor(i / 2) * 70); WG.add(m); } }
// la tour (14 étages)
const tower = new THREE.Group(); WG.add(tower); tower.position.set(0, 1.2, 40);
{ const facade = canvasTex(512, 1024, (c) => { c.fillStyle = '#b4ab98'; c.fillRect(0, 0, 512, 1024); for (let f = 0; f < 14; f++) for (let w = 0; w < 8; w++){ const lit = Math.random() < .35; c.fillStyle = lit ? '#ffd88a' : '#33404c'; c.fillRect(20 + w * 61, 20 + f * 71, 40, 44); }
    c.fillStyle = 'rgba(120,110,95,.25)'; for (let f = 0; f <= 14; f++) c.fillRect(0, f * 71 + 8, 512, 5); });
  const b = new THREE.Mesh(new THREE.BoxGeometry(34, 46, 16), [vstd(0xffffff, {map: facade}), vstd(0xffffff, {map: facade}), vstd(0xb8b0a0), vstd(0x8a8478), vstd(0xffffff, {map: facade}), vstd(0xffffff, {map: facade})]); b.position.y = 23; b.castShadow = true; tower.add(b);
  const top = new THREE.Mesh(new THREE.BoxGeometry(35, 1.2, 17), vstd(0x7a7468)); top.position.y = 46.6; tower.add(top);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(12, 2), vstd(0xffffff, {map: canvasTex(800, 140, (c) => { c.fillStyle = '#2a3a4a'; c.fillRect(0, 0, 800, 140); c.fillStyle = '#fff'; c.font = '700 84px "DejaVu Sans", sans-serif'; c.textAlign = 'center'; c.fillText('BEGICH TOWERS', 400, 105); })})); sign.position.set(0, 4, 8.05); tower.add(sign); }
// l'immeuble abandonné voisin (ancienne base) + école reliée par un tunnel
const ruin = new THREE.Group(); WG.add(ruin); ruin.position.set(-60, 1.2, 55);
{ const t = canvasTex(256, 256, (c) => { c.fillStyle = '#8a8478'; c.fillRect(0, 0, 256, 256); for (let i = 0; i < 40; i++){ c.fillStyle = '#1a1a1a'; c.fillRect((i % 8) * 32 + 6, Math.floor(i / 8) * 50 + 10, 20, 26); } for (let i = 0; i < 900; i++){ c.fillStyle = `rgba(40,30,20,${Math.random() * .2})`; c.fillRect(Math.random() * 256, Math.random() * 256, 3, 6); } });
  const b = new THREE.Mesh(new THREE.BoxGeometry(60, 22, 20), vstd(0xffffff, {map: t})); b.position.y = 11; b.castShadow = true; ruin.add(b); }
const school = new THREE.Group(); WG.add(school); school.position.set(32, 1.2, 66);
{ const b = new THREE.Mesh(new THREE.BoxGeometry(18, 6, 12), vstd(0xc0392b)); b.position.y = 3; b.castShadow = true; school.add(b); const r = new THREE.Mesh(new THREE.BoxGeometry(18.4, .4, 12.4), vstd(0x3a3a3a)); r.position.y = 6.2; school.add(r);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.1), vstd(0xffffff, {map: canvasTex(600, 110, (c) => { c.fillStyle = '#fff'; c.fillRect(0, 0, 600, 110); c.fillStyle = '#222'; c.font = '700 70px "DejaVu Sans", sans-serif'; c.textAlign = 'center'; c.fillText('SCHOOL', 300, 82); })})); sg.position.set(0, 4.8, 6.05); school.add(sg); }
// port + bateaux
{ for (let i = 0; i < 6; i++){ const boat = new THREE.Group(); boat.position.set(-40 + i * 14, 0, -6 - (i % 2) * 6); const h = new THREE.Mesh(new THREE.BoxGeometry(3, 1.4, 9), vstd([0xffffff, 0x2e86c1, 0xc0392b][i % 3])); h.position.y = .5; boat.add(h); const c = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 3), vstd(0xeeeeee)); c.position.set(0, 2, -1); boat.add(c); const mast = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 7), vstd(0xdddddd)); mast.position.set(0, 4.5, 1); boat.add(mast); WG.add(boat); }
  const dock = new THREE.Mesh(new THREE.BoxGeometry(100, .6, 4), vstd(0x6a5a48)); dock.position.set(-5, .9, 2); WG.add(dock); }
// coupe des étages (maison de poupée) — décor séparé
const cut = new THREE.Group(); scene.add(cut); cut.position.set(0, 0, 900);
const CUT_FLOORS = [['ÉPICERIE', '#f39c12'], ['POSTE', '#2e86c1'], ['POLICE', '#1f3d7a'], ['MAIRIE', '#c0392b'], ['CABINET MÉDICAL', '#27ae60'], ['LAVERIE', '#8e44ad'], ['APPARTEMENTS', '#7f8c8d'], ['APPARTEMENTS', '#7f8c8d']];
{ const shell = vstd(0xd8d2c2); for (let f = 0; f < 8; f++){ const y = f * 3.2; const slab = new THREE.Mesh(new THREE.BoxGeometry(16, .3, 6), shell); slab.position.set(0, y, 0); cut.add(slab);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(16, 3), vstd(new THREE.Color(CUT_FLOORS[f][1]).lerp(new THREE.Color(0xffffff), .55).getHex())); back.position.set(0, y + 1.6, -3); cut.add(back);
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(6, .9), new THREE.MeshBasicMaterial({map: canvasTex(600, 90, (c) => { c.fillStyle = CUT_FLOORS[f][1]; c.fillRect(0, 0, 600, 90); c.fillStyle = '#fff'; c.font = '900 60px Inter'; c.textAlign = 'center'; c.fillText(CUT_FLOORS[f][0], 300, 68); })})); lab.position.set(0, y + 2.4, -2.95); cut.add(lab);
    for (let k = 0; k < 3; k++){ const prop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1 + (k % 2) * .6, 1), vstd([0x8a5a3a, 0xdddddd, 0x555555][k])); prop.position.set(-5 + k * 5, y + .8, -1.5); cut.add(prop); } }
  for (const x of [-8, 8]){ const wall = new THREE.Mesh(new THREE.BoxGeometry(.3, 25.6, 6), shell); wall.position.set(x, 12.6, 0); cut.add(wall); }
  const lamp = new THREE.PointLight(0xfff0d8, 30, 60, 1.2); lamp.position.set(0, 14, 14); cut.add(lamp); }
// tunnel souterrain vers l'école
const tun = new THREE.Group(); scene.add(tun); tun.position.set(0, 0, 1000);
{ const tube = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 40, 24, 1, true), vstd(0xe8e2d2, {side: THREE.BackSide})); tube.rotation.x = Math.PI / 2; tube.position.y = 2.2; tun.add(tube);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 40), vstd(0x9a948a)); fl.rotation.x = -Math.PI / 2; fl.position.y = .3; tun.add(fl);
  for (let i = 0; i < 8; i++){ const l = new THREE.Mesh(new THREE.BoxGeometry(.8, .1, .3), new THREE.MeshBasicMaterial({color: 0xfff6dd})); l.position.set(0, 4.2, -18 + i * 5); tun.add(l); const pl = new THREE.PointLight(0xfff0d0, 4, 8, 1.6); pl.position.set(0, 3.8, -18 + i * 5); tun.add(pl); }
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(2.4, .6), new THREE.MeshBasicMaterial({map: canvasTex(400, 100, (c) => { c.fillStyle = '#1e7a46'; c.fillRect(0, 0, 400, 100); c.fillStyle = '#fff'; c.font = '900 52px Inter'; c.textAlign = 'center'; c.fillText('→ ÉCOLE', 200, 70); })})); sg.position.set(0, 3.5, -19.9); tun.add(sg); }
// tunnel routier à une voie (route + rail) dans la montagne
const roadTun = new THREE.Group(); scene.add(roadTun); roadTun.position.set(0, 0, 1100);
{ const rock = vstd(0x5a5850, {flatShading: true}); const mtn = new THREE.Mesh(new THREE.ConeGeometry(60, 70, 8, 3), rock); mtn.position.set(0, 25, -72); roadTun.add(mtn);
  const snow = new THREE.Mesh(new THREE.ConeGeometry(28, 30, 8), vstd(0xf4f7fb, {flatShading: true})); snow.position.set(0, 45, -76); roadTun.add(snow);
  const portal = new THREE.Mesh(new THREE.BoxGeometry(14, 12, 4), vstd(0x9a948a)); portal.position.set(0, 6, -8); roadTun.add(portal); const hole = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshBasicMaterial({color: 0x050505})); hole.position.set(0, 3.5, -5.95); roadTun.add(hole);
  const ps = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.6), vstd(0xffffff, {map: canvasTex(800, 128, (c) => { c.fillStyle = '#1e5a3a'; c.fillRect(0, 0, 800, 128); c.fillStyle = '#fff'; c.font = '700 54px "DejaVu Sans", sans-serif'; c.textAlign = 'center'; c.fillText('ANTON ANDERSON TUNNEL', 400, 84); })})); ps.position.set(0, 10, -5.95); roadTun.add(ps);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(6, 60), vstd(0x4a4a4c)); road.rotation.x = -Math.PI / 2; road.position.set(0, .05, 20); roadTun.add(road);
  for (const x of [-.9, .9]){ const rail = new THREE.Mesh(new THREE.BoxGeometry(.15, .15, 60), vstd(0x8a8a8a, {metalness: .7})); rail.position.set(x, .12, 20); roadTun.add(rail); }
  const gate = new THREE.Group(); gate.position.set(4, 1.1, 2); roadTun.add(gate); const arm = new THREE.Mesh(new THREE.BoxGeometry(7, .25, .25), vstd(0xffffff, {map: canvasTex(256, 16, (c) => { for (let i = 0; i < 8; i++){ c.fillStyle = i % 2 ? '#e1000f' : '#ffffff'; c.fillRect(i * 32, 0, 32, 16); } })})); arm.position.x = -3.5; gate.add(arm); roadTun.userData.gate = gate;
  const tl = new THREE.Group(); tl.position.set(5, 0, 1); roadTun.add(tl); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 4), vstd(0x333333)); pole.position.y = 2; tl.add(pole); const lampR = new THREE.Mesh(new THREE.SphereGeometry(.3, 12, 10), new THREE.MeshBasicMaterial({color: 0xff2020})); lampR.position.y = 4.3; tl.add(lampR);
  const closed = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.4), vstd(0xffffff, {map: canvasTex(600, 210, (c) => { c.fillStyle = '#c0102a'; c.fillRect(0, 0, 600, 210); c.fillStyle = '#fff'; c.font = '900 84px Inter'; c.textAlign = 'center'; c.fillText('FERMÉ', 300, 95); c.font = '800 46px Inter'; c.fillText('réouverture 5 h 30', 300, 170); })})); closed.position.set(5, 5.4, 1.05); roadTun.add(closed); roadTun.userData.closed = closed; }
const train = new THREE.Group(); scene.add(train); { for (let k = 0; k < 3; k++){ const car = new THREE.Mesh(new THREE.BoxGeometry(3, 3.6, 12), vstd(k ? 0x1f3d7a : 0xf1c40f, {roughness: .4})); car.position.set(0, 2.2, -k * 12.6); car.castShadow = true; train.add(car); const win = new THREE.Mesh(new THREE.BoxGeometry(3.05, .8, 10), vstd(0x1a2430, {roughness: .1})); win.position.set(0, 2.8, -k * 12.6); train.add(win); } }
const wcar = new THREE.Group(); scene.add(wcar); { const b = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 4.4), vstd(0x3a6a8a, {roughness: .3, metalness: .3})); b.position.y = .9; wcar.add(b); const c = new THREE.Mesh(new THREE.BoxGeometry(2, .9, 2.4), vstd(0x2a3a4a)); c.position.set(0, 1.85, -.2); wcar.add(c);
  for (const [x, z] of [[-1.1, 1.5], [1.1, 1.5], [-1.1, -1.5], [1.1, -1.5]]){ const w = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .3, 14), vstd(0x111111)); w.rotation.z = Math.PI / 2; w.position.set(x, .42, z); wcar.add(w); }
  const hl = new THREE.Mesh(new THREE.BoxGeometry(1.8, .2, .05), new THREE.MeshBasicMaterial({color: 0xfff2c0})); hl.position.set(0, .9, 2.23); wcar.add(hl); }
// figurines : un enfant en pantoufles, des voisins
const kid = ancien({coat: 0xe67e22}); kid.scale.setScalar(.7); { const sl = new THREE.MeshStandardMaterial({color: 0xff8fa3, roughness: .9}); for (const s of [-1, 1]){ const p = new THREE.Mesh(new THREE.SphereGeometry(.2, 10, 8), sl); p.scale.set(1, .6, 1.6); p.position.set(s * .17, .1, .12); kid.add(p); } }
const neighbors = Array.from({length: 3}, (_, i) => ancien({coat: [0x1f3d7a, 0x6a7a9a, 0x8a4a5a][i], beret: i === 0}));
{ const badge = new THREE.Mesh(new THREE.BoxGeometry(.18, .22, .04), vstd(0xf2c94c, {metalness: .7})); badge.position.set(.2, 1.5, .42); neighbors[0].add(badge); }
const hallway = new THREE.Group(); scene.add(hallway); hallway.position.set(0, 0, 1200);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(4, 30), vstd(0x8a7a66)); fl.rotation.x = -Math.PI / 2; hallway.add(fl); for (const x of [-2, 2]){ const w = new THREE.Mesh(new THREE.PlaneGeometry(30, 3.4), vstd(0xe8e2d2, {side: THREE.DoubleSide})); w.rotation.y = Math.PI / 2; w.position.set(x, 1.7, 0); hallway.add(w); }
  const labels = ['1402', 'POLICE', '1404', 'MAIRE', '1406', '1407']; labels.forEach((l, i) => { const x = i % 2 ? 1.98 : -1.98; const d = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.2), vstd(0x6a4428)); d.position.set(x, 1.1, -10 + i * 4); d.rotation.y = i % 2 ? -Math.PI / 2 : Math.PI / 2; hallway.add(d);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(.7, .25), new THREE.MeshBasicMaterial({map: canvasTex(280, 100, (c) => { c.fillStyle = '#f2c94c'; c.fillRect(0, 0, 280, 100); c.fillStyle = '#222'; c.font = '900 56px Inter'; c.textAlign = 'center'; c.fillText(l, 140, 72); })})); pl.position.set(x + (i % 2 ? -.02 : .02), 1.9, -10 + i * 4); pl.rotation.y = d.rotation.y; hallway.add(pl); });
  for (let i = 0; i < 5; i++){ const l = new THREE.PointLight(0xfff0d0, 5, 8, 1.5); l.position.set(0, 3.1, -12 + i * 6); hallway.add(l); } }
ALL.push(WG, cut, tun, roadTun, train, wcar, kid, ...neighbors, hallway);
function wLook(night = false){ look('day'); scene.environment = null; setSky(night ? 'alaskaN' : 'alaska', night ? 1.5 : 16, 200, 6, night ? 2.4 : 1.4, .006);
  renderer.toneMappingExposure = night ? .42 : .3; sunLight.intensity = night ? .9 : 1.5; sunLight.color.set(night ? 0x9db8ff : 0xfff0e0); hemi.intensity = night ? 1.3 : .8; hemi.color.set(night ? 0x8fa8e8 : 0xdfe8f0); hemi.groundColor.set(0x4a5246);
  scene.fog = new THREE.Fog(night ? 0x1a2438 : 0xd8e0e8, 300, 1600); bloom.strength = .2; }
