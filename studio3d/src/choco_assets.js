
// ===================== "DANS CETTE VILLE, ON DIT CHOCOLATINE" : assets =====================
function chocoMesh(scale = 1){ const g = new THREE.Group(); const s = new THREE.Shape(); const w = .8, h = .32, r = .28;
  s.moveTo(-w + r, -h); s.lineTo(w - r, -h); s.quadraticCurveTo(w, -h, w, -h + r * .8); s.lineTo(w, h - r * .8); s.quadraticCurveTo(w, h, w - r, h + .06); s.lineTo(-w + r, h + .06); s.quadraticCurveTo(-w, h, -w, h - r * .8); s.lineTo(-w, -h + r * .8); s.quadraticCurveTo(-w, -h, -w + r, -h);
  const geo = new THREE.ExtrudeGeometry(s, {depth: .9, bevelEnabled: true, bevelThickness: .14, bevelSize: .12, bevelSegments: 4, curveSegments: 10}); geo.translate(0, 0, -.45);
  const body = new THREE.Mesh(geo, toon(0xd8963a, {roughness: .45})); body.castShadow = true; g.add(body);
  const glaze = new THREE.Mesh(new THREE.BoxGeometry(1.5, .05, 1.0), toon(0xb8701e, {roughness: .3})); glaze.position.y = .43; g.add(glaze);
  for (const x of [-.36, .36]){ const st = new THREE.Mesh(new THREE.BoxGeometry(.16, .14, 1.42), toon(0x3a1c0e, {roughness: .4})); st.position.set(x, .02, 0); g.add(st); }
  g.scale.setScalar(scale); return g; }
const signFit = (lines, bg, fg = '#fff', w = 1024, h = 512) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.strokeStyle = fg; c.lineWidth = 12; c.strokeRect(16, 16, w - 32, h - 32); c.fillStyle = fg; c.textAlign = 'center';
  lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 90) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// entrance board + detector screens re-skinned
border.traverse(o => { if (o.isMesh && o.geometry.parameters && o.geometry.parameters.width === 8.4){ o.material = o.material.clone(); o.material.map = signFit([['BIENVENUE', 110, 170], ['ICI ON DIT', 100, 300], ['CHOCOLATINE', 130, 440], ['« pain au… » = 135 € d\'amende', 52, 570], ['Merci de votre compréhension', 44, 660]], '#8a4a1e', '#fff4d6', 1024, 780); } });
{ const c = detScreenALARM.image, x = c.getContext('2d'); x.fillStyle = '#c40012'; x.fillRect(0, 0, 512, 512); x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = '900 70px Inter'; x.fillText('PAIN AU', 256, 210); x.fillText('CHOCOLAT', 256, 300); x.font = '900 60px Inter'; x.fillText('DÉTECTÉ', 256, 400); detScreenALARM.needsUpdate = true; }
// roundabout with giant golden chocolatine statue at the crossroads
const statue = new THREE.Group(); scene.add(statue); statue.position.set(0, 0, -40);
{ const isle = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.8, .4, 48), toon(0xbdb7ab)); isle.position.y = .2; isle.receiveShadow = true; statue.add(isle);
  const lawn = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, .44, 48), toon(0x6cc04a)); lawn.position.y = .22; statue.add(lawn);
  for (let i = 0; i < 14; i++){ const a = i / 14 * Math.PI * 2; const f = new THREE.Mesh(new THREE.SphereGeometry(.28, 8, 6), toon([0xff5d73, 0xffc93c, 0xffffff][i % 3])); f.position.set(Math.cos(a) * 3.7, .55, Math.sin(a) * 3.7); statue.add(f); }
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.4, 2.6), toon(0xeee6d8)); plinth.position.y = 1.6; plinth.castShadow = true; statue.add(plinth);
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(2.2, .8), toon(0xffffff, {map: signFit([['CHOCOLATINE', 120, 150], ['éternelle', 70, 250]], '#2a2a2a', '#f2c94c', 1024, 320)})); plaque.position.set(0, 1.7, 1.31); statue.add(plaque);
  const big = chocoMesh(3.2); big.position.y = 4.3; big.rotation.y = .5; statue.add(big); statue.userData.big = big;
  big.traverse(o => { if (o.isMesh && o.material.color.getHex() === 0xd8963a){ o.material = toon(0xf0c040, {metalness: .35, roughness: .3, emissive: 0x4a3000}); } }); }
// GPS screen
const gps = new THREE.Group(); scene.add(gps);
const gpsTex = canvasTex(720, 1100, (c) => { c.fillStyle = '#e8eef0'; c.fillRect(0, 0, 720, 1100); c.strokeStyle = '#ffffff'; c.lineWidth = 46; c.beginPath(); c.moveTo(360, 1100); c.lineTo(360, 560); c.lineTo(620, 380); c.stroke(); c.beginPath(); c.moveTo(0, 560); c.lineTo(720, 560); c.stroke();
  c.strokeStyle = '#2f80ed'; c.lineWidth = 26; c.beginPath(); c.moveTo(360, 1100); c.lineTo(360, 560); c.lineTo(600, 393); c.stroke();
  c.fillStyle = '#d8963a'; c.beginPath(); c.roundRect(540, 300, 140, 76, 30); c.fill(); c.fillStyle = '#3a1c0e'; c.fillRect(570, 300, 16, 76); c.fillRect(634, 300, 16, 76);
  c.fillStyle = '#1e7a46'; c.fillRect(0, 0, 720, 270); c.fillStyle = '#fff'; c.font = '900 120px Inter'; c.textAlign = 'left'; c.fillText('↱', 36, 170); c.font = '800 54px Inter'; c.fillText('Dans 200 m,', 190, 100); c.fillText('tournez à la', 190, 165); c.font = '900 62px Inter'; c.fillText('CHOCOLATINE', 190, 238);
  c.fillStyle = '#fff'; c.fillRect(0, 980, 720, 120); c.fillStyle = '#222'; c.font = '800 46px Inter'; c.fillText('Arrivée 12:04 · 1,2 km', 40, 1056); });
{ const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.3, .14), toon(0x1a1a1a, {roughness: .3})); gps.add(body); const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 2.08), new THREE.MeshBasicMaterial({map: gpsTex})); scr.position.z = .075; gps.add(scr);
  const mount = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .8), toon(0x222222)); mount.position.set(0, -1.4, -.2); mount.rotation.x = .5; gps.add(mount);
  const dash = new THREE.Mesh(new THREE.BoxGeometry(8, .6, 3), toon(0x2a2d33, {roughness: .8})); dash.position.set(0, -1.9, -.4); gps.add(dash); }
// brigade patrol car with a chocolatine on the roof
const patrol = new THREE.Group(); scene.add(patrol);
{ const livery = canvasTex(512, 128, (c) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, 512, 128); c.fillStyle = '#1f3d7a'; c.fillRect(0, 70, 512, 40); c.fillStyle = '#d8963a'; c.fillRect(0, 60, 512, 10); c.fillStyle = '#1f3d7a'; c.font = '900 40px Inter'; c.textAlign = 'center'; c.fillText('BRIGADE DES VIENNOISERIES', 256, 48); });
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.1, 4.6), [toon(0xffffff, {map: livery}), toon(0xffffff, {map: livery}), toon(0xffffff), toon(0x222222), toon(0xffffff), toon(0xffffff)]); body.position.y = .95; body.castShadow = true; patrol.add(body);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.0, .9, 2.4), toon(0xffffff)); cab.position.set(0, 1.9, -.2); patrol.add(cab);
  const win = new THREE.Mesh(new THREE.BoxGeometry(2.05, .6, 2.2), toon(0x24313f, {roughness: .05})); win.position.set(0, 1.95, -.2); patrol.add(win);
  for (const [x, z] of [[-1.15, 1.5], [1.15, 1.5], [-1.15, -1.5], [1.15, -1.5]]){ const w = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .3, 16), toon(0x111111)); w.rotation.z = Math.PI / 2; w.position.set(x, .42, z); patrol.add(w); }
  const sirB = new THREE.MeshBasicMaterial({color: 0x0033ff}), sirR = new THREE.MeshBasicMaterial({color: 0xff0010}); const sb = new THREE.Mesh(new THREE.BoxGeometry(.5, .22, .4), sirB); sb.position.set(-.35, 2.46, .6); patrol.add(sb); const sr = new THREE.Mesh(new THREE.BoxGeometry(.5, .22, .4), sirR); sr.position.set(.35, 2.46, .6); patrol.add(sr);
  const roof = chocoMesh(1.1); roof.position.set(0, 2.85, -.5); roof.rotation.y = Math.PI / 2; patrol.add(roof);
  patrol.userData = {sirB, sirR}; }
function siren(t){ const on = Math.sin(t * 16) > 0; patrol.userData.sirB.color.set(on ? 0x2a5aff : 0x061a55); patrol.userData.sirR.color.set(on ? 0x550008 : 0xff1a2a); }
// radar gun
const radar = new THREE.Group(); scene.add(radar);
{ const b = new THREE.Mesh(new THREE.BoxGeometry(.32, .32, .9), toon(0x333a44)); radar.add(b); const n = new THREE.Mesh(new THREE.CylinderGeometry(.2, .14, .3, 14), toon(0x222222)); n.rotation.x = Math.PI / 2; n.position.z = .55; radar.add(n);
  const h = new THREE.Mesh(new THREE.BoxGeometry(.18, .5, .2), toon(0x222222)); h.position.set(0, -.35, -.2); radar.add(h);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(.3, .2), new THREE.MeshBasicMaterial({map: signFit([['0 PAC', 200, 330]], '#0a3a14', '#7dff7d', 600, 420)})); sc.position.set(0, .1, -.46); sc.rotation.y = Math.PI; radar.add(sc); }
// bakery re-dressed: golden breads -> chocolatine tray, sign
bakery.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHex() === NAVY){ o.material = o.material.clone(); o.material.color.set(0xd9a050); } });
bakery.traverse(o => { if (o.isMesh && o.material && (o.material.map === POSTER)) o.visible = false; });
bakery.userData.breads.forEach(b => b.visible = false);
const trayChocos = []; for (let i = 0; i < 8; i++){ const c = chocoMesh(.42); c.position.set(-3 + i * .85, 1.45, 5.2); c.rotation.y = (i % 2) * .3; bakery.add(c); trayChocos.push(c); }
// paper bag from the other town
const bag = new THREE.Group(); scene.add(bag);
{ const bt = canvasTex(400, 560, (c) => { c.fillStyle = '#c99a62'; c.fillRect(0, 0, 400, 560); for (let i = 0; i < 400; i++){ c.fillStyle = `rgba(90,60,30,${Math.random() * .08})`; c.fillRect(Math.random() * 400, Math.random() * 560, 3, 3); }
    c.fillStyle = '#3a1c0e'; c.textAlign = 'center'; c.font = '900 64px Inter'; c.fillText('PAIN AU', 200, 230); c.fillText('CHOCOLAT', 200, 305); c.font = '700 26px Inter'; c.fillText('Boulangerie de', 200, 390); c.fillText('la ville d\'à côté', 200, 424);
    c.fillStyle = '#c40012'; c.font = '900 40px Inter'; c.fillText('♥', 200, 140); c.fillStyle = 'rgba(0,0,0,.15)'; for (let x = 0; x < 400; x += 22){ c.fillRect(x, 0, 2, 26); } });
  const b = new THREE.Mesh(new THREE.BoxGeometry(.9, 1.25, .45), [toon(0xc99a62), toon(0xc99a62), toon(0xc99a62), toon(0xc99a62), toon(0xffffff, {map: bt}), toon(0xc99a62)]); bag.add(b);
  const fold = new THREE.Mesh(new THREE.BoxGeometry(.92, .12, .47), toon(0xb8894f)); fold.position.y = .62; bag.add(fold); }
// war-room map
const warMap = new THREE.Group(); scene.add(warMap);
{ const mt = canvasTex(1024, 1024, (c) => { c.fillStyle = '#e9dcb8'; c.fillRect(0, 0, 1024, 1024); c.fillStyle = '#7fb6d8'; c.beginPath(); c.moveTo(430, 0); c.bezierCurveTo(560, 300, 380, 600, 560, 1024); c.lineTo(640, 1024); c.bezierCurveTo(470, 600, 650, 300, 520, 0); c.fill();
    c.fillStyle = '#3a2a1a'; c.font = '900 52px Inter'; c.textAlign = 'center'; c.fillText('CHOCOLATINE', 220, 120); c.fillText('PAIN AU', 820, 100); c.fillText('CHOCOLAT', 820, 155);
    c.strokeStyle = '#c40012'; c.lineWidth = 16; c.lineCap = 'round'; for (const [x1, y1, x2, y2] of [[260, 400, 470, 480], [790, 640, 600, 560], [250, 700, 470, 760]]){ c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); const a = Math.atan2(y2 - y1, x2 - x1); c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - 40 * Math.cos(a - .5), y2 - 40 * Math.sin(a - .5)); c.moveTo(x2, y2); c.lineTo(x2 - 40 * Math.cos(a + .5), y2 - 40 * Math.sin(a + .5)); c.stroke(); }
    c.strokeStyle = 'rgba(58,42,26,.3)'; c.lineWidth = 3; for (let i = 0; i < 1024; i += 128){ c.beginPath(); c.moveTo(i, 0); c.lineTo(i, 1024); c.moveTo(0, i); c.lineTo(1024, i); c.stroke(); } });
  const table = new THREE.Mesh(new THREE.BoxGeometry(7, .3, 7), toon(0x6a4428)); table.position.y = 2.2; warMap.add(table);
  const map = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), toon(0xffffff, {map: mt})); map.rotation.x = -Math.PI / 2; map.position.y = 2.36; warMap.add(map);
  for (let i = 0; i < 5; i++){ const a = chocoMesh(.28); a.position.set(-2.2 + (i % 2) * .6, 2.5, -1.2 + i * .7); warMap.add(a); }
  for (let i = 0; i < 5; i++){ const a = new THREE.Mesh(new THREE.BoxGeometry(.45, .2, .3), toon(0xc8862a)); a.position.set(2.0 + (i % 2) * .6, 2.48, -1.4 + i * .7); warMap.add(a); const st = new THREE.Mesh(new THREE.BoxGeometry(.08, .21, .31), toon(0x3a1c0e)); st.position.copy(a.position); warMap.add(st); }
  const lamp = new THREE.PointLight(0xffd9a0, 6, 14, 1.4); lamp.position.set(0, 6, 0); warMap.add(lamp); }
// two toy boats for the naval tease
function toyBoat(label, col){ const g = new THREE.Group(); const hull = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 8), toon(col)); hull.position.y = .3; g.add(hull);
  const bow = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.6, 4), toon(col)); bow.rotation.x = Math.PI / 2; bow.rotation.y = Math.PI / 4; bow.position.set(0, .3, 5.2); g.add(bow);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 7), toon(0x5a3a1a)); mast.position.y = 4; g.add(mast);
  const sail = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.2), toon(0xffffff, {side: THREE.DoubleSide, map: signFit([[label, 120, 300]], '#fff8e8', '#3a1c0e', 1024, 560)})); sail.position.set(0, 4.6, .2); sail.rotation.y = Math.PI / 2; g.add(sail);
  const fig = chocoMesh(.9); fig.position.set(0, 1.4, 5.2); g.add(fig); scene.add(g); return g; }
const boatA = toyBoat('CHOCOLATINE', 0x1f3d7a), boatB = toyBoat('PAIN AU CHOCOLAT', 0x8a1f2a);
// berets for the locals
folk.forEach((p, i) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(.72, .72, .18, 20), toon(0x1a1a1a)); b.position.set(.08, 4.25, 0); b.rotation.z = .12; p.add(b); const tip = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .14), toon(0x1a1a1a)); tip.position.set(.08, 4.38, 0); p.add(tip); });
ALL.push(statue, gps, patrol, radar, bag, warMap, boatA, boatB);
function cLook(){ pLook(); renderer.toneMappingExposure = .95; }
