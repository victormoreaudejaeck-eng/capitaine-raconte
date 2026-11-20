
// ===================== « DANS CETTE VILLE, TOUT LE MONDE VOTE LFI » : plans =====================
const comrades = Array.from({length: 16}, (_, i) => makeBlocky({shirt: [0xc9462c, 0xe76f51, 0x9b2335, 0xf4a261, 0xd62828, 0x6d597a, 0xe63946, 0x8d99ae][i % 8], pants: [0x2a2a3a, 0x3a4a6a, 0x5a4a3a][i % 3], hair: [0x2a1d14, 0x8a5a2a, 0x1a1410, 0xd9a050, 0x6a3a1a][i % 5], messy: i % 2 === 0, mood: 'neutral'}));
const crowdAll = [...reds, ...comrades]; ALL.push(...comrades);
const F0 = (...x) => { fLook(); only(sky, town, clouds, ...x); if (me.userData.tie) me.userData.tie.visible = false; bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; };
const IN = (...x) => { fLook(); only(...x); scene.background = new THREE.Color(0xd8d2c4); scene.fog = null; hemi.intensity = 2.0; sunLight.intensity = 1.2; sunLight.position.set(10, 40, 420); sunLight.target.position.set(0, 0, 400); };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
function face(p, x, z){ p.rotation.y = Math.atan2(x - p.position.x, z - p.position.z); }
function sitAll(list, chairs, t, opt = {}){ list.forEach((c, i) => { const ch = chairs[i + (opt.offset || 0)]; if (!ch){ c.visible = false; return; } c.visible = true; bRest(c); bMood(c, opt.mood || 'neutral'); const w = ch.getWorldPosition(V(0, 0, 0)); c.position.set(w.x, -.15, w.z - .05); c.rotation.y = Math.PI;
  c.userData.legL.rotation.x = c.userData.legR.rotation.x = -1.5; if (opt.droop) c.userData.head.rotation.x = .4 + Math.sin(t + i) * .05; if (opt.hands) c.userData.armR.rotation.x = -2.9 + Math.sin(t * 6 + i) * .1; }); }
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const SHOTS = {
  town_red_wide(t, p){ F0(...crowdAll.slice(0, 10), ...cars); cloudsMove(t); crowdAll.slice(0, 10).forEach((c, i) => { place(c, (i % 2 ? 7.4 : -7.4), -30 + ((i * 7 + t * 2.4) % 50), i % 2 ? Math.PI : 0, 'happy'); bWalk(c, t + i, .9); });
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, -60 + ((t * 8 + i * 30) % 120)); c.rotation.y = i % 2 ? Math.PI : 0; });
    cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {}; },
  ag_hall(t, p){ IN(gym, ...crowdAll); gym.updateMatrixWorld(true); sitAll(crowdAll.slice(1), gym.userData.chairs, t, {mood: 'side'}); const sp = crowdAll[0]; const w = gym.localToWorld(V(0, 0, -12.6)); place(sp, w.x, w.z, 0, 'angry'); sp.userData.armR.rotation.x = -2.6 + Math.sin(t * 7) * .3;
    cam(V(9 - p * 3, 9, 412), V(0, 2.5, 392), 44); return {bubble: 'JE DEMANDE LA PAROLE !'}; },
  bakery_debate(t, p){ F0(bakery, bigBread, ...crowdAll.slice(0, 7)); bigBread.position.set(-16.8, 1.5, 30); bigBread.rotation.set(0, 0, Math.PI / 2); bigBread.material.color.set(0xd9a050);
    crowdAll.slice(0, 7).forEach((c, i) => { const a = -1.2 + i * .4; place(c, -16.8 + Math.cos(a) * 4.2, 30 + Math.sin(a) * 4.2, 0, i % 2 ? 'angry' : 'side'); face(c, -16.8, 30); c.userData.armR.rotation.x = -1.6 + Math.sin(t * 6 + i) * .5; });
    cam(V(-6.5, 5, 36), V(-15.5, 2.4, 30), 44); sunFollow(V(-16, 0, 30)); return {bubble: '1,10 € ? MOTION REJETÉE !'}; },
  cold_bread(t, p){ F0(bakery, bigBread); bigBread.position.set(-15, 2.4, 30); bigBread.rotation.set(0, t * .5, Math.PI / 2); bigBread.material.color.set(0xb8c8d8);
    cam(V(-12.5, 2.7, 31.6), V(-15, 2.4, 30), 34); sunFollow(V(-15, 0, 30)); return {stamp: 'FROIDE'}; },
  traffic_vote(t, p){ F0(voteBoard, ...crowdAll.slice(0, 4)); voteBoard.position.set(0, 3.4, 10); voteBoard.rotation.y = 0;
    crowdAll.slice(0, 4).forEach((c, i) => { place(c, (i % 2 ? 1 : -1) * (3.4 + Math.floor(i / 2) * 1.5), 11.5 + Math.floor(i / 2) * .8, 0, 'happy'); face(c, 0, 10); });
    cam(V(.6, 3.6, 17.5 - p * .6), V(0, 3.2, 10), 40); sunFollow(V(0, 0, 10)); return {}; },
  all_red_jam(t, p){ F0(tl1, tl2, ...cars); tl1.position.set(5.6, 0, -34); tl2.position.set(-5.6, 0, -46); tl2.rotation.y = Math.PI;
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, i % 2 ? -52 - Math.floor(i / 2) * 6 : -28 + Math.floor(i / 2) * 6); c.rotation.y = i % 2 ? Math.PI : 0; });
    cam(V(12 - p * 3, 7, -14), V(0, 3, -40), 42); sunFollow(V(0, 0, -40)); return {stamp: 'ROUGE. POUR TOUJOURS.'}; },
  mayor_office(t, p){ IN(office); sunLight.position.set(10, 40, 520); sunLight.target.position.set(0, 0, 500); cam(V(0, 6 - p, 528 - p * 3), V(0, 2, 486), 46); return {}; },
  me_bakery(t, p){ F0(bakery, me, voteSign); place(me, -14.4, 30.4, -Math.PI / 2, p < .5 ? 'happy' : 'shock'); voteSign.position.set(-16.05, 2.0, 29.2); voteSign.rotation.y = Math.PI / 2;
    cam(V(-17.4, 3.6, 33.2), V(-14.4, 3.1, 30.4), 40); sunFollow(V(-15, 0, 30)); return {}; },
  vote_sign(t, p){ F0(bakery, voteSign); voteSign.position.set(-16.05, 2.0, 29.2); voteSign.rotation.y = Math.PI / 2; cam(V(-12.4, 2.4, 29.5 - p * .3), V(-16.05, 2.0, 29.2), 36); sunFollow(V(-16, 0, 29)); return {}; },
  meeting_day1(t, p){ IN(gym, me, ...crowdAll); gym.updateMatrixWorld(true); sitAll([me, ...crowdAll], gym.userData.chairs, t, {mood: 'neutral'}); bMood(me, 'happy');
    const ck = gym.userData.clock; ck.mh.rotation.z = -t * 6; ck.hh.rotation.z = -t * .5; cam(V(-11, 6, 404), V(4, 3, 391), 44); return {chipOverride: '🗓️ JOUR 1'}; },
  meeting_night(t, p){ IN(gym, me, ...crowdAll); hemi.intensity = .6; scene.background = new THREE.Color(0x3a3630); gym.userData.lights.forEach(l => l.material.color.set(0x6a6658)); gym.updateMatrixWorld(true);
    sitAll([me, ...crowdAll], gym.userData.chairs, t, {mood: 'side', droop: true}); bMood(me, 'scared'); const ck = gym.userData.clock; ck.mh.rotation.z = -t * 9; ck.hh.rotation.z = -t * .8;
    cam(V(10, 5, 403), V(-2, 2.5, 392), 44); return {chipOverride: '🗓️ JOUR 3'}; },
  empty_streets(t, p){ F0(bakery, closedSign); gym.userData.lights.forEach(l => l.material.color.set(0xfff6dd)); closedSign.position.set(-17.8, 2.6, 30); closedSign.rotation.y = Math.PI / 2;
    cam(V(4 - p * 2, 3.2, 44 - p * 6), V(-2, 3, 0), 44); sunFollow(V(0, 0, 20)); return {}; },
  closed_shops(t, p){ F0(bakery, closedSign); closedSign.position.set(-17.8, 2.6, 30); closedSign.rotation.y = Math.PI / 2; cam(V(-12.4, 2.8, 31.4 - p * .4), V(-17.8, 2.6, 30), 36); sunFollow(V(-17, 0, 30)); return {}; },
  vote_hands(t, p){ IN(gym, me, ...crowdAll); gym.updateMatrixWorld(true); sitAll([me, ...crowdAll], gym.userData.chairs, t, {mood: 'happy', hands: true}); bMood(me, 'happy');
    cam(V(0, 7, 382 + p), V(0, 2.5, 398), 46); return {bubble: 'ADOPTÉ À L\'UNANIMITÉ !'}; },
  croissant_hero(t, p){ IN(gym, croissant, plate); gym.updateMatrixWorld(true); const w = gym.localToWorld(V(2.6, 0, -14)); plate.position.set(w.x, 1.17, w.z); croissant.position.set(w.x, 1.65, w.z); croissant.rotation.y = t * .6; croissant.scale.setScalar(.75);
    cam(V(w.x + 2.6, 3.4, w.z + 3.6 - p * .4), V(w.x, 1.6, w.z), 38); return {}; },
  croissant_cut(t, p){ IN(gym, plate, crumbs, knife); gym.updateMatrixWorld(true); const w = gym.localToWorld(V(2.6, 0, -14)); plate.position.set(w.x, 1.17, w.z); const m4 = new THREE.Matrix4(); const r = rng(5); const k = Math.min(1, p * 1.6);
    for (let i = 0; i < 300; i++){ const a = r() * Math.PI * 2, d = r() * 1.7 * k; m4.makeRotationFromEuler(new THREE.Euler(r() * 3, r() * 3, r() * 3)); m4.setPosition(w.x + Math.cos(a) * d, 1.32 + r() * .08, w.z + Math.sin(a) * d); crumbs.setMatrixAt(i, m4); } crumbs.instanceMatrix.needsUpdate = true;
    knife.position.set(w.x + 1.2, 1.5 + Math.abs(Math.sin(t * 14)) * .4, w.z - .2); knife.rotation.set(0, -.6, 0);
    cam(V(w.x + 1.4, 4.6, w.z + 3.4), V(w.x, 1.3, w.z), 40); return {stamp: '300 PARTS'}; },
  crumb_close(t, p){ IN(gym, me, crumb); gym.updateMatrixWorld(true); const w = gym.localToWorld(V(0, 0, -8)); place(me, w.x, w.z, 0, 'shock'); me.userData.armR.rotation.x = -1.4; me.updateMatrixWorld(true);
    crumb.scale.setScalar(1.6); crumb.position.set(w.x + .98, 2.85, w.z + 1.45); cam(V(w.x + 1.0, 3.5, w.z + 4.4 - p * .5), V(w.x + .7, 3.0, w.z + 1.0), 36); return {}; },
  tease(t, p){ F0(); cloudsMove(t); renderer.toneMappingExposure = .6; cam(V(0, 60 - p * 20, 90), V(0, 0, -120), 40); sunFollow(V(0, 0, 0)); return {tease: true, teaseA: 'PARTIE 2', teaseB: 'LA VILLE OÙ PERSONNE NE VOTE'}; },
  end_card(t, p){ F0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
