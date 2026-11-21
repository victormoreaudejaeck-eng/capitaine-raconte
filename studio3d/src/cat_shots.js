
// ===================== Moustache : plans =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const K0 = (...x) => { cLook2(); only(sky, town, clouds, ...x); if (me.userData.tie) me.userData.tie.visible = false; bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; balcony.position.set(0, 0, -58); entry.position.set(-5.6, 0, 58); moustache.userData.sash.visible = false; catLoaf(false); moustache.rotation.set(0, 0, 0); };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
function face(p, x, z){ p.rotation.y = Math.atan2(x - p.position.x, z - p.position.z); }
function catIdle(t){ const u = moustache.userData; u.tail.rotation.y = Math.sin(t * 2) * .5; u.head.rotation.y = Math.sin(t * .7) * .2; }
const SHOTS = {
  arrive_sign(t, p){ K0(entry, me); place(me, -2.8, 66 - p * 6, Math.PI, 'neutral'); bWalk(me, t, .9); cam(V(-7, 3.6, 77), V(-5, 3.4, 58), 40); sunFollow(V(-4, 0, 60)); return {}; },
  town_wide_cat(t, p){ K0(...reds.slice(0, 6), ...cars); cloudsMove(t); reds.slice(0, 6).forEach((c, i) => { place(c, (i % 2 ? 7.4 : -7.4), -30 + ((i * 9 + t * 2.2) % 50), i % 2 ? Math.PI : 0, 'happy'); bWalk(c, t + i, .9); });
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, -60 + ((t * 8 + i * 30) % 120)); c.rotation.y = i % 2 ? Math.PI : 0; }); cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {}; },
  balcony_cat(t, p){ K0(balcony, moustache, mayor, ...reds); moustache.position.set(.4, 5.1, -54.2); moustache.rotation.y = 0; catIdle(t); place(mayor, -1.4, -54.6, .2, 'happy'); mayor.position.y = 5.1;
    reds.forEach((c, i) => { place(c, -6 + (i % 4) * 4, -44 + Math.floor(i / 4) * 3, Math.PI, 'happy'); c.userData.head.rotation.x = -.35; });
    cam(V(6, 7.5, -35 + p), V(0, 6, -55), 42); sunFollow(V(0, 0, -50)); return {}; },
  cat_close(t, p){ K0(balcony, moustache); moustache.position.set(.4, 5.1, -54.2); moustache.rotation.y = 0; catIdle(t); cam(V(.9, 7.4, -49.8 + p * .3), V(.4, 7.0, -53), 34); sunFollow(V(0, 0, -54)); return {stamp: 'LE VRAI CHEF'}; },
  cat_bakery(t, p){ K0(bakery, moustache, ...reds.slice(0, 3)); catLoaf(true); moustache.position.set(-16.8, 1.25, 30); moustache.rotation.y = Math.PI / 2; catIdle(t);
    reds.slice(0, 3).forEach((c, i) => { place(c, -10.5 + i * .6, 34 + i * 1.8, -Math.PI / 2, 'shock'); face(c, -16.8, 30); });
    cam(V(-9, 6.5, 30.5), V(-16.5, 1.8, 30), 42); sunFollow(V(-16, 0, 30)); return {stamp: 'BUDGET : +1 MILLION'}; },
  cat_road_jam(t, p){ K0(moustache, ...cars); catLoaf(true); moustache.position.set(0, 0, 0); moustache.rotation.y = Math.PI / 2 + Math.sin(t) * .05; catIdle(t);
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, (i % 2 ? -1 : 1) * (6 + Math.floor(i / 2) * 6)); c.rotation.y = i % 2 ? 0 : Math.PI; });
    cam(V(9 - p * 2, 7, 14), V(0, 1, 0), 40); sunFollow(V(0, 0, 0)); return {stamp: 'ROUTE FERMÉE 3 JOURS'}; },
  cat_claws(t, p){ K0(balcony, moustache); moustache.position.set(1.0, 0, -53.4); moustache.rotation.set(0, Math.PI + .6, 0); catIdle(t); cam(V(7.5, 3.2, -45.5), V(3, 1.6, -55), 40); sunFollow(V(3, 0, -54)); return {}; },
  new_mairie(t, p){ K0(balcony, crane); crane.position.set(-14, 0, -64); crane.rotation.y = .2; cam(V(18, 8, -30), V(-4, 10, -58), 42); sunFollow(V(0, 0, -58)); return {stamp: 'NOUVELLE MAIRIE'}; },
  me_buy(t, p){ K0(bakery, me, croissantC); place(me, -13.6 - (1 - p) * 1.2, 30, Math.PI / 2, 'happy'); bWalk(me, t, .6); me.userData.armR.rotation.x = -1.2; me.updateMatrixWorld(true);
    croissantC.position.copy(me.localToWorld(V(.98, 1.75, 1.15))); croissantC.rotation.set(0, Math.PI / 2, 0); cam(V(-8, 3.6, 34), V(-13.4, 2.8, 30), 40); sunFollow(V(-14, 0, 30)); return {}; },
  cat_on_croissant(t, p){ K0(bench, moustache, croissantC); bench.position.set(-7.6, 0, 10); bench.rotation.y = Math.PI / 2; croissantC.position.set(-7.6, 1.1, 10.4); croissantC.rotation.set(0, 0, 0); croissantC.visible = p < .5;
    catLoaf(true); moustache.position.set(-7.6, p < .5 ? 3 - p * 4 : 1.0, 10.2); moustache.rotation.y = Math.PI / 2; catIdle(t); cam(V(-1.8, 3.2, 15.5), V(-7.6, 1.4, 10.2), 40); sunFollow(V(-7, 0, 10)); return {}; },
  decree_shot(t, p){ K0(mayor, decree, moustache); place(mayor, -6.2, 8, Math.PI / 2, 'smug'); mayor.userData.armL.rotation.x = mayor.userData.armR.rotation.x = -1.3; decree.position.set(-5.0, 3.0, 8); decree.rotation.y = Math.PI / 2;
    catLoaf(true); moustache.position.set(-7.6, 1.0, 10.2); moustache.rotation.y = Math.PI / 2; cam(V(-1.4, 3.4, 9.5), V(-5.2, 3.0, 8), 40); sunFollow(V(-6, 0, 8)); return {}; },
  me_shock(t, p){ K0(me); place(me, -5.4, 11, Math.PI / 2 - .4, 'shock'); cam(V(-2.0, 3.5, 12.6 - p * .3), V(-5.4, 3.3, 11), 34); sunFollow(V(-5, 0, 11)); return {}; },
  me_petition(t, p){ K0(me, petition, ...reds.slice(0, 4)); place(me, 0, 4, 0, 'happy'); me.userData.armR.rotation.x = -1.6; me.updateMatrixWorld(true); petition.position.copy(me.localToWorld(V(1.1, 2.0, 1.5))); petition.rotation.y = .4;
    reds.slice(0, 4).forEach((c, i) => { place(c, -4 + i * 2.6, 9 + (i % 2), Math.PI, 'side'); face(c, 0, 4); }); cam(V(6, 3.6, 6.5), V(.4, 2.8, 4), 42); sunFollow(V(0, 0, 4)); return {bubble: 'ET SI ON VOTAIT ?'}; },
  crowd_gasp(t, p){ K0(...reds); reds.forEach((c, i) => { place(c, -5 + (i % 4) * 3.2, 9 + Math.floor(i / 4) * 2.6, Math.PI, 'shock'); c.userData.armL.rotation.z = -.8; c.userData.armR.rotation.z = .8; });
    cam(V(0, 3.6, 2 - p), V(0, 3, 12), 44); sunFollow(V(0, 0, 10)); return {}; },
  vote_line(t, p){ cLook2(); only(booth, ...reds); scene.background = new THREE.Color(0xeef1f6); hemi.intensity = 1.5; reds.forEach((c, i) => { place(c, -4 + (i % 3) * 2.2, -1.4 + Math.floor(i / 3) * 1.7 + p * .8, Math.PI, 'happy'); bWalk(c, t + i, .5); });
    cam(V(6, 8.5, 8.5), V(-1, 1.5, -1), 46); return {}; },
  ballot_box(t, p){ cLook2(); only(booth); scene.background = new THREE.Color(0xeef1f6); hemi.intensity = 1.5; const [a, b] = booth.userData.ballots; a.position.set(3, 2.6 - (p * 2 % 1) * .9, -1); b.position.set(3.1, 2.6 - ((p * 2 + .5) % 1) * .9, -.95); a.rotation.set(-Math.PI / 2 + .3, 0, 0); b.rotation.set(-Math.PI / 2 + .2, 0, .4);
    cam(V(3.6, 2.6, .9), V(3, 1.8, -1), 40); return {}; },
  results_board(t, p){ K0(balcony, results, ...reds); results.position.set(0, 3.2, -50.5); reds.forEach((c, i) => { place(c, -6 + (i % 4) * 4, -46.5 + Math.floor(i / 4) * 2, Math.PI, 'shock'); });
    cam(V(2, 6.5, -35 + p), V(0, 3.3, -50.5), 40); sunFollow(V(0, 0, -50)); return {}; },
  cat_mayor(t, p){ K0(balcony, moustache, ...reds); moustache.position.set(.4, 5.1, -54.2); moustache.rotation.y = 0; moustache.userData.sash.visible = true; catIdle(t);
    reds.forEach((c, i) => { place(c, -6 + (i % 4) * 4, -44 + Math.floor(i / 4) * 3, Math.PI, 'happy'); const j = Math.abs(Math.sin(t * 8 + i)); c.position.y = j * .5; c.userData.armL.rotation.z = -2.6; c.userData.armR.rotation.z = 2.6; });
    cam(V(-5, 8.5, -33 - p), V(0, 6, -55), 42); sunFollow(V(0, 0, -50)); return {stamp: 'ÉLU À 99 %'}; },
  tease(t, p){ K0(); cloudsMove(t); renderer.toneMappingExposure = .6; cam(V(0, 60 - p * 20, 90), V(0, 0, -120), 40); sunFollow(V(0, 0, 0)); return {tease: true, teaseA: 'PARTIE 3', teaseB: 'JE FUIS ENCORE…'}; },
  end_card(t, p){ K0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
