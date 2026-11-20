
// ===================== MARY CELESTE : shots =====================
const mcDrift = (t, heel = .04) => { floatBoat(brig, 0, 0, t, heel, .5); brig.rotation.y = .5 + Math.sin(t * .15) * .08; sailsFlap(brig, t, 2); brig.userData.wheel.rotation.z = Math.sin(t * .7) * .6; };
const mcSail = (t, z) => { floatBoat(brig, 0, z, t, -.12, .4); brig.rotation.y = 0; sailsFlap(brig, t, .6); };
function onDeck(p, x, z, b = brig){ b.updateMatrixWorld(true); p.position.copy(V(x, 1.86, z).applyMatrix4(b.matrixWorld)); p.rotation.set(0, b.rotation.y, 0); }
function headOf(p){ p.updateMatrixWorld(true); return p.userData.neck.getWorldPosition(V(0, 0, 0)); }

const SHOTS = {
  mc_drift_far(t, p){ look('grey'); only(sky, water, brig); water.material.uniforms.time.value = t * .5; mcDrift(t);
    const a = lerp(-.9, -.4, p); cam(V(Math.sin(a) * 75, 9 + p * 4, Math.cos(a) * 75), V(0, 9, 0), 38); sunFollow(V(0, 0, 0)); scene.fog = new THREE.Fog(0xb9c3cb, 60, 900); return {}; },
  mc_deck_empty(t, p){ look('grey'); only(sky, water, brig); water.material.uniforms.time.value = t * .5; mcDrift(t);
    brig.updateMatrixWorld(true); const c = V(1.2, 3.6, lerp(-4, 3, p)).applyMatrix4(brig.matrixWorld), tg = V(-.5, 3.2, 12).applyMatrix4(brig.matrixWorld); cam(c, tg, 46); handheld(t, .02); sunFollow(c); return {}; },
  mc_wheel(t, p){ look('grey'); only(sky, water, brig); water.material.uniforms.time.value = t * .5; mcDrift(t);
    brig.updateMatrixWorld(true); const w = V(0, 3.0, -12.8).applyMatrix4(brig.matrixWorld); const c = V(1.4, 3.4, -10.9).applyMatrix4(brig.matrixWorld); cam(c, w, 40); sunFollow(c); return {}; },
  title(t, p){ look('grey'); only(sky, water, brig); water.material.uniforms.time.value = t * .5; mcDrift(t); cam(V(-60 + p * 8, 6, 55), V(0, 8, 0), 38); sunFollow(V(0, 0, 0)); scene.fog = new THREE.Fog(0xb9c3cb, 50, 700); return {title: true}; },
  mc_ny_departure(t, p){ look('day'); setSky('dayN', 24, 20, 5, 1.5, .004); water.material.uniforms.sunDirection.value.copy(sunDir); only(sky, water, brig, harbor); water.material.uniforms.time.value = t * .4; const z = lerp(-14, 6, p); mcSail(t, z); brig.position.x = 8; brig.rotation.y = .1;
    cam(V(26, 5, 42), V(-4, 6, -24), 42); sunFollow(V(0, 0, 0)); return {}; },
  mc_sailing_day(t, p){ look('day'); only(sky, water, brig); water.material.uniforms.time.value = t * .5; const z = t * 4; mcSail(t, z);
    const a = lerp(-2.4, -1.5, p); cam(V(Math.sin(a) * 55, 7 + p * 6, z + Math.cos(a) * 55), V(0, 10, z), 38); sunFollow(V(0, 0, z)); return {}; },
  mc_family(t, p){ look('day'); only(sky, water, brig, captain, sarah, sophia); water.material.uniforms.time.value = t * .5; mcSail(t, 0);
    for (const q of [captain, sarah, sophia]){ rest(q); } mood(captain, 'neutral'); mood(sarah, 'happy'); mood(sophia, 'happy');
    onDeck(captain, -1.0, -5.0); onDeck(sarah, .3, -5.2); onDeck(sophia, 1.1, -4.8);
    sarah.userData.arms[0].sh.rotation.x = -.5; sophia.userData.arms[1].sh.rotation.x = -2.6 + Math.sin(t * 6) * .3;
    const h = headOf(sarah); cam(h.clone().add(V(2.6, .3, 3.3)), h.clone().add(V(-.3, -.5, 0)), 42); sunFollow(h); return {}; },
  mc_hold_barrels(t, p){ look('pocket'); only(hold, lantern); holdWaterAt(t, -5); lantern.position.set(.4, 2.3, 4 + Math.sin(t) * .05); fill.position.copy(lantern.position); fill.intensity = 4; fill.distance = 14; fill.color.set(0xffc880);
    vapor.visible = false; cam(V(-.5, 1.8, 7.2 - p * 1.5), V(0, .6, -2), 50); return {}; },
  dg_lookout(t, p){ look('grey'); only(sky, water, deiGratia, brig, crew[1], spyglass); water.material.uniforms.time.value = t * .5;
    floatBoat(deiGratia, 0, 0, t, -.1, .4); deiGratia.rotation.y = 0; sailsFlap(deiGratia, t, .5); floatBoat(brig, 60, 160, t, .04, .3); brig.rotation.y = 1.4; sailsFlap(brig, t, 2);
    const s = crew[1]; rest(s); mood(s, 'neutral'); onDeck(s, 1.6, 9.5, deiGratia); s.rotation.y = .3; const u = s.userData; u.arms[1].sh.rotation.set(-1.5, 0, -.3); u.el = u.arms[1].el; u.arms[1].el.rotation.x = -1.2; u.arms[0].sh.rotation.set(-1.4, 0, .4); u.arms[0].el.rotation.x = -1.3;
    const h = headOf(s); spyglass.position.copy(h).add(V(.05, -.02, .35)); spyglass.lookAt(V(60, 6, 160));
    cam(h.clone().add(V(-.9, .25, -1.6)), V(60, 7, 160), 34); sunFollow(h); return {}; },
  mc_spotted(t, p){ look('grey'); only(sky, water, brig); water.material.uniforms.time.value = t * .5; mcDrift(t); cam(V(-140, 6, 170), V(0, 8, 0), 9 - p * 2); sunFollow(V(0, 0, 0)); return {spyglass: true}; },
  mc_wheel_empty(t, p){ look('grey'); only(sky, water, brig); water.material.uniforms.time.value = t * .5; mcDrift(t);
    brig.updateMatrixWorld(true); const c = V(-.6, 4.6, -15.5).applyMatrix4(brig.matrixWorld), tg = V(0, 3.4, 4).applyMatrix4(brig.matrixWorld); cam(c, tg, 44); handheld(t, .015); sunFollow(c); return {}; },
  mc_boarding(t, p){ look('grey'); only(sky, water, brig, yawlFree, crew[0], crew[2], crew[3]); water.material.uniforms.time.value = t * .5; mcDrift(t); brig.rotation.y = 0;
    floatBoat(yawlFree, -5.6, 2, t, 0, .3); yawlFree.rotation.y = 0;
    const [a, b, c] = [crew[0], crew[2], crew[3]]; for (const q of [a, b, c]){ rest(q); mood(q, 'neutral'); }
    a.position.set(-5.6, yawlFree.position.y + .1, 2.8); a.rotation.y = Math.PI / 2; b.position.set(-5.6, yawlFree.position.y + .1, 1.1); b.rotation.y = Math.PI / 2;
    const climb = ease(p); c.position.set(lerp(-5.2, -4.1, climb), lerp(yawlFree.position.y + .3, 2.0, climb), .4); c.rotation.y = Math.PI / 2; c.userData.arms.forEach(x => x.sh.rotation.x = -2.6); c.userData.legs[0].hip.rotation.x = -1.0;
    cam(V(-14, 3, 10), V(-4.6, 2, 1), 38); sunFollow(V(0, 0, 0)); return {}; },
  mc_cabin(t, p){ look('pocket'); only(cabin, crew[0], lantern); renderer.toneMappingExposure = 1.0; const s = crew[0]; rest(s); mood(s, 'scared'); s.position.set(.7, 0, -1.4); s.rotation.y = -.3 + p * .4; s.userData.neck.rotation.y = Math.sin(t * .8) * .4;
    lantern.position.set(Math.sin(t * 1.3) * .12, 2.05, 0); fill.position.copy(lantern.position); fill.intensity = 3.5; fill.distance = 9; fill.color.set(0xffc880);
    spot.intensity = 6; spot.color.set(0xb8c8d8); spot.position.set(1.95, 1.5, 0); spot.target.position.set(-1, .6, 0); spot.angle = Math.PI / 5; spot.distance = 8;
    cam(V(-1.5, 1.6, 2.2), V(.3, .9, -.2), 48); return {}; },
  mc_logbook(t, p){ look('pocket'); only(cabin, lantern); renderer.toneMappingExposure = 1.0; lantern.position.set(.3, 1.4, -.3); fill.position.copy(lantern.position); fill.intensity = 2.6; fill.distance = 6; fill.color.set(0xffc880);
    cam(V(-.2 + p * .05, 1.45 - p * .15, .55), V(-.2, .85, .05), 40); return {}; },
  mc_lifeboat_gone(t, p){ look('grey'); only(sky, water, brig, ghostYawl); water.material.uniforms.time.value = t * .5; mcDrift(t); brig.userData.yawl.visible = false;
    brig.updateMatrixWorld(true); ghostYawl.position.copy(V(0, 2.85, 1).applyMatrix4(brig.matrixWorld)); ghostYawl.rotation.copy(brig.rotation); ghostYawl.traverse(o => { if (o.isMesh) o.material.opacity = .2 + .3 * (Math.sin(t * 5) * .5 + .5); });
    brig.updateMatrixWorld(true); const h = V(0, 2.4, 1).applyMatrix4(brig.matrixWorld); cam(h.clone().add(V(4.5, 6.5 - p, -3.5)), h.clone().add(V(0, -.2, .4)), 42); sunFollow(h); return {chipOverride: 'CANOT : DISPARU'}; },
  mc_hold_water(t, p){ look('pocket'); only(hold, lantern); holdWaterAt(t, -.05); lantern.position.set(.1, 2.3, 5.2); fill.position.copy(lantern.position); fill.intensity = 11; fill.distance = 14; fill.color.set(0xffc880);
    vapor.visible = false; cam(V(.2, .7, 7.6), V(-.2, .2, -1), 46); return {}; },
  mc_sounding_rod(t, p){ look('grey'); only(sky, water, brig, soundRod); water.material.uniforms.time.value = t * .5; mcDrift(t);
    brig.updateMatrixWorld(true); soundRod.position.copy(V(1.6, 1.9, -2.2).applyMatrix4(brig.matrixWorld)); soundRod.rotation.set(0, brig.rotation.y + .4, 0);
    cam(soundRod.position.clone().add(V(-.6, .55 - p * .1, 1.1)), soundRod.position, 36); sunFollow(soundRod.position); return {}; },
  mc_log_close(t, p){ look('pocket'); only(cabin, lantern); renderer.toneMappingExposure = 1.0; lantern.position.set(.3, 1.3, -.3); fill.position.copy(lantern.position); fill.intensity = 2.8; fill.distance = 6; fill.color.set(0xffc880);
    cam(V(-.05, 1.05, .18), V(-.07, .845, .02), 34); return {}; },
  mc_theory_vapors(t, p){ look('pocket'); only(hold, lantern); holdWaterAt(t, -5); vapor.visible = true; lantern.position.set(.4, 2.3, 4); fill.position.copy(lantern.position);
    fill.intensity = 3.5 + Math.sin(t * 9) * .4; fill.distance = 14; fill.color.set(0xffc880);
    vapor.children.forEach(s => { const [x, z, ph, sp] = s.userData; const a = (t * .12 * sp + ph) % 1; s.position.set(x, .3 + a * 2.6, z); s.scale.setScalar(.6 + a * 2.2); s.material.opacity = .16 * Math.sin(Math.PI * a); });
    cam(V(-.8, 1.4, 6.5 - p), V(0, 1.2, -2), 48); return {}; },
  mc_theory_evac(t, p){ look('grey'); only(sky, water, brig, yawlFree, captain, sarah, sophia, crew[0], crew[1]); water.material.uniforms.time.value = t * .5; mcSail(t, 0); brig.userData.yawl.visible = false;
    floatBoat(yawlFree, -5.8, -1, t, 0, .3); yawlFree.rotation.y = 0;
    for (const q of [captain, sarah, sophia, crew[0], crew[1]]){ rest(q); mood(q, 'scared'); }
    onDeck(captain, -2.6, -2); captain.rotation.y = -Math.PI / 2; captain.userData.arms[1].sh.rotation.set(-1.6, 0, -.2); captain.userData.neck.rotation.y = .4;
    sarah.position.set(-5.8, yawlFree.position.y + .05, -.2); sarah.rotation.y = Math.PI / 2; sophia.position.set(-5.8, yawlFree.position.y + .05, -1.0); sophia.rotation.y = Math.PI / 2;
    crew[0].position.set(-5.8, yawlFree.position.y + .05, -2.0); crew[0].rotation.y = Math.PI / 2; seat(crew[0]); crew[0].position.y -= .35;
    onDeck(crew[1], -3.1, -.5); crew[1].rotation.y = -Math.PI / 2; crew[1].userData.arms.forEach(a => a.sh.rotation.x = -.9);
    cam(V(-17, 4.5, 6), V(-4, 2, -1), 38); sunFollow(V(0, 0, 0)); return {}; },
  mc_lifeboat_alone_sea(t, p){ look('grey'); only(sky, water, yawlFree, captain, sarah, crew[0], crew[1], crew[2]); water.material.uniforms.time.value = t * .55;
    floatBoat(yawlFree, 0, t * .6, t, 0, .8); yawlFree.rotation.y = 0; const yb = yawlFree.position;
    [[captain, 0, -1.5], [sarah, .3, -.4], [crew[0], -.35, .4], [crew[1], .35, 1.1], [crew[2], -.3, 1.8]].forEach(([q, x, z], i) => { rest(q); mood(q, 'tired'); q.position.set(x, yb.y - .3, yb.z + z); q.rotation.y = Math.PI; seat(q);
      if (i > 1) q.userData.arms.forEach(a => { a.sh.rotation.x = -1.2 + Math.sin(t * 2.4) * .5; }); });
    cam(V(9 - p * 3, 5 + p * 10, yb.z + 14), V(0, 0, yb.z), 40); sunFollow(yb); scene.fog = new THREE.Fog(0xb9c3cb, 40, 600); return {}; },
  mc_lifeboat_far(t, p){ look('grey'); only(sky, water, yawlFree, brig); water.material.uniforms.time.value = t * .55; floatBoat(yawlFree, 0, 0, t, 0, .8); mcDrift(t);
    floatBoat(yawlFree, 0, 4, t, 0, .8); brig.position.set(30, brig.position.y, -120 - p * 20); cam(V(-4, 2.5, 15), V(6, 2, -40), 32); sunFollow(V(0, 0, 0)); scene.fog = new THREE.Fog(0xb9c3cb, 20, 260); return {}; },
  mc_doyle_desk(t, p){ look('desk'); only(desk, doyle); spot.position.set(-.6, 2.2, -.2); spot.target.position.set(.1, .8, .1); spot.intensity = 6; spot.color.set(0xffd9a0);
    fill.position.set(-.6, 1.2, -.25); fill.intensity = 2.2; fill.distance = 5; fill.color.set(0xffc070); rest(doyle); mood(doyle, 'neutral'); doyle.position.set(0, .05, .75); doyle.rotation.y = Math.PI; seat(doyle);
    const u = doyle.userData; u.spine.rotation.x = .3; u.arms[0].sh.rotation.x = -1.1; u.arms[0].el.rotation.x = -.9 + Math.sin(t * 7) * .08; u.arms[1].sh.rotation.x = -.9; u.arms[1].el.rotation.x = -1.1;
    const h = headOf(doyle); cam(h.clone().add(V(.9, .25, -1.4)), h.clone().add(V(-.1, -.25, .2)), 38); return {sepia: true}; },
  mc_newspaper(t, p){ look('desk'); only(desk); spot.position.set(-.4, 2.0, 0); spot.target.position.set(.1, .8, .1); spot.intensity = 6; spot.color.set(0xffd9a0);
    cam(V(.1, 1.45 - p * .25, .45), V(.1, .79, .05), 38); return {sepia: true}; },
  mc_ghost_ship_fog(t, p){ look('night'); only(sky, water, brig, lantern); water.material.uniforms.time.value = t * .35; mcDrift(t, .02); brig.userData.yawl.visible = false;
    brig.updateMatrixWorld(true); lantern.position.copy(V(0, 4, -12.5).applyMatrix4(brig.matrixWorld)); strobe.color.set(0xffb060); strobe.intensity = 3; strobe.distance = 25; strobe.position.copy(lantern.position);
    scene.fog = new THREE.Fog(0x1a2638, 20, 160); cam(V(-50 + p * 10, 5, 45), V(0, 8, 0), 38); sunFollow(V(0, 0, 0)); return {}; },
  end_card(t, p){ look('dawn'); only(sky, water, brig); water.material.uniforms.time.value = t * .4; mcDrift(t); brig.userData.yawl.visible = false;
    cam(V(-55 - p * 12, 7 + p * 8, 40), V(0, 9, 0), 38); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
