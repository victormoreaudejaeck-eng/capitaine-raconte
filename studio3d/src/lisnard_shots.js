
// ===================== "DANS CETTE VILLE, TOUT LE MONDE VOTE LISNARD" : shots =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const L0 = (...extra) => { lLook(); only(sky, town, clouds, riv, bigScreen, ...extra); screenTex(SCR_OK); bigScreen.position.set(-13.8, 0, -22); bigScreen.rotation.y = Math.PI / 2; if (me.userData.tie) me.userData.tie.visible = false; };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
function face(p, x, z){ p.rotation.y = Math.atan2(x - p.position.x, z - p.position.z); }
function strollers(t, n = 8, z0 = -30){ rivFolk.forEach((c, i) => { c.visible = i < n; if (i >= n) return; const side = i % 2 ? 1 : -1, dir = i % 4 < 2 ? 1 : -1;
  place(c, side * 7.6 + (i % 3 - 1) * .4, z0 + ((i * 9 + t * 1.6 * dir) % 60 + 60) % 60, dir > 0 ? 0 : Math.PI, 'happy'); bWalk(c, t + i, .7); }); }
function rant(p, t){ p.userData.armL.rotation.x = -2.2 + Math.sin(t * 9) * .6; p.userData.armR.rotation.x = -2.0 + Math.cos(t * 8) * .6; p.userData.head.rotation.z = Math.sin(t * 7) * .12; }
const SHOTS = {
  riviera_wide(t, p){ L0(...rivFolk, ...cars); cloudsMove(t); strollers(t, 10, -40);
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, -60 + ((t * 8 + i * 30) % 120)); c.rotation.y = i % 2 ? Math.PI : 0; });
    cam(V(lerp(30, 20, p), lerp(36, 24, p), 46), V(-2, 3, -12), 42); sunFollow(V(0, 0, -10)); return {}; },
  screen_ok(t, p){ L0(...rivFolk); strollers(t, 8, -40); cam(V(-1 - p, 4.2, -9), V(-13.8, 8.4, -22), 44); sunFollow(V(-10, 0, -20)); return {}; },
  pothole(t, p){ L0(pothole, drone); pothole.position.set(2.4, .1, 4); pothole.scale.setScalar(1); droneFly(t); drone.position.set(2.4 + (1 - p) * 4, 12 - p * 6, 4 - (1 - p) * 3); drone.userData.tar.visible = false;
    cam(V(5.6, 2.4, 10), V(2.4, .6, 4), 40); sunFollow(V(2, 0, 4)); return {}; },
  drone_fix(t, p){ L0(pothole, patch, drone); droneFly(t); drone.position.set(2.4, 3.2 + Math.sin(t * 6) * .05, 4); drone.userData.tar.visible = p < .75;
    pothole.position.set(2.4, .1, 4); pothole.visible = p < .55; patch.position.set(2.4, .11, 4); patch.visible = p >= .55; patch.material.color.set(p < .8 ? 0x2a2a2e : 0x56595f);
    cam(V(7.5, 4.6, 12.5), V(2.4, 3.0, 4), 42); sunFollow(V(2, 0, 4)); return p > .55 ? {stamp: '3 SECONDES'} : {}; },
  mairie_desks(t, p){ L0(mairie, ...rivFolk); rivFolk.forEach((c, i) => { c.visible = i < 6; if (i >= 6) return; const x = mairie.userData.desks[i % 3]; const k = ((t * .9 + i * .37) % 1);
    place(c, x + (i < 3 ? -.6 : .6), -52.6 + k * 4, i < 3 ? Math.PI : 0, 'happy'); bWalk(c, t + i, 1.2); });
    cam(V(2 - p, 4.6, -38), V(0, 3.8, -54), 42); sunFollow(V(0, 0, -54)); return {}; },
  museum(t, p){ lLook(); only(museum, ...rivFolk.slice(0, 3)); scene.background = new THREE.Color(0x14161c); scene.fog = null; hemi.intensity = .5; sunLight.intensity = .3; museum.position.set(0, 0, 0);
    rivFolk.slice(0, 3).forEach((c, i) => { place(c, [-3.2, 3.2, -2.4][i], [1.4, 1.0, -1.8][i], Math.PI, 'shock'); face(c, 0, 0); });
    cam(V(.9 - p * .4, 3.9, 5.2), V(0, 3.4, 0), 42); return {}; },
  red_carpet(t, p){ L0(...rivFolk); strollers(t, 10, -42); rivFolk.forEach((c, i) => { if (i % 2 === 0) c.position.x = -7.6 + (i % 3 - 1) * .5; });
    cam(V(-3.4, 2.4, 25 - p * 3), V(-8.4, 1.8, 4), 40); sunFollow(V(-7, 0, 10)); return {}; },
  pigeons(t, p){ L0(...pigeons); pigeons.forEach((g, i) => { g.position.set(-8.4 + i * .65, .55 + Math.abs(Math.sin(t * 6 + i)) * .04, 5 + (i % 2) * .5); g.rotation.set(Math.sin(t * 5 + i) * .15, .4 - i * .2, 0); });
    cam(V(-6.2, 1.35, 8.6 - p * .4), V(-7.4, .75, 5.1), 38); sunFollow(V(-7, 0, 5)); return {}; },
  bike_flat(t, p){ L0(me, bike); place(me, -6.6, 11, -.4, p > .4 ? 'happy' : 'shock'); bike.position.set(-8.4, .3, 10); bike.rotation.y = .2; flat(Math.min(1, p * 2.5));
    cam(V(-12.4, 3.2, 16.5), V(-7.4, 1.9, 10.4), 42); sunFollow(V(-7, 0, 10)); return p > .4 ? {bubble: 'ENFIN UN PROBLÈME !'} : {}; },
  me_run(t, p){ L0(me); const z = 6 - p * 14; place(me, 0, z, Math.PI, 'happy'); bWalk(me, t, 2.3); me.position.y = Math.abs(Math.sin(t * 16)) * .25;
    cam(V(4.5, 3.2, z - 7), V(0, 2.6, z), 42); sunFollow(V(0, 0, z)); return {}; },
  closed_desk(t, p){ L0(mairie, me); place(me, 5.0, -50.8, Math.PI, 'shock'); face(me, 6.6, -54);
    cam(V(10, 3.8, -45.5), V(6.2, 3.4, -54), 42); sunFollow(V(6, 0, -54)); return {}; },
  screen_none(t, p){ L0(me); screenTex(SCR_NONE); place(me, -8.2, -14.8, 0, 'scared'); face(me, -13.8, -22); me.userData.head.rotation.x = -.3;
    cam(V(-3.4, 4.6, -9 + p * .5), V(-13.8, 8.0, -22), 44); sunFollow(V(-10, 0, -20)); return {}; },
  me_complain(t, p){ L0(me, ...rivFolk.slice(0, 5)); place(me, -7.4, -3, .5, 'angry'); rant(me, t);
    rivFolk.slice(0, 5).forEach((c, i) => { c.visible = true; place(c, -7.8 + (i - 2) * 1.6, -9 - (i % 2) * 1.4 + Math.min(1, p * 2) * 1.2, 0, i % 2 ? 'shock' : 'side'); face(c, -7.4, -3); });
    cam(V(-3.6, 3.6, 4), V(-7.4, 2.8, -4.2), 42); sunFollow(V(-7, 0, 4)); return {bubble: 'C\'EST SCANDALEUX !'}; },
  crowd_gather(t, p){ L0(me, ...rivFolk); place(me, -7.4, -3, .3, 'angry'); rant(me, t);
    rivFolk.forEach((c, i) => { c.visible = true; const a = i / 10 * Math.PI * 2; const r = 6 - Math.min(1, p * 1.5) * 2.4; place(c, -7.4 + Math.cos(a) * r, -3 + Math.sin(a) * r, 0, i % 3 ? 'shock' : 'happy'); face(c, -7.4, -3); });
    cam(V(-7.4 + Math.cos(.8 + t * .2) * 14, 12, -3 + Math.sin(.8 + t * .2) * 14), V(-7.4, 2, -3), 40); sunFollow(V(-7, 0, 4)); return {}; },
  tv_interview(t, p){ L0(me, rivFolk[3], tvCam, mic); place(me, -7.4, -3, .9, 'angry'); rant(me, t); place(rivFolk[3], -9.4, -1.4, 2.4, 'happy'); rivFolk[3].userData.armR.rotation.x = -1.5;
    mic.position.set(-8.2, 3.0, -2.2); mic.rotation.set(0, 0, -1.0); tvCam.position.set(-3.0, 0, -6.2); tvCam.rotation.y = -1.0;
    cam(V(-3.6, 3.8, 4.4), V(-7.8, 3.0, -2.6), 42); sunFollow(V(-7, 0, 4)); return {chipOverride: '🔴 EN DIRECT · UN HOMME RÂLE'}; },
  tourist_queue(t, p){ L0(me, queue, plaque, ...rivFolk); queue.position.set(-7.6, 0, -6); queue.rotation.y = 0; screenTex(SCR_STAR);
    place(me, -7.6, -8.4, 0, 'angry'); rant(me, t); me.position.y = .3; plaque.position.set(-10, 0, -9); plaque.rotation.y = .5;
    rivFolk.forEach((c, i) => { c.visible = true; place(c, -7.6 + (i % 2 ? .4 : -.4), -4 + i * 1.5, Math.PI, i % 2 ? 'happy' : 'side'); c.position.y = .3; });
    cam(V(-4.2, 5.6, -18 + p), V(-7.6, 2.2, -4), 46); sunFollow(V(-7, 0, -4)); return {}; },
  mayor_medal(t, p){ L0(me, mayor, medal, ...rivFolk.slice(0, 4)); place(me, -1, 0, Math.PI / 2 - .5, 'happy'); place(mayor, 1, 0, -Math.PI / 2 + .5, 'happy'); mayor.userData.armR.rotation.x = -1.4 * Math.max(0, 1 - p * 1.6);
    medal.position.set(-.55, 2.3, .3); medal.rotation.set(0, Math.PI / 2 - .5, 0); if (p < .6) medal.position.set(.3 - p * 1.4, 2.6, .35);
    rivFolk.slice(0, 4).forEach((c, i) => { place(c, -3 + i * 2, -5 - (i % 2), 0, 'happy'); const j = Math.abs(Math.sin(t * 7 + i)); c.userData.armL.rotation.x = c.userData.armR.rotation.x = -1.2 - j * .8; });
    cam(V(0, 3.8, 9.5 - p), V(0, 2.8, -.5), 40); sunFollow(V(-7, 0, 4)); return {}; },
  plaque_shot(t, p){ L0(me, queue, plaque, medal); queue.position.set(-7.6, 0, -6); place(me, -7.6, -8.4, 0, 'smug'); me.position.y = .3; plaque.position.set(-7.6, 0, -4.6); plaque.rotation.y = 0;
    medal.position.set(-7.6, 2.4, -7.95); medal.rotation.set(0, 0, 0); cam(V(-6.8, 2.8, 1.2 - p * .8), V(-7.6, 2.6, -6.4), 40); sunFollow(V(-7, 0, -6)); return {}; },
  me_happy(t, p){ L0(me, medal); place(me, -7.6, -8.4, 0, Math.floor(t * 2.2) % 3 === 2 ? 'angry' : 'happy'); medal.position.set(-7.6, 2.4, -7.95);
    cam(V(-7.4, 3.5, -4.4 - p * .6), V(-7.6, 3.2, -8.4), 36); sunFollow(V(-7, 0, -8)); return {bubble: 'C\'EST… SUPER.'}; },
  crowd_leaves(t, p){ L0(me, queue, plaque, ...rivFolk); queue.position.set(-7.6, 0, -6); screenTex(SCR_OK); place(me, -7.6, -8.4, 0, 'happy'); me.position.y = .3; plaque.position.set(-10, 0, -9); plaque.rotation.y = .5;
    rivFolk.forEach((c, i) => { c.visible = true; place(c, -7.6 + (i % 2 ? 1.4 : -1.4) * (1 + p), -2 + i * 1.6 + p * 6, 0, 'neutral'); bWalk(c, t + i, .8); });
    cam(V(-4.2, 5.6, -18), V(-7.6, 2.2, -3), 46); sunFollow(V(-7, 0, -4)); return {}; },
  tease(t, p){ L0(); cloudsMove(t); renderer.toneMappingExposure = .6; cam(V(0, 60 - p * 20, 90), V(0, 0, -120), 40); sunFollow(V(0, 0, 0)); return {tease: true, teaseA: 'PARTIE 2', teaseB: 'À LA RECHERCHE D\'UN PROBLÈME'}; },
  end_card(t, p){ L0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
