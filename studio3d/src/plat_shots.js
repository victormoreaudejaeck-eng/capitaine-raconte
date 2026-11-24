
// ===================== Plateau télé : plans =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const P0 = (...x) => { townLook(); only(sky, town, clouds, ...x); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; };
const PI = (...x) => { townLook(); only(studioB, ...x); scene.background = new THREE.Color(0x0a0e1c); scene.fog = null; hemi.intensity = 1.6; sunLight.intensity = .6; };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
const SW = (x, y, z) => { studioB.updateMatrixWorld(true); return studioB.localToWorld(V(x, y, z)); };
const panel = () => [...citizens.slice(0, 5), ...reds.slice(0, 5)];
function micIn(p, k){ p.userData.armR.rotation.x = -1.7; p.updateMatrixWorld(true); mics[k].position.copy(p.localToWorld(V(.75, 3.0, .75))); mics[k].rotation.set(.5, 0, 0); mics[k].visible = true; }
function seatPanel(t, mood = 'neutral', shout = false){ panel().forEach((c, i) => { const w = SW(-7.2 + i * 1.6, 0, -2.3); place(c, w.x, w.z, 0, typeof mood === 'function' ? mood(i) : mood); if (shout){ c.position.y = Math.abs(Math.sin(t * 9 + i)) * .3; c.userData.armR.rotation.x = -2.6 + Math.sin(t * 8 + i) * .4; c.userData.armL.rotation.x = -2.2 + Math.cos(t * 7 + i) * .4; } else micIn(c, i); }); }
const SHOTS = {
  town_p(t, p){ P0(...citizens.slice(0, 10), ...mics.slice(0, 10)); cloudsMove(t); citizens.slice(0, 10).forEach((c, i) => { place(c, (i % 2 ? 7.4 : -7.4), -30 + ((i * 7 + t * 2.4) % 50), i % 2 ? Math.PI : 0, 'angry'); bWalk(c, t + i, .9); micIn(c, i); }); cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {chipOverride: '🎙️ VILLE PLATEAU TÉLÉ'}; },
  street_mics(t, p){ P0(citizens[1], reds[1], mics[0], mics[1]); place(citizens[1], -1, 4, .5, 'angry'); micIn(citizens[1], 0); place(reds[1], 1, 4, -.5, 'angry'); micIn(reds[1], 1); cam(V(0, 3.6, 10 - p), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'LAISSEZ-MOI FINIR !'}; },
  studio_wide(t, p){ PI(...panel(), ...mics, tvCam, me); seatPanel(t); const w = SW(0, 0, 6.8); place(me, w.x, w.z, Math.PI, 'side'); const c = SW(-6, 0, 7); tvCam.position.copy(c); tvCam.rotation.y = Math.PI + .5; cam(SW(lerp(4, 1, p), 6.5, 16), SW(0, 3, -1), 46); return {chipOverride: '🥖 10 CHRONIQUEURS · 1 BAGUETTE'}; },
  panel_close(t, p){ PI(...panel().slice(3, 7), ...mics.slice(3, 7)); seatPanel(t, i => ['smug', 'angry', 'side', 'happy'][i % 4]); cam(SW(-1.6, 3.6, 4.5 - p * .6), SW(-1.6, 3.2, -2.3), 42); return {bubble: 'ELLE EST TROP CUITE !'}; },
  baguette_hero(t, p){ PI(); const b = studioB.userData.baguette; b.rotation.set(0, t * .6, Math.PI / 2); cam(SW(.6, 2.4, 7.6 - p * .5), SW(0, 1.9, 4.2), 38); return {stamp: 'PERSONNE NE L\'A GOÛTÉE'}; },
  bandeau_s(t, p){ P0(bakery, bandeau, citizens[3]); place(citizens[3], -16.6, 30, Math.PI / 2, 'happy'); bandeau.position.set(-12.5, 2.0, 30.5); bandeau.rotation.y = Math.PI / 2; bandeau.scale.setScalar(.55); cam(V(-8.5 + p * .4, 3.2, 30.6), V(-14, 2.8, 30.4), 44); sunFollow(V(-16, 0, 30)); return {}; },
  me_try(t, p){ PI(me, ...panel().slice(0, 2)); const w = SW(0, 0, 5.6); place(me, w.x, w.z, Math.PI, 'happy'); me.userData.armR.rotation.x = -2.6; cam(SW(0, 3.6, 13 - p), SW(0, 3.2, 4), 42); return {bubble: 'UNE BAGUETTE, SVP…'}; },
  cut_off(t, p){ PI(...panel().slice(4, 6), ...mics.slice(4, 6)); seatPanel(t, 'angry'); cam(SW(-.8, 3.6, 4 - p * .5), SW(-.8, 3.3, -2.3), 40); return {stamp: 'ON VOUS COUPE'}; },
  pub_s(t, p){ PI(pubScreen); pubScreen.position.copy(SW(0, 4.5, -6.7)); pubScreen.rotation.set(0, 0, 0); pubScreen.scale.setScalar(.7); cam(SW(0, 4.5, 4 - p * .4), SW(0, 4.5, -6.8), 42); return {}; },
  fact_s(t, p){ PI(factCheck, ...panel(), ...mics); seatPanel(t, 'side'); factCheck.position.copy(SW(0, 5.6, -4)); cam(SW(0, 5, 9 - p), SW(0, 4.6, -3), 44); return {}; },
  debate_continues(t, p){ PI(...panel(), ...mics); seatPanel(t, 'angry'); cam(SW(lerp(-6, 6, p), 4, 7), SW(0, 3, -2), 44); return {chipOverride: '🔁 LE DÉBAT CONTINUE'}; },
  shouting(t, p){ PI(...panel()); mics.forEach(m => m.visible = false); seatPanel(t, 'angry', true); cam(SW(0, 5, 11 - p), SW(0, 3.4, -2), 46); return {stamp: 'ÇA HURLE'}; },
  raisins(t, p){ PI(...panel().slice(2, 4)); mics.forEach(m => m.visible = false); seatPanel(t, 'angry', true); cam(SW(-3.2, 3.6, 3.6 - p * .4), SW(-3.2, 3.4, -2.3), 40); return {bubble: 'PAIN AUX RAISINS = SCANDALE !'}; },
  arcom_in(t, p){ PI(arcomAgent, ...panel()); mics.forEach(m => m.visible = false); seatPanel(t, 'shock'); const w = SW(lerp(10, 2, Math.min(1, p * 1.5)), 0, 3); place(arcomAgent, w.x, w.z, -Math.PI / 2, 'neutral'); bWalk(arcomAgent, t, .8); cam(SW(4, 4.5, 12 - p), SW(1, 3, 0), 44); return {chipOverride: '⚖️ L\'ARCOM DÉBARQUE'}; },
  unplug(t, p){ PI(arcomAgent, plug); const w = SW(2, 0, 3); place(arcomAgent, w.x, w.z, 0, 'neutral'); arcomAgent.userData.armR.rotation.x = -1.2; plug.position.copy(SW(3.2, 2.5 - p * .5, 3.8)); plug.rotation.set(0, 0, -p * .8); cam(SW(3, 3.4, 9.5 - p * .5), SW(2.4, 3, 3), 40); return {stamp: 'DÉBRANCHÉ'}; },
  screen_cut(t, p){ PI(cutScreen); cutScreen.position.copy(SW(0, 4.5, -6.7)); cutScreen.scale.setScalar(.7); cam(SW(0, 4.5, 4 - p * .4), SW(0, 4.5, -6.8), 42); return {chipOverride: '📺 COMME UNE CERTAINE CHAÎNE EN 2025'}; },
  no_bread(t, p){ P0(bakery, closedB, me); place(me, -13.2, 32.6, -Math.PI / 2 - .4, 'scared'); closedB.position.set(-15.9, 2.5, 30); closedB.rotation.y = Math.PI / 2; cam(V(-9 + p * .4, 3.4, 31.8), V(-15, 2.8, 30.2), 44); sunFollow(V(-16, 0, 30)); return {}; },
  audience_s(t, p){ PI(audience); audience.position.copy(SW(0, 4.6, -5)); audience.scale.setScalar(.75); cam(SW(0, 4.6, 3.6 - p * .4), SW(0, 4.6, -5), 42); return {stamp: 'RECORD'}; },
  question_p(t, p){ P0(citizens[0], reds[0], mics[0], mics[1]); place(citizens[0], -1, 4, .4, 'angry'); micIn(citizens[0], 0); place(reds[0], 1, 4, -.4, 'angry'); micIn(reds[0], 1); cam(V(0, 3.6, 10 - p), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'LE PIRE DÉBAT TÉLÉ ?'}; },
  end_card(t, p){ P0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
