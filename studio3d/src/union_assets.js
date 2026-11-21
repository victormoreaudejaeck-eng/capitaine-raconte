
// ===================== GLUCKSMANN PARTIE 2 : L'UNION DE LA GAUCHE =====================
const uSign = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 70) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// salle du sommet
const summit = new THREE.Group(); scene.add(summit); summit.position.set(0, 0, 450);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), toon(0xb8a888)); fl.rotation.x = -Math.PI / 2; summit.add(fl); const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), toon(0xe8e2d4)); wall.position.set(0, 6, -12); summit.add(wall);
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.4), toon(0xffffff, {map: uSign([["SOMMET DE L'UNION DE LA GAUCHE", 100, 170], ['jour 3 · toujours pas de table', 60, 310]], '#e64980')})); ban.position.set(0, 9, -11.9); summit.add(ban);
  const round = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, .3, 40), toon(0x8a5a3a)); round.position.set(-6, 1.6, 0); summit.add(round); const rl = new THREE.Mesh(new THREE.CylinderGeometry(.3, .5, 1.5, 12), toon(0x5a3a22)); rl.position.set(-6, .75, 0); summit.add(rl);
  const sq = new THREE.Mesh(new THREE.BoxGeometry(6, .3, 6), toon(0x6a4428)); sq.position.set(6, 1.6, 0); summit.add(sq); for (const [x, z] of [[-2.6, -2.6], [2.6, -2.6], [-2.6, 2.6], [2.6, 2.6]]){ const l = new THREE.Mesh(new THREE.BoxGeometry(.3, 1.5, .3), toon(0x4a2e18)); l.position.set(6 + x, .75, z); summit.add(l); }
  const tagR = new THREE.Mesh(new THREE.PlaneGeometry(2.6, .7), toon(0xffffff, {map: uSign([['TABLE RONDE', 120, 250]], '#e64980')})); tagR.position.set(-6, 3.6, -3.4); summit.add(tagR);
  const tagS = new THREE.Mesh(new THREE.PlaneGeometry(2.6, .7), toon(0xffffff, {map: uSign([['TABLE CARRÉE', 120, 250]], '#c2273d')})); tagS.position.set(6, 3.6, -3.4); summit.add(tagS);
  const clock = new THREE.Group(); clock.position.set(14, 8, -11.85); summit.add(clock); clock.add(new THREE.Mesh(new THREE.CircleGeometry(1.2, 32), toon(0xffffff))); const mh = new THREE.Mesh(new THREE.BoxGeometry(.08, 1, .05), toon(0x111111)); mh.geometry.translate(0, .5, 0); mh.position.z = .04; clock.add(mh); summit.userData.mh = mh; }
// porte de la commission
const commission = new THREE.Group(); scene.add(commission); commission.position.set(0, 0, 520);
{ const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), toon(0xe8e2d4)); wall.position.y = 4; commission.add(wall); const door = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 4.4), toon(0x6a4428)); door.position.set(0, 2.2, .02); commission.add(door);
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 1.6), toon(0xffffff, {map: uSign([['COMMISSION', 120, 140], ['POUR CRÉER', 90, 250], ['LA COMMISSION', 90, 350]], '#2a2a2a')})); pl.position.set(0, 5.6, .03); commission.add(pl);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), toon(0x9a8a6a)); fl.rotation.x = -Math.PI / 2; fl.position.z = 5; commission.add(fl); }
// pancartes des unions
const unions = [['UNION DE LA GAUCHE', 'version Glucksmann', '#e64980'], ['UNION DE LA GAUCHE', 'version LFI', '#c2273d'], ['UNION DES UNIONS', 'DE LA GAUCHE', '#8e44ad']].map(([a, b, col]) => { const g = new THREE.Group(); const pl = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2, .1), toon(0xffffff, {map: uSign([[a, 110, 170], [b, 80, 300]], col)})); pl.position.y = 3.6; g.add(pl); for (const x of [-1.6, 1.6]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.12, 3, .12), toon(0x555555)); p.position.set(x, 1.5, -.08); g.add(p); } scene.add(g); return g; });
// tableau des résultats de l'élection
const elect = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), toon(0xffffff, {map: canvasTex(1000, 600, (c) => { c.fillStyle = '#16213e'; c.fillRect(0, 0, 1000, 600); c.fillStyle = '#fff'; c.font = '900 64px Inter'; c.textAlign = 'center'; c.fillText('RÉSULTATS DE L\'ÉLECTION', 500, 90);
  const rows = [['RN', 51, '#1f3d7a'], ['UNION GLUCKSMANN', 12, '#e64980'], ['UNION LFI', 12, '#c2273d'], ['UNION DES UNIONS', 11, '#8e44ad'], ['AUTRES UNIONS', 14, '#7f8c8d']];
  rows.forEach(([n, v, col], i) => { const y = 160 + i * 88; c.fillStyle = col; c.fillRect(380, y, v * 9, 56); c.fillStyle = '#fff'; c.textAlign = 'right'; c.font = '800 34px Inter'; c.fillText(n, 370, y + 42); c.textAlign = 'left'; c.fillText(v + ' %', 390 + v * 9, y + 42); }); })})); scene.add(elect);
ALL.push(summit, commission, ...unions, elect);
