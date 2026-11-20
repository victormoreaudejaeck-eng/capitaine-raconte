
// ===================== "DANS CETTE VILLE, ON DIT CHOCOLATINE" : shots =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const C0 = (...extra) => { cLook(); only(sky, town, clouds, statue, ...extra); alarm(false, 0); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
function face(p, x, z){ p.rotation.y = Math.atan2(x - p.position.x, z - p.position.z); }
const SHOTS = {
  gate_wide(t, p){ C0(border, guards[0], guards[1], ...folk.slice(0, 4)); cloudsMove(t);
    place(guards[0], -1.2, 64, 0, 'angry'); place(guards[1], 4.6, 65, -.3, 'angry'); folk.slice(0, 4).forEach((f, i) => place(f, 2.5 + (i % 2) * .6, 72 + i * 2.2, Math.PI, 'neutral'));
    cam(V(16 - p * 6, 9 + p * 2, 92 - p * 4), V(0, 5, 66), 42); sunFollow(V(0, 0, 66)); return {}; },
  statue(t, p){ C0(...folk.slice(0, 6)); cloudsMove(t); const a0 = .6 + p * .5;
    folk.slice(0, 6).forEach((f, i) => { const a = i / 6 * Math.PI * 2 + .3; place(f, Math.cos(a) * 6.4, -40 + Math.sin(a) * 6.4, 0, 'happy'); face(f, 0, -40); f.rotateX(.45 + Math.sin(t * 2 + i) * .08); });
    statue.userData.big.rotation.y = .5 + t * .25;
    cam(V(Math.cos(a0) * 17, 13, -40 + Math.sin(a0) * 17), V(0, 4.2, -40), 40); sunFollow(V(0, 0, -40)); return {}; },
  gps(t, p){ cLook(); only(sky, town, clouds, gps); gps.position.set(0, 3, 4); gps.rotation.set(-.08, 0, 0);
    cam(V(-.6, 3.0, 8.4 - p * .5), V(0, 2.9, 4), 34); sunFollow(V(0, 0, 4)); return {}; },
  patrol_car(t, p){ C0(patrol); siren(t); const z = 20 - p * 22; patrol.position.set(-2.4, 0, z); patrol.rotation.y = Math.PI;
    cam(V(6.5, 2.6, z - 5), V(-2.4, 1.8, z), 40); sunFollow(V(-2, 0, z)); return {}; },
  brigade_radar(t, p){ C0(patrol, guards[0], radar); siren(t); patrol.position.set(-2.6, 0, -2); patrol.rotation.y = .3;
    place(guards[0], .6, 4, -.15, 'angry'); guards[0].userData.armR.rotation.x = -1.5; guards[0].updateMatrixWorld(true);
    radar.position.set(1.3, 2.85, 5.45); radar.rotation.set(0, -.15, 0);
    cam(V(1.0, 3.2, 9.5 - p * .8), V(.6, 3.0, 4.4), 40); sunFollow(V(0, 0, 4)); return {}; },
  me_bakery(t, p){ C0(bakery, baker, me); place(baker, -17.4, 30, Math.PI / 2, 'happy'); place(me, -12 - p * 2.6, 30.4, -Math.PI / 2, 'neutral'); bWalk(me, t, .8);
    if (me.userData.tie) me.userData.tie.visible = false; cam(V(-11, 4.6, 21), V(-15.6, 2.6, 30), 42); sunFollow(V(-16, 0, 30)); return {}; },
  me_slip(t, p){ C0(bakery, baker, me); place(baker, -17.4, 30, Math.PI / 2, 'side'); place(me, -14.6, 30.2, -Math.PI / 2, p < .45 ? 'scared' : 'happy');
    cam(V(-17.6, 3.7, 31.8), V(-14.6, 3.3, 30.2), 40); sunFollow(V(-15, 0, 30)); return {bubble: p < .45 ? 'UN PAIN AU…' : '…UNE CHOCOLATINE !'}; },
  baker_smile(t, p){ C0(bakery, baker); place(baker, -17.4, 30, Math.PI / 2, 'happy'); baker.userData.armR.rotation.x = -1.4;
    const c = trayChocos[3]; c.visible = true; cam(V(-13.4, 3.7, 30.6), V(-17.2, 3.2, 30), 38); sunFollow(V(-16, 0, 30)); return {}; },
  bag_close(t, p){ C0(bakery, me, bag); place(me, -14.6, 30.2, -Math.PI / 2, 'happy'); me.updateMatrixWorld(true);
    bag.position.set(-15.9, 2.0, 28.4); bag.rotation.set(0, -Math.PI / 2, .05);
    cam(V(-18.9, 2.4, 27.8 - p * .3), V(-15.9, 2.0, 28.4), 36); sunFollow(V(-15, 0, 30)); return {}; },
  alarm_bag(t, p){ C0(bakery, me, bag, baker, ...folk.slice(0, 5)); place(me, -14.6, 30.2, -Math.PI / 2, 'scared'); bag.position.set(-15.9, 2.0, 28.4); bag.rotation.set(0, -Math.PI / 2, 0);
    place(baker, -17.4, 30, Math.PI / 2, 'shock'); baker.userData.armR.rotation.x = -1.6;
    folk.slice(0, 5).forEach((f, i) => { place(f, -11 + (i % 3) * 1.8, 25 + i * 2.6, 0, 'shock'); face(f, -14.6, 30.2); });
    cam(V(-17.6 + Math.sin(t * 40) * .06, 4.4, 34), V(-14, 2.8, 29.5), 46); sunFollow(V(-15, 0, 30)); return {alarmFx: true, alarmText: '🚨 PAIN AU CHOCOLAT 🚨'}; },
  arrest(t, p){ C0(bakery, me, patrol, guards[0], guards[1]); siren(t); patrol.position.set(-8, 0, 24); patrol.rotation.y = 0;
    place(me, -13.4, 30.2, Math.PI / 2, 'scared'); place(guards[0], -13.4, 28.9, 0, 'angry'); place(guards[1], -13.4, 31.5, Math.PI, 'angry');
    guards[0].userData.armL.rotation.x = guards[1].userData.armR.rotation.x = -1.2; me.userData.armL.rotation.z = .4; me.userData.armR.rotation.z = -.4; me.position.x += p * 1.2; guards[0].position.x += p * 1.2; guards[1].position.x += p * 1.2;
    cam(V(-6.5, 3.8, 37.5), V(-12.5, 2.4, 30.5), 42); sunFollow(V(-12, 0, 30)); return {alarmFx: true, alarmText: '🚨 PAIN AU CHOCOLAT 🚨'}; },
  war_map(t, p){ cLook(); only(warMap, baker, guards[0], guards[1]); scene.background = new THREE.Color(0x0d0a08); scene.fog = null; hemi.intensity = .35; sunLight.intensity = .2;
    warMap.position.set(0, 0, 0); place(baker, 0, -4.4, 0, 'angry'); place(guards[0], -4.4, 0, Math.PI / 2, 'angry'); place(guards[1], 4.4, 0, -Math.PI / 2, 'angry');
    [baker, guards[0], guards[1]].forEach(g => { g.rotateX(.25); g.userData.armL.rotation.x = g.userData.armR.rotation.x = -.9; });
    cam(V(0, 8.5 - p, 6.5 - p * .6), V(0, 2.3, -.3), 44); return {}; },
  war_tease(t, p){ C0(...folk); cloudsMove(t); renderer.toneMappingExposure = .6; statue.userData.big.rotation.y = .5 + t * .25;
    folk.forEach((f, i) => { place(f, (i % 2 ? 1 : -1) * (5 + Math.floor(i / 2) * 1.6), -30 + (i % 4) * .8, i % 2 ? -Math.PI / 2 : Math.PI / 2, 'angry'); f.userData.armR.rotation.x = -2.6; });
    cam(V(0, 9 + p * 3, -10 + p * 2), V(0, 3, -34), 44); sunFollow(V(0, 0, -34)); return {tease: true, teaseA: 'PARTIE 3', teaseB: 'LA GUERRE DES VIENNOISERIES'}; },
  end_card(t, p){ C0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
