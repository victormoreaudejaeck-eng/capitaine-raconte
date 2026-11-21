
// ===================== BERNARD vs LA TAXE ZUCMAN =====================
const zSign = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, sz, y]) => { c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 70) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// panneau de la taxe
const taxBoard = new THREE.Group(); scene.add(taxBoard);
{ const b = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.4), toon(0xffffff, {map: zSign([['TAXE ZUCMAN', 130, 120], ['2 % PAR AN', 110, 240], ['fortunes > 100 millions', 64, 340]], '#1f3d7a')})); b.position.y = 3.6; taxBoard.add(b);
  for (const x of [-2.6, 2.6]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.15, 3.6, .15), toon(0x444444)); p.position.set(x, 1.8, -.05); taxBoard.add(p); } }
const concerned = new THREE.Mesh(new THREE.PlaneGeometry(2.4, .8), toon(0xffffff, {map: zSign([['CONCERNÉS : 1', 120, 250]], '#c0102a')})); scene.add(concerned);
// montre en plastique
const plasticWatch = new THREE.Group(); scene.add(plasticWatch); { const r = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .2, 32), toon(0x2ecc71)); r.rotation.x = Math.PI / 2; plasticWatch.add(r); const f = new THREE.Mesh(new THREE.CircleGeometry(.4, 32), toon(0xffffff, {map: zSign([['0,99 €', 160, 250]], '#ffeb3b', '#222', 512, 400)})); f.position.z = .11; plasticWatch.add(f);
  const strap = new THREE.Mesh(new THREE.BoxGeometry(.4, 1.8, .06), toon(0xff4fa3)); strap.position.z = -.05; plasticWatch.add(strap); }
// pédalo (en or massif)
function makePedalo(gold){ const g = new THREE.Group(); const m = toon(gold ? 0xe8b830 : 0xffffff, gold ? {metalness: .85, roughness: .2, emissive: 0x3a2800} : {}); const acc = toon(gold ? 0xd4a020 : 0x2e86c1, gold ? {metalness: .85, roughness: .25} : {});
  for (const x of [-1.1, 1.1]){ const f = new THREE.Mesh(new THREE.CapsuleGeometry(.55, 3, 6, 16), m); f.rotation.x = Math.PI / 2; f.position.set(x, .5, 0); g.add(f); }
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.6, .3, 1.6), acc); seat.position.set(0, 1.2, -.3); g.add(seat); const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.0, .2), acc); back.position.set(0, 1.8, -1.1); g.add(back);
  const slide = new THREE.Mesh(new THREE.BoxGeometry(.9, .1, 2.6), acc); slide.position.set(0, 2.0, -1.6); slide.rotation.x = -.6; g.add(slide); scene.add(g); return g; }
const pedalo = makePedalo(false), goldPedalo = makePedalo(true);
// Ferrari rouge
const ferrari = new THREE.Group(); scene.add(ferrari);
{ const red = toon(0xd01010, {roughness: .2, metalness: .3}); const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, .7, 5), red); body.position.y = .7; ferrari.add(body); const nose = new THREE.Mesh(new THREE.BoxGeometry(2.2, .4, 1.4), red); nose.position.set(0, .55, 2.9); ferrari.add(nose);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.8, .55, 1.9), toon(0x1a2430, {roughness: .05})); cab.position.set(0, 1.3, -.3); ferrari.add(cab); const wing = new THREE.Mesh(new THREE.BoxGeometry(2.3, .12, .5), toon(0x111111)); wing.position.set(0, 1.35, -2.4); ferrari.add(wing);
  for (const [x, z] of [[-1.15, 1.6], [1.15, 1.6], [-1.15, -1.6], [1.15, -1.6]]){ const w = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .35, 16), toon(0x111111)); w.rotation.z = Math.PI / 2; w.position.set(x, .45, z); ferrari.add(w); const rim = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, .37, 10), toon(0xf1c40f, {metalness: .8})); rim.rotation.z = Math.PI / 2; rim.position.set(x, .45, z); ferrari.add(rim); }
  ferrari.traverse(o => { if (o.isMesh) o.castShadow = true; }); }
// contrôleur des impôts
const inspector = makeBlocky({shirt: 0x5a5f6a, pants: 0x2a2e36, hair: 0x2a1d14, suit: true, tie: 0x1f3d7a, mood: 'smug'});
{ const fr = toon(0x111111); for (const sx of [-1, 1]){ const r = new THREE.Mesh(new THREE.TorusGeometry(.17, .035, 6, 16), fr); r.position.set(sx * .27, 3.42, .59); inspector.add(r); }
  const bag = new THREE.Mesh(new THREE.BoxGeometry(.9, .7, .25), toon(0x3a2a1a)); bag.position.set(0, -1.5, .1); inspector.userData.armR.add(bag);
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(.6, .3), toon(0xffffff, {map: zSign([['IMPÔTS', 150, 250]], '#1f3d7a')})); badge.position.set(-.4, 2.5, .42); inspector.add(badge); }
// disguise : casquette + sac plastique pour Bernard
const disguise = new THREE.Group(); { const cap = new THREE.Mesh(new THREE.BoxGeometry(1.3, .3, 1.3), toon(0x7a7a7a)); cap.position.y = 4.2; disguise.add(cap); const brim = new THREE.Mesh(new THREE.BoxGeometry(1.3, .08, .5), toon(0x5a5a5a)); brim.position.set(0, 4.08, .8); disguise.add(brim);
  const patch = new THREE.Mesh(new THREE.BoxGeometry(.4, .4, .05), toon(0x8a5a3a)); patch.position.set(.4, 1.8, .42); disguise.add(patch); } rich.add(disguise);
// frontière belge
const border = new THREE.Group(); scene.add(border);
{ const s = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.2), toon(0xffffff, {map: canvasTex(680, 440, (c) => { c.fillStyle = '#003399'; c.fillRect(0, 0, 680, 440); c.fillStyle = '#ffcc00'; for (let i = 0; i < 12; i++){ const a = i / 12 * Math.PI * 2; c.beginPath(); c.arc(340 + Math.cos(a) * 110, 170 + Math.sin(a) * 110, 12, 0, 7); c.fill(); }
    c.fillStyle = '#fff'; c.font = '900 84px Inter'; c.textAlign = 'center'; c.fillText('BELGIQUE', 340, 190); c.font = '800 54px Inter'; c.fillText('BELGIË', 340, 380); })})); s.position.y = 3; border.add(s);
  const p = new THREE.Mesh(new THREE.BoxGeometry(.12, 3, .12), toon(0x888888)); p.position.y = 1.5; border.add(p); const km = new THREE.Mesh(new THREE.PlaneGeometry(2.4, .5), toon(0xffffff, {map: zSign([['à 500 m de la France', 70, 250]], '#ffffff', '#111')})); km.position.y = 1.65; border.add(km); }
const suitcase = new THREE.Mesh(new THREE.BoxGeometry(.9, .7, .35), toon(0x8a5a3a)); scene.add(suitcase);
const voteSigns = [0, 1].map(i => { const g = new THREE.Group(); const pl = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1, .05), toon(0xffffff, {map: zSign([[i ? 'CONTRE' : 'POUR', 140, 250]], i ? '#c0102a' : '#27ae60')})); pl.position.y = 2.6; g.add(pl); const st = new THREE.Mesh(new THREE.BoxGeometry(.1, 2.4, .1), toon(0x8a6a4a)); st.position.y = 1.2; g.add(st); scene.add(g); return g; });
ALL.push(taxBoard, concerned, plasticWatch, pedalo, goldPedalo, ferrari, inspector, border, suitcase, ...voteSigns);
