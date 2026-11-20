
// ===================== KIT DOCUMENTAIRE (partagé par tous les épisodes « et c'est vrai ») =====================
const vstd = (c, o = {}) => new THREE.MeshStandardMaterial({color: c, roughness: .85, ...o});
function noiseTex(w, h, base, spots, n = 3000, sz = 2){ return canvasTex(w, h, (c) => { c.fillStyle = base; c.fillRect(0, 0, w, h); for (let i = 0; i < n; i++){ const s = spots[i % spots.length]; c.fillStyle = s; c.globalAlpha = Math.random() * .25; c.fillRect(Math.random() * w, Math.random() * h, sz + Math.random() * sz, sz + Math.random() * sz); } c.globalAlpha = 1; }); }
function roofGeo(w, d, h){ const g = new THREE.BufferGeometry(); const x = w / 2 + .4, z = d / 2 + .4; const v = [-x, 0, z, x, 0, z, 0, h, z, -x, 0, -z, x, 0, -z, 0, h, -z];
  const idx = [0, 1, 2, 4, 3, 5, 0, 2, 5, 0, 5, 3, 1, 4, 5, 1, 5, 2]; g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.setIndex(idx); g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, .5, 1, 0, 0, 1, 0, .5, 1], 2)); g.computeVertexNormals(); return g; }
const PAPER = (draw) => canvasTex(820, 1160, (c) => { c.fillStyle = '#f6f0e1'; c.fillRect(0, 0, 820, 1160); for (let i = 0; i < 2500; i++){ c.fillStyle = `rgba(120,100,60,${Math.random() * .05})`; c.fillRect(Math.random() * 820, Math.random() * 1160, 3, 3); } c.fillStyle = '#1e1e1e'; c.textAlign = 'center'; draw(c); });
function wrapText(c, text, x, y, maxw, lh){ const words = text.split(' '); let line = ''; for (const w of words){ const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxw && line){ c.fillText(line, x, y); line = w; y += lh; } else line = t; } c.fillText(line, x, y); return y; }
// ---- habitants âgés (figurines) ----
const OFACE = {}; function oldFace(mood, skin = '#e8c3a0'){ const k = mood + skin; if (OFACE[k]) return OFACE[k]; return OFACE[k] = canvasTex(256, 256, (c) => { c.fillStyle = skin; c.fillRect(0, 0, 256, 256);
  const big = mood !== 'calm'; for (const ex of [92, 164]){ c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, 118, big ? 17 : 14, big ? 19 : 9, 0, 0, 7); c.fill(); c.fillStyle = '#2a1e18'; c.beginPath(); c.arc(ex + (mood === 'side' ? 7 : mood === 'side2' ? -7 : 0), 120, 7, 0, 7); c.fill(); }
  c.strokeStyle = '#d0d0d0'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(66, 88 - (big ? 8 : 0)); c.lineTo(114, 96); c.moveTo(142, 96); c.lineTo(190, 88 - (big ? 8 : 0)); c.stroke();
  c.strokeStyle = 'rgba(120,70,50,.35)'; c.lineWidth = 3; for (const ex of [92, 164]){ c.beginPath(); c.arc(ex, 132, 20, .3, Math.PI - .3); c.stroke(); }
  c.strokeStyle = '#6a2a24'; c.lineWidth = 6; c.beginPath(); if (big){ c.ellipse(128, 186, 12, 9, 0, 0, 7); } else { c.moveTo(108, 184); c.quadraticCurveTo(128, 194, 148, 184); } c.stroke(); }); }
function ancien(o = {}){ const g = new THREE.Group(); const coat = vstd(o.coat ?? 0x5a5f6a);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(.42, .9, 6, 12), coat); body.position.y = 1.15; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.36, 24, 18), [vstd(0xe8c3a0)]); head.position.y = 2.15; g.add(head);
  const faceM = new THREE.MeshStandardMaterial({map: oldFace('calm'), roughness: .7, transparent: true}); const face = new THREE.Mesh(new THREE.CircleGeometry(.3, 24), faceM); face.position.set(0, 2.15, .35); g.add(face);
  if (o.beret){ const b = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .1, 20), vstd(0x1b1f2a)); b.position.set(.05, 2.47, -.02); b.rotation.z = .15; g.add(b); }
  else { const hair = new THREE.Mesh(new THREE.SphereGeometry(.37, 20, 14, 0, Math.PI * 2, 0, 1.2), vstd(0xd8d8d8)); hair.position.y = 2.17; g.add(hair); const bun = new THREE.Mesh(new THREE.SphereGeometry(.16, 12, 10), vstd(0xd8d8d8)); bun.position.set(0, 2.42, -.22); g.add(bun); }
  for (const s of [-1, 1]){ const leg = new THREE.Mesh(new THREE.CapsuleGeometry(.13, .5, 4, 8), vstd(0x2a2a30)); leg.position.set(s * .17, .4, 0); g.add(leg); }
  g.userData = {faceM, head}; scene.add(g); return g; }
function oldMood(p, m){ p.userData.faceM.map = oldFace(m); p.userData.faceM.needsUpdate = true; }
// ---- post-production : tilt-shift, étalonnage chaud, grain, titres de documentaire ----
const tc = document.createElement('canvas'); tc.width = W; tc.height = H; const tctx = tc.getContext('2d');
const grains = [0, 1, 2, 3, 4, 5].map(() => { const g = document.createElement('canvas'); g.width = 270; g.height = 480; const x = g.getContext('2d'); const im = x.createImageData(270, 480); for (let i = 0; i < im.data.length; i += 4){ const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } x.putImageData(im, 0, 0); return g; });
window.postFX = (t, fx) => {
  const tilt = fx.tilt ?? 10; if (tilt > 0){ const fy = (fx.focusY ?? .5) * H, band = (fx.band ?? .16) * H;
    tctx.clearRect(0, 0, W, H); tctx.globalCompositeOperation = 'source-over'; tctx.filter = `blur(${tilt}px)`; tctx.drawImage(renderer.domElement, 0, 0); tctx.filter = 'none';
    const g = tctx.createLinearGradient(0, 0, 0, H); const a = Math.max(0, (fy - band * 2.2) / H), b = Math.max(0, (fy - band * .5) / H), c2 = Math.min(1, (fy + band * .5) / H), d = Math.min(1, (fy + band * 2.2) / H);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(a, 'rgba(0,0,0,1)'); g.addColorStop(b, 'rgba(0,0,0,0)'); g.addColorStop(c2, 'rgba(0,0,0,0)'); g.addColorStop(d, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,1)');
    tctx.globalCompositeOperation = 'destination-in'; tctx.fillStyle = g; tctx.fillRect(0, 0, W, H); tctx.globalCompositeOperation = 'source-over'; octx.drawImage(tc, 0, 0); }
  octx.save(); octx.globalCompositeOperation = 'soft-light'; octx.fillStyle = fx.grade || 'rgba(255,170,90,.28)'; octx.fillRect(0, 0, W, H); octx.restore();
  octx.save(); octx.globalCompositeOperation = 'overlay'; octx.globalAlpha = .09; octx.imageSmoothingEnabled = false; octx.drawImage(grains[Math.floor(t * 24) % 6], 0, 0, W, H); octx.restore(); };
function serif(txt, x, y, size, col = '#fff', weight = '700', align = 'left', spacing = 0){ octx.save(); octx.font = `${weight} ${size}px "DejaVu Serif", "Liberation Serif", serif`; octx.textAlign = align; octx.textBaseline = 'alphabetic';
  if (spacing) octx.letterSpacing = spacing + 'px'; octx.shadowColor = 'rgba(0,0,0,.55)'; octx.shadowBlur = 18; octx.fillStyle = col; octx.fillText(txt, x, y); octx.restore(); }
window.postFX2 = (t, fx, lt) => {
  if (fx.lower){ const k = easeOut(clamp((lt - .25) / .5, 0, 1)); octx.save(); octx.globalAlpha = k; octx.fillStyle = '#f2c94c'; octx.fillRect(80, 250, 8, 150); serif(fx.lower[0], 115 - (1 - k) * 30, 318, 76, '#ffffff', '700', 'left', 4); serif(fx.lower[1], 117 - (1 - k) * 30, 380, 38, '#f1e6cf', '400', 'left', 2); octx.restore(); }
  if (fx.date){ const k = easeOut(clamp((lt - .1) / .5, 0, 1)); octx.save(); octx.globalAlpha = k; serif(fx.date, W / 2, 470, 130, '#ffffff', '700', 'center', 12); octx.fillStyle = '#f2c94c'; octx.fillRect(W / 2 - 160 * k, 505, 320 * k, 5); octx.restore(); }
  if (fx.recon){ octx.save(); octx.globalAlpha = .85; serif('RECONSTITUTION', W - 70, 150, 30, '#ffffff', '400', 'right', 6); octx.restore(); }
  if (fx.vrai){ const k = easeOut(clamp((lt - .15) / .3, 0, 1)); octx.save(); octx.translate(W / 2, 520); octx.scale(1.6 - .6 * k, 1.6 - .6 * k); octx.globalAlpha = k; octx.fillStyle = 'rgba(0,0,0,.55)'; octx.fillRect(-330, -95, 660, 150); serif('C\'EST VRAI.', 0, 25, 108, '#f2c94c', '700', 'center', 6); octx.restore(); }
  if (fx.brand){ const k = easeOut(clamp((lt - .2) / .6, 0, 1)); octx.save(); octx.globalAlpha = k; octx.fillStyle = 'rgba(0,0,0,.45)'; octx.fillRect(0, 560, W, 330);
    serif('LE CAPITAINE RACONTE', W / 2, 700, 56, '#ffffff', '700', 'center', 4); serif('Des histoires vraies. Incroyables.', W / 2, 780, 40, '#f2c94c', '400', 'center', 2); serif('Abonne-toi', W / 2, 850, 40, '#ffffff', '700', 'center', 2); octx.restore(); } };
