
// ===================== « ET C'EST VRAI » : Longyearbyen (Svalbard) =====================
const AG = new THREE.Group(); scene.add(AG);
function aH(x, z){ const v = Math.max(0, (Math.abs(x) - 58) / 60); return v * v * 110 + Math.sin(z * .03) * 1.2 + Math.sin(x * .05 + z * .02) * 1.0; }   // vallée en U
const snowT = noiseTex(512, 512, '#eef3f8', ['#d5dfeb', '#ffffff', '#c9d4e2'], 6000, 3); snowT.wrapS = snowT.wrapT = THREE.RepeatWrapping; snowT.repeat.set(20, 20);
{ const g = new THREE.PlaneGeometry(700, 900, 140, 180); g.rotateX(-Math.PI / 2); const pa = g.attributes.position; const col = [];
  for (let i = 0; i < pa.count; i++){ const x = pa.getX(i), z = pa.getZ(i); const h = aH(x, z); pa.setY(i, h); const c = new THREE.Color(0xffffff).lerp(new THREE.Color(0xa9b4c6), Math.min(1, h / 90)); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  const m = new THREE.Mesh(g, vstd(0xffffff, {map: snowT, vertexColors: true, roughness: .7})); m.receiveShadow = true; AG.add(m); }
// montagnes tabulaires typiques du Svalbard au fond
{ const r = rng(8); for (let i = 0; i < 9; i++){ const w = 120 + r() * 90, h = 60 + r() * 40; const g = new THREE.CylinderGeometry(w * .42, w * .55, h, 9, 3); const pa = g.attributes.position; const col = [];
    for (let k = 0; k < pa.count; k++){ const y = pa.getY(k); const top = y > h * .3; const c = top ? new THREE.Color(0xf2f5fa) : (Math.sin(k * 1.7) > .2 ? new THREE.Color(0x2e2f36) : new THREE.Color(0xdfe6ee)); col.push(c.r, c.g, c.b); pa.setX(k, pa.getX(k) * (1 + (r() - .5) * .15)); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({vertexColors: true, roughness: .9, flatShading: true})); m.position.set(-320 + i * 80, h / 2 - 5, -420 - r() * 120); AG.add(m); } }
// fjord gelé au fond
{ const ice = new THREE.Mesh(new THREE.PlaneGeometry(900, 160), vstd(0xbcd2e6, {roughness: .25, metalness: .1})); ice.rotation.x = -Math.PI / 2; ice.position.set(0, .3, -330); AG.add(ice); }
// maisons colorées sur pilotis
const AHOUSES = []; const HCOL = [0xc0392b, 0xf1c40f, 0x2e86c1, 0x27ae60, 0xe67e22, 0x8e44ad, 0xd35400, 0x16a085];
function lodge(x, z, rot, col, w = 6, d = 10){ const g = new THREE.Group(); g.position.set(x, aH(x, z), z); g.rotation.y = rot; const plank = canvasTex(128, 128, (c) => { c.fillStyle = '#' + col.toString(16).padStart(6, '0'); c.fillRect(0, 0, 128, 128); c.strokeStyle = 'rgba(0,0,0,.22)'; c.lineWidth = 2; for (let y = 0; y < 128; y += 10){ c.beginPath(); c.moveTo(0, y); c.lineTo(128, y); c.stroke(); } });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]){ const st = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, 1.6), vstd(0x3a3028)); st.position.set(sx * (w / 2 - .4), .8, sz * (d / 2 - .5)); g.add(st); }
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, 3.4, d), vstd(0xffffff, {map: plank})); b.position.y = 3.3; b.castShadow = b.receiveShadow = true; g.add(b);
  const roof = new THREE.Mesh(roofGeo(w, d, 2.0), vstd(0x2b2b30)); roof.position.y = 5.0; g.add(roof); const snowR = new THREE.Mesh(roofGeo(w * .96, d * .98, 1.95), vstd(0xf6f9fc, {roughness: .6})); snowR.position.y = 5.08; g.add(snowR);
  for (const wx of [-w * .25, w * .25]){ const wn = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshStandardMaterial({color: 0xffd58a, emissive: 0xffb04a, emissiveIntensity: .9})); wn.position.set(wx, 3.5, d / 2 + .02); g.add(wn); }
  AG.add(g); AHOUSES.push(g); return g; }
{ const r = rng(3); for (let row = 0; row < 5; row++) for (let i = 0; i < 6; i++){ const x = -26 + i * 10 + (row % 2) * 4 + (r() - .5) * 2, z = -20 + row * 13; if (Math.abs(x - 8) < 6 && row === 2) continue; lodge(x, z, (row % 2 ? .08 : -.06), HCOL[(row * 3 + i) % HCOL.length]); } }
// pylônes de l'ancien téléphérique à charbon
{ for (let i = 0; i < 6; i++){ const x = -55 + i * 22, z = -60 - i * 6; const g = new THREE.Group(); g.position.set(x, aH(x, z), z); const wood = vstd(0x4a3a2a);
    for (const s of [-1, 1]){ const leg = new THREE.Mesh(new THREE.BoxGeometry(.4, 12, .4), wood); leg.position.set(s * 1.6, 6, 0); leg.rotation.z = -s * .12; g.add(leg); }
    for (let k = 0; k < 4; k++){ const br = new THREE.Mesh(new THREE.BoxGeometry(3.6 - k * .5, .3, .3), wood); br.position.y = 2 + k * 3; g.add(br); } const top = new THREE.Mesh(new THREE.BoxGeometry(4.4, .5, .8), wood); top.position.y = 12; g.add(top); AG.add(g); } }
// cimetière : croix blanches sur la pente
const acem = new THREE.Group(); AG.add(acem); acem.position.set(-34, 0, 32);
{ const r = rng(19); for (let i = 0; i < 28; i++){ const x = (i % 7) * 2.2 - 6.6 + (r() - .5) * .4, z = Math.floor(i / 7) * 2.6 - 4; const c = new THREE.Group(); c.position.set(x, aH(-34 + x, 32 + z), z); const w = vstd(0xffffff, {roughness: .5});
    const v = new THREE.Mesh(new THREE.BoxGeometry(.16, 1.5, .16), w); v.position.y = .75; c.add(v); const h = new THREE.Mesh(new THREE.BoxGeometry(.8, .14, .14), w); h.position.y = 1.15; c.add(h); c.rotation.z = (r() - .5) * .15; acem.add(c); }
  for (const [w, d, x, z] of [[18, .2, 0, -6], [18, .2, 0, 6.8], [.2, 13, -8.6, .4], [.2, 13, 8.6, .4]]){ const f = new THREE.Mesh(new THREE.BoxGeometry(w, .9, d), vstd(0x5a4a3a)); f.position.set(x, aH(-34, 32) + .45, z); acem.add(f); }
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.0), vstd(0xffffff, {map: canvasTex(512, 150, (c) => { c.fillStyle = '#f3ede0'; c.fillRect(0, 0, 512, 150); c.fillStyle = '#222'; c.font = '700 44px "DejaVu Serif", serif'; c.textAlign = 'center'; c.fillText('INHUMATIONS', 256, 62); c.fillText('SUSPENDUES · 1950', 256, 118); })}));
  sg.position.set(0, aH(-34, 39) + 1.6, 7.0); acem.add(sg); const sp = new THREE.Mesh(new THREE.BoxGeometry(.12, 1.6, .12), vstd(0x3a3028)); sp.position.set(0, aH(-34, 39) + .8, 6.95); acem.add(sp); }
// panneau ours polaire (triangle) + ours
const bearSign = new THREE.Group(); AG.add(bearSign); bearSign.position.set(22, aH(22, 52), 52);
{ const t = canvasTex(512, 512, (c) => { c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(256, 20); c.lineTo(500, 470); c.lineTo(12, 470); c.closePath(); c.fill(); c.strokeStyle = '#c0102a'; c.lineWidth = 44; c.lineJoin = 'round'; c.stroke();
    c.fillStyle = '#111'; c.beginPath(); c.ellipse(250, 330, 120, 55, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(375, 300, 45, 35, -.3, 0, 7); c.fill(); for (const lx of [170, 215, 290, 330]){ c.fillRect(lx, 350, 26, 70); } c.beginPath(); c.arc(395, 270, 12, 0, 7); c.fill(); });
  const s = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshStandardMaterial({map: t, transparent: true, roughness: .5})); s.position.y = 3.2; bearSign.add(s);
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(2.2, .5), vstd(0xffffff, {map: canvasTex(512, 116, (c) => { c.fillStyle = '#fff'; c.fillRect(0, 0, 512, 116); c.fillStyle = '#111'; c.font = '900 64px Inter, sans-serif'; c.textAlign = 'center'; c.fillText('GJELDER HELE', 256, 60); c.font = '700 40px Inter'; c.fillText('SVALBARD', 256, 104); })})); lab.position.y = 1.85; bearSign.add(lab);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 3.2), vstd(0x8a8a8a, {metalness: .6})); pole.position.y = 1.6; bearSign.add(pole); }
const bear = new THREE.Group(); scene.add(bear);
{ const fur = vstd(0xf3eedf, {roughness: .9}); const body = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 2.2, 8, 16), fur); body.rotation.z = Math.PI / 2; body.position.y = 1.8; bear.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.75, 16, 12), fur); head.position.set(2.1, 2.2, 0); head.scale.set(1.3, .9, .9); bear.add(head); const nose = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 6), vstd(0x111111)); nose.position.set(3.05, 2.15, 0); bear.add(nose);
  for (const s of [-1, 1]){ const ear = new THREE.Mesh(new THREE.SphereGeometry(.2, 8, 6), fur); ear.position.set(1.9, 2.85, s * .45); bear.add(ear); const eye = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), vstd(0x111111)); eye.position.set(2.75, 2.4, s * .3); bear.add(eye); }
  bear.userData.legs = []; for (const x of [-1.1, 1.1]) for (const z of [-.6, .6]){ const l = new THREE.Mesh(new THREE.CapsuleGeometry(.35, 1.0, 4, 8), fur); l.position.set(x, .75, z); bear.add(l); bear.userData.legs.push(l); }
  bear.traverse(o => { if (o.isMesh) o.castShadow = true; }); }
// panneau « chats interdits »
const catSign = new THREE.Group(); scene.add(catSign);
{ const t = canvasTex(512, 512, (c) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(256, 256, 240, 0, 7); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.ellipse(256, 300, 90, 70, 0, 0, 7); c.fill(); c.beginPath(); c.arc(256, 200, 62, 0, 7); c.fill();
    c.beginPath(); c.moveTo(205, 165); c.lineTo(215, 105); c.lineTo(245, 150); c.fill(); c.beginPath(); c.moveTo(307, 165); c.lineTo(297, 105); c.lineTo(267, 150); c.fill(); c.lineWidth = 16; c.strokeStyle = '#111'; c.beginPath(); c.moveTo(340, 330); c.quadraticCurveTo(420, 300, 390, 230); c.stroke();
    c.strokeStyle = '#c0102a'; c.lineWidth = 44; c.beginPath(); c.arc(256, 256, 218, 0, 7); c.stroke(); c.beginPath(); c.moveTo(100, 100); c.lineTo(412, 412); c.stroke(); });
  const s = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshStandardMaterial({map: t, roughness: .5})); s.position.y = 2.6; catSign.add(s); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.6), vstd(0x8a8a8a, {metalness: .6})); pole.position.y = 1.3; catSign.add(pole); }
// avion d'évacuation (petit bimoteur)
const aplane = new THREE.Group(); scene.add(aplane);
{ const w = vstd(0xf4f4f4, {roughness: .35}); const fus = new THREE.Mesh(new THREE.CapsuleGeometry(.9, 7, 8, 16), w); fus.rotation.z = Math.PI / 2; aplane.add(fus);
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(.92, .92, 7, 16, 1, true), vstd(0xc0102a)); stripe.rotation.z = Math.PI / 2; stripe.scale.set(1, 1, .35); stripe.position.y = -.2; aplane.add(stripe);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(2.2, .18, 13), w); wing.position.set(.4, .5, 0); aplane.add(wing); const tail = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, .15), w); tail.position.set(-4.2, 1.2, 0); aplane.add(tail);
  const ht = new THREE.Mesh(new THREE.BoxGeometry(1.1, .12, 4), w); ht.position.set(-4.2, .4, 0); aplane.add(ht); for (const z of [-3, 3]){ const eng = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, 1.6, 12), vstd(0x555555)); eng.rotation.z = Math.PI / 2; eng.position.set(1.3, .35, z); aplane.add(eng); }
  const nav = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), new THREE.MeshBasicMaterial({color: 0xff2020})); nav.position.set(.4, .55, 6.5); aplane.add(nav); }
// cercueil gelé (reconstitution 1918) dans le permafrost
const iceCut = new THREE.Group(); scene.add(iceCut);
{ const soil = canvasTex(512, 512, (c) => { const g = c.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#f2f6fa'); g.addColorStop(.12, '#e6edf4'); g.addColorStop(.14, '#5b4a3a'); g.addColorStop(1, '#3a2f26'); c.fillStyle = g; c.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2500; i++){ c.fillStyle = `rgba(${Math.random() < .5 ? '200,220,240' : '20,15,10'},${Math.random() * .25})`; c.fillRect(Math.random() * 512, 70 + Math.random() * 442, 3, 3); }
    c.strokeStyle = 'rgba(210,230,250,.5)'; c.lineWidth = 2; for (let i = 0; i < 60; i++){ c.beginPath(); const x = Math.random() * 512, y = 80 + Math.random() * 420; c.moveTo(x, y); c.lineTo(x + (Math.random() - .5) * 60, y + Math.random() * 30); c.stroke(); } });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), vstd(0xffffff, {map: soil})); iceCut.add(wall);
  const coffin = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, .6), vstd(0x6a4a30, {roughness: .8})); coffin.position.set(0, -2.2, .3); iceCut.add(coffin);
  const frost = new THREE.Mesh(new THREE.BoxGeometry(4.3, 1.2, .62), new THREE.MeshStandardMaterial({color: 0xe8f4ff, transparent: true, opacity: .35, roughness: .2})); frost.position.copy(coffin.position); iceCut.add(frost);
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .5), vstd(0xffffff, {map: canvasTex(400, 125, (c) => { c.fillStyle = '#efe6d0'; c.fillRect(0, 0, 400, 125); c.fillStyle = '#222'; c.font = '700 60px "DejaVu Serif", serif'; c.textAlign = 'center'; c.fillText('1918', 200, 85); })})); tag.position.set(0, -2.2, .62); iceCut.add(tag); }
// aurore boréale (rideaux lumineux)
const aurora = new THREE.Group(); scene.add(aurora);
{ const at = canvasTex(512, 256, (c) => { const g = c.createLinearGradient(0, 256, 0, 0); g.addColorStop(0, 'rgba(60,255,160,0)'); g.addColorStop(.15, 'rgba(60,255,160,.9)'); g.addColorStop(.55, 'rgba(80,220,200,.45)'); g.addColorStop(1, 'rgba(160,80,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 512, 256);
    c.globalCompositeOperation = 'destination-in'; for (let x = 0; x < 512; x += 3){ c.fillStyle = `rgba(0,0,0,${.3 + Math.random() * .7})`; c.fillRect(x, 0, 3, 256); } });
  for (let i = 0; i < 4; i++){ const g = new THREE.PlaneGeometry(700, 160, 60, 1); const pa = g.attributes.position; for (let k = 0; k < pa.count; k++){ const x = pa.getX(k); pa.setZ(k, Math.sin(x * .012 + i) * 60); } const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({map: at, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false}));
    m.position.set(i * 40 - 60, 120 + i * 14, -260 - i * 25); m.renderOrder = 5; aurora.add(m); } }
// habitants : figurines en anoraks
const anorak1 = ancien({coat: 0xc0392b, beret: true}), anorak2 = ancien({coat: 0x2e86c1});
ALL.push(AG, bear, catSign, aplane, iceCut, aurora, anorak1, anorak2);
// lumière : nuit polaire bleutée (heure bleue) ou jour arctique pâle
const NIGHT_BG = canvasTex(4, 512, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#050a1e'); g.addColorStop(.55, '#0e2a4a'); g.addColorStop(1, '#1d4a66'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
function aLook(night = false){ look('day'); scene.environment = null;
  if (night){ setSky('polar', 3, 200, 2, 2.2, .004); sky.visible = false; scene.background = NIGHT_BG; renderer.toneMappingExposure = 1.1; sunLight.intensity = .6; sunLight.color.set(0xa8c4ff); hemi.intensity = 1.6; hemi.color.set(0x9fb8f0); hemi.groundColor.set(0x40507a); scene.fog = new THREE.Fog(0x1d3a5a, 120, 800); bloom.strength = .4; }
  else { setSky('arctic', 2.5, 205, 2.5, 2.4, .005); renderer.toneMappingExposure = .75; sunLight.intensity = 2.2; sunLight.color.set(0xffb898); hemi.intensity = 1.3; hemi.color.set(0xd8e4ff); hemi.groundColor.set(0x9aa8c0); scene.fog = new THREE.Fog(0xe8c8c8, 160, 900); bloom.strength = .25; } }
