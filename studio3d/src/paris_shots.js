
// ===================== "LES PARISIENS SONT INTERDITS" : shots =====================
const P0 = (...extra) => { pLook(); only(sky, town, clouds, ...extra); alarm(false, 0); setLight(false); };
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.y = ry; if (mood) bMood(p, mood); }
function punch(p, a = .06){ return 1 - Math.min(1, p * 4) * a; } // quick zoom-in on gags
const SHOTS = {
  gate_wide(t, p){ P0(border, detector, guards[0], guards[1], ...folk.slice(0, 4)); cloudsMove(t);
    place(guards[0], -1.2, 64, 0, 'angry'); place(guards[1], 4.6, 65, -.3, 'angry'); folk.slice(0, 4).forEach((f, i) => { place(f, 2.5 + (i % 2) * .6, 72 + i * 2.2, Math.PI, 'neutral'); });
    cam(V(16 - p * 6, 9 + p * 2, 92 - p * 4), V(0, 4, 66), 42); sunFollow(V(0, 0, 66)); return {}; },
  sign_close(t, p){ P0(border); cam(V(1.5, 7.5, 96 - p * 2), V(0, 9.2, 70), 38); sunFollow(V(0, 0, 70)); return {}; },
  checkpoint(t, p){ P0(border, guards[0], folk[1]); place(guards[0], -3.2, 69, Math.PI / 2, 'angry'); guards[0].userData.armR.rotation.x = -1.4;
    place(folk[1], -1.2, 72.5, Math.PI - .4, 'scared'); border.userData.bar.rotation.z = 0; cam(V(5.5, 3.6, 80), V(-2.2, 2.4, 70.5), 40); sunFollow(V(0, 0, 70)); return {}; },
  detector(t, p){ P0(detector, guards[1], border); place(guards[1], 4.8, 65.5, -Math.PI / 2, 'smug'); cam(V(-1.5, 3.2, 72.5 - p), V(2.5, 2.4, 66), 42); sunFollow(V(2, 0, 66)); return {}; },
  det_envrai(t, p){ P0(detector, folk[2], guards[1]); const on = p > .35; alarm(on, t); place(folk[2], 2.5, 66.2, Math.PI, on ? 'shock' : 'happy'); place(guards[1], 4.8, 65.5, -Math.PI / 2, on ? 'angry' : 'smug');
    if (on) guards[1].userData.armR.rotation.x = -1.6; cam(V(2.5, 3.2, 57.5 + p * .8), V(2.5, 2.6, 66), 40 * punch(p)); sunFollow(V(2, 0, 66)); return {alarmFx: on, bubble: p < .4 ? '« En vrai… »' : null}; },
  det_cafe(t, p){ P0(detector, folk[3], guards[1]); const on = p > .4; alarm(on, t); place(folk[3], 2.5, 66.2, Math.PI, on ? 'shock' : 'angry'); place(guards[1], 4.8, 65.5, -Math.PI / 2, on ? 'angry' : 'smug');
    cam(V(-1.5, 3.2, 58.5), V(2.5, 2.6, 66), 40 * punch(p)); sunFollow(V(2, 0, 66)); return {alarmFx: on, bubble: p < .45 ? '« 4 € le café ?! »' : null}; },
  scooter_arrive(t, p){ P0(scooter, folk[7], border); const z = lerp(100, 74, ease(p)); scooter.position.set(-1.5, 0, z); scooter.rotation.y = Math.PI; place(folk[7], -1.5, z + .1, Math.PI, 'smug'); folk[7].position.y = .32;
    folk[7].userData.armL.rotation.x = folk[7].userData.armR.rotation.x = -1.3; cam(V(5, 2.6, z - 7), V(-1.5, 1.8, z), 40); sunFollow(V(0, 0, z)); return {}; },
  scooter_arrest(t, p){ P0(scooter, folk[7], guards[0], guards[1], border); scooter.position.set(-1.5, 0, 74.5); scooter.rotation.set(0, Math.PI, Math.PI / 2 * Math.min(1, p * 3)); scooter.position.y = .18;
    place(folk[7], -1.5, 73.3, Math.PI, 'scared'); folk[7].userData.armL.rotation.x = folk[7].userData.armR.rotation.x = -3.0; place(guards[0], -2.9, 72.6, .9, 'angry'); place(guards[1], -.1, 72.6, -.9, 'angry');
    guards.forEach(g => g.userData.armR.rotation.x = -1.4); cam(V(1.5, 4.2, 84), V(-1.5, 2.2, 73), 40 * punch(p)); sunFollow(V(0, 0, 73)); return {stamp: 'GARDE À VUE'}; },
  hello_street(t, p){ P0(...folk.slice(0, 6)); cloudsMove(t); folk.slice(0, 6).forEach((f, i) => { place(f, (i % 2 ? 7 : -7.2), 10 - i * 3 - t * .8 * (i % 2 ? -1 : 1) % 4, i % 2 ? Math.PI : 0, 'happy'); bWalk(f, t + i, .6); if (i === 1 || i === 2) f.userData.armR.rotation.x = -2.6 + Math.sin(t * 8) * .3; });
    cam(V(-2, 3.2, 16 - p * 2), V(-6.5, 2.6, 2), 44); sunFollow(V(0, 0, 0)); return {}; },
  crosswalk_wait(t, p){ P0(tlight, ...folk.slice(2, 6)); setLight(p > .7); folk.slice(2, 6).forEach((f, i) => { place(f, 6.2 + (i % 2) * 1.1, 21.6 + Math.floor(i / 2) * 1.2, -Math.PI / 2, 'happy'); if (p > .7){ bWalk(f, t, .6); f.position.x -= (p - .7) * 12; } });
    cam(V(-4, 2.4, 25), V(5.4, 2.4, 20.5), 40); sunFollow(V(0, 0, 20)); return {}; },
  me_secret(t, p){ P0(me); place(me, 0, 4, 0, 'scared'); me.userData.armR.rotation.x = -2.2; me.userData.armR.rotation.z = .4; cam(V(.6, 3.5, 8.6 - p * 1.4), V(0, 3.3, 4), 36); sunFollow(V(0, 0, 4)); return {}; },
  paris_flashback(t, p){ pLook(); only(sky, paris, me); place(me, 0, -400 + 6, 0, 'smug'); me.scale.setScalar(.55 + p * .02);
    cam(V(0, 5 + p * 2, -452), V(0, 34, -530), 52); sunFollow(V(0, 0, -400)); me.scale.setScalar(1); return {sepia: true, chipOverride: 'FLASHBACK'}; },
  learn_bonjour(t, p){ P0(bakery, baker, me); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; place(baker, -16.5, 30, Math.PI / 2, 'happy'); place(me, -13.4, 30.2, -Math.PI / 2, 'happy');
    me.userData.armR.rotation.x = -2.5 + Math.sin(t * 9) * .3; cam(V(-10.8, 3.9, 31.6), V(-16.5, 3.2, 30), 44); sunFollow(V(-15, 0, 30)); return {bubble: '« Bonjour madame ! »'}; },
  learn_slow(t, p){ P0(me, ...folk.slice(0, 3)); place(me, -7.2, 8 - t * .25 % 3, 0, 'neutral'); bWalk(me, t, .25); folk.slice(0, 3).forEach((f, i) => { place(f, -7.4 + (i - 1) * .9, 14 - ((t * 3 + i * 4) % 20), Math.PI, 'happy'); bWalk(f, t + i, 1.4); });
    cam(V(1.5, 3.8, 19), V(-7, 2.4, 6), 40); sunFollow(V(-7, 0, 6)); return {chipOverride: '0,5 KM/H'}; },
  learn_never(t, p){ P0(me); place(me, 0, 4, 0, 'scared'); me.userData.armL.rotation.x = me.userData.armR.rotation.x = -2.3; me.userData.armL.rotation.z = .5; me.userData.armR.rotation.z = -.5;
    cam(V(0, 3.4, 8.2), V(0, 3.2, 4), 36); sunFollow(V(0, 0, 4)); return {stamp: 'C\'ÉTAIT MIEUX À PARIS', stampNo: true}; },
  me_blend(t, p){ P0(me, ...folk.slice(0, 7)); cloudsMove(t); folk.slice(0, 7).forEach((f, i) => { place(f, -7.6 + (i % 3) * .9, 6 - i * 2.4 + Math.sin(t + i) * .2, 0, 'happy'); bWalk(f, t + i, .7); });
    place(me, -7.3, -1, 0, 'happy'); bWalk(me, t, .7); cam(V(lerp(6, 2, p), 7, 20), V(-7.4, 2.4, 0), 40); sunFollow(V(-7, 0, 0)); return {chipOverride: '3 ANS PLUS TARD'}; },
  cafe_wide(t, p){ P0(cafe, me, waiter, ...folk.slice(3, 6)); const tb = cafe.userData.tables; cafe.updateMatrixWorld(true);
    const tp = tb[1].getWorldPosition(V(0, 0, 0)); place(me, tp.x + .0, tp.z - 1.0, Math.PI / 2, 'happy'); me.position.set(tp.x, .1, tp.z + 1.0); me.rotation.y = Math.PI; me.userData.legL.rotation.x = me.userData.legR.rotation.x = -1.4; me.position.y = -.5;
    place(waiter, tp.x + 1.3, tp.z - .2, -Math.PI / 2 + .3, 'smug'); waiter.userData.armR.rotation.x = -1.3;
    folk.slice(3, 6).forEach((f, i) => { const q = tb[[0, 2, 3][i]].getWorldPosition(V(0, 0, 0)); place(f, q.x, q.z + 1, Math.PI, 'happy'); f.position.y = -.5; f.userData.legL.rotation.x = f.userData.legR.rotation.x = -1.4; });
    cup.position.set(tp.x + .2, 1.2, tp.z); cam(V(tp.x + 11, 5, tp.z + 7), V(tp.x - .5, 1.8, tp.z), 40); sunFollow(tp); return {}; },
  bill_close(t, p){ P0(cafe, bill, cup); const tp = cafe.userData.tables[1].getWorldPosition(V(0, 0, 0)); bill.position.set(tp.x - .05, 1.14, tp.z + .1); bill.rotation.set(-Math.PI / 2, 0, .2); cup.position.set(tp.x + .3, 1.2, tp.z - .15);
    cam(V(tp.x - .05, 1.85 - p * .12, tp.z + .45), V(tp.x - .05, 1.13, tp.z + .08), 38); return {}; },
  me_says(t, p){ P0(cafe, me, waiter); const tp = cafe.userData.tables[1].getWorldPosition(V(0, 0, 0)); place(me, tp.x, tp.z + 1.0, Math.PI, 'happy'); me.position.y = -.5; me.userData.legL.rotation.x = me.userData.legR.rotation.x = -1.4;
    me.userData.armR.rotation.x = -1.2; me.userData.armR.rotation.z = -.3; cam(V(tp.x - .6, 3.0, tp.z - 3.4), V(tp.x, 2.7, tp.z + 1), 36 * punch(p, .1)); sunFollow(tp); return {bubble: '« Ah, c\'est pas cher ! »'}; },
  alarm_city(t, p){ P0(detector, ...folk); alarm(true, t); cloudsMove(t); folk.forEach((f, i) => { place(f, (i % 2 ? 7 : -7.4), 20 - i * 4, i % 2 ? Math.PI : 0, 'shock'); });
    cam(V(14, 18 - p * 4, 46), V(0, 2, 10), 44); sunFollow(V(0, 0, 0)); return {alarmFx: true}; },
  everyone_turns(t, p){ P0(cafe, me, waiter, ...folk.slice(0, 6)); alarm(true, t); const tp = cafe.userData.tables[1].getWorldPosition(V(0, 0, 0)); place(me, tp.x, tp.z + 1, Math.PI, 'scared'); me.position.y = -.5; me.userData.legL.rotation.x = me.userData.legR.rotation.x = -1.4;
    place(waiter, tp.x + 1.3, tp.z - .2, -Math.PI / 2, 'shock'); folk.slice(0, 6).forEach((f, i) => { const ang = -1.2 + i * .48; place(f, tp.x + 3.2 + Math.cos(ang) * 1.8, tp.z + 1 + Math.sin(ang) * 3.2, 0, 'angry'); f.lookAt(me.position.x, 0, me.position.z); });
    cam(V(tp.x + 6, 5.6, tp.z - 9.5), V(tp.x + 1, 2.2, tp.z + 1), 44 * punch(p, .12)); sunFollow(tp); return {alarmFx: true}; },
  escape_tease(t, p){ P0(scooter, me); const z = lerp(40, 110, p); scooter.position.set(1.5, 0, z); scooter.rotation.y = 0; place(me, 1.5, z, 0, 'shock'); me.position.y = .32; me.userData.armL.rotation.x = me.userData.armR.rotation.x = -1.3;
    cam(V(-4, 3, z + 9), V(1.5, 2.2, z), 42); sunFollow(V(0, 0, z)); return {tease2: true}; },
  end_card(t, p){ P0(border); cloudsMove(t); cam(V(30 + p * 10, 40, 110), V(0, 0, 40), 40); sunFollow(V(0, 0, 40)); return {endcard: true}; },
  title(t, p){ P0(border); cam(V(-20, 20, 110), V(0, 4, 60), 40); return {title: true}; },
};
