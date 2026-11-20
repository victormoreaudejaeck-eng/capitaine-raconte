
// ===================== "DANS CETTE VILLE, TOUT LE MONDE VOTE GLUCKSMANN" : assets =====================
const POSTER_G = canvasTex(512, 720, (c, w, h) => { c.fillStyle = '#e64980'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.fillRect(0, h - 130, w, 130); c.fillStyle = '#ffd8e6'; c.fillRect(0, h - 150, w, 20);
  c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '900 72px Inter, sans-serif'; c.fillText('GLUCKSMANN', w / 2, 300); c.font = '900 150px Inter, sans-serif'; c.fillText('2027', w / 2, 470);
  c.fillStyle = '#e64980'; c.font = '800 46px Inter, sans-serif'; c.fillText('UN CAP CLAIR', w / 2, h - 48); });
scene.traverse(o => { if (o.isMesh && o.material && o.material.map === POSTER_M){ o.material.map = POSTER_G; o.material.needsUpdate = true; } });
const gSign = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// extra faces
const GFACE = {};
function gFace(mood){ if (GFACE[mood]) return GFACE[mood]; return GFACE[mood] = canvasTex(256, 256, (c) => { c.fillStyle = '#f1c7a1'; c.fillRect(0, 0, 256, 256); c.lineCap = 'round';
  c.strokeStyle = '#1b1a2e'; c.lineWidth = 7;
  for (const ex of [86, 170]){ if (mood === 'zen'){ c.beginPath(); c.arc(ex, 116, 18, Math.PI + .3, -.3); c.stroke(); continue; }
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, 122, 21, 20, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#1b1a2e'; c.beginPath(); c.arc(ex, 128, 9, 0, 7); c.fill();
    c.fillStyle = '#e9b48f'; c.beginPath(); c.ellipse(ex, 112, 25, mood === 'yawn' ? 17 : 13, 0, Math.PI, 0); c.fill(); c.beginPath(); c.moveTo(ex - 25, 113); c.lineTo(ex + 25, 113); c.stroke();
    c.strokeStyle = 'rgba(120,80,110,.45)'; c.lineWidth = 5; c.beginPath(); c.arc(ex, 142, 18, .4, Math.PI - .4); c.stroke(); c.strokeStyle = '#1b1a2e'; c.lineWidth = 7; }
  c.strokeStyle = '#3a2a1a'; c.lineWidth = 10; c.beginPath(); c.moveTo(60, 84); c.lineTo(112, 88); c.moveTo(144, 88); c.lineTo(196, 84); c.stroke();
  c.fillStyle = '#5a1e24'; c.strokeStyle = '#1b1a2e'; c.lineWidth = 6;
  if (mood === 'yawn'){ c.beginPath(); c.ellipse(128, 194, 26, 34, 0, 0, 7); c.fill(); c.stroke(); }
  else if (mood === 'zen'){ c.beginPath(); c.arc(128, 176, 22, .3, Math.PI - .3); c.stroke(); }
  else { c.beginPath(); c.moveTo(108, 190); c.quadraticCurveTo(128, 184, 148, 192); c.stroke(); } }); }
function gMood(p, m){ if (['sleepy', 'yawn', 'zen'].includes(m)){ p.userData.headMats[4].map = gFace(m); p.userData.headMats[4].needsUpdate = true; } else bMood(p, m); }
// townsfolk: pastel, glasses, beanies, tote bags
const folkG = []; { const shirts = [0x9cc5a1, 0xb8a9e0, 0xe8dcc4, 0xe8b4b8, 0xa9c8e8, 0xc9dbb2, 0xf2d0a9, 0xcbb8d9, 0xa8d5c9, 0xe0c9b5];
  for (let i = 0; i < 10; i++){ const p = makeBlocky({shirt: shirts[i], pants: [0xd8ccb4, 0x8a8f99, 0x6b7a5c][i % 3], hair: [0x6a4a2a, 0x2a1d14, 0xb88a50, 0x8a3a20][i % 4], messy: i % 3 === 1});
    if (i % 2 === 0){ const fr = toon(0x1b1a2e); for (const sx of [-1, 1]){ const r = new THREE.Mesh(new THREE.TorusGeometry(.17, .035, 6, 16), fr); r.position.set(sx * .27, 3.42, .59); p.add(r); } const br = new THREE.Mesh(new THREE.BoxGeometry(.2, .04, .04), fr); br.position.set(0, 3.45, .6); p.add(br); }
    if (i % 3 === 0){ const hat = new THREE.Mesh(new THREE.BoxGeometry(1.3, .55, 1.3), toon([0xd9a441, 0x7a8f6a, 0xc65d4a][i % 3])); hat.position.y = 4.1; p.add(hat); const fold = new THREE.Mesh(new THREE.BoxGeometry(1.34, .2, 1.34), toon(0xffffff, {color: [0xc08f30, 0x6a7f5a, 0xb04d3a][i % 3]})); fold.position.y = 3.9; p.add(fold); }
    if (i % 2 === 1){ const tote = new THREE.Mesh(new THREE.BoxGeometry(.12, 1.0, .9), toon(0xf0e6d0)); tote.position.set(.85, 1.7, 0); p.add(tote); const strap = new THREE.Mesh(new THREE.BoxGeometry(.06, .9, .06), toon(0xe0d4b8)); strap.position.set(.85, 2.6, 0); p.add(strap); }
    folkG.push(p); } }
// matcha stand
const matcha = new THREE.Group(); scene.add(matcha); matcha.position.set(-7.5, 0, 6); matcha.rotation.y = Math.PI / 2;
{ const wood = toon(0xc9a27a), dark = toon(0x8a6a4a);
  const counter = new THREE.Mesh(new THREE.BoxGeometry(5, 1.3, 1.4), wood); counter.position.y = .65; counter.castShadow = true; matcha.add(counter);
  const top = new THREE.Mesh(new THREE.BoxGeometry(5.2, .12, 1.6), dark); top.position.y = 1.36; matcha.add(top);
  const back = new THREE.Mesh(new THREE.BoxGeometry(5, 3.6, .2), toon(0xeef3e6)); back.position.set(0, 1.8, -1.6); matcha.add(back);
  for (const sx of [-1, 1]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.18, 3.8, .18), dark); p.position.set(sx * 2.5, 1.9, .7); matcha.add(p); const p2 = p.clone(); p2.position.z = -1.6; matcha.add(p2); }
  const awn = new THREE.Mesh(new THREE.BoxGeometry(5.6, .16, 3), toon(0xffffff, {map: canvasTex(256, 32, (c) => { for (let i = 0; i < 8; i++){ c.fillStyle = i % 2 ? '#7fae6e' : '#f4f1e6'; c.fillRect(i * 32, 0, 32, 32); } })})); awn.position.set(0, 3.9, -.4); awn.rotation.x = .12; matcha.add(awn);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.1), toon(0xffffff, {map: gSign([['MATCHA BAR', 150, 210], ['latte avoine · 7,50 €', 64, 330]], '#4f7a43')})); sign.position.set(0, 4.55, .9); matcha.add(sign);
  const plant = new THREE.Mesh(new THREE.SphereGeometry(.45, 10, 8), toon(0x5c9a4a)); plant.position.set(-2.1, 1.85, .3); matcha.add(plant);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.3, .25, .45, 12), toon(0xe9e2d6)); pot.position.set(-2.1, 1.6, .3); matcha.add(pot); }
function matchaCup(){ const g = new THREE.Group();
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(.3, .26, .7, 20), toon(0x8fbf5a, {roughness: .3})); liq.position.y = .35; g.add(liq);
  const milk = new THREE.Mesh(new THREE.CylinderGeometry(.305, .3, .25, 20), toon(0xf4f1e6, {roughness: .4})); milk.position.y = .82; g.add(milk);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(.34, .28, 1.1, 20, 1, true), new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: .25, roughness: .05})); glass.position.y = .55; g.add(glass);
  const straw = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 1.3), toon(0x2a4a2a)); straw.position.set(.1, 1.1, 0); straw.rotation.z = -.2; g.add(straw);
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(.5, .28), toon(0xffffff, {map: gSign([['OAT', 200, 250]], '#f4f1e6', '#4f7a43', 512, 300)})); lab.position.set(0, .45, .33); g.add(lab);
  scene.add(g); return g; }
const cupHero = matchaCup(); const cups = [0, 1, 2].map(() => matchaCup());
// barista
const barista = makeBlocky({shirt: 0x3a4a3a, pants: 0x2a2a2a, hair: 0x2a1d14});
{ const hat = new THREE.Mesh(new THREE.BoxGeometry(1.3, .6, 1.3), toon(0x7a8f6a)); hat.position.y = 4.1; barista.add(hat); const apron = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, .05), toon(0xc9a27a)); apron.position.set(0, 1.8, .42); barista.add(apron); }
// empty sugar jar with sign
const sugar = new THREE.Group(); scene.add(sugar);
{ const table = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1.6), toon(0xe9e2d6)); table.position.y = .6; sugar.add(table);
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, 1.1, 24, 1, true), new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: .3, roughness: .05, side: THREE.DoubleSide})); jar.position.y = 1.75; sugar.add(jar);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(.48, .48, .14, 24), toon(0xb8c0c8, {metalness: .7})); lid.position.y = 2.37; sugar.add(lid);
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(.7, .32), toon(0xffffff, {map: gSign([['SUCRE', 190, 250]], '#ffffff', '#222', 512, 300)})); lab.position.set(0, 1.7, .46); sugar.add(lab);
  const card = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .6), toon(0xffffff, {map: gSign([['0 GLUCIDE', 150, 230], ['merci', 90, 340]], '#e64980')})); card.position.set(1.0, 1.55, .55); card.rotation.y = -.3; sugar.add(card); }
// sit-in signs
const signs = []; for (let i = 0; i < 4; i++){ const g = new THREE.Group(); const stick = new THREE.Mesh(new THREE.BoxGeometry(.1, 2.4, .1), toon(0x8a6a4a)); stick.position.y = 1.2; g.add(stick);
  const pl = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, .05), toon(0xffffff, {map: gSign([[['UN CAP', 'CALME', 'DOUCEMENT', 'UN CAP'][i], 150, 190], [['CLAIR ?', 'SVP', 'MAIS SÛREMENT', 'CLAIR !'][i], 120, 330]], '#ffffff', '#e64980')})); pl.position.y = 2.6; g.add(pl); scene.add(g); signs.push(g); }
// zzz sprites
const zTex = canvasTex(256, 256, (c) => { c.font = '900 120px Inter, sans-serif'; c.textAlign = 'center'; c.lineWidth = 14; c.strokeStyle = '#1b1a2e'; c.fillStyle = '#ffffff'; c.strokeText('Z', 128, 170); c.fillText('Z', 128, 170); });
const zzz = new THREE.Group(); scene.add(zzz); for (let i = 0; i < 30; i++){ const s = new THREE.Sprite(new THREE.SpriteMaterial({map: zTex, transparent: true, depthWrite: false})); zzz.add(s); }
function zzzOn(heads, t){ zzz.visible = true; zzz.children.forEach((s, i) => { const h = heads[Math.floor(i / 3) % Math.max(1, heads.length)]; if (!h || Math.floor(i / 3) >= heads.length){ s.visible = false; return; } s.visible = true;
  const k = (t * .5 + (i % 3) / 3) % 1; const w = h.getWorldPosition(V(0, 0, 0)); s.position.set(w.x + .5 + k * .8 + Math.sin(k * 6) * .15, w.y + .7 + k * 1.6, w.z); s.scale.setScalar(.35 + k * .45); s.material.opacity = Math.min(1, (1 - k) * 2); }); }
// compass
const compass = new THREE.Group(); scene.add(compass);
{ const rim = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .25, 40), toon(0xc8a050, {metalness: .8, roughness: .3})); rim.rotation.x = Math.PI / 2; compass.add(rim);
  const face = new THREE.Mesh(new THREE.CircleGeometry(.88, 40), toon(0xffffff, {map: canvasTex(512, 512, (c) => { c.fillStyle = '#f6efdc'; c.fillRect(0, 0, 512, 512); c.fillStyle = '#222'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 64px Inter';
    [['N', 256, 70], ['S', 256, 442], ['E', 442, 256], ['O', 70, 256]].forEach(([l, x, y]) => c.fillText(l, x, y)); c.font = '800 34px Inter'; [['?', 390, 120], ['?', 120, 120], ['?', 390, 392], ['?', 120, 392]].forEach(([l, x, y]) => c.fillText(l, x, y)); })}));
  face.position.z = .13; compass.add(face);
  const needle = new THREE.Group(); needle.position.z = .18; compass.add(needle); compass.userData.needle = needle;
  const n1 = new THREE.Mesh(new THREE.ConeGeometry(.09, .7, 4), toon(0xd62828)); n1.position.y = .35; needle.add(n1); const n2 = new THREE.Mesh(new THREE.ConeGeometry(.09, .7, 4), toon(0xeeeeee)); n2.position.y = -.35; n2.rotation.z = Math.PI; needle.add(n2);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .1, 12), toon(0xc8a050, {metalness: .8})); pin.rotation.x = Math.PI / 2; needle.add(pin); }
// pain au chocolat
const painChoc = new THREE.Group(); scene.add(painChoc);
{ const b = new THREE.Mesh(new THREE.BoxGeometry(1.0, .42, .62), toon(0xd28a2e, {roughness: .45})); painChoc.add(b); const t2 = new THREE.Mesh(new THREE.BoxGeometry(.96, .1, .58), toon(0xe9a640, {roughness: .4})); t2.position.y = .24; painChoc.add(t2);
  for (const x of [-.25, .25]){ const s = new THREE.Mesh(new THREE.BoxGeometry(.14, .44, .64), toon(0x3a1e10)); s.position.x = x; painChoc.add(s); } }
ALL.push(...folkG, matcha, cupHero, ...cups, barista, sugar, ...signs, zzz, compass, painChoc);
const G0 = () => { townLook(); only(sky, town, clouds); renderer.toneMappingExposure = .9; };
