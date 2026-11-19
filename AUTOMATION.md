# Procédure automatique — une nouvelle vidéo « Le Capitaine Raconte »

Exécutée par la tâche programmée (2 fois par semaine). Tout se fait sans intervention humaine.
Le propriétaire peut annuler une publication dans Metricool jusqu'à 19 h : la vidéo est donc programmée
le jour même à 19 h (heure de Paris), jamais publiée immédiatement.

## 0. Préparer
- Le dépôt est `victormoreaudejaeck-eng/capitaine-raconte` (branche `main`). Travailler dedans.
- Outils déjà présents dans le conteneur : python3, numpy, node + playwright (chromium), ffmpeg.
- La clé ElevenLabs est injectée par le proxy pour `api.elevenlabs.io` (header `xi-api-key`) : ne jamais demander de clé.
- Vérifier le quota : `curl -sS https://api.elevenlabs.io/v1/user/subscription` → `character_limit - character_count`.
  S'il reste moins de 2 500 caractères : NE PAS utiliser une autre voix. Arrêter, ne rien publier, et le dire dans le rapport final
  (il faut passer au plan ElevenLabs Starter).

## 1. Choisir l'histoire
- Première ligne non cochée de `stories/QUEUE.md`. Son identifiant (ex. `maryceleste`) = nom du dossier et préfixe des scènes.

## 2. Vérifier les faits
- Rechercher sur le web (WebSearch) les dates, chiffres, noms. Ne garder que des faits confirmés par plusieurs sources.
  En cas de doute sur un chiffre, formuler prudemment (« près de », « environ ») ou le retirer.

## 3. Écrire le script : `stories/<id>/scenes.json`
- Même format que `stories/lusitania/scenes.json` : `{"ship": {...}, "scenes": [...]}`.
- 11 à 14 scènes, 1 700 à 2 300 caractères de `say` au total (vidéo entre 2 min et 2 min 50 — max 3 min pour YouTube Shorts).
- Scène 1 = ACCROCHE CHOC : un chiffre ou un fait incroyable dans les 3 premières secondes, puis le titre. Jamais d'intro lente.
- `say` : texte lu par la voix, nombres écrits en toutes lettres. `show` : sous-titres, avec chiffres.
- `counter` en haut de l'écran à chaque scène (heure, date, compteur de chiffre clé…).
- Dernière scène : conclusion marquante + « Abonne-toi pour la prochaine histoire ! » (+ carte ABONNE-TOI à l'écran).
- Ton : conteur captivant, phrases courtes, suspense, pas de vulgarité, respectueux des victimes.

## 4. Dessiner les scènes : `anim.html`
- Ajouter une fonction par scène dans `const SC = {` (ids préfixés `<id>_`), et les nouveaux décors/objets en fonctions d'aide.
- GARDER LA DIRECTION ARTISTIQUE : cartoon 2D, contours épais `INK`, couleurs vives, personnages `person()` avec visages,
  mer `sea()`, ciels `nightSky()`/`daySky()`, `burst()` pour les chocs, `outlinedText()` pour les gros textes, compteur + sous-titres auto.
- Réutiliser au maximum les éléments existants (navires via `drawShip` + `ship` du JSON, `lifeboat`, `submarine`, `newspaper`,
  `iceberg`, `underwater`, `waterColumn`, `flares`…). Un nouveau type de navire (voilier…) = nouvelle fonction de dessin dans le même style.
- Les éléments importants doivent rester entre y=300 et y=1400 (les sous-titres sont vers y=1530, le compteur en haut).

## 5. Vérifier visuellement AVANT de générer la voix
- Rendre 2 images par scène (p=0.4 et p=0.85) avec playwright (voir `drawFrame(t)` / `setScenes`) et les regarder (outil Read sur les PNG).
- Corriger : erreurs JS, éléments hors cadre, texte qui chevauche les sous-titres, scène vide ou incohérente.

## 6. Fabriquer la vidéo
- `python3 build.py <id>` (≈ 10 min ; lancer en arrière-plan). Voix = Brian (déjà configurée), coupure auto des parasites en fin de phrase.
- Vérifier : durée ≤ 2 min 58 (`ffprobe`), pas d'erreur, quelques images extraites de `videos/<id>.mp4` regardées.

## 7. Envoyer sur GitHub
- `git add stories/<id> anim.html videos/<id>.mp4 stories/QUEUE.md` (cocher l'histoire dans QUEUE.md avec la date), commit, `git push origin main`.
- URL de la vidéo pour Metricool : `https://raw.githubusercontent.com/victormoreaudejaeck-eng/capitaine-raconte/main/videos/<id>.mp4`

## 8. Programmer sur les 3 plateformes (Metricool, blogId `8227518`, fuseau `Europe/Rome` = heure de Paris)
- Date : AUJOURD'HUI à 19:00:00. (Si la tâche tourne après 18 h, programmer le lendemain 19 h.)
- 1 post YouTube : `providers [youtube]`, `youtubeData: {title: "<accroche courte> <emoji> #shorts", type: "short", privacy: "public",
  tags: [...], category: "EDUCATION", madeForKids: false, isAiGeneratedContent: true}`, texte = description + hashtags + `#shorts`.
- 1 post TikTok + Instagram : `providers [tiktok, instagram]`, `tiktokData: {title: "<accroche>", privacyOption: "PUBLIC_TO_EVERYONE", isAigc: true}`,
  `instagramData: {type: "REEL", showReelOnFeed: true, isAiGenerated: true}`, `firstCommentText: "Quelle histoire je raconte ensuite ? ⚓"`.
- Légende : accroche choc en 1 phrase + emoji, question qui fait commenter + 👇, puis 4 à 6 hashtags :
  base `#histoirevraie #naufrage #histoire` + tag de l'histoire + 1 ou 2 parmi `#culturegenerale #lesaviezvous #mystere #mer #bateau #apprendresurtiktok`.
- Tant que le compte ElevenLabs est en plan gratuit (`tier: free`), terminer chaque légende par `Voix : ElevenLabs`.
- Vérifier avec `getScheduledPosts` que les 2 posts sont bien PENDING à la bonne date.

## 9. Rapport final (court, en français)
- Histoire traitée, durée, heure de publication, liens Metricool, quota ElevenLabs restant, et tout problème rencontré.
