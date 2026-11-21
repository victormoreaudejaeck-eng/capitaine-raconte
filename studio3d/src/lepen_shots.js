
// ===================== Marine Le Pen : plans =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const L0 = (...x) => { townLook(); only(sky, town, clouds, ...x); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; };
const LI = (grp, ...x) => { townLook(); only(grp, ...x); scene.background = new THREE.Color(0xd8d2c4); scene.fog = null; hemi.intensity = 2.0; sunLight.intensity = 1.0; };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
const CW = (x, y, z) => { court.updateMatrixWorld(true); return court.localToWorld(V(x, y, z)); };
citizens.slice(0, 12).forEach(c => { const b = badgeOn(c, 2.55, .45, .62); b.position.x = .34; });
const SHOTS = {
  town_wide(t, p){ L0(...citizens.slice(0, 10), ...cars); cloudsMove(t); citizens.slice(0, 10).forEach((c, i) => { place(c, (i % 2 ? 7.4 : -7.4), -30 + ((i * 7 + t * 2.4) % 50), i % 2 ? Math.PI : 0, 'smug'); bWalk(c, t + i, .9); });
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, -60 + ((t * 8 + i * 30) % 120)); c.rotation.y = i % 2 ? Math.PI : 0; }); cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {chipOverride: '🇫🇷 PRÉSIDENTE : MARINE'}; },
  marine_podium(t, p){ L0(podium, marine); place(marine, 0, -14.4, 0, 'smug'); marine.position.y = 1; marine.userData.armR.rotation.x = -2.6 + Math.sin(t * 4) * .2; cam(V(1, 4.6, -8.5 + p * .5), V(0, 4.3, -14.4), 38); sunFollow(V(0, 0, -12)); return {}; },
  badge_crowd(t, p){ L0(...citizens.slice(0, 8)); citizens.slice(0, 8).forEach((c, i) => place(c, -4.2 + (i % 4) * 2.8, 2 + Math.floor(i / 4) * 2.4, 0, 'happy')); cam(V(0, 4.4, 15 - p), V(0, 3.2, 3), 44); sunFollow(V(0, 0, 3)); return {stamp: 'TOUS ASSISTANTS'}; },
  baker_shot(t, p){ L0(bakery, baker); place(baker, -16.6, 30, Math.PI / 2, 'happy'); baker.userData.armR.rotation.x = -1.2; cam(V(-10.5 + p * .4, 3.5, 31.5), V(-16.6, 3.0, 30), 40); sunFollow(V(-16, 0, 30)); return {chipOverride: '🥖 LE BOULANGER'}; },
  mechanic_shot(t, p){ L0(mechanic, cars[0]); cars[0].position.set(2.6, 0, 3); cars[0].rotation.y = 0; place(mechanic, -.2, 6, .2, 'neutral'); mechanic.userData.armR.rotation.x = -1.0 + Math.sin(t * 6) * .3; cam(V(.4, 3.4, 12 - p * .6), V(.2, 2.9, 5.5), 40); sunFollow(V(0, 0, 5)); return {chipOverride: '🔧 LE GARAGISTE'}; },
  cat_shot(t, p){ L0(cat); cat.position.set(0, 0, 4); cat.rotation.y = 0; cat.userData.tail.rotation.z = Math.sin(t * 3) * .4; cam(V(.3, 1.7, 8.2 - p * .5), V(0, 1.2, 4), 40); sunFollow(V(0, 0, 4)); return {stamp: 'MÊME LE CHAT'}; },
  env_rain(t, p){ L0(...citizens.slice(0, 6), ...envs); citizens.slice(0, 6).forEach((c, i) => { place(c, -3.6 + (i % 3) * 3.6, 1 + Math.floor(i / 3) * 3, 0, 'happy'); c.userData.armR.rotation.x = c.userData.armL.rotation.x = -2.9; });
    envs.forEach((e, i) => { const ph = (t * .45 + i * .071) % 1; e.position.set(-5 + (i * 3.7) % 10, 11 - ph * 10, -1 + (i * 2.3) % 6); e.rotation.set(t * 2 + i, i, t * 1.5 + i * .7); });
    cam(V(0, 4.6, 19 - p), V(0, 4.2, 2), 44); sunFollow(V(0, 0, 2)); return {chipOverride: '💶 PAYÉS PAR LE PARLEMENT EUROPÉEN'}; },
  never_seen(t, p){ L0(...citizens.slice(0, 3)); citizens.slice(0, 3).forEach((c, i) => { place(c, -1.9 + i * 1.9, 4, 0, 'side'); c.userData.head.rotation.y = Math.sin(t * 2 + i * 2) * .5; c.userData.armL.rotation.z = .5; c.userData.armR.rotation.z = -.5; });
    cam(V(0, 3.6, 10.5 - p), V(0, 3.1, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'ELLE RESSEMBLE À QUOI ?'}; },
  stop_bxl(t, p){ L0(podium, marine, stopBxl); stopBxl.position.set(0, 6.9, -15.5); place(marine, 0, -14.4, 0, 'angry'); marine.position.y = 1; marine.userData.armR.rotation.x = -3.0 + Math.abs(Math.sin(t * 6)) * .3; cam(V(.4, 5.2, -3.6 + p * .5), V(0, 5.3, -14.6), 42); sunFollow(V(0, 0, -12)); return {}; },
  env_count(t, p){ L0(marine, ...envs.slice(0, 9)); place(marine, 0, 3, 0, 'happy'); marine.userData.armR.rotation.x = marine.userData.armL.rotation.x = -1.3;
    envs.slice(0, 8).forEach((e, i) => { e.position.set(0, 2.25 + i * .065, 4.05); e.rotation.set(0, (i % 3 - 1) * .08, 0); }); const e9 = envs[8]; e9.position.set(.75, 2.55 + Math.abs(Math.sin(t * 5)) * .15, 4.2); e9.rotation.set(-1.0, .3, Math.sin(t * 5) * .3);
    cam(V(.3, 3.4, 8.2 - p * .5), V(0, 2.9, 3.5), 40); sunFollow(V(0, 0, 3)); return {chipOverride: '😍 SON ARGENT, ELLE ADORE'}; },
  exit_wide(t, p){ L0(exitSign, me); exitSign.position.set(0, 0, -4); exitSign.rotation.y = 0; place(me, 1.2, 2 - p * 1.5, Math.PI, null); bWalk(me, t, .9); cam(V(-1, 4.2, 13 - p), V(0, 4.2, -4), 42); sunFollow(V(0, 0, -2)); return {}; },
  exit_plaque(t, p){ L0(exitSign); exitSign.position.set(0, 0, -4); exitSign.rotation.y = 0; cam(V(.3, 3.1, 1.6 - p * .4), V(0, 3.0, -4), 40); sunFollow(V(0, 0, -2)); return {stamp: 'PAYÉ PAR L\'EUROPE'}; },
  court_wide(t, p){ LI(court, ...judges, marine); judges.forEach((j, i) => { const w = CW(-3 + i * 3, 0, -6.6); place(j, w.x, w.z, 0, 'neutral'); j.position.y = .9; }); const m = CW(0, 0, 2.5); place(marine, m.x, m.z, Math.PI, 'scared');
    cam(CW(5 - p, 6, 13), CW(0, 3, -5), 44); return {chipOverride: '⚖️ LA JUSTICE S\'EN MÊLE'}; },
  judges_close(t, p){ LI(court, ...judges); judges.forEach((j, i) => { const w = CW(-2.4 + i * 2.4, 0, -6.6); place(j, w.x, w.z, 0, 'angry'); j.position.y = .9; }); judges[1].userData.armR.rotation.x = -2.6;
    cam(CW(0, 4.4, 2.5 - p * .6), CW(0, 4.0, -6.6), 42); return {stamp: 'CONDAMNÉE EN APPEL'}; },
  bracelet_close(t, p){ LI(court, judges[1], bracelet); const w = CW(0, 0, -6.6); place(judges[1], w.x, w.z, 0, 'smug'); judges[1].position.y = .9; judges[1].userData.armR.rotation.x = -1.5; bracelet.position.copy(CW(.9, 3.5, -4.9)); bracelet.rotation.set(0, Math.sin(t * 2) * .5, 0);
    cam(CW(.6, 3.8, .6 - p * .4), CW(.4, 3.6, -5.4), 40); return {chipOverride: '⛓️ 1 AN FERME · BRACELET'}; },
  marine_poster(t, p){ L0(poster2027, marine); poster2027.position.set(-.9, 0, -2); poster2027.rotation.y = 0; place(marine, 2.1, 2.8, -.3, 'smug'); marine.userData.armR.rotation.x = -2.8 + Math.sin(t * 6) * .3; cam(V(0, 4.0, 14 - p), V(0, 3.8, -1), 42); sunFollow(V(0, 0, 0)); return {chipOverride: '⚖️ POURVOI EN CASSATION'}; },
  queue_shot(t, p){ L0(queueSign, ...citizens); queueSign.position.set(3.2, 0, -2); queueSign.rotation.y = 0; citizens.forEach((c, i) => { place(c, 3.2 + Math.sin(i * 1.7) * .3, 1 + i * 2.1, Math.PI, 'happy'); c.position.y = Math.abs(Math.sin(t * 5 + i)) * .12; });
    cam(V(-7 + p, 7, 16), V(3, 2.5, 4), 44); sunFollow(V(3, 0, 6)); return {stamp: 'ON RECRUTE'}; },
  poster_close(t, p){ L0(poster2027); poster2027.position.set(0, 0, -2); poster2027.rotation.y = 0; cam(V(0, 4.4, 12.5 - p * .8), V(0, 4.3, -2), 40); sunFollow(V(0, 0, 0)); return {}; },
  question_lp(t, p){ L0(marine, citizens[0]); place(marine, -1, 4, .4, 'smug'); place(citizens[0], 1, 4, -.4, 'side'); cam(V(0, 3.6, 10 - p), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'MARINE 2027 : OUI OU NON ?'}; },
  end_card(t, p){ L0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
