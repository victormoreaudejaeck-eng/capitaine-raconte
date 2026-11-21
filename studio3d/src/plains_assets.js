
// ===================== « ET C'EST VRAI » : Monowi (Nebraska), 1 habitante =====================
const PG = new THREE.Group(); scene.add(PG);
const prairieT = canvasTex(1024, 1024, (c) => { const r = rng(4); c.fillStyle = '#c9a85a'; c.fillRect(0, 0, 1024, 1024); const cols = ['#b8964a', '#d6b866', '#a8883f', '#c4a052', '#9a8a48'];
  for (let i = 0; i < 40; i++){ c.fillStyle = cols[Math.floor(r() * cols.length)]; c.globalAlpha = .5; c.fillRect(r() * 1024, r() * 1024, 200 + r() * 300, 120 + r() * 200); } c.globalAlpha = 1;
  for (let i = 0; i < 14000; i++){ c.fillStyle = `rgba(${r() < .5 ? '90,70,30' : '240,220,150'},${r() * .2})`; c.fillRect(r() * 1024, r() * 1024, 1, 3 + r() * 3); } });
prairieT.wrapS = prairieT.wrapT = THREE.RepeatWrapping; prairieT.repeat.set(8, 8);
const pH = (x, z) => Math.sin(x * .008) * 1.5 + Math.cos(z * .006) * 1.2;
{ const g = new THREE.PlaneGeometry(1600, 1600, 80, 80); g.rotateX(-Math.PI / 2); const pa = g.attributes.position; for (let i = 0; i < pa.count; i++) pa.setY(i, pH(pa.getX(i), pa.getZ(i)) - .1); g.computeVertexNormals();
  const m = new THREE.Mesh(g, vstd(0xffffff, {map: prairieT})); m.receiveShadow = true; PG.add(m); }
// route de terre + route goudronnée
{ const dirt = new THREE.Mesh(new THREE.PlaneGeometry(6, 700), vstd(0x9a8466, {polygonOffset: true, polygonOffsetFactor: -2})); dirt.rotation.x = -Math.PI / 2; dirt.position.set(0, .05, 0); dirt.receiveShadow = true; PG.add(dirt);
  const asph = new THREE.Mesh(new THREE.PlaneGeometry(700, 8), vstd(0x4a4a4c, {polygonOffset: true, polygonOffsetFactor: -3})); asph.rotation.x = -Math.PI / 2; asph.position.set(0, .07, 60); PG.add(asph);
  const line = new THREE.Mesh(new THREE.PlaneGeometry(700, .25), vstd(0xe8c840, {polygonOffset: true, polygonOffsetFactor: -4})); line.rotation.x = -Math.PI / 2; line.position.set(0, .08, 60); PG.add(line); }
// silo à grain + château d'eau
{ const metal = vstd(0xb8bcc0, {metalness: .6, roughness: .45}); const silo = new THREE.Group(); silo.position.set(-28, 0, -30); PG.add(silo);
  for (let i = 0; i < 3; i++){ const c = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 16, 24), metal); c.position.set(i * 6.4, 8, 0); c.castShadow = true; silo.add(c); const cap = new THREE.Mesh(new THREE.ConeGeometry(3.2, 2.4, 24), metal); cap.position.set(i * 6.4, 17.2, 0); silo.add(cap); }
  const elev = new THREE.Mesh(new THREE.BoxGeometry(5, 26, 5), vstd(0x8a7a66)); elev.position.set(19, 13, 0); elev.castShadow = true; silo.add(elev);
  const wt = new THREE.Group(); wt.position.set(30, 0, -50); PG.add(wt); const tank = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 14), vstd(0xd8d8d0, {metalness: .3})); tank.position.y = 18; wt.add(tank);
  for (let i = 0; i < 4; i++){ const a = i / 4 * Math.PI * 2; const leg = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 17), vstd(0x7a7a72)); leg.position.set(Math.cos(a) * 2.6, 8.5, Math.sin(a) * 2.6); wt.add(leg); }
  const wl = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.2), vstd(0xffffff, {transparent: true, map: canvasTex(512, 120, (c) => { c.fillStyle = '#2a4a7a'; c.font = '900 92px Inter'; c.textAlign = 'center'; c.fillText('MONOWI', 256, 96); })})); wl.position.set(0, 18, 4.05); wt.add(wl); }
// maisons en bois abandonnées (gris délavé), quelques-unes encore entretenues
const weathered = canvasTex(256, 256, (c) => { c.fillStyle = '#9a948a'; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 14){ c.fillStyle = `rgba(${Math.random() < .5 ? '60,55,50' : '200,195,185'},${.2 + Math.random() * .2})`; c.fillRect(0, y, 256, 2); } for (let i = 0; i < 600; i++){ c.fillStyle = `rgba(40,35,30,${Math.random() * .15})`; c.fillRect(Math.random() * 256, Math.random() * 256, 3, 1); } });
const ghostHouses = [];
function farmHouse(x, z, rot, abandoned = true, col = 0xffffff){ const g = new THREE.Group(); g.position.set(x, pH(x, z), z); g.rotation.y = rot; const wm = abandoned ? vstd(0xffffff, {map: weathered}) : vstd(col);
  const b = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 8), wm); b.position.y = 2.5; b.castShadow = b.receiveShadow = true; g.add(b); const roof = new THREE.Mesh(roofGeo(7, 8, 3.6), vstd(abandoned ? 0x5a4a3e : 0x6a3a2a)); roof.position.y = 5; roof.castShadow = true; g.add(roof);
  for (const wx of [-1.8, 1.8]){ const wn = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.3), vstd(abandoned ? 0x1a1814 : 0x8fb8d0)); wn.position.set(wx, 3, 4.02); g.add(wn); if (abandoned){ const pl = new THREE.Mesh(new THREE.BoxGeometry(1.3, .18, .05), vstd(0x6a5a48)); pl.position.set(wx, 3, 4.06); pl.rotation.z = .4; g.add(pl); } }
  const door = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.2), vstd(abandoned ? 0x2a2420 : 0x7a4a2a)); door.position.set(0, 1.1, 4.02); g.add(door);
  if (abandoned){ g.rotation.z = (Math.random() - .5) * .04; } PG.add(g); ghostHouses.push(g); return g; }
{ const r = rng(12); const spots = [[-16, 10], [14, 12], [-18, 28], [16, 30], [-15, -10], [17, -8], [-34, 16], [34, 14], [-12, 44], [40, 34]];
  spots.forEach(([x, z], i) => farmHouse(x, z, x < 0 ? Math.PI / 2 : -Math.PI / 2, true)); }
// église abandonnée
{ const ch = new THREE.Group(); ch.position.set(-40, 0, -6); ch.rotation.y = Math.PI / 2; PG.add(ch); const w = vstd(0xffffff, {map: weathered}); const nave = new THREE.Mesh(new THREE.BoxGeometry(7, 6, 12), w); nave.position.y = 3; nave.castShadow = true; ch.add(nave);
  const r = new THREE.Mesh(roofGeo(7, 12, 4), vstd(0x4a3e34)); r.position.y = 6; ch.add(r); const tw = new THREE.Mesh(new THREE.BoxGeometry(3, 6, 3), w); tw.position.set(0, 9, 5); ch.add(tw); const sp = new THREE.Mesh(new THREE.ConeGeometry(2.4, 5, 4), vstd(0x4a3e34)); sp.rotation.y = Math.PI / 4; sp.position.set(0, 14.5, 5); ch.add(sp); }
// vieille voiture rouillée
{ const car = new THREE.Group(); car.position.set(-9, 0, 18); car.rotation.y = .7; PG.add(car); const rust = vstd(0x8a4a2a, {roughness: .9}); const b = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 5), rust); b.position.y = .9; car.add(b); const cab = new THREE.Mesh(new THREE.BoxGeometry(2, .9, 2.4), rust); cab.position.set(0, 1.9, -.3); car.add(cab);
  for (const [x, z] of [[-1.1, 1.6], [1.1, 1.6], [-1.1, -1.6], [1.1, -1.6]]){ const w = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .3, 12), vstd(0x1a1a1a)); w.rotation.z = Math.PI / 2; w.position.set(x, .3, z); car.add(w); } }
// panneau « MONOWI pop. 1 »
const popSign = new THREE.Group(); PG.add(popSign); popSign.position.set(5.5, 0, 52);
{ const t = canvasTex(800, 440, (c) => { c.fillStyle = '#1f6b3a'; c.fillRect(0, 0, 800, 440); c.strokeStyle = '#fff'; c.lineWidth = 12; c.strokeRect(14, 14, 772, 412); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '700 150px "DejaVu Sans", sans-serif'; c.fillText('MONOWI', 400, 200); c.font = '700 110px "DejaVu Sans", sans-serif'; c.fillText('pop. 1', 400, 360); });
  const s = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2), vstd(0xffffff, {map: t, roughness: .4})); s.position.y = 2.6; popSign.add(s); for (const x of [-1.4, 1.4]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.12, 2.6, .12), vstd(0x8a8a8a, {metalness: .6})); p.position.set(x, 1.3, -.06); popSign.add(p); } }
// la taverne
const tavern = new THREE.Group(); PG.add(tavern); tavern.position.set(8, 0, 22); tavern.rotation.y = -Math.PI / 2;
{ const b = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 8), vstd(0xf2f0ea)); b.position.y = 2.5; b.castShadow = true; tavern.add(b); const r = new THREE.Mesh(new THREE.BoxGeometry(12.4, .4, 8.4), vstd(0x3a3a3a)); r.position.y = 5.2; tavern.add(r);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.3), vstd(0xffffff, {map: canvasTex(800, 150, (c) => { c.fillStyle = '#7a1a1a'; c.fillRect(0, 0, 800, 150); c.fillStyle = '#f4e6c8'; c.font = '700 96px "DejaVu Serif", serif'; c.textAlign = 'center'; c.fillText('MONOWI TAVERN', 400, 110); })})); sg.position.set(0, 4.2, 4.02); tavern.add(sg);
  const open = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .5), new THREE.MeshBasicMaterial({map: canvasTex(240, 100, (c) => { c.fillStyle = '#111'; c.fillRect(0, 0, 240, 100); c.fillStyle = '#ff3a3a'; c.font = '900 64px Inter'; c.textAlign = 'center'; c.fillText('OPEN', 120, 74); })})); open.position.set(3.4, 2.6, 4.03); tavern.add(open);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.3), vstd(0x5a3a22)); door.position.set(0, 1.15, 4.02); tavern.add(door); const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.4), new THREE.MeshStandardMaterial({color: 0xffd58a, emissive: 0xffa040, emissiveIntensity: .6})); win.position.set(-3.6, 2.6, 4.02); tavern.add(win); }
// camions de routiers
const trucks = []; for (let i = 0; i < 2; i++){ const t = new THREE.Group(); const cabm = vstd([0xc0392b, 0x2e86c1][i], {roughness: .35, metalness: .3}); const cab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3, 3), cabm); cab.position.set(0, 2, 4); t.add(cab); const box = new THREE.Mesh(new THREE.BoxGeometry(2.7, 3.4, 9), vstd(0xe8e8e8)); box.position.set(0, 2.2, -2.5); t.add(box);
  for (const z of [4, -1, -5]) for (const x of [-1.3, 1.3]){ const w = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .4, 14), vstd(0x111111)); w.rotation.z = Math.PI / 2; w.position.set(x, .55, z); t.add(w); } t.traverse(o => { if (o.isMesh) o.castShadow = true; }); scene.add(t); trucks.push(t); }
// intérieur de la taverne + bibliothèque (décors séparés)
const barIn = new THREE.Group(); scene.add(barIn); barIn.position.set(0, 0, 600);
{ const wood = vstd(0x6a4428, {roughness: .5}); const fl = new THREE.Mesh(new THREE.PlaneGeometry(20, 16), vstd(0x5a3a24)); fl.rotation.x = -Math.PI / 2; barIn.add(fl); const wall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), vstd(0x8a5a3a)); wall.position.set(0, 4, -6); barIn.add(wall);
  const counter = new THREE.Mesh(new THREE.BoxGeometry(12, 1.3, 1.4), wood); counter.position.set(0, .65, -2); barIn.add(counter); const top = new THREE.Mesh(new THREE.BoxGeometry(12.2, .12, 1.6), vstd(0x3a2416, {roughness: .3})); top.position.set(0, 1.36, -2); barIn.add(top);
  for (let i = 0; i < 5; i++){ const st = new THREE.Group(); st.position.set(-4.5 + i * 2.2, 0, 0); const seat = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .15, 16), vstd(0xa02020)); seat.position.y = 1.2; st.add(seat); const leg = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 1.2), vstd(0x888888, {metalness: .7})); leg.position.y = .6; st.add(leg); barIn.add(st); }
  for (let i = 0; i < 14; i++){ const b = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .6, 10), vstd([0x2a5a2a, 0x6a3a1a, 0xc8b060][i % 3], {roughness: .15})); b.position.set(-4 + i * .6, 3.0 + (i % 2) * 1.1, -5.7); barIn.add(b); }
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(9, .1, .5), wood); shelf.position.set(0, 2.68, -5.75); barIn.add(shelf); const shelf2 = shelf.clone(); shelf2.position.y = 3.78; barIn.add(shelf2);
  const lic = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.7), vstd(0xffffff, {map: PAPER((c) => { c.font = '700 54px "DejaVu Serif", serif'; c.fillText('LIQUOR LICENSE', 410, 180); c.font = '400 40px "DejaVu Serif", serif'; c.fillText('Village of Monowi', 410, 260); c.fillRect(160, 300, 500, 3); c.font = '400 34px "DejaVu Serif", serif'; c.fillText('Approved by: the Mayor', 410, 700); c.font = 'italic 44px "DejaVu Serif", serif'; c.fillText('Mayor', 410, 900); })})); lic.position.set(6.2, 3.4, -5.9); barIn.add(lic); barIn.userData.lic = lic;
  const lamp = new THREE.PointLight(0xffc880, 14, 18, 1.4); lamp.position.set(0, 6, 0); barIn.add(lamp); }
const library = new THREE.Group(); scene.add(library); library.position.set(0, 0, 700);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), vstd(0x7a5a3a)); fl.rotation.x = -Math.PI / 2; library.add(fl); const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), vstd(0xe8dcc4)); wall.position.set(0, 3.5, -5); library.add(wall);
  const cols = [0x8a2a2a, 0x2a4a7a, 0x2a6a3a, 0xc8a040, 0x5a3a6a, 0xd06a2a, 0x3a3a3a]; const r = rng(31);
  for (let s = 0; s < 3; s++){ const sh = new THREE.Group(); sh.position.set(-4.5 + s * 4.5, 0, -4.4); library.add(sh); const frame = new THREE.Mesh(new THREE.BoxGeometry(4, 5.6, .9), vstd(0x6a4428)); frame.position.y = 2.8; sh.add(frame);
    for (let row = 0; row < 5; row++){ let x = -1.8; while (x < 1.75){ const w = .1 + r() * .12, h = .7 + r() * .25; const bk = new THREE.Mesh(new THREE.BoxGeometry(w, h, .6), vstd(cols[Math.floor(r() * cols.length)], {roughness: .7})); bk.position.set(x + w / 2, .55 + row * 1.08 + h / 2, .2); sh.add(bk); x += w + .01; } } }
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(4.6, .9), vstd(0xffffff, {map: canvasTex(800, 160, (c) => { c.fillStyle = '#f4ead4'; c.fillRect(0, 0, 800, 160); c.fillStyle = '#3a2a1a'; c.font = '700 84px "DejaVu Serif", serif'; c.textAlign = 'center'; c.fillText("RUDY'S LIBRARY", 400, 110); })})); sg.position.set(0, 6.4, -4.95); library.add(sg);
  const box = new THREE.Mesh(new THREE.BoxGeometry(.9, .7, .6), vstd(0x6a4428)); box.position.set(4.6, 1.2, -1.5); library.add(box); const bl = new THREE.Mesh(new THREE.PlaneGeometry(.85, .3), vstd(0xffffff, {map: canvasTex(300, 100, (c) => { c.fillStyle = '#fff'; c.fillRect(0, 0, 300, 100); c.fillStyle = '#222'; c.font = '700 40px Inter'; c.textAlign = 'center'; c.fillText('HONOR BOX', 150, 64); })})); bl.position.set(4.6, 1.2, -1.19); library.add(bl);
  const lampL = new THREE.PointLight(0xffd8a0, 10, 14, 1.4); lampL.position.set(0, 5, 1); library.add(lampL); }
// figurines (vues de dos uniquement) : Elsie et Rudy
const elsie = ancien({coat: 0x6a7a9a}), rudy = ancien({coat: 0x5a4a3a, beret: true});
const townsfolk30 = Array.from({length: 8}, (_, i) => ancien({coat: [0x5a4a3a, 0x3a3a4a, 0x6a5a4a, 0x4a3a2a][i % 4], beret: i % 2 === 0}));
ALL.push(PG, trucks[0], trucks[1], barIn, library, elsie, rudy, ...townsfolk30);
function pLookDoc(){ look('day'); setSky('plains', 12, 240, 4, 1.6, .006); renderer.toneMappingExposure = .62; sunLight.intensity = 3.0; sunLight.color.set(0xffc88a); hemi.intensity = 1.1; hemi.color.set(0xe0e8ff); hemi.groundColor.set(0x8a7a50);
  scene.fog = new THREE.Fog(0xe8d4b0, 180, 1100); bloom.strength = .18; scene.environment = null; }
