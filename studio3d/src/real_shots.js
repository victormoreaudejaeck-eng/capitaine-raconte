
// ================= SHOTS : f(t, p, dur) -> fx =================
const SHOTS = {
  // --- hook ---
  pocket_face(t, p){ look('pocket'); only(pocket, tony, torch, beam); const h = posePocket(t, {m: 'scared'});
    cam(h.clone().add(V(.7, .05, 1.55 - p * .25)), h.clone().add(V(0, -.08, 0)), 34); handheld(t, .006); return {}; },
  hull_storm(t, p){ look('storm'); SEA = 1.15; only(sky, stormSea, rain, boat); updateStormSea(t, 0, 0);
    floatBoat(boat, 0, 0, t, 0, 1.3, true); keel(boat, 1); const c = V(-26 + p * 6, 7, 30); cam(c, V(0, 1, 0), 36); handheld(t, .25); updateRain(t, c); sunFollow(V(0, 0, 0)); return {lightning: (t % 4.2) < .1}; },
  ocean_wide(t, p){ look('storm'); SEA = 1.2; only(sky, stormSea, rain, boat); updateStormSea(t, 0, 0);
    floatBoat(boat, 0, 0, t, 0, 1.3, true); keel(boat, 1); cam(V(0, 60 + p * 40, 70 + p * 30), V(0, 0, 0), 42); updateRain(t, V(0, 20, 0)); sunFollow(V(0, 0, 0)); return {}; },
  title(t, p){ look('storm'); SEA = 1.2; only(sky, stormSea, rain, boat); updateStormSea(t, 0, 0);
    floatBoat(boat, 0, 0, t, 0, 1.3, true); keel(boat, 1); cam(V(32 - p * 6, 10, 26), V(0, 0, 0), 38); updateRain(t, camera.position); sunFollow(V(0, 0, 0)); return {title: true}; },
  // --- the race ---
  race_fleet(t, p){ look('day'); only(sky, water, boat, ...fleet); water.material.uniforms.time.value = t * .5;
    const z = t * 6; floatBoat(boat, 0, z, t, -.2, .3);
    fleet.forEach((b, i) => floatBoat(b, -60 + i * 28, z + 40 + (i % 2) * 35, t, -.2, .3));
    cam(V(48 - p * 10, 12, z - 70 + p * 8), V(0, 9, z + 10), 40); sunFollow(V(0, 0, z)); return {}; },
  tony_helm(t, p){ look('day'); only(sky, water, boat, tony); water.material.uniforms.time.value = t * .5; const z = t * 6;
    floatBoat(boat, 0, z, t, -.15, .3); rest(tony); mood(tony, 'happy'); const u = tony.userData;
    tony.position.set(.6, 1.32, -6.5); boat.updateMatrixWorld(true); tony.position.applyMatrix4(boat.matrixWorld); tony.rotation.set(boat.rotation.x, Math.PI - .5, boat.rotation.z * .6);
    u.arms[0].sh.rotation.x = u.arms[1].sh.rotation.x = -1.0; u.arms[0].el.rotation.x = u.arms[1].el.rotation.x = -.6; u.neck.rotation.y = Math.sin(t * .7) * .3;
    tony.updateMatrixWorld(true); const h = u.neck.getWorldPosition(V(0, 0, 0));
    cam(h.clone().add(V(-1.6 + p * .3, .35, -2.6)), h.clone().add(V(0, -.05, 0)), 30); sunFollow(h); return {}; },
  boat_hero(t, p){ look('day'); only(sky, water, boat); water.material.uniforms.time.value = t * .5; const z = t * 6; floatBoat(boat, 0, z, t, -.22, .3);
    const a = lerp(-2.2, -.6, ease(p)); cam(V(Math.sin(a) * 50, 6 + p * 8, z + Math.cos(a) * 50), V(0, 9, z + 1), 38); sunFollow(V(0, 0, z)); return {}; },
  chart(t, p){ look('desk'); only(chart, table, dividers, pin); spot.position.set(.4, 1.6, .5); spot.target.position.set(0, 0, 0);
    chart.position.set(0, 0, 0); dividers.position.set(-.3, .2, .55); pin.position.set(.12, .01 + Math.abs(Math.sin(t * 4)) * .01, .33); drawRoute(ease(p)); routeLine.visible = true;
    cam(V(.05, 1.25 - p * .35, .65 - p * .1), V(0, 0, .2), 40); return {}; },
  boat_lonely(t, p){ look('grey'); only(sky, water, boat); water.material.uniforms.time.value = t * .6; const z = t * 5; floatBoat(boat, 0, z, t, -.25, .3);
    cam(V(10, 30 + p * 70, z - 50 - p * 60), V(0, 2, z), 40); sunFollow(V(0, 0, z)); return {}; },
  // --- the storm ---
  storm_boat(t, p){ look('storm'); SEA = 1.0; only(sky, stormSea, rain, boat); updateStormSea(t, 0, 0); floatBoat(boat, 0, 0, t, -.35, 1.2); keel(boat, 0);
    const c = V(-22, 5, -24 + p * 6); cam(c, V(0, 6, 4), 40); handheld(t, .2); updateRain(t, c); sunFollow(V(0, 0, 0)); return {lightning: (t % 3.6) < .09}; },
  storm_wave(t, p){ look('storm'); SEA = 1.45; only(sky, stormSea, rain, boat); updateStormSea(t, 0, 0); floatBoat(boat, 8, 16, t, -.45, 1.5); keel(boat, 0);
    const c = V(-6, seaH(-6, -16, t) + 2.2, -16); cam(c, V(6, 10, 14), 50); handheld(t, .25); updateRain(t, c); sunFollow(V(0, 0, 0)); return {}; },
  cabin_shock(t, p){ look('pocket'); only(pocket, tony); pocket.rotation.z = Math.PI; pocket.position.y = 1.4; rest(tony); mood(tony, p > .2 ? 'scared' : 'neutral');
    const u = tony.userData; tony.position.set(0, -1.2, 0); u.arms[0].sh.rotation.z = .7; u.arms[1].sh.rotation.z = -.7; u.neck.rotation.x = p > .2 ? -.3 : 0;
    fill.intensity = 4; fill.color.set(0xffe2c0); fill.distance = 8; fill.position.set(.6, 1.2, 1.4); tony.updateMatrixWorld(true); const h = u.neck.getWorldPosition(V(0, 0, 0));
    cam(h.clone().add(V(.3, .15, 1.6 - p * .4)), h.clone().add(V(0, -.05, 0)), 34); handheld(t, p > .2 ? .03 : .004); return {flashW: p > .2 && p < .27}; },
  keel_snap(t, p){ look('under'); only(boat, rays, bubbles, motes, underSurf); boat.position.set(0, 0, 0); boat.rotation.set(0, 0, -.3 - ease(clamp((p - .3) / .7, 0, 1)) * .5);
    keel(boat, ease(clamp((p - .3) / .7, 0, 1))); bubblesAt(V(0, -5, 0), t, 2.5, 6); cam(V(15, -9, 16), V(0, -3.5, 0), 44); handheld(t, p > .3 && p < .5 ? .15 : .02); return {flashW: p > .3 && p < .35}; },
  capsize(t, p){ look('storm'); SEA = .8; only(sky, stormSea, rain, boat); updateStormSea(t, 0, 0); keel(boat, 1);
    floatBoat(boat, 0, 0, t, -ease(p) * Math.PI, .4); boat.position.y += 1 + ease(p) * .9; const c = V(-30, 11, 10); cam(c, V(0, 4, 0), 42); handheld(t, .18); updateRain(t, c); sunFollow(V(0, 0, 0)); return {}; },
  // --- the air pocket ---
  pocket_dark(t, p){ look('pocket'); only(pocket, tony, torch, beam); const h = posePocket(t, {m: 'scared', torchOn: p > .45});
    cam(h.clone().add(V(-1.2, .25, 1.8)), h.clone().add(V(.2, -.3, 0)), 40); return {dark: p < .45 ? .5 : 0}; },
  pocket_water(t, p){ look('pocket'); only(pocket, tony, torch, beam, bubbles); const h = posePocket(t, {m: 'scared', lvl: lerp(-.15, .12, p)}); bubblesAt(V(.2, -1.2, .4), t, .3, 1.3);
    cam(h.clone().add(V(1.1, -.45, 1.2)), h.clone().add(V(0, -.25, 0)), 40, .04); return {}; },
  pocket_wide(t, p){ look('pocket'); only(pocket, tony, torch, beam); const h = posePocket(t, {m: 'scared', lvl: .05}); cam(V(.3, .75, 3.6 - p * .5), h.clone().add(V(0, -.3, 0)), 48); return {}; },
  pocket_choc(t, p){ look('pocket'); only(pocket, tony, torch, beam, choc); const h = posePocket(t, {m: 'tired', lvl: .05}); const u = tony.userData;
    u.arms[0].sh.rotation.set(-1.4, .2, .3); u.arms[0].el.rotation.x = -1.4; tony.updateMatrixWorld(true); choc.position.copy(u.arms[0].hand.getWorldPosition(V(0, 0, 0))).add(V(0, .03, .03)); choc.rotation.set(.3, .4, 0);
    cam(h.clone().add(V(-.75, .05, 1.15)), h.clone().add(V(-.15, -.22, .1)), 34); return {}; },
  hull_night(t, p){ look('night'); only(sky, water, boat, beacon); water.material.uniforms.time.value = t * .4; floatBoat(boat, 0, 0, t, 0, .3, true); keel(boat, 1);
    beacon.position.set(2.8, .1 + Math.sin(t * 1.3) * .05, 5); beacon.userData.led.material.color.set(Math.sin(t * 10) > .6 ? 0xff2020 : 0x220000); strobe.intensity = Math.sin(t * 10) > .6 ? 3 : 0; strobe.position.copy(beacon.position).add(V(0, .3, 0));
    cam(V(0, 32 - p * 6, 28), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {}; },
  pocket_days(t, p){ look('pocket'); only(pocket, tony, torch, beam); const h = posePocket(t, {m: 'tired', lvl: lerp(.05, .35, p), shiver: 1}); cam(h.clone().add(V(.9, .2, 1.5)), h.clone().add(V(0, -.15, 0)), 38); return {days: true, breath: true, cold: true}; },
  // --- the search ---
  beacon(t, p){ look('grey'); only(sky, water, boat, beacon); water.material.uniforms.time.value = t * .5; floatBoat(boat, 0, 0, t, 0, .3, true); keel(boat, 1);
    beacon.position.set(2.8, .1 + Math.sin(t * 1.3) * .05, 5); beacon.userData.led.material.color.set(Math.sin(t * 10) > .6 ? 0xff2020 : 0x220000);
    cam(V(5.6, 1.4, 8.4 - p * .4), V(1.8, .4, 3.5), 34); sunFollow(V(0, 0, 0)); return {pulse: true}; },
  plane_fly(t, p){ look('grey'); only(sky, water, plane); water.material.uniforms.time.value = t * .5;
    plane.position.set(lerp(-260, 160, p), 90, 0); plane.rotation.set(0, Math.PI / 2, -.06); plane.children.forEach(c => { if (c.geometry && c.geometry.type === 'CircleGeometry' && c.material.opacity < .5) c.rotation.z = t * 30; });
    cam(V(0, 40, 120), V(plane.position.x * .5, 80, 0), 40); sunFollow(V(0, 0, 0)); return {}; },
  plane_view(t, p){ look('grey'); only(sky, water, boat); water.material.uniforms.time.value = t * .5; floatBoat(boat, 0, 0, t, 0, .3, true); keel(boat, 1);
    const a = t * .2; cam(V(Math.cos(a) * 120, 160, Math.sin(a) * 120), V(0, 0, 0), 28 - p * 10); sunFollow(V(0, 0, 0)); return {scope: true}; },
  frigate(t, p){ look('grey'); only(sky, water, frigate); water.material.uniforms.time.value = t * .5; frigate.position.set(0, -1.5, lerp(-60, 10, p)); frigate.rotation.set(0, 0, Math.sin(t * .5) * .01);
    frigate.userData.radar.rotation.y = t * 2; cam(V(70, 10, 120), V(0, 12, frigate.position.z), 38); sunFollow(V(0, 0, 0)); return {}; },
  rhib(t, p){ look('grey'); only(sky, water, boat, rhib, sailorA, sailorB); water.material.uniforms.time.value = t * .5; floatBoat(boat, 0, 0, t, 0, .3, true); keel(boat, 1);
    rhib.position.set(lerp(-30, -7.5, ease(p)), .2, 2); rhib.rotation.set(0, Math.PI / 2, 0);
    for (const [s, dz] of [[sailorA, .9], [sailorB, -1.4]]){ rest(s); mood(s, 'neutral'); s.position.set(rhib.position.x + dz, .05, 2); s.rotation.y = Math.PI / 2; s.userData.legs.forEach(l => { l.hip.rotation.x = -1.2; l.knee.rotation.x = 1.3; }); s.position.y -= .3; }
    cam(V(lerp(-24, -14, ease(p)), 2.4, 9.5), V(lerp(-27, -8, ease(p)), 1.1, 2), 34); sunFollow(V(0, 0, 0)); return {}; },
  knock_out(t, p){ look('grey'); only(sky, water, boat, rhib, sailorA); water.material.uniforms.time.value = t * .5; floatBoat(boat, 0, 0, t, 0, .2, true); keel(boat, 1);
    rhib.position.set(-4.3, .2, 1.2); rhib.rotation.set(0, Math.PI / 2 + .15, 0); rest(sailorA); mood(sailorA, 'neutral'); const u = sailorA.userData;
    sailorA.position.set(-3.1, .15, 1.2); sailorA.rotation.y = Math.PI / 2; u.spine.rotation.x = .25; u.arms[1].sh.rotation.x = -1.7 + (Math.sin(t * 14) > 0 && p > .3 ? .35 : 0); u.arms[1].el.rotation.x = -.3;
    sailorA.updateMatrixWorld(true); const h = u.neck.getWorldPosition(V(0, 0, 0)); cam(h.clone().add(V(1.9, .25, 2.6)), h.clone().add(V(.5, -.25, -.2)), 38); sunFollow(h); return {knock: p > .3 ? 'TOC TOC' : null}; },
  knock_in(t, p){ look('pocket'); only(pocket, tony, torch, beam); const h = posePocket(t, {m: p > .45 ? 'happy' : 'scared', lvl: .08}); const u = tony.userData;
    u.arms[0].sh.rotation.set(-2.7 + (Math.sin(t * 14) > 0 && p > .5 ? .25 : 0), 0, .2); u.arms[0].el.rotation.x = -.3; cam(h.clone().add(V(-.25, -.1, 2.3)), h.clone().add(V(0, .12, 0)), 46); return {knock: p > .5 ? 'TOC TOC TOC' : null}; },
  // --- the rescue ---
  swim_under(t, p){ look('under'); only(tony, bubbles, rays, motes, underSurf); rest(tony); mood(tony, 'scared'); const u = tony.userData;
    tony.position.set(Math.sin(t * .8) * .2, -7.5 + ease(p) * 4.8, 0); tony.rotation.set(-.25, .4, Math.sin(t * 2) * .05);
    u.arms.forEach((a, i) => { a.sh.rotation.set(-2.7 + Math.sin(t * 3 + i) * .35, 0, (i ? -1 : 1) * .25); a.el.rotation.x = -.3; });
    u.legs.forEach((l, i) => { l.hip.rotation.x = Math.sin(t * 7 + i * Math.PI) * .45; l.knee.rotation.x = .35 + Math.sin(t * 7 + i * Math.PI) * .25; });
    bubblesAt(tony.position.clone().add(V(0, 1.6, 0)), t, .3, 7); cam(V(2.6, tony.position.y - 3.2, 4.2), tony.position.clone().add(V(0, 1.8, 0)), 52); return {}; },
  surface(t, p){ look('dawn'); only(sky, water, boat, tony, rhib, sailorB); water.material.uniforms.time.value = t * .45; floatBoat(boat, 0, 0, t, 0, .2, true); keel(boat, 1);
    rest(tony); mood(tony, 'happy'); const u = tony.userData; tony.position.set(3.6, -1.25 + easeOut(clamp(p * 2, 0, 1)) * .55, 2.2); tony.rotation.y = -.6; u.arms[1].sh.rotation.set(-2.8 * easeOut(clamp((p - .3) * 2, 0, 1)), 0, -.2);
    rhib.position.set(7, .2, 3.5); rhib.rotation.y = .4; rest(sailorB); mood(sailorB, 'happy'); sailorB.position.set(6.3, .15, 3.3); sailorB.rotation.y = -1.6; sailorB.userData.arms[0].sh.rotation.x = -1.6;
    tony.updateMatrixWorld(true); const h = u.neck.getWorldPosition(V(0, 0, 0)); cam(h.clone().add(V(-1.6, .4, 3.4)), h.clone().add(V(.6, .1, 0)), 34); sunFollow(h); return {}; },
  rescue_dawn(t, p){ look('dawn'); only(sky, water, frigate, boat); water.material.uniforms.time.value = t * .45; frigate.position.set(-60, -1.5, -90); frigate.rotation.y = .7; frigate.userData.radar.rotation.y = t * 2;
    floatBoat(boat, 12, 0, t, 0, .2, true); keel(boat, 1); cam(V(60, 10 + p * 10, 70), V(-20, 8, -40), 40); sunFollow(V(0, 0, 0)); return {}; },
  sail_again(t, p){ look('day'); only(sky, water, boat); water.material.uniforms.time.value = t * .5; keel(boat, 0); const z = t * 6; floatBoat(boat, 0, z, t, -.22, .3);
    cam(V(-30 + p * 12, 4 + p * 6, z - 45 + p * 20), V(0, 10, z), 40); sunFollow(V(0, 0, z)); return {}; },
  end_card(t, p){ look('dawn'); only(sky, water, boat); water.material.uniforms.time.value = t * .45; keel(boat, 0); const z = t * 6; floatBoat(boat, 0, z, t, -.22, .3);
    cam(V(-45 - p * 10, 7 + p * 8, z - 20), V(0, 9, z), 40); sunFollow(V(0, 0, z)); return {endcard: true}; },
};

