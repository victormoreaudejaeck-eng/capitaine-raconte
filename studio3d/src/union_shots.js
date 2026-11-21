
// ===================== Union de la gauche : plans =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const U0 = (...x) => { G0(); only(sky, town, clouds, ...x); if (me.userData.tie) me.userData.tie.visible = false; };
const UI = (grp, ...x) => { G0(); only(grp, ...x); scene.background = new THREE.Color(0xd8d2c4); scene.fog = null; hemi.intensity = 2.0; sunLight.intensity = 1.0; };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) gMood(p, mood); }
function face(p, x, z){ p.rotation.y = Math.atan2(x - p.position.x, z - p.position.z); }
const SW = (g, x, z) => { g.updateMatrixWorld(true); return g.localToWorld(V(x, 0, z)); };
const SHOTS = {
  two_towns(t, p){ U0(...folkG.slice(0, 5), ...reds.slice(0, 5)); folkG.slice(0, 5).forEach((c, i) => place(c, -3 - (i % 2) * 1.6, -6 + i * 2.2, Math.PI / 2, 'sleepy')); reds.slice(0, 5).forEach((c, i) => place(c, 3 + (i % 2) * 1.6, -6 + i * 2.2, -Math.PI / 2, 'angry'));
    cam(V(0, 6, 16 - p * 2), V(0, 2.4, -1), 44); sunFollow(V(0, 0, 0)); return {chipOverride: '🍵 VILLE GLUCKSMANN  vs  VILLE LFI 🔴'}; },
  mayor_gluck(t, p){ U0(podium, mayor); place(mayor, 0, -14.4, 0, 'zen'); mayor.position.y = 1; mayor.userData.armR.rotation.x = -1.4; cam(V(1, 4.5, -9 + p * .5), V(0, 4.2, -14.4), 38); sunFollow(V(0, 0, -12)); return {bubble: 'IL FAUT UNE UNION. CLAIRE.'}; },
  table_round(t, p){ UI(summit, ...folkG.slice(0, 3)); summit.updateMatrixWorld(true); folkG.slice(0, 3).forEach((c, i) => { const w = SW(summit, -6 + Math.cos(i * 2.1) * 3.8, Math.sin(i * 2.1) * 3.8); place(c, w.x, w.z, 0, 'zen'); face(c, SW(summit, -6, 0).x, SW(summit, -6, 0).z); });
    summit.userData.mh.rotation.z = -t * 8; cam(summit.localToWorld(V(-6 + 2, 7, 10 - p)), summit.localToWorld(V(-6, 1.6, 0)), 42); return {chipOverride: '🗓️ JOUR 3'}; },
  table_square(t, p){ UI(summit, ...reds.slice(0, 3)); reds.slice(0, 3).forEach((c, i) => { const w = SW(summit, 6 + (i - 1) * 2.4, 3.8); place(c, w.x, w.z, Math.PI, 'angry'); c.userData.armR.rotation.x = -1.8 + Math.sin(t * 8 + i) * .4; });
    cam(summit.localToWorld(V(10, 6, 11 - p)), summit.localToWorld(V(6, 1.6, 0)), 42); return {}; },
  both_tables(t, p){ UI(summit, ...folkG.slice(0, 3), ...reds.slice(0, 3)); folkG.slice(0, 3).forEach((c, i) => { const w = SW(summit, -6 + Math.cos(i * 2.1) * 3.8, Math.sin(i * 2.1) * 3.8); place(c, w.x, w.z, 0, 'zen'); face(c, SW(summit, -6, 0).x, SW(summit, -6, 0).z); });
    reds.slice(0, 3).forEach((c, i) => { const w = SW(summit, 6 + (i - 1) * 2.4, 3.8); place(c, w.x, w.z, Math.PI, 'angry'); }); cam(summit.localToWorld(V(0, 10, 18 - p * 2)), summit.localToWorld(V(0, 1.6, 0)), 44); return {stamp: 'DEUX TABLES'}; },
  hands_up(t, p){ UI(summit, ...folkG.slice(0, 5), ...reds.slice(0, 5)); [...folkG.slice(0, 5), ...reds.slice(0, 5)].forEach((c, i) => { const w = SW(summit, -7 + (i % 5) * 3.5, 4 + Math.floor(i / 5) * 2.6); place(c, w.x, w.z, Math.PI, 'happy'); c.userData.armR.rotation.x = -3.0; c.position.y = Math.abs(Math.sin(t * 9 + i)) * .35; });
    cam(summit.localToWorld(V(0, 4, -4)), summit.localToWorld(V(0, 3, 6)), 46); return {bubble: 'MOI, TÊTE DE LISTE !'}; },
  hands_close(t, p){ UI(summit, folkG[1], reds[2]); const a = SW(summit, -1, 3), b = SW(summit, 1, 3); place(folkG[1], a.x, a.z, .3, 'angry'); place(reds[2], b.x, b.z, -.3, 'angry'); folkG[1].userData.armR.rotation.x = reds[2].userData.armR.rotation.x = -3.0;
    cam(summit.localToWorld(V(0, 3.6, 9 - p)), summit.localToWorld(V(0, 3.2, 3)), 40); return {}; },
  commission_door(t, p){ UI(commission, ...folkG.slice(0, 2), ...reds.slice(0, 2)); [...folkG.slice(0, 2), ...reds.slice(0, 2)].forEach((c, i) => { const w = SW(commission, -3 + i * 2, 3 + (i % 2) * 1.2); place(c, w.x, w.z, Math.PI, 'side'); });
    cam(commission.localToWorld(V(1, 4, 13 - p)), commission.localToWorld(V(0, 4, 0)), 42); return {}; },
  union1(t, p){ U0(unions[0], ...folkG.slice(0, 4)); unions[0].position.set(-4, 0, 0); folkG.slice(0, 4).forEach((c, i) => place(c, -6 + i * 1.6, 3, 0, 'zen')); cam(V(-2, 3.8, 12 - p), V(-4, 3, 0), 40); sunFollow(V(-4, 0, 0)); return {}; },
  union2(t, p){ U0(unions[1], ...reds.slice(0, 4)); unions[1].position.set(4, 0, 0); reds.slice(0, 4).forEach((c, i) => place(c, 2 + i * 1.6, 3, 0, 'angry')); cam(V(6, 3.8, 12 - p), V(4, 3, 0), 40); sunFollow(V(4, 0, 0)); return {}; },
  union3(t, p){ U0(...unions); unions[0].position.set(-2.2, 0, 1); unions[1].position.set(2.2, 0, 1); unions[2].position.set(0, 2.4, -2);
    cam(V(0, 4.8, 19 - p * 1.5), V(0, 4.4, 0), 44); sunFollow(V(0, 0, 0)); return {stamp: '+3 PARTIS'}; },
  unanimous(t, p){ UI(summit, ...folkG.slice(0, 5), ...reds.slice(0, 5)); [...folkG.slice(0, 5), ...reds.slice(0, 5)].forEach((c, i) => { const w = SW(summit, -7 + (i % 5) * 3.5, 4 + Math.floor(i / 5) * 2.6); place(c, w.x, w.z, Math.PI, 'angry'); c.userData.armR.rotation.x = -3.0; c.userData.armL.rotation.z = -.6; });
    cam(summit.localToWorld(V(0, 5, -5)), summit.localToWorld(V(0, 3, 6)), 46); return {stamp: 'DÉSACCORD UNANIME'}; },
  rn_wins(t, p){ U0(elect); elect.position.set(0, 3.4, -6); elect.rotation.y = 0;
    cam(V(.3, 3.6, 7 - p * .8), V(0, 3.4, -6), 42); sunFollow(V(0, 0, -4)); return {}; },
  rn_smug(t, p){ U0(...citizens.slice(0, 3)); citizens.slice(0, 3).forEach((c, i) => { place(c, -1.8 + i * 1.8, 4, 0, 'smug'); }); cam(V(0, 3.6, 10.5 - p), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'MERCI LA GAUCHE !'}; },
  left_sad(t, p){ U0(...folkG.slice(0, 3), ...reds.slice(0, 3)); folkG.slice(0, 3).forEach((c, i) => place(c, -4 + i * 1.4, 4, .3, 'sleepy')); reds.slice(0, 3).forEach((c, i) => place(c, 1.4 + i * 1.4, 4, -.3, 'scared')); cam(V(0, 3.8, 13 - p), V(0, 3, 4), 40); sunFollow(V(0, 0, 4)); return {}; },
  question_union(t, p){ U0(mayor, ...reds.slice(0, 1)); place(mayor, -1, 4, .4, 'zen'); place(reds[0], 1, 4, -.4, 'angry'); cam(V(0, 3.6, 10 - p), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'L\'UNION DE LA GAUCHE, TU Y CROIS ?'}; },
  end_card(t, p){ U0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
