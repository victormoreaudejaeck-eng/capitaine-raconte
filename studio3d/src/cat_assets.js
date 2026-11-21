
// ===================== « DANS LA VILLE D'À CÔTÉ, PERSONNE NE VOTE : C'EST LE CHAT QUI DÉCIDE » =====================
const POSTER_CAT = canvasTex(512, 720, (c, w, h) => { c.fillStyle = '#f39c12'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.fillRect(0, h - 130, w, 130);
  c.fillStyle = '#d35400'; c.beginPath(); c.arc(256, 300, 150, 0, 7); c.fill(); c.beginPath(); c.moveTo(130, 220); c.lineTo(150, 90); c.lineTo(230, 170); c.fill(); c.beginPath(); c.moveTo(382, 220); c.lineTo(362, 90); c.lineTo(282, 170); c.fill();
  c.fillStyle = '#111'; c.beginPath(); c.ellipse(200, 290, 18, 28, 0, 0, 7); c.ellipse(312, 290, 18, 28, 0, 0, 7); c.fill(); c.fillStyle = '#ff8fa3'; c.beginPath(); c.moveTo(240, 340); c.lineTo(272, 340); c.lineTo(256, 360); c.fill();
  c.strokeStyle = '#111'; c.lineWidth = 5; for (const s of [-1, 1]) for (const k of [0, 1]){ c.beginPath(); c.moveTo(256 + s * 40, 350 + k * 14); c.lineTo(256 + s * 150, 335 + k * 30); c.stroke(); }
  c.fillStyle = '#d35400'; c.font = '900 64px Inter'; c.textAlign = 'center'; c.fillText('MOUSTACHE', w / 2, h - 50); });
scene.traverse(o => { if (o.isMesh && o.material && (o.material.map === POSTER_M || o.material.map === POSTER)){ o.material = o.material.clone(); o.material.map = POSTER_CAT; } });
cars.forEach(c => { if (c.children[6]) c.children[6].visible = false; });
bakery.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHex() === NAVY){ o.material = o.material.clone(); o.material.color.set(0xd9a050); } });
const cSign = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 70) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// Moustache, le chat du maire (blocky, roux tigré)
function makeCat(){ const g = new THREE.Group(); const fur = toon(0xe67e22), dark = toon(0xb85a10), white = toon(0xfff4e6);
  const body = new THREE.Mesh(new THREE.BoxGeometry(.9, .8, 1.6), fur); body.position.y = .75; body.castShadow = true; g.add(body);
  for (let i = 0; i < 3; i++){ const st = new THREE.Mesh(new THREE.BoxGeometry(.92, .12, .2), dark); st.position.set(0, 1.12, -.5 + i * .45); g.add(st); }
  const head = new THREE.Group(); head.position.set(0, 1.3, .9); g.add(head);
  const hm = new THREE.Mesh(new THREE.BoxGeometry(.85, .75, .7), [fur, fur, fur, fur, new THREE.MeshStandardMaterial({map: canvasTex(256, 256, (c) => { c.fillStyle = '#e67e22'; c.fillRect(0, 0, 256, 256); c.fillStyle = '#fff4e6'; c.beginPath(); c.ellipse(128, 190, 80, 55, 0, 0, 7); c.fill();
      c.fillStyle = '#9ee86a'; for (const x of [80, 176]){ c.beginPath(); c.ellipse(x, 110, 26, 30, 0, 0, 7); c.fill(); } c.fillStyle = '#111'; for (const x of [80, 176]){ c.beginPath(); c.ellipse(x, 112, 7, 22, 0, 0, 7); c.fill(); }
      c.fillStyle = '#ff8fa3'; c.beginPath(); c.moveTo(114, 165); c.lineTo(142, 165); c.lineTo(128, 182); c.fill(); c.strokeStyle = '#3a2a1a'; c.lineWidth = 5; for (const s of [-1, 1]) for (const k of [0, 1]){ c.beginPath(); c.moveTo(128 + s * 30, 185 + k * 12); c.lineTo(128 + s * 120, 172 + k * 26); c.stroke(); } }), roughness: .6}), fur]);
  head.add(hm); for (const s of [-1, 1]){ const ear = new THREE.Mesh(new THREE.ConeGeometry(.17, .35, 4), fur); ear.position.set(s * .27, .5, 0); ear.rotation.y = Math.PI / 4; head.add(ear); }
  const legs = []; for (const x of [-.3, .3]) for (const z of [-.6, .6]){ const l = new THREE.Mesh(new THREE.BoxGeometry(.25, .5, .25), white); l.position.set(x, .25, z); g.add(l); legs.push(l); }
  const tail = new THREE.Mesh(new THREE.BoxGeometry(.18, .18, 1.2), fur); tail.geometry.translate(0, 0, -.6); tail.position.set(0, 1.0, -.8); tail.rotation.x = .9; g.add(tail);
  const sash = new THREE.Mesh(new THREE.BoxGeometry(.95, .18, 1.0), toon(0xffffff, {map: canvasTex(96, 16, (c) => { c.fillStyle = '#0055a4'; c.fillRect(0, 0, 32, 16); c.fillStyle = '#fff'; c.fillRect(32, 0, 32, 16); c.fillStyle = '#ef4135'; c.fillRect(64, 0, 32, 16); })})); sash.position.set(0, .9, .2); sash.rotation.z = .5; sash.visible = false; g.add(sash);
  g.userData = {head, legs, tail, sash}; g.scale.setScalar(1.4); scene.add(g); return g; }
const moustache = makeCat();
function catLoaf(on = true){ const u = moustache.userData; u.legs.forEach(l => l.visible = !on); moustache.children[0].position.y = on ? .45 : .75; }
// panneau d'entrée
const entry = new THREE.Group(); scene.add(entry);
{ const b = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.6), toon(0xffffff, {map: cSign([['BIENVENUE', 110, 120], ['ICI, ON NE VOTE PAS', 90, 230], ['c\'est Moustache qui décide', 60, 330]], '#1f6f3f')})); b.position.y = 3.6; entry.add(b);
  for (const x of [-2, 2]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.15, 3.6, .15), toon(0x8a8a8a, {metalness: .5})); p.position.set(x, 1.8, -.05); entry.add(p); } }
// balcon de la mairie pour le chat
const balcony = new THREE.Group(); scene.add(balcony);
{ const facade = new THREE.Mesh(new THREE.BoxGeometry(12, 9, 6), toon(0xfbf6ec)); facade.position.y = 4.5; facade.castShadow = true; balcony.add(facade); const sg = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.2), toon(0xffffff, {map: cSign([['MAIRIE', 130, 260]], '#2a2a2a')})); sg.position.set(0, 8, 3.02); balcony.add(sg);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(4, .25, 1.6), toon(0xd8d0c0)); deck.position.set(0, 5, 3.8); balcony.add(deck); for (let i = 0; i < 9; i++){ const bar = new THREE.Mesh(new THREE.BoxGeometry(.08, 1, .08), toon(0x2a2a2a)); bar.position.set(-1.9 + i * .475, 5.6, 4.55); balcony.add(bar); }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(4, .1, .1), toon(0x2a2a2a)); rail.position.set(0, 6.1, 4.55); balcony.add(rail); const door = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.6), toon(0x6a4428)); door.position.set(0, 6.3, 3.02); balcony.add(door);
  const scratches = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), toon(0xffffff, {transparent: true, map: canvasTex(256, 192, (c) => { c.strokeStyle = 'rgba(80,50,30,.85)'; c.lineWidth = 7; for (let i = 0; i < 4; i++){ c.beginPath(); c.moveTo(60 + i * 40, 20); c.lineTo(40 + i * 40, 170); c.stroke(); } })})); scratches.position.set(3.2, 1.6, 3.03); balcony.add(scratches); balcony.userData.scratch = scratches; }
// grue + mairie neuve, pancarte officielle, croissant, pétition, urne, tableau des résultats
const crane = new THREE.Group(); scene.add(crane); { const y = toon(0xf1c40f); const mast = new THREE.Mesh(new THREE.BoxGeometry(.8, 22, .8), y); mast.position.y = 11; crane.add(mast); const jib = new THREE.Mesh(new THREE.BoxGeometry(18, .7, .7), y); jib.position.set(5, 22, 0); crane.add(jib);
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 10), toon(0x222222)); cable.position.set(12, 17, 0); crane.add(cable); const hook = new THREE.Mesh(new THREE.BoxGeometry(3, 1.4, 1.4), toon(0xfbf6ec)); hook.position.set(12, 11.5, 0); crane.add(hook); }
const decree = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), toon(0xffffff, {map: cSign([['DÉCISION OFFICIELLE', 90, 120], ['Le croissant appartient', 70, 230], ['à la ville.', 70, 320]], '#f6f0e1', '#1a1a1a')})); scene.add(decree);
function croissantMeshC(){ const g = new THREE.Group(); const m = toon(0xd99a3a, {roughness: .4}); for (let i = 0; i < 7; i++){ const a = -1.1 + i * (2.2 / 6); const r = .55 - Math.abs(i - 3) * .1; const s = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m); s.position.set(Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3 + 1.3); s.scale.set(1, .8, 1.15); g.add(s); } g.scale.setScalar(.35); scene.add(g); return g; }
const croissantC = croissantMeshC();
const bench = new THREE.Group(); scene.add(bench); { const seat = new THREE.Mesh(new THREE.BoxGeometry(3.2, .15, .9), toon(0x8a5a3a)); seat.position.y = .95; bench.add(seat); const back = new THREE.Mesh(new THREE.BoxGeometry(3.2, .8, .12), toon(0x8a5a3a)); back.position.set(0, 1.5, -.42); bench.add(back); for (const x of [-1.4, 1.4]){ const l = new THREE.Mesh(new THREE.BoxGeometry(.12, .95, .8), toon(0x333333)); l.position.set(x, .47, 0); bench.add(l); } }
const petition = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.5), toon(0xffffff, {map: cSign([['PÉTITION', 120, 110], ['ET SI', 90, 220], ['ON VOTAIT ?', 90, 320]], '#ffffff', '#c0102a', 600, 820)})); scene.add(petition);
const results = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), toon(0xffffff, {map: canvasTex(1000, 600, (c) => { c.fillStyle = '#16213e'; c.fillRect(0, 0, 1000, 600); c.fillStyle = '#fff'; c.font = '900 64px Inter'; c.textAlign = 'center'; c.fillText('RÉSULTATS · PREMIÈRE ÉLECTION', 500, 90);
  c.textAlign = 'left'; c.font = '800 70px Inter'; c.fillStyle = '#f39c12'; c.fillText('MOUSTACHE', 60, 240); c.fillRect(60, 270, 820, 50); c.fillText('99 %', 820, 240);
  c.fillStyle = '#9fb3c8'; c.fillText('MOI', 60, 430); c.fillRect(60, 460, 12, 50); c.fillText('1 %', 820, 430); })})); scene.add(results);
ALL.push(moustache, entry, balcony, crane, decree, croissantC, bench, petition, results);
function cLook2(){ townLook(); }
