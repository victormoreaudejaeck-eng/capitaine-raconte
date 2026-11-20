
// ===================== Longyearbyen : plans =====================
const A0 = (...x) => { aLook(false); only(sky, AG, ...x); aurora.children.forEach((m, i) => { m.material.opacity = .75 + Math.sin(performance.now() * 0 + i) * .1; }); };
function auroraWave(t){ aurora.children.forEach((m, i) => { const pa = m.geometry.attributes.position; for (let k = 0; k < pa.count; k++){ const x = pa.getX(k); pa.setZ(k, Math.sin(x * .012 + i + t * .35) * 60); } pa.needsUpdate = true; }); }
const rifle = new THREE.Mesh(new THREE.BoxGeometry(.08, 1.5, .08), vstd(0x2a2018)); rifle.position.set(-.25, 1.6, -.45); rifle.rotation.z = .5; anorak1.add(rifle);
const SHOTS = {
  aerial_arctic(t, p){ A0(); cam(V(48 - p * 10, 42 - p * 6, 115 - p * 18), V(0, 6, -40), 42); sunFollow(V(0, 0, 0)); return {lower: ['LONGYEARBYEN', 'Svalbard · Norvège'], focusY: .55, band: .2, tilt: 7, grade: 'rgba(255,170,150,.2)'}; },
  town_aurora(t, p){ A0(); auroraWave(t); cam(V(4, 4.5, 60 - p * 2), V(0, 9, -40), 44); sunFollow(V(0, 0, 20)); return {focusY: .6, band: .3, tilt: 5, grade: 'rgba(255,170,150,.18)'}; },
  houses_row(t, p){ A0(); auroraWave(t); cam(V(50 - p * 8, 10, 34), V(0, 4, 6), 40); sunFollow(V(0, 0, 10)); return {focusY: .55, band: .18, tilt: 8, grade: 'rgba(255,170,150,.18)'}; },
  pylons(t, p){ A0(); auroraWave(t); cam(V(-6 + p * 4, 5, -28), V(-40, 12, -80), 42); sunFollow(V(-30, 0, -60)); return {focusY: .5, band: .22, tilt: 6, grade: 'rgba(255,170,150,.18)'}; },
  permafrost_cut(t, p){ aLook(true); only(iceCut); scene.background = new THREE.Color(0x0b0f18); scene.fog = null; hemi.intensity = .9; iceCut.position.set(0, 0, 0);
    cam(V(0, 1.2 - p * 1.2, 9 - p * 1.5), V(0, -.5 - p * .8, 0), 44); return {date: 'ANNÉES 1950', tilt: 4, focusY: .55, band: .2}; },
  cemetery_slope(t, p){ A0(); auroraWave(t); const y = aH(-34, 32); cam(V(-20 - p * 3, y + 6, 50), V(-34, y + 1, 33), 40); sunFollow(V(-34, 0, 32)); return {focusY: .55, band: .18, tilt: 8, grade: 'rgba(255,170,150,.18)'}; },
  coffin_ice(t, p){ aLook(true); only(iceCut); scene.background = new THREE.Color(0x0b0f18); scene.fog = null; hemi.intensity = .5; iceCut.position.set(0, 0, 0);
    cam(V(.6 - p, -1.4, 3.6 - p * .4), V(0, -2.2, .3), 40); return {recon: true, tilt: 4, focusY: .5, band: .16}; },
  cemetery_sign(t, p){ A0(); const y = aH(-34, 39); cam(V(-33.2, y + 2.0, 44.5 - p * .8), V(-34, y + 1.5, 39), 38); sunFollow(V(-34, 0, 39)); return {focusY: .45, band: .2, tilt: 6, grade: 'rgba(255,170,150,.18)'}; },
  plane_takeoff(t, p){ A0(aplane); auroraWave(t); aplane.position.set(-30 + p * 70, 11 + p * p * 30, 20); aplane.rotation.set(0, 0, .12 + p * .1);
    cam(V(-6, 2.2, 62), aplane.position.clone(), 42); sunFollow(V(0, 0, 20)); return {focusY: .45, band: .3, tilt: 4, grade: 'rgba(255,170,150,.18)'}; },
  plane_sky(t, p){ A0(aplane); auroraWave(t); aplane.position.set(40 + p * 40, 70, -40); aplane.rotation.set(Math.sin(t) * .05, 0, .05);
    cam(V(aplane.position.x - 12, 74, -28), aplane.position.clone().add(V(4, 0, 0)), 42); sunFollow(aplane.position); return {focusY: .5, band: .3, tilt: 3, grade: 'rgba(255,170,150,.18)'}; },
  cat_sign(t, p){ A0(catSign); catSign.position.set(6, aH(6, 46), 46); catSign.rotation.y = .2; cam(V(6.8, aH(6, 46) + 2.7, 50 - p * .6), V(6, aH(6, 46) + 2.5, 46), 38); sunFollow(V(6, 0, 46)); return {focusY: .45, band: .2, tilt: 6, grade: 'rgba(255,170,150,.18)'}; },
  bear_sign(t, p){ A0(); const b = bearSign.position; cam(V(b.x + 1.6, b.y + 3.2, b.z + 6.5 - p), V(b.x, b.y + 3.0, b.z), 38); sunFollow(b); return {focusY: .4, band: .2, tilt: 6, grade: 'rgba(255,170,150,.18)'}; },
  bear_walk(t, p){ A0(bear, anorak1); const bz = 74 - p * 6; bear.position.set(16, aH(16, bz), bz); bear.rotation.y = Math.PI / 2 + .3; bear.userData.legs.forEach((l, i) => l.rotation.z = Math.sin(t * 5 + i * 1.6) * .35);
    anorak1.position.set(8, aH(8, 58), 58); anorak1.rotation.y = .6; oldMood(anorak1, 'side');
    cam(V(2, 3.2, 52), V(13, 2, 68), 40); sunFollow(V(12, 0, 64)); return {focusY: .5, band: .2, tilt: 7, grade: 'rgba(255,170,150,.18)'}; },
  aurora_end(t, p){ aLook(true); only(AG, aurora); auroraWave(t); cam(V(-30 + p * 10, 25, 110 - p * 10), V(0, 95, -260), 50); sunFollow(V(0, 0, 0)); return {brand: true, aurora: true, focusY: .5, band: .3, tilt: 6, grade: 'rgba(120,160,255,.2)'}; },
};
// aurore boréale dessinée en 2D (fiable en rendu logiciel), au-dessus du ciel uniquement
{ const prev = window.postFX; window.postFX = (t, fx, lt, p) => { prev(t, fx, lt, p); if (!fx.aurora) return; octx.save(); octx.globalCompositeOperation = 'screen';
  for (let band = 0; band < 3; band++){ for (let x = 0; x < W; x += 6){ const yb = 260 + band * 90 + Math.sin(x * .006 + t * .6 + band * 2) * 70 + Math.sin(x * .017 - t * .9) * 25; const hgt = 260 + Math.sin(x * .011 + band + t * .4) * 90;
      const a = (.10 + .08 * Math.sin(x * .05 + t * 3 + band)) * (fx.aurora === true ? 1 : fx.aurora); const g = octx.createLinearGradient(0, yb - hgt, 0, yb); g.addColorStop(0, 'rgba(140,60,255,0)'); g.addColorStop(.55, `rgba(70,230,190,${a})`); g.addColorStop(1, `rgba(90,255,150,${a * 1.6})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      octx.fillStyle = g; octx.fillRect(x, yb - hgt, 6, hgt + 4); } } octx.restore(); }; }
