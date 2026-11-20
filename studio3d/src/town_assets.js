
// ===================== "DANS CETTE VILLE" : bright toy-town assets (original characters) =====================
const toon = (c, o = {}) => new THREE.MeshStandardMaterial({color: c, roughness: .55, ...o});
const town = new THREE.Group(); scene.add(town);
const NAVY = 0x1c2d5a;
const posterTex = (l1, l2, bg = '#1c2d5a') => canvasTex(512, 720, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h);
  c.fillStyle = '#ffffff'; c.fillRect(0, h - 130, w, 130); c.fillStyle = '#e1000f'; c.fillRect(0, h - 150, w, 20);
  c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.font = '900 92px Inter, sans-serif'; c.fillText(l1, w / 2, 300); c.font = '900 150px Inter, sans-serif'; c.fillText(l2, w / 2, 470);
  c.fillStyle = bg; c.font = '800 54px Inter, sans-serif'; c.fillText('VOTEZ !', w / 2, h - 45); });
const POSTER = posterTex('BARDELLA', '2027');
const POSTER_M = posterTex('MÉLENCHON', '2027', '#c2273d');
function poster(w = 1.2, h = 1.7, tex = POSTER){ const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), toon(0xffffff, {map: tex, roughness: .6})); return m; }
const winTex = (base, win) => { const t = canvasTex(256, 512, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); for (let y = 30; y < h - 20; y += 64) for (let x = 24; x < w - 20; x += 72){ c.fillStyle = win; c.fillRect(x, y, 44, 40); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x, y, 14, 40); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
const WT = [winTex('#f4b6c2', '#7fb8e6'), winTex('#fdd9a0', '#7fb8e6'), winTex('#b9e3c6', '#6aa6d6'), winTex('#c9d8f5', '#5c95d0'), winTex('#f7f2e7', '#7fb8e6')];
const clouds = new THREE.Group(); scene.add(clouds);
{ const r = rng(77); const cm = toon(0xffffff, {roughness: .9}); for (let i = 0; i < 22; i++){ const g = new THREE.Group(); for (let k = 0; k < 6; k++){ const s = new THREE.Mesh(new THREE.SphereGeometry(6 + r() * 6, 14, 10), cm); s.position.set(k * 6 - 15 + r() * 4, r() * 4, r() * 6); g.add(s); }
  g.position.set(r() * 500 - 250, 80 + r() * 50, r() * 500 - 250); g.scale.y = .6; clouds.add(g); } }
// ground, roads, sidewalks
{ const grass = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), toon(0x7ccf5a)); grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true; town.add(grass);
  const dash = canvasTex(64, 256, (c) => { c.fillStyle = '#3c3f46'; c.fillRect(0, 0, 64, 256); c.fillStyle = '#ffd400'; c.fillRect(28, 20, 8, 110); }); dash.wrapS = dash.wrapT = THREE.RepeatWrapping; dash.repeat.set(1, 40);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(10, 300), toon(0xffffff, {map: dash})); road.rotation.x = -Math.PI / 2; road.position.y = .02; road.receiveShadow = true; town.add(road);
  const road2 = road.clone(); road2.rotation.z = Math.PI / 2; road2.position.set(0, .021, -40); town.add(road2);
  for (const sx of [-1, 1]){ const sw = new THREE.Mesh(new THREE.BoxGeometry(5, .3, 300), toon(0xd8d4cc)); sw.position.set(sx * 7.5, .15, 0); sw.receiveShadow = true; town.add(sw); } }
// buildings + houses with posters
const houses = [];
function house(x, z, col, withPoster = true, rot = 0){ const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot;
  const body = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 7), toon(col)); body.position.y = 2.5; body.castShadow = body.receiveShadow = true; g.add(body);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(5.6, 3, 4), toon(0xc0483a)); roof.rotation.y = Math.PI / 4; roof.position.y = 6.5; roof.castShadow = true; g.add(roof);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, .2), toon(0x8a5a3a)); door.position.set(0, 1.2, 3.55); g.add(door);
  for (const sx of [-1, 1]){ const w = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, .2), toon(0x8fd0ff, {roughness: .1})); w.position.set(sx * 2.2, 3, 3.55); g.add(w); }
  if (withPoster){ const p = poster(1.6, 2.2); p.position.set(-2.2, 1.6, 3.67); g.add(p); }
  town.add(g); houses.push(g); return g; }
{ const r = rng(5); const cols = [0xfff1d6, 0xd7f0ff, 0xffe0e6, 0xe4ffd9, 0xfff9c4];
  for (let i = 0; i < 8; i++){ house(-20, -30 + i * 14, cols[i % 5], true, Math.PI / 2); if (i !== 3) house(20, -30 + i * 14, cols[(i + 2) % 5], true, -Math.PI / 2); }
  for (let i = 0; i < 16; i++){ const h = 18 + r() * 40, w = 12 + r() * 8; const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 12), toon(0xffffff, {map: WT[i % 5]})); b.material.map = WT[i % 5].clone(); b.material.map.needsUpdate = true; b.material.map.repeat.set(w / 12, h / 20);
    b.position.set((i % 2 ? 1 : -1) * (40 + r() * 30), h / 2, -90 + Math.floor(i / 2) * 26); b.castShadow = true; town.add(b);
    const bp = poster(6, 8.5); bp.position.set(b.position.x - (i % 2 ? w / 2 + .05 : -w / 2 - .05), 9, b.position.z); bp.rotation.y = i % 2 ? -Math.PI / 2 : Math.PI / 2; town.add(bp); } }
const myHouse = house(20, 12, 0xffd0a0, false, -Math.PI / 2);
// trees, lamps, flags
{ const r = rng(9); for (let i = 0; i < 24; i++){ const t = new THREE.Group(); const tr = new THREE.Mesh(new THREE.CylinderGeometry(.3, .4, 2.6), toon(0x8a5a3a)); tr.position.y = 1.3; t.add(tr);
  for (let k = 0; k < 3; k++){ const s = new THREE.Mesh(new THREE.SphereGeometry(1.6 - k * .2, 12, 10), toon(0x3faa4a)); s.position.set((r() - .5) * 1.2, 3.2 + k * .9, (r() - .5) * 1.2); s.castShadow = true; t.add(s); }
  t.position.set((i % 2 ? 1 : -1) * 11, 0, -100 + i * 9); town.add(t); }
  for (let i = 0; i < 12; i++){ const pole = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 5), toon(0xeeeeee)); pole.position.set((i % 2 ? -1 : 1) * 9.5, 2.5, -60 + i * 12); town.add(pole);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), toon(0xffffff, {map: canvasTex(96, 64, (c) => { c.fillStyle = '#0055a4'; c.fillRect(0, 0, 32, 64); c.fillStyle = '#fff'; c.fillRect(32, 0, 32, 64); c.fillStyle = '#ef4135'; c.fillRect(64, 0, 32, 64); }), side: THREE.DoubleSide}));
    fl.position.set(pole.position.x + .9, 4.4, pole.position.z); town.add(fl); } }
// cars
const cars = []; function car(col){ const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1, 4.4), toon(col, {roughness: .3, metalness: .2})); b.position.y = .9; b.castShadow = true; g.add(b);
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.9, .8, 2.2), toon(0x9fd8ff, {roughness: .1})); top.position.set(0, 1.75, -.2); g.add(top);
  for (const [x, z] of [[-1.1, 1.4], [1.1, 1.4], [-1.1, -1.4], [1.1, -1.4]]){ const w = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .3, 14), toon(0x222222)); w.rotation.z = Math.PI / 2; w.position.set(x, .42, z); g.add(w); }
  const st = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .45), toon(0xffffff, {map: canvasTex(256, 80, (c) => { c.fillStyle = '#1c2d5a'; c.fillRect(0, 0, 256, 80); c.fillStyle = '#fff'; c.font = '900 52px Inter'; c.textAlign = 'center'; c.fillText('BARDELLA', 128, 58); })}));
  st.position.set(0, .95, -2.21); st.rotation.y = Math.PI; g.add(st); scene.add(g); cars.push(g); return g; }
[NAVY, 0x2a4a9a, 0x1c2d5a, 0x3a5aa0].forEach(c => car(c));
// bakery
const bakery = new THREE.Group(); scene.add(bakery);
{ const b = new THREE.Mesh(new THREE.BoxGeometry(12, 7, 8), toon(0xfff3dc)); b.position.y = 3.5; b.castShadow = true; bakery.add(b);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.6), toon(0xffffff, {map: canvasTex(512, 96, (c) => { c.fillStyle = '#8a3b2a'; c.fillRect(0, 0, 512, 96); c.fillStyle = '#fff4d6'; c.font = '800 64px serif'; c.textAlign = 'center'; c.fillText('BOULANGERIE', 256, 72); })}));
  sign.position.set(0, 6, 4.02); bakery.add(sign);
  const awn = new THREE.Mesh(new THREE.BoxGeometry(11, .2, 2.4), toon(0x1c2d5a)); awn.position.set(0, 4.6, 5); awn.rotation.x = .25; bakery.add(awn);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.2), toon(0xbfe6ff, {roughness: .05, transparent: true, opacity: .35})); glass.position.set(0, 2.2, 4.03); bakery.add(glass);
  const counter = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 1.4), toon(0x8a5a3a)); counter.position.set(0, .6, 2.6); bakery.add(counter);
  const navyBread = toon(NAVY, {roughness: .5}); bakery.userData.breads = [];
  for (let i = 0; i < 9; i++){ const br = new THREE.Mesh(new THREE.CapsuleGeometry(.14, 1.2, 4, 10), navyBread); br.rotation.z = Math.PI / 2; br.position.set(-3.2 + i * .8, 1.32, 2.6); bakery.add(br); bakery.userData.breads.push(br); }
  const pb = poster(1.4, 2); pb.position.set(4.6, 2.4, 4.04); bakery.add(pb); }
const bigBread = new THREE.Mesh(new THREE.CapsuleGeometry(.2, 1.6, 6, 14), toon(NAVY, {roughness: .45})); scene.add(bigBread);
// classroom
const classroom = new THREE.Group(); scene.add(classroom);
{ const room = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 12), toon(0xfdf6e3, {side: THREE.BackSide})); room.position.y = 3; room.receiveShadow = true; classroom.add(room);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), toon(0xc8935a)); floor.rotation.x = -Math.PI / 2; floor.position.y = .01; floor.receiveShadow = true; classroom.add(floor);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(7, 3), toon(0xffffff, {map: canvasTex(700, 300, (c) => { c.fillStyle = '#2e5a3a'; c.fillRect(0, 0, 700, 300); c.fillStyle = '#f4f4ea'; c.font = '700 44px Inter'; c.textAlign = 'center'; c.fillText('LEÇON 1 :', 350, 90); c.fillText('LA RAIE SUR LE CÔTÉ', 350, 160); c.font = '40px Inter'; c.fillText('(la lecture, ce sera en CE2)', 350, 240); })}));
  board.position.set(0, 3.4, -5.95); classroom.add(board);
  for (let i = 0; i < 6; i++){ const d = new THREE.Mesh(new THREE.BoxGeometry(1.6, .9, 1), toon(0x9fc8e8)); d.position.set(-3.6 + (i % 3) * 3.6, .45, -1 + Math.floor(i / 3) * 3); d.castShadow = true; classroom.add(d); } }
// voting booth + ballot box
const booth = new THREE.Group(); scene.add(booth);
{ const room = new THREE.Mesh(new THREE.BoxGeometry(16, 6, 14), toon(0xeef1f6, {side: THREE.BackSide})); room.position.y = 3; booth.add(room);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(16, 14), toon(0xb8bec8)); fl.rotation.x = -Math.PI / 2; fl.position.y = .01; fl.receiveShadow = true; booth.add(fl);
  for (let i = 0; i < 3; i++){ const cab = new THREE.Group(); const frame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 1.4), toon(0x8a96a8, {transparent: true, opacity: .25})); frame.position.y = 1.6; cab.add(frame);
    const curtain = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.6), toon(0x2a3a6a, {side: THREE.DoubleSide})); curtain.position.set(0, 1.9, .71); cab.add(curtain); cab.position.set(-4 + i * 2.2, 0, -4); booth.add(cab); }
  const urne = new THREE.Mesh(new THREE.BoxGeometry(1, 1.1, .8), toon(0xd8f0ff, {transparent: true, opacity: .45, roughness: .05})); urne.position.set(3, 1.45, -1); booth.add(urne);
  const table = new THREE.Mesh(new THREE.BoxGeometry(2, .9, 1.2), toon(0x8a5a3a)); table.position.set(3, .45, -1); booth.add(table);
  const ballots = []; for (let i = 0; i < 2; i++){ const b = new THREE.Mesh(new THREE.PlaneGeometry(.5, .35), toon(0xffffff, {map: canvasTex(200, 140, (c) => { c.fillStyle = '#fff'; c.fillRect(0, 0, 200, 140); c.fillStyle = '#111'; c.font = '700 24px Inter'; c.textAlign = 'center'; c.fillText(i ? 'BULLETIN B' : 'BULLETIN A', 100, 80); }), side: THREE.DoubleSide})); booth.add(b); ballots.push(b); } booth.userData = {ballots}; }
const binoc = new THREE.Group(); { for (const sx of [-1, 1]){ const t = new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, .18, 10), toon(0x222222)); t.rotation.x = Math.PI / 2; t.position.x = sx * .06; binoc.add(t); } } scene.add(binoc);

// ---- original blocky characters (painted box faces) ----
const BFACE = {};
function bFace(mood, skin = '#f1c7a1', brow = '#3a2a1a'){ const k = mood + skin + brow; if (BFACE[k]) return BFACE[k];
  return BFACE[k] = canvasTex(256, 256, (c) => { c.fillStyle = skin; c.fillRect(0, 0, 256, 256);
    const big = mood === 'shock' || mood === 'scared'; for (const ex of [86, 170]){ c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, 120, big ? 26 : 20, big ? 30 : 23, 0, 0, 7); c.fill(); c.lineWidth = 6; c.strokeStyle = '#1b1a2e'; c.stroke();
      c.fillStyle = '#1b1a2e'; c.beginPath(); c.arc(ex + (mood === 'side' ? 9 : 0), 124, big ? 9 : 10, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + 4 + (mood === 'side' ? 9 : 0), 117, 4, 0, 7); c.fill(); }
    c.strokeStyle = brow; c.lineWidth = 11; c.lineCap = 'round'; const t = mood === 'angry' || mood === 'side' ? 12 : mood === 'scared' ? -10 : 0;
    c.beginPath(); c.moveTo(58, 78 - t); c.lineTo(112, 78 + t); c.moveTo(144, 78 + t); c.lineTo(198, 78 - t); c.stroke();
    c.fillStyle = '#5a1e24'; c.strokeStyle = '#1b1a2e'; c.lineWidth = 6;
    if (mood === 'happy' || mood === 'smug'){ c.beginPath(); c.arc(128, 172, mood === 'smug' ? 26 : 34, .2, Math.PI - .2); c.stroke(); }
    else if (big){ c.beginPath(); c.ellipse(128, 190, 18, 22, 0, 0, 7); c.fill(); c.stroke(); }
    else if (mood === 'angry'){ c.beginPath(); c.moveTo(96, 196); c.quadraticCurveTo(128, 176, 160, 196); c.stroke(); }
    else { c.beginPath(); c.moveTo(104, 188); c.lineTo(152, 188); c.stroke(); } }); }
function makeBlocky(o = {}){
  const g = new THREE.Group(); const shirt = toon(o.shirt ?? 0xff8a3d), pants = toon(o.pants ?? 0x3a4a6a), skin = toon(0xf1c7a1);
  const headMats = [skin, skin, toon(o.hair ?? 0x5a3a1a), skin, new THREE.MeshStandardMaterial({map: bFace(o.mood ?? 'neutral'), roughness: .6}), skin];
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 1.15), headMats); head.position.y = 3.35; head.castShadow = true; g.add(head);
  const hair = new THREE.Mesh(new THREE.BoxGeometry(1.25, .32, 1.25), toon(o.hair ?? 0x5a3a1a)); hair.position.y = 4.02; g.add(hair);
  if (o.slick){ const side = new THREE.Mesh(new THREE.BoxGeometry(1.27, .5, .45), toon(o.hair ?? 0x2a1d14)); side.position.set(0, 3.82, -.42); g.add(side); const part = new THREE.Mesh(new THREE.BoxGeometry(.06, .04, 1.2), toon(0xf1c7a1)); part.position.set(-.25, 4.19, 0); g.add(part); }
  if (o.messy){ for (let i = 0; i < 5; i++){ const tuft = new THREE.Mesh(new THREE.BoxGeometry(.3, .3, .3), toon(o.hair ?? 0x5a3a1a)); tuft.position.set(-.4 + i * .2, 4.25 + (i % 2) * .1, -.2 + (i % 3) * .2); tuft.rotation.set(i, i * .5, 0); g.add(tuft); } }
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.6, .8), shirt); body.position.y = 2.0; body.castShadow = true; g.add(body);
  if (o.suit){ const shirtW = new THREE.Mesh(new THREE.BoxGeometry(.5, 1.3, .05), toon(0xffffff)); shirtW.position.set(0, 2.15, .41); g.add(shirtW); const tie = new THREE.Mesh(new THREE.BoxGeometry(.16, 1.0, .06), toon(o.tie ?? 0x1c2d5a)); tie.position.set(0, 2.15, .44); g.add(tie); }
  if (o.hood){ const pocketH = new THREE.Mesh(new THREE.BoxGeometry(.9, .35, .05), toon(o.shirt ?? 0xff8a3d)); pocketH.position.set(0, 1.55, .42); g.add(pocketH); }
  const mk = (w, h, d, m, x, y) => { const a = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); a.geometry.translate(0, -h / 2 + .1, 0); a.position.set(x, y, 0); a.castShadow = true; g.add(a); return a; };
  const armL = mk(.5, 1.55, .55, shirt, -.98, 2.75), armR = mk(.5, 1.55, .55, shirt, .98, 2.75);
  const legL = mk(.66, 1.3, .7, pants, -.36, 1.25), legR = mk(.66, 1.3, .7, pants, .36, 1.25);
  g.userData = {head, headMats, armL, armR, legL, legR}; scene.add(g); return g; }
function bMood(p, m){ p.userData.headMats[4].map = bFace(m); p.userData.headMats[4].needsUpdate = true; }
function bRest(p){ const u = p.userData; for (const k of ['armL', 'armR', 'legL', 'legR']) u[k].rotation.set(0, 0, 0); p.rotation.set(0, 0, 0); u.head.rotation.set(0, 0, 0); }
function bWalk(p, t, s = 1){ const u = p.userData; const a = Math.sin(t * 7 * s) * .6; u.legL.rotation.x = a; u.legR.rotation.x = -a; u.armL.rotation.x = -a; u.armR.rotation.x = a; }
const me = makeBlocky({shirt: 0xff8a3d, pants: 0x3a5a8a, hair: 0x6a3a1a, messy: true, hood: true});
const citizens = []; { const hairs = [0x2a1d14, 0x3a2614, 0x1a1410, 0x4a3020]; for (let i = 0; i < 14; i++) citizens.push(makeBlocky({shirt: NAVY, pants: NAVY, hair: hairs[i % 4], slick: true, suit: true, mood: 'smug'})); }
const dog = new THREE.Group(); { const b = new THREE.Mesh(new THREE.BoxGeometry(.7, .6, 1.4), toon(0xd9a066)); b.position.y = .7; dog.add(b); const suit = new THREE.Mesh(new THREE.BoxGeometry(.74, .5, 1.0), toon(NAVY)); suit.position.set(0, .78, .05); dog.add(suit);
  const tie = new THREE.Mesh(new THREE.BoxGeometry(.12, .35, .05), toon(0xe1000f)); tie.position.set(0, .6, .72); dog.add(tie);
  const h = new THREE.Mesh(new THREE.BoxGeometry(.6, .6, .6), [toon(0xd9a066), toon(0xd9a066), toon(0xd9a066), toon(0xd9a066), new THREE.MeshStandardMaterial({map: bFace('smug', '#d9a066', '#6a4a2a')}), toon(0xd9a066)]); h.position.set(0, 1.15, .85); dog.add(h);
  for (const sx of [-1, 1]){ const ear = new THREE.Mesh(new THREE.BoxGeometry(.15, .3, .1), toon(0x8a5a3a)); ear.position.set(sx * .25, 1.55, .85); dog.add(ear); }
  for (const [x, z] of [[-.25, .5], [.25, .5], [-.25, -.5], [.25, -.5]]){ const l = new THREE.Mesh(new THREE.BoxGeometry(.18, .45, .18), toon(0xd9a066)); l.position.set(x, .22, z); dog.add(l); } } scene.add(dog);
ALL.push(town, clouds, ...cars, bakery, bigBread, classroom, booth, binoc, me, ...citizens, dog);
function townLook(){ look('day'); setSky('toy', 40, 210, 2, .9, .003); renderer.toneMappingExposure = .62; sunLight.intensity = 2.6; hemi.intensity = 1.0; hemi.color.set(0xdff2ff); hemi.groundColor.set(0x7ccf5a); scene.fog = new THREE.Fog(0xcfe8ff, 120, 700); }
