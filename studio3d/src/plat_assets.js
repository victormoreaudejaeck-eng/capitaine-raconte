
// ===================== Dans cette ville, tout le monde parle comme sur un plateau télé =====================
const pSign = (lines, bg, fg = '#fff', w = 1024, h = 400) => canvasTex(w, h, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.textAlign = 'center'; lines.forEach(([t, sz, y, col]) => { c.fillStyle = col || fg; c.font = `900 ${sz}px Inter, sans-serif`; const k = Math.min(1, (w - 60) / c.measureText(t).width); c.font = `900 ${sz * k}px Inter, sans-serif`; c.fillText(t, w / 2, y); }); });
// plateau dans la boulangerie
const studioB = new THREE.Group(); scene.add(studioB); studioB.position.set(0, 0, 1100);
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), toon(0x14182a)); fl.rotation.x = -Math.PI / 2; studioB.add(fl);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), toon(0xffffff, {map: canvasTex(1024, 410, (c) => { const g = c.createLinearGradient(0, 0, 1024, 0); g.addColorStop(0, '#0b2a6e'); g.addColorStop(1, '#6e0b2a'); c.fillStyle = g; c.fillRect(0, 0, 1024, 410); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '900 70px Inter'; c.fillText('LE GRAND DÉBAT DE LA BAGUETTE', 512, 120); c.fillStyle = '#ffcc33'; c.font = '800 40px Inter'; c.fillText('EN DIRECT DE LA BOULANGERIE', 512, 190); c.fillStyle = 'rgba(255,255,255,.12)'; for (let i = 0; i < 12; i++) c.fillRect(i * 90, 240, 50, 170); })})); back.position.set(0, 6, -7); studioB.add(back);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(17, 1.3, 1.6), toon(0xe8edf5)); desk.position.set(0, .65, -1); studioB.add(desk);
  const baguetteBig = new THREE.Mesh(new THREE.CapsuleGeometry(.25, 2.6, 6, 12), toon(0xd9a050)); baguetteBig.rotation.z = Math.PI / 2; baguetteBig.position.set(0, 1.9, 4.2); studioB.add(baguetteBig); studioB.userData.baguette = baguetteBig;
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(.5, .6, 1.5, 16), toon(0x333a4a)); ped.position.set(0, .75, 4.2); studioB.add(ped);
  const onair = new THREE.Mesh(new THREE.PlaneGeometry(2.4, .8), new THREE.MeshBasicMaterial({map: pSign([['● EN DIRECT', 160, 270]], '#c40012', '#fff', 800, 330)})); onair.position.set(9, 10, -6.9); studioB.add(onair);
  for (const x of [-12, -4, 4, 12]){ const l = new THREE.PointLight(0x9fb8ff, 25, 22); l.position.set(x, 8, 4); studioB.add(l); } }
// caméra TV
const tvCam = new THREE.Group(); scene.add(tvCam); { const b = new THREE.Mesh(new THREE.BoxGeometry(1, .8, 1.6), toon(0x222222)); b.position.y = 2.2; tvCam.add(b); const l = new THREE.Mesh(new THREE.CylinderGeometry(.3, .35, .6, 16), toon(0x111111)); l.rotation.x = Math.PI / 2; l.position.set(0, 2.2, -1); tvCam.add(l); const tri = new THREE.Mesh(new THREE.CylinderGeometry(.05, .6, 1.8, 3), toon(0x444444)); tri.position.y = .9; tvCam.add(tri); }
// micros tenus
const mics = Array.from({length: 10}, () => { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.CylinderGeometry(.06, .05, .5, 8), toon(0x222222)); g.add(h); const b = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), toon(0x555555)); b.position.y = .3; g.add(b); scene.add(g); return g; });
// bandeau ALERTE INFO (3D)
const bandeau = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.2), new THREE.MeshBasicMaterial({map: canvasTex(1400, 240, (c) => { c.fillStyle = '#c40012'; c.fillRect(0, 0, 380, 240); c.fillStyle = '#fff'; c.font = '900 70px Inter'; c.textAlign = 'center'; c.fillText('ALERTE', 190, 105); c.fillText('INFO', 190, 185); c.fillStyle = '#0b1a3a'; c.fillRect(380, 0, 1020, 240); c.fillStyle = '#fff'; c.textAlign = 'left'; c.font = '900 64px Inter'; c.fillText('UN CROISSANT', 420, 105); c.fillText('VIENT D\'ÊTRE VENDU', 420, 185); })})); scene.add(bandeau);
// écran pub
const pubScreen = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.4), new THREE.MeshBasicMaterial({map: pSign([['ON MARQUE UNE PAUSE', 90, 150], ['on revient juste après…', 60, 260, '#ffcc33'], ['📺 PUB', 70, 360]], '#1a1a3a', '#fff', 1024, 580)})); scene.add(pubScreen);
// fact-check
const factCheck = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.2), toon(0xffffff, {map: pSign([['FACT-CHECK ✔', 110, 140, '#2b8a3e'], ['C\'EST BIEN', 80, 250, '#111'], ['UNE BAGUETTE', 100, 360, '#111']], '#f4fff4', '#111', 1024, 480)})); scene.add(factCheck);
// Arcom
const arcomAgent = makeBlocky({shirt: 0x2a2a2a, pants: 0x1a1a1a, hair: 0x6a6a6a, mood: 'neutral'}); { const v = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.4, .82), toon(0xffffff, {map: pSign([['ARCOM', 200, 260]], '#1f6fd0', '#fff', 800, 400)})); v.position.y = 2.05; arcomAgent.add(v); }
const cutScreen = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.4), new THREE.MeshBasicMaterial({map: pSign([['FIN DE DIFFUSION', 100, 230], ['fréquence retirée', 60, 340, '#999']], '#050505', '#fff', 1024, 580)})); scene.add(cutScreen);
const plug = new THREE.Group(); scene.add(plug); { const cable = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 3, 8), toon(0x111111)); cable.rotation.z = Math.PI / 2; plug.add(cable); const p = new THREE.Mesh(new THREE.BoxGeometry(.4, .3, .3), toon(0xeeeeee)); p.position.x = 1.6; plug.add(p); }
// audimat
const audience = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), toon(0xffffff, {map: canvasTex(1000, 600, (c) => { c.fillStyle = '#0b1a3a'; c.fillRect(0, 0, 1000, 600); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '900 64px Inter'; c.fillText('AUDIENCE', 500, 90); c.strokeStyle = '#ffcc33'; c.lineWidth = 14; c.beginPath(); c.moveTo(80, 520); c.lineTo(300, 470); c.lineTo(500, 400); c.lineTo(700, 250); c.lineTo(920, 130); c.stroke(); c.fillStyle = '#2b8a3e'; c.font = '900 70px Inter'; c.fillText('RECORD 📈', 650, 560); })})); scene.add(audience);
const closedB = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.4), toon(0xffffff, {map: pSign([['PLUS DE PAIN', 110, 160], ['(débat en cours)', 60, 300, '#ffcc33']], '#5a3a22')})); scene.add(closedB);
ALL.push(studioB, tvCam, ...mics, bandeau, pubScreen, factCheck, arcomAgent, cutScreen, plug, audience, closedB);
