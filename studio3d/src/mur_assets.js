
// ===================== Dans cette ville, un mur : moitié LFI, moitié RN =====================
const mSign2 = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.textAlign = 'center'; lines.forEach(([t, sz, y, col]) => { c.fillStyle = col || fg; c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 60) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
const WALL_TEX = canvasTex(512, 256, (c) => { c.fillStyle = '#9a9a94'; c.fillRect(0, 0, 512, 256); c.strokeStyle = '#7d7d78'; c.lineWidth = 4; for (let y = 0; y < 256; y += 32){ c.beginPath(); c.moveTo(0, y); c.lineTo(512, y); c.stroke(); for (let x = (y / 32) % 2 ? 0 : 32; x < 512; x += 64){ c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 32); c.stroke(); } } }); WALL_TEX.wrapS = WALL_TEX.wrapT = THREE.RepeatWrapping;
const wall = new THREE.Group(); scene.add(wall); { const t = WALL_TEX.clone(); t.needsUpdate = true; t.repeat.set(20, 1); const m = new THREE.Mesh(new THREE.BoxGeometry(.8, 1, 160), toon(0xffffff, {map: t})); m.position.y = .5; wall.add(m); wall.userData.m = m; }
function wallH(h){ wall.userData.m.scale.y = h; wall.userData.m.position.y = h / 2; }
// bannières des deux camps
const banL1 = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.6), toon(0xffffff, {map: mSign2([['VILLE LFI', 130, 170], ['VIe RÉPUBLIQUE · SMIC 1 600 €', 56, 310]], '#c2273d'), side: THREE.DoubleSide})); scene.add(banL1);
const banR1 = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.6), toon(0xffffff, {map: mSign2([['VILLE RN', 130, 170], ['TVA ÉNERGIE 5,5 % · ON EST CHEZ NOUS', 50, 310]], '#1f3d7a'), side: THREE.DoubleSide})); scene.add(banR1);
// AG côté LFI
const agSign = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.3), toon(0xffffff, {map: mSign2([['AG : CHOIX DE LA BAGUETTE', 70, 160], ['jour 3', 90, 300, '#ffcc33']], '#7a1f2a')})); scene.add(agSign);
// croissant interdit côté RN
const banCroissant = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.6), toon(0xffffff, {map: mSign2([['CROISSANT INTERDIT', 90, 170], ['(il est autrichien)', 60, 300, '#ffcc33']], '#1f3d7a')})); scene.add(banCroissant);
// haut-parleurs
function speaker(col){ const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 6, 8), toon(0x444444)); p.position.y = 3; g.add(p); const h = new THREE.Mesh(new THREE.ConeGeometry(.9, 1.6, 20, 1, true), toon(col, {side: THREE.DoubleSide})); h.rotation.z = Math.PI / 2; h.position.set(0, 6, 0); g.add(h); scene.add(g); return g; }
const spkL = speaker(0xc2273d), spkR = speaker(0x1f3d7a);
const blameL = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.2), toon(0xffffff, {map: mSign2([['IL PLEUT ?', 100, 150], ['C\'EST LA FAUTE DE LFI !', 60, 300]], '#1f3d7a')})); scene.add(blameL);
const blameR = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.2), toon(0xffffff, {map: mSign2([['UN NID-DE-POULE ?', 80, 150], ['C\'EST LA FAUTE DU RN !', 60, 300]], '#c2273d')})); scene.add(blameR);
// nuage de pluie + nid-de-poule
const rainCloud = new THREE.Group(); scene.add(rainCloud); { for (let i = 0; i < 5; i++){ const s = new THREE.Mesh(new THREE.SphereGeometry(1 + (i % 2) * .4, 14, 10), toon(0x7a8590)); s.position.set(-2 + i, (i % 2) * .4, 0); rainCloud.add(s); } const drops = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({color: 0x9fc8ff, size: .12})); const a = new Float32Array(300 * 3); for (let i = 0; i < 300; i++){ a[i * 3] = (Math.random() - .5) * 5; a[i * 3 + 1] = -Math.random() * 7; a[i * 3 + 2] = (Math.random() - .5) * 2; } drops.geometry.setAttribute('position', new THREE.BufferAttribute(a, 3)); rainCloud.add(drops); rainCloud.userData.drops = drops; rainCloud.userData.a0 = a.slice(); }
function rainAt(t){ const d = rainCloud.userData.drops, a = d.geometry.attributes.position.array, a0 = rainCloud.userData.a0; for (let i = 1; i < a.length; i += 3) a[i] = -(((-a0[i]) + t * 6) % 7); d.geometry.attributes.position.needsUpdate = true; }
const pothole = new THREE.Mesh(new THREE.CircleGeometry(1.1, 24), toon(0x2a2a2a)); pothole.rotation.x = -Math.PI / 2; scene.add(pothole);
// boulangerie sur la frontière
const borderBakery = new THREE.Group(); scene.add(borderBakery);
{ const b = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 6), toon(0xfff3dc)); b.position.y = 3; borderBakery.add(b); const half = new THREE.Mesh(new THREE.PlaneGeometry(4, 6), toon(0xf6d0d4)); half.position.set(-2, 3, 3.01); borderBakery.add(half); const half2 = new THREE.Mesh(new THREE.PlaneGeometry(4, 6), toon(0xd0dcf6)); half2.position.set(2, 3, 3.01); borderBakery.add(half2);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.3), toon(0xffffff, {map: mSign2([['BOULANGERIE DE LA FRONTIÈRE', 70, 170], ['ouverte à tous', 60, 300, '#ffcc33']], '#5a3a22')})); s.position.set(0, 5.1, 3.03); borderBakery.add(s); const d = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 3), toon(0x5a3a22)); d.position.set(0, 1.5, 3.03); borderBakery.add(d); }
ALL.push(wall, banL1, banR1, agSign, banCroissant, spkL, spkR, blameL, blameR, rainCloud, pothole, borderBakery);
