# Grand Large — notes pour Claude

## Qui est l'utilisateur
- Débutant complet en développement, parle français. Il veut que Claude fasse TOUT à sa place.
- Explique en phrases très simples, une étape à la fois, sans jargon (pas de "MCP", "API", "PATH"… sans explication).
- Il est sur Mac (MacBook Air), Roblox Studio installé, option MCP activée dans Studio.

## Le projet
Jeu de régate à la voile Roblox (inspiré du genre des jeux de voile en ligne, designs 100 % originaux).
Tout est déjà codé et testé hors Studio : voir `README.md`.
- Code Luau géré par Rojo (`default.project.json`), fichier prêt : `build/GrandLarge.rbxl`.
- Moteur de voile pur dans `src/shared/Sailing` (tests : `lune run tests/run`, 37 tests OK).
- Serveur : `src/server/Systems` · Client : `src/client/Controllers`.
- IDs Robux (Game Passes / Developer Products) encore à 0 dans `src/shared/Shop/Catalog.luau`.

## Prochaines étapes (session locale sur le Mac)
1. Installer les outils si besoin (Rojo ; sur Mac : via Rokit `rokit install`, ou binaires des releases GitHub).
2. Se brancher à Roblox Studio via son serveur MCP et vérifier qu'on voit Studio.
3. Ouvrir le jeu dans Studio (ouvrir `build/GrandLarge.rbxl`, ou `rojo serve` + plugin Rojo → Connect).
4. Lancer Play, lire la sortie (Output) et corriger les erreurs d'exécution : le code n'a encore
   jamais tourné dans Studio (vérifié seulement par types, build Rojo et tests Lune).
5. Ensuite : réglages visuels (bateaux, eau, caméra), puis publication et création des Game Passes.
