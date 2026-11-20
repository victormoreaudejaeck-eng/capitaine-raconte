
// ===================== "DANS CETTE VILLE, TOUT LE MONDE VOTE LISNARD" : assets =====================
const POSTER_L = canvasTex(512, 720, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#13b5c4'); g.addColorStop(1, '#0a7f9a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = '#fff'; c.fillRect(0, h - 130, w, 130); c.fillStyle = '#ffd23f'; c.fillRect(0, h - 150, w, 20); c.textAlign = 'center'; c.fillStyle = '#fff'; c.font = '900 96px Inter'; c.fillText('LISNARD', w / 2, 300); c.font = '900 150px Inter'; c.fillText('2027', w / 2, 470);
  c.fillStyle = '#0a7f9a'; c.font = '800 46px Inter'; c.fillText('TOUT VA BIEN', w / 2, h - 48); });
scene.traverse(o => { if (o.isMesh && o.material && (o.material.map === POSTER_M || o.material.map === POSTER)){ o.material = o.material.clone(); o.material.map = POSTER_L; } });
cars.forEach(c => { if (c.children[6]) c.children[6].visible = false; });
const lSign = (lines, bg, fg = '#fff', w = 1024, h = 400, font = 'Inter') => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = 'center';
  lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px ${font}, sans-serif`; const k = Math.min(1, (w - 70) / c.measureText(t).width); c.font = `900 ${sz * k}px ${font}, sans-serif`; c.fillText(t, w / 2, y); }); });
// riviera dressing: round trees -> palms, red carpet on sidewalks, gold lamps
town.children.forEach(o => { if (o.isGroup && Math.abs(Math.abs(o.position.x) - 11) < .5 && o.children.length >= 3 && o.children[0].geometry && o.children[0].geometry.type === 'CylinderGeometry') o.visible = false; });
const riv = new THREE.Group(); scene.add(riv);
function palm(x, z, h = 7){ const g = new THREE.Group(); g.position.set(x, 0, z); const bend = (Math.sin(x * 7 + z) * .5) * .25;
  for (let i = 0; i < 8; i++){ const s = new THREE.Mesh(new THREE.CylinderGeometry(.26 - i * .015, .3 - i * .015, h / 8 + .05, 10), toon(i % 2 ? 0x9a7650 : 0x8a6644)); s.position.set(Math.sin(i / 8 * 1.4) * bend * h, (i + .5) * h / 8, 0); s.castShadow = true; g.add(s); }
  const top = new THREE.Group(); top.position.set(Math.sin(1.4) * bend * h, h, 0); g.add(top);
  for (let i = 0; i < 8; i++){ const l = new THREE.Mesh(new THREE.BoxGeometry(3.4, .08, .7), toon(i % 2 ? 0x3e9a3a : 0x4bb04a)); l.geometry.translate(1.7, 0, 0); l.rotation.set(0, i / 8 * Math.PI * 2, -.45); l.castShadow = true; top.add(l); }
  for (let i = 0; i < 3; i++){ const n = new THREE.Mesh(new THREE.SphereGeometry(.22, 8, 6), toon(0x6a4a2a)); n.position.set(Math.cos(i * 2) * .25, -.2, Math.sin(i * 2) * .25); top.add(n); }
  riv.add(g); return g; }
for (let i = 0; i < 24; i++) palm((i % 2 ? 1 : -1) * 10.6, -100 + i * 9, 6.5 + (i % 3) * .8);
{ const carpetTex = canvasTex(64, 512, (c) => { c.fillStyle = '#c0102a'; c.fillRect(0, 0, 64, 512); c.fillStyle = '#e8b830'; c.fillRect(0, 0, 4, 512); c.fillRect(60, 0, 4, 512); for (let i = 0; i < 600; i++){ c.fillStyle = `rgba(0,0,0,${Math.random() * .08})`; c.fillRect(Math.random() * 64, Math.random() * 512, 1, 2); } });
  carpetTex.wrapT = THREE.RepeatWrapping; carpetTex.repeat.set(1, 40);
  for (const sx of [-1, 1]){ const cp = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 300), toon(0xffffff, {map: carpetTex, roughness: .95, polygonOffset: true, polygonOffsetFactor: -5, polygonOffsetUnits: -5})); cp.rotation.x = -Math.PI / 2; cp.position.set(sx * 7.6, .31, 0); cp.receiveShadow = true; riv.add(cp); }
  for (let i = 0; i < 14; i++){ const lp = new THREE.Group(); lp.position.set((i % 2 ? -1 : 1) * 5.6, 0, -70 + i * 11); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, 4.4, 10), toon(0xd4af37, {metalness: .6, roughness: .3})); pole.position.y = 2.2; lp.add(pole);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.32, 12, 10), toon(0xfff6d8, {emissive: 0xffe9a0, emissiveIntensity: .6})); bulb.position.y = 4.55; lp.add(bulb); riv.add(lp); } }
// giant propaganda screen
const SCR_OK = canvasTex(1280, 720, (c) => { const g = c.createLinearGradient(0, 0, 0, 720); g.addColorStop(0, '#16c0cf'); g.addColorStop(1, '#0a6f8c'); c.fillStyle = g; c.fillRect(0, 0, 1280, 720);
  c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(330, 360, 190, 0, 7); c.fill(); c.fillStyle = '#1b1a2e'; c.beginPath(); c.arc(265, 310, 22, 0, 7); c.arc(395, 310, 22, 0, 7); c.fill(); c.strokeStyle = '#1b1a2e'; c.lineWidth = 22; c.lineCap = 'round'; c.beginPath(); c.arc(330, 370, 105, .3, Math.PI - .3); c.stroke();
  c.fillStyle = '#fff'; c.textAlign = 'left'; c.font = '900 150px Inter'; c.fillText('TOUT', 580, 290); c.fillText('VA BIEN', 580, 450); c.font = '700 54px Inter'; c.fillText('Merci de sourire', 585, 560); });
const SCR_NONE = canvasTex(1280, 720, (c) => { c.fillStyle = '#0a6f8c'; c.fillRect(0, 0, 1280, 720); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '900 108px Inter'; c.fillText('AUCUN PROBLÈME', 640, 270); c.fillText('SIGNALÉ', 640, 400);
  c.fillStyle = '#ffd23f'; c.font = '800 66px Inter'; c.fillText('depuis 2 847 jours', 640, 540); });
const SCR_STAR = canvasTex(1280, 720, (c) => { c.fillStyle = '#c0102a'; c.fillRect(0, 0, 1280, 720); c.fillStyle = '#ffd23f'; c.textAlign = 'center'; c.font = '900 100px Inter'; c.fillText('VENEZ VOIR', 640, 250); c.fillStyle = '#fff'; c.font = '900 130px Inter'; c.fillText('LE RÂLEUR', 640, 410);
  c.font = '800 60px Inter'; c.fillText('tous les jours · 14 h', 640, 540); });
const bigScreen = new THREE.Group(); scene.add(bigScreen);
{ const frame = new THREE.Mesh(new THREE.BoxGeometry(10.6, 6.2, .5), toon(0x1a1a1a)); frame.position.y = 9; bigScreen.add(frame);
  const scrM = new THREE.MeshBasicMaterial({map: SCR_OK}); const scr = new THREE.Mesh(new THREE.PlaneGeometry(10, 5.6), scrM); scr.position.set(0, 9, .26); bigScreen.add(scr); bigScreen.userData.scrM = scrM;
  for (const sx of [-1, 1]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.5, 6.5, .5), toon(0x2a2a2a)); p.position.set(sx * 3.5, 3.1, 0); bigScreen.add(p); } }
function screenTex(t){ bigScreen.userData.scrM.map = t; bigScreen.userData.scrM.needsUpdate = true; }
// pothole + repair drone
const pothole = new THREE.Mesh(new THREE.CircleGeometry(1, 24), new THREE.MeshStandardMaterial({color: 0x1a1a1e, roughness: 1, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8})); pothole.rotation.x = -Math.PI / 2; pothole.position.y = .1; scene.add(pothole);
const patch = new THREE.Mesh(new THREE.CircleGeometry(1.05, 24), new THREE.MeshStandardMaterial({color: 0x56595f, roughness: .7, polygonOffset: true, polygonOffsetFactor: -9, polygonOffsetUnits: -9})); patch.rotation.x = -Math.PI / 2; patch.position.y = .11; scene.add(patch);
const drone = new THREE.Group(); scene.add(drone);
{ const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, .35, 1.0), toon(0xffffff, {roughness: .3})); drone.add(body); const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.02, .1, 1.02), toon(0x13b5c4)); stripe.position.y = .05; drone.add(stripe);
  drone.userData.rotors = []; for (const [x, z] of [[-.9, -.9], [.9, -.9], [-.9, .9], [.9, .9]]){ const arm = new THREE.Mesh(new THREE.BoxGeometry(.12, .08, 1.3), toon(0x2a2a2a)); arm.position.set(x / 2, 0, z / 2); arm.rotation.y = Math.atan2(x, z); drone.add(arm);
    const r = new THREE.Mesh(new THREE.BoxGeometry(1.0, .03, .12), toon(0x111111)); r.position.set(x, .22, z); drone.add(r); drone.userData.rotors.push(r); }
  const noz = new THREE.Mesh(new THREE.CylinderGeometry(.1, .18, .5, 10), toon(0x333333)); noz.position.y = -.4; drone.add(noz);
  const tar = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.4, 12, 1, true), new THREE.MeshBasicMaterial({color: 0x3a3a40, transparent: true, opacity: .55})); tar.position.y = -1.3; tar.rotation.x = Math.PI; drone.add(tar); drone.userData.tar = tar; }
function droneFly(t){ drone.userData.rotors.forEach((r, i) => r.rotation.y = t * 40 + i); }
// town hall with instant counters + the closed complaints desk
const mairie = new THREE.Group(); scene.add(mairie); mairie.position.set(0, 0, -58);
{ const b = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 8), toon(0xfbf6ec)); b.position.y = 4.5; b.castShadow = true; mairie.add(b);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(18.6, .6, 8.6), toon(0xd4af37, {metalness: .4})); roof.position.y = 9.2; mairie.add(roof);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.5), toon(0xffffff, {map: lSign([['MAIRIE', 150, 260]], '#0a7f9a', '#fff', 1024, 340)})); sign.position.set(0, 7.6, 4.02); mairie.add(sign);
  const desks = [['MARIAGE', '30 secondes'], ['PERMIS', '12 secondes'], ['TOUT LE RESTE', 'instantané'], ['RÉCLAMATIONS', 'service supprimé (inutile)']];
  mairie.userData.desks = [];
  desks.forEach(([a, b2], i) => { const x = -6.6 + i * 4.4; const closed = i === 3;
    const win = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.6, .2), toon(closed ? 0x8a6a4a : 0x9fd8ff, closed ? {} : {roughness: .05, transparent: true, opacity: .6})); win.position.set(x, 2.6, 4.05); mairie.add(win);
    if (closed){ for (const r of [-.5, .5]){ const plank = new THREE.Mesh(new THREE.BoxGeometry(3.8, .35, .1), toon(0x6a4a2a)); plank.position.set(x, 2.6 + r, 4.2); plank.rotation.z = r * .5; mairie.add(plank); } }
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.1), toon(0xffffff, {map: lSign([[a, 110, 160], [b2, 64, 290]], closed ? '#555' : '#13b5c4', '#fff', 1024, 340)})); lab.position.set(x, 4.6, 4.06); mairie.add(lab); mairie.userData.desks.push(x);
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(3.6, .2, .8), toon(0xd8d0c0)); ledge.position.set(x, 1.3, 4.4); mairie.add(ledge); }); }
// museum vitrine with the last paper form
const museum = new THREE.Group(); scene.add(museum);
{ const ped = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 2.2), toon(0x2a2a30)); ped.position.y = 1.3; museum.add(ped);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 2.0), new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: .18, roughness: .02})); glass.position.y = 3.5; museum.add(glass);
  const formT = canvasTex(600, 820, (c) => { c.fillStyle = '#fbfbf6'; c.fillRect(0, 0, 600, 820); c.fillStyle = '#1d3b8a'; c.fillRect(0, 0, 600, 90); c.fillStyle = '#fff'; c.font = '900 44px Inter'; c.fillText('cerfa', 30, 60); c.font = '700 26px Inter'; c.fillText('N° 12345*03', 380, 58);
    c.fillStyle = '#222'; c.font = '800 34px Inter'; c.fillText('FORMULAIRE DE DEMANDE', 40, 160); c.fillText('DE FORMULAIRE', 40, 205); c.strokeStyle = '#999'; c.lineWidth = 3; for (let y = 260; y < 780; y += 46){ c.strokeRect(40, y, 520, 32); } });
  const form = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.5), toon(0xffffff, {map: formT})); form.position.set(0, 3.45, 0); form.rotation.x = -.15; museum.add(form);
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.9, .7), toon(0xffffff, {map: lSign([['LE DERNIER FORMULAIRE', 90, 150], ['de la ville · 2019', 60, 260]], '#1a1a1a', '#d4af37', 1024, 340)})); pl.position.set(0, 1.9, 1.11); museum.add(pl);
  const rope = new THREE.Mesh(new THREE.TorusGeometry(2.6, .05, 6, 40, Math.PI), toon(0xc0102a)); rope.rotation.x = Math.PI / 2; rope.position.set(0, 1.0, .4); museum.add(rope);
  const spot2 = new THREE.SpotLight(0xfff0d0, 60, 14, .45, .5, 1.5); spot2.position.set(0, 9, 3); spot2.target.position.set(0, 3, 0); museum.add(spot2, spot2.target); }
// bicycle (rear tyre goes flat)
const bike = new THREE.Group(); scene.add(bike);
{ const fm = toon(0x13b5c4, {metalness: .3, roughness: .35}); bike.userData.wheels = [];
  for (const z of [-1, 1]){ const w = new THREE.Mesh(new THREE.TorusGeometry(.62, .09, 8, 28), toon(0x111111)); w.position.set(0, .7, z); w.rotation.y = Math.PI / 2; bike.add(w); bike.userData.wheels.push(w);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .2, 8), toon(0xcccccc)); hub.rotation.z = Math.PI / 2; hub.position.set(0, .7, z); bike.add(hub); }
  const bar = (a, b) => { const d = b.clone().sub(a); const m = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, d.length(), 8), fm); m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); bike.add(m); };
  bar(V(0, .7, -1), V(0, 1.5, -.1)); bar(V(0, 1.5, -.1), V(0, 1.5, .8)); bar(V(0, .7, 1), V(0, 1.5, .8)); bar(V(0, .7, -1), V(0, .75, .1)); bar(V(0, .75, .1), V(0, 1.5, -.1)); bar(V(0, 1.5, .8), V(0, 1.95, .9));
  const hb = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1.0, 8), toon(0x222222)); hb.rotation.z = Math.PI / 2; hb.position.set(0, 1.95, .9); bike.add(hb);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(.3, .1, .55), toon(0x3a2a1a)); seat.position.set(0, 1.62, -.2); bike.add(seat); }
function flat(k){ const w = bike.userData.wheels[0]; w.scale.set(1, 1 - .3 * k, 1); w.position.y = .7 - .18 * k; }
// TV crew
const tvCam = new THREE.Group(); scene.add(tvCam);
{ const body = new THREE.Mesh(new THREE.BoxGeometry(.6, .7, 1.4), toon(0x2a2a2a)); body.position.y = 2.6; tvCam.add(body); const lens = new THREE.Mesh(new THREE.CylinderGeometry(.25, .3, .5, 16), toon(0x111111)); lens.rotation.x = Math.PI / 2; lens.position.set(0, 2.6, .9); tvCam.add(lens);
  const red = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), new THREE.MeshBasicMaterial({color: 0xff0010})); red.position.set(.2, 3.0, .6); tvCam.add(red);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(.9, .4), toon(0xffffff, {map: lSign([['RIVIERA TV', 140, 250]], '#c0102a', '#fff', 1024, 400)})); logo.position.set(.31, 2.6, 0); logo.rotation.y = Math.PI / 2; tvCam.add(logo);
  for (let i = 0; i < 3; i++){ const a = i / 3 * Math.PI * 2; const leg = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 2.5), toon(0x333333)); leg.position.set(Math.cos(a) * .4, 1.15, Math.sin(a) * .4); leg.rotation.set(Math.sin(a) * .3, 0, -Math.cos(a) * .3); tvCam.add(leg); } }
const mic = new THREE.Group(); scene.add(mic); { const h = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .6), toon(0x222222)); mic.add(h); const ball = new THREE.Mesh(new THREE.SphereGeometry(.13, 10, 8), toon(0x444444)); ball.position.y = .35; mic.add(ball);
  const cube = new THREE.Mesh(new THREE.BoxGeometry(.2, .14, .2), toon(0xc0102a)); cube.position.y = .14; mic.add(cube); }
// queue barriers + sign
const queue = new THREE.Group(); scene.add(queue);
{ for (let i = 0; i < 6; i++){ const p = new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, 1.1, 10), toon(0xd4af37, {metalness: .6})); p.position.set(i % 2 ? 1.3 : -1.3, .55, i * 2.4); queue.add(p); }
  for (const sx of [-1.3, 1.3]){ const r = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 12), toon(0xc0102a)); r.rotation.x = Math.PI / 2; r.position.set(sx, 1.0, 6); queue.add(r); }
  const s = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), toon(0xffffff, {map: lSign([['LE RÂLEUR →', 120, 180], ['attente : 2 h', 80, 320]], '#c0102a', '#fff', 1024, 420)})); s.position.set(-2.2, 2.4, -.5); queue.add(s);
  const sp = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1.9), toon(0x333333)); sp.position.set(-2.2, .9, -.5); queue.add(sp); }
// medal + official plaque
const medal = new THREE.Group(); scene.add(medal); { const d = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .07, 24), toon(0xe8b830, {metalness: .7, roughness: .25, emissive: 0x3a2800})); d.rotation.x = Math.PI / 2; medal.add(d);
  const rb = new THREE.Mesh(new THREE.BoxGeometry(.3, .7, .03), toon(0x13b5c4)); rb.position.y = .45; medal.add(rb); }
const plaque = new THREE.Group(); scene.add(plaque); { const p = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.3, .2), toon(0xd4af37, {metalness: .5, roughness: .3})); p.position.y = 1.6; plaque.add(p);
  const t = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), toon(0xffffff, {map: lSign([['LE DERNIER RÂLEUR', 96, 150], ['attraction officielle', 64, 260], ['ne pas nourrir', 50, 350]], '#1a1a1a', '#e8b830', 1024, 420)})); t.position.set(0, 1.6, .11); plaque.add(t);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 1.0), toon(0x333333)); post.position.y = .5; plaque.add(post); }
// riviera citizens: stripes, linen, sunglasses, sun hats; tourists with cameras
const stripeTex = (col) => canvasTex(64, 64, (c) => { for (let i = 0; i < 8; i++){ c.fillStyle = i % 2 ? col : '#ffffff'; c.fillRect(0, i * 8, 64, 8); } });
const rivFolk = []; for (let i = 0; i < 10; i++){ const p = makeBlocky({shirt: [0xffffff, 0xf4efe2, 0xe8f6f8, 0xffe9d6][i % 4], pants: [0xf4efe2, 0x1f3d7a, 0xd8ccb4][i % 3], hair: [0x2a1d14, 0xb88a50, 0x6a4a2a, 0x1a1410][i % 4], mood: 'happy'});
  if (i % 3 === 0){ p.children.forEach(m => { if (m.isMesh && m.geometry.parameters && m.geometry.parameters.width === 1.45) m.material = toon(0xffffff, {map: stripeTex('#1f3d7a')}); }); }
  const gl = new THREE.Mesh(new THREE.BoxGeometry(.95, .26, .05), toon(0x111111, {roughness: .15})); gl.position.set(0, 3.45, .6); p.add(gl); p.userData.glasses = gl;
  if (i % 2 === 1){ const hat = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, .08, 20), toon(0xf2e2b0)); hat.position.y = 4.05; p.add(hat); const crown = new THREE.Mesh(new THREE.CylinderGeometry(.62, .66, .45, 16), toon(0xf2e2b0)); crown.position.y = 4.3; p.add(crown); }
  if (i % 4 === 2){ const cam2 = new THREE.Mesh(new THREE.BoxGeometry(.5, .35, .25), toon(0x222222)); cam2.position.set(0, 2.5, .5); p.add(cam2); }
  rivFolk.push(p); }
// pigeons in sunglasses
const pigeons = []; for (let i = 0; i < 4; i++){ const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(.3, 12, 10), toon(0x9aa0aa)); b.scale.set(1, .85, 1.3); g.add(b);
  const h = new THREE.Mesh(new THREE.SphereGeometry(.17, 10, 8), toon(0x7a8090)); h.position.set(0, .27, .3); g.add(h); const bk = new THREE.Mesh(new THREE.ConeGeometry(.05, .14, 6), toon(0xe8a030)); bk.rotation.x = Math.PI / 2; bk.position.set(0, .25, .5); g.add(bk);
  const gl = new THREE.Mesh(new THREE.BoxGeometry(.3, .08, .04), toon(0x111111, {roughness: .1})); gl.position.set(0, .31, .45); g.add(gl); const neck = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 6), toon(0x5a8a7a)); neck.position.set(0, .15, .22); g.add(neck);
  scene.add(g); pigeons.push(g); }
ALL.push(riv, bigScreen, pothole, patch, drone, mairie, museum, bike, tvCam, mic, queue, medal, plaque, ...rivFolk, ...pigeons);
function lLook(){ townLook(); sunLight.color.set(0xffe8c8); renderer.toneMappingExposure = 1.0; }
