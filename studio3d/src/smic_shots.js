
// ===================== SMIC : plans =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const S0 = (...x) => { townLook(); only(sky, town, clouds, ...x); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
function holdFront(p, obj, dy = 2.6, dz = 1.1){ p.userData.armR.rotation.x = -1.3; p.updateMatrixWorld(true); obj.position.copy(p.localToWorld(V(.95, dy - .6, dz + .5))); obj.rotation.set(0, p.rotation.y, 0); }
const SHOTS = {
  town_s(t, p){ S0(...citizens.slice(0, 10), ...cars); cloudsMove(t); citizens.slice(0, 10).forEach((c, i) => { place(c, (i % 2 ? 7.4 : -7.4), -30 + ((i * 7 + t * 2.4) % 50), i % 2 ? Math.PI : 0, 'neutral'); bWalk(c, t + i, .9); });
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, -60 + ((t * 8 + i * 30) % 120)); c.rotation.y = i % 2 ? Math.PI : 0; }); cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {chipOverride: '📰 GRANDE NOUVELLE'}; },
  paper_read(t, p){ S0(me, paper); place(me, 0, 4, 0, 'shock'); holdFront(me, paper, 3.0, 1.2); cam(V(.6, 3.3, 10.5 - p * .6), V(.5, 2.9, 4.6), 40); sunFollow(V(0, 0, 4)); return {}; },
  paper_close(t, p){ S0(paper); paper.position.set(0, 3, 4); paper.rotation.set(0, 0, 0); cam(V(0, 3, 6.8 - p * .5), V(0, 3, 4), 40); sunFollow(V(0, 0, 4)); return {stamp: 'VRAI · 1er DÉCEMBRE'}; },
  party(t, p){ S0(confetti, fwS, me, ...citizens.slice(0, 8)); confettiAt(t); fwSAt(t); place(me, 0, 3, 0, 'happy'); me.position.y = Math.abs(Math.sin(t * 7)) * .4; me.userData.armR.rotation.x = me.userData.armL.rotation.x = -2.9; citizens.slice(0, 8).forEach((c, i) => { place(c, -6 + (i % 4) * 4, -1 + Math.floor(i / 4) * 2.5, 0, 'happy'); c.position.y = Math.abs(Math.sin(t * 7 + i)) * .35; c.userData.armR.rotation.x = -2.8; });
    cam(V(0, 4.5, 14 - p), V(0, 4.5, 0), 46); sunFollow(V(0, 0, 0)); return {chipOverride: '🎉 FÊTE DU SMIC'}; },
  fireworks_s(t, p){ S0(fwS, ...citizens.slice(0, 6)); fwSAt(t); citizens.slice(0, 6).forEach((c, i) => { place(c, -4 + i * 1.6, 4, Math.PI, 'happy'); c.userData.armR.rotation.x = -2.8; }); scene.background = new THREE.Color(0x1a2040); hemi.intensity = 1.2; sunLight.intensity = .5; scene.fog = null; cam(V(0, 1.6, 13), V(0, 9, -6), 50); return {}; },
  baker_tag(t, p){ S0(bakery, tagBaguette, citizens[3]); place(citizens[3], -16.6, 30, Math.PI / 2, 'smug'); citizens[3].userData.armR.rotation.x = -1.6; tagBaguette.position.set(-15.3, 3.0, 30.8); tagBaguette.rotation.y = Math.PI / 2; cam(V(-9.5 + p * .4, 3.3, 31.0), V(-15.5, 3.0, 30.6), 42); sunFollow(V(-16, 0, 30)); return {}; },
  tag_close(t, p){ S0(tagBaguette); tagBaguette.position.set(0, 3, 4); tagBaguette.rotation.set(0, 0, 0); cam(V(0, 3, 7.4 - p * .5), V(0, 3, 4), 40); sunFollow(V(0, 0, 4)); return {stamp: '+1,7 %'}; },
  rent(t, p){ S0(me, rentLetter); place(me, 0, 4, 0, 'scared'); holdFront(me, rentLetter, 3.0, 1.2); cam(V(.6, 3.3, 10.5 - p * .6), V(.5, 2.9, 4.6), 40); sunFollow(V(0, 0, 4)); return {chipOverride: '🏠 LE LOYER'}; },
  bus(t, p){ S0(busSign, me); busSign.position.set(1.6, 0, 2); place(me, -.6, 3.2, .3, 'shock'); cam(V(-.4, 3.6, 10 - p * .6), V(.4, 3.4, 2), 42); sunFollow(V(0, 0, 2)); return {chipOverride: '🚌 LE BUS'}; },
  invoice_s(t, p){ S0(me, invoice); place(me, 0, 4, 0, 'shock'); holdFront(me, invoice, 3.0, 1.2); cam(V(.6, 3.3, 10.5 - p * .6), V(.5, 2.9, 4.6), 40); sunFollow(V(0, 0, 4)); return {stamp: 'MÊME LA FÊTE'}; },
  calc_s(t, p){ S0(me, calc); place(me, 0, 4, 0, 'side'); holdFront(me, calc, 2.9, 1.2); cam(V(.6, 3.3, 10.5 - p * .6), V(.5, 2.9, 4.6), 40); sunFollow(V(0, 0, 4)); return {}; },
  calc_close(t, p){ S0(calc); calc.position.set(0, 3, 4); calc.rotation.set(0, 0, 0); cam(V(0, 3.4, 6.4 - p * .4), V(0, 3.3, 4), 40); sunFollow(V(0, 0, 4)); return {}; },
  croissant_buy(t, p){ S0(counterS, croissantS, citizens[3], me, ...coinsS); counterS.position.set(0, .6, 2.6); croissantS.position.set(-.6, 1.25, 2.6); place(citizens[3], 0, .8, 0, 'smug'); place(me, .8, 5.2, Math.PI, 'happy'); coinsS.forEach((c, i) => { c.position.set(.6 + (i % 3) * .5, 1.24, 2.8 + Math.floor(i / 3) * .4); });
    cam(V(-5, 4.6, 9 - p), V(0, 2, 2.6), 42); sunFollow(V(0, 0, 3)); return {chipOverride: '🥐 POUR FÊTER ÇA'}; },
  missing_s(t, p){ S0(missing, me); missing.position.set(0, 5.6, 3); place(me, 0, 3.6, 0, 'scared'); me.userData.armL.rotation.z = .6; me.userData.armR.rotation.z = -.6; cam(V(0, 4.4, 10.5 - p * .6), V(0, 4.3, 3), 42); sunFollow(V(0, 0, 3)); return {}; },
  me_sad(t, p){ S0(me); place(me, 0, 4, 0, 'scared'); me.userData.head.rotation.x = .3; cam(V(.4, 3.4, 8.8 - p * .6), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'UN CENTIME…'}; },
  question_s(t, p){ S0(me, citizens[0]); place(me, -1, 4, .4, 'side'); place(citizens[0], 1, 4, -.4, 'smug'); cam(V(0, 3.6, 10 - p), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: '1,6 % : ASSEZ OU BLAGUE ?'}; },
  end_card(t, p){ S0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
