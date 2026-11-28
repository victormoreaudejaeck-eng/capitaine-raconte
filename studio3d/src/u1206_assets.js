
// ===================== « ET C'EST VRAI » : U-1206, perdu à cause de ses toilettes (14 avril 1945) =====================
const subMat = std(0x4a5058, {roughness: .55, metalness: .35}), subDark = std(0x2c3036, {roughness: .6, metalness: .3});
function makeSub(rusty){ const g = new THREE.Group(); const m = rusty ? std(0x3e4a3e, {roughness: .95}) : subMat, md = rusty ? std(0x2e3a30, {roughness: 1}) : subDark;
  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(2.6, 52, 8, 24), m); hull.rotation.x = Math.PI / 2; hull.scale.set(1, 1, .9); hull.castShadow = true; g.add(hull);
  const bowTip = new THREE.Mesh(new THREE.ConeGeometry(1.6, 6, 18), m); bowTip.rotation.x = Math.PI / 2; bowTip.position.z = 30; g.add(bowTip);
  const casing = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 50), md); casing.position.y = 2.6; g.add(casing);
  const tower = new THREE.Mesh(new THREE.CapsuleGeometry(1.6, 4.5, 6, 16), m); tower.rotation.x = Math.PI / 2; tower.scale.set(1, 1, 1.6); tower.position.set(0, 4.6, 2); g.add(tower);
  const towerTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, .3, 7.2), md); towerTop.position.set(0, 6.2, 2); g.add(towerTop);
  for (const [x, h] of [[-.3, 4], [.3, 3]]){ const per = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, h, 10), md); per.position.set(x, 6.2 + h / 2, 3); g.add(per); }
  const rail = new THREE.Mesh(new THREE.TorusGeometry(1.4, .06, 6, 20, Math.PI), md); rail.rotation.x = -Math.PI / 2; rail.position.set(0, 6.9, -1.2); g.add(rail);
  for (const s of [-1, 1]){ const pl = new THREE.Mesh(new THREE.BoxGeometry(3.4, .15, 1.4), md); pl.position.set(s * 3.6, -.6, 24); g.add(pl); const pr = new THREE.Mesh(new THREE.BoxGeometry(3, .15, 1.2), md); pr.position.set(s * 3.2, -.6, -26); g.add(pr); }
  const rud = new THREE.Mesh(new THREE.BoxGeometry(.2, 3, 2), md); rud.position.set(0, 0, -29); g.add(rud);
  scene.add(g); return g; }
const sub = makeSub(false), wreck = makeSub(true); wreck.rotation.set(.12, .5, .35);
// fond marin
const seabed = new THREE.Mesh(new THREE.PlaneGeometry(400, 400, 60, 60), std(0x6f6a55, {roughness: 1})); seabed.rotation.x = -Math.PI / 2; { const a = seabed.geometry.attributes.position; for (let i = 0; i < a.count; i++) a.setZ(i, Math.sin(a.getX(i) * .1) * .8 + Math.cos(a.getY(i) * .13) * .6); seabed.geometry.computeVertexNormals(); } scene.add(seabed);
const weeds = new THREE.Group(); scene.add(weeds); { const r = rng(5); for (let i = 0; i < 60; i++){ const w = new THREE.Mesh(new THREE.ConeGeometry(.3, 2 + r() * 3, 5), std(0x3c5a3a, {roughness: 1})); w.position.set(r() * 80 - 40, 1, r() * 80 - 40); weeds.add(w); } }
// côte écossaise (falaises)
const coast = new THREE.Group(); scene.add(coast); { const r = rng(8); for (let i = 0; i < 26; i++){ const c = new THREE.Mesh(new THREE.BoxGeometry(30 + r() * 30, 18 + r() * 22, 30), std(0x5d6650, {roughness: 1})); c.position.set(-380 + i * 30, 6, 0); c.rotation.y = r() * .3; coast.add(c); const top = new THREE.Mesh(new THREE.BoxGeometry(c.geometry.parameters.width, 2, 30), std(0x4f6a3a)); top.position.set(c.position.x, c.position.y + c.geometry.parameters.height / 2, 0); top.rotation.y = c.rotation.y; coast.add(top); } }
// ---- intérieur : coursive ----
const cabin = new THREE.Group(); scene.add(cabin);
const ironM = std(0x7d8278, {roughness: .5, metalness: .5}), paintM = std(0xd8d2bf, {roughness: .7}), pipeM = std(0x8a6a3a, {roughness: .35, metalness: .8}), redM = std(0xb0201c, {roughness: .4});
{ const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 14, 28, 1, true), new THREE.MeshStandardMaterial({color: 0xd8d2bf, roughness: .7, side: THREE.BackSide})); shell.rotation.x = Math.PI / 2; shell.position.set(0, 1.25, 0); shell.receiveShadow = true; cabin.add(shell);
  const floor = new THREE.Mesh(new THREE.BoxGeometry(1.8, .06, 14), std(0x3a3a36, {roughness: .8, metalness: .4})); floor.position.y = 0; cabin.add(floor);
  for (let i = 0; i < 6; i++){ const p = new THREE.Mesh(new THREE.CylinderGeometry(.05 + (i % 2) * .03, .05 + (i % 2) * .03, 14, 10), i % 3 ? pipeM : ironM); p.rotation.x = Math.PI / 2; p.position.set(-.9 + i * .36, 2.35 - Math.abs(-.9 + i * .36) * .5, 0); cabin.add(p); }
  for (let z = -6; z <= 6; z += 2){ const rib = new THREE.Mesh(new THREE.TorusGeometry(1.48, .05, 6, 28), ironM); rib.position.set(0, 1.25, z); cabin.add(rib); const lamp = new THREE.Mesh(new THREE.SphereGeometry(.09, 10, 8), new THREE.MeshBasicMaterial({color: 0xffe0a0})); lamp.position.set(0, 2.62, z + 1); cabin.add(lamp); }
  for (const s of [-1, 1]) for (let z = -5; z <= 5; z += 2.5){ const bunk = new THREE.Mesh(new THREE.BoxGeometry(.6, .12, 1.9), std(0x5a4a3a)); bunk.position.set(s * 1.05, 1.3, z); cabin.add(bunk); const blank = new THREE.Mesh(new THREE.BoxGeometry(.55, .08, 1.7), std(0x6a7a5a)); blank.position.set(s * 1.05, 1.39, z); cabin.add(blank); } }
const cabinLight = new THREE.PointLight(0xffd8a0, 0, 14, 1.4); cabinLight.position.set(0, 2.2, 0); scene.add(cabinLight);
// ---- cabinet des toilettes (bout de coursive, z = -5) ----
const wc = new THREE.Group(); scene.add(wc);
{ const back = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, .1), paintM); back.position.set(0, 1.3, -.6); wc.add(back);
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.24, .17, .42, 20), std(0xf2f2ee, {roughness: .2})); bowl.position.set(0, .21, 0); wc.add(bowl);
  const seat = new THREE.Mesh(new THREE.TorusGeometry(.2, .05, 8, 20), std(0x3a2a1a, {roughness: .4})); seat.rotation.x = Math.PI / 2; seat.position.set(0, .44, 0); wc.add(seat);
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 2.0, 10), pipeM); pipe.position.set(0, 1.3, -.45); wc.add(pipe);
  wc.userData.wheels = []; const cols = [0xb0201c, 0x2a5aa8, 0xb0201c, 0x2a7a3a, 0xc8a020, 0x2a5aa8];
  [[-.5, 1.0], [.5, 1.0], [-.5, 1.5], [.5, 1.5], [-.3, 2.0], [.3, 2.0]].forEach(([x, y], i) => { const w = new THREE.Group(); const rim = new THREE.Mesh(new THREE.TorusGeometry(.12, .025, 6, 16), std(cols[i], {roughness: .4})); w.add(rim); for (let k = 0; k < 3; k++){ const sp = new THREE.Mesh(new THREE.BoxGeometry(.24, .02, .02), std(cols[i])); sp.rotation.z = k * Math.PI / 3; w.add(sp); } w.position.set(x, y, -.48); wc.add(w); wc.userData.wheels.push(w); const st = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .1, 8), pipeM); st.rotation.x = Math.PI / 2; st.position.set(x, y, -.53); wc.add(st); });
  const lever = new THREE.Mesh(new THREE.BoxGeometry(.05, .4, .05), ironM); lever.position.set(.3, .62, -.35); lever.rotation.z = .5; wc.add(lever); wc.userData.lever = lever;
  const g = new THREE.Mesh(new THREE.CircleGeometry(.13, 24), std(0xffffff, {map: canvasTex(128, 128, (c) => { c.fillStyle = '#f4efe0'; c.beginPath(); c.arc(64, 64, 62, 0, 7); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 4; c.stroke(); c.save(); c.translate(64, 64); c.rotate(.8); c.fillStyle = '#b0201c'; c.fillRect(-3, -50, 6, 50); c.restore(); })})); g.position.set(0, 1.25, -.54); wc.add(g);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(.7, .22), std(0xffffff, {map: canvasTex(512, 160, (c) => { c.fillStyle = '#1c1c1a'; c.fillRect(0, 0, 512, 160); c.fillStyle = '#e8dcb0'; c.font = '700 64px serif'; c.textAlign = 'center'; c.fillText('WC', 256, 105); })})); plate.position.set(0, 2.35, -.54); wc.add(plate); }
// jet d'eau + niveau d'inondation
const geyser = new THREE.Mesh(new THREE.CylinderGeometry(.08, .3, 1.6, 14, 1, true), new THREE.MeshStandardMaterial({color: 0x9fd2e8, transparent: true, opacity: .7, roughness: .1})); scene.add(geyser);
const splash = new THREE.Group(); scene.add(splash); { const r = rng(4); for (let i = 0; i < 40; i++){ const d = new THREE.Mesh(new THREE.SphereGeometry(.03 + r() * .04, 6, 5), new THREE.MeshStandardMaterial({color: 0xbfe4f2, transparent: true, opacity: .8})); d.userData = [r() * 6.3, r(), .6 + r()]; splash.add(d); } }
function splashAt(c, t){ splash.position.copy(c); splash.children.forEach(d => { const [a, ph, s] = d.userData; const k = (t * 1.4 * s + ph) % 1; d.position.set(Math.cos(a) * k * .9, 1.4 * k - 2.2 * k * k + .2, Math.sin(a) * k * .9); }); }
const floodM = new THREE.MeshStandardMaterial({color: 0x3f7f96, transparent: true, opacity: .75, roughness: .05}); const flood = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 14, 20, 60), floodM); flood.rotation.x = -Math.PI / 2; scene.add(flood);
function floodLevel(y, t){ flood.position.y = y; const a = flood.geometry.attributes.position; for (let i = 0; i < a.count; i++) a.setZ(i, Math.sin(a.getX(i) * 6 + t * 4) * .015 + Math.sin(a.getY(i) * 3 - t * 3) * .02); a.needsUpdate = true; }
// batteries sous le plancher (vue en coupe)
const batt = new THREE.Group(); scene.add(batt); { for (let x = -3; x <= 3; x++) for (let z = -2; z <= 2; z++){ const b = new THREE.Mesh(new THREE.BoxGeometry(.42, .7, .42), std(0x1d1d1d, {roughness: .5})); b.position.set(x * .5, .35, z * .5); batt.add(b); for (const s of [-1, 1]){ const tm = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .1, 8), std(s > 0 ? 0xb0201c : 0x777777, {metalness: .7, roughness: .3})); tm.position.set(x * .5 + s * .1, .75, z * .5); batt.add(tm); } }
  const grate = new THREE.Mesh(new THREE.BoxGeometry(3.8, .04, 2.8), new THREE.MeshStandardMaterial({color: 0x555550, transparent: true, opacity: .35, metalness: .6})); grate.position.y = 1.15; batt.add(grate); }
// chlore (nuage vert)
const gas = Array.from({length: 26}, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(.3, 10, 8), new THREE.MeshBasicMaterial({color: 0x9fd35a, transparent: true, opacity: .35, depthWrite: false, fog: false})); scene.add(m); return m; });
function gasAt(c, t, k = 1, spread = 1){ gas.forEach((m, i) => { const ph = (t * .25 + i / gas.length) % 1; m.visible = true; m.position.set(c.x + Math.sin(i * 2.3) * spread * (.3 + ph), c.y + ph * 1.6 * k, c.z + Math.cos(i * 1.7) * spread * (.3 + ph) * 2); m.scale.setScalar((.6 + ph * 1.8) * k); m.material.opacity = .4 * (1 - ph * .6); }); }
// manomètre de profondeur
const DEPTH_TEX = canvasTex(512, 512, (c) => { c.fillStyle = '#efe6cc'; c.beginPath(); c.arc(256, 256, 250, 0, 7); c.fill(); c.lineWidth = 16; c.strokeStyle = '#7a6a40'; c.stroke(); c.fillStyle = '#222'; c.textAlign = 'center'; c.font = '700 40px serif';
  for (let i = 0; i <= 10; i++){ const a = -Math.PI * 1.25 + i * Math.PI * .25; c.save(); c.translate(256, 256); c.rotate(a + Math.PI / 2); c.fillRect(-3, -230, 6, 30); c.restore(); c.fillText(String(i * 20), 256 + Math.cos(a) * 170, 268 + Math.sin(a) * 170); }
  c.font = '700 34px serif'; c.fillText('PROFONDEUR (m)', 256, 400); });
const gauge = new THREE.Group(); scene.add(gauge); { const face = new THREE.Mesh(new THREE.CircleGeometry(.5, 40), std(0xffffff, {map: DEPTH_TEX, roughness: .5})); gauge.add(face); const ring = new THREE.Mesh(new THREE.TorusGeometry(.5, .05, 10, 40), pipeM); gauge.add(ring);
  const needle = new THREE.Mesh(new THREE.BoxGeometry(.025, .38, .01), std(0xb0201c)); needle.geometry.translate(0, .17, 0); needle.position.z = .02; gauge.add(needle); gauge.userData.needle = needle; }
function setDepth(m){ gauge.userData.needle.rotation.z = -(-Math.PI * 1.25 + (m / 20) * Math.PI * .25 + Math.PI / 2); }
// mode d'emploi reconstitué + carte
const manual = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.414), std(0xffffff, {roughness: .9, map: PAPER((c) => { c.font = '700 54px serif'; c.fillText('WC HAUTE PRESSION', 410, 120); c.font = '400 34px serif'; c.fillText('Mode d\'emploi (reconstitution)', 410, 175);
  const steps = ['1. Fermer la vanne A', '2. Ouvrir la vanne B', '3. Vérifier la pression', '4. Ouvrir la vanne C', '5. Actionner le levier', '6. Refermer B puis C', '7. NE JAMAIS inverser'];
  c.textAlign = 'left'; c.font = '400 40px serif'; steps.forEach((s, i) => { c.fillStyle = i === 6 ? '#b0201c' : '#1e1e1e'; c.fillText(s, 110, 300 + i * 95); }); c.fillStyle = '#1e1e1e'; c.textAlign = 'center'; c.font = 'italic 32px serif'; c.fillText('Réservé au personnel formé', 410, 1050); })})); scene.add(manual);
const mapDoc = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6), std(0xffffff, {roughness: .9, map: canvasTex(900, 1200, (c) => { c.fillStyle = '#c9dbe0'; c.fillRect(0, 0, 900, 1200); c.fillStyle = '#e6dcc0'; c.strokeStyle = '#7a6a50'; c.lineWidth = 5;
  c.beginPath(); c.moveTo(0, 120); c.lineTo(260, 140); c.lineTo(330, 260); c.lineTo(420, 300); c.lineTo(560, 330); c.lineTo(600, 420); c.lineTo(560, 560); c.lineTo(520, 640); c.lineTo(420, 760); c.lineTo(340, 820); c.lineTo(250, 900); c.lineTo(180, 1050); c.lineTo(0, 1100); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#1e1e1e'; c.font = '700 44px serif'; c.textAlign = 'left'; c.fillText('ÉCOSSE', 90, 620); c.font = 'italic 44px serif'; c.fillStyle = '#2a4a5a'; c.fillText('Mer du Nord', 600, 900);
  c.fillStyle = '#b0201c'; c.beginPath(); c.arc(590, 470, 14, 0, 7); c.fill(); c.font = '700 38px serif'; c.fillText('Peterhead', 420, 470 + 70);
  c.strokeStyle = '#b0201c'; c.lineWidth = 8; c.beginPath(); c.moveTo(690, 440); c.lineTo(740, 490); c.moveTo(740, 440); c.lineTo(690, 490); c.stroke(); c.font = '700 34px serif'; c.fillText('U-1206', 700, 420); })})); scene.add(mapDoc);
// canots de sauvetage
const rafts = [0, 1, 2].map(() => { const g = new THREE.Group(); const r = new THREE.Mesh(new THREE.TorusGeometry(1.2, .35, 10, 24), std(0xd8a020, {roughness: .6})); r.rotation.x = Math.PI / 2; g.add(r); const f = new THREE.Mesh(new THREE.CircleGeometry(1.1, 20), std(0x8a6a20)); f.rotation.x = -Math.PI / 2; f.position.y = -.1; g.add(f); scene.add(g); return g; });
// équipage (figurines)
const crew = [0, 1, 2, 3, 4, 5].map(i => makePerson({jacket: [0x3a3f46, 0x4a4a42, 0x2e3440, 0x3a3f46, 0x45403a, 0x2e3440][i], pants: 0x2a2e36, hairCss: '#2a1d14', brow: '#2a1d14', cap: 0x2a2e36}));
crew.forEach(p => scene.add(p));
const kmdt = makePerson({jacket: 0x2a2a2a, pants: 0x1e1e1e, hairCss: '#3a2a1a', cap: 0xf2f2ee}); scene.add(kmdt);
ALL.push(sub, wreck, seabed, weeds, coast, cabin, wc, geyser, splash, flood, batt, ...gas, gauge, manual, mapDoc, ...rafts, ...crew, kmdt);
