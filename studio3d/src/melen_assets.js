
// ===================== "DANS CETTE VILLE, TOUT LE MONDE VOTE MÉLENCHON" : assets =====================
// re-skin the town: campaign posters turn red, car stickers hidden
scene.traverse(o => { if (o.isMesh && o.material && o.material.map === POSTER){ o.material = o.material.clone(); o.material.map = POSTER_M; } });
cars.forEach(c => { if (c.children[6]) c.children[6].visible = false; });
const mSign = (lines, bg = '#c2273d', fg = '#ffffff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// tax office
const taxOffice = new THREE.Group(); scene.add(taxOffice); taxOffice.position.set(0, 0, -56);
{ const b = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 8), toon(0xe9e2d6)); b.position.y = 4; b.castShadow = true; taxOffice.add(b);
  for (let i = 0; i < 4; i++){ const col = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, 6), toon(0xffffff)); col.position.set(-4.5 + i * 3, 3, 4.4); taxOffice.add(col); }
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.6), toon(0xffffff, {map: mSign([['CENTRE DES IMPÔTS', 120, 250]], '#2a2a2a')})); sign.position.set(0, 7, 4.05); taxOffice.add(sign);
  const ban = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.2), toon(0xffffff, {map: mSign([['ICI, LES RICHES PAIENT', 90, 240]])})); ban.position.set(0, 5.6, 4.06); taxOffice.add(ban); }
// mayor podium
const podium = new THREE.Group(); scene.add(podium); podium.position.set(0, 0, -14);
{ const stage = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 4), toon(0x8a1f2a)); stage.position.y = .5; stage.castShadow = true; podium.add(stage);
  const lect = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, .8), toon(0x6a3a20)); lect.position.set(0, 1.8, .8); podium.add(lect);
  const mic = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .6), toon(0x222222)); mic.position.set(0, 2.9, 1); mic.rotation.x = -.5; podium.add(mic);
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 1.6), toon(0xffffff, {map: mSign([['MAIRIE', 120, 250]])})); banner.position.set(0, 5.2, -1.6); podium.add(banner);
  for (const sx of [-1, 1]){ const p = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 5), toon(0x444444)); p.position.set(sx * 3.8, 3.2, -1.6); podium.add(p); } }
// yacht on a trailer with "À VENDRE"
const yacht = new THREE.Group(); scene.add(yacht);
{ const hull = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 10), toon(0xffffff, {roughness: .2})); hull.position.y = 2.2; hull.scale.x = 1; yacht.add(hull);
  const bow = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 4), toon(0xffffff, {roughness: .2})); bow.rotation.x = Math.PI / 2; bow.rotation.y = Math.PI / 4; bow.position.set(0, 2.2, 6.4); yacht.add(bow);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 4), toon(0xdfe9f2)); cab.position.set(0, 3.7, -1); yacht.add(cab);
  const win = new THREE.Mesh(new THREE.BoxGeometry(2.45, .5, 3.6), toon(0x1a2a3a, {roughness: .05})); win.position.set(0, 3.9, -1); yacht.add(win);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.05, .25, 10.05), toon(0xc8a020, {metalness: .6})); stripe.position.y = 2.4; yacht.add(stripe);
  const trailer = new THREE.Mesh(new THREE.BoxGeometry(2.6, .4, 9), toon(0x333333)); trailer.position.y = .9; yacht.add(trailer);
  for (const z of [-3, 3]) for (const sx of [-1, 1]){ const w = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .4, 14), toon(0x111111)); w.rotation.z = Math.PI / 2; w.position.set(sx * 1.4, .5, z); yacht.add(w); }
  const sale = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), toon(0xffffff, {map: mSign([['À VENDRE', 140, 230], ['PRIX CASSÉ', 70, 340]], '#ffd400', '#111111')})); sale.position.set(1.56, 2.3, 0); sale.rotation.y = Math.PI / 2; yacht.add(sale); }
// watches
function watch(face){ const g = new THREE.Group(); const ring = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .15, 32), toon(0xd4af37, {metalness: .9, roughness: .25})); ring.rotation.x = Math.PI / 2; g.add(ring);
  const f = new THREE.Mesh(new THREE.CircleGeometry(.42, 32), toon(0xffffff, {map: canvasTex(256, 256, (c) => { c.fillStyle = face; c.fillRect(0, 0, 256, 256); c.strokeStyle = '#222'; c.lineWidth = 6; for (let i = 0; i < 12; i++){ const a = i / 12 * Math.PI * 2; c.beginPath(); c.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); c.lineTo(128 + Math.cos(a) * 115, 128 + Math.sin(a) * 115); c.stroke(); } c.lineWidth = 8; c.beginPath(); c.moveTo(128, 128); c.lineTo(128, 60); c.moveTo(128, 128); c.lineTo(180, 128); c.stroke(); })}));
  f.position.z = .08; g.add(f); const strap = new THREE.Mesh(new THREE.BoxGeometry(.4, 1.8, .06), toon(0x3a2a1a)); strap.position.z = -.05; g.add(strap); scene.add(g); return g; }
const watchA = watch('#f6f1e2'), watchB = watch('#1a2a4a');
const tag = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .7), toon(0xffffff, {map: mSign([['VENDU', 150, 260]], '#c40012'), transparent: true})); scene.add(tag);
// soup kitchen
const soup = new THREE.Group(); scene.add(soup); soup.position.set(6.5, 0, 26); soup.rotation.y = -Math.PI / 2;
{ const stand = new THREE.Mesh(new THREE.BoxGeometry(6, 1.2, 1.6), toon(0x8a5a3a)); stand.position.y = .6; stand.castShadow = true; soup.add(stand);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(6.6, .2, 2.6), toon(0xffffff, {map: canvasTex(256, 32, (c) => { for (let i = 0; i < 8; i++){ c.fillStyle = i % 2 ? '#c2273d' : '#ffffff'; c.fillRect(i * 32, 0, 32, 32); } })})); roof.position.set(0, 3.4, 0); soup.add(roof);
  for (const sx of [-1, 1]){ const p = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 3.4), toon(0x666666)); p.position.set(sx * 3, 1.7, .9); soup.add(p); }
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(5, 1), toon(0xffffff, {map: mSign([['SOUPE POPULAIRE', 110, 250]], '#2a6a3a')})); sign.position.set(0, 2.9, 1.25); soup.add(sign);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.6, .5, .8, 18), toon(0x9aa0a6, {metalness: .7})); pot.position.set(-1.2, 1.6, 0); soup.add(pot);
  const steam = new THREE.Group(); soup.add(steam); steam.position.set(-1.2, 2.1, 0); soup.userData.steam = steam;
  for (let i = 0; i < 6; i++){ const s = new THREE.Mesh(new THREE.SphereGeometry(.25, 10, 8), toon(0xffffff, {transparent: true, opacity: .5})); steam.add(s); } }
// shopping-cart bus
const caddie = new THREE.Group(); scene.add(caddie);
{ const wire = toon(0xb8c0c8, {metalness: .8, roughness: .3, wireframe: false});
  const basket = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 4), toon(0xb8c0c8, {metalness: .8, roughness: .3, transparent: true, opacity: .35})); basket.position.y = 1.8; caddie.add(basket);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 1.6, 4, 4, 3, 6)), new THREE.LineBasicMaterial({color: 0x8a949e})); edges.position.y = 1.8; caddie.add(edges);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 2.6), toon(0xc2273d)); handle.rotation.z = Math.PI / 2; handle.position.set(0, 2.9, -2.3); caddie.add(handle);
  for (const [x, z] of [[-1, 1.7], [1, 1.7], [-1, -1.7], [1, -1.7]]){ const w = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .15, 12), toon(0x222222)); w.rotation.z = Math.PI / 2; w.position.set(x, .25, z); caddie.add(w); }
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.8, .7), toon(0xffffff, {map: mSign([['BUS N°1', 130, 250]], '#1a4a9a')})); sg.position.set(0, 3.0, 2.05); caddie.add(sg); }
// lottery ticket
const ticket = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .9), toon(0xffffff, {map: canvasTex(640, 360, (c) => { const g = c.createLinearGradient(0, 0, 640, 360); g.addColorStop(0, '#ffd400'); g.addColorStop(1, '#ff7a00'); c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  c.fillStyle = '#c40012'; c.font = '900 64px Inter'; c.textAlign = 'center'; c.fillText('LOTO', 320, 80); c.fillStyle = '#111'; c.font = '900 92px Inter'; c.fillText('GAGNANT', 320, 200); c.font = '800 56px Inter'; c.fillText('100 000 000 €', 320, 300); }), side: THREE.DoubleSide})); scene.add(ticket);
// cast
const reds = [0xc2273d, 0xff6b6b, 0x9b2335, 0xff8fa3, 0xe63946, 0xb5179e, 0xff5d73, 0xd62828].map((c, i) => makeBlocky({shirt: c, pants: [0x3a4a6a, 0x2a2a3a, 0x5a4a3a][i % 3], hair: [0x2a1d14, 0x8a5a2a, 0x1a1410, 0xd9a050][i % 4], messy: i % 2 === 0, mood: 'happy'}));
const rich = makeBlocky({shirt: 0x3a3f4a, pants: 0x2a2e36, hair: 0xb8b8b8, suit: true, tie: 0xc8a020, mood: 'smug'});
{ const w = new THREE.Mesh(new THREE.BoxGeometry(.56, .2, .6), toon(0xd4af37, {metalness: .9, roughness: .25})); w.position.set(0, -1.2, 0); rich.userData.armL.add(w); rich.userData.watch = w; }
const mayor = makeBlocky({shirt: 0x2a2a3a, pants: 0x2a2a3a, hair: 0x6a6a6a, suit: true, tie: 0xc2273d, mood: 'happy'});
{ const sash = new THREE.Mesh(new THREE.BoxGeometry(1.5, .25, .85), toon(0xffffff, {map: canvasTex(96, 16, (c) => { c.fillStyle = '#0055a4'; c.fillRect(0, 0, 32, 16); c.fillStyle = '#fff'; c.fillRect(32, 0, 32, 16); c.fillStyle = '#ef4135'; c.fillRect(64, 0, 32, 16); })})); sash.position.set(0, 2.2, 0); sash.rotation.z = .6; mayor.add(sash); }
ALL.push(taxOffice, podium, yacht, watchA, watchB, tag, soup, caddie, ticket, ...reds, rich, mayor);
function mLook(night = false){ townLook(); if (night){ renderer.toneMappingExposure = 1.0; hemi.intensity = 1.3; hemi.color.set(0x6a7aa8); sunLight.intensity = .3; sunLight.color.set(0x9db8ff); setSky('mnight', -4, 250, 2, 2.5, .003); scene.fog = new THREE.Fog(0x1a2238, 60, 400); scene.environment = null; } }
