
// ===================== "DANS CETTE VILLE, LES PARISIENS SONT INTERDITS" : assets =====================
// remove the previous episode's campaign posters & stickers from the shared town
scene.traverse(o => { if (o.isMesh && o.material && o.material.map === POSTER) o.visible = false; });
cars.forEach(c => { if (c.children[6]) c.children[6].visible = false; });
const KEEP_HIDDEN = []; scene.traverse(o => { if (o.isMesh && o.material && o.material.map === POSTER) KEEP_HIDDEN.push(o); });
const signTex = (lines, bg = '#1f6f3f', fg = '#ffffff', w = 1024, h = 512) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.strokeStyle = fg; c.lineWidth = 14; c.strokeRect(18, 18, w - 36, h - 36);
  c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// ---- border checkpoint (town entrance at z = 70) ----
const border = new THREE.Group(); scene.add(border); border.position.set(0, 0, 70);
{ const gantry = new THREE.Group(); border.add(gantry);
  for (const sx of [-1, 1]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.6, 8, .6), toon(0x9aa3ad, {metalness: .4})); p.position.set(sx * 6.5, 4, 0); p.castShadow = true; gantry.add(p); }
  const board = new THREE.Mesh(new THREE.BoxGeometry(8.4, 6.4, .3), toon(0xffffff, {map: signTex([['VILLE', 120, 180], ['SANS PARISIENS', 120, 320], ['Merci de ralentir… dans la vie', 58, 460], ['🚫 trottinettes  🚫 « en vrai »', 58, 560]], '#1f6f3f', '#ffffff', 1024, 780)}));
  board.position.set(0, 9.6, 0); board.castShadow = true; gantry.add(board);
  const booth = new THREE.Group(); booth.position.set(-6.5, 0, -3); border.add(booth);
  const bb = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), toon(0xf2f2ee)); bb.position.y = 1.5; bb.castShadow = true; booth.add(bb);
  const bw = new THREE.Mesh(new THREE.BoxGeometry(3.05, 1.2, 2.2), toon(0x9fd8ff, {roughness: .05, transparent: true, opacity: .55})); bw.position.y = 2; booth.add(bw);
  const br = new THREE.Mesh(new THREE.BoxGeometry(3.4, .3, 3.4), toon(0x2a5aa0)); br.position.y = 3.15; booth.add(br);
  const bar = new THREE.Group(); bar.position.set(-4.8, 1.1, -1.5); border.add(bar);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(9, .25, .25), toon(0xffffff, {map: canvasTex(256, 16, (c) => { for (let i = 0; i < 8; i++){ c.fillStyle = i % 2 ? '#e1000f' : '#ffffff'; c.fillRect(i * 32, 0, 32, 16); } })}));
  arm.position.x = 4.5; bar.add(arm); const post = new THREE.Mesh(new THREE.BoxGeometry(.5, 1.2, .5), toon(0x444a52)); post.position.y = -.5; bar.add(post); border.userData = {bar}; }
// ---- the Parisian detector (airport-style arch) ----
const detector = new THREE.Group(); scene.add(detector); detector.position.set(2.5, 0, 66);
const detScreenOK = signTex([['✔ OK', 150, 300]], '#127a3a', '#ffffff', 512, 512), detScreenALARM = signTex([['PARISIEN', 120, 220], ['DÉTECTÉ', 120, 360]], '#c40012', '#ffffff', 512, 512);
{ for (const sx of [-1, 1]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.5, 3.4, .9), toon(0xd8dde4)); p.position.set(sx * 1.2, 1.7, 0); p.castShadow = true; detector.add(p); }
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.9, .5, .9), toon(0xd8dde4)); top.position.y = 3.6; detector.add(top);
  const lampM = new THREE.MeshBasicMaterial({color: 0x330000}); const lamp = new THREE.Mesh(new THREE.SphereGeometry(.28, 14, 10), lampM); lamp.position.y = 4.05; detector.add(lamp);
  const scrM = new THREE.MeshBasicMaterial({map: detScreenOK}); const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), scrM); scr.position.set(1.2, 2.4, .46); detector.add(scr);
  const light = new THREE.PointLight(0xff2020, 0, 14, 1.5); light.position.y = 4.1; detector.add(light);
  detector.userData = {lampM, scrM, light}; }
function alarm(on, t){ const u = detector.userData; const blink = on && Math.sin(t * 18) > 0; u.lampM.color.set(blink ? 0xff2020 : (on ? 0x550000 : 0x0a3a14)); u.scrM.map = on ? detScreenALARM : detScreenOK; u.scrM.needsUpdate = true; u.light.intensity = blink ? 8 : 0; }
// ---- e-scooter ----
const scooter = new THREE.Group(); scene.add(scooter);
{ const deck = new THREE.Mesh(new THREE.BoxGeometry(.4, .1, 1.4), toon(0x1a1a1a)); deck.position.y = .25; scooter.add(deck);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1.6), toon(0x2a2a2a)); stem.position.set(0, 1.0, .65); stem.rotation.x = -.15; scooter.add(stem);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .9), toon(0x2a2a2a)); bar.rotation.z = Math.PI / 2; bar.position.set(0, 1.78, .78); scooter.add(bar);
  for (const z of [-.6, .7]){ const w = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .1, 16), toon(0x111111)); w.rotation.z = Math.PI / 2; w.position.set(0, .18, z); scooter.add(w); }
  const lime = new THREE.Mesh(new THREE.BoxGeometry(.42, .05, 1.2), toon(0x9be22d)); lime.position.y = .31; scooter.add(lime); }
// ---- café terrace ----
const cafe = new THREE.Group(); scene.add(cafe); cafe.position.set(-14, 0, 6); cafe.rotation.y = Math.PI / 2;
{ const facade = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 6), toon(0xf6e3c4)); facade.position.set(0, 3, -4); facade.castShadow = true; cafe.add(facade);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.4), toon(0xffffff, {map: signTex([['CAFÉ DU COIN', 150, 300]], '#7a1f2a', '#fff4d6', 1024, 384)})); sign.position.set(0, 5.2, -.98); cafe.add(sign);
  const awn = new THREE.Mesh(new THREE.BoxGeometry(11.5, .2, 2.6), toon(0xffffff, {map: canvasTex(256, 32, (c) => { for (let i = 0; i < 8; i++){ c.fillStyle = i % 2 ? '#c8202a' : '#ffffff'; c.fillRect(i * 32, 0, 32, 32); } })})); awn.position.set(0, 4.2, .2); awn.rotation.x = .3; cafe.add(awn);
  cafe.userData.tables = [];
  for (let i = 0; i < 4; i++){ const tg = new THREE.Group(); tg.position.set(-4.5 + i * 3, 0, 2.2); cafe.add(tg);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, .06, 20), toon(0xf4f4f0)); top.position.y = 1.1; top.castShadow = true; tg.add(top);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1.1), toon(0x333333)); leg.position.y = .55; tg.add(leg);
    for (const sx of [-1, 1]){ const ch = new THREE.Mesh(new THREE.BoxGeometry(.6, .08, .6), toon(0xb07a3a)); ch.position.set(sx * 1.0, .65, 0); tg.add(ch); const bk = new THREE.Mesh(new THREE.BoxGeometry(.08, .7, .6), toon(0xb07a3a)); bk.position.set(sx * 1.3, 1.0, 0); tg.add(bk); }
    blob(tg, 1.4); cafe.userData.tables.push(tg); } }
const billTex = canvasTex(320, 420, (c) => { c.fillStyle = '#fffdf6'; c.fillRect(0, 0, 320, 420); c.fillStyle = '#222'; c.textAlign = 'center'; c.font = '700 30px monospace'; c.fillText('CAFÉ DU COIN', 160, 50);
  c.font = '24px monospace'; c.textAlign = 'left'; [['Brunch', '34,00'], ['Café', ' 4,00']].forEach(([a, b], i) => { c.fillText(a, 30, 130 + i * 44); c.fillText(b + ' €', 190, 130 + i * 44); });
  c.fillRect(30, 230, 260, 3); c.font = '900 40px monospace'; c.fillStyle = '#c40012'; c.fillText('TOTAL 38,00 €', 22, 300); c.font = '20px monospace'; c.fillStyle = '#555'; c.fillText('Merci & à bientôt', 60, 380); });
const bill = new THREE.Mesh(new THREE.PlaneGeometry(.32, .42), toon(0xffffff, {map: billTex, side: THREE.DoubleSide})); scene.add(bill);
const cup = new THREE.Group(); { const c1 = new THREE.Mesh(new THREE.CylinderGeometry(.09, .07, .14, 16), toon(0xffffff)); cup.add(c1); const cf = new THREE.Mesh(new THREE.CircleGeometry(.08, 16), toon(0x3a1f10)); cf.rotation.x = -Math.PI / 2; cf.position.y = .065; cup.add(cf); } scene.add(cup);
// ---- traffic light + bench ----
const tlight = new THREE.Group(); scene.add(tlight); tlight.position.set(5.6, 0, 18);
{ const pole = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 4), toon(0x2a2a2a)); pole.position.y = 2; tlight.add(pole); const box = new THREE.Mesh(new THREE.BoxGeometry(.6, 1.6, .5), toon(0x1a1a1a)); box.position.y = 4.4; tlight.add(box);
  const red = new THREE.Mesh(new THREE.CircleGeometry(.18, 16), new THREE.MeshBasicMaterial({color: 0xff2020})); red.position.set(0, 4.85, .26); tlight.add(red); const green = new THREE.Mesh(new THREE.CircleGeometry(.18, 16), new THREE.MeshBasicMaterial({color: 0x113311})); green.position.set(0, 3.95, .26); tlight.add(green);
  tlight.userData = {red: red.material, green: green.material}; tlight.rotation.y = -Math.PI / 2; }
function setLight(isGreen){ tlight.userData.red.color.set(isGreen ? 0x331111 : 0xff2020); tlight.userData.green.color.set(isGreen ? 0x22ff55 : 0x113311); }
// ---- Paris flashback (sepia) : haussmann blocks + iron tower ----
const paris = new THREE.Group(); scene.add(paris); paris.position.set(0, 0, -400);
{ const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), toon(0x8a8478)); ground.rotation.x = -Math.PI / 2; paris.add(ground);
  const r = rng(31); for (let i = 0; i < 18; i++){ const w = 10 + r() * 6; const b = new THREE.Mesh(new THREE.BoxGeometry(w, 16, 10), toon(0xe6d8b8)); b.position.set((i % 2 ? 1 : -1) * 14, 8, -80 + Math.floor(i / 2) * 12); b.castShadow = true; paris.add(b);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w + .4, 3, 10.4), toon(0x5a6370)); roof.position.set(b.position.x, 17.5, b.position.z); paris.add(roof); }
  const tower = new THREE.Group(); tower.position.set(0, 0, -130); paris.add(tower); const iron = toon(0x6a5040, {metalness: .4});
  for (let k = 0; k < 4; k++){ const a = k * Math.PI / 2 + Math.PI / 4; const leg = new THREE.Mesh(new THREE.BoxGeometry(2.2, 40, 2.2), iron); leg.position.set(Math.cos(a) * 9, 18, Math.sin(a) * 9); leg.rotation.set(Math.sin(a) * .22, 0, -Math.cos(a) * .22); tower.add(leg); }
  for (const [y, s] of [[14, 22], [40, 10]]){ const pl = new THREE.Mesh(new THREE.BoxGeometry(s, 1.4, s), iron); pl.position.y = y; tower.add(pl); }
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(.6, 4, 70, 4), iron); spire.position.y = 75; spire.rotation.y = Math.PI / 4; tower.add(spire);
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.2), toon(0xffffff, {map: signTex([['PARIS 15ᵉ', 170, 300]], '#1d4f91', '#ffffff', 1024, 460)})); plaque.position.set(8.2, 6, -40); plaque.rotation.y = -Math.PI / 2; paris.add(plaque); }
// ---- cast (original characters, varied casual outfits) ----
const folk = [0xff5d73, 0x3ec1d3, 0xffc93c, 0x9b5de5, 0x00bb77, 0xf15bb5, 0x4cc9f0, 0xff924c].map((c, i) => makeBlocky({shirt: c, pants: [0x3a4a6a, 0x5a4a3a, 0x2a2a3a][i % 3], hair: [0x2a1d14, 0x8a5a2a, 0x1a1410, 0xd9a050][i % 4], messy: i % 3 === 0, mood: 'happy'}));
const guards = [0, 1].map(() => { const g = makeBlocky({shirt: 0x1f3d7a, pants: 0x18233a, hair: 0x1a1410, mood: 'angry'}); const cap = new THREE.Mesh(new THREE.BoxGeometry(1.32, .32, 1.32), toon(0x18233a)); cap.position.y = 4.1; g.add(cap);
  const brim = new THREE.Mesh(new THREE.BoxGeometry(1.32, .08, .5), toon(0x101826)); brim.position.set(0, 3.98, .8); g.add(brim); const badge = new THREE.Mesh(new THREE.BoxGeometry(.25, .3, .05), toon(0xf2c94c, {metalness: .7})); badge.position.set(.4, 2.5, .42); g.add(badge); return g; });
const waiter = makeBlocky({shirt: 0xffffff, pants: 0x1a1a1a, hair: 0x1a1410, mood: 'smug'}); { const apron = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, .05), toon(0x111111)); apron.position.set(0, 1.4, .43); waiter.add(apron); const bow = new THREE.Mesh(new THREE.BoxGeometry(.4, .14, .06), toon(0x111111)); bow.position.set(0, 2.85, .43); waiter.add(bow); }
const baker = makeBlocky({shirt: 0xffffff, pants: 0x6a5a4a, hair: 0x8a5a2a, mood: 'happy'}); { const hat = new THREE.Mesh(new THREE.CylinderGeometry(.55, .5, .7, 14), toon(0xffffff)); hat.position.y = 4.35; baker.add(hat); }
// hide the street tree that blocks the café terrace
town.children.forEach(o => { if (o.isGroup && Math.abs(o.position.x + 11) < .5 && Math.abs(o.position.z - 8) < 1) { o.visible = false; KEEP_HIDDEN.push(o); } });
ALL.push(border, detector, scooter, cafe, bill, cup, tlight, paris, ...folk, ...guards, waiter, baker);
function pLook(){ townLook(); KEEP_HIDDEN.forEach(o => o.visible = false); }
