
// ===================== « DANS CETTE VILLE… ET C'EST VRAI » : Sarpourenx — plans =====================
const V0 = (...x) => { vLook(); only(sky, VG, ...x); };
const D0 = (...x) => { vLook(); only(deskGroup, ...x); scene.background = new THREE.Color(0x0e0b08); scene.fog = null; hemi.intensity = .35; hemi.color.set(0xffe2c0); sunLight.intensity = 1.6; sunLight.color.set(0xffd2a0); sunLight.position.set(-6, 14, 6); sunLight.target.position.set(0, 0, 0); };
const BRD = () => mairie.userData.board;
const boardW = () => { BRD().updateMatrixWorld(true); return BRD().localToWorld(V(0, 2.1, .12)); };
function pinArrete(){ const b = BRD(); b.updateMatrixWorld(true); pinned.position.copy(boardW()); pinned.quaternion.copy(b.quaternion); pins.forEach((pn, i) => { pn.position.copy(b.localToWorld(V(i ? .38 : -.38, 2.72, .16))); }); }
function front(dist, h = 0, side = 0){ const b = BRD(); b.updateMatrixWorld(true); return b.localToWorld(V(side, 2.1 + h, .12 + dist)); }
const SHOTS = {
  aerial_village(t, p){ V0(); cam(V(70 - p * 14, 44 - p * 8, 105 - p * 18), V(-6, 4, -12), 40); sunFollow(V(0, 0, 0)); return {lower: ['SARPOURENX', 'Pyrénées-Atlantiques · France'], focusY: .52, band: .2, tilt: 9}; },
  church_close(t, p){ V0(); const a = .75 + p * .25; cam(V(-4 + Math.cos(a) * 27, 9, -6 + Math.sin(a) * 27), V(-5, 13, -9), 40); sunFollow(V(-4, 0, -6)); return {focusY: .42, band: .24, tilt: 6}; },
  vrai_street(t, p){ V0(); cam(V(-46 + p * 3, 10, 46 - p * 3), V(-4, 8, -6), 36); sunFollow(V(-4, 0, 8)); return {vrai: true, focusY: .55, band: .2, tilt: 7}; },
  cemetery_crane(t, p){ V0(); cemetery.updateMatrixWorld(true); const c = cemetery.localToWorld(V(0, 0, 0)); cam(V(c.x + 17, 8 + p * 9, c.z + 19 - p * 3), V(c.x, 1, c.z), 42); sunFollow(c); return {date: 'MARS 2008', focusY: .58, band: .17, tilt: 10}; },
  tribunal_desk(t, p){ D0(); const u = deskGroup.userData; u.hand.visible = false; u.pen.position.set(2.9, .33, 1.4); u.pen.rotation.set(0, .5, 0);
    const k = clamp((p - .3) / .12, 0, 1); u.stamp.visible = k > 0; u.stamp.scale.setScalar(1.8 - .8 * k); u.stamp.material.opacity = k;
    cam(V(-1.1, 4.0 - p * .4, 2.4), V(-1.3, .26, .25), 42); return {recon: true, tilt: 5, focusY: .5, band: .2, grade: 'rgba(255,160,80,.32)'}; },
  sign_desk(t, p){ D0(); const u = deskGroup.userData; u.stamp.visible = true; u.stamp.scale.setScalar(1); u.stamp.material.opacity = 1; u.hand.visible = true;
    const sx = .9 + p * 1.0, sy = Math.sin(p * 30) * .05; u.hand.position.set(sx + .25, .55, -.55 + sy + .35); u.hand.rotation.set(-.15, -.35, 0);
    u.pen.position.set(sx, .5, -.2 + sy); u.pen.rotation.set(0, .9, -.55);
    cam(V(3.0, 3.0, 2.6), V(1.4, .3, -.1), 40); return {recon: true, tilt: 6, focusY: .52, band: .18}; },
  board_pin(t, p){ V0(pinned, ...pins); pinArrete(); const c = front(0), e = front(4.6 - p * .8, .25, .6); cam(e, c, 40); sunFollow(c); return {recon: true, focusY: .45, band: .22, tilt: 6}; },
  arrete_close(t, p){ V0(pinned, ...pins); pinArrete(); const c = front(0, .12 - p * .35), e = front(1.25, .12 - p * .35, .05); cam(e, c, 38); sunFollow(c); return {recon: true, tilt: 4, focusY: .5, band: .14}; },
  villagers_worried(t, p){ V0(pinned, ...pins, papy, mamie); pinArrete();
    const pp = front(2.1, 0, -.5), pm = front(2.0, 0, .55); papy.position.set(pp.x, hillH(pp.x, pp.z), pp.z); mamie.position.set(pm.x, hillH(pm.x, pm.z), pm.z);
    const toward = (a, b) => Math.atan2(b.x - a.x, b.z - a.z); const bw = boardW();
    if (p < .45){ papy.rotation.y = toward(papy.position, bw); mamie.rotation.y = toward(mamie.position, bw); oldMood(papy, 'calm'); oldMood(mamie, 'calm'); }
    else { papy.rotation.y = toward(papy.position, mamie.position) * .7 + toward(papy.position, bw) * .3; mamie.rotation.y = toward(mamie.position, papy.position) * .7 + toward(mamie.position, bw) * .3; oldMood(papy, 'side2'); oldMood(mamie, 'side'); }
    const e = front(5.6, .2, 1.8), c = front(1.8, -.2, 0); cam(e, c, 40); sunFollow(c); return {focusY: .5, band: .2, tilt: 7}; },
  brand_end(t, p){ V0(); renderer.toneMappingExposure = .5; cam(V(-60 + p * 10, 38, 90 - p * 10), V(-6, 6, -14), 40); sunFollow(V(0, 0, 0)); return {brand: true, focusY: .5, band: .25, tilt: 9}; },
};
