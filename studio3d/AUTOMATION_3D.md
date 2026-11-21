# Automatisation quotidienne : studio 3D « Le Capitaine Raconte »

Ce fichier est le mode d'emploi suivi par la session automatique quotidienne.
Le propriétaire ne veut **rien faire** : tu travailles seul, sans demander d'autorisation.
Tu termines toujours par un rapport court en français.

## 0. Installation (container neuf)

```bash
cd capitaine-raconte
npm install --no-audit --no-fund
apt-get install -y fonts-inter fonts-noto-color-emoji || true
```

Outils déjà présents : python3, numpy, Pillow, ffmpeg, Chromium et Playwright.

## 1. Choisir le sujet (3 vidéos par jour, deux formats)

Chaque déclenchement fabrique **une seule** vidéo, avec le format et le créneau indiqués par le message de déclenchement. Les sujets se trouvent dans `studio3d/stories/QUEUE_3D.md`, qui contient deux listes. Prends la première ligne non cochée de la bonne liste, puis coche-la (`[x]`) avec la date.

**Format VRAI : « Dans cette ville… et c'est vrai » (documentaire animé)**
- Sujets : villes ou villages réels aux règles absurdes, ou histoires vraies incroyables (mer, guerre, sous-marins, mystères).
- Style du modèle `src/village_assets.js` et `src/village_shots.js` (épisode Sarpourenx) :
  - effet maquette (tilt-shift), lumière dorée, grain de film ;
  - titres façon documentaire en serif : lieu et région (`lower`), date (`date`), « C'EST VRAI. » (`vrai`), `recon` sur les documents reconstitués, carte de fin `brand` ;
  - personnages vus de dos ou en figurines, jamais le visage d'une vraie personne.
- Copie et adapte ces fichiers pour chaque lieu : décor, architecture locale, paysage.
- **Faits vérifiés sur le web**, sans rien inventer. Accroche choc, puis « C'est vrai. » au début.
- Légende : finir par la source principale et « #danscetteville #cestvrai ».

**Format VILLE : « Dans cette ville… » (satire débile, PAS de « c'est vrai »)**
- Sujets : villes fictives absurdes, souvent politiques (LFI, Lisnard, écolos, etc.), toujours avec humour.
- Moteur : la ville-jouet (`src/town_assets.js`) et les épisodes existants (`melen_*`, `gluck_*`, `choco_*`, `lisnard_*`).
- Ajoute « (Fiction humoristique.) » dans la légende.

## 2. Règles d'écriture (TRÈS IMPORTANT)

**LIGNE ÉDITORIALE (22/11, demande du propriétaire) : vidéos PROVOCANTES qui font réagir.** Les 3 vidéos du jour sont toutes des satires politiques ou de société, au format VILLE. Chacune doit pousser à commenter :
- sujets clivants : retraites, impôts, 49.3, vélo contre voiture, Paris contre province, influenceurs à Dubaï, etc. ;
- personnalités et partis caricaturés à partir de vraies références ;
- fin sur une question qui divise, par exemple « Et toi, tu vivrais dans cette ville ? », « Team A ou team B ? » ;
- légende et premier commentaire qui posent la même question.
Limites qui protègent les comptes :
- on se moque des politiques, des partis, des mesures et des clichés de société, JAMAIS d'un groupe pour son origine, sa religion, son genre ou son orientation ;
- aucune fausse citation ;
- aucune fausse information présentée comme vraie.

**Ce qui marche (stats Instagram du 21/11) :** Glucksmann a fait 15 286 vues et 1 208 partages, contre 1 800 à 3 800 vues pour les autres. La raison : un humour bâti sur de **vraies références reconnaissables**. Le jeu de mots glucides/Glucksmann, le matcha au lait d'avoine, le « cap clair », le débat pain au chocolat/chocolatine. Les gens partagent quand ils reconnaissent la référence.

- **Épisodes VILLE :** au moins **3 vraies références** sur la personnalité, le parti ou le sujet, par exemple :
  - clichés connus de ses électeurs ;
  - thèmes ou slogans associés, paraphrasés, jamais attribués comme citation ;
  - jeux de mots sur le nom ;
  - sujets d'actualité ;
  - débats et mèmes français (chocolatine, Parisiens, trottinettes, matcha, vélo…).
  Le tout est poussé jusqu'à l'absurde avec une logique.
- **Épisodes VRAI :** les faits restent exacts, avec des touches d'humour dans la narration.
- **Titres et légendes :** mets la référence en avant dès la première ligne, avec le nom ou le cliché.

- **L'histoire doit avoir du sens.** C'est le reproche principal des spectateurs. Structure obligatoire :
  - une règle absurde mais claire (« dans cette ville, … ») ;
  - 3 ou 4 exemples qui montrent la règle ;
  - un élément déclencheur, en général « moi » (le perso au sweat orange `me`) ;
  - une escalade **logique**, conséquence directe de ce qui précède ;
  - une chute qui découle de la règle.
- Chaque épisode « ville » se termine par un **teaser de partie 2**. Ajoute cette partie 2 en tête de `QUEUE_3D.md` pour la faire bientôt.
- **Humour :** satire de personnalités publiques OK, mais aucune fausse citation attribuée à une vraie personne. Les phrases dans les bulles viennent de personnages fictifs (le maire, etc.). Aucun ressemblant physique d'une vraie personne. Rien de haineux envers un groupe (origine, religion…).
- **Histoires vraies :**
  - vérifie les faits sur le web, n'invente rien ;
  - ouvre sur une accroche choc dès la première phrase.
- **Durée :**
  - viser **60 à 75 s** (≈ 850 à 1 000 caractères de voix), parce que TikTok ne rémunère que les vidéos de plus d'une minute ;
  - un plan toutes les ~2 s, avec 2 ou 3 plans par phrase.
  - **Règle de rythme :** nombre de plans ≥ durée de la voix / 2,6. Pour 55 s, il faut au moins 21 plans. `build3d.py` affiche « moy. X s » : au-dessus de 2,8 s, arrête le rendu, ajoute des plans (la voix reste en cache) et relance.

## 3. Fabriquer l'épisode

Inspire-toi des épisodes existants : `src/melen_*`, `src/gluck_*`, `src/choco_*`, `src/lisnard_*`.

1. Écris `studio3d/stories/<id>.json`. Copie la structure de `ville_lisnard.json` :
   - `film`, `title1`, `title2`, `resolve_shot` ;
   - `caption` : `{"color":"#f2ff4d","y":1390,"size":92,"stroke":16}` ;
   - `thumb` : miniature putaclic, 3 lignes dont une surlignée, un emoji, une flèche ;
   - `beats` : `[{say, shots[], chip:null}]`.
2. Écris `src/<id>_assets.js` (décors, objets, personnages) et `src/<id>_shots.js` (un objet `SHOTS` : `nom(t, p) { …; cam(...); return {fx} }`).

   Effets d'overlay disponibles :
   - `stamp: 'TEXTE'` ;
   - `bubble: 'TEXTE'` ;
   - `alarmFx: true` avec `alarmText` ;
   - `tease: true` avec `teaseA` / `teaseB` ;
   - `endcard: true` ;
   - `chipOverride` ;
   - `flashW` ;
   - `dark`.
3. Assemble le film :

   ```bash
   cd studio3d
   python3 assemble.py film_<id>.html town_assets.js [autres_assets.js] <id>_assets.js <id>_shots.js
   ```

   - `paris_assets.js` apporte la douane, le détecteur, les gardes, le boulanger, la terrasse de café et une foule colorée.
   - `melen_assets.js` apporte le maire, le podium et le yacht.
4. **Aperçu obligatoire.** Le 3e argument doit être un **nombre** :

   ```bash
   node preview.js stories/<id>.json /tmp/prev .6
   ```

   Fais une planche-contact et regarde-la. Corrige tant qu'il reste un défaut :
   - caméra dans un mur, une tête ou un poteau ;
   - personnage qui cache le sujet ;
   - objet hors champ ;
   - image trop sombre.

   Repères de la ville :
   - route principale sur x = 0 (voies à x ±2.4), trottoirs à x ±7.5 ;
   - maisons à x ±20, arbres et palmiers à x ±11, lampadaires à x ±5.6 ;
   - route transversale et carrefour à z = -40.
5. Rendu (≈ 30 min pour 60 s) :

   ```bash
   cd .. && python3 -u studio3d/build3d.py <id>
   ```

   - Le script produit `videos/<id>.mp4` et `videos/<id>_cover.jpg`.
   - Contrôle 6 à 8 images extraites de la vidéo finale avec ffmpeg, plus la miniature.
6. Quota de voix : vérifie-le **avant** le rendu.

   ```bash
   curl -s https://api.elevenlabs.io/v1/user/subscription -H "xi-api-key: proxy-injected"
   ```

   La clé est injectée par le proxy. Si `character_limit - character_count` est inférieur au texte à générer :
   - ne génère rien ;
   - prépare quand même la 3D et l'aperçu, puis commite ;
   - signale « quota ElevenLabs insuffisant » dans le rapport.

## 4. Publier

1. Commit et push sur `main`.
   - Identité : `git -c user.name="victormoreaudejaeck-eng" -c user.email="victormoreaudejaeck-eng@users.noreply.github.com" commit ...`
   - Termine le message par les lignes d'attribution demandées par la session.
2. Programme via le connecteur **Metricool** (blogId `8227518`, fuseau `Europe/Rome`).
   - Médias : URLs GitHub raw **épinglées sur le commit**, par exemple `https://raw.githubusercontent.com/victormoreaudejaeck-eng/capitaine-raconte/<sha>/videos/<id>.mp4`.
   - **Heure :** le créneau donné par le message de déclenchement (heure de Paris). S'il est déjà pris, utilise +30 min. Vérifie avec `getScheduledPosts`.
   - **Post Instagram (REEL) :**
     - `videoThumbnailUrl` = la miniature `_cover.jpg` ;
     - légende courte et accrocheuse, plus « (Fiction humoristique.) » pour les épisodes ville ;
     - 6 à 8 hashtags ;
     - un premier commentaire qui pose une question pour faire réagir.
   - **Post YouTube (`type: short`) :**
     - pas de `videoThumbnailUrl` (sinon c'est rejeté) ;
     - titre accrocheur qui finit par `#shorts`, avec des tags ;
     - catégorie COMEDY (ville) ou EDUCATION (histoire vraie) ;
     - `madeForKids: false`.
   - **TikTok : NE RIEN PUBLIER** (demande du propriétaire, jusqu'à nouvel ordre). Instagram et YouTube uniquement.
   - **Interdit dans les légendes :** la mention « ElevenLabs » ou « voix IA » (demande du propriétaire).
   - `isAiGenerated` (Instagram) et `isAiGeneratedContent` (YouTube) = `false`, demande du propriétaire.
3. En cas d'erreur ou de redémarrage pendant un appel Metricool : vérifie d'abord avec `getScheduledPosts` avant de réessayer, pour éviter les doublons.

## 5. Rapport final (en français, court)

Indique :
- le sujet ;
- la durée ;
- l'heure de publication par plateforme ;
- les liens Metricool ;
- le lien GitHub de la vidéo ;
- le quota ElevenLabs restant ;
- les problèmes éventuels ;
- la prochaine vidéo prévue.
