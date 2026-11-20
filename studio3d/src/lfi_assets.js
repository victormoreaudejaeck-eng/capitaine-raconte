
// ===================== « DANS CETTE VILLE, TOUT LE MONDE VOTE LFI » : assets =====================
const POSTER_LFI = posterTex('LFI', '2027', '#c9462c');
scene.traverse(o => { if (o.isMesh && o.material && (o.material.map === POSTER_M || o.material.map === POSTER)){ o.material = o.material.clone(); o.material.map = POSTER_LFI; } });
cars.forEach(c => { if (c.children[6]) c.children[6].visible = false; });
bakery.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHex() === NAVY){ o.material = o.material.clone(); o.material.color.set(0xd9a050); } });
bakery.traverse(o => { if (o.isMesh && o.material && o.material.map === POSTER_LFI) o.visible = false; }); bakery.userData.breads.forEach(b => b.visible = false);
bigBread.material = bigBread.material.clone(); bigBread.material.color.set(0xd9a050);
const fSign = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 70) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// gymnase « assemblée générale »
const gym = new THREE.Group(); scene.add(gym); gym.position.set(0, 0, 400);
{ const floorT = canvasTex(512, 512, (c) => { c.fillStyle = '#c99a5e'; c.fillRect(0, 0, 512, 512); for (let x = 0; x < 512; x += 16){ c.fillStyle = `rgba(90,50,20,${.08 + Math.random() * .08})`; c.fillRect(x, 0, 2, 512); } c.strokeStyle = '#ffffff'; c.lineWidth = 6; c.strokeRect(40, 40, 432, 432); c.beginPath(); c.arc(256, 256, 70, 0, 7); c.stroke(); c.beginPath(); c.moveTo(40, 256); c.lineTo(472, 256); c.stroke(); });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), toon(0xffffff, {map: floorT, roughness: .4})); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; gym.add(floor);
  const wallM = toon(0xe8e2d4); for (const [w, h, x, z, ry] of [[40, 14, 0, -20, 0], [40, 14, -20, 0, Math.PI / 2], [40, 14, 20, 0, -Math.PI / 2]]){ const wl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallM); wl.position.set(x, h / 2, z); wl.rotation.y = ry; gym.add(wl); }
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.6), toon(0xffffff, {map: fSign([['ASSEMBLÉE GÉNÉRALE', 140, 230], ['ordre du jour : l\'ordre du jour', 60, 340]], '#c9462c')})); ban.position.set(0, 9.5, -19.9); gym.add(ban);
  const clock = new THREE.Group(); clock.position.set(12, 10, -19.85); gym.add(clock); const face = new THREE.Mesh(new THREE.CircleGeometry(1.2, 32), toon(0xffffff)); clock.add(face);
  const hh = new THREE.Mesh(new THREE.BoxGeometry(.12, .7, .05), toon(0x111111)); hh.geometry.translate(0, .35, 0); hh.position.z = .03; clock.add(hh); const mh = new THREE.Mesh(new THREE.BoxGeometry(.08, 1.0, .05), toon(0x111111)); mh.geometry.translate(0, .5, 0); mh.position.z = .04; clock.add(mh); gym.userData.clock = {hh, mh};
  const table = new THREE.Mesh(new THREE.BoxGeometry(8, 1.1, 1.6), toon(0x8a5a3a)); table.position.set(0, .55, -14); gym.add(table);
  const micS = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 1.6), toon(0x222222)); micS.position.set(0, 1.9, -13.5); gym.add(micS);
  const lights = []; for (let i = 0; i < 6; i++){ const l = new THREE.Mesh(new THREE.BoxGeometry(3, .2, .6), new THREE.MeshBasicMaterial({color: 0xfff6dd})); l.position.set(-10 + (i % 3) * 10, 13, -10 + Math.floor(i / 3) * 12); gym.add(l); lights.push(l); } gym.userData.lights = lights;
  const chairs = []; const chairM = toon(0xc9462c); for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++){ const ch = new THREE.Group(); ch.position.set(-11 + c * 2.45, 0, -7 + r * 2.6); const seat = new THREE.Mesh(new THREE.BoxGeometry(1.1, .12, 1.0), chairM); seat.position.y = 1.0; ch.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, .1), chairM); back.position.set(0, 1.5, .48); ch.add(back); for (const sx of [-.45, .45]) for (const sz of [-.4, .4]){ const l = new THREE.Mesh(new THREE.BoxGeometry(.08, 1, .08), toon(0x333333)); l.position.set(sx, .5, sz); ch.add(l); } gym.add(ch); chairs.push(ch); }
  gym.userData.chairs = chairs; }
// feu tricolore (qui ne passe jamais au vert)
function trafficLight(){ const g = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 4.4), toon(0x333333)); pole.position.y = 2.2; g.add(pole); const box = new THREE.Mesh(new THREE.BoxGeometry(.7, 1.9, .6), toon(0x222222)); box.position.y = 5.1; g.add(box);
  const lamps = [0xff2020, 0xffb020, 0x20e060].map((c, i) => { const m = new THREE.Mesh(new THREE.CircleGeometry(.24, 20), new THREE.MeshBasicMaterial({color: i ? 0x222222 : c})); m.position.set(0, 5.7 - i * .6, .31); g.add(m); return m; });
  scene.add(g); return g; }
const tl1 = trafficLight(), tl2 = trafficLight();
const voteBoard = new THREE.Mesh(new THREE.PlaneGeometry(4, 2.4), toon(0xffffff, {map: canvasTex(800, 480, (c) => { c.fillStyle = '#1e2a24'; c.fillRect(0, 0, 800, 480); c.fillStyle = '#fff'; c.font = '700 54px Inter'; c.textAlign = 'center'; c.fillText('VOTE : COULEUR DES FEUX', 400, 80);
  [['ROUGE', 297, '#ff4040'], ['ORANGE', 2, '#ffb020'], ['VERT', 1, '#40e060']].forEach(([l, n, col], i) => { c.fillStyle = col; c.font = '800 60px Inter'; c.textAlign = 'left'; c.fillText(l, 60, 190 + i * 100); c.fillRect(330, 150 + i * 100, n * 1.4 + 6, 50); c.fillStyle = '#fff'; c.fillText(String(n), 360 + n * 1.4, 192 + i * 100); }); })})); scene.add(voteBoard);
// bureau du maire : 300 chaises
const office = new THREE.Group(); scene.add(office); office.position.set(0, 0, 500);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(30, 50), toon(0x9a7a5a)); fl.rotation.x = -Math.PI / 2; office.add(fl); const wm = toon(0xf2ebe0); const back = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wm); back.position.set(0, 5, -25); office.add(back);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.4), toon(0xffffff, {map: fSign([['BUREAU DU MAIRE', 120, 250]], '#2a2a2a')})); sg.position.set(0, 7.5, -24.9); office.add(sg);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.4), toon(0xffffff, {map: canvasTex(96, 64, (c) => { c.fillStyle = '#0055a4'; c.fillRect(0, 0, 32, 64); c.fillStyle = '#fff'; c.fillRect(32, 0, 32, 64); c.fillStyle = '#ef4135'; c.fillRect(64, 0, 32, 64); })})); flag.position.set(-6, 5.5, -24.9); office.add(flag);
  const geo = new THREE.BoxGeometry(.9, .1, .8); const im = new THREE.InstancedMesh(geo, toon(0xc9462c), 300); const back2 = new THREE.InstancedMesh(new THREE.BoxGeometry(.9, .8, .08), toon(0xc9462c), 300); const m4 = new THREE.Matrix4();
  for (let i = 0; i < 300; i++){ const x = -13 + (i % 20) * 1.37, z = -22 + Math.floor(i / 20) * 1.55; m4.makeTranslation(x, .9, z); im.setMatrixAt(i, m4); m4.makeTranslation(x, 1.3, z + .38); back2.setMatrixAt(i, m4); } office.add(im, back2); }
// panneau « croissant soumis au vote », croissant, miettes
const voteSign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), toon(0xffffff, {map: fSign([['CROISSANT', 120, 170], ['soumis au vote', 80, 300]], '#c9462c')})); scene.add(voteSign);
const closedSign = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.4), toon(0xffffff, {map: fSign([['FERMÉ', 150, 200], ['on est en AG', 80, 330]], '#2a2a2a')})); scene.add(closedSign);
function croissantMesh(){ const g = new THREE.Group(); const m = toon(0xd99a3a, {roughness: .4}); for (let i = 0; i < 7; i++){ const a = -1.1 + i * (2.2 / 6); const r = .55 - Math.abs(i - 3) * .1; const s = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m); s.position.set(Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3 + 1.3); s.scale.set(1, .8, 1.15); s.castShadow = true; g.add(s); }
  for (let i = 0; i < 6; i++){ const a = -.95 + i * (1.9 / 5); const st = new THREE.Mesh(new THREE.TorusGeometry(.45 - Math.abs(i - 2.5) * .06, .04, 6, 16), toon(0xa86a20)); st.position.set(Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3 + 1.3); st.rotation.y = a; g.add(st); } scene.add(g); return g; }
const croissant = croissantMesh();
const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 1.9, .15, 32), toon(0xffffff, {roughness: .3})); scene.add(plate);
const crumbs = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.18, 0), toon(0xd99a3a), 300); scene.add(crumbs);
const crumb = new THREE.Mesh(new THREE.DodecahedronGeometry(.07, 0), toon(0xd99a3a)); scene.add(crumb);
const knife = new THREE.Group(); scene.add(knife); { const bl = new THREE.Mesh(new THREE.BoxGeometry(2.2, .05, .3), toon(0xd0d4d8, {metalness: .9, roughness: .2})); bl.position.x = 1.1; knife.add(bl); const hd = new THREE.Mesh(new THREE.BoxGeometry(1.0, .16, .22), toon(0x3a2a1a)); hd.position.x = -.5; knife.add(hd); }
ALL.push(gym, tl1, tl2, voteBoard, office, voteSign, closedSign, croissant, plate, crumbs, crumb, knife);
function fLook(){ townLook(); }
