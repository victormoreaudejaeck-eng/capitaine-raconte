
// ===================== "DANS CETTE VILLE, TOUT LE MONDE VOTE GLUCKSMANN" : shots =====================
function cloudDrift(t){ clouds.children.forEach((c, i) => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; }); }
function fg(n, cx, cz, t, opt = {}){ folkG.forEach((c, i) => { c.visible = i < n; if (i >= n) return; bRest(c); gMood(c, opt.mood || 'sleepy'); c.position.y = 0;
  const cols = opt.cols || 4, gap = opt.gap || 2.2, row = Math.floor(i / cols), col = i % cols; c.position.set(cx + (col - (cols - 1) / 2) * gap + (row % 2) * .5, 0, cz + row * gap); c.rotation.y = opt.rot ?? 0;
  if (opt.droop) c.userData.head.rotation.x = .28 + Math.sin(t * 1.2 + i) * .05;
  if (opt.walk){ bWalk(c, t + i * .4, opt.walk); c.position.z += t * opt.walk * 1.2 * (opt.dir || 1); } }); }
function lie(c, x, z, rot = 0){ bRest(c); c.rotation.set(-Math.PI / 2, 0, rot); c.position.set(x, .42, z); }
function zHeads(arr){ arr.forEach(c => c.updateMatrixWorld(true)); return arr.map(c => c.userData.head); }
const SHOTS = {
  town_wide(t, p){ G0(); cloudDrift(t); only(sky, town, clouds, ...folkG); fg(8, 0, -12, t, {walk: .3, droop: true});
    cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {}; },
  posters_street(t, p){ G0(); cloudDrift(t); cam(V(-4 + p * 2, 2.2, 34 - p * 8), V(-20, 3, 0), 44); sunFollow(V(0, 0, 0)); return {}; },
  slow_walk(t, p){ G0(); only(sky, town, clouds, ...folkG); fg(6, 0, -2, t, {walk: .25, droop: true, cols: 3, gap: 2.6});
    cam(V(6, 3.2, 11 + t * .3), V(0, 2.6, 1 + t * .3), 40); sunFollow(V(0, 0, 0)); return {}; },
  yawn_close(t, p){ G0(); only(sky, town, clouds, folkG[1], cupHero); const c = folkG[1]; bRest(c); gMood(c, p > .25 ? 'yawn' : 'sleepy'); c.position.set(0, 0, 4); c.rotation.y = 0;
    c.userData.head.rotation.x = -.15 * Math.min(1, p * 3); c.userData.armR.rotation.x = -1.1; cupHero.position.set(1.05, 1.35, 4.9); cupHero.rotation.set(0, 0, 0); cupHero.scale.setScalar(.9);
    cam(V(.4, 3.3, 10.8 - p * .8), V(.3, 2.8, 4), 36); sunFollow(V(0, 0, 4)); return {}; },
  matcha_wide(t, p){ G0(); only(sky, town, clouds, matcha, barista, ...folkG, ...cups); bRest(barista); gMood(barista, 'zen'); barista.position.set(-8.7, 0, 6); barista.rotation.y = Math.PI / 2;
    folkG.forEach((c, i) => { c.visible = i < 7; bRest(c); gMood(c, 'sleepy'); c.position.set(-5.6, 0, 7.8 + i * 1.7); c.rotation.y = Math.PI; c.userData.head.rotation.x = .2; });
    folkG[0].position.set(-6.2, 0, 6.2); folkG[0].rotation.y = -Math.PI / 2;
    cups.forEach((k, i) => { k.scale.setScalar(.7); k.position.set(-7.0, 1.42, 4.6 + i * .7); });
    cam(V(4 - p, 6.2, 21 - p), V(-7, 2.4, 8), 40); sunFollow(V(-6, 0, 8)); return {}; },
  matcha_cup(t, p){ G0(); only(sky, town, clouds, matcha, barista, cupHero); bRest(barista); gMood(barista, 'zen'); barista.position.set(-8.7, 0, 6); barista.rotation.y = Math.PI / 2;
    cupHero.scale.setScalar(1); cupHero.position.set(-7.0, 1.42, 6); cupHero.rotation.y = t * .5;
    cam(V(-2.8, 3.0 + p * .2, 7.6), V(-7.2, 2.4, 6), 40); sunFollow(V(-7, 0, 6)); return {stamp: '7,50 €'}; },
  sugar_jar(t, p){ G0(); only(sky, town, clouds, sugar); sugar.position.set(0, 0, 4); sugar.rotation.y = 0;
    cam(V(.5, 2.6, 9.8 - p * .8), V(.3, 1.7, 4), 38); sunFollow(V(0, 0, 4)); return {stamp: 'INTERDIT'}; },
  sleepy_crowd(t, p){ G0(); only(sky, town, clouds, ...folkG, zzz); fg(8, 0, 0, t, {droop: true, cols: 4, gap: 2.3}); zzzOn(zHeads(folkG.slice(0, 8)), t);
    cam(V(0, 4.6, 12 - p * 2), V(0, 3.2, 1), 44); sunFollow(V(0, 0, 0)); return {}; },
  sit_in(t, p){ G0(); only(sky, town, clouds, ...folkG, ...signs, zzz); folkG.forEach((c, i) => { c.visible = i < 8; gMood(c, 'sleepy'); lie(c, -3 + (i % 4) * 2, -2 - Math.floor(i / 4) * 5, (i % 2 ? .2 : -.2)); });
    signs.forEach((s, i) => { s.position.set(-3.2 + i * 2.1, 0, .4); s.rotation.set(0, 0, (i - 1.5) * .12); }); zzzOn(zHeads(folkG.slice(0, 8)), t);
    cam(V(4 - p * 2, 6.5, 8), V(0, 1, -3), 44); sunFollow(V(0, 0, -3)); return {}; },
  zzz_close(t, p){ G0(); only(sky, town, clouds, folkG[2], zzz, signs[0]); const c = folkG[2]; gMood(c, 'sleepy'); lie(c, 0, 0, 0); signs[0].position.set(-1.6, 0, -1.8); signs[0].rotation.set(0, 0, .05);
    zzzOn(zHeads([c]), t); cam(V(.4, 4.2, -1.6), V(0, .6, -3.3), 42); sunFollow(V(0, 0, 0)); return {}; },
  mayor_cap(t, p){ G0(); only(sky, town, clouds, podium, mayor, ...folkG); bRest(mayor); gMood(mayor, 'zen'); mayor.position.set(0, 1, -14.4); mayor.rotation.y = 0;
    mayor.userData.armR.rotation.x = -1.3 + Math.sin(t * 1.5) * .1; mayor.userData.armR.rotation.z = .3;
    fg(6, 0, -2, t, {rot: Math.PI, droop: false, cols: 3, gap: 2.4});
    cam(V(5.5 - p, 4.4, -6.2), V(-.6, 3.7, -14), 46); sunFollow(V(0, 0, -10)); return {bubble: 'IL FAUT UN CAP CLAIR.'}; },
  mayor_close(t, p){ G0(); only(sky, town, clouds, podium, mayor); bRest(mayor); gMood(mayor, 'zen'); mayor.position.set(0, 1, -14.4); mayor.rotation.y = 0;
    mayor.userData.head.rotation.z = Math.sin(t * 1.2) * .06; cam(V(.8, 4.5, -9.6 + p * .6), V(0, 4.3, -14.4), 36); sunFollow(V(0, 0, -12)); return {bubble: 'UN CAP. CLAIR.'}; },
  compass_give(t, p){ G0(); only(sky, town, clouds, podium, mayor, compass); bRest(mayor); bMood(mayor, 'happy'); mayor.position.set(0, 1, -14.4); mayor.rotation.y = 0;
    mayor.userData.armL.rotation.x = mayor.userData.armR.rotation.x = -1.2; compass.position.set(0, 3.0, -13.3); compass.rotation.set(-.3, 0, 0); compass.scale.setScalar(.55);
    compass.userData.needle.rotation.z = t * 4; cam(V(1.5, 4.4, -8.4), V(0, 3.4, -14), 40); sunFollow(V(0, 0, -12)); return {}; },
  compass_spin(t, p){ G0(); only(sky, town, clouds, compass); compass.scale.setScalar(1); compass.position.set(0, 3, 4); compass.rotation.set(-.15, 0, 0);
    compass.userData.needle.rotation.z = t * 5 + Math.sin(t * 7) * 2; cam(V(0, 3.4, 7.2), V(0, 3, 4), 36); sunFollow(V(0, 0, 4)); return {stamp: 'CAP : ???'}; },
  me_pain(t, p){ G0(); only(sky, town, clouds, me, painChoc, ...folkG.slice(0, 3)); bRest(me); bMood(me, 'happy'); me.position.set(0, 0, 4); me.rotation.y = 0; if (me.userData.tie) me.userData.tie.visible = false;
    me.userData.armR.rotation.x = -1.4; painChoc.position.set(.9, 3.0, 5.3); painChoc.rotation.set(0, .3, .15);
    folkG.slice(0, 3).forEach((c, i) => { c.visible = true; bRest(c); gMood(c, 'sleepy'); c.position.set(-4 + i * 4, 0, -2); c.rotation.y = 0; c.userData.head.rotation.x = .25; });
    cam(V(.5, 3.4, 10.5 - p), V(.3, 2.9, 4), 40); sunFollow(V(0, 0, 4)); return {}; },
  pain_close(t, p){ G0(); only(sky, town, clouds, painChoc); painChoc.position.set(0, 3, 4); painChoc.rotation.set(.2, t * .8, 0);
    cam(V(0, 3.5, 7.8 - p * .4), V(0, 3, 4), 36); sunFollow(V(0, 0, 4)); return {stamp: 'DU SUCRE ?!'}; },
  wake_up(t, p){ G0(); only(sky, town, clouds, ...folkG); fg(8, 0, -2, t, {mood: 'shock', cols: 4, gap: 2.3}); folkG.forEach((c, i) => { c.position.y = Math.abs(Math.sin(t * 9 + i)) * .5; c.userData.armL.rotation.z = -2.6; c.userData.armR.rotation.z = 2.6; });
    cam(V(Math.sin(t * 30) * .08, 4.2 + Math.cos(t * 27) * .08, 11), V(0, 3.2, -1), 44); sunFollow(V(0, 0, 0)); return {flashW: Math.max(0, 1 - p * 5) * .6}; },
  crowd_run(t, p){ G0(); only(sky, town, clouds, ...folkG); folkG.forEach((c, i) => { c.visible = true; bRest(c); bMood(c, i % 2 ? 'angry' : 'happy'); const a = t * (1.6 + i * .1) + i * .7, r = 3 + (i % 3) * 2;
      c.position.set(Math.cos(a) * r, Math.abs(Math.sin(t * 12 + i)) * .3, -2 + Math.sin(a) * r); c.rotation.y = -a; bWalk(c, t, 2.4); });
    cam(V(0, 9, 14), V(0, 1.5, -2), 46); sunFollow(V(0, 0, 0)); return {bubble: 'DÉBAT ! DÉBAT !'}; },
  crowd_sleep(t, p){ G0(); only(sky, town, clouds, ...folkG, zzz); folkG.forEach((c, i) => { c.visible = true; gMood(c, 'sleepy'); lie(c, Math.cos(i * 2.4) * (2 + i * .5), -2 + Math.sin(i * 2.4) * (2 + i * .5), i * .7); }); zzzOn(zHeads(folkG), t);
    cam(V(0, 16 - p * 3, 9 - p * 2), V(0, 0, -2), 44); sunFollow(V(0, 0, 0)); return {}; },
  next_town_tease(t, p){ G0(); renderer.toneMappingExposure = .5; cam(V(0, 60 - p * 20, 90), V(0, 0, -120), 40); sunFollow(V(0, 0, 0)); return {tease: true}; },
  end_card(t, p){ G0(); cloudDrift(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
// ---- nouvelle fin : le cap clair = la boulangerie ----
bakery.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHex() === NAVY){ o.material = o.material.clone(); o.material.color.set(0xd9a050); } });
bakery.traverse(o => { if (o.isMesh && o.material && o.material.map === POSTER_G) o.visible = false; });
const chocs = [0, 1, 2, 3, 4, 5].map(() => { const c = painChoc.clone(); scene.add(c); return c; }); ALL.push(...chocs);
Object.assign(SHOTS, {
  mayor_bite(t, p){ G0(); only(sky, town, clouds, podium, mayor, painChoc); bRest(mayor); gMood(mayor, 'sleepy'); mayor.position.set(0, 1, -14.4); mayor.rotation.y = 0;
    mayor.userData.armR.rotation.x = -2.0; mayor.userData.armR.rotation.z = .35; painChoc.position.set(.25, 4.1, -13.6); painChoc.rotation.set(0, .5, 0); painChoc.scale.set(p > .45 ? .6 : 1, 1, 1);
    cam(V(.8, 4.5, -9.4 + p * .4), V(0, 4.1, -14.2), 36); sunFollow(V(0, 0, -12)); return {}; },
  mayor_awake(t, p){ G0(); only(sky, town, clouds, podium, mayor); bRest(mayor); bMood(mayor, 'shock'); mayor.position.set(0, 1 + Math.abs(Math.sin(t * 14)) * .08, -14.4); mayor.rotation.y = 0;
    const sh = Math.max(0, 1 - p * 2) * .12; cam(V(Math.sin(t * 40) * sh, 4.5 + Math.cos(t * 37) * sh, -10.4 + p * .8), V(0, 4.3, -14.4), 34); sunFollow(V(0, 0, -12)); return {flashW: Math.max(0, 1 - p * 6) * .7}; },
  mayor_point(t, p){ G0(); only(sky, town, clouds, podium, mayor, ...folkG); bRest(mayor); bMood(mayor, 'angry'); mayor.position.set(0, 1, -14.4); mayor.rotation.y = .5;
    mayor.userData.armR.rotation.x = -1.57; mayor.userData.armR.rotation.z = .2; fg(6, 0, -2, t, {rot: Math.PI, mood: 'shock', cols: 3, gap: 2.4});
    cam(V(5.5 - p, 4.4, -6.2), V(-.6, 3.7, -14), 46); sunFollow(V(0, 0, -10)); return {bubble: 'CAP : LA BOULANGERIE !'}; },
  rush_bakery(t, p){ G0(); only(sky, town, clouds, bakery, ...folkG); bakery.position.set(0, 0, -34); bakery.rotation.y = 0;
    folkG.forEach((c, i) => { c.visible = true; bRest(c); bMood(c, 'happy'); c.position.set(-3.5 + (i % 5) * 1.8, Math.abs(Math.sin(t * 13 + i)) * .35, 6 - Math.floor(i / 5) * 2.2 - (i % 3) * .6 - p * 16); c.rotation.y = Math.PI; bWalk(c, t + i * .2, 2.6);
      c.userData.armL.rotation.x = -1.2 + Math.sin(t * 18 + i) * .5; });
    cam(V(11, 9, 14 - p * 6), V(0, 1.5, -16), 44); sunFollow(V(0, 0, -10)); return {}; },
  bakery_empty(t, p){ G0(); only(sky, town, clouds, bakery, ...folkG, ...chocs); bakery.position.set(0, 0, -34); bakery.rotation.y = 0; bakery.userData.breads.forEach(b => b.visible = false);
    folkG.forEach((c, i) => { c.visible = i < 6; bRest(c); bMood(c, 'happy'); c.position.set(-5 + i * 2, Math.abs(Math.sin(t * 7 + i)) * .3, -24.5 + (i % 2) * 1.4); c.rotation.y = (i - 2.5) * .15; c.userData.armR.rotation.x = -1.9; });
    chocs.forEach((k, i) => { const c = folkG[i]; c.updateMatrixWorld(true); k.position.copy(c.userData.head.getWorldPosition(V(0, 0, 0))).add(V(.35, -.35, .75)); k.scale.setScalar(.55); k.rotation.set(0, .3, 0); });
    cam(V(2, 4.2, -12 - p), V(0, 3.2, -27), 46); sunFollow(V(0, 0, -28)); return {stamp: 'RUPTURE DE STOCK'}; },
  compass_choc(t, p){ G0(); only(sky, town, clouds, compass, painChoc); compass.scale.setScalar(1); compass.position.set(0, 3, 4); compass.rotation.set(-.15, 0, 0);
    const k = Math.min(1, p * 2.2); compass.userData.needle.rotation.z = (1 - k) * (t * 9) - k * .75 + Math.sin(t * 8) * .03 * k;
    painChoc.scale.setScalar(.32); painChoc.position.set(.66, 3.66, 4.45); painChoc.rotation.set(.3, .4, 0);
    cam(V(.3, 3.4, 8.6), V(.3, 3.3, 4), 38); sunFollow(V(0, 0, 4)); return k >= 1 ? {stamp: 'CAP CLAIR !'} : {}; },
});
