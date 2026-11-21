
// ===================== Whittier : plans =====================
const W0 = (...x) => { wLook(false); only(sky, water, WG, ...x); water.position.y = 0; };
const I0 = (grp, ...x) => { wLook(false); only(grp, ...x); scene.background = new THREE.Color(0x14161c); scene.fog = null; hemi.intensity = .7; sunLight.intensity = .4; };
const SEP = 'rgba(190,140,70,.55)';
const SHOTS = {
  aerial_bay(t, p){ W0(); cam(V(50 - p * 10, 70 - p * 10, -130 + p * 20), V(0, 15, 40), 40); sunFollow(V(0, 0, 30)); return {lower: ['WHITTIER', 'Alaska · États-Unis'], focusY: .5, band: .22, tilt: 7}; },
  bay_boats(t, p){ W0(); cam(V(-34 + p * 8, 16, -46), V(-10, 0, 2), 40); sunFollow(V(-10, 0, 0)); return {focusY: .55, band: .2, tilt: 7}; },
  tower_reveal(t, p){ W0(); cam(V(44 - p * 4, 5, -24), V(0, 24 + p * 4, 40), 42); sunFollow(V(0, 0, 40)); return {vrai: true, focusY: .45, band: .25, tilt: 5}; },
  tower_up(t, p){ W0(); cam(V(16, 3, 4), V(0, 10 + p * 26, 40), 46); sunFollow(V(0, 0, 40)); return {lower: ['272 HABITANTS', '14 étages · 1 immeuble'], focusY: .5, band: .3, tilt: 4}; },
  harbor(t, p){ W0(); cam(V(46, 12, -36 - p * 6), V(0, 14, 40), 40); sunFollow(V(0, 0, 30)); return {focusY: .5, band: .22, tilt: 7}; },
  ruin_sepia(t, p){ W0(); cam(V(-30 + p * 6, 8, 15), V(-60, 10, 55), 40); sunFollow(V(-60, 0, 55)); return {date: 'GUERRE FROIDE', grade: SEP, focusY: .5, band: .22, tilt: 7}; },
  tower_sepia(t, p){ W0(); cam(V(-36, 8, -20 - p * 2), V(0, 20, 40), 42); sunFollow(V(0, 0, 40)); return {grade: SEP, focusY: .5, band: .25, tilt: 6}; },
  cut_wide(t, p){ I0(cut); cut.updateMatrixWorld(true); cam(cut.localToWorld(V(0, 12, 34 - p * 4)), cut.localToWorld(V(0, 12, 0)), 44); return {focusY: .5, band: .35, tilt: 3}; },
  cut_pan(t, p){ I0(cut); cam(cut.localToWorld(V(-3 + p * 6, 3 + p * 9, 14)), cut.localToWorld(V(-1 + p * 2, 2.4 + p * 9, -2)), 40); return {focusY: .5, band: .25, tilt: 3}; },
  cut_close(t, p){ I0(cut); cam(cut.localToWorld(V(-4 + p * 3, 8.6, 9)), cut.localToWorld(V(-1, 8.8, -2.9)), 38); return {focusY: .5, band: .2, tilt: 3}; },
  school_ext(t, p){ W0(); cam(V(8 + p * 3, 7, 38), V(32, 3, 66), 40); sunFollow(V(28, 0, 62)); return {focusY: .55, band: .2, tilt: 7}; },
  tunnel_kid(t, p){ I0(tun, kid); tun.updateMatrixWorld(true); const z = 6 - p * 14; kid.position.copy(tun.localToWorld(V(0, .3, z))); kid.rotation.y = Math.PI; oldMood(kid, 'calm'); kid.position.y += Math.abs(Math.sin(t * 8)) * .05;
    cam(tun.localToWorld(V(.6, 2.2, z + 6)), tun.localToWorld(V(0, 1.4, z - 6)), 44); return {focusY: .5, band: .25, tilt: 4}; },
  slippers_close(t, p){ I0(tun, kid); tun.updateMatrixWorld(true); kid.position.copy(tun.localToWorld(V(0, .3, 0))); kid.rotation.y = Math.PI + Math.sin(t * 3) * .1; cam(tun.localToWorld(V(.9, .6, 2.6 - p * .4)), tun.localToWorld(V(0, .35, 0)), 38); return {stamp: 'EN PANTOUFLES', focusY: .55, band: .2, tilt: 4}; },
  hallway_shot(t, p){ I0(hallway, ...neighbors); hallway.updateMatrixWorld(true); neighbors.forEach((n, i) => { n.position.copy(hallway.localToWorld(V(i % 2 ? .8 : -.8, .3, -6 + i * 4))); n.rotation.y = i % 2 ? -Math.PI / 2 : Math.PI / 2; oldMood(n, 'calm'); });
    cam(hallway.localToWorld(V(0, 1.8, 12 - p * 3)), hallway.localToWorld(V(0, 1.4, -8)), 44); return {focusY: .5, band: .25, tilt: 4}; },
  neighbors_badge(t, p){ I0(hallway, neighbors[0]); hallway.updateMatrixWorld(true); const n = neighbors[0]; n.position.copy(hallway.localToWorld(V(0, .3, -2))); n.rotation.y = 0; oldMood(n, 'calm');
    cam(hallway.localToWorld(V(.8, 1.6, 1.6 - p * .3)), hallway.localToWorld(V(.1, 1.4, -2)), 40); return {stamp: 'VOISIN = POLICIER', focusY: .5, band: .2, tilt: 4}; },
  tunnel_portal(t, p){ wLook(false); only(sky, roadTun); roadTun.userData.closed.visible = false; roadTun.userData.gate.rotation.z = Math.PI / 2.3; roadTun.updateMatrixWorld(true);
    cam(roadTun.localToWorld(V(6 - p * 2, 4, 30)), roadTun.localToWorld(V(0, 5, -6)), 42); sunLight.position.copy(roadTun.localToWorld(V(30, 60, 80))); sunLight.target.position.copy(roadTun.localToWorld(V(0, 0, 0))); renderer.toneMappingExposure = .45; return {lower: ['1 SEULE VOIE', 'voitures et trains'], focusY: .5, band: .25, tilt: 5}; },
  train_through(t, p){ wLook(false); only(sky, roadTun, train); roadTun.userData.closed.visible = false; roadTun.updateMatrixWorld(true); train.position.copy(roadTun.localToWorld(V(0, 0, 40 - p * 46))); train.rotation.y = 0;
    cam(roadTun.localToWorld(V(9, 3.5, 24)), roadTun.localToWorld(V(0, 3, 2)), 42); sunLight.position.copy(roadTun.localToWorld(V(30, 60, 80))); sunLight.target.position.copy(roadTun.localToWorld(V(0, 0, 0))); renderer.toneMappingExposure = .45; return {focusY: .5, band: .25, tilt: 5}; },
  gate_close(t, p){ wLook(true); only(sky, roadTun); roadTun.updateMatrixWorld(true); roadTun.userData.closed.visible = true; roadTun.userData.gate.rotation.z = Math.PI / 2.3 * Math.max(0, 1 - p * 2);
    cam(roadTun.localToWorld(V(9, 3.2, 14)), roadTun.localToWorld(V(2, 3, 1)), 42); sunLight.position.copy(roadTun.localToWorld(V(30, 60, 80))); sunLight.target.position.copy(roadTun.localToWorld(V(0, 0, 0))); hemi.intensity = 2.2; renderer.toneMappingExposure = .7; return {focusY: .5, band: .25, tilt: 5, grade: 'rgba(90,120,200,.2)'}; },
  car_waiting(t, p){ wLook(true); only(sky, roadTun, wcar); roadTun.updateMatrixWorld(true); roadTun.userData.closed.visible = true; roadTun.userData.gate.rotation.z = 0; wcar.position.copy(roadTun.localToWorld(V(0, 0, 9))); wcar.rotation.y = Math.PI;
    cam(roadTun.localToWorld(V(-3, 2.4, 18 - p)), roadTun.localToWorld(V(0, 1.6, 6)), 40); sunLight.position.copy(roadTun.localToWorld(V(30, 60, 80))); sunLight.target.position.copy(roadTun.localToWorld(V(0, 0, 0))); hemi.intensity = 2.2; renderer.toneMappingExposure = .7; return {chipOverride: '🌙 FERMÉ JUSQU\'À 5 H 30', focusY: .5, band: .22, tilt: 5, grade: 'rgba(90,120,200,.2)'}; },
  tower_night(t, p){ wLook(true); only(sky, water, WG); cam(V(26, 6, -8 - p * 3), V(0, 22, 40), 42); sunFollow(V(0, 0, 40)); return {focusY: .5, band: .25, tilt: 6, grade: 'rgba(90,120,200,.2)'}; },
  aerial_night(t, p){ wLook(true); only(sky, water, WG); cam(V(-50 + p * 10, 50, -110 + p * 10), V(0, 15, 40), 40); sunFollow(V(0, 0, 30)); return {brand: true, focusY: .5, band: .25, tilt: 7, grade: 'rgba(90,120,200,.2)'}; },
};
