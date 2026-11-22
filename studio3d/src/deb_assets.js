
// ===================== Marine Le Pen partie 3 : la ville des fiches =====================
const FICHE = canvasTex(256, 180, (c) => { c.fillStyle = '#fffdf2'; c.fillRect(0, 0, 256, 180); c.strokeStyle = '#9ab8e0'; c.lineWidth = 3; for (let y = 40; y < 180; y += 22){ c.beginPath(); c.moveTo(10, y); c.lineTo(246, y); c.stroke(); } c.strokeStyle = '#e06060'; c.beginPath(); c.moveTo(30, 0); c.lineTo(30, 180); c.stroke(); c.fillStyle = '#333'; c.font = '700 22px Inter'; c.fillText('FICHE n°…', 40, 30); });
const ficheMat = toon(0xffffff, {map: FICHE, side: THREE.DoubleSide});
const fiches = Array.from({length: 40}, () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(.7, .5), ficheMat); scene.add(m); return m; });
function stackIn(p, n = 8){ const s = new THREE.Group(); for (let i = 0; i < n; i++){ const f = new THREE.Mesh(new THREE.BoxGeometry(.7, .02, .5), [ficheMat, ficheMat, ficheMat, ficheMat, ficheMat, ficheMat]); f.position.set((i % 3 - 1) * .03, i * .025, (i % 2) * .03); f.rotation.y = (i % 4 - 1.5) * .06; s.add(f); } s.position.set(0, 2.3, .75); p.add(s); s.visible = false; return s; }
const stackMarine = stackIn(marine, 10);
// boutique téléphone qui vend des turbines / usine de turbines qui vend des forfaits
function shop(title, sub, col){ const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(9, 6, 6), toon(0xf4efe4)); b.position.y = 3; g.add(b); const s = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.4), toon(0xffffff, {map: lSign([[title, 120, 170], [sub, 60, 300]], col)})); s.position.set(0, 5, 3.01); g.add(s); const counter = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 1.4), toon(0x8a5a3a)); counter.position.set(0, .6, 4.2); g.add(counter); scene.add(g); return g; }
const phoneShop = shop('TÉLÉPHONIE', 'forfaits · smartphones', '#d62828');
const turbineShop = shop('USINE DE TURBINES', 'industrie lourde', '#1f4e79');
const turbine = new THREE.Group(); scene.add(turbine); { const body = new THREE.Mesh(new THREE.CylinderGeometry(.55, .7, 1.8, 24), toon(0xb8c0c8, {metalness: .5, roughness: .35})); body.rotation.z = Math.PI / 2; turbine.add(body); const hub = new THREE.Group(); hub.position.x = 1.0; turbine.add(hub); for (let i = 0; i < 6; i++){ const bl = new THREE.Mesh(new THREE.BoxGeometry(.06, 1.1, .3), toon(0x8a949e, {metalness: .6})); bl.position.y = .55; const piv = new THREE.Group(); piv.rotation.x = i * Math.PI / 3; piv.add(bl); hub.add(piv); } turbine.userData.hub = hub; }
const phoneBox = new THREE.Group(); scene.add(phoneBox); { const b = new THREE.Mesh(new THREE.BoxGeometry(.5, .9, .06), toon(0x111111)); phoneBox.add(b); const sc = new THREE.Mesh(new THREE.PlaneGeometry(.42, .78), new THREE.MeshBasicMaterial({map: lSign([['FORFAIT', 100, 160], ['5G', 160, 330]], '#2b5aa8', '#fff', 300, 560)})); sc.position.z = .035; phoneBox.add(sc); }
// météo à la boulangerie
const meteo = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), toon(0xffffff, {map: canvasTex(520, 320, (c) => { c.fillStyle = '#4a90d9'; c.fillRect(0, 0, 520, 320); c.fillStyle = '#ffd43b'; c.beginPath(); c.arc(140, 150, 70, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(300, 180, 55, 0, 7); c.arc(360, 160, 65, 0, 7); c.arc(420, 185, 50, 0, 7); c.fill(); c.font = '900 56px Inter'; c.textAlign = 'center'; c.fillText('MÉTÉO : 14 °C', 260, 300); }), side: THREE.DoubleSide})); scene.add(meteo);
// cabinet médical
const doctorRoom = new THREE.Group(); scene.add(doctorRoom); doctorRoom.position.set(0, 0, 900);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), toon(0xd8dde2)); fl.rotation.x = -Math.PI / 2; doctorRoom.add(fl); const w = new THREE.Mesh(new THREE.PlaneGeometry(20, 9), toon(0xeef3f6)); w.position.set(0, 4.5, -4); doctorRoom.add(w); const cross = new THREE.Group(); cross.position.set(-3.5, 5.6, -3.95); doctorRoom.add(cross); for (const [w2, h2] of [[1.2, .4], [.4, 1.2]]){ const m = new THREE.Mesh(new THREE.PlaneGeometry(w2, h2), toon(0x2b8a3e)); cross.add(m); }
  const desk = new THREE.Mesh(new THREE.BoxGeometry(4, 1.3, 1.6), toon(0xf4f4f4)); desk.position.set(0, .65, -1.5); doctorRoom.add(desk);
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), toon(0xffffff, {map: lSign([['SORTIE', 110, 140], ['DE L\'EURO', 90, 260], ['ordonnance', 50, 350, '#555']], '#f4ecd0', '#c40012', 600, 400)})); poster.position.set(3, 4.6, -3.95); doctorRoom.add(poster); }
const doctor = makeBlocky({shirt: 0xf8f8f8, pants: 0x3a4a6a, hair: 0x8a8a8a, mood: 'neutral'});
// plateau de débat
const studio = new THREE.Group(); scene.add(studio); studio.position.set(0, 0, 1000);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), toon(0x101a33)); fl.rotation.x = -Math.PI / 2; studio.add(fl); const w = new THREE.Mesh(new THREE.PlaneGeometry(40, 14), toon(0x1a2a55)); w.position.set(0, 7, -8); studio.add(w);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.2), toon(0xffffff, {map: lSign([['LE GRAND DÉBAT', 150, 180], ['en direct de la ville', 60, 300, '#9fb3ff']], '#0d1b4a')})); logo.position.set(0, 8.5, -7.95); studio.add(logo);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(14, 1.4, 2.4), toon(0xe8edf5)); desk.position.set(0, .7, -1); studio.add(desk);
  [['MARINE', -2.2], ['LE CHAT', 2.2]].forEach(([n, x]) => { const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.8, .45), toon(0xffffff, {map: lSign([[n, 150, 260]], '#0d1b4a')})); pl.position.set(x, .9, .21); studio.add(pl); });
  for (const x of [-12, -6, 6, 12]){ const l = new THREE.PointLight(0x7aa0ff, 25, 20); l.position.set(x, 6, 3); studio.add(l); } }
const stool = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, 1.6, 16), toon(0x333333)); scene.add(stool);
ALL.push(...fiches, phoneShop, turbineShop, turbine, phoneBox, meteo, doctorRoom, doctor, studio, stool);
