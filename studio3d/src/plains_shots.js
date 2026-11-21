
// ===================== Monowi : plans =====================
const P0 = (...x) => { pLookDoc(); only(sky, PG, ...x); };
const B0 = (grp, ...x) => { pLookDoc(); only(grp, ...x); scene.background = new THREE.Color(0x1a120c); scene.fog = null; hemi.intensity = .55; hemi.color.set(0xffd8b0); sunLight.intensity = .4; };
const taxPaper = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.98), vstd(0xffffff, {map: PAPER((c) => { c.font = '700 52px "DejaVu Serif", serif'; c.fillText('AVIS D\'IMPOSITION', 410, 160); c.font = '400 36px "DejaVu Serif", serif'; c.fillText('Village of Monowi', 410, 230);
  c.fillRect(160, 270, 500, 3); c.font = '400 34px "DejaVu Serif", serif'; c.fillText('Contribuable : 1', 410, 380); c.fillText('Bénéficiaire : le village', 410, 440); c.fillStyle = '#888'; for (let i = 0; i < 6; i++) c.fillRect(110, 540 + i * 50, 600 - (i % 2) * 120, 12); })}));
scene.add(taxPaper); ALL.push(taxPaper);
const SEPIA = 'rgba(190,140,70,.55)';
const SHOTS = {
  aerial_prairie(t, p){ P0(); cam(V(90 - p * 20, 70 - p * 10, 150 - p * 20), V(0, 4, 10), 40); sunFollow(V(0, 0, 10)); return {lower: ['MONOWI', 'Nebraska · États-Unis'], focusY: .55, band: .2, tilt: 8}; },
  sign_pop1(t, p){ P0(); cam(V(4.2 - p * .5, 2.4, 59.5 - p), V(5.5, 2.6, 52), 38); sunFollow(V(5, 0, 52)); return {vrai: true, focusY: .5, band: .2, tilt: 7}; },
  old_town_sepia(t, p){ P0(...townsfolk30); townsfolk30.forEach((f, i) => { const dir = i % 2 ? 1 : -1; f.position.set((i % 4 - 1.5) * 1.6, 0, 30 - ((i * 9 + t * 1.6 * dir) % 50 + 50) % 50); f.rotation.y = dir > 0 ? Math.PI : 0; oldMood(f, 'calm'); });
    cam(V(-5, 5, 50 - p * 4), V(0, 2, 10), 42); sunFollow(V(0, 0, 20)); return {date: '1930', grade: SEPIA, focusY: .5, band: .2, tilt: 7}; },
  houses_empty(t, p){ P0(); cam(V(-3, 3.5, 50 - p * 18), V(-16, 3, 28 - p * 18), 40); sunFollow(V(-10, 0, 20)); return {focusY: .5, band: .2, tilt: 8}; },
  couple_back(t, p){ P0(elsie, rudy); elsie.position.set(-.6, pH(0, 12), 12); rudy.position.set(.6, pH(0, 12), 12); elsie.rotation.y = rudy.rotation.y = Math.PI; oldMood(elsie, 'calm'); oldMood(rudy, 'calm');
    cam(V(0, 2.8, 23 - p * 1.5), V(0, 2.1, 4), 36); sunFollow(V(0, 0, 12)); return {date: '2000', focusY: .55, band: .2, tilt: 7}; },
  alone_road(t, p){ P0(elsie); elsie.position.set(0, pH(0, 14), 14); elsie.rotation.y = Math.PI; renderer.toneMappingExposure = .5; cam(V(2, 4 + p * 6, 26 + p * 10), V(0, 2, 6), 40); sunFollow(V(0, 0, 14)); return {date: '2004', focusY: .55, band: .2, tilt: 8, grade: 'rgba(255,140,80,.32)'}; },
  lic_close(t, p){ B0(barIn); barIn.updateMatrixWorld(true); const w = barIn.userData.lic.getWorldPosition(V(0, 0, 0)); cam(V(w.x - 1.0, w.y + .1, w.z + 3.2 - p * .5), w, 36); return {recon: true, tilt: 4, focusY: .45, band: .16}; },
  tavern_sign(t, p){ P0(); tavern.updateMatrixWorld(true); const s = tavern.localToWorld(V(0, 4.2, 4.02)); const e = tavern.localToWorld(V(1.2 - p, 3.6, 23)); cam(e, s, 38); sunFollow(s); return {focusY: .45, band: .2, tilt: 6}; },
  tavern_exterior(t, p){ P0(...trucks); trucks[0].position.set(-3.5, 0, 18); trucks[0].rotation.y = 0; trucks[1].position.set(-3.5, 0, 30); trucks[1].rotation.y = Math.PI;
    cam(V(-5 + p * 2, 8, 60), V(6, 2.5, 20), 38); sunFollow(V(4, 0, 22)); return {focusY: .55, band: .2, tilt: 8}; },
  tavern_interior(t, p){ B0(barIn, elsie); barIn.updateMatrixWorld(true); const e = barIn.localToWorld(V(1.5, 0, -4.4)); elsie.position.copy(e); elsie.rotation.y = Math.PI; oldMood(elsie, 'calm');
    const c = barIn.localToWorld(V(0, 2, -3)); cam(barIn.localToWorld(V(-4 + p * 2, 3.4, 6.5)), c, 42); return {focusY: .5, band: .2, tilt: 5}; },
  library_shot(t, p){ B0(library); library.updateMatrixWorld(true); cam(library.localToWorld(V(-3 + p * 4, 3, 5.5)), library.localToWorld(V(0, 3.2, -4.4)), 42); return {focusY: .5, band: .2, tilt: 5}; },
  library_books(t, p){ B0(library); library.updateMatrixWorld(true); cam(library.localToWorld(V(-4.5 + p * 1.2, 2.8, .4)), library.localToWorld(V(-4.5 + p * 1.2, 2.6, -4.2)), 40); return {focusY: .5, band: .14, tilt: 4}; },
  tax_doc(t, p){ B0(barIn, taxPaper); barIn.updateMatrixWorld(true); const w = barIn.localToWorld(V(-1, 1.43, -2)); taxPaper.position.copy(w); taxPaper.rotation.set(-Math.PI / 2, 0, .15); cam(V(w.x + .3, w.y + 2.6 - p * .3, w.z + 1.2), w, 40); return {recon: true, tilt: 4, focusY: .5, band: .16}; },
  dusk_end(t, p){ P0(); renderer.toneMappingExposure = .45; cam(V(-40 + p * 10, 22, 80 - p * 10), V(6, 3, 22), 40); sunFollow(V(0, 0, 20)); return {brand: true, focusY: .5, band: .25, tilt: 8, grade: 'rgba(255,130,70,.35)'}; },
};
