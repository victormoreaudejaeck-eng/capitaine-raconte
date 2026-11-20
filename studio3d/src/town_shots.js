
// ===================== "DANS CETTE VILLE" : shots =====================
const T0 = () => { townLook(); only(sky, town, clouds); clouds.children.forEach((c, i) => c.position.x += 0); };
function crowd(n, cx, cz, t, opt = {}){ for (let i = 0; i < citizens.length; i++){ const c = citizens[i]; c.visible = i < n; if (i >= n) continue; bRest(c); bMood(c, opt.mood || 'smug');
    const row = Math.floor(i / (opt.cols || 5)), col = i % (opt.cols || 5); c.position.set(cx + (col - 2) * (opt.gap || 2.2), 0, cz + row * (opt.gap || 2.2)); c.rotation.y = opt.rot ?? 0;
    if (opt.walk){ bWalk(c, t + (opt.sync ? 0 : i * .3), opt.walk); c.position.z += (t * 2.4 * (opt.dir || 1)) % 40; } } }
function cloudDrift(t){ clouds.children.forEach((c, i) => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; }); }
const SHOTS = {
  town_wide(t, p){ T0(); cloudDrift(t); crowd(10, 0, -10, t, {walk: 1, rot: 0}); cars.forEach((c, i) => { c.visible = true; c.position.set(i % 2 ? 2.4 : -2.4, 0, -60 + ((t * 8 + i * 30) % 120)); c.rotation.y = i % 2 ? Math.PI : 0; });
    cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {}; },
  posters_street(t, p){ T0(); cloudDrift(t); cam(V(-4 + p * 2, 2.2, 34 - p * 8), V(-20, 3, 0), 44); sunFollow(V(0, 0, 0)); return {}; },
  me_alone(t, p){ T0(); only(sky, town, clouds, me, ...citizens.slice(0, 8)); bRest(me); bMood(me, 'neutral'); me.position.set(0, 0, 4); me.rotation.y = 0;
    crowd(8, 0, -6, t, {rot: 0, mood: 'smug'}); citizens.slice(0, 8).forEach((c, i) => { c.rotation.y = Math.PI; });
    cam(V(0, 3.6, 12 - p * 3), V(0, 3, 3), 42); sunFollow(V(0, 0, 0)); return {}; },
  houses_posters(t, p){ T0(); cam(V(8 + p * 2, 2.5, -24 + p * 18), V(-20, 3, -20 + p * 18), 40); sunFollow(V(0, 0, 0)); return {}; },
  car_sticker(t, p){ T0(); only(sky, town, clouds, cars[0]); cars[0].position.set(-2.4, 0, 6 + p * 3); cars[0].rotation.y = 0; cam(V(-1.6, 1.5, 1.2 + p * 3), V(-2.4, 1, 3.8 + p * 3), 40); sunFollow(V(0, 0, 0)); return {}; },
  dog_suit(t, p){ T0(); only(sky, town, clouds, dog); dog.position.set(0, 0, 8 + Math.sin(t) * .1); dog.rotation.y = .2 + Math.sin(t * .8) * .2; dog.children[3].rotation.y = Math.sin(t * 2) * .2;
    cam(V(2.6, 1.9, 13.8), V(0, 1, 8), 38); sunFollow(V(0, 0, 0)); return {}; },
  bakery(t, p){ T0(); only(sky, town, clouds, bakery); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2;
    cam(V(-8.5 + p * .6, 3.6, 34.5), V(-17.2, 2.4, 30), 46); sunFollow(V(-20, 0, 30)); return {}; },
  baguette(t, p){ T0(); only(sky, town, clouds, bigBread, bakery); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; bigBread.position.set(-15, 2.4 + Math.sin(t * 2) * .05, 30); bigBread.rotation.set(0, t * .6, Math.PI / 2);
    cam(V(-12.5, 2.7, 31.6), V(-15, 2.4, 30), 34); sunFollow(V(-15, 0, 30)); return {stamp: 'BLEU MARINE'}; },
  school(t, p){ townLook(); only(classroom, ...citizens.slice(0, 6)); scene.background = new THREE.Color(0xfdf6e3); hemi.intensity = 1.6; spot.intensity = 0;
    citizens.slice(0, 6).forEach((c, i) => { bRest(c); bMood(c, 'smug'); c.scale.setScalar(.6); c.position.set(-3.6 + (i % 3) * 3.6, 0, .2 + Math.floor(i / 3) * 3); c.rotation.y = Math.PI; c.userData.armR.rotation.x = -2.8 + Math.sin(t * 5 + i) * .2; });
    cam(V(0, 3.5, 7.5 - p), V(0, 2.6, -5), 50); return {}; },
  jogging(t, p){ T0(); only(sky, town, clouds, ...citizens); crowd(14, 0, -30, t, {walk: 1.6, sync: true, rot: 0, cols: 5, gap: 2}); citizens.forEach(c => c.position.y = Math.abs(Math.sin(t * 11.2)) * .25);
    cam(V(9, 2.5, citizens[0].position.z + 14), V(0, 2.5, citizens[0].position.z + 2), 40); sunFollow(V(0, 0, 0)); return {}; },
  me_tie(t, p){ T0(); only(sky, town, clouds, me); bRest(me); bMood(me, 'smug'); me.position.set(18, 0, 18); me.rotation.y = -Math.PI / 2 + Math.sin(t * 2) * .2;
    if (!me.userData.tie){ const tie = new THREE.Mesh(new THREE.BoxGeometry(.18, 1.0, .06), toon(NAVY)); tie.position.set(0, 2.15, .43); me.add(tie); me.userData.tie = tie; } me.userData.tie.visible = true; me.userData.armR.rotation.x = -1.6; me.userData.armR.rotation.z = .5;
    cam(V(13.5, 3.4, 19), V(18, 3, 18), 36); sunFollow(V(18, 0, 18)); return {}; },
  neighbors_binoculars(t, p){ T0(); only(sky, town, clouds, ...citizens.slice(0, 3), binoc); citizens.slice(0, 3).forEach((c, i) => { bRest(c); bMood(c, 'side'); c.position.set(-15 + i * 1.6, 0, 12 + (i % 2) * .5); c.rotation.y = Math.PI / 2; c.userData.armL.rotation.x = c.userData.armR.rotation.x = -1.6; });
    citizens[1].updateMatrixWorld(true); binoc.position.copy(citizens[1].userData.head.getWorldPosition(V(0, 0, 0))).add(V(.65, 0, 0)); binoc.rotation.y = Math.PI / 2;
    cam(V(-9, 3.3, 14.5), V(-14, 3.2, 12.2), 40); sunFollow(V(-14, 0, 12)); return {}; },
  spy_window(t, p){ T0(); only(sky, town, clouds, citizens[2], me); bRest(me); bMood(me, 'scared'); me.position.set(0, 0, 4); me.rotation.y = 0;
    bRest(citizens[2]); bMood(citizens[2], 'side'); citizens[2].position.set(1.15, 0, 3.0); citizens[2].rotation.set(0, -.35, .12 * Math.min(1, p * 3));
    cam(V(0, 3.4, 9.5), V(.4, 3.3, 3.6), 40); sunFollow(V(0, 0, 4)); return {}; },
  spy_bush(t, p){ T0(); only(sky, town, clouds, ...citizens.slice(3, 6)); citizens.slice(3, 6).forEach((c, i) => { bRest(c); bMood(c, 'side'); c.position.set(10.8 + i * .2, -1.6 + Math.min(1, p * 3) * .9, -4 + i * 1.8); c.rotation.y = -Math.PI / 2; });
    cam(V(4, 2.5, -1), V(11, 2.2, -2), 40); sunFollow(V(10, 0, -2)); return {}; },
  voting_booth(t, p){ townLook(); only(booth, me, ...citizens.slice(0, 5)); scene.background = new THREE.Color(0xeef1f6); hemi.intensity = 1.5; bRest(me); bMood(me, 'neutral'); me.position.set(-2.6, 0, -1.2 - p * 1.0); me.rotation.y = Math.PI; bWalk(me, t, .7);
    citizens.slice(0, 5).forEach((c, i) => { bRest(c); bMood(c, 'side'); c.position.set(-6 + i * 1.6, 0, 4); c.rotation.y = Math.PI + (i - 2) * .15; });
    cam(V(5, 3.6, 4.5), V(-2, 2.1, -2.8), 46); return {}; },
  ballot(t, p){ townLook(); only(booth); scene.background = new THREE.Color(0xeef1f6); hemi.intensity = 1.5; bRest(me); bMood(me, 'neutral'); me.position.set(-1.8, 0, -3.2); me.rotation.y = Math.PI;
    const [a, b] = booth.userData.ballots; a.position.set(-2.15, 2.6, -2.95); b.position.set(-1.45, 2.6, -2.95); a.rotation.y = b.rotation.y = 0; a.position.y += Math.sin(t * 3) * .02;
    cam(V(-1.8, 3.0, -1.1), V(-1.8, 2.6, -2.95), 50); return {}; },
  town_freeze(t, p){ T0(); only(sky, town, clouds, ...citizens, dog); crowd(14, 0, -18, t, {rot: 0, mood: 'shock', cols: 5, gap: 2.4}); dog.position.set(4, 0, -12); dog.rotation.y = 0;
    cam(V(0, 3.2 + p * 2, -2 - p * 2), V(0, 3, -18), 46); sunFollow(V(0, 0, -15)); return {silence: true}; },
  next_town_tease(t, p){ T0(); only(sky, town, clouds); renderer.toneMappingExposure = .5; cam(V(0, 60 - p * 20, 90), V(0, 0, -120), 40); sunFollow(V(0, 0, 0)); return {tease: true}; },
  end_card(t, p){ T0(); cloudDrift(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
  title(t, p){ T0(); cloudDrift(t); cam(V(-30 + p * 6, 30, 60), V(0, 4, -10), 40); sunFollow(V(0, 0, 0)); return {title: true}; },
};
