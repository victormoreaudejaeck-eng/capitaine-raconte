
// ===================== RETAILLEAU : la ville de l'ordre (et du froid) =====================
const tSign = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.textAlign = 'center'; lines.forEach(([t, sz, y, col]) => { c.fillStyle = col || fg; c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 60) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// hiver : herbe -> neige
const SNOW_TEX = canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#eef3f8'; c.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++){ c.fillStyle = Math.random() < .5 ? '#ffffff' : '#dde6ef'; c.fillRect(Math.random() * w, Math.random() * h, 3, 3); } }); SNOW_TEX.wrapS = SNOW_TEX.wrapT = THREE.RepeatWrapping; SNOW_TEX.repeat.set(60, 60);
town.traverse(o => { if (o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.width === 800){ o.material = o.material.clone(); o.material.map = SNOW_TEX; } });
const snow = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({color: 0xffffff, size: .18, transparent: true, opacity: .9, depthWrite: false})); { const n = 1500, a = new Float32Array(n * 3); for (let i = 0; i < n; i++){ a[i * 3] = (Math.random() - .5) * 40; a[i * 3 + 1] = Math.random() * 20; a[i * 3 + 2] = (Math.random() - .5) * 40; } snow.geometry.setAttribute('position', new THREE.BufferAttribute(a, 3)); snow.userData.a0 = a.slice(); } scene.add(snow);
function snowAt(c, t){ snow.visible = true; snow.position.set(c.x, 0, c.z); const a = snow.geometry.attributes.position.array, a0 = snow.userData.a0; for (let i = 0; i < a.length; i += 3){ a[i + 1] = ((a0[i + 1] - t * 1.6) % 20 + 20) % 20; a[i] = a0[i] + Math.sin(t + i) * .3; } snow.geometry.attributes.position.needsUpdate = true; }
function winterLook(){ townLook(); scene.fog = new THREE.Fog(0xdfe8f2, 30, 240); sunLight.intensity = 1.3; sunLight.color.set(0xe2ecff); hemi.intensity = 2.2; hemi.color.set(0xeef4ff); hemi.groundColor.set(0xd6dee8); renderer.toneMappingExposure = .92; }
const POSTER_RT = posterTex('RETAILLEAU', '2027', '#1b2a4e'); scene.traverse(o => { if (o.isMesh && o.material && (o.material.map === POSTER_M || o.material.map === POSTER)){ o.material = o.material.clone(); o.material.map = POSTER_RT; } });
// doudoune sans manche
const QUILT = (col) => canvasTex(256, 256, (c) => { c.fillStyle = col; c.fillRect(0, 0, 256, 256); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 6; for (let y = 32; y < 256; y += 42){ c.beginPath(); c.moveTo(0, y); c.lineTo(256, y); c.stroke(); } c.fillStyle = '#c8c8c8'; c.fillRect(124, 0, 8, 256); });
const QT = {navy: QUILT('#1b2a4e'), olive: QUILT('#4b5a3a'), black: QUILT('#1a1a1a'), bord: QUILT('#5a1e2a')};
function vestOn(p, key = 'navy'){ const v = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, .95), toon(0xffffff, {map: QT[key]})); v.position.y = 2.05; p.add(v); p.userData.vest = v; return v; }
citizens.forEach((c, i) => vestOn(c, ['navy', 'olive', 'black', 'bord'][i % 4]));
// Retailleau : cheveux gris, lunettes, costume + doudoune sans manche
const retail = makeBlocky({shirt: 0x223355, pants: 0x223355, hair: 0xcfcfcf, slick: true, suit: true, tie: 0x1c2d5a, mood: 'angry'}); vestOn(retail, 'navy');
{ const fr = toon(0x111111); for (const sx of [-1, 1]){ const r = new THREE.Mesh(new THREE.TorusGeometry(.17, .03, 8, 20), fr); r.position.set(sx * .24, 3.45, .6); retail.add(r); } const br = new THREE.Mesh(new THREE.BoxGeometry(.14, .03, .03), fr); br.position.set(0, 3.47, .6); retail.add(br); }
// Édouard Philippe (grand, barbe)
const philippe = makeBlocky({shirt: 0x2a2f3a, pants: 0x2a2f3a, hair: 0x6a6a6a, suit: true, tie: 0x4a7ab8, mood: 'smug'}); philippe.scale.setScalar(1.15); { const beard = new THREE.Mesh(new THREE.BoxGeometry(1.0, .3, .1), toon(0x7a7a7a)); beard.position.set(0, 2.9, .58); philippe.add(beard); }
// gendarme
const gendarme = makeBlocky({shirt: 0x1f3d7a, pants: 0x18233a, hair: 0x1a1410, mood: 'angry'}); { const cap = new THREE.Mesh(new THREE.CylinderGeometry(.7, .7, .35, 20), toon(0x18233a)); cap.position.y = 4.15; gendarme.add(cap); const vis = new THREE.Mesh(new THREE.BoxGeometry(1.0, .06, .5), toon(0x111111)); vis.position.set(0, 4.0, .7); gendarme.add(vis); }
// bannière de l'ordre
const ordreBan = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 2.6), toon(0xffffff, {map: tSign([['L\'ORDRE', 150, 150], ['LA JUSTICE', 80, 255], ['LA FIERTÉ FRANÇAISE', 70, 350]], '#1b2a4e')})); scene.add(ordreBan);
// pigeons au pas
const pigs = Array.from({length: 8}, () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(.3, 12, 10), toon(0x9aa0aa)); b.scale.set(1, .85, 1.3); b.position.y = .45; g.add(b); const h = new THREE.Mesh(new THREE.SphereGeometry(.17, 10, 8), toon(0x7a8090)); h.position.set(0, .8, .3); g.add(h); const bk = new THREE.Mesh(new THREE.ConeGeometry(.05, .14, 6), toon(0xe8a030)); bk.rotation.x = Math.PI / 2; bk.position.set(0, .78, .5); g.add(bk);
  const legs = []; for (const sx of [-1, 1]){ const l = new THREE.Mesh(new THREE.BoxGeometry(.05, .25, .05), toon(0xd08a4a)); l.geometry.translate(0, -.12, 0); l.position.set(sx * .1, .25, 0); g.add(l); legs.push(l); } g.userData.legs = legs; scene.add(g); return g; });
// laser au sol
const laser = new THREE.Mesh(new THREE.BoxGeometry(.06, .02, 40), new THREE.MeshBasicMaterial({color: 0xff2020})); scene.add(laser);
// croissant + PV
function croissantT(){ const g = new THREE.Group(); const m = toon(0xd99a3a, {roughness: .4}); for (let i = 0; i < 7; i++){ const a = -1.1 + i * .37; const s = new THREE.Mesh(new THREE.SphereGeometry(.22 + (3 - Math.abs(i - 3)) * .05, 12, 10), m); s.scale.set(1, .8, 1.3); s.position.set(Math.sin(a) * .55, .2, Math.cos(a) * .55 - .4); g.add(s); } scene.add(g); return g; }
const crois = [croissantT(), croissantT(), croissantT(), croissantT()];
const plate = new THREE.Mesh(new THREE.BoxGeometry(6, .2, 1.6), toon(0xf4f1ea)); scene.add(plate);
const pv = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), toon(0xffffff, {map: canvasTex(640, 400, (c) => { c.fillStyle = '#fff6c8'; c.fillRect(0, 0, 640, 400); c.fillStyle = '#c40012'; c.font = '900 60px Inter'; c.textAlign = 'center'; c.fillText('AMENDE', 320, 80); c.fillStyle = '#111'; c.font = '800 40px Inter'; c.fillText('Croissant de travers', 320, 170); c.fillText('(2 degrés)', 320, 225); c.fillStyle = '#c40012'; c.font = '900 80px Inter'; c.fillText('135 €', 320, 340); }), side: THREE.DoubleSide})); scene.add(pv);
// cave + panneau État de droit
const cellar = new THREE.Group(); scene.add(cellar); cellar.position.set(0, 0, 700);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), toon(0x4a4038)); fl.rotation.x = -Math.PI / 2; cellar.add(fl); const w = new THREE.Mesh(new THREE.PlaneGeometry(20, 9), toon(0x5a5048)); w.position.set(0, 4.5, -5); cellar.add(w);
  for (let i = 0; i < 4; i++){ const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.0), toon(0x8a6a44)); b.position.set(-6 + i * 1.4, .5 + (i % 2) * 1.0, -4.2); cellar.add(b); }
  const sign = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, .1), toon(0xffffff, {map: tSign([['ÉTAT DE DROIT', 120, 190], ['à ranger', 70, 320]], '#2b5aa8')})); sign.position.set(1.5, 1.4, -4.3); sign.rotation.set(-.12, -.15, .05); cellar.add(sign);
  const tagS = new THREE.Mesh(new THREE.PlaneGeometry(1.5, .7), toon(0xffffff, {map: tSign([['NI INTANGIBLE', 90, 160, '#111'], ['NI SACRÉ', 110, 310, '#c40012']], '#f4ecd0')})); tagS.position.set(2.6, .55, -4.1); tagS.rotation.z = .1; cellar.add(tagS);
  const bulb = new THREE.PointLight(0xffd08a, 30, 18); bulb.position.set(0, 6, 0); cellar.add(bulb); const bm = new THREE.Mesh(new THREE.SphereGeometry(.15, 10, 8), new THREE.MeshBasicMaterial({color: 0xffe0a0})); bm.position.set(0, 6, 0); cellar.add(bm); }
// mairie qui tient 14 heures
const mairieR = new THREE.Group(); scene.add(mairieR);
{ const b = new THREE.Mesh(new THREE.BoxGeometry(10, 7, 6), toon(0xf1ead8)); b.position.y = 3.5; mairieR.add(b); const s = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.2), toon(0xffffff, {map: tSign([['MAIRIE', 140, 260]], '#1b2a4e')})); s.position.set(0, 6.2, 3.01); mairieR.add(s);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.4), toon(0x5a3a22)); door.position.set(0, 1.7, 3.01); mairieR.add(door);
  const clk = new THREE.Mesh(new THREE.CircleGeometry(.9, 32), toon(0xffffff, {map: canvasTex(256, 256, (c) => { c.fillStyle = '#fff'; c.fillRect(0, 0, 256, 256); c.fillStyle = '#111'; c.font = '900 70px Inter'; c.textAlign = 'center'; c.fillText('14 H', 128, 150); })})); clk.position.set(0, 8.2, 3.01); mairieR.add(clk); const tower = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 2), toon(0xf1ead8)); tower.position.set(0, 8.2, 1.9); mairieR.add(tower);
  const closed = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.6), toon(0xffffff, {map: tSign([['FERMÉ', 150, 180], ['a tenu 14 heures', 70, 310]], '#c40012')})); closed.position.set(0, 2.2, 3.05); closed.rotation.z = -.08; mairieR.add(closed); mairieR.userData.closed = closed; }
// salon + télé Puy du Fou
const salon = new THREE.Group(); scene.add(salon); salon.position.set(0, 0, 800);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), toon(0x8a6a4a)); fl.rotation.x = -Math.PI / 2; salon.add(fl); const w = new THREE.Mesh(new THREE.PlaneGeometry(20, 9), toon(0xd8c8a8)); w.position.set(0, 4.5, -4); salon.add(w);
  const tv = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.6, .3), toon(0x111111)); tv.position.set(0, 2.6, -3.5); salon.add(tv); const stand = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 1), toon(0x5a3a22)); stand.position.set(0, .6, -3.5); salon.add(stand);
  const scr = canvasTex(800, 480, (c) => {}); const scrM = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 2.3), new THREE.MeshBasicMaterial({map: scr})); scrM.position.set(0, 2.6, -3.34); salon.add(scrM); salon.userData.scr = scr;
  const sofa = new THREE.Mesh(new THREE.BoxGeometry(5, 1.1, 1.6), toon(0x7a2a2a)); sofa.position.set(0, .55, 3); salon.add(sofa); const back = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, .4), toon(0x7a2a2a)); back.position.set(0, 1.6, 3.7); salon.add(back); }
function drawTV(t){ const tex = salon.userData.scr, c = tex.image.getContext('2d'); c.fillStyle = '#7ab0e8'; c.fillRect(0, 0, 800, 480); c.fillStyle = '#5a9a3a'; c.fillRect(0, 330, 800, 150);
  c.fillStyle = '#9a9488'; c.fillRect(470, 150, 240, 190); for (let i = 0; i < 5; i++) c.fillRect(470 + i * 50, 125, 30, 30); c.fillRect(520, 70, 70, 90); c.fillStyle = '#5a3a22'; c.fillRect(565, 260, 50, 80);
  for (let k = 0; k < 2; k++){ const x = 100 + k * 220 + Math.sin(t * 3 + k * 3) * 40; c.fillStyle = '#6a3a1a'; c.fillRect(x, 300, 110, 40); c.fillRect(x + 90, 270, 30, 40); c.fillStyle = '#b8bcc4'; c.fillRect(x + 35, 230, 34, 70); c.fillRect(x + 38, 205, 28, 28); c.strokeStyle = '#ddd'; c.lineWidth = 6; c.beginPath(); c.moveTo(x + 70, 250); c.lineTo(x + 150 + (k ? -100 : 0), 200); c.stroke(); c.fillStyle = k ? '#2b5aa8' : '#c40012'; c.fillRect(x + 35, 245, 34, 22); }
  c.fillStyle = 'rgba(0,0,0,.75)'; c.fillRect(0, 410, 800, 70); c.fillStyle = '#fff'; c.font = '900 36px Inter'; c.textAlign = 'left'; c.fillText('JOURNAL DE 20H', 20, 457); c.fillStyle = '#ffcc33'; c.fillText('· SPECTACLE DU PUY DU FOU', 330, 457); tex.needsUpdate = true; }
// panneau file 2027
const sign2027 = new THREE.Group(); scene.add(sign2027); { const pl = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, .1), toon(0xffffff, {map: tSign([['FILE D\'ATTENTE', 100, 170], ['ÉLYSÉE 2027', 120, 320]], '#1b2a4e')})); pl.position.y = 3.6; sign2027.add(pl); const p = new THREE.Mesh(new THREE.BoxGeometry(.14, 3.2, .14), toon(0x555555)); p.position.y = 1.6; sign2027.add(p); }
ALL.push(snow, retail, philippe, gendarme, ordreBan, ...pigs, laser, ...crois, plate, pv, cellar, mairieR, salon, sign2027);
