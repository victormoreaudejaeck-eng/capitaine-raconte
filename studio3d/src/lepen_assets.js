
// ===================== MARINE LE PEN : tout le monde est son assistant =====================
const lSign = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, sz, y, col]) => { c.fillStyle = col || fg; c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 60) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
const euStars = (c, cx, cy, r, n = 12, s = 10) => { c.fillStyle = '#ffcc00'; for (let i = 0; i < n; i++){ const a = i / n * Math.PI * 2; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; c.beginPath(); for (let k = 0; k < 10; k++){ const rr = k % 2 ? s * .45 : s; const aa = k / 10 * Math.PI * 2 - Math.PI / 2; c.lineTo(x + Math.cos(aa) * rr, y + Math.sin(aa) * rr); } c.fill(); } };
const POSTER_LP = posterTex('MARINE', '2027', '#0d1b4a'); scene.traverse(o => { if (o.isMesh && o.material && (o.material.map === POSTER_M || o.material.map === POSTER)){ o.material = o.material.clone(); o.material.map = POSTER_LP; } });
// badge « ASSISTANT » (payé par le Parlement européen)
const BADGE = canvasTex(512, 300, (c) => { c.fillStyle = '#003399'; c.fillRect(0, 0, 512, 300); euStars(c, 90, 150, 55, 12, 11); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '900 64px Inter'; c.fillText('ASSISTANT', 320, 135); c.font = '700 26px Inter'; c.fillText('payé par le Parlement', 320, 195); c.fillText('européen', 320, 228); c.strokeStyle = '#ffcc00'; c.lineWidth = 10; c.strokeRect(5, 5, 502, 290); });
function badgeOn(p, y = 2.45, z = .43, s = 1){ const b = new THREE.Mesh(new THREE.PlaneGeometry(.95 * s, .56 * s), toon(0xffffff, {map: BADGE})); b.position.set(0, y, z); p.add(b); return b; }
// Marine : blonde, tailleur bleu marine
const marine = makeBlocky({shirt: 0x1c2a52, pants: 0x1c2a52, hair: 0xf0cf72, mood: 'smug'});
{ const hm = toon(0xf0cf72); const back = new THREE.Mesh(new THREE.BoxGeometry(1.29, 1.25, .3), hm); back.position.set(0, 3.35, -.5); marine.add(back);
  for (const sx of [-1, 1]){ const side = new THREE.Mesh(new THREE.BoxGeometry(.14, 1.05, 1.0), hm); side.position.set(sx * .64, 3.4, -.08); marine.add(side); }
  const fringe = new THREE.Mesh(new THREE.BoxGeometry(1.27, .22, .2), hm); fringe.position.set(0, 3.86, .52); marine.add(fringe);
  const collar = new THREE.Mesh(new THREE.BoxGeometry(.5, .45, .05), toon(0xffffff)); collar.position.set(0, 2.62, .41); collar.rotation.z = Math.PI / 4; marine.add(collar); }
// métiers
const baker = makeBlocky({shirt: 0xf4f1ea, pants: 0x3a3a3a, hair: 0x3a2614, mood: 'happy'}); { const t = new THREE.Mesh(new THREE.CylinderGeometry(.6, .5, .8, 16), toon(0xffffff)); t.position.y = 4.45; baker.add(t); } const badgeBaker = badgeOn(baker);
const mechanic = makeBlocky({shirt: 0x2a5aa8, pants: 0x2a5aa8, hair: 0x1a1410, mood: 'neutral'}); { const cap = new THREE.Mesh(new THREE.BoxGeometry(1.28, .28, 1.28), toon(0xd62828)); cap.position.y = 4.1; mechanic.add(cap); const vis = new THREE.Mesh(new THREE.BoxGeometry(1.1, .08, .6), toon(0xd62828)); vis.position.set(0, 3.98, .85); mechanic.add(vis); const wr = new THREE.Mesh(new THREE.BoxGeometry(.14, .9, .1), toon(0x9aa0a6, {metalness: .6, roughness: .3})); wr.position.set(0, -1.3, .25); mechanic.userData.armR.add(wr); } const badgeMech = badgeOn(mechanic);
const cat = new THREE.Group(); scene.add(cat); { const fur = toon(0xe89a4a); const b = new THREE.Mesh(new THREE.BoxGeometry(1.0, .9, 1.7), fur); b.position.y = .75; cat.add(b);
  const h = new THREE.Mesh(new THREE.BoxGeometry(.95, .85, .85), [fur, fur, fur, fur, new THREE.MeshStandardMaterial({map: bFace('smug', '#e89a4a', '#8a5a2a')}), fur]); h.position.set(0, 1.5, .85); cat.add(h);
  for (const sx of [-1, 1]){ const ear = new THREE.Mesh(new THREE.ConeGeometry(.18, .35, 4), fur); ear.position.set(sx * .3, 2.08, .85); cat.add(ear); }
  const tail = new THREE.Mesh(new THREE.BoxGeometry(.18, 1.3, .18), fur); tail.position.set(0, 1.3, -.95); tail.rotation.x = -.4; cat.add(tail); cat.userData.tail = tail;
  for (const [x, z] of [[-.3, .55], [.3, .55], [-.3, -.55], [.3, -.55]]){ const l = new THREE.Mesh(new THREE.BoxGeometry(.24, .4, .24), fur); l.position.set(x, .2, z); cat.add(l); }
  const bc = new THREE.Mesh(new THREE.PlaneGeometry(.8, .47), toon(0xffffff, {map: BADGE})); bc.position.set(0, .85, .87); cat.add(bc); }
// enveloppes « Parlement européen »
const ENV = canvasTex(512, 320, (c) => { c.fillStyle = '#f2e6c8'; c.fillRect(0, 0, 512, 320); c.fillStyle = '#003399'; c.fillRect(0, 0, 512, 90); euStars(c, 256, 45, 30, 12, 7); c.fillStyle = '#1a1a1a'; c.textAlign = 'center'; c.font = '900 50px Inter'; c.fillText('SALAIRE', 256, 175); c.font = '700 30px Inter'; c.fillText('Parlement européen', 256, 230); c.fillStyle = '#2b8a3e'; c.font = '900 52px Inter'; c.fillText('€€€', 256, 295); });
const envMat = toon(0xffffff, {map: ENV}); const envPlain = toon(0xf2e6c8);
function envelope(){ const e = new THREE.Mesh(new THREE.BoxGeometry(1.0, .06, .62), [envPlain, envPlain, envMat, envPlain, envPlain, envPlain]); scene.add(e); return e; }
const envs = Array.from({length: 14}, envelope);
// panneau « SORTIE DE L'EUROPE » financé par l'Europe
const exitSign = new THREE.Group(); scene.add(exitSign);
{ const pn = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.0, .12), toon(0xffffff, {map: lSign([["SORTIE DE L'EUROPE", 110, 170], ['➜ par ici', 80, 300]], '#1f7a3a')})); pn.position.y = 5; exitSign.add(pn);
  for (const x of [-2.2, 2.2]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.18, 5, .18), toon(0x8a8f96)); p.position.set(x, 2.5, -.1); exitSign.add(p); }
  const plq = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, .08), toon(0xffffff, {map: canvasTex(640, 270, (c) => { c.fillStyle = '#fff'; c.fillRect(0, 0, 640, 270); c.fillStyle = '#003399'; c.fillRect(20, 30, 220, 150); euStars(c, 130, 105, 48, 12, 9); c.fillStyle = '#003399'; c.font = '800 38px Inter'; c.textAlign = 'left'; c.fillText('Projet financé', 260, 90); c.fillText('par l\'Union', 260, 140); c.fillText('européenne', 260, 190); c.font = '700 26px Inter'; c.fillStyle = '#555'; c.fillText('FEDER · 100 %', 260, 240); })})); plq.position.set(0, 2.9, .02); exitSign.add(plq); exitSign.userData.plq = plq; }
// tribunal
const court = new THREE.Group(); scene.add(court); court.position.set(0, 0, 600);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), toon(0x7a5a3a)); fl.rotation.x = -Math.PI / 2; court.add(fl); const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 14), toon(0xe9e1cf)); wall.position.set(0, 7, -8); court.add(wall);
  const bench = new THREE.Mesh(new THREE.BoxGeometry(12, 2.6, 2), toon(0x5a3a22)); bench.position.set(0, 1.3, -5.5); court.add(bench);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.2), toon(0xffffff, {map: lSign([["COUR D'APPEL", 130, 250]], '#2a2a2a', '#e8c66a')})); plate.position.set(0, 8.6, -7.95); court.add(plate);
  const flagC = ['#002395', '#ffffff', '#ed2939']; flagC.forEach((col, i) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(1, 3.4), toon(new THREE.Color(col))); s.position.set(8 + i, 6, -7.94); court.add(s); }); }
const judges = [0, 1, 2].map(() => { const j = makeBlocky({shirt: 0x141414, pants: 0x141414, hair: 0xb8b8b8, mood: 'neutral'}); const jab = new THREE.Mesh(new THREE.BoxGeometry(.4, .5, .05), toon(0xffffff)); jab.position.set(0, 2.5, .42); j.add(jab); return j; });
const bracelet = new THREE.Group(); scene.add(bracelet); { const r = new THREE.Mesh(new THREE.TorusGeometry(.45, .1, 10, 28), toon(0x1a1a1a)); bracelet.add(r); const box = new THREE.Mesh(new THREE.BoxGeometry(.5, .35, .3), toon(0x2a2a2a)); box.position.set(0, -.45, 0); bracelet.add(box); const led = new THREE.Mesh(new THREE.SphereGeometry(.06, 10, 8), new THREE.MeshBasicMaterial({color: 0x33ff66})); led.position.set(0, -.45, .16); bracelet.add(led); }
// affiches de campagne + recrutement
const poster2027 = new THREE.Group(); scene.add(poster2027);
{ const b = new THREE.Mesh(new THREE.BoxGeometry(6, 3.6, .15), toon(0xffffff, {map: canvasTex(1000, 600, (c) => { c.fillStyle = '#0d1b4a'; c.fillRect(0, 0, 1000, 600); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '900 150px Inter'; c.fillText('MARINE', 500, 210); c.fillStyle = '#e1000f'; c.font = '900 190px Inter'; c.fillText('2027', 500, 410); c.fillStyle = '#fff'; c.font = '800 46px Inter'; c.fillText('ON RECRUTE DES ASSISTANTS', 500, 520); c.font = '600 30px Inter'; c.fillStyle = '#9fb3ff'; c.fillText('(payés par l\'Europe)', 500, 570); })})); b.position.y = 4.4; poster2027.add(b);
  for (const x of [-2.6, 2.6]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.2, 3, .2), toon(0x555555)); p.position.set(x, 1.5, -.1); poster2027.add(p); } }
const stopBxl = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.2), toon(0xffffff, {map: lSign([['STOP', 170, 170], ['BRUXELLES', 140, 340]], '#0d1b4a', '#fff', 800, 400)})); scene.add(stopBxl);
const queueSign = new THREE.Group(); scene.add(queueSign); { const pl = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, .1), toon(0xffffff, {map: lSign([['CANDIDATS', 120, 170], ['ASSISTANTS ➜', 100, 310]], '#003399')})); pl.position.y = 3.4; queueSign.add(pl); const p = new THREE.Mesh(new THREE.BoxGeometry(.14, 3, .14), toon(0x555555)); p.position.y = 1.5; queueSign.add(p); }
ALL.push(marine, baker, mechanic, cat, ...envs, exitSign, court, ...judges, bracelet, poster2027, stopBxl, queueSign);
