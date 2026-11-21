
// ===================== GLUCKSMANN PARTIE 2 : plans =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const H0 = (...x) => { G0(); only(sky, town, clouds, ...x); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; if (me.userData.tie) me.userData.tie.visible = false; };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) gMood(p, mood); }
function face(p, x, z){ p.rotation.y = Math.atan2(x - p.position.x, z - p.position.z); }
function setWheels(t, night){ wheels.forEach((w, i) => { w.position.set(-12 + i * 8, 0, 0); w.rotation.y = 0; w.userData.wheel.rotation.z = -t * 3.2 - i; }); }
function runners(t, n = 4){ folkG.forEach((c, i) => { c.visible = i < n; if (i >= n) return; place(c, -12 + i * 8, 0, Math.PI / 2, 'happy'); c.position.y = .62 + Math.abs(Math.sin(t * 14 + i)) * .15; bWalk(c, t + i, 2.6); }); }
const NIGHT = () => { renderer.toneMappingExposure = .45; hemi.intensity = .9; hemi.color.set(0x7f9fe0); sunLight.intensity = .5; sunLight.color.set(0xa8c4ff); };
const SHOTS = {
  town_sunrise(t, p){ H0(...folkG.slice(0, 6)); cloudsMove(t); folkG.slice(0, 6).forEach((c, i) => { place(c, (i % 2 ? 7.4 : -7.4), -30 + ((i * 9 + t * 6) % 50), i % 2 ? Math.PI : 0, 'happy'); bWalk(c, t + i, 2.4); });
    cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {}; },
  mayor_points(t, p){ H0(podium, mayor); place(mayor, 0, -14.4, .5, 'happy'); mayor.position.y = 1; mayor.userData.armR.rotation.x = -1.57; cam(V(5, 4.4, -6.5), V(-.6, 3.8, -14), 44); sunFollow(V(0, 0, -12)); return {bubble: 'CAP : LA BOULANGERIE !'}; },
  bakery_queue(t, p){ H0(bakery, ...folkG.slice(0, 8)); folkG.slice(0, 8).forEach((c, i) => { place(c, -15 + (i % 2) * .8, 30 - 4 + i * 1.6 - p * 1.5, Math.PI, 'happy'); c.position.y = Math.abs(Math.sin(t * 9 + i)) * .2; bWalk(c, t + i, 1.6); face(c, -16.8, 30); });
    cam(V(-6, 4.6, 40), V(-15, 2.4, 31), 42); sunFollow(V(-15, 0, 30)); return {}; },
  matcha_closed(t, p){ H0(matcha, matchaClosed); matchaClosed.position.set(-5.7, 2.6, 6); matchaClosed.rotation.y = Math.PI / 2; cam(V(-1.5 - p, 3.4, 9.5), V(-6, 2.8, 6.2), 40); sunFollow(V(-6, 0, 6)); return {}; },
  breakfast_pile(t, p){ H0(breakfast); breakfast.position.set(0, 3, 4); breakfast.rotation.y = t * .4; cam(V(0, 4.2, 8 - p * .5), V(0, 3.3, 4), 34); sunFollow(V(0, 0, 4)); return {stamp: '× 3 PAR JOUR'}; },
  crowd_sprint(t, p){ H0(...folkG); const zr = 20 - p * 26; folkG.forEach((c, i) => { place(c, -3.5 + (i % 5) * 1.8, zr + Math.floor(i / 5) * 2.5 + (i % 3) * .7, Math.PI, 'happy'); c.position.y = Math.abs(Math.sin(t * 14 + i)) * .35; bWalk(c, t + i * .2, 2.8); });
    cam(V(6, 3.8, zr - 11), V(0, 2.2, zr + 1), 44); sunFollow(V(0, 0, 10)); return {}; },
  demo_sprint(t, p){ H0(...folkG.slice(0, 8), ...signs); folkG.slice(0, 8).forEach((c, i) => { place(c, -3 + (i % 4) * 2, 6 - Math.floor(i / 4) * 2.4 - p * 14, Math.PI, 'angry'); c.position.y = Math.abs(Math.sin(t * 14 + i)) * .35; bWalk(c, t + i, 2.8); });
    signs.forEach((s, i) => { s.position.set(-3 + i * 2, Math.abs(Math.sin(t * 14 + i)) * .35, 6.6 - p * 14); s.rotation.set(0, 0, Math.sin(t * 10 + i) * .15); }); cam(V(5, 3.6, 6 - p * 14 - 11), V(0, 2.6, 6 - p * 14), 44); sunFollow(V(0, 0, 0)); return {}; },
  mayor_cap1(t, p){ H0(podium, mayor); place(mayor, 0, -14.4, 0, 'happy'); mayor.position.y = 1; mayor.userData.armR.rotation.x = -2.6; cam(V(1.2, 4.6, -9 + p * .4), V(0, 4.2, -14.4), 38); sunFollow(V(0, 0, -12)); return {bubble: 'CAP CLAIR !'}; },
  mayor_cap2(t, p){ H0(podium, mayor); place(mayor, 0, -14.4, -.3, 'angry'); mayor.position.y = 1; mayor.userData.armL.rotation.x = -2.6; mayor.userData.armR.rotation.x = -2.6; cam(V(-1.2, 4.4, -9.5 + p * .4), V(0, 4.2, -14.4), 38); sunFollow(V(0, 0, -12)); return {bubble: 'CAP TRÈS CLAIR !!'}; },
  mayor_cap3(t, p){ H0(podium, mayor); place(mayor, 0, -14.4, 0, 'shock'); mayor.position.y = 1 + Math.abs(Math.sin(t * 12)) * .4; mayor.userData.armL.rotation.z = -2.7; mayor.userData.armR.rotation.z = 2.7; cam(V(0, 4.2, -8.6), V(0, 4.4, -14.4), 40); sunFollow(V(0, 0, -12)); return {bubble: 'CAP FLUO !!!', flashW: Math.max(0, 1 - p * 4) * .5}; },
  me_idea(t, p){ H0(me, ...folkG.slice(0, 5)); place(me, 0, 4, 0, 'happy'); me.userData.armR.rotation.x = -2.8; folkG.slice(0, 5).forEach((c, i) => { place(c, -6 + i * 3, -2 - (i % 2) * 2, 0, 'happy'); c.position.y = Math.abs(Math.sin(t * 12 + i)) * .35; bWalk(c, t + i, 2.6); c.rotation.y = i % 2 ? Math.PI / 2 : -Math.PI / 2; });
    cam(V(1.5, 3.6, 12 - p), V(0, 3.2, 3), 42); sunFollow(V(0, 0, 4)); return {bubble: 'ET SI ON FAISAIT DE L\'ÉLECTRICITÉ ?'}; },
  wheels_wide(t, p){ H0(...wheels, ...folkG); setWheels(t); runners(t); cam(V(2 - p * 4, 10, 34), V(0, 3, 0), 50); sunFollow(V(0, 0, 0)); return {}; },
  wheel_close(t, p){ H0(...wheels, ...folkG); setWheels(t); runners(t); cam(V(-2.5 + p, 4.2, 12), V(-4, 2.6, 0), 40); sunFollow(V(-4, 0, 0)); return {}; },
  wheels_night(t, p){ H0(...wheels, ...folkG); NIGHT(); setWheels(t); runners(t); cam(V(10, 5, 18 - p * 2), V(0, 4, 0), 44); sunFollow(V(0, 0, 0)); return {chipOverride: '🌙 3 H DU MATIN'}; },
  pylons_shot(t, p){ H0(pylons); pylons.position.set(0, 0, 150); cam(V(20 + p * 10, 6, 168), V(100, 14, 108), 44); sunFollow(V(80, 0, 120)); return {}; },
  france_lit(t, p){ cLookDark(); only(frMap); frMap.material.map = FR_LIT; frMap.position.set(0, 0, 0); cam(V(0, 0, 17 - p), V(0, -.3, 0), 42); return {}; },
  bakery_rupture(t, p){ H0(bakery, rupture); rupture.position.set(-17.5, 2.6, 30); rupture.rotation.y = Math.PI / 2; cam(V(-11.5, 3, 31 - p * .5), V(-17.5, 2.6, 30), 38); sunFollow(V(-17, 0, 30)); return {}; },
  folk_shock(t, p){ H0(...folkG.slice(0, 6)); folkG.slice(0, 6).forEach((c, i) => { place(c, -5 + (i % 3) * 3.4, 2 - Math.floor(i / 3) * 3, 0, 'shock'); }); cam(V(0, 3.6, 10 - p), V(0, 3, 0), 44); sunFollow(V(0, 0, 0)); return {}; },
  crowd_sleep2(t, p){ H0(...wheels, ...folkG, zzz); setWheels(0); wheels.forEach(w => w.userData.wheel.rotation.z = 0);
    folkG.forEach((c, i) => { gMood(c, 'sleepy'); bRest(c); c.rotation.set(-Math.PI / 2, 0, i * .7); c.position.set(-14 + (i % 5) * 6.5, .42, 6 + Math.floor(i / 5) * 4); }); folkG.forEach(c => c.updateMatrixWorld(true)); zzzOn(folkG.map(c => c.userData.head), t);
    cam(V(0, 14 - p * 2, 20), V(0, 1, 3), 44); sunFollow(V(0, 0, 4)); return {}; },
  france_dark(t, p){ cLookDark(); only(frMap); frMap.material.map = p < .35 ? FR_LIT : FR_DARK; cam(V(0, 0, 17 - p), V(0, -.3, 0), 42); return {}; },
  tease(t, p){ H0(); cloudsMove(t); NIGHT(); cam(V(0, 60 - p * 20, 90), V(0, 0, -120), 40); sunFollow(V(0, 0, 0)); return {tease: true, teaseA: 'PARTIE 3', teaseB: 'LA GRANDE PANNE'}; },
  end_card(t, p){ H0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
function cLookDark(){ G0(); scene.background = new THREE.Color(0x05080f); scene.fog = null; }
