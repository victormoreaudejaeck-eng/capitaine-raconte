
// ===================== Marine Le Pen partie 2 : la monnaie qui change tous les matins =====================
const DAYS = {
  lundi: [['LUNDI', 150, 150, '#ffcc33'], ['RETOUR AU FRANC', 90, 280], ['(programme 2017)', 50, 360, '#bbb']],
  mardi: [['MARDI', 150, 150, '#ffcc33'], ['FRANC + ÉCU', 100, 280], ['(aussi au programme)', 50, 360, '#bbb']],
  mercredi: [['MERCREDI', 150, 150, '#ffcc33'], ['ON GARDE L\'EURO', 90, 280], ['(finalement)', 50, 360, '#bbb']],
  jeudi: [['JEUDI', 150, 150, '#ffcc33'], ['ON VERRA', 130, 300]],
};
const DAYTEX = {}; for (const k in DAYS) DAYTEX[k] = lSign(DAYS[k], '#1f2a24', '#fff', 1024, 400);
const dayBoard = new THREE.Group(); scene.add(dayBoard); { const b = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.2, .14), toon(0xffffff, {map: DAYTEX.lundi})); b.position.y = 4.2; dayBoard.add(b); dayBoard.userData.b = b; const fr = new THREE.Mesh(new THREE.BoxGeometry(5.9, 2.5, .1), toon(0x6a4428)); fr.position.set(0, 4.2, -.06); dayBoard.add(fr); for (const x of [-2.5, 2.5]){ const l = new THREE.Mesh(new THREE.BoxGeometry(.16, 3.2, .16), toon(0x6a4428)); l.position.set(x, 1.6, -.1); dayBoard.add(l); } }
function setDay(k){ const m = dayBoard.userData.b.material; m.map = DAYTEX[k]; m.needsUpdate = true; }
// pièces
const coinTex = (txt, bg) => canvasTex(128, 128, (c) => { c.fillStyle = bg; c.beginPath(); c.arc(64, 64, 62, 0, 7); c.fill(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 6; c.beginPath(); c.arc(64, 64, 52, 0, 7); c.stroke(); c.fillStyle = '#3a2a10'; c.font = '900 64px Inter'; c.textAlign = 'center'; c.fillText(txt, 64, 86); });
const CT = {F: coinTex('F', '#d8b84a'), E: coinTex('€', '#e0c060'), U: coinTex('É', '#c0c8d0'), Q: coinTex('?', '#d07a5a')};
function coin(k){ const side = toon(0xffffff, {map: CT[k]}); const edge = toon(0xb89a3a); const m = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .08, 24), [edge, side, side]); scene.add(m); return m; }
const coins = []; ['F', 'E', 'U', 'Q'].forEach(k => { for (let i = 0; i < 10; i++) coins.push(Object.assign(coin(k), {userData: {k}})); });
const coinsOf = k => coins.filter(c => c.userData.k === k);
// deux caisses
const registers = new THREE.Group(); scene.add(registers);
[['FRANC', '#1f3d7a', -1.15], ['ÉCU', '#7a1f3d', 1.15]].forEach(([n, col, x]) => { const r = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 1.2), toon(0x2a2a2a)); r.position.set(x, 1.7, 0); registers.add(r); const s = new THREE.Mesh(new THREE.PlaneGeometry(1.05, .45), toon(0xffffff, {map: lSign([[n, 160, 260]], col)})); s.position.set(x, 2.55, .2); registers.add(s); });
{ const counter = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 1.6), toon(0x8a5a3a)); counter.position.y = .6; registers.add(counter); }
// panneau prix 4 monnaies
const priceBoard = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.2, .12), toon(0xffffff, {map: canvasTex(800, 580, (c) => { c.fillStyle = '#1f2a24'; c.fillRect(0, 0, 800, 580); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '900 64px Inter'; c.fillText('1 BAGUETTE', 400, 90);
  [['1,20 €', '#ffcc33'], ['7,87 F', '#9fd0ff'], ['0,98 écu', '#ff9fb0'], ['on verra', '#bbbbbb']].forEach(([t, col], i) => { c.fillStyle = col; c.font = '900 72px Inter'; c.fillText(t, 400, 190 + i * 100); }); })})); scene.add(priceBoard);
// bureau de change
const changeBooth = new THREE.Group(); scene.add(changeBooth); { const b = new THREE.Mesh(new THREE.BoxGeometry(4, 3.4, 2.4), toon(0xe8e2d4)); b.position.y = 1.7; changeBooth.add(b); const s = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 1.0), toon(0xffffff, {map: lSign([['BUREAU DE CHANGE', 110, 250]], '#2b8a3e')})); s.position.set(0, 3.0, 1.22); changeBooth.add(s); const win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0), toon(0x9fc8e8)); win.position.set(0, 1.7, 1.22); changeBooth.add(win); }
// croissants pour le troc
function croissantE(){ const g = new THREE.Group(); const m = toon(0xd99a3a, {roughness: .4}); for (let i = 0; i < 7; i++){ const a = -1.1 + i * .37; const s = new THREE.Mesh(new THREE.SphereGeometry(.12 + (3 - Math.abs(i - 3)) * .03, 10, 8), m); s.scale.set(1, .8, 1.3); s.position.set(Math.sin(a) * .3, 0, Math.cos(a) * .3 - .22); g.add(s); } scene.add(g); return g; }
const barterC = Array.from({length: 6}, croissantE);
ALL.push(dayBoard, ...coins, registers, priceBoard, changeBooth, ...barterC);
