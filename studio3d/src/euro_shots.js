
// ===================== Le Pen partie 2 : plans =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const L0 = (...x) => { townLook(); only(sky, town, clouds, ...x); bakery.position.set(-22, 0, 30); bakery.rotation.y = Math.PI / 2; };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
citizens.slice(0, 12).forEach(c => { const b = badgeOn(c, 2.55, .45, .62); b.position.x = .34; });
function boardShot(k, t, p, extra = []){ L0(dayBoard, ...extra); setDay(k); dayBoard.position.set(0, 0, -2); dayBoard.rotation.y = 0; cam(V(.3, 4.2, 9.8 - p * .6), V(0, 4.1, -2), 42); sunFollow(V(0, 0, 0)); }
function pile(list, x, z, y0 = 0, spread = .0){ list.forEach((c, i) => { c.position.set(x + (i % 2) * spread, y0 + .05 + i * .085, z); c.rotation.set(0, i * .5, 0); }); }
const SHOTS = {
  town_wide2(t, p){ L0(...citizens.slice(0, 10), ...cars); cloudsMove(t); citizens.slice(0, 10).forEach((c, i) => { place(c, (i % 2 ? 7.4 : -7.4), -30 + ((i * 7 + t * 2.4) % 50), i % 2 ? Math.PI : 0, 'side'); bWalk(c, t + i, .9); });
    cars.forEach((c, i) => { c.position.set(i % 2 ? 2.4 : -2.4, 0, -60 + ((t * 8 + i * 30) % 120)); c.rotation.y = i % 2 ? Math.PI : 0; }); cam(V(lerp(30, 18, p), lerp(40, 26, p), 50), V(0, 2, -10), 42); sunFollow(V(0, 0, 0)); return {chipOverride: '🇫🇷 VILLE DE MARINE · PARTIE 2'}; },
  marine_hi(t, p){ L0(podium, marine); place(marine, 0, -14.4, 0, 'smug'); marine.position.y = 1; marine.userData.armR.rotation.x = -2.6 + Math.sin(t * 4) * .2; cam(V(1, 4.6, -8.5 + p * .5), V(0, 4.3, -14.4), 38); sunFollow(V(0, 0, -12)); return {}; },
  calendar(t, p){ L0(dayBoard, ...coins.slice(0, 20)); const ks = ['lundi', 'mardi', 'mercredi', 'jeudi']; setDay(ks[Math.min(3, Math.floor(p * 4))]); dayBoard.position.set(0, 0, -2); dayBoard.rotation.y = 0;
    coins.slice(0, 20).forEach((c, i) => { const ph = (t * .6 + i * .05) % 1; c.position.set(-3 + (i * 1.7) % 6, 8 - ph * 8, 1 + (i % 3)); c.rotation.set(t * 3 + i, i, t * 2); }); cam(V(0, 4.4, 9 - p), V(0, 4.0, -1), 44); sunFollow(V(0, 0, 0)); return {stamp: 'CHAQUE MATIN'}; },
  board_lundi(t, p){ boardShot('lundi', t, p); return {}; },
  franc_coins(t, p){ L0(baker, ...coinsOf('F'), registers); registers.position.set(0, 0, 3); registers.rotation.y = 0; place(baker, 0, 1.6, 0, 'happy'); pile(coinsOf('F').slice(0, 7), -.4, 3.5, 1.2); coinsOf('F').slice(7).forEach((c, i) => { c.position.set(.6 + i * .5, 1.25, 3.7); c.rotation.set(0, 0, 0); });
    cam(V(.4, 4.2, 10 - p * .6), V(0, 2.9, 2.6), 40); sunFollow(V(0, 0, 3)); return {chipOverride: '🇫🇷 LE FRANC'}; },
  board_mardi(t, p){ boardShot('mardi', t, p); return {}; },
  two_registers(t, p){ L0(registers, baker); registers.position.set(0, 0, 3); registers.rotation.y = 0; place(baker, 0, 1.6, 0, 'scared'); baker.userData.head.rotation.y = Math.sin(t * 4) * .5; cam(V(0, 4.2, 10.5 - p * .6), V(0, 2.9, 2.6), 42); sunFollow(V(0, 0, 3)); return {stamp: 'DEUX CAISSES'}; },
  baker_confused(t, p){ L0(baker, citizens[0]); place(baker, -1, 4, .4, 'scared'); place(citizens[0], 1, 4, -.4, 'side'); cam(V(0, 3.6, 10 - p), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'UN ÉCU ? POUR UNE BAGUETTE ?'}; },
  board_mercredi(t, p){ boardShot('mercredi', t, p); return {}; },
  queue_exchange(t, p){ L0(changeBooth, ...citizens.slice(0, 9)); changeBooth.position.set(0, 0, -3); changeBooth.rotation.y = 0; citizens.slice(0, 9).forEach((c, i) => { place(c, Math.sin(i * 1.3) * .4, 0 + i * 2.0, Math.PI, 'scared'); c.position.y = Math.abs(Math.sin(t * 6 + i)) * .12; }); cam(V(9, 7, 19 - p), V(0, 2.4, 1), 44); sunFollow(V(0, 0, 3)); return {chipOverride: '💱 TOUT LE MONDE RACHÈTE DES EUROS'}; },
  board_jeudi(t, p){ boardShot('jeudi', t, p); return {stamp: 'ON VERRA'}; },
  price_board(t, p){ L0(priceBoard, bakery); priceBoard.position.set(-15.2, 2.6, 30); priceBoard.rotation.y = Math.PI / 2; cam(V(-9.4 + p * .4, 2.7, 30.2), V(-15.2, 2.6, 30), 40); sunFollow(V(-15, 0, 30)); return {}; },
  barter(t, p){ L0(baker, citizens[1], ...barterC.slice(0, 4), registers); registers.position.set(0, 0, 3); registers.rotation.y = 0; place(baker, 0, 1.6, 0, 'happy'); place(citizens[1], .3, 6, Math.PI, 'happy'); citizens[1].userData.armR.rotation.x = -1.4;
    barterC.slice(0, 4).forEach((c, i) => c.position.set(-1.2 + i * .8, 1.3, 3.6 + Math.max(0, 1 - p * 2) * 1.2)); cam(V(4, 4, 9 - p * .5), V(0, 2.2, 3.5), 42); sunFollow(V(0, 0, 3)); return {stamp: 'PAYÉ EN CROISSANTS'}; },
  barter_close(t, p){ L0(citizens[2], ...barterC.slice(0, 6)); place(citizens[2], 0, 4, 0, 'happy'); citizens[2].userData.armR.rotation.x = citizens[2].userData.armL.rotation.x = -1.3; barterC.slice(0, 6).forEach((c, i) => { c.position.set(-.4 + (i % 2) * .8, 2.3 + Math.floor(i / 2) * .22, 4.9); c.rotation.set(0, i, 0); });
    cam(V(.3, 3.2, 9 - p * .5), V(0, 2.8, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'LOYER PAYÉ EN CROISSANTS'}; },
  cat_counts(t, p){ L0(cat, ...envs.slice(0, 8)); cat.position.set(0, 0, 4); cat.rotation.y = 0; cat.userData.tail.rotation.z = Math.sin(t * 3) * .4; envs.slice(0, 8).forEach((e, i) => { e.position.set(-1.6 + (i % 2) * 3.2, .05 + Math.floor(i / 2) * .07, 4.6); e.rotation.set(0, (i % 3) * .1, 0); });
    cam(V(.4, 2.2, 9 - p * .6), V(0, 1.2, 4), 40); sunFollow(V(0, 0, 4)); return {chipOverride: '🐈 LE CHAT, ASSISTANT'}; },
  cat_close(t, p){ L0(cat, ...envs.slice(0, 1)); cat.position.set(0, 0, 4); cat.rotation.y = 0; const e = envs[0]; e.position.set(.75, .9 + Math.abs(Math.sin(t * 4)) * .1, 5.1); e.rotation.set(-1.2, 0, .3); cam(V(.2, 1.7, 7.6 - p * .4), V(0, 1.4, 4), 40); sunFollow(V(0, 0, 4)); return {stamp: 'EN EUROS'}; },
  question_eu(t, p){ L0(marine, citizens[0]); place(marine, -1, 4, .4, 'smug'); place(citizens[0], 1, 4, -.4, 'side'); cam(V(0, 3.6, 10 - p), V(0, 3.2, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'TU LUI CONFIES TES SOUS ?'}; },
  end_card(t, p){ L0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
