
// ===================== GLUCKSMANN PARTIE 2 : la ville qui a trop d'énergie =====================
const g2Sign = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 70) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
bakery.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHex() === NAVY){ o.material = o.material.clone(); o.material.color.set(0xd9a050); } });
bakery.traverse(o => { if (o.isMesh && o.material && o.material.map === POSTER_G) o.visible = false; });
// panneau « matcha bar fermé »
const matchaClosed = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.2), toon(0xffffff, {map: g2Sign([['FERMÉ', 140, 180], ['remplacé par du sucre', 70, 320]], '#2a2a2a')})); scene.add(matchaClosed);
// roues de hamster géantes
const wheels = []; for (let i = 0; i < 4; i++){ const g = new THREE.Group(); const rim = toon(0xe64980, {roughness: .35});
  for (const z of [-1.4, 1.4]){ const r = new THREE.Mesh(new THREE.TorusGeometry(4, .22, 10, 48), rim); r.position.z = z; g.add(r); }
  for (let k = 0; k < 24; k++){ const a = k / 24 * Math.PI * 2; const bar = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 2.8, 6), toon(0xdddddd, {metalness: .6})); bar.rotation.x = Math.PI / 2; bar.position.set(Math.cos(a) * 4, Math.sin(a) * 4, 0); g.add(bar); }
  for (let k = 0; k < 8; k++){ const a = k / 8 * Math.PI * 2; const sp = new THREE.Mesh(new THREE.BoxGeometry(.12, 4, .12), toon(0xaaaaaa, {metalness: .5})); sp.geometry.translate(0, 2, 0); sp.rotation.z = a; sp.position.z = 1.4; g.add(sp); const sp2 = sp.clone(); sp2.position.z = -1.4; g.add(sp2); }
  const holder = new THREE.Group(); scene.add(holder); holder.add(g); g.position.y = 4.6; for (const x of [-4.6, 4.6]){ const leg = new THREE.Mesh(new THREE.BoxGeometry(.4, 9.2, .4), toon(0x555555)); leg.position.set(x, 4.6, -1.8); holder.add(leg); } { const top = new THREE.Mesh(new THREE.BoxGeometry(9.6, .4, .4), toon(0x555555)); top.position.set(0, 9.2, -1.8); holder.add(top); }
  const gen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 1.2), toon(0xf1c40f)); gen.position.set(0, .6, 2.6); holder.add(gen); const bolt = new THREE.Mesh(new THREE.PlaneGeometry(.8, .8), new THREE.MeshBasicMaterial({transparent: true, map: canvasTex(128, 128, (c) => { c.fillStyle = '#111'; c.beginPath(); c.moveTo(70, 8); c.lineTo(30, 70); c.lineTo(62, 70); c.lineTo(50, 120); c.lineTo(98, 50); c.lineTo(66, 50); c.closePath(); c.fill(); })})); bolt.position.set(0, .7, 3.21); holder.add(bolt);
  holder.userData.wheel = g; wheels.push(holder); }
// pylônes électriques + câbles
const pylons = new THREE.Group(); scene.add(pylons);
{ const steel = toon(0x8a96a8, {metalness: .6}); for (let i = 0; i < 6; i++){ const p = new THREE.Group(); p.position.set(40 + i * 30, 0, -20 - i * 12); for (const s of [-1, 1]){ const leg = new THREE.Mesh(new THREE.BoxGeometry(.4, 18, .4), steel); leg.position.set(s * 1.8, 9, 0); leg.rotation.z = -s * .1; p.add(leg); }
    for (const y of [12, 16]){ const arm = new THREE.Mesh(new THREE.BoxGeometry(8, .3, .3), steel); arm.position.y = y; p.add(arm); } pylons.add(p); }
  for (let i = 0; i < 5; i++) for (const y of [12, 16]) for (const x of [-3.6, 3.6]){ const a = V(40 + i * 30 + x, y, -20 - i * 12), b = V(70 + i * 30 + x, y, -32 - i * 12); const d = b.clone().sub(a); const w = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, d.length(), 4), toon(0x222222)); w.position.copy(a).add(b).multiplyScalar(.5); w.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); pylons.add(w); } }
// carte de France (lumières) — 2D sur un panneau
const FR = [[.45, .05], [.62, .12], [.78, .18], [.92, .3], [.88, .45], [.84, .58], [.9, .72], [.8, .86], [.62, .9], [.5, .97], [.32, .9], [.2, .8], [.22, .62], [.12, .52], [.06, .4], [.18, .32], [.3, .24], [.38, .14]];
function franceTex(lit){ return canvasTex(800, 900, (c) => { c.fillStyle = '#060a14'; c.fillRect(0, 0, 800, 900); c.beginPath(); FR.forEach(([x, y], i) => { const X = 60 + x * 680, Y = 40 + y * 820; i ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.closePath();
  c.fillStyle = lit ? '#1a2440' : '#0a0e18'; c.fill(); c.strokeStyle = lit ? '#ffd27a' : '#2a3448'; c.lineWidth = 4; c.stroke(); c.save(); c.clip(); const r = rng(9);
  if (lit){ for (let i = 0; i < 900; i++){ const x = 60 + r() * 680, y = 40 + r() * 820; const s = r() < .05 ? 7 : 2 + r() * 2; const g = c.createRadialGradient(x, y, 0, x, y, s * 3); g.addColorStop(0, 'rgba(255,220,140,.95)'); g.addColorStop(1, 'rgba(255,200,100,0)'); c.fillStyle = g; c.fillRect(x - s * 3, y - s * 3, s * 6, s * 6); } }
  c.restore(); c.fillStyle = lit ? '#ffd27a' : '#55607a'; c.font = '900 40px Inter'; c.textAlign = 'center'; c.fillText(lit ? 'FRANCE · 100 % ALIMENTÉE' : 'FRANCE · PANNE GÉNÉRALE', 400, 880); }); }
const frMap = new THREE.Mesh(new THREE.PlaneGeometry(8, 9), new THREE.MeshBasicMaterial({map: franceTex(true)})); scene.add(frMap); const FR_LIT = frMap.material.map, FR_DARK = franceTex(false);
// panneau « rupture de pains au chocolat »
const rupture = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.5), toon(0xffffff, {map: g2Sign([['RUPTURE', 140, 160], ['de pains au chocolat', 70, 300]], '#c0102a')})); scene.add(rupture);
// pyramide de pains au chocolat (petit-déjeuner)
const breakfast = new THREE.Group(); scene.add(breakfast); for (let i = 0; i < 6; i++){ const p = painChoc.clone(); p.position.set((i % 3 - 1) * 1.1, Math.floor(i / 3) * .5, (Math.floor(i / 3)) * .2); p.scale.setScalar(.9); breakfast.add(p); }
ALL.push(matchaClosed, ...wheels, pylons, frMap, rupture, breakfast);
