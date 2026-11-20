# Développement Roblox

## Outils (dans la session cloud de Claude)
Installer : `bash tools/install-roblox-tools.sh` (≈20 s)

| Outil | Rôle |
|---|---|
| Rojo | synchronise les fichiers `.luau` du dépôt avec Roblox Studio |
| Wally | gestionnaire de paquets Roblox |
| Selene | linter (détecte les erreurs) |
| StyLua | formatage du code |
| Lune | exécute du Luau hors de Studio (tests de la logique pure) |
| luau-lsp + globalTypes | vérification des types avec l'API Roblox |

## Plugins Claude actifs
- **roblox-dev** : architecture, sécurité des remotes, DataStores, performance, UI, tests, typage strict
- **Game Trend Skills** : idées de jeux, tendances, métriques, lancement à petit budget

## Façon de travailler
1. Claude écrit le jeu en fichiers dans ce dépôt (projet Rojo), le vérifie (lint, types, tests Lune) et pousse sur GitHub.
2. Sur ton ordinateur : `git pull`, puis `rojo serve`, et dans Studio le plugin Rojo → *Connect*. Le code apparaît dans Studio.
3. Tu testes dans Studio (Play) et tu me dis ce qui ne va pas.

Pour que Claude pilote Studio directement (créer des pièces, lancer le jeu, lire la console),
il faut le **Roblox Studio MCP** sur ton ordinateur et brancher cet ordinateur à la session.
