
// ===================== Bernard vs la taxe Zucman : plans =====================
const cloudsMove = t => clouds.children.forEach(c => { c.position.x = ((c.userData.x0 ?? (c.userData.x0 = c.position.x)) + t * 3) % 500 - 250; });
const Z0 = (...x) => { mLook(); only(sky, town, clouds, ...x); disguise.visible = false; rich.scale.setScalar(1); };
function place(p, x, z, ry = 0, mood){ bRest(p); p.position.set(x, 0, z); p.rotation.set(0, ry, 0); if (mood) bMood(p, mood); }
function face(p, x, z){ p.rotation.y = Math.atan2(x - p.position.x, z - p.position.z); }
const SHOTS = {
  rich_return(t, p){ Z0(rich); place(rich, -2, 10 - p * 4, Math.PI, 'smug'); bWalk(rich, t, .8); cam(V(3, 3.6, -1 - p * 3), V(-2, 3, 8 - p * 4), 40); sunFollow(V(-2, 0, 6)); return {chipOverride: '👀 LE RETOUR DE BERNARD'}; },
  mayor_vote(t, p){ Z0(podium, mayor, ...reds); place(mayor, 0, -14.4, 0, 'happy'); mayor.position.y = 1; mayor.userData.armR.rotation.x = -2.6 + Math.sin(t * 6) * .2;
    reds.forEach((c, i) => { place(c, -6 + (i % 4) * 4, -6 + Math.floor(i / 4) * 3, Math.PI, 'happy'); const j = Math.abs(Math.sin(t * 8 + i)); c.position.y = j * .4; c.userData.armR.rotation.x = -2.8; });
    cam(V(5, 10, 8), V(0, 3.6, -13), 44); sunFollow(V(0, 0, -10)); return {bubble: 'TAXE ZUCMAN ADOPTÉE !'}; },
  tax_board_wide(t, p){ Z0(taxBoard, concerned); taxBoard.position.set(-7.6, 0, 6); taxBoard.rotation.y = Math.PI / 2; taxBoard.scale.setScalar(.62); concerned.visible = false; cam(V(2.2 - p, 3.6, 7.5), V(-7.6, 3.4, 6), 44); sunFollow(V(-7, 0, 6)); return {}; },
  tax_board_close(t, p){ Z0(taxBoard, concerned); taxBoard.position.set(-7.6, 0, 6); taxBoard.rotation.y = Math.PI / 2; taxBoard.scale.setScalar(.62); concerned.position.set(-7.5, 1.2, 6.4); concerned.scale.setScalar(.8); concerned.rotation.set(0, Math.PI / 2, .1); concerned.visible = p > .3;
    cam(V(-1.2, 2.9, 7), V(-7.6, 2.6, 6.3), 42); sunFollow(V(-7, 0, 6)); return {}; },
  rich_shock(t, p){ Z0(rich); place(rich, 0, 4, 0, 'shock'); cam(V(.2, 3.5, 7.4 - p * .5), V(0, 3.3, 4), 36); sunFollow(V(0, 0, 4)); return {}; },
  rich_plan(t, p){ Z0(rich); place(rich, 0, 4, .3, 'smug'); rich.userData.armR.rotation.x = -2.0; rich.userData.head.rotation.z = .1; cam(V(1.5, 3.6, 10 - p), V(0, 3, 4), 40); sunFollow(V(0, 0, 4)); return {bubble: 'PLAN : AVOIR L\'AIR PAUVRE'}; },
  rich_disguise(t, p){ Z0(rich); place(rich, 0, 4, 0, 'happy'); disguise.visible = true; rich.rotation.y = Math.sin(t * 2) * .4; cam(V(0, 3.4, 9.5 - p), V(0, 2.8, 4), 40); sunFollow(V(0, 0, 4)); return {stamp: 'DÉGUISÉ EN PAUVRE'}; },
  watch_swap(t, p){ Z0(watchA, plasticWatch); const k = Math.min(1, p * 2.2); watchA.position.set(-.8 + k * -1.5, 3.1, 2.2); watchA.rotation.set(0, .3, .2); watchA.visible = k < 1; plasticWatch.position.set(1.5 - k * 1.5, 3.1, 2.4); plasticWatch.rotation.set(0, -.2 + Math.sin(t * 2) * .2, -.2);
    cam(V(0, 3.3, 6.8), V(0, 3.0, 2.2), 36); sunFollow(V(0, 0, 2)); return {}; },
  pedalo_trailer(t, p){ Z0(pedalo, rich); pedalo.position.set(-1.2, .3, -2); pedalo.rotation.y = .5; place(rich, 3.4, .5, -.8, 'happy'); disguise.visible = true; cam(V(5 - p, 4.2, 9.5), V(.2, 1.6, -1.4), 42); sunFollow(V(0, 0, 0)); return {stamp: 'ÉCHANGÉ'}; },
  ferrari_soup(t, p){ Z0(soup, ferrari, rich); ferrari.position.set(2.2, 0, 34 - p * 6); ferrari.rotation.y = Math.PI; place(rich, 3.6, 22, Math.PI / 2, 'happy'); disguise.visible = true; rich.visible = p > .6;
    cam(V(-4, 3.4, 18), V(3, 1.6, 27), 42); sunFollow(V(4, 0, 26)); return {}; },
  soup_queue(t, p){ Z0(soup, ferrari, rich, ...reds.slice(0, 4)); ferrari.position.set(1.8, 0, 32); ferrari.rotation.y = Math.PI; place(rich, 3.6, 26, Math.PI / 2, 'smug'); disguise.visible = true;
    reds.slice(0, 4).forEach((c, i) => { place(c, 3.4, 28.4 + i * 2, Math.PI, 'side'); face(c, 3.6, 26); }); cam(V(-2.5, 4.4, 20.5), V(4, 2.4, 28), 42); sunFollow(V(4, 0, 27)); return {}; },
  inspector_arrives(t, p){ Z0(inspector, rich); place(inspector, -1, 12 - p * 5, Math.PI, 'smug'); bWalk(inspector, t, .7); place(rich, -1, 2, 0, 'scared'); disguise.visible = true; cam(V(4, 3.2, -3), V(-1, 2.6, 6), 40); sunFollow(V(-1, 0, 6)); return {}; },
  rich_pleads(t, p){ Z0(inspector, rich); place(inspector, .95, 5, -Math.PI / 2 + .35, 'smug'); place(rich, -.95, 5, Math.PI / 2 - .35, 'scared'); disguise.visible = true; rich.userData.armL.rotation.x = rich.userData.armR.rotation.x = -1.6 + Math.sin(t * 8) * .2;
    cam(V(0, 3.4, 13), V(0, 2.8, 5), 36); sunFollow(V(0, 0, 5)); return {bubble: 'J\'AI PLUS UN CENTIME !'}; },
  gold_pedalo(t, p){ Z0(goldPedalo); goldPedalo.position.set(0, .9, 0); goldPedalo.rotation.y = t * .4; cam(V(7, 4.6, 9), V(0, 1.4, 0), 40); sunFollow(V(0, 0, 0)); return {stamp: 'OR MASSIF'}; },
  inspector_glasses(t, p){ Z0(inspector); place(inspector, 0, 4, 0, 'side'); inspector.userData.head.rotation.x = .2; cam(V(.3, 3.6, 7.8 - p * .5), V(0, 3.3, 4), 36); sunFollow(V(0, 0, 4)); return {}; },
  pay_stamp(t, p){ Z0(rich, inspector); place(rich, -.95, 5, Math.PI / 2 - .35, 'scared'); place(inspector, .95, 5, -Math.PI / 2 + .35, 'happy'); disguise.visible = true; cam(V(0, 3.6, 13), V(0, 2.8, 5), 36); sunFollow(V(0, 0, 5)); return {stamp: '2 % PAYÉS'}; },
  rich_leaves(t, p){ Z0(rich, suitcase); place(rich, 0, -4 - p * 10, Math.PI, 'neutral'); bWalk(rich, t, .8); rich.updateMatrixWorld(true); suitcase.position.copy(rich.localToWorld(V(1.0, 1.0, 0))); cam(V(2, 3.4, 8 - p * 8), V(0, 2.4, -10 - p * 10), 42); sunFollow(V(0, 0, -8)); return {}; },
  border_sign(t, p){ Z0(border, rich, suitcase); border.position.set(-5.6, 0, -34); border.rotation.y = 0; place(rich, -2.4, -32 + p * 2, 0, 'smug'); suitcase.position.set(-1.4, .4, -32 + p * 2);
    cam(V(-3.5, 3, -24), V(-4.5, 2.6, -34), 40); sunFollow(V(-4, 0, -34)); return {}; },
  vote_split(t, p){ Z0(...reds, ...voteSigns); reds.forEach((c, i) => { const pour = i % 2 === 0; place(c, (pour ? -1 : 1) * (2.4 + Math.floor(i / 2) * 1.6), 4 - (i % 4 < 2 ? 0 : 1.6), pour ? .4 : -.4, pour ? 'happy' : 'angry'); c.userData.armR.rotation.x = -2.6 + Math.sin(t * 6 + i) * .2; });
    voteSigns[0].position.set(-4.5, 0, 1.6); voteSigns[1].position.set(4.5, 0, 1.6); cam(V(0, 7, 27 - p), V(0, 2.6, 2), 46); sunFollow(V(0, 0, 3)); return {bubble: 'POUR OU CONTRE ?'}; },
  end_card(t, p){ Z0(); cloudsMove(t); cam(V(40 + p * 10, 50, 70), V(0, 0, 0), 40); sunFollow(V(0, 0, 0)); return {endcard: true}; },
};
